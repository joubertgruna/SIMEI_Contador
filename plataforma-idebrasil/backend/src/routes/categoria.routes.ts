import { Router, Request, Response } from 'express';
import pool from '../config/database.config';

const router = Router();

// Listar todas as categorias (com filtro opcional por ?ramo_atuacao=xxx)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { ramo_atuacao } = req.query;

    let query = 'SELECT id, nome, ramo_atuacao FROM categorias';
    const params: string[] = [];

    if (ramo_atuacao) {
      query += ' WHERE ramo_atuacao = ?';
      params.push(ramo_atuacao as string);
    }

    query += ' ORDER BY nome ASC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar categorias' });
  }
});

// Listar categorias por ramo (mantido por compatibilidade)
router.get('/ramo/:ramo', async (req: Request, res: Response) => {
  try {
    const { ramo } = req.params;
    const [rows] = await pool.query(
      'SELECT id, nome, ramo_atuacao FROM categorias WHERE ramo_atuacao = ? ORDER BY nome ASC',
      [ramo]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar categorias' });
  }
});

// Listar subcategorias de uma categoria
router.get('/:id/subcategorias', async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
});

// Obter categoria por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, nome, ramo_atuacao FROM categorias WHERE id = ?',
      [parseInt(id)]
    ) as any;

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    }

    res.json({ success: true, data: (rows as any[])[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao obter categoria' });
  }
});

export default router;
