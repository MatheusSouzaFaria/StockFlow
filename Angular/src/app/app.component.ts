import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Produto, ProdutoDados, Situacao } from './models/produto';
import { API_URL } from './core/api.config';
import { ProdutoService, mensagemErro } from './core/produto.service';
import { estoqueBaixo, filtrarProdutos, produtoMudou } from './shared/regras';
import { ProdutoFormComponent } from './products/produto-form.component';
import { ProdutoListComponent } from './products/produto-list.component';
@Component({selector:'app-root', imports:[FormsModule, ProdutoFormComponent, ProdutoListComponent], templateUrl:'./app.component.html'})
export class AppComponent implements OnInit {
  private readonly api = inject(ProdutoService);
  readonly url = API_URL;
  readonly produtos = signal<Produto[]>([]);
  readonly carregado = signal(false);
  readonly carregando = signal(false);
  readonly operando = signal(false);
  readonly conectado = signal<boolean | null>(null);
  readonly erro = signal('');
  readonly sucesso = signal('');
  readonly busca = signal('');
  readonly categoria = signal('');
  readonly situacao = signal<Situacao>('todos');
  readonly formulario = signal(false);
  readonly editando = signal<Produto|null>(null);
  readonly removendo = signal<Produto|null>(null);
  readonly atualizado = signal('');
  readonly ocupado = computed(() => this.carregando() || this.operando());
  readonly categorias = computed(() => [...new Set(this.produtos().map(p => p.categoria))].sort((a,b)=>a.localeCompare(b,'pt-BR')));
  readonly filtrados = computed(() => filtrarProdutos(this.produtos(),this.busca(),this.categoria(),this.situacao()));
  readonly baixos = computed(() => this.produtos().filter(estoqueBaixo).length);
  readonly unidades = computed(() => this.produtos().reduce((total,p)=>total+p.quantidade,0));
  ngOnInit(): void { void this.atualizar(); }
  private limparMensagens(): void { this.erro.set(''); this.sucesso.set(''); }
  private async carregar(): Promise<void> {
    this.carregando.set(true);
    try {
      this.produtos.set(await firstValueFrom(this.api.listar()));
      this.carregado.set(true); this.conectado.set(true);
      if(this.categoria() && !this.categorias().includes(this.categoria())) this.categoria.set('');
      this.atualizado.set(new Date().toLocaleTimeString('pt-BR'));
    } catch(e) {
      this.conectado.set(false); this.erro.set(mensagemErro(e));
    } finally { this.carregando.set(false); }
  }
  async atualizar(): Promise<void> {
    if(this.ocupado()) return;
    this.limparMensagens(); await this.carregar();
  }
  limparFiltros(): void { this.busca.set(''); this.categoria.set(''); this.situacao.set('todos'); }
  novo(): void { if(this.ocupado()) return; this.limparMensagens(); this.editando.set(null); this.formulario.set(true); }
  async abrirEdicao(p: Produto): Promise<void> {
    if(this.ocupado()) return;
    this.limparMensagens(); this.operando.set(true);
    try { this.editando.set(await firstValueFrom(this.api.buscar(p.id))); this.formulario.set(true); }
    catch(e) { this.erro.set(mensagemErro(e)); await this.carregar(); }
    finally { this.operando.set(false); }
  }
  fecharForm(): void { if(!this.operando()) { this.formulario.set(false); this.editando.set(null); } }
  async salvar(dados: ProdutoDados): Promise<void> {
    if(this.ocupado()) return;
    this.limparMensagens(); this.operando.set(true);
    const anterior = this.editando();
    try {
      if(anterior) {
        const atual = await firstValueFrom(this.api.buscar(anterior.id));
        if(produtoMudou(anterior,atual)) {
          this.formulario.set(false); this.editando.set(null);
          this.erro.set('O produto mudou desde a abertura da edição. Reabra o formulário com os dados atuais. Nenhuma alteração foi enviada.');
          await this.carregar(); return;
        }
        await firstValueFrom(this.api.editar(anterior.id,dados));
      } else { await firstValueFrom(this.api.criar(dados)); }
      this.formulario.set(false); this.editando.set(null);
      this.limparFiltros(); this.sucesso.set(anterior?'Produto atualizado.':'Produto cadastrado.');
      await this.carregar();
    } catch(e) { this.erro.set(mensagemErro(e)); }
    finally { this.operando.set(false); }
  }
  confirmarExclusao(p: Produto): void { if(!this.ocupado()){this.limparMensagens(); this.removendo.set(p);} }
  cancelarExclusao(): void { if(!this.operando()) this.removendo.set(null); }
  async excluir(): Promise<void> {
    const p = this.removendo(); if(!p || this.ocupado()) return;
    this.limparMensagens(); this.operando.set(true);
    try { await firstValueFrom(this.api.excluir(p.id)); this.removendo.set(null); this.sucesso.set('Produto excluído.'); await this.carregar(); }
    catch(e) { this.removendo.set(null); this.erro.set(mensagemErro(e)); await this.carregar(); }
    finally { this.operando.set(false); }
  }
}
