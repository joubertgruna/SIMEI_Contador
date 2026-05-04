import { default as axios } from 'axios';
import { ideBrasilApi } from './ideBrasilApi';
import { getApiUrl } from '../utils/runtimeConfig';

// Read runtime-injected API URL (env-config.js) with fallbacks
const API_BASE_URL = getApiUrl() || process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface Empresa {
  id?: number;
  nome: string;
  email: string;
  celular: string;
  cpf: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  endereco: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string;
  email_empresa?: string;
  website?: string;
  instagram?: string;
  descricao_servico: string;
  ramo_atuacao: 'comercio' | 'industrial' | 'prestacao_servico';
  categoria_id: number;
  logo_url?: string;
  status: 'pendente' | 'verificado' | 'rejeitado';
  criado_em?: Date;
  atualizado_em?: Date;
}

export interface Categoria {
  id: number;
  nome: string;
  ramo_atuacao: 'comercio' | 'industrial' | 'prestacao_servico';
}

export interface Subcategoria {
  id: number;
  nome: string;
  categoria_id: number;
}

export interface EmpresaFilters {
  nome?: string;
  categoria?: number;
  subcategorias?: number[];
  estado?: string;
  cidade?: string;
  ramo_atuacao?: string;
  status?: string;
  pagina?: number;
  limite?: number;
}

class EmpresaService {
  async listarEmpresas(filters: EmpresaFilters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await axios.get(`${API_BASE_URL}/empresas?${params}`);
    return response.data;
  }

  async obterEmpresa(id: number) {
    const response = await axios.get(`${API_BASE_URL}/empresas/${id}`);
    return response.data;
  }

  async cadastrarEmpresa(empresaData: Omit<Empresa, 'id' | 'status' | 'criado_em' | 'atualizado_em'>) {
    try {
      // Validações antes do cadastro
      const cpfValidation = await this.validarCPF(empresaData.cpf);
      if (!cpfValidation.valido) {
        throw new Error(cpfValidation.mensagem);
      }

      const response = await axios.post(`${API_BASE_URL}/empresas`, empresaData);
      return response.data;
    } catch (error: any) {
      if (error.message.includes('CPF') || error.message.includes('CNPJ')) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Erro ao cadastrar empresa');
    }
  }

  async atualizarEmpresa(id: number, empresaData: Partial<Empresa>) {
    const response = await axios.put(`${API_BASE_URL}/empresas/${id}`, empresaData);
    return response.data;
  }

  async excluirEmpresa(id: number) {
    const response = await axios.delete(`${API_BASE_URL}/empresas/${id}`);
    return response.data;
  }

  async validarCPF(cpf: string) {
    try {
      const cpfLimpo = cpf.replace(/\D/g, '');
      // Validate against local alunos base
      const response = await axios.get(`${API_BASE_URL}/admin/alunos/validar-cpf/${cpfLimpo}`);
      const data = response.data as { success: boolean; encontrado: boolean; aluno?: { nome: string; email: string; curso: string } };

      if (!data.success) {
        return { valido: false, mensagem: 'Erro na validação do CPF' };
      }

      if (data.encontrado && data.aluno) {
        return {
          valido: true,
          mensagem: `CPF verificado ✓ — Bem-vindo(a), ${data.aluno.nome}!`,
          dados: { nome: data.aluno.nome, data_nascimento: '', situacao_cadastral: 'Regular' },
        };
      }

      return {
        valido: false,
        mensagem: 'CPF não encontrado em nossa base de alunos IDEBRASIL. Para regularizar, entre em contato com o suporte.',
      };
    } catch (error) {
      console.error('Erro ao validar CPF:', error);
      return {
        valido: false,
        mensagem: 'Erro ao validar CPF. Tente novamente.',
      };
    }
  }

  async validarCNPJ(cnpj: string) {
    try {
      const response = await ideBrasilApi.validarCNPJ(cnpj);

      if (!response.success) {
        return {
          valido: false,
          mensagem: 'Erro na validação do CNPJ'
        };
      }

      return {
        valido: response.valido,
        mensagem: response.mensagem,
        dados: response.dados
      };
    } catch (error) {
      console.error('Erro ao validar CNPJ:', error);
      return {
        valido: false,
        mensagem: 'Erro ao validar CNPJ. Tente novamente.'
      };
    }
  }

  async consultarCEP(cep: string) {
    return await ideBrasilApi.consultarCEP(cep);
  }

  async listarCategorias(ramoAtuacao?: string) {
    const params = ramoAtuacao ? `?ramo_atuacao=${ramoAtuacao}` : '';
    const response = await axios.get(`${API_BASE_URL}/categorias${params}`);
    return response.data;
  }

  async listarSubcategorias(categoriaId: number) {
    const response = await axios.get(`${API_BASE_URL}/categorias/${categoriaId}/subcategorias`);
    return response.data;
  }

  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await axios.post(`${API_BASE_URL}/upload/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const empresaService = new EmpresaService();