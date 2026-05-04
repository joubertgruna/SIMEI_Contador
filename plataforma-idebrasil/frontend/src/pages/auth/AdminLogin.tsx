import React from 'react';
import { Container } from '@mui/material';
import AdminLoginForm from '../../components/auth/AdminLoginForm';

const AdminLogin: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <AdminLoginForm />
    </Container>
  );
};

export default AdminLogin;
