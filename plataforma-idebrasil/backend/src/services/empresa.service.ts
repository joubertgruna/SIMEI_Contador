import mysql from 'mysql2/promise';
import { Empresa, EmpresaFilters, EmpresaStats } from '../models/empresa.model';
import { getConnection } from '../config/database.config';

export const listarEmpresas = async (filters: EmpresaFilters) => {
  const connection = await getConnection();

  try {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    // Filtro por status — se não informado, retorna todas (sem filtrar por status)
    if (filters.status) {
      whereClause += ' AND e.status = ?';
      params.push(filters.status);
    }

    // Aplicar filtros
    if (filters.nome) {
      whereClause += ' AND (e.nome LIKE ? OR e.razao_social LIKE ? OR e.nome_fantasia LIKE ? OR e.descricao_servico LIKE ?)';
      const searchTerm = `%${filters.nome}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.categoria) {
      whereClause += ' AND e.categoria_id = ?';
      params.push(filters.categoria);
    }

    if (filters.estado) {
      whereClause += ' AND e.estado = ?';
      params.push(filters.estado);
    }

    if (filters.cidade) {
      whereClause += ' AND e.cidade LIKE ?';
      params.push(`%${filters.cidade}%`);
    }

    if (filters.ramo_atuacao) {
      whereClause += ' AND e.ramo_atuacao = ?';
      params.push(filters.ramo_atuacao);
    }

    // Contar total com os mesmos filtros
    const countQuery = `SELECT COUNT(*) as total FROM empresas e ${whereClause}`;
    const [countResult] = await connection.query(connection.format(countQuery, params));
    const total = (countResult as any)[0].total;

    // Paginação
    const pagina = filters.pagina || 1;
    const limite = filters.limite || 10;
    const offset = (pagina - 1) * limite;

    const query = `
      SELECT e.*, c.nome as categoria_nome
      FROM empresas e
      LEFT JOIN categorias c ON e.categoria_id = c.id
      ${whereClause}
      ORDER BY e.criado_em DESC LIMIT ? OFFSET ?
    `;
    params.push(limite, offset);

    const [rows] = await connection.query(connection.format(query, params));

    return {
      empresas: rows as Empresa[],
      total: total
    };
  } finally {
    connection.release();
  }
};

export const obterEmpresaPorId = async (id: number): Promise<Empresa | null> => {
  const connection = await getConnection();

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM empresas WHERE id = ?',
      [id]
    );

    if ((rows as any[]).length === 0) {
      return null;
    }

    return (rows as Empresa[])[0];
  } finally {
    connection.release();
  }
};

export const criarEmpresa = async (empresaData: Empresa): Promise<Empresa> => {
  const connection = await getConnection();

  try {
    const [result] = await connection.execute(
      `INSERT INTO empresas (
        nome, email, celular, cpf, razao_social, nome_fantasia, cnpj,
        endereco, numero, complemento, bairro, cidade, estado, cep,
        telefone, email_empresa, website, instagram,
        descricao_servico, ramo_atuacao, categoria_id, logo_url, status,
        criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        empresaData.nome,
        empresaData.email,
        empresaData.celular,
        empresaData.cpf,
        empresaData.razao_social,
        empresaData.nome_fantasia,
        empresaData.cnpj,
        empresaData.endereco,
        (empresaData as any).numero || null,
        (empresaData as any).complemento || null,
        (empresaData as any).bairro || null,
        (empresaData as any).cidade || null,
        (empresaData as any).estado || null,
        (empresaData as any).cep || null,
        empresaData.telefone || null,
        empresaData.email_empresa || null,
        empresaData.website || null,
        empresaData.instagram || null,
        empresaData.descricao_servico,
        empresaData.ramo_atuacao,
        empresaData.categoria_id,
        empresaData.logo_url || null,
        'pendente'
      ]
    );

    const empresaId = (result as any).insertId;
    return await obterEmpresaPorId(empresaId) as Empresa;
  } finally {
    connection.release();
  }
};

export const atualizarEmpresa = async (
  id: number,
  empresaData: Partial<Empresa>
): Promise<Empresa | null> => {
  const connection = await getConnection();

  try {
    const fields = [];
    const values = [];

    Object.keys(empresaData).forEach(key => {
      if (empresaData[key as keyof Empresa] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(empresaData[key as keyof Empresa]);
      }
    });

    if (fields.length === 0) {
      return await obterEmpresaPorId(id);
    }

    fields.push('atualizado_em = NOW()');
    values.push(id);

    await connection.execute(
      `UPDATE empresas SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await obterEmpresaPorId(id);
  } finally {
    connection.release();
  }
};

export const excluirEmpresa = async (id: number): Promise<boolean> => {
  const connection = await getConnection();

  try {
    const [result] = await connection.execute(
      'DELETE FROM empresas WHERE id = ?',
      [id]
    );

    return (result as any).affectedRows > 0;
  } finally {
    connection.release();
  }
};

export const validarCpfIdebrasil = async (cpf: string): Promise<boolean> => {
  // TODO: Implementar integração com API do IDEBRASIL
  // Por enquanto, simular validação
  // Em produção, fazer chamada para API externa

  // Simulação: aceitar CPFs que começam com dígitos específicos
  // Isso deve ser substituído pela integração real
  const cpfNumerico = cpf.replace(/\D/g, '');
  return cpfNumerico.length === 11;
};

export const obterEstatisticas = async (): Promise<EmpresaStats> => {
  const connection = await getConnection();

  try {
    // Total de empresas
    const [totalResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM empresas',
      []
    );
    const total_empresas = (totalResult as any)[0].total;

    // Empresas verificadas
    const [verificadoResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM empresas WHERE status = "verificado"',
      []
    );
    const empresas_verificadas = (verificadoResult as any)[0].total;

    // Empresas pendentes
    const [pendenteResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM empresas WHERE status = "pendente"',
      []
    );
    const empresas_pendentes = (pendenteResult as any)[0].total;

    // Empresas por ramo
    const [ramoResult] = await connection.execute(
      `SELECT ramo_atuacao, COUNT(*) as total
       FROM empresas
       WHERE status = "verificado"
       GROUP BY ramo_atuacao`,
      []
    );

    const empresas_por_ramo = {
      comercio: 0,
      industrial: 0,
      prestacao_servico: 0
    };

    (ramoResult as any[]).forEach((row: any) => {
      if (row.ramo_atuacao === 'comercio') {
        empresas_por_ramo.comercio = row.total;
      } else if (row.ramo_atuacao === 'industrial') {
        empresas_por_ramo.industrial = row.total;
      } else if (row.ramo_atuacao === 'prestacao_servico') {
        empresas_por_ramo.prestacao_servico = row.total;
      }
    });

    return {
      total_empresas,
      empresas_verificadas,
      empresas_pendentes,
      empresas_por_ramo
    };
  } finally {
    connection.release();
  }
};