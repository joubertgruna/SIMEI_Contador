import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  Business,
  People,
  BarChart,
  PieChart,
  Timeline,
  Download,
  // DateRange removed (unused)
} from '@mui/icons-material';
import { adminService, EmpresaStats } from '../services/adminService';

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

const Relatorios: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<EmpresaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState('30d');

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const statsResponse = await adminService.obterEstatisticas();
      setStats(statsResponse);
    } catch (error: any) {
      setError('Erro ao carregar dados dos relatórios');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExportar = (formato: 'pdf' | 'excel' | 'csv') => {
    // TODO: Implementar exportação
    console.log(`Exportando relatório em formato ${formato}`);
  };

  // Dados mock para gráficos (até implementar Recharts)
  const dadosGraficoEmpresas = [
    { mes: 'Jan', total: 45, aprovadas: 38, rejeitadas: 7 },
    { mes: 'Fev', total: 52, aprovadas: 44, rejeitadas: 8 },
    { mes: 'Mar', total: 48, aprovadas: 41, rejeitadas: 7 },
    { mes: 'Abr', total: 61, aprovadas: 52, rejeitadas: 9 },
    { mes: 'Mai', total: 55, aprovadas: 47, rejeitadas: 8 },
    { mes: 'Jun', total: 67, aprovadas: 58, rejeitadas: 9 },
  ];

  const dadosPorCategoria = [
    { categoria: 'Serviços Gerais', quantidade: 45, percentual: 30 },
    { categoria: 'Comércio', quantidade: 38, percentual: 25 },
    { categoria: 'Tecnologia', quantidade: 28, percentual: 19 },
    { categoria: 'Construção', quantidade: 22, percentual: 15 },
    { categoria: 'Saúde', quantidade: 17, percentual: 11 },
  ];

  const dadosPorEstado = [
    { estado: 'SP', quantidade: 67, percentual: 45 },
    { estado: 'RJ', quantidade: 32, percentual: 21 },
    { estado: 'MG', quantidade: 28, percentual: 19 },
    { estado: 'RS', quantidade: 15, percentual: 10 },
    { estado: 'PR', quantidade: 8, percentual: 5 },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando relatórios...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Relatórios e Estatísticas - IDEBRASIL
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={periodo}
              label="Período"
              onChange={(e) => setPeriodo(e.target.value)}
            >
              <MenuItem value="7d">Últimos 7 dias</MenuItem>
              <MenuItem value="30d">Últimos 30 dias</MenuItem>
              <MenuItem value="90d">Últimos 90 dias</MenuItem>
              <MenuItem value="1y">Último ano</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleExportar('pdf')}
          >
            Exportar PDF
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Cards de Resumo */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Business color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Empresas</Typography>
                </Box>
                <Typography variant="h3" color="primary">
                  {stats.total_empresas}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +12% em relação ao mês anterior
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Aprovadas</Typography>
                </Box>
                <Typography variant="h3" color="success.main">
                  {stats.empresas_verificadas}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Taxa de aprovação: {stats.total_empresas > 0 ? Math.round((stats.empresas_verificadas / stats.total_empresas) * 100) : 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Timeline color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Pendentes</Typography>
                </Box>
                <Typography variant="h3" color="warning.main">
                  {stats.empresas_pendentes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aguardando análise
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Crescimento</Typography>
                </Box>
                <Typography variant="h3" color="info.main">
                  +18%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crescimento mensal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Abas de Relatórios */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Visão Geral" />
          <Tab label="Por Categoria" />
          <Tab label="Por Localização" />
          <Tab label="Tendências" />
        </Tabs>

        {/* Visão Geral */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <BarChart sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Evolução de Cadastros
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography color="text.secondary">
                      Gráfico de evolução mensal (Recharts será implementado)
                    </Typography>
                  </Box>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Mês</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="right">Aprovadas</TableCell>
                          <TableCell align="right">Rejeitadas</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dadosGraficoEmpresas.map((row) => (
                          <TableRow key={row.mes}>
                            <TableCell>{row.mes}</TableCell>
                            <TableCell align="right">{row.total}</TableCell>
                            <TableCell align="right">{row.aprovadas}</TableCell>
                            <TableCell align="right">{row.rejeitadas}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PieChart sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Distribuição por Ramo
                  </Typography>
                  <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography color="text.secondary">
                      Gráfico pizza (Recharts)
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      🏪 Comércio: {stats?.empresas_por_ramo.comercio} ({stats?.total_empresas ? Math.round((stats.empresas_por_ramo.comercio / stats.total_empresas) * 100) : 0}%)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      🏭 Industrial: {stats?.empresas_por_ramo.industrial} ({stats?.total_empresas ? Math.round((stats.empresas_por_ramo.industrial / stats.total_empresas) * 100) : 0}%)
                    </Typography>
                    <Typography variant="body2">
                      🛠️ Prestação de Serviço: {stats?.empresas_por_ramo.prestacao_servico} ({stats?.total_empresas ? Math.round((stats.empresas_por_ramo.prestacao_servico / stats.total_empresas) * 100) : 0}%)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Por Categoria */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Empresas por Categoria
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoria</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell align="right">Percentual</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dadosPorCategoria.map((row) => (
                      <TableRow key={row.categoria}>
                        <TableCell>{row.categoria}</TableCell>
                        <TableCell align="right">{row.quantidade}</TableCell>
                        <TableCell align="right">{row.percentual}%</TableCell>
                        <TableCell>
                          <Chip
                            label={row.quantidade > 30 ? 'Alta Demanda' : row.quantidade > 20 ? 'Média' : 'Baixa'}
                            color={row.quantidade > 30 ? 'success' : row.quantidade > 20 ? 'warning' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Por Localização */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribuição por Estado
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography color="text.secondary">
                      Mapa do Brasil (será implementado)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Estados
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Estado</TableCell>
                          <TableCell align="right">Empresas</TableCell>
                          <TableCell align="right">%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dadosPorEstado.map((row) => (
                          <TableRow key={row.estado}>
                            <TableCell>{row.estado}</TableCell>
                            <TableCell align="right">{row.quantidade}</TableCell>
                            <TableCell align="right">{row.percentual}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tendências */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Métricas de Performance
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Tempo médio de aprovação:</Typography>
                      <Typography variant="body2" fontWeight="bold">2.3 dias</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Taxa de conversão:</Typography>
                      <Typography variant="body2" fontWeight="bold">78%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Satisfação do usuário:</Typography>
                      <Typography variant="body2" fontWeight="bold">4.6/5</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Retenção mensal:</Typography>
                      <Typography variant="body2" fontWeight="bold">92%</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Insights e Recomendações
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Alert severity="success" variant="outlined">
                      <Typography variant="body2">
                        <strong>Categoria em alta:</strong> Tecnologia cresceu 45% este mês
                      </Typography>
                    </Alert>
                    <Alert severity="info" variant="outlined">
                      <Typography variant="body2">
                        <strong>Oportunidade:</strong> Alto potencial no estado do Paraná
                      </Typography>
                    </Alert>
                    <Alert severity="warning" variant="outlined">
                      <Typography variant="body2">
                        <strong>Atenção:</strong> Aumento de 15% em cadastros pendentes
                      </Typography>
                    </Alert>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Relatorios;