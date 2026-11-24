import test from 'node:test';
import assert from 'node:assert/strict';
import { inteiroNaoNegativo, estoqueBaixo, filtrarProdutos, dadosValidos, normalizarDados, produtoMudou } from '../src/app/shared/regras.ts';
const base = {id:1,nome:'Caderno',descricao:null,categoria:'Papelaria',quantidade:10,estoqueMinimo:3};
test('inteiro Java: limites, zero, decimais e nulos',()=>{
  for(const n of [0,1,2147483647]) assert.equal(inteiroNaoNegativo(n),true);
  for(const n of [-1,1.5,2147483648,null,undefined,'3',NaN,Infinity]) assert.equal(inteiroNaoNegativo(n),false);
});
test('estoque baixo: abaixo e igual ao mínimo',()=>{
  for(const n of [0,2,3]) assert.equal(estoqueBaixo({...base,quantidade:n}),true);
  assert.equal(estoqueBaixo({...base,quantidade:4}),false);
});
test('filtro por nome, categoria e situação combinados',()=>{
  const lista=[base,{...base,id:2,nome:'Caderno pequeno',quantidade:2},{...base,id:3,nome:'Caneta',categoria:'Escrita',quantidade:1}];
  assert.deepEqual(filtrarProdutos(lista,' CADERNO ','Papelaria','baixo').map(p=>p.id),[2]);
  assert.deepEqual(filtrarProdutos(lista,'','', 'normal').map(p=>p.id),[1]);
  assert.deepEqual(filtrarProdutos(lista,'','Escrita','todos').map(p=>p.id),[3]);
  assert.deepEqual(filtrarProdutos(lista,'ausente','','todos'),[]);
});
test('campos obrigatórios, descrição opcional e limites do DTO Java',()=>{
  assert.equal(dadosValidos(base),true);
  for(const d of [{nome:' '},{categoria:''},{quantidade:-1},{estoqueMinimo:-1},{quantidade:1.1},{quantidade:null},{estoqueMinimo:null},{nome:'a'.repeat(256)},{categoria:'a'.repeat(256)},{descricao:'a'.repeat(2001)}]) assert.equal(dadosValidos({...base,...d}),false);
  assert.equal(dadosValidos({...base,quantidade:0,estoqueMinimo:0}),true);
});
test('payload de POST/PUT não inclui id nem estoqueBaixo',()=>{
  assert.deepEqual(normalizarDados({...base,nome:' Caderno ',descricao:' ',estoqueBaixo:false}),{nome:'Caderno',descricao:null,categoria:'Papelaria',quantidade:10,estoqueMinimo:3});
});
test('detecção de alterações durante edição',()=>{
  assert.equal(produtoMudou(base,{...base}),false);
  assert.equal(produtoMudou(base,{...base,quantidade:2}),true);
  assert.equal(produtoMudou(base,{...base,descricao:'Nova'}),true);
});
