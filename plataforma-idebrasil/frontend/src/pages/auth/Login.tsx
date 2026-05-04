import React from 'react';
import { Container } from '@mui/material';
import EmpresaLoginForm from '../../components/auth/EmpresaLoginForm';

const Login: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <EmpresaLoginForm />
    </Container>
  );
};

export default Login;