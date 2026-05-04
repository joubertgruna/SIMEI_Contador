import React from 'react';
import { Container, Typography } from '@mui/material';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h1" color="primary" sx={{ fontSize: '6rem', fontWeight: 600 }}>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Página não encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary">
        A página que você está procurando não existe ou foi movida.
      </Typography>
    </Container>
  );
};

export default NotFound;