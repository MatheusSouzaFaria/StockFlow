import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Produto } from '../models/produto';
import { estoqueBaixo } from '../shared/regras';
@Component({selector:'app-produto-list', templateUrl:'./produto-list.component.html'})
export class ProdutoListComponent {
  @Input({required:true}) produtos: Produto[] = [];
  @Input() ocupado = false;
  @Output() editar = new EventEmitter<Produto>();
  @Output() excluir = new EventEmitter<Produto>();
  readonly baixo = estoqueBaixo;
}
