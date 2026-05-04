import React from 'react';
import { Container, Typography, Box, Link, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

const Register: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  React.useEffect(() => {
    if (state.isAuthenticated && state.user) {
      switch (state.user.tipo) {
        case 'admin':
          navigate('/admin');
          break;
        case 'empresa':
          navigate('/empresa/dashboard');
          break;
        case 'usuario':
          navigate('/perfil');
          break;
        default:
          navigate('/');
      }
    }
  }, [state.isAuthenticated, state.user, navigate]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <RegisterForm />

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Já tem uma conta?{' '}
            <Link component={RouterLink} to="/login" variant="body2">
              Fazer login
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/"
            variant="text"
            size="small"
          >
            Voltar ao início
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;