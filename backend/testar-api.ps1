$ErrorActionPreference = 'Stop'
$url = 'http://localhost:8080/api/produtos'
function Check($condicao, $mensagem) { if (!$condicao) { throw $mensagem }; Write-Host "OK: $mensagem" -ForegroundColor Green }
function Mover($tipo, $q) { Invoke-RestMethod -Uri "$rota/movimentacao" -Method Patch -ContentType 'application/json' -Body (@{tipo=$tipo;quantidade=$q}|ConvertTo-Json) }
function EsperarErro($acao, $codigo) {
  try { & $acao | Out-Null } catch { if ([int]$_.Exception.Response.StatusCode -eq $codigo) { Write-Host "OK: HTTP $codigo"; return }; throw }
  throw "Esperava HTTP $codigo, mas a operacao foi aceita"
}
$produto = @{nome='Caderno (teste automatico)';descricao='Pautado';categoria='Papelaria';quantidade=10;estoqueMinimo=3}
$p = Invoke-RestMethod -Uri $url -Method Post -ContentType 'application/json' -Body ($produto|ConvertTo-Json)
$rota = "$url/$($p.id)"
try {
  Check ($p.quantidade -eq 10) 'POST: saldo 10'
  $lista = @(Invoke-RestMethod -Uri $url)
  Check ($lista.id -contains $p.id) 'GET lista: produto encontrado'
  Check ((Invoke-RestMethod -Uri $rota).quantidade -eq 10) 'GET por ID'
  $produto.descricao='Caderno pautado'
  $editado=Invoke-RestMethod -Uri $rota -Method Put -ContentType 'application/json' -Body ($produto|ConvertTo-Json)
  Check ($editado.descricao -eq $produto.descricao) 'PUT'
  Check ((Mover ENTRADA 2).quantidade -eq 12) 'ENTRADA: saldo 12'
  Check ((Mover SAIDA 2).quantidade -eq 10) 'SAIDA: saldo 10'
  $saldo= Mover SAIDA 8
  Check ($saldo.quantidade -eq 2 -and $saldo.estoqueBaixo) 'SAIDA: saldo 2 e estoque baixo'
  EsperarErro { Mover SAIDA 3 } 400
  EsperarErro { Mover ENTRADA 0 } 400
  EsperarErro { Mover OUTRO 1 } 400
  Check ((Invoke-RestMethod -Uri $rota).quantidade -eq 2) 'Saldo permanece 2'
} finally { Invoke-RestMethod -Uri $rota -Method Delete | Out-Null }
EsperarErro { Invoke-RestMethod -Uri $rota } 404
Write-Host 'Teste finalizado. O produto de teste foi excluido.'
