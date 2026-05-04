import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  Grid,
  Container,
  Paper,
} from '@mui/material';
import { CheckCircle, Business, Search } from '@mui/icons-material';

const DesignSystemDemo: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h1" gutterBottom align="center" color="primary">
        IDEBRASIL Design System
      </Typography>

      <Typography variant="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Plataforma de Classificados para Empreendedores
      </Typography>

      {/* Color Palette Demo */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Paleta de Cores
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                p: 2,
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2">Azul Institucional</Typography>
              <Typography variant="caption">#1e88e5</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                p: 2,
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2">Verde de Sucesso</Typography>
              <Typography variant="caption">#4caf50</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                bgcolor: '#ff9800',
                color: 'black',
                p: 2,
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2">Laranja Destaque</Typography>
              <Typography variant="caption">#ff9800</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                bgcolor: 'grey.100',
                color: 'text.primary',
                p: 2,
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2">Cinza Neutro</Typography>
              <Typography variant="caption">#f5f5f5</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Component Demo */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Cadastro de Empresa
              </Typography>
              <Typography variant="body1" paragraph>
                Registre sua empresa na plataforma IDEBRASIL e conecte-se com alunos
                validados da instituição.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Razão Social"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="CNPJ"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="CPF do Responsável"
                  variant="outlined"
                  helperText="Para validação como aluno IDEBRASIL"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" color="primary" startIcon={<Business />}>
                  Cadastrar Empresa
                </Button>
                <Button variant="outlined" color="primary">
                  Validar CPF
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Busca de Oportunidades
              </Typography>
              <Typography variant="body1" paragraph>
                Encontre empresas parceiras do IDEBRASIL e descubra oportunidades
                de negócio validadas.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Buscar empresas..."
                  variant="outlined"
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip label="Comércio" variant="outlined" />
                  <Chip label="Serviços" variant="outlined" />
                  <Chip label="Tecnologia" variant="outlined" />
                  <Chip label="Indústria" variant="outlined" />
                </Box>
              </Box>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<Search />}
                fullWidth
              >
                Buscar Oportunidades
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Messages */}
      <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Estados e Validações
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle color="success" />
            <Typography variant="body1">
              CPF validado com sucesso - Aluno ativo do IDEBRASIL
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle color="primary" />
            <Typography variant="body1">
              Empresa cadastrada e aguardando aprovação
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle sx={{ color: '#ff9800' }} />
            <Typography variant="body1">
              Publicação em análise pelo administrador
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DesignSystemDemo;