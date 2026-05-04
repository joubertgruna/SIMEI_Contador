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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  AdminPanelSettings,
  Email,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLoginForm: React.FC = () => {
  const { state, login, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (state.isAuthenticated && state.user?.tipo === 'admin') {
      navigate('/admin');
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      senha: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail é obrigatório'),
      senha: Yup.string()
        .min(6, 'Mínimo 6 caracteres')
        .required('Senha é obrigatória'),
    }),
    onSubmit: async (values) => {
      await login({ email: values.email, senha: values.senha }, 'admin');
    },
  });

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6 }}>
      <Card
        elevation={0}
        sx={{
          border: '1px solid rgba(194,53,53,0.15)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(44,44,44,0.1)',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2C2C2C 0%, #3A3A3A 100%)',
            borderRadius: '12px 12px 0 0',
            py: 4,
            px: 4,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: '#C23535',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 4px 16px rgba(194,53,53,0.4)',
            }}
          >
            <AdminPanelSettings sx={{ color: '#fff', fontSize: 32 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} color="#fff">
            Painel Administrativo
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 0.5 }}>
            Acesso restrito a administradores
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {state.error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={clearError}>
              {state.error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="E-mail do administrador"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#C23535' }} />
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#C23535' }} />
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
                borderRadius: 2,
              }}
            >
              {state.loading ? 'Autenticando...' : 'Acessar Painel'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <RouterLink to="/login" style={{ color: '#888', fontSize: 13 }}>
                ← Voltar para login de empresas
              </RouterLink>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminLoginForm;
