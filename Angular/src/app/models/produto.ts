export interface ProdutoDados {
  nome: string;
  descricao: string | null;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
}
export interface Produto extends ProdutoDados {
  id: number;
  estoqueBaixo?: boolean;
}
export type Situacao = 'todos' | 'normal' | 'baixo';
