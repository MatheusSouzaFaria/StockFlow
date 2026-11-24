# StockFlow — Angular | Issues #3 e #4

Frontend web de gerenciamento de estoque, desenvolvido para o backend original StockFlow do Matheus. Angular 20.3 (standalone), TypeScript, Reactive Forms, FormsModule e HttpClient. Sem dados fictícios, localStorage, backend alternativo ou bibliotecas de interface extras. Não contém a funcionalidade de movimentação: essa é do Expo.

## 1. Executar no Windows

Pré-requisitos: Java JDK 17 ou 21 para o backend original, Node.js 22 LTS (22.12+; também compatível com Node 24) e npm. Internet na primeira instalação. Não é necessário instalar Angular CLI globalmente. Versões: https://angular.dev/reference/versions.

1. Extraia esta entrega. Copie `frontend-web/` para a raiz do repositório da equipe, ao lado de `backend/` e `frontend-mobile/` existentes. Não substitua nem copie de novo o Java ou Expo.
2. Abra a raiz do StockFlow no VS Code. Terminal 1, PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Abra http://localhost:8080/api/produtos e confirme que retorna `[]` ou produtos reais. Mantenha esse terminal aberto. O H2 é persistente em `backend/data` e não deve ser enviado ao GitHub.

3. Terminal 2, a partir da raiz do StockFlow:

```powershell
cd frontend-web
node -v
npm install
npm start
```

Abra http://localhost:4200. O `npm start` executa o Angular CLI local (`ng serve --host 0.0.0.0 --port 4200`). Se a porta estiver ocupada, encerre o processo anterior ou execute `npm start -- --port 4201` e use o endereço informado. Não use Live Server nem abra `index.html` diretamente.

4. Para validar o build:

```powershell
npm run build
```

Resultado esperado: build Angular sem erros, arquivos gerados em `dist/stockflow-web/`. Para testar regras locais: `npm test`. Para testar a API real (com Java rodando): `npm run test:api`.

O package-lock.json será gerado no primeiro `npm install` bem-sucedido. Inclua-o no commit. A instalação não foi possível no ambiente de desenvolvimento desta entrega (DNS indisponível); não há lockfile inventado.

## 2. Configurar o endereço da API

Edite `src/app/core/api.config.ts`:

```ts
export const API_URL = 'http://localhost:8080/api/produtos';
```

Se o Java estiver em outro computador, use seu IPv4 real (ex.: `http://192.168.1.100:8080/api/produtos`). Execute `ipconfig` no computador do Java para descobrir o IP. Todos devem estar na mesma rede; firewall deve permitir a porta 8080 se autorizado. Reinicie o Angular depois de alterar a configuração. Angular e Expo precisam acessar a mesma instância do Java.

O teste HTTP separado usa a mesma URL padrão. Para usar um IP diferente no PowerShell:

```powershell
$env:STOCKFLOW_API_URL='http://192.168.1.100:8080/api/produtos'
npm run test:api
```

## 3. Contrato conferido no ZIP original

Backend: Spring Boot 3.5.7, Java 17, Maven, Spring Web/JPA/Validation, H2. Porta 8080, URL H2 `jdbc:h2:file:./data/stockflow`, CORS permite `/api/**` com GET, POST, PUT, DELETE, PATCH, OPTIONS e origens livres para demonstração local. Não expor o Java nem Angular na internet.

| Método | Rota | Sucesso |
|---|---|---|
| GET | /api/produtos | 200, array |
| GET | /api/produtos/{id} | 200, produto |
| POST | /api/produtos | 201, produto |
| PUT | /api/produtos/{id} | 200, produto |
| DELETE | /api/produtos/{id} | 204, sem corpo |

Payload POST e PUT: `{ "nome":"Caderno", "descricao":"Universitário", "categoria":"Papelaria", "quantidade":10, "estoqueMinimo":3 }`. O servidor gera id. A descrição aceita null. O servidor retorna também `estoqueBaixo` booleano calculado (quantidade <= estoqueMinimo). O Angular calcula o mesmo indicador a partir do saldo retornado. Erros do ControllerAdvice usam `{"message":"..."}` (400/404). O frontend exibe essa mensagem e trata falhas de conexão e timeout. Nome e categoria: obrigatórios, até 255 caracteres; descrição: até 2000; números: inteiros de 0 a 2147483647.

PATCH `/api/produtos/{id}/movimentacao` existe no backend, mas não é chamado pelo Angular. Pertence ao Expo.

O PUT substitui todos os campos. A interface lê novamente o produto antes de editar e antes de salvar, rejeitando a edição quando detectar alteração desde a abertura (inclusive uma saída no Expo). Isso reduz o risco de sobrescrita do saldo, mas não garante atomicidade entre GET e PUT; para garantia completa o backend precisaria de controle de versão/ETag, fora deste escopo. Não foi alterado o backend.

## 4. Testes e demonstração

Os testes de `npm test` exercitam as funções puras do código real (não são testes de navegador). `npm run test:api` usa HTTP real, cria um produto de teste com nome único, consulta, edita, testa validações, estoque baixo, CORS e exclui o produto. Não use contra servidor de produção. Se o teste for interrompido ou a conexão cair, pode ser necessário excluir manualmente apenas o produto de teste. Não substitui testes visuais nem comprova persistência após reiniciar.

Ensaio obrigatório no navegador com Java e Angular rodando:

1. Na página de produtos, confira a lista inicial (vazia se o H2 não tiver registros).
2. Clique Novo produto, cadastre Caderno / Caderno universitário / Papelaria / quantidade 10 / mínimo 3. Veja a mensagem e o produto na tabela. Confira GET no navegador.
3. Clique Editar, altere descrição ou categoria, salve e atualize a página. Confira o dado persistido.
4. Pesquise Caderno, filtre categoria e situação. Limpe filtros. Teste mínimo igual ao saldo (3/3), deve aparecer Estoque baixo. Use outro produto para esse ensaio ou restaure o Caderno para 10/3 antes da demonstração.
5. Inicie o Expo original em um terceiro terminal da raiz: `cd frontend-mobile`, `npm install`, `npm run web`. Abra Caderno, registre SAIDA de 8 unidades. No Angular clique Atualizar: saldo 2 e Estoque baixo. No Expo tente SAIDA de 3: deve receber erro e manter 2. Atualize o Angular.
6. Teste cadastro com nome vazio, categoria vazia, quantidade negativa, decimal, vazio e estoque mínimo negativo; deve impedir envio. Com backend parado, clique Atualizar: mensagem de conexão e dados anteriores marcados como possivelmente desatualizados. Reinicie o Java e atualize.
7. Para testar 404, exclua um produto de teste pela API em outra sessão enquanto ele está na listagem; clique Editar no Angular. A mensagem deve aparecer e a lista deve atualizar.
8. Exclua um produto de teste pelo Angular, confirme a exclusão, recarregue e consulte GET por ID (404). Teste cancelar a confirmação antes.
9. Para verificar persistência H2, pare o Java e reinicie na mesma pasta `backend`; atualize o Angular e confirme que os produtos permanecem.

## 5. GitHub Desktop

Branches fornecidas pelo planejamento: `feat/angular-listagem-produtos` (#3) e `feat/angular-crud-produtos` (#4). Para PRs separados, utilize o ZIP complementar da Issue #3 primeiro, a partir da main atualizada, e faça PR com `Closes #3`. Solicite revisão do Matheus. Após a aprovação e merge, atualize main, crie a branch #4 e aplique esta entrega completa, preservando arquivos de outros integrantes. Se já houver Angular, compare arquivos antes de substituir. Faça commits reais das alterações e inclua o lockfile gerado. Se o projeto adotar `dev`, confirme a base com a equipe; a versão final avaliada deve estar na main. Se decidirem um PR único, combinem antes e vinculem as duas issues.

Sugestões de commits: `✨ feat: configura Angular e listagem da API` (Refs #3); `✨ feat: implementa CRUD e filtros de produtos` (Refs #4); `🧪 test: valida regras e integração de produtos` (Refs #4). Não envie node_modules, dist, .angular, ZIP nem arquivos de outros membros. Publish branch / Push origin, PR, revisão do Matheus, merge autorizado e board atualizado. O ZIP não comprova nenhuma dessas ações.

## 6. Estado da validação

Veja VALIDACAO.md. O código foi escrito e as regras puras foram testadas, mas a compilação completa Angular e integração com Spring/H2 precisam ser confirmadas no ambiente da equipe antes do merge.
