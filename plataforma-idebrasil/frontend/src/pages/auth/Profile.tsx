import React from 'react';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../../components/auth/UserProfile';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se não estiver logado
  React.useEffect(() => {
    if (!state.loading && !state.isAuthenticated) {
      navigate('/login');
    }
  }, [state.loading, state.isAuthenticated, navigate]);

  if (state.loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography color="text.secondary">Carregando perfil...</Typography>
        </Box>
      </Container>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!state.isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="warning">
            Você precisa estar logado para acessar esta página.
          </Alert>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/login')}
          >
            Fazer Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Meu Perfil
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Box>

        <UserProfile />
      </Box>
    </Container>
  );
};

export default Profile;