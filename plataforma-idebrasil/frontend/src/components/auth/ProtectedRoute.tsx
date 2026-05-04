import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth, UserType } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Se especificado, somente esse tipo de usuário pode acessar */
  requiredType?: UserType | UserType[];
  /** Rota para redirecionar quando não autenticado (padrão: /login) */
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredType,
  redirectTo = '/login',
}) => {
  const { state } = useAuth();
  const location = useLocation();

  // Token existe mas user ainda não foi hidratado do localStorage (primeiro render)
  // Aguarda até 300ms, depois prossegue
  const [ready, setReady] = React.useState(
    // Já temos user, ou não há token — pode decidir imediatamente
    () => !!state.user || !state.token
  );

  React.useEffect(() => {
    if (state.user || !state.token) {
      setReady(true);
    }
    // Se após 500ms ainda não resolveu, força o ready
    const timeout = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timeout);
  }, [state.user, state.token]);

  // Enquanto aguarda somente a hidratação inicial de autenticação
  // (não bloqueia a rota por operações de loading não relacionadas à autenticação)
  const isResolvingAuth = state.loading && !state.user && !!state.token;

  if (!ready || isResolvingAuth) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10, gap: 2 }}>
        <CircularProgress />
        <Typography color="text.secondary">Verificando autenticação...</Typography>
      </Box>
    );
  }

  // Não autenticado → redireciona para login salvando a rota original
  if (!state.isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verifica tipo de usuário exigido
  if (requiredType && state.user) {
    const allowed = Array.isArray(requiredType)
      ? requiredType.includes(state.user.tipo)
      : state.user.tipo === requiredType;

    if (!allowed) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
