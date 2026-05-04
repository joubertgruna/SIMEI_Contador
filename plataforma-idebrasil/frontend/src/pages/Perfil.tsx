import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { Business, Edit, Save, Cancel, History, Delete } from '@mui/icons-material';
import { Empresa } from '../services/empresaService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Perfil: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedEmpresa, setEditedEmpresa] = useState<Partial<Empresa>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock data - em produção, isso viria do contexto de autenticação

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    setLoading(true);
    try {
      // TODO: Implementar endpoint para buscar empresa do usuário logado
      // Por enquanto, simulando com dados mock
      const mockEmpresa: Empresa = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        celular: '(11) 99999-9999',
        cpf: '123.456.789-00',
        razao_social: 'João Silva ME',
        nome_fantasia: 'João Serviços',
        cnpj: '12.345.678/0001-00',
        endereco: 'Rua das Flores, 123',
        numero: '123',
        complemento: 'Sala 101',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        telefone: '(11) 3333-4444',
        email_empresa: 'contato@joaoservicos.com',
        website: 'https://joaoservicos.com',
        instagram: 'joao_servicos',
        descricao_servico: 'Prestamos serviços de manutenção residencial e comercial.',
        ramo_atuacao: 'prestacao_servico',
        categoria_id: 1,
        logo_url: '',
        status: 'verificado',
        criado_em: new Date('2024-01-15'),
      };

      setEmpresa(mockEmpresa);
      setEditedEmpresa(mockEmpresa);
    } catch (error: any) {
      setError('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Implementar atualização de perfil
      setEmpresa(editedEmpresa as Empresa);
      setEditMode(false);
      // TODO: Mostrar toast de sucesso
    } catch (error) {
      setError('Erro ao salvar alterações');
    }
  };

  const handleCancel = () => {
    setEditedEmpresa(empresa || {});
    setEditMode(false);
  };

  const handleInputChange = (field: keyof Empresa, value: string) => {
    setEditedEmpresa(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      // TODO: Implementar exclusão de conta
      setDeleteDialogOpen(false);
      // TODO: Redirecionar para login ou página inicial
    } catch (error) {
      setError('Erro ao excluir conta');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verificado': return 'success';
      case 'rejeitado': return 'error';
      case 'pendente': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verificado': return 'Verificada';
      case 'rejeitado': return 'Rejeitada';
      case 'pendente': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  const getRamoLabel = (ramo: string) => {
    switch (ramo) {
      case 'comercio': return 'Comércio';
      case 'industrial': return 'Industrial';
      case 'prestacao_servico': return 'Prestação de Serviço';
      default: return ramo;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando perfil...</Typography>
      </Container>
    );
  }

  if (error || !empresa) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Erro ao carregar perfil'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header do Perfil */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar
            src={empresa.logo_url}
            sx={{ width: 100, height: 100 }}
            variant="rounded"
          >
            <Business sx={{ fontSize: 50 }} />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {empresa.nome_fantasia || empresa.razao_social}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {empresa.razao_social}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {getRamoLabel(empresa.ramo_atuacao)}
              </Typography>
              <Typography variant="body2" color="text.secondary">•</Typography>
              <Typography variant="body2" sx={{
                color: getStatusColor(empresa.status) === 'success' ? 'success.main' :
                       getStatusColor(empresa.status) === 'error' ? 'error.main' :
                       getStatusColor(empresa.status) === 'warning' ? 'warning.main' : 'text.secondary'
              }}>
                {getStatusLabel(empresa.status)}
              </Typography>
            </Box>
          </Box>

          <Box>
            {!editMode ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEdit}
              >
                Editar Perfil
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  color="primary"
                >
                  Salvar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Abas */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Informações Gerais" />
          <Tab label="Dados Cadastrais" />
          <Tab label="Atividades" />
          <Tab label="Configurações" />
        </Tabs>

        {/* Informações Gerais */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dados Pessoais
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Nome Completo"
                      value={editMode ? editedEmpresa.nome || '' : empresa.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      value={editMode ? editedEmpresa.email || '' : empresa.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                    />
                    <TextField
                      label="Celular"
                      value={editMode ? editedEmpresa.celular || '' : empresa.celular}
                      onChange={(e) => handleInputChange('celular', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informações da Empresa
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Nome Fantasia"
                      value={editMode ? editedEmpresa.nome_fantasia || '' : empresa.nome_fantasia}
                      onChange={(e) => handleInputChange('nome_fantasia', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                    />
                    <TextField
                      label="Telefone Empresarial"
                      value={editMode ? editedEmpresa.telefone || '' : empresa.telefone || ''}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                    />
                    <TextField
                      label="Email Empresarial"
                      value={editMode ? editedEmpresa.email_empresa || '' : empresa.email_empresa || ''}
                      onChange={(e) => handleInputChange('email_empresa', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                    />
                    <TextField
                      label="Website"
                      value={editMode ? editedEmpresa.website || '' : empresa.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                    />
                    <TextField
                      label="Instagram"
                      value={editMode ? editedEmpresa.instagram || '' : empresa.instagram || ''}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Descrição dos Serviços
                  </Typography>
                  <TextField
                    multiline
                    rows={4}
                    value={editMode ? editedEmpresa.descricao_servico || '' : empresa.descricao_servico}
                    onChange={(e) => handleInputChange('descricao_servico', e.target.value)}
                    disabled={!editMode}
                    fullWidth
                    placeholder="Descreva os serviços oferecidos pela sua empresa..."
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Dados Cadastrais */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Documentos Pessoais
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="CPF"
                      value={empresa.cpf}
                      disabled
                      fullWidth
                    />
                    <TextField
                      label="RG"
                      value="12.345.678-9" // TODO: Adicionar campo RG na interface
                      disabled
                      fullWidth
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Documentos Empresariais
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="CNPJ"
                      value={empresa.cnpj}
                      disabled
                      fullWidth
                    />
                    <TextField
                      label="Razão Social"
                      value={empresa.razao_social}
                      disabled
                      fullWidth
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Endereço
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <TextField
                        label="Endereço"
                        value={editMode ? editedEmpresa.endereco || '' : empresa.endereco}
                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Número"
                        value={editMode ? editedEmpresa.numero || '' : empresa.numero || ''}
                        onChange={(e) => handleInputChange('numero', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Complemento"
                        value={editMode ? editedEmpresa.complemento || '' : empresa.complemento || ''}
                        onChange={(e) => handleInputChange('complemento', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Bairro"
                        value={editMode ? editedEmpresa.bairro || '' : empresa.bairro}
                        onChange={(e) => handleInputChange('bairro', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="CEP"
                        value={editMode ? editedEmpresa.cep || '' : empresa.cep}
                        onChange={(e) => handleInputChange('cep', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Cidade"
                        value={editMode ? editedEmpresa.cidade || '' : empresa.cidade}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Estado"
                        value={editMode ? editedEmpresa.estado || '' : empresa.estado}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Atividades */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Histórico de Atividades
          </Typography>

          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <History />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Perfil criado"
                secondary={`Criado em ${new Date(empresa.criado_em || Date.now()).toLocaleDateString('pt-BR')}`}
              />
            </ListItem>

            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Business />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Empresa verificada"
                secondary="Status alterado para verificado"
              />
            </ListItem>

            {/* TODO: Adicionar mais atividades quando disponíveis */}
          </List>
        </TabPanel>

        {/* Configurações */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Configurações da Conta
          </Typography>

          <Card>
            <CardContent>
              <Typography variant="h6" color="error" gutterBottom>
                Zona de Perigo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Estas ações são irreversíveis. Tenha certeza antes de prosseguir.
              </Typography>

              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteAccount}
              >
                Excluir Conta
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão de Conta</DialogTitle>
        <Box sx={{ p: 2 }}>
          <Typography>
            Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.
          </Typography>
        </Box>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteAccount} color="error" variant="contained">
            Excluir Conta
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Perfil;