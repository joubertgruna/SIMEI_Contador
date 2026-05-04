import { Router } from 'express';

const router = Router();

// TODO: Implementar autenticação administrativa
router.post('/login', (req, res) => {
  // Simulação de login administrativo
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token: 'admin-token-simulado'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

router.post('/validar-cpf', async (req, res) => {
  // TODO: Implementar validação real com API IDEBRASIL
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(400).json({
      success: false,
      message: 'CPF é obrigatório'
    });
  }

  // Simulação: aceitar CPFs válidos
  const cpfLimpo = cpf.replace(/\D/g, '');
  const isValid = cpfLimpo.length === 11;

  res.json({
    success: true,
    valido: isValid,
    message: isValid ? 'CPF válido na base IDEBRASIL' : 'CPF não encontrado na base IDEBRASIL'
  });
});

export default router;