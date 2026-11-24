import type { Produto, ProdutoDados, Situacao } from '../models/produto';
export const MAX_INT = 2147483647;
export function inteiroNaoNegativo(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= MAX_INT;
}
export function estoqueBaixo(p: Pick<Produto, 'quantidade' | 'estoqueMinimo'>): boolean {
  return p.quantidade <= p.estoqueMinimo;
}
export function filtrarProdutos(produtos: Produto[], busca: string, categoria: string, situacao: Situacao): Produto[] {
  const termo = busca.trim().toLocaleLowerCase('pt-BR');
  return produtos.filter(p => p.nome.toLocaleLowerCase('pt-BR').includes(termo)
    && (!categoria || p.categoria === categoria)
    && (situacao === 'todos' || (situacao === 'baixo' ? estoqueBaixo(p) : !estoqueBaixo(p))));
}
export function dadosValidos(d: ProdutoDados): boolean {
  return !!d.nome.trim() && d.nome.length <= 255 && !!d.categoria.trim() && d.categoria.length <= 255
    && (d.descricao === null || d.descricao.length <= 2000)
    && inteiroNaoNegativo(d.quantidade) && inteiroNaoNegativo(d.estoqueMinimo);
}
export function normalizarDados(d: ProdutoDados): ProdutoDados {
  return {nome:d.nome.trim(), descricao:d.descricao?.trim() || null, categoria:d.categoria.trim(), quantidade:d.quantidade, estoqueMinimo:d.estoqueMinimo};
}
// O PUT substitui o produto inteiro; detecta alteração desde a abertura do formulário.
export function produtoMudou(a: Produto, b: Produto): boolean {
  return a.nome !== b.nome || a.descricao !== b.descricao || a.categoria !== b.categoria
    || a.quantidade !== b.quantidade || a.estoqueMinimo !== b.estoqueMinimo;
}
