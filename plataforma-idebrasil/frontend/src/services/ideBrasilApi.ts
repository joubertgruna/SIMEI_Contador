import { default as axios } from 'axios';

export interface ValidacaoCPFResponse {
  success: boolean;
  valido: boolean;
  mensagem: string;
  dados?: {
    nome: string;
    data_nascimento: string;
    situacao_cadastral: string;
  };
}

export interface ValidacaoCNPJResponse {
  success: boolean;
  valido: boolean;
  mensagem: string;
  dados?: {
    razao_social: string;
    nome_fantasia: string;
    situacao_cadastral: string;
    data_abertura: string;
    atividade_principal: string;
  };
}

class IdeBrasilApiService {
  private baseURL = process.env.REACT_APP_IDEBRASIL_API_URL || 'https://api.idebrasil.com.br/v1';
  private apiKey = process.env.REACT_APP_IDEBRASIL_API_KEY;

  constructor() {
    if (!this.apiKey) {
      console.warn('IDEBRASIL_API_KEY não configurada. Usando validação mock.');
    }
  }

  async validarCPF(cpf: string): Promise<ValidacaoCPFResponse> {
    try {
      // Remove caracteres não numéricos
      const cpfLimpo = cpf.replace(/\D/g, '');

      // Validação básica
      if (cpfLimpo.length !== 11) {
        return {
          success: true,
          valido: false,
          mensagem: 'CPF deve conter 11 dígitos'
        };
      }

      // Se não há API key, usar validação mock
      if (!this.apiKey) {
        return this.validarCPFMock(cpfLimpo);
      }

      // Chamada real para API
      const response = await axios.get(`${this.baseURL}/cpf/${cpfLimpo}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        success: true,
        valido: response.data.valido,
        mensagem: response.data.mensagem,
        dados: response.data.dados
      };

    } catch (error: any) {
      console.error('Erro na validação de CPF:', error);

      // Em caso de erro da API, usar validação mock como fallback
      const cpfLimpo = cpf.replace(/\D/g, '');
      return this.validarCPFMock(cpfLimpo);
    }
  }

  async validarCNPJ(cnpj: string): Promise<ValidacaoCNPJResponse> {
    try {
      // Remove caracteres não numéricos
      const cnpjLimpo = cnpj.replace(/\D/g, '');

      // Validação básica
      if (cnpjLimpo.length !== 14) {
        return {
          success: true,
          valido: false,
          mensagem: 'CNPJ deve conter 14 dígitos'
        };
      }

      // Se não há API key, usar validação mock
      if (!this.apiKey) {
        return this.validarCNPJMock(cnpjLimpo);
      }

      // Chamada real para API
      const response = await axios.get(`${this.baseURL}/cnpj/${cnpjLimpo}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        success: true,
        valido: response.data.valido,
        mensagem: response.data.mensagem,
        dados: response.data.dados
      };

    } catch (error: any) {
      console.error('Erro na validação de CNPJ:', error);

      // Em caso de erro da API, usar validação mock como fallback
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      return this.validarCNPJMock(cnpjLimpo);
    }
  }

  private validarCPFMock(cpf: string): ValidacaoCPFResponse {
    // Algoritmo de validação de CPF
    const cpfArray = cpf.split('').map(Number);

    // Verifica se todos os dígitos são iguais
    if (cpfArray.every(digit => digit === cpfArray[0])) {
      return {
        success: true,
        valido: false,
        mensagem: 'CPF inválido - todos os dígitos são iguais'
      };
    }

    // Calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += cpfArray[i] * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;

    if (remainder !== cpfArray[9]) {
      return {
        success: true,
        valido: false,
        mensagem: 'CPF inválido - primeiro dígito verificador incorreto'
      };
    }

    // Calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += cpfArray[i] * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;

    if (remainder !== cpfArray[10]) {
      return {
        success: true,
        valido: false,
        mensagem: 'CPF inválido - segundo dígito verificador incorreto'
      };
    }

    // CPF válido - dados mock
    return {
      success: true,
      valido: true,
      mensagem: 'CPF válido',
      dados: {
        nome: 'Nome Mock do CPF',
        data_nascimento: '1990-01-01',
        situacao_cadastral: 'Regular'
      }
    };
  }

  private validarCNPJMock(cnpj: string): ValidacaoCNPJResponse {
    // Algoritmo de validação de CNPJ
    const cnpjArray = cnpj.split('').map(Number);

    // Verifica se todos os dígitos são iguais
    if (cnpjArray.every(digit => digit === cnpjArray[0])) {
      return {
        success: true,
        valido: false,
        mensagem: 'CNPJ inválido - todos os dígitos são iguais'
      };
    }

    // Calcula primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += cnpjArray[i] * weights1[i];
    }
    let remainder = sum % 11;
    if (remainder < 2) remainder = 0;
    else remainder = 11 - remainder;

    if (remainder !== cnpjArray[12]) {
      return {
        success: true,
        valido: false,
        mensagem: 'CNPJ inválido - primeiro dígito verificador incorreto'
      };
    }

    // Calcula segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += cnpjArray[i] * weights2[i];
    }
    remainder = sum % 11;
    if (remainder < 2) remainder = 0;
    else remainder = 11 - remainder;

    if (remainder !== cnpjArray[13]) {
      return {
        success: true,
        valido: false,
        mensagem: 'CNPJ inválido - segundo dígito verificador incorreto'
      };
    }

    // CNPJ válido - dados mock
    return {
      success: true,
      valido: true,
      mensagem: 'CNPJ válido',
      dados: {
        razao_social: 'Razão Social Mock Ltda',
        nome_fantasia: 'Nome Fantasia Mock',
        situacao_cadastral: 'Ativa',
        data_abertura: '2010-01-01',
        atividade_principal: 'Atividade Mock'
      }
    };
  }

  async consultarCEP(cep: string): Promise<any> {
    try {
      const cepLimpo = cep.replace(/\D/g, '');

      if (cepLimpo.length !== 8) {
        throw new Error('CEP deve conter 8 dígitos');
      }

      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
        timeout: 5000
      });

      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        success: true,
        data: response.data
      };

    } catch (error: any) {
      console.error('Erro na consulta de CEP:', error);
      return {
        success: false,
        error: error.message || 'Erro ao consultar CEP'
      };
    }
  }
}

export const ideBrasilApi = new IdeBrasilApiService();