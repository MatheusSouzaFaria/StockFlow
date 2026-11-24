const DEFAULT = 'http://localhost:8080/api/produtos';
function criarApi(url = DEFAULT, fetchFn = globalThis.fetch) {
  const base = url.replace(/\/+$/, '');
  async function pedir(sufixo = '', opcoes = {}) {
    let resposta;
    try { resposta = await fetchFn(base + sufixo, opcoes); }
    catch { throw new Error('Não foi possível conectar à API. Confira o Java, o endereço e a rede.'); }
    const texto = await resposta.text();
    let dados = null;
    if (texto) { try { dados = JSON.parse(texto); } catch { /* resposta sem JSON */ } }
    if (!resposta.ok) throw new Error(dados?.message || `Erro HTTP ${resposta.status}`);
    if (resposta.status !== 204 && dados === null) throw new Error('A API devolveu uma resposta inválida.');
    return dados;
  }
  return {
    listar: () => pedir(),
    buscar: id => pedir('/' + id),
    movimentar: (id, tipo, quantidade) => pedir('/' + id + '/movimentacao', {
      method: 'PATCH', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({tipo, quantidade})
    })
  };
}
function quantidadeValida(texto) {
  return /^\d+$/.test(texto) && Number(texto) > 0 && Number(texto) <= 2147483647;
}
function estoqueBaixo(p) { return p.quantidade <= p.estoqueMinimo; }

exports.criarApi = criarApi;
exports.quantidadeValida = quantidadeValida;
exports.estoqueBaixo = estoqueBaixo;
