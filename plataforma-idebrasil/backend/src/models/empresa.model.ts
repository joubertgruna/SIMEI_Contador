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
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
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