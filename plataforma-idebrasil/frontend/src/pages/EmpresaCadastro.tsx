import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Business,
  Person,
  Description,
  PhotoCamera,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { empresaService, Empresa, Categoria, Subcategoria } from '../services/empresaService';

const steps = [
  'Dados Pessoais',
  'Dados da Empresa',
  'Serviços & Categoria',
  'Confirmação'
];

const EmpresaCadastro: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Dados pessoais
    nome: '',
    email: '',
    celular: '',
    cpf: '',

    // Dados da empresa
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
  endereco: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
    telefone: '',
    email_empresa: '',
    website: '',
    instagram: '',

    // Serviços e categoria
    descricao_servico: '',
  ramo_atuacao: '' as 'comercio' | 'industrial' | 'prestacao_servico' | '',
  categoria_id: '' as number | '',
    subcategorias_ids: [] as number[],

    // Logo
    logo_file: null as File | null,
    logo_url: '' as string | null,
  });

  const [validation, setValidation] = useState({
    cpfValid: null as boolean | null,
    cpfValidating: false,
    cpfMensagem: '' as string,
  });

  useEffect(() => {
    carregarCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formData.ramo_atuacao) {
      carregarCategoriasPorRamo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.ramo_atuacao]);

  useEffect(() => {
    if (formData.categoria_id) {
      carregarSubcategorias();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.categoria_id]);

  const carregarCategorias = async () => {
    try {
      const response = await empresaService.listarCategorias();
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const carregarCategoriasPorRamo = async () => {
    try {
      const response = await empresaService.listarCategorias(formData.ramo_atuacao);
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const carregarSubcategorias = async () => {
    try {
      const categoriaId = typeof formData.categoria_id === 'string' ? Number(formData.categoria_id) : formData.categoria_id;
      const response = await empresaService.listarSubcategorias(categoriaId as number);
      if (response.success) {
        setSubcategorias(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar subcategorias:', error);
    }
  };

  const validarCPF = async (cpf: string) => {
    if (cpf.length !== 14) return;

    setValidation(prev => ({ ...prev, cpfValidating: true }));

    try {
      const response = await empresaService.validarCPF(cpf.replace(/\D/g, ''));
      setValidation(prev => ({
        ...prev,
        cpfValid: response.valido,
        cpfValidating: false,
        cpfMensagem: response.mensagem || '',
      }));

      // If found in IDEBRASIL base, prefill name only (don't auto-advance)
      if (response.valido && response.dados) {
        setFormData(prev => ({ ...prev, nome: response.dados?.nome || prev.nome }));
      }
    } catch (error) {
      setValidation(prev => ({
        ...prev,
        cpfValid: false,
        cpfValidating: false,
        cpfMensagem: 'Erro ao validar CPF. Tente novamente.',
      }));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'cpf' && value.length >= 14) {
      validarCPF(value);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo_file: file }));

      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload imediato do logo para tornar o fluxo mais simples
      (async () => {
        try {
          setLoading(true);
          const uploadResp: any = await empresaService.uploadLogo(file);
          // Try common response shapes
          const url = uploadResp?.url || uploadResp?.data?.url || uploadResp?.logo_url || uploadResp?.path || uploadResp?.link;
          if (url) {
            setFormData(prev => ({ ...prev, logo_url: url }));
          }
        } catch (err) {
          console.error('Erro ao enviar logo:', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const consultarCEP = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || prev.endereco,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }));
      }
    } catch (err) {
      console.error('Erro ao consultar CEP:', err);
    }
  };

  const titleCaseWords = (value: string) => {
    // List of acronyms and exceptions to preserve
    const exceptions = new Set(['IDEBRASIL', 'CNPJ', 'CPF', 'MEI', 'PJ', 'PF', 'LTDA', 'SA']);
    return value
      .split(' ')
      .map(word => {
        if (!word) return '';
        if (exceptions.has(word.toUpperCase())) return word.toUpperCase();
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const handleWebsiteBlur = () => {
    const val = formData.website || '';
    if (!val) return;
    if (!/^https?:\/\//i.test(val)) {
      setFormData(prev => ({ ...prev, website: `https://${val}` }));
    }
  };

  const handleSubcategoriaToggle = (subcategoriaId: number) => {
    setFormData(prev => ({
      ...prev,
      subcategorias_ids: prev.subcategorias_ids.includes(subcategoriaId)
        ? prev.subcategorias_ids.filter(id => id !== subcategoriaId)
        : [...prev.subcategorias_ids, subcategoriaId]
    }));
  };

  const validarPasso = (step: number): boolean => {
    switch (step) {
      case 0: // Dados pessoais
        return !!(formData.nome && formData.email && formData.celular && formData.cpf &&
                 validation.cpfValid);

      case 1: // Dados da empresa
        return !!(formData.razao_social && formData.cnpj && formData.endereco);

      case 2: // Serviços e categoria
        return !!(formData.descricao_servico && formData.ramo_atuacao && formData.categoria_id);

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validarPasso(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use logo already uploaded by handleLogoChange, or null
      const logoUrl = formData.logo_url || null;

      // Preparar dados da empresa
      const empresaData: Omit<Empresa, 'id' | 'status' | 'criado_em' | 'atualizado_em'> = {
        nome: formData.nome,
        email: formData.email,
        celular: formData.celular,
        cpf: formData.cpf.replace(/\D/g, ''),
        razao_social: formData.razao_social,
        nome_fantasia: formData.nome_fantasia,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        endereco: formData.endereco,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
        telefone: formData.telefone,
        email_empresa: formData.email_empresa,
        website: formData.website,
        instagram: formData.instagram,
        descricao_servico: formData.descricao_servico,
        ramo_atuacao: formData.ramo_atuacao as 'comercio' | 'industrial' | 'prestacao_servico',
        categoria_id: typeof formData.categoria_id === 'string' ? Number(formData.categoria_id) : formData.categoria_id,
        logo_url: logoUrl ?? undefined,
      };

      const response = await empresaService.cadastrarEmpresa(empresaData);

      if (response.success) {
        setSuccess('Empresa cadastrada com sucesso! Aguardando aprovação.');
        setActiveStep(steps.length);
      } else {
        setError(response.message || 'Erro ao cadastrar empresa');
      }
    } catch (error: any) {
      setError(error.message || error.response?.data?.message || 'Erro ao cadastrar empresa');
    } finally {
      setLoading(false);
    }
  };

  const formatarCPF = (value: string) => {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length <= 11) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatarCNPJ = (value: string) => {
    const cnpj = value.replace(/\D/g, '');
    if (cnpj.length <= 14) {
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Dados Pessoais do Responsável
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', titleCaseWords(e.target.value))}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Celular"
                value={formData.celular}
                onChange={(e) => handleInputChange('celular', e.target.value)}
                placeholder="(45) 99999-9999"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CPF"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', formatarCPF(e.target.value))}
                placeholder="000.000.000-00"
                required
                error={validation.cpfValid === false}
                helperText={
                  validation.cpfValidating
                    ? 'Validando CPF na base IDEBRASIL...'
                    : validation.cpfMensagem || (
                        validation.cpfValid === null ? 'Digite o CPF para validação' : ''
                      )
                }
                InputProps={{
                  endAdornment: validation.cpfValidating ? (
                    <CircularProgress size={20} />
                  ) : validation.cpfValid ? (
                    <CheckCircle color="success" />
                  ) : validation.cpfValid === false ? (
                    <Error color="error" />
                  ) : null,
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                Dados da Empresa
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Razão Social"
                value={formData.razao_social}
                onChange={(e) => handleInputChange('razao_social', titleCaseWords(e.target.value))}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome Fantasia"
                value={formData.nome_fantasia}
                onChange={(e) => handleInputChange('nome_fantasia', titleCaseWords(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CNPJ"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', formatarCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Endereço Completo"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Rua, número, bairro, cidade - UF, CEP"
                required
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Bairro"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Estado"
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                placeholder="SP"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="CEP"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                onBlur={consultarCEP}
                placeholder="00000-000"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone Fixo"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(45) 3222-0000"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email da Empresa"
                type="email"
                value={formData.email_empresa}
                onChange={(e) => handleInputChange('email_empresa', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                onBlur={handleWebsiteBlur}
                placeholder="https://www.suaempresa.com.br"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="@suaempresa"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                Serviços e Categorização
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descrição da Empresa"
                value={formData.descricao_servico}
                onChange={(e) => handleInputChange('descricao_servico', e.target.value)}
                placeholder="Descreva os serviços/produtos oferecidos pela sua empresa..."
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Ramo de Atuação</InputLabel>
                <Select
                  value={formData.ramo_atuacao}
                  onChange={(e) => handleInputChange('ramo_atuacao', e.target.value)}
                >
                  <MenuItem value="comercio">Comércio</MenuItem>
                  <MenuItem value="industrial">Industrial</MenuItem>
                  <MenuItem value="prestacao_servico">Prestação de Serviço</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!formData.ramo_atuacao}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.categoria_id}
                  onChange={(e) => handleInputChange('categoria_id', e.target.value)}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {subcategorias.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Subcategorias (opcional)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {subcategorias.map((subcategoria) => (
                    <Chip
                      key={subcategoria.id}
                      label={subcategoria.nome}
                      onClick={() => handleSubcategoriaToggle(subcategoria.id)}
                      color={formData.subcategorias_ids.includes(subcategoria.id) ? 'primary' : 'default'}
                      variant={formData.subcategorias_ids.includes(subcategoria.id) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <PhotoCamera sx={{ mr: 1, verticalAlign: 'middle' }} />
                Logo da Empresa (opcional)
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Escolher Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </Button>

                {logoPreview && (
                  <Avatar
                    src={logoPreview}
                    sx={{ width: 60, height: 60 }}
                    variant="rounded"
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                Confirmação dos Dados
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Verifique se todos os dados estão corretos antes de enviar.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Dados Pessoais
                </Typography>
                <Typography><strong>Nome:</strong> {formData.nome}</Typography>
                <Typography><strong>Email:</strong> {formData.email}</Typography>
                <Typography><strong>Celular:</strong> {formData.celular}</Typography>
                <Typography><strong>CPF:</strong> {formData.cpf}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Dados da Empresa
                </Typography>
                <Typography><strong>Razão Social:</strong> {formData.razao_social}</Typography>
                <Typography><strong>Nome Fantasia:</strong> {formData.nome_fantasia}</Typography>
                <Typography><strong>CNPJ:</strong> {formData.cnpj}</Typography>
                <Typography><strong>Endereço:</strong> {formData.endereco}</Typography>
                {formData.logo_url || logoPreview ? (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={formData.logo_url || logoPreview || undefined} variant="rounded" />
                    <Typography variant="body2">Logo carregada</Typography>
                  </Box>
                ) : null}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Serviços e Categoria
                </Typography>
                <Typography><strong>Ramo:</strong> {formData.ramo_atuacao}</Typography>
                <Typography><strong>Categoria:</strong> {categorias.find(c => c.id === formData.categoria_id)?.nome}</Typography>
                {formData.subcategorias_ids.length > 0 && (
                  <Typography>
                    <strong>Subcategorias:</strong> {subcategorias
                      .filter(s => formData.subcategorias_ids.includes(s.id))
                      .map(s => s.nome)
                      .join(', ')}
                  </Typography>
                )}
                <Typography sx={{ mt: 1 }}>
                  <strong>Descrição:</strong> {formData.descricao_servico}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  Após o envio, sua empresa será analisada pela equipe IDEBRASIL.
                  Você receberá uma notificação por email sobre o status da aprovação.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <Box sx={{ backgroundColor: '#f4f4f5', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(44,44,44,0.12)', textAlign: 'center', p: { xs: 3, md: 5 } }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(46,125,50,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <CheckCircle sx={{ fontSize: 48, color: '#2e7d32' }} />
            </Box>
            <Typography variant="h4" gutterBottom fontWeight={700} color="#2e7d32">
              Cadastro Realizado!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {success}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/'}
              size="large"
              sx={{ bgcolor: '#C23535', '&:hover': { bgcolor: '#A52A2A' }, borderRadius: 2, fontWeight: 700, px: 4 }}
            >
              Voltar ao Início
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f4f4f5', minHeight: '100vh' }}>
      {/* Hero Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #C23535 0%, #A52A2A 100%)',
          py: { xs: 5, md: 7 },
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 700, color: '#fff', mb: 1 }}
          >
            Cadastrar Empresa
          </Typography>
          <Typography sx={{ opacity: 0.9, fontSize: '1.05rem' }}>
            Preencha os dados para ingressar na rede de empresas IDEBRASIL
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        {/* Stepper */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 24px rgba(44,44,44,0.1)',
            border: '1px solid rgba(194,53,53,0.1)',
            overflow: 'visible',
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              pt: { xs: 3, md: 4 },
              pb: 2,
              borderBottom: '1px solid rgba(194,53,53,0.1)',
            }}
          >
            <Stepper
              activeStep={activeStep}
              sx={{
                '& .MuiStepIcon-root.Mui-active': { color: '#C23535' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#C23535' },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 1 }}>
              {renderStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pt: 3, borderTop: '1px solid #f0f0f0' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{
                  borderColor: '#C23535',
                  color: '#C23535',
                  '&:hover': { borderColor: '#A52A2A', bgcolor: '#fff3f3' },
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 3,
                  '&.Mui-disabled': { borderColor: '#ccc', color: '#ccc' },
                }}
              >
                Voltar
              </Button>

              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={!validarPasso(activeStep) || loading}
                startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : null}
                sx={{
                  bgcolor: '#C23535',
                  '&:hover': { bgcolor: '#A52A2A' },
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 4,
                  '&.Mui-disabled': { bgcolor: '#e0e0e0' },
                }}
              >
                {loading
                  ? 'Enviando...'
                  : activeStep === steps.length - 1
                  ? 'Finalizar Cadastro'
                  : 'Próximo'
                }
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EmpresaCadastro;