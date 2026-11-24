import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Produto, ProdutoDados } from '../models/produto';
import { dadosValidos, inteiroNaoNegativo, normalizarDados } from '../shared/regras';
function textoObrigatorio(c: AbstractControl): ValidationErrors | null {
  return typeof c.value === 'string' && c.value.trim() ? null : {obrigatorio:true};
}
function inteiro(c: AbstractControl): ValidationErrors | null {
  return inteiroNaoNegativo(c.value) ? null : {inteiro:true};
}
@Component({selector:'app-produto-form', imports:[ReactiveFormsModule], templateUrl:'./produto-form.component.html'})
export class ProdutoFormComponent implements OnInit {
  @Input() produto: Produto | null = null;
  @Input() ocupado = false;
  @Output() salvar = new EventEmitter<ProdutoDados>();
  @Output() cancelar = new EventEmitter<void>();
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly form = this.fb.group({
    nome: ['', [textoObrigatorio, Validators.maxLength(255)]],
    descricao: ['', Validators.maxLength(2000)],
    categoria: ['', [textoObrigatorio, Validators.maxLength(255)]],
    quantidade: [0, inteiro], estoqueMinimo: [0, inteiro]
  });
  ngOnInit(): void {
    const p = this.produto;
    if (p) this.form.reset({nome:p.nome, descricao:p.descricao ?? '', categoria:p.categoria, quantidade:p.quantidade, estoqueMinimo:p.estoqueMinimo});
  }
  invalido(campo: keyof ProdutoDados): boolean {
    const c = this.form.controls[campo]; return c.invalid && (c.touched || c.dirty);
  }
  enviar(): void {
    if (this.ocupado) return;
    this.form.markAllAsTouched();
    const dados = this.form.getRawValue();
    if (this.form.invalid || !dadosValidos(dados)) return;
    this.salvar.emit(normalizarDados(dados));
  }
}
