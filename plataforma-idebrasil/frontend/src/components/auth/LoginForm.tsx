import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Business, Person } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth, UserType } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LoginForm: React.FC = () => {
  const { state, login, clearError } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    clearError();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const getUserType = (index: number): UserType => {
    switch (index) {
      case 0: return 'usuario';
      case 1: return 'empresa';
      case 2: return 'admin';
      default: return 'usuario';
    }
  };

  const getValidationSchema = (userType: UserType) => {
    const baseSchema = {
      senha: Yup.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .required('Senha é obrigatória'),
    };

    switch (userType) {
      case 'usuario':
      case 'admin':
        return Yup.object({
          ...baseSchema,
          email: Yup.string()
            .email('Email inválido')
            .required('Email é obrigatório'),
        });
      case 'empresa':
        return Yup.object({
          ...baseSchema,
          cpf_cnpj: Yup.string()
            .required('CPF ou CNPJ é obrigatório')
            .test('cpf-cnpj-valid', 'CPF ou CNPJ inválido', (value) => {
              if (!value) return false;
              // Remove caracteres não numéricos
              const cleanValue = value.replace(/\D/g, '');
              // CPF tem 11 dígitos, CNPJ tem 14
              return cleanValue.length === 11 || cleanValue.length === 14;
            }),
        });
      default:
        return Yup.object(baseSchema);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      cpf_cnpj: '',
      senha: '',
    },
    validationSchema: getValidationSchema(getUserType(tabValue)),
    onSubmit: async (values) => {
      const userType = getUserType(tabValue);
      const credentials = userType === 'empresa'
        ? { cpf_cnpj: values.cpf_cnpj, senha: values.senha }
        : { email: values.email, senha: values.senha };

      await login(credentials, userType);
    },
  });

  // Atualizar validação quando a aba muda
  React.useEffect(() => {
    formik.setFieldValue('email', '');
    formik.setFieldValue('cpf_cnpj', '');
    formik.setFieldValue('senha', '');
    formik.setErrors({});
    formik.setTouched({});
  }, [tabValue]);

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Entrar na Plataforma
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="login tabs">
              <Tab
                icon={<Person />}
                label="Usuário"
                id="auth-tab-0"
                aria-controls="auth-tabpanel-0"
              />
              <Tab
                icon={<Business />}
                label="Empresa"
                id="auth-tab-1"
                aria-controls="auth-tabpanel-1"
              />
              <Tab
                icon={<Lock />}
                label="Admin"
                id="auth-tab-2"
                aria-controls="auth-tabpanel-2"
              />
            </Tabs>
          </Box>

          {state.error && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={clearError}>
              {state.error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit}>
            <TabPanel value={tabValue} index={0}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TextField
                fullWidth
                id="cpf_cnpj"
                name="cpf_cnpj"
                label="CPF ou CNPJ"
                value={formik.values.cpf_cnpj}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cpf_cnpj && Boolean(formik.errors.cpf_cnpj)}
                helperText={formik.touched.cpf_cnpj && formik.errors.cpf_cnpj}
                margin="normal"
                placeholder="Digite seu CPF (11 dígitos) ou CNPJ (14 dígitos)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business />
                    </InputAdornment>
                  ),
                }}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email ou Username"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </TabPanel>

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
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
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
              sx={{ mt: 3, mb: 2 }}
              disabled={state.loading}
            >
              {state.loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;