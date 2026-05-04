import { Router } from 'express';
import {
  listarEmpresas,
  obterEmpresa,
  cadastrarEmpresa,
  atualizarEmpresa,
  excluirEmpresa,
  obterEstatisticas
} from '../controllers/empresa.controller';

const router = Router();

// Rotas públicas
router.get('/', listarEmpresas);
router.get('/stats', obterEstatisticas);
router.get('/:id', obterEmpresa);

// Rotas que requerem autenticação (TODO: adicionar middleware de auth)
router.post('/', cadastrarEmpresa);
router.put('/:id', atualizarEmpresa);
router.delete('/:id', excluirEmpresa);

export default router;