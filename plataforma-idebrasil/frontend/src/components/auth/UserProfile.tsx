import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  Collapse,
} from '@mui/material';
import { Person, Email, Phone, Business, Edit, Save, Cancel, Lock, Visibility, VisibilityOff, VpnKey } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

const UserProfile: React.FC = () => {
  const { state, updateProfile, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validationSchema = Yup.object({
    nome: Yup.string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .required('Nome é obrigatório'),
    email: Yup.string()
      .email('Email inválido')
      .required('Email é obrigatório'),
    telefone: Yup.string()
      .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (11) 99999-9999'),
  });

  const formik = useFormik({
    initialValues: {
      nome: state.user?.nome || '',
      email: state.user?.email || '',
      telefone: state.user?.telefone || '',
      cpf: state.user?.cpf || '',
      cnpj: state.user?.cnpj || '',
      razao_social: state.user?.razao_social || '',
      nome_fantasia: state.user?.nome_fantasia || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await updateProfile(values);
      setIsEditing(false);
    },
  });

  // Atualizar valores quando o usuário muda
  useEffect(() => {
    if (state.user) {
      formik.setValues({
        nome: state.user.nome || '',
        email: state.user.email || '',
        telefone: state.user.telefone || '',
        cpf: state.user.cpf || '',
        cnpj: state.user.cnpj || '',
        razao_social: state.user.razao_social || '',
        nome_fantasia: state.user.nome_fantasia || '',
      });
    }
  }, [state.user]);

  const handleEdit = () => {
    setIsEditing(true);
    clearError();
  };

  const handleCancel = () => {
    setIsEditing(false);
    formik.resetForm();
    clearError();
  };

  // Formik para troca de senha
  const passwordFormik = useFormik({
    initialValues: {
      senha_atual: '',
      nova_senha: '',
      confirmar_senha: '',
    },
    validationSchema: Yup.object({
      senha_atual: Yup.string().required('Senha atual é obrigatória'),
      nova_senha: Yup.string().min(6, 'Mínimo 6 caracteres').required('Nova senha é obrigatória'),
      confirmar_senha: Yup.string()
        .oneOf([Yup.ref('nova_senha')], 'As senhas não coincidem')
        .required('Confirmação é obrigatória'),
    }),
    onSubmit: async (values, helpers) => {
      setPasswordError('');
      setPasswordSuccess('');
      const response = await authService.changePassword({
        senha_atual: values.senha_atual,
        nova_senha: values.nova_senha,
      });
      if (response.success) {
        setPasswordSuccess('Senha alterada com sucesso!');
        helpers.resetForm();
        setTimeout(() => {
          setShowPasswordSection(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(response.message || 'Erro ao alterar senha');
      }
    },
  });

  if (!state.user) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="warning">
          Você precisa estar logado para acessar seu perfil.
        </Alert>
      </Box>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'admin': return 'Administrador';
      case 'empresa': return 'Empresa';
      case 'usuario': return 'Usuário';
      default: return 'Usuário';
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
            >
              {getInitials(state.user.nome || 'User')}
            </Avatar>
            <Box>
              <Typography variant="h5" component="h1">
                {state.user.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getUserTypeLabel(state.user.tipo)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Membro desde {new Date(state.user.criado_em || '').toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {state.error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {state.error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="nome"
                  name="nome"
                  label="Nome Completo"
                  value={formik.values.nome}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nome && Boolean(formik.errors.nome)}
                  helperText={formik.touched.nome && formik.errors.nome}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="telefone"
                  name="telefone"
                  label="Telefone"
                  value={formik.values.telefone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.telefone && Boolean(formik.errors.telefone)}
                  helperText={formik.touched.telefone && formik.errors.telefone}
                  disabled={!isEditing}
                  placeholder="(11) 99999-9999"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {state.user.tipo === 'usuario' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="cpf"
                    name="cpf"
                    label="CPF"
                    value={formik.values.cpf}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                    helperText={formik.touched.cpf && formik.errors.cpf}
                    disabled={!isEditing}
                    placeholder="123.456.789-01"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}

              {state.user.tipo === 'empresa' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="cnpj"
                      name="cnpj"
                      label="CNPJ"
                      value={formik.values.cnpj}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
                      helperText={formik.touched.cnpj && formik.errors.cnpj}
                      disabled={!isEditing}
                      placeholder="12.345.678/0001-90"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="razao_social"
                      name="razao_social"
                      label="Razão Social"
                      value={formik.values.razao_social}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.razao_social && Boolean(formik.errors.razao_social)}
                      helperText={formik.touched.razao_social && formik.errors.razao_social}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="nome_fantasia"
                      name="nome_fantasia"
                      label="Nome Fantasia"
                      value={formik.values.nome_fantasia}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.nome_fantasia && Boolean(formik.errors.nome_fantasia)}
                      helperText={formik.touched.nome_fantasia && formik.errors.nome_fantasia}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={state.loading}
                  >
                    {state.loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* ── Seção de troca de senha ── */}
          <Divider sx={{ my: 3 }} />

          <Box>
            <Button
              variant="outlined"
              startIcon={<VpnKey />}
              onClick={() => {
                setShowPasswordSection(v => !v);
                setPasswordError('');
                setPasswordSuccess('');
                passwordFormik.resetForm();
              }}
              color={showPasswordSection ? 'error' : 'primary'}
            >
              {showPasswordSection ? 'Cancelar' : 'Alterar Senha'}
            </Button>

            <Collapse in={showPasswordSection}>
              <Box
                component="form"
                onSubmit={passwordFormik.handleSubmit}
                sx={{ mt: 2 }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Alterar Senha
                </Typography>

                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPasswordError('')}>
                    {passwordError}
                  </Alert>
                )}
                {passwordSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {passwordSuccess}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="senha_atual"
                      name="senha_atual"
                      label="Senha Atual"
                      type={showCurrentPwd ? 'text' : 'password'}
                      value={passwordFormik.values.senha_atual}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      error={passwordFormik.touched.senha_atual && Boolean(passwordFormik.errors.senha_atual)}
                      helperText={passwordFormik.touched.senha_atual && passwordFormik.errors.senha_atual}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowCurrentPwd(v => !v)} edge="end">
                              {showCurrentPwd ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="nova_senha"
                      name="nova_senha"
                      label="Nova Senha"
                      type={showNewPwd ? 'text' : 'password'}
                      value={passwordFormik.values.nova_senha}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      error={passwordFormik.touched.nova_senha && Boolean(passwordFormik.errors.nova_senha)}
                      helperText={passwordFormik.touched.nova_senha && passwordFormik.errors.nova_senha}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPwd(v => !v)} edge="end">
                              {showNewPwd ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="confirmar_senha"
                      name="confirmar_senha"
                      label="Confirmar Nova Senha"
                      type={showConfirmPwd ? 'text' : 'password'}
                      value={passwordFormik.values.confirmar_senha}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      error={passwordFormik.touched.confirmar_senha && Boolean(passwordFormik.errors.confirmar_senha)}
                      helperText={passwordFormik.touched.confirmar_senha && passwordFormik.errors.confirmar_senha}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPwd(v => !v)} edge="end">
                              {showConfirmPwd ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" startIcon={<Save />} disabled={passwordFormik.isSubmitting}>
                      {passwordFormik.isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;