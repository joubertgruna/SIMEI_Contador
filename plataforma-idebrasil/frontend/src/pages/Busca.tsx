import React, { useState, useEffect, useCallback } from 'react';
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
  Chip,
  Pagination,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Search,
  Business,
  LocationOn,
  Clear,
} from '@mui/icons-material';
import { empresaService, Empresa, Categoria, Subcategoria, EmpresaFilters } from '../services/empresaService';

interface EmpresaComCategoria extends Empresa {
  categoria_nome?: string;
}

const Busca: React.FC = () => {
  const [empresas, setEmpresas] = useState<EmpresaComCategoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);

  // Quando ramo muda, recarregar categorias filtradas e limpar categoria/subcategorias
  const handleRamoChange = (ramo: string) => {
    setFiltros(prev => ({ ...prev, ramo_atuacao: ramo, categoria: undefined, subcategorias: [] }));
    setSubcategorias([]);
    setPaginaAtual(1);
    if (ramo) {
      empresaService.listarCategorias(ramo).then(r => { if (r.success) setCategorias(r.data); }).catch(() => {});
    } else {
      empresaService.listarCategorias().then(r => { if (r.success) setCategorias(r.data); }).catch(() => {});
    }
  };

  const handleCategoriaChange = (catId: number | '') => {
    setFiltros(prev => ({ ...prev, categoria: catId || undefined, subcategorias: [] }));
    setPaginaAtual(1);
  };

  const toggleSubcategoria = (id: number) => {
    setFiltros(prev => ({
      ...prev,
      subcategorias: (prev.subcategorias || []).includes(id)
        ? (prev.subcategorias || []).filter(s => s !== id)
        : [...(prev.subcategorias || []), id],
    }));
    setPaginaAtual(1);
  };

  const [filtros, setFiltros] = useState<EmpresaFilters>({
    nome: '',
    categoria: undefined,
    subcategorias: [],
    estado: '',
    cidade: '',
    ramo_atuacao: '',
    pagina: 1,
    limite: 12,
  });

  const carregarCategorias = useCallback(async () => {
    try {
      const response = await empresaService.listarCategorias();
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }, []);

  const buscarEmpresas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filtrosBusca = {
        ...filtros,
        pagina: paginaAtual,
      };

      const response = await empresaService.listarEmpresas(filtrosBusca);

      if (response.success) {
        setEmpresas(response.data);
        setTotalEmpresas(response.pagination.total);
        setTotalPaginas(response.pagination.paginas);
      } else {
        setError('Erro ao buscar empresas');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao buscar empresas');
    } finally {
      setLoading(false);
    }
  }, [filtros, paginaAtual]);

  useEffect(() => {
    carregarCategorias();
    buscarEmpresas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    buscarEmpresas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaAtual]);

  const carregarSubcategorias = useCallback(async () => {
    if (!filtros.categoria) return;

    try {
      const response = await empresaService.listarSubcategorias(filtros.categoria);
      if (response.success) {
        setSubcategorias(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar subcategorias:', error);
    }
  }, [filtros.categoria]);

  useEffect(() => {
    if (filtros.categoria) {
      carregarSubcategorias();
    } else {
      setSubcategorias([]);
    }
  }, [filtros.categoria, carregarSubcategorias]);

  const handleFiltroChange = (campo: keyof EmpresaFilters, valor: any) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginaAtual(1); // Reset para primeira página
  };

  const limparFiltros = () => {
    setFiltros({
      nome: '',
      categoria: undefined,
      subcategorias: [],
      estado: '',
      cidade: '',
      ramo_atuacao: '',
      pagina: 1,
      limite: 12,
    });
    setPaginaAtual(1);
  };

  const handleBuscaRapida = () => {
    buscarEmpresas();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleBuscaRapida();
    }
  };

  const filtrosAtivos = Object.entries(filtros).filter(([key, value]) => {
    if (key === 'pagina' || key === 'limite') return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== undefined;
  });

  return (
    <Box sx={{ backgroundColor: '#f4f4f5', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, #C23535 0%, #A52A2A 100%)',
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            sx={{ fontSize: { xs: '1.8rem', md: '2.6rem' }, fontWeight: 700, mb: 1, color: '#fff' }}
          >
            Encontre Empresas Parceiras
          </Typography>
          <Typography sx={{ opacity: 0.92, mb: 4, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Conecte-se com empresas validadas da comunidade IDEBRASIL e descubra oportunidades de negócio
          </Typography>

          {/* Barra de busca principal */}
          <Paper
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nome, serviço ou descrição..."
                  value={filtros.nome}
                  onChange={(e) => handleFiltroChange('nome', e.target.value)}
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#C23535' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Ramo</InputLabel>
                  <Select
                    value={filtros.ramo_atuacao}
                    onChange={(e) => handleRamoChange(e.target.value)}
                    label="Ramo"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value=""><em>Todos</em></MenuItem>
                    <MenuItem value="comercio">Comércio</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                    <MenuItem value="prestacao_servico">Prestação de Serviço</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={filtros.categoria || ''}
                    onChange={(e) => handleCategoriaChange(e.target.value ? parseInt(e.target.value as string) : '')}
                    label="Categoria"
                    disabled={categorias.length === 0}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value=""><em>Todas</em></MenuItem>
                    {categorias.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleBuscaRapida}
                    startIcon={<Search />}
                    fullWidth
                    sx={{
                      bgcolor: '#C23535',
                      '&:hover': { bgcolor: '#A52A2A' },
                      borderRadius: 2,
                      fontWeight: 700,
                      py: 1,
                    }}
                  >
                    Buscar
                  </Button>
                  {filtrosAtivos.length > 0 && (
                    <Button
                      variant="outlined"
                      onClick={limparFiltros}
                      startIcon={<Clear />}
                      sx={{ borderRadius: 2, borderColor: '#C23535', color: '#C23535', '&:hover': { borderColor: '#A52A2A', bgcolor: '#fff3f3' } }}
                    >
                      Limpar
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Subcategorias */}
            {subcategorias.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 600 }}>
                  Subcategorias:
                </Typography>
                {subcategorias.map((sub) => (
                  <Chip
                    key={sub.id}
                    label={sub.nome}
                    size="small"
                    onClick={() => toggleSubcategoria(sub.id)}
                    sx={{
                      cursor: 'pointer',
                      ...(filtros.subcategorias || []).includes(sub.id)
                        ? { bgcolor: '#C23535', color: '#fff', '&:hover': { bgcolor: '#A52A2A' } }
                        : { borderColor: '#C23535', color: '#C23535' },
                    }}
                    variant={(filtros.subcategorias || []).includes(sub.id) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            )}

            {/* Filtros de localização */}
            <Box
              sx={{
                mt: 2,
                display: filtrosExpandidos ? 'flex' : 'none',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <TextField
                size="small"
                label="Estado"
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value.toUpperCase().slice(0, 2))}
                placeholder="PR"
                inputProps={{ maxLength: 2 }}
                sx={{ width: 90, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                size="small"
                label="Cidade"
                value={filtros.cidade}
                onChange={(e) => handleFiltroChange('cidade', e.target.value)}
                placeholder="Cascavel"
                sx={{ width: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}
                sx={{ color: '#C23535', fontSize: 12, fontWeight: 600 }}
              >
                {filtrosExpandidos ? '▲ Ocultar localização' : '▼ Filtrar por Estado / Cidade'}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Resultados */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2C2C' }}>
            {loading ? 'Buscando...' : (
              <>
                <Box component="span" sx={{ color: '#C23535' }}>{totalEmpresas}</Box>
                {` empresa${totalEmpresas !== 1 ? 's' : ''} encontrada${totalEmpresas !== 1 ? 's' : ''}`}
              </>
            )}
          </Typography>

          {filtrosAtivos.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {filtrosAtivos.map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${Array.isArray(value) ? value.length : value}`}
                  size="small"
                  onDelete={() => handleFiltroChange(key as keyof EmpresaFilters, Array.isArray(value) ? [] : '')}
                  sx={{ bgcolor: '#fff3f3', color: '#C23535', border: '1px solid #C23535' }}
                />
              ))}
            </Box>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#C23535' }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {empresas.map((empresa) => {
                const cidadeExibicao = (empresa as any).cidade || '';
                const estadoExibicao = (empresa as any).estado || '';

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={empresa.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        borderRadius: 3,
                        border: '1px solid rgba(194,53,53,0.1)',
                        boxShadow: '0 2px 12px rgba(44,44,44,0.08)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 12px 32px rgba(194,53,53,0.18)',
                          borderColor: 'rgba(194,53,53,0.35)',
                        },
                      }}
                      onClick={() => window.location.href = `/empresa/${empresa.id}`}
                    >
                      <Box
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <Avatar
                          src={empresa.logo_url || undefined}
                          variant="rounded"
                          sx={{
                            width: 52,
                            height: 52,
                            bgcolor: '#C23535',
                            borderRadius: 2,
                            fontSize: 22,
                            fontWeight: 700,
                          }}
                        >
                          {(empresa.nome_fantasia || empresa.razao_social || 'E')[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" noWrap fontWeight={700} color="#2C2C2C">
                            {empresa.nome_fantasia || empresa.razao_social}
                          </Typography>
                          <Typography variant="body2" color="#C23535" noWrap fontWeight={500} fontSize={12}>
                            {empresa.categoria_nome}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent sx={{ flex: 1, pt: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.5 }}>
                          {empresa.descricao_servico.length > 90
                            ? `${empresa.descricao_servico.substring(0, 90)}...`
                            : empresa.descricao_servico
                          }
                        </Typography>

                        {(cidadeExibicao || estadoExibicao) && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <LocationOn sx={{ fontSize: 15, color: '#C23535' }} />
                            <Typography variant="body2" color="text.secondary" fontSize={12}>
                              {cidadeExibicao}{cidadeExibicao && estadoExibicao ? ', ' : ''}{estadoExibicao}
                            </Typography>
                          </Box>
                        )}

                        {empresa.website && (
                          <Chip
                            label="Website"
                            size="small"
                            sx={{ bgcolor: '#fff3f3', color: '#C23535', fontSize: 11, height: 22 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {empresas.length === 0 && !loading && (
              <Paper
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '1px solid rgba(194,53,53,0.12)',
                  boxShadow: 'none',
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: '#fff3f3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Business sx={{ fontSize: 40, color: '#C23535' }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color="#2C2C2C" gutterBottom>
                  Nenhuma empresa encontrada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tente ajustar os filtros ou{' '}
                  <Box component="a" href="/empresa/cadastro" sx={{ color: '#C23535', fontWeight: 600, textDecoration: 'none' }}>
                    cadastre sua empresa
                  </Box>
                  {' '}no IDEBRASIL.
                </Typography>
              </Paper>
            )}

            {totalPaginas > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPaginas}
                  page={paginaAtual}
                  onChange={(_, page) => setPaginaAtual(page)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root.Mui-selected': {
                      bgcolor: '#C23535',
                      '&:hover': { bgcolor: '#A52A2A' },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Busca;