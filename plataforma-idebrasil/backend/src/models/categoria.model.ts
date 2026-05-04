export interface Categoria {
  id?: number;
  nome: string;
  ramo_atuacao: 'comercio' | 'industrial' | 'prestacao_servico';
  criado_em?: Date;
}

export interface Subcategoria {
  id?: number;
  nome: string;
  categoria_id: number;
  criado_em?: Date;
}

export interface CategoriaComSubcategorias extends Categoria {
  subcategorias: Subcategoria[];
}