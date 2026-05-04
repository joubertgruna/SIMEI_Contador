import { Router } from 'express';
import * as empresaService from '../services/empresa.service';
import { UserModel } from '../models/user.model';
import { getConnection } from '../config/database.config';
import multer from 'multer';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import bcrypt from 'bcryptjs';

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos CSV são permitidos'));
    }
  }
});

const router = Router();

// TODO: Adicionar middleware de autenticação administrativa

// Atualizar status da empresa (verificar/rejeitar)
router.put('/empresas/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observacao } = req.body;

    if (!['verificado', 'rejeitado'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status deve ser "verificado" ou "rejeitado"'
      });
    }

    const empresa = await empresaService.atualizarEmpresa(parseInt(id), {
      status,
      // TODO: Adicionar campo observacao se necessário
    });

    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }

    res.json({
      success: true,
      message: `Empresa ${status === 'verificado' ? 'aprovada' : 'rejeitada'} com sucesso`,
      data: empresa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Listar empresas pendentes
router.get('/empresas/pendentes', async (req, res) => {
  try {
    const resultado = await empresaService.listarEmpresas({
      status: 'pendente',
      pagina: 1,
      limite: 50
    });

    res.json({
      success: true,
      data: resultado.empresas,
      total: resultado.total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Listar todas as empresas
router.get('/empresas', async (req, res) => {
  try {
    const { status, pagina = 1, limite = 50 } = req.query;

    const filtros: any = {
      pagina: parseInt(pagina as string),
      limite: parseInt(limite as string)
    };

    if (status) {
      filtros.status = status;
    }

    const resultado = await empresaService.listarEmpresas(filtros);

    res.json({
      success: true,
      data: resultado.empresas,
      total: resultado.total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Estatísticas administrativas
router.get('/stats', async (req, res) => {
  try {
    const stats = await empresaService.obterEstatisticas();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Listar todos os usuários
router.get('/usuarios', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT id, nome, email, cpf, telefone, tipo, ativo, data_criacao FROM usuarios ORDER BY data_criacao DESC' as any
    );
    connection.release();
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Ativar/desativar usuário
router.put('/usuarios/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { ativo } = req.body;
    const connection = await getConnection();
    await connection.execute(
      'UPDATE usuarios SET ativo = ?, data_atualizacao = NOW() WHERE id = ?' as any,
      [ativo ? 1 : 0, parseInt(id)]
    );
    connection.release();
    res.json({ success: true, message: `Usuário ${ativo ? 'ativado' : 'desativado'} com sucesso` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Deletar usuário
router.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    await connection.execute('DELETE FROM usuarios WHERE id = ?' as any, [parseInt(id)]);
    connection.release();
    res.json({ success: true, message: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Monitoramento do sistema
router.get('/monitoramento', async (req, res) => {
  try {
    const connection = await getConnection();

    const [[{ totalUsuarios }]] = await connection.execute(
      'SELECT COUNT(*) as totalUsuarios FROM usuarios' as any
    ) as any;

    const [[{ totalEmpresas }]] = await connection.execute(
      'SELECT COUNT(*) as totalEmpresas FROM empresas' as any
    ) as any;

    const [[{ verificadas }]] = await connection.execute(
      "SELECT COUNT(*) as verificadas FROM empresas WHERE status = 'verificado'" as any
    ) as any;

    const [[{ pendentes }]] = await connection.execute(
      "SELECT COUNT(*) as pendentes FROM empresas WHERE status = 'pendente'" as any
    ) as any;

    const [[{ cadastrosHoje }]] = await connection.execute(
      'SELECT COUNT(*) as cadastrosHoje FROM usuarios WHERE DATE(data_criacao) = CURDATE()' as any
    ) as any;

    const [[{ empresasHoje }]] = await connection.execute(
      'SELECT COUNT(*) as empresasHoje FROM empresas WHERE DATE(criado_em) = CURDATE()' as any
    ) as any;

    // Cadastros por mês (últimos 6 meses)
    const [porMes] = await connection.execute(
      `SELECT DATE_FORMAT(data_criacao, '%Y-%m') as mes, COUNT(*) as total
       FROM usuarios
       WHERE data_criacao >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY mes ORDER BY mes ASC` as any
    ) as any;

    // Empresas por categoria
    const [porCategoria] = await connection.execute(
      `SELECT c.nome as categoria, COUNT(e.id) as total
       FROM categorias c
       LEFT JOIN empresas e ON e.categoria_id = c.id
       GROUP BY c.id, c.nome
       ORDER BY total DESC
       LIMIT 8` as any
    ) as any;

    connection.release();

    res.json({
      success: true,
      data: {
        totalUsuarios,
        totalEmpresas,
        verificadas,
        pendentes,
        cadastrosHoje,
        empresasHoje,
        porMes,
        porCategoria,
      }
    });
  } catch (error) {
    console.error('Erro monitoramento:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Editar empresa completa
router.put('/empresas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      razao_social, nome_fantasia, cnpj, endereco, bairro, cidade, estado, cep,
      telefone, email_empresa, website, instagram, descricao_servico,
      ramo_atuacao, categoria_id, status, logo_url,
    } = req.body;

    const connection = await getConnection();
    await connection.execute(
      `UPDATE empresas SET
        razao_social = COALESCE(?, razao_social),
        nome_fantasia = COALESCE(?, nome_fantasia),
        cnpj = COALESCE(?, cnpj),
        endereco = COALESCE(?, endereco),
        bairro = COALESCE(?, bairro),
        cidade = COALESCE(?, cidade),
        estado = COALESCE(?, estado),
        cep = COALESCE(?, cep),
        telefone = COALESCE(?, telefone),
        email_empresa = COALESCE(?, email_empresa),
        website = COALESCE(?, website),
        instagram = COALESCE(?, instagram),
        descricao_servico = COALESCE(?, descricao_servico),
        ramo_atuacao = COALESCE(?, ramo_atuacao),
        categoria_id = COALESCE(?, categoria_id),
        status = COALESCE(?, status),
        logo_url = COALESCE(?, logo_url),
        atualizado_em = NOW()
      WHERE id = ?` as any,
      [
        razao_social ?? null, nome_fantasia ?? null, cnpj ?? null,
        endereco ?? null, bairro ?? null, cidade ?? null, estado ?? null, cep ?? null,
        telefone ?? null, email_empresa ?? null, website ?? null, instagram ?? null,
        descricao_servico ?? null, ramo_atuacao ?? null, categoria_id ?? null,
        status ?? null, logo_url ?? null,
        parseInt(id),
      ]
    );
    connection.release();
    res.json({ success: true, message: 'Empresa atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao editar empresa:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Excluir empresa
router.delete('/empresas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    await connection.execute('DELETE FROM empresas WHERE id = ?' as any, [parseInt(id)]);
    connection.release();
    res.json({ success: true, message: 'Empresa removida com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Criar empresa pelo admin
router.post('/empresas', async (req, res) => {
  try {
    const {
      razao_social, nome_fantasia, cnpj, cpf, email_empresa, telefone,
      endereco, bairro, cep, cidade, estado, ramo_atuacao, categoria_id,
      descricao_servico, website, instagram, status = 'verificado',
    } = req.body;

    if (!razao_social || !cnpj || !cpf) {
      return res.status(400).json({ success: false, message: 'Razão Social, CNPJ e CPF são obrigatórios' });
    }

    const connection = await getConnection();
    const [result]: any = await connection.execute(
      `INSERT INTO empresas
        (razao_social, nome_fantasia, cnpj, cpf, email_empresa, telefone,
         endereco, bairro, cep, cidade, estado, ramo_atuacao, categoria_id,
         descricao_servico, website, instagram, status, criado_em, atualizado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())` as any,
      [razao_social, nome_fantasia || null, cnpj, cpf, email_empresa || null,
       telefone || null, endereco || null, bairro || null, cep || null,
       cidade || null, estado || null, ramo_atuacao || null, categoria_id || null,
       descricao_servico || null, website || null, instagram || null, status]
    );
    connection.release();
    res.status(201).json({ success: true, message: 'Empresa criada com sucesso', id: result.insertId });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'CNPJ ou CPF já cadastrado na plataforma' });
    }
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Criar usuário pelo admin
router.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, cpf, telefone, tipo = 'usuario' } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ success: false, message: 'Nome, e-mail e senha são obrigatórios' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await UserModel.create({
      nome, email, senha: senhaHash,
      cpf: cpf || undefined,
      telefone: telefone || undefined,
      tipo: tipo as 'admin' | 'empresa' | 'usuario',
      ativo: true,
    });
    res.status(201).json({ success: true, message: 'Usuário criado com sucesso', id: novoUsuario.id });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'E-mail já cadastrado na plataforma' });
    }
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Editar usuário completo
router.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, cpf, telefone, tipo, ativo } = req.body;
    const connection = await getConnection();
    await connection.execute(
      `UPDATE usuarios SET
        nome = COALESCE(?, nome),
        email = COALESCE(?, email),
        cpf = COALESCE(?, cpf),
        telefone = COALESCE(?, telefone),
        tipo = COALESCE(?, tipo),
        ativo = COALESCE(?, ativo),
        data_atualizacao = NOW()
      WHERE id = ?` as any,
      [
        nome ?? null, email ?? null, cpf ?? null,
        telefone ?? null, tipo ?? null,
        ativo !== undefined ? (ativo ? 1 : 0) : null,
        parseInt(id),
      ]
    );
    connection.release();
    res.json({ success: true, message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// === PLANOS / ANÚNCIOS ===

// Listar todas as empresas com seus planos
router.get('/planos', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT e.id, e.nome_fantasia, e.razao_social, e.cnpj, e.status,
              e.plano, e.plano_validade, e.plano_atualizado_em,
              e.criado_em, u.nome AS responsavel, u.email AS email_responsavel
       FROM empresas e
       LEFT JOIN usuarios u ON u.cpf = REPLACE(REPLACE(REPLACE(e.cpf, '.', ''), '-', ''), '/', '')
          OR u.email = e.email
       ORDER BY e.criado_em DESC` as any
    );
    connection.release();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erro ao listar planos:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Atualizar plano de uma empresa
router.put('/planos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { plano, plano_validade } = req.body;

    if (!['gratuito', 'basico', 'premium'].includes(plano)) {
      return res.status(400).json({ success: false, message: 'Plano inválido' });
    }

    const connection = await getConnection();
    await connection.execute(
      `UPDATE empresas SET plano = ?, plano_validade = ?, plano_atualizado_em = NOW() WHERE id = ?` as any,
      [plano, plano_validade || null, parseInt(id)]
    );
    connection.release();
    res.json({ success: true, message: 'Plano atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// ============================================================
// ROTAS DE BASE DE ALUNOS
// ============================================================

// GET /alunos — listar alunos com paginação e busca
router.get('/alunos', async (req, res) => {
  try {
    const connection = await getConnection();
    const { busca, pagina = '1', limite = '50' } = req.query as Record<string, string>;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    let whereClause = '';
    const params: any[] = [];
    if (busca) {
      whereClause = 'WHERE nome LIKE ? OR cpf LIKE ? OR email LIKE ?';
      const termo = `%${busca}%`;
      params.push(termo, termo, termo);
    }

    const [rows]: any = await connection.execute(
      `SELECT * FROM alunos ${whereClause} ORDER BY nome ASC LIMIT ${parseInt(limite)} OFFSET ${offset}` as any,
      params
    );
    const [countRows]: any = await connection.execute(
      `SELECT COUNT(*) as total FROM alunos ${whereClause}` as any,
      params
    );
    connection.release();
    res.json({ success: true, alunos: rows, total: countRows[0].total });
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// GET /alunos/validar-cpf/:cpf — validar CPF contra base de alunos
router.get('/alunos/validar-cpf/:cpf', async (req, res) => {
  try {
    const cpf = req.params.cpf.replace(/\D/g, '');
    const connection = await getConnection();
    const [rows]: any = await connection.execute(
      'SELECT id, nome, email, curso, turma, status_aluno FROM alunos WHERE cpf = ?' as any,
      [cpf]
    );
    connection.release();
    if (rows.length > 0) {
      res.json({ success: true, encontrado: true, aluno: rows[0] });
    } else {
      res.json({ success: true, encontrado: false });
    }
  } catch (error) {
    console.error('Erro ao validar CPF:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// POST /alunos/importar — importar CSV de alunos
router.post('/alunos/importar', csvUpload.single('arquivo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });
  }

  const results: any[] = [];
  const stream = Readable.from(req.file.buffer.toString('utf-8'));

  stream
    .pipe(csvParser({ separator: ',', skipLines: 0 }))
    .on('data', (row: any) => {
      // Normalise column names (lower case, trim)
      const normalised: Record<string, string> = {};
      for (const key of Object.keys(row)) {
        normalised[key.toLowerCase().trim()] = (row[key] || '').trim();
      }
      const cpf = (normalised['cpf'] || '').replace(/\D/g, '');
      const nome = normalised['nome'] || '';
      if (cpf.length === 11 && nome) {
        results.push({
          nome,
          cpf,
          email: normalised['email'] || null,
          telefone: normalised['telefone'] || null,
          curso: normalised['curso'] || null,
          turma: normalised['turma'] || null,
          status_aluno: normalised['status_aluno'] || normalised['status'] || 'ativo',
        });
      }
    })
    .on('end', async () => {
      if (results.length === 0) {
        return res.status(400).json({ success: false, message: 'Nenhum registro válido encontrado no CSV' });
      }

      const connection = await getConnection();
      let importados = 0;
      let duplicatas = 0;
      let erros = 0;

      for (const aluno of results) {
        try {
          await connection.execute(
            `INSERT INTO alunos (nome, cpf, email, telefone, curso, turma, status_aluno, importado_por)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE nome = VALUES(nome), email = VALUES(email),
               telefone = VALUES(telefone), curso = VALUES(curso), turma = VALUES(turma),
               status_aluno = VALUES(status_aluno)` as any,
            [aluno.nome, aluno.cpf, aluno.email, aluno.telefone, aluno.curso, aluno.turma,
             aluno.status_aluno, 'admin']
          );
          importados++;
        } catch (err: any) {
          if (err.code === 'ER_DUP_ENTRY') duplicatas++;
          else erros++;
        }
      }
      connection.release();
      res.json({
        success: true,
        message: `Importação concluída`,
        importados,
        duplicatas,
        erros,
        total: results.length,
      });
    })
    .on('error', (err) => {
      console.error('Erro ao processar CSV:', err);
      res.status(500).json({ success: false, message: 'Erro ao processar arquivo CSV' });
    });
});

// DELETE /alunos/limpar — limpar toda a base de alunos
router.delete('/alunos/limpar', async (req, res) => {
  try {
    const connection = await getConnection();
    await connection.execute('TRUNCATE TABLE alunos' as any);
    connection.release();
    res.json({ success: true, message: 'Base de alunos limpa com sucesso' });
  } catch (error) {
    console.error('Erro ao limpar alunos:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// POST /alunos — criar aluno manualmente
router.post('/alunos', async (req, res) => {
  try {
    const { nome, cpf, email, telefone, curso, turma, status_aluno } = req.body;
    if (!nome || !cpf) {
      return res.status(400).json({ success: false, message: 'Nome e CPF são obrigatórios' });
    }
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      return res.status(400).json({ success: false, message: 'CPF inválido' });
    }
    const connection = await getConnection();
    const [result]: any = await connection.execute(
      `INSERT INTO alunos (nome, cpf, email, telefone, curso, turma, status_aluno, importado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)` as any,
      [nome, cpfLimpo, email || null, telefone || null, curso || null, turma || null,
       status_aluno || 'ativo', 'admin']
    );
    connection.release();
    res.status(201).json({ success: true, message: 'Aluno criado com sucesso', id: result.insertId });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'CPF já cadastrado na base de alunos' });
    }
    console.error('Erro ao criar aluno:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// PUT /alunos/:id — editar aluno
router.put('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, email, telefone, curso, turma, status_aluno } = req.body;
    const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : null;
    const connection = await getConnection();
    await connection.execute(
      `UPDATE alunos SET
        nome = COALESCE(?, nome),
        cpf = COALESCE(?, cpf),
        email = COALESCE(?, email),
        telefone = COALESCE(?, telefone),
        curso = COALESCE(?, curso),
        turma = COALESCE(?, turma),
        status_aluno = COALESCE(?, status_aluno)
       WHERE id = ?` as any,
      [nome ?? null, cpfLimpo ?? null, email ?? null, telefone ?? null,
       curso ?? null, turma ?? null, status_aluno ?? null, parseInt(id)]
    );
    connection.release();
    res.json({ success: true, message: 'Aluno atualizado com sucesso' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'CPF já cadastrado para outro aluno' });
    }
    console.error('Erro ao editar aluno:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// DELETE /alunos/:id — remover aluno individual
router.delete('/alunos/:id', async (req, res) => {
  try {
    const connection = await getConnection();
    await connection.execute('DELETE FROM alunos WHERE id = ?' as any, [parseInt(req.params.id)]);
    connection.release();
    res.json({ success: true, message: 'Aluno removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover aluno:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

export default router;