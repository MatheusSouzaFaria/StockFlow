import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { timeout } from 'rxjs';
import { API_URL } from './api.config';
import { Produto, ProdutoDados } from '../models/produto';
@Injectable({providedIn: 'root'})
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly url = API_URL.replace(/\/+$/, '');
  listar() { return this.http.get<Produto[]>(this.url).pipe(timeout(15000)); }
  buscar(id: number) { return this.http.get<Produto>(`${this.url}/${id}`).pipe(timeout(15000)); }
  criar(dados: ProdutoDados) { return this.http.post<Produto>(this.url, dados).pipe(timeout(15000)); }
  editar(id: number, dados: ProdutoDados) { return this.http.put<Produto>(`${this.url}/${id}`, dados).pipe(timeout(15000)); }
  excluir(id: number) { return this.http.delete<void>(`${this.url}/${id}`).pipe(timeout(15000)); }
}
export function mensagemErro(erro: unknown): string {
  if (erro instanceof HttpErrorResponse) {
    if (erro.status === 0) return 'Não foi possível conectar à API. Confira o Java, a URL e a rede.';
    const msg = erro.error?.message;
    if (typeof msg === 'string' && msg.trim()) return msg;
    if (erro.status === 404) return 'Produto não encontrado. Atualize a listagem.';
    if (erro.status === 400) return 'Dados inválidos. Confira o formulário.';
    return `Erro HTTP ${erro.status}. Tente atualizar a lista.`;
  }
  if (erro instanceof Error && erro.name === 'TimeoutError') return 'A API demorou para responder. Atualize a lista antes de repetir uma operação.';
  return 'Não foi possível concluir a operação. Confira a API e tente novamente.';
}
