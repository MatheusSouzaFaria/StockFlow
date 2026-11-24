import test from 'node:test';
import assert from 'node:assert/strict';
import {criarApi, quantidadeValida, estoqueBaixo} from '../src/api.js';
test('valida somente quantidade inteira positiva',()=>{
  for(const x of ['0','-1','1.5','','abc','2147483648']) assert.equal(quantidadeValida(x),false);
  for(const x of ['1','8','2147483647']) assert.equal(quantidadeValida(x),true);
});
test('estoque baixo inclusive quando igual ao mínimo',()=>{
  assert.equal(estoqueBaixo({quantidade:3,estoqueMinimo:3}),true);
  assert.equal(estoqueBaixo({quantidade:4,estoqueMinimo:3}),false);
});
test('GET, PATCH e mensagem de erro da API (fetch simulado somente neste teste)',async()=>{
  let saldo=10;
  const api=criarApi('http://teste/api/produtos/',async(url,opts)=>{
    const p={id:7,nome:'Caderno',quantidade:saldo,estoqueMinimo:3};
    if(opts.method==='PATCH') {
      assert.equal(url,'http://teste/api/produtos/7/movimentacao');
      assert.equal(opts.headers['Content-Type'],'application/json');
      const d=JSON.parse(opts.body); assert.equal(d.tipo,'SAIDA');
      if(d.quantidade>saldo) return new Response(JSON.stringify({message:'Estoque insuficiente'}),{status:400});
      saldo-=d.quantidade; return new Response(JSON.stringify({...p,quantidade:saldo}));
    }
    return new Response(JSON.stringify(url.endsWith('/7')?p:[p]));
  });
  assert.equal((await api.listar())[0].quantidade,10);
  assert.equal((await api.movimentar(7,'SAIDA',8)).quantidade,2);
  await assert.rejects(api.movimentar(7,'SAIDA',3),/Estoque insuficiente/);
  assert.equal((await api.buscar(7)).quantidade,2);
});
test('erro de conexão legível',async()=>{
  const api=criarApi('http://teste',async()=>{throw new Error('offline');});
  await assert.rejects(api.listar(),/conectar à API/);
});
