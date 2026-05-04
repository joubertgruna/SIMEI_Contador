import { default as axios } from 'axios';
import { notificacaoService } from './notificacaoService';
import { Empresa } from './empresaService';
import { getApiUrl } from '../utils/runtimeConfig';

const API_BASE_URL = getApiUrl() || process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface EmpresaStats {
  total_empresas: number;
  empresas_verificadas: number;
  empresas_pendentes: number;
  empresas_por_ramo: {
    comercio: number;
    industrial: number;
    prestacao_servico: number;
  };
}

export interface AdminEmpresa extends Empresa {
  categoria_nome?: string;
  criado_em: Date;
  atualizado_em: Date;
}

class AdminService {
  async obterEstatisticas(): Promise<EmpresaStats> {
    const response = await axios.get(`${API_BASE_URL}/admin/stats`);
    return response.data.data;
  }

  async listarEmpresasPendentes() {
    const response = await axios.get(`${API_BASE_URL}/admin/empresas/pendentes`);
    return response.data;
  }

  async aprovarEmpresa(id: number, observacao?: string) {
    try {
      // Primeiro, buscar dados da empresa para notificação
      const empresas = await this.listarTodasEmpresas();
      const empresa = empresas.data?.find((e: AdminEmpresa) => e.id === id);

      // Aprovar empresa
      const response = await axios.put(`${API_BASE_URL}/admin/empresas/${id}/status`, { 
        status: 'verificado', 
        observacao 
      });

      // Enviar notificação por email
      if (empresa) {
        await notificacaoService.enviarNotificacaoAprovacao(
          empresa.email,
          empresa.nome_fantasia || empresa.razao_social,
          observacao
        );
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao aprovar empresa:', error);
      throw error;
    }
  }

  async rejeitarEmpresa(id: number, motivo: string) {
    try {
      // Primeiro, buscar dados da empresa para notificação
      const empresas = await this.listarTodasEmpresas();
      const empresa = empresas.data?.find((e: AdminEmpresa) => e.id === id);

      // Rejeitar empresa
      const response = await axios.put(`${API_BASE_URL}/admin/empresas/${id}/status`, { 
        status: 'rejeitado', 
        observacao: motivo 
      });

      // Enviar notificação por email
      if (empresa) {
        await notificacaoService.enviarNotificacaoRejeicao(
          empresa.email,
          empresa.nome_fantasia || empresa.razao_social,
          motivo
        );
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao rejeitar empresa:', error);
      throw error;
    }
  }

  async listarTodasEmpresas(filtros: any = {}) {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await axios.get(`${API_BASE_URL}/admin/empresas?${params}`);
    return response.data;
  }

  async atualizarStatusEmpresa(id: number, status: 'pendente' | 'verificado' | 'rejeitado', observacao?: string) {
    const response = await axios.put(`${API_BASE_URL}/admin/empresas/${id}/status`, { status, observacao });
    return response.data;
  }

  async excluirEmpresa(id: number) {
    const response = await axios.delete(`${API_BASE_URL}/admin/empresas/${id}`);
    return response.data;
  }

  async obterLogsAtividade(limite: number = 50) {
    const response = await axios.get(`${API_BASE_URL}/admin/logs?limite=${limite}`);
    return response.data;
  }

  async enviarNotificacaoEmpresa(empresaId: number, titulo: string, mensagem: string) {
    const response = await axios.post(`${API_BASE_URL}/admin/notificacoes`, {
      empresa_id: empresaId,
      titulo,
      mensagem
    });
    return response.data;
  }

  async enviarMensagem(empresaId: number, dados: { assunto: string; mensagem: string; destinatario_email: string; empresa_id: number }) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/empresas/${empresaId}/mensagem`, dados);
      if (response.data.success) {
        console.log(`Mensagem enviada para empresa ${empresaId}`);
      }
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  async editarEmpresa(id: number, dados: Partial<AdminEmpresa>) {
    const response = await axios.put(`${API_BASE_URL}/admin/empresas/${id}`, dados);
    return response.data;
  }

  async editarUsuario(id: number, dados: { nome?: string; email?: string; cpf?: string; telefone?: string; tipo?: string; ativo?: boolean }) {
    const response = await axios.put(`${API_BASE_URL}/admin/usuarios/${id}`, dados);
    return response.data;
  }

  async listarUsuarios() {
    const response = await axios.get(`${API_BASE_URL}/admin/usuarios`);
    return response.data;
  }

  async alterarStatusUsuario(id: number, ativo: boolean) {
    const response = await axios.put(`${API_BASE_URL}/admin/usuarios/${id}/status`, { ativo });
    return response.data;
  }

  async deletarUsuario(id: number) {
    const response = await axios.delete(`${API_BASE_URL}/admin/usuarios/${id}`);
    return response.data;
  }

  async criarEmpresa(dados: {
    razao_social: string; nome_fantasia?: string; cnpj: string; cpf: string;
    email_empresa?: string; telefone?: string; endereco?: string; bairro?: string;
    cep?: string; cidade?: string; estado?: string; ramo_atuacao?: string;
    categoria_id?: number; descricao_servico?: string; website?: string;
    instagram?: string; status?: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/admin/empresas`, dados);
    return response.data;
  }

  async criarUsuario(dados: {
    nome: string; email: string; senha: string;
    cpf?: string; telefone?: string; tipo?: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/admin/usuarios`, dados);
    return response.data;
  }

  async obterMonitoramento() {
    const response = await axios.get(`${API_BASE_URL}/admin/monitoramento`);
    return response.data;
  }

  async listarPlanos() {
    const response = await axios.get(`${API_BASE_URL}/admin/planos`);
    return response.data;
  }

  async atualizarPlano(id: number, plano: 'gratuito' | 'basico' | 'premium', plano_validade?: string) {
    const response = await axios.put(`${API_BASE_URL}/admin/planos/${id}`, { plano, plano_validade });
    return response.data;
  }

  async listarAlunos(busca?: string, pagina = 1, limite = 50) {
    const params = new URLSearchParams({ pagina: String(pagina), limite: String(limite) });
    if (busca) params.append('busca', busca);
    const response = await axios.get(`${API_BASE_URL}/admin/alunos?${params}`);
    return response.data;
  }

  async importarAlunos(arquivo: File, onProgress?: (p: number) => void) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    const response = await axios.post(`${API_BASE_URL}/admin/alunos/importar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
    return response.data;
  }

  async limparAlunos() {
    const response = await axios.delete(`${API_BASE_URL}/admin/alunos/limpar`);
    return response.data;
  }

  async removerAluno(id: number) {
    const response = await axios.delete(`${API_BASE_URL}/admin/alunos/${id}`);
    return response.data;
  }

  async criarAluno(dados: { nome: string; cpf: string; email?: string; telefone?: string; curso?: string; turma?: string; status_aluno?: string }) {
    const response = await axios.post(`${API_BASE_URL}/admin/alunos`, dados);
    return response.data;
  }

  async atualizarAluno(id: number, dados: { nome?: string; cpf?: string; email?: string; telefone?: string; curso?: string; turma?: string; status_aluno?: string }) {
    const response = await axios.put(`${API_BASE_URL}/admin/alunos/${id}`, dados);
    return response.data;
  }

  async validarCPFAluno(cpf: string) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    const response = await axios.get(`${API_BASE_URL}/admin/alunos/validar-cpf/${cpfLimpo}`);
    return response.data as { success: boolean; encontrado: boolean; aluno?: { nome: string; email: string; curso: string; turma: string } };
  }
}

export const adminService = new AdminService();