import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos
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
  telefone?: string;
  email_empresa?: string;
  website?: string;
  instagram?: string;
  descricao_servico: string;
  ramo_atuacao: 'comercio' | 'industrial' | 'prestacao_servico';
  categoria_id: number;
  logo_url?: string;
  status: 'pendente' | 'verificado' | 'rejeitado';
  criado_em?: string;
  atualizado_em?: string;
}

interface EmpresaState {
  empresas: Empresa[];
  loading: boolean;
  error: string | null;
}

type EmpresaAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EMPRESAS'; payload: Empresa[] }
  | { type: 'ADD_EMPRESA'; payload: Empresa }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: EmpresaState = {
  empresas: [],
  loading: false,
  error: null,
};

function empresaReducer(state: EmpresaState, action: EmpresaAction): EmpresaState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_EMPRESAS':
      return { ...state, empresas: action.payload, loading: false, error: null };
    case 'ADD_EMPRESA':
      return {
        ...state,
        empresas: [action.payload, ...state.empresas],
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const EmpresaContext = createContext<{
  state: EmpresaState;
  dispatch: React.Dispatch<EmpresaAction>;
} | null>(null);

export const EmpresaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(empresaReducer, initialState);

  return (
    <EmpresaContext.Provider value={{ state, dispatch }}>
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error('useEmpresa must be used within an EmpresaProvider');
  }
  return context;
};