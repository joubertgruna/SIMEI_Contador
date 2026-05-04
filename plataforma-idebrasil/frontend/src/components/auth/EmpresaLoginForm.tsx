import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Business,
  Badge,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const EmpresaLoginForm: React.FC = () => {
  const { state, login, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (state.isAuthenticated && state.user) {
      if (state.user.tipo === 'admin') {
        navigate('/admin');
      } else {
        navigate('/perfil');
      }
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const formik = useFormik({
    initialValues: {
      cpf_cnpj: '',
      senha: '',
    },
    validationSchema: Yup.object({
      cpf_cnpj: Yup.string()
        .required('CPF ou CNPJ é obrigatório')
        .test('cpf-cnpj', 'CPF (11 dígitos) ou CNPJ (14 dígitos) inválido', (value) => {
          if (!value) return false;
          const clean = value.replace(/\D/g, '');
          return clean.length === 11 || clean.length === 14;
        }),
      senha: Yup.string()
        .min(6, 'Mínimo 6 caracteres')
        .required('Senha é obrigatória'),
    }),
    onSubmit: async (values) => {
      await login({ cpf_cnpj: values.cpf_cnpj, senha: values.senha }, 'empresa');
    },
  });

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#C23535',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Business sx={{ color: '#fff', fontSize: 30 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="#2C2C2C">
              Área da Empresa
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Entre com seu CPF ou CNPJ para acessar
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {state.error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {state.error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="cpf_cnpj"
              name="cpf_cnpj"
              label="CPF ou CNPJ"
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
              value={formik.values.cpf_cnpj}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cpf_cnpj && Boolean(formik.errors.cpf_cnpj)}
              helperText={formik.touched.cpf_cnpj && formik.errors.cpf_cnpj}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              id="senha"
              name="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.senha}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.senha && Boolean(formik.errors.senha)}
              helperText={formik.touched.senha && formik.errors.senha}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={state.loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#C23535',
                '&:hover': { bgcolor: '#A52A2A' },
                fontWeight: 700,
                py: 1.5,
              }}
            >
              {state.loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Não tem cadastro?{' '}
                <RouterLink to="/registro" style={{ color: '#C23535', fontWeight: 600 }}>
                  Cadastre sua empresa
                </RouterLink>
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <RouterLink to="/admin/login" style={{ color: '#888', fontSize: 13 }}>
                Acesso administrativo →
              </RouterLink>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <RouterLink to="/" style={{ color: '#888', fontSize: 14 }}>
          ← Voltar ao início
        </RouterLink>
      </Box>
    </Box>
  );
};

export default EmpresaLoginForm;
