// Teste opt-in contra o backend REAL, sem mock e sem substituir o Angular.
// Cria somente um produto identificável; remove ao final. Não use em produção.
import assert from 'node:assert/strict';
const url = (process.env.STOCKFLOW_API_URL || 'http://localhost:8080/api/produtos').replace(/\/+$/,'');
let id;
async function req(method, path='', body, esperado=200) {
  const r=await fetch(url+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
  const text=await r.text();
  assert.equal(r.status,esperado,`${method} ${path}: ${text}`);
  console.log(`OK ${method} ${path||'/'} → ${r.status}`);
  return text?JSON.parse(text):null;
}
try {
  const payload={nome:`Caderno (teste Angular ${Date.now()})`,descricao:'Universitário',categoria:'Papelaria',quantidade:10,estoqueMinimo:3};
  await req('GET');
  const criado=await req('POST','',payload,201); id=criado.id;
  assert.ok(Number.isSafeInteger(id)); assert.equal(criado.quantidade,10);
  assert.ok((await req('GET')).some(p=>p.id===id));
  assert.equal((await req('GET',`/${id}`)).nome,payload.nome);
  const editado={...payload,descricao:'Pautado',categoria:'Material escolar'};
  await req('PUT',`/${id}`,editado);
  assert.equal((await req('GET',`/${id}`)).descricao,editado.descricao);
  await req('PUT',`/${id}`,{...editado,quantidade:3});
  assert.equal((await req('GET',`/${id}`)).estoqueBaixo,true);
  await req('POST','',{...payload,nome:' '},400);
  await req('PUT',`/${id}`,{...editado,quantidade:-1},400);
  assert.equal((await req('GET',`/${id}`)).quantidade,3);
  const cors=await fetch(url,{method:'OPTIONS',headers:{Origin:'http://localhost:4200','Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'},signal:AbortSignal.timeout(15000)});
  assert.equal(cors.status,200); assert.ok(['*','http://localhost:4200'].includes(cors.headers.get('access-control-allow-origin'))); console.log('OK CORS');
  await req('DELETE',`/${id}`,undefined,204);
  const removido=id; id=undefined;
  await req('GET',`/${removido}`,undefined,404);
  console.log('Teste HTTP concluído. Teste visual Angular/Expo deve ser feito separadamente.');
} catch(e) { console.error('FALHA:',e); process.exitCode=1; }
finally { if(id!==undefined){try{await req('DELETE',`/${id}`,undefined,204);}catch(e){console.error(`Não foi possível limpar o produto de teste ${id}:`,e);process.exitCode=1;}} }
