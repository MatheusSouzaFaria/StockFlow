# StockFlow

O **StockFlow** é um projeto full stack desenvolvido para facilitar o controle e o acompanhamento de produtos e movimentações de estoque.

A aplicação integra uma **API REST em Java Spring Boot**, com banco de dados **H2**, a interfaces **Angular** e **Expo (React Native)**.

Na versão web, é possível **cadastrar, consultar, editar, excluir e filtrar produtos**, além de acompanhar a quantidade disponível e identificar produtos com estoque baixo.

No aplicativo mobile, os usuários podem **visualizar os produtos, consultar seus detalhes e registrar entradas e saídas de mercadorias**, utilizando a mesma API.

O projeto valoriza a **integração entre plataformas, as regras de negócio, o trabalho em equipe e as boas práticas de versionamento com GitHub**.

## 👥 Integrantes

- **Diego Stocco Oliveira** — Interface Angular, aplicativo mobile, integração, testes, README e documentação.
- **Matheus Souza de Faria** — Backend Java Spring Boot, banco de dados H2, API REST e movimentações de estoque.

---

## 📚 Documentação do Projeto

<!-- Espaço reservado para adicionar o link do Google Drive com a documentação do projeto. -->

---

## 📎 Links importantes

- Repositório GitHub:
- GitHub Projects:
- Documentação do Projeto:

---

## ⏱️ Cronograma — 210 minutos

| Período | Atividade |
|---|---|
| 00:00–00:20 | Organização, repositório, Issues e Board |
| 00:20–00:55 | Estrutura da API e contrato de dados |
| 00:55–01:45 | Desenvolvimento paralelo de Angular e Expo |
| 01:45–02:30 | Integração, validações e Pull Requests |
| 02:30–03:05 | Testes, correções, merges e README |
| 03:05–03:30 | Apresentação e avaliação |

As atividades podem ocorrer em paralelo.

## 🏆 Critérios de avaliação — Nota máxima 10,0

| Critério | Pontos | O que será avaliado |
|---|---:|---|
| Backend Java Spring Boot | 2,0 | API REST, H2, camadas, validação e regra de saldo |
| Frontend Angular | 1,5 | CRUD, listagem e indicação de estoque baixo |
| Aplicativo Expo | 1,5 | Listagem, detalhes e entrada/saída |
| Integração das três tecnologias | 1,5 | Fluxo Angular → API → Expo → API → Angular |
| GitHub, branches, PRs e rastreabilidade individual | 1,5 | Commits, PR por integrante, revisão e Issues vinculadas |
| GitHub Projects | 1,0 | Board, tarefas, responsáveis e movimentação |
| README e apresentação | 1,0 | Instruções de execução e demonstração |
| **Total** | **10,0** | |

**Regras de correção:** os pontos serão proporcionais ao que for efetivamente demonstrado. Interfaces com dados fictícios não recebem pontuação integral de integração. A nota individual poderá ser ajustada se houver evidências de participação insuficiente. O uso de IA não gera desconto na nota.

## 📦 Entrega obrigatória

Até o encerramento, deverão ser apresentados os links do repositório GitHub e do GitHub Projects.

A versão avaliada será a da branch `main`.

### Checklist de entrega

- [ ] Repositório acessível ao professor e branch `main` integrada.
- [ ] API Java/H2 com validação de estoque.
- [ ] Angular com CRUD e indicação de estoque baixo.
- [ ] Expo com consulta e movimentação.
- [ ] Demonstração completa do fluxo e rejeição de saída inválida.
- [ ] Pelo menos 6 Issues no Board de 3 colunas.
- [ ] Pelo menos um PR técnico por integrante, revisado e integrado.
- [ ] Commits no padrão estudado.
- [ ] README com integrantes, URL da API, instruções de execução e configuração do IP para acesso pelo celular.

## ⚙️ Tecnologias utilizadas

- Java Spring Boot
- H2 Database
- Angular
- Expo / React Native
- GitHub
- GitHub Projects

---

## ⚙️ Guia de Execução — StockFlow

Este guia explica como executar o projeto completo localmente no Windows. O Java é responsável pela API e pelo banco H2, enquanto o Angular e o Expo são as interfaces web e mobile.

### 1. Pré-requisitos

- **Java JDK:** versão 17 ou 21.
- **Node.js:** versão 22 LTS (22.12 ou superior), disponível no [site oficial](https://nodejs.org/).
- **NPM:** instalado junto com o Node.js.
- **Git e GitHub Desktop:** para clonar e versionar o projeto.
- **VS Code:** para abrir o projeto e executar os comandos.
- **Internet:** necessária na primeira instalação das dependências.

### 2. Clonar o repositório

No GitHub Desktop, acesse `File → Clone repository`, selecione o repositório StockFlow e clique em `Clone`. Selecione a branch `main` e atualize-a com `Fetch origin` e `Pull origin`, caso necessário.

Abra a pasta raiz do projeto no VS Code. A estrutura esperada é:

```text
StockFlow/
├── backend/
├── frontend-web/
├── frontend-mobile/
└── README.md
```

### 3. Como rodar o Backend (Java Spring Boot)

Abra o primeiro terminal PowerShell no VS Code, a partir da raiz do projeto:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

As dependências Java são gerenciadas pelo Maven. **Não execute `npm install` na pasta backend.** O banco H2 é iniciado automaticamente e armazena os produtos em `backend/data/`.

> ✅ **Sucesso:** acesse http://localhost:8080/api/produtos. Uma lista de produtos ou `[]` indica que a API está respondendo.

Mantenha este terminal aberto. Caso o inicializador Maven não consiga baixar suas dependências, utilize Maven previamente instalado e execute `mvn spring-boot:run` dentro de `backend/`.

### 4. Como rodar o Frontend Web (Angular)

Abra um segundo terminal PowerShell, novamente na raiz do projeto:

```powershell
cd frontend-web
npm install
npm start
```

> ✅ **Sucesso:** acesse http://localhost:4200 após a compilação.

O Angular permite cadastrar, consultar, editar, excluir e filtrar produtos. Mantenha este terminal aberto.

### 5. Como rodar o Frontend Mobile (Expo)

Abra um terceiro terminal PowerShell, novamente na raiz do projeto:

```powershell
cd frontend-mobile
npm install
npm run web
```

> ✅ **Sucesso:** acesse http://localhost:8081 ou o endereço informado pelo terminal.

O Expo permite consultar produtos e registrar entradas e saídas de estoque. Mantenha este terminal aberto.

**Importante:** o `npm install` deve ser executado separadamente em `frontend-web/` e `frontend-mobile/`. Os três terminais precisam permanecer abertos durante a utilização do sistema.

### 6. Configurar a API para outros computadores e celulares

Se os três projetos estiverem no mesmo computador, utilize a API padrão:

```text
http://localhost:8080/api/produtos
```

Se o Angular ou o Expo estiver em outro dispositivo, execute no computador que roda o Java:

```powershell
ipconfig
```

Identifique o endereço IPv4 da rede utilizada. No exemplo abaixo, `192.168.1.100` é apenas um IP ilustrativo: substitua pelo IP real.

**Angular:** altere o arquivo `frontend-web/src/app/core/api.config.ts`:

```typescript
export const API_URL = 'http://192.168.1.100:8080/api/produtos';
```

**Expo:** dentro de `frontend-mobile/`, copie `.env.example` para `.env` e configure:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:8080/api/produtos
```

Reinicie os frontends após a alteração. Para utilizar o Expo Go no celular, execute `npm start` dentro de `frontend-mobile/` e escaneie o QR Code com uma versão do Expo Go compatível com o SDK 54. Também é possível utilizar a versão web.

Todos os dispositivos devem estar na mesma rede, com acesso permitido à porta 8080. O Angular e o Expo devem utilizar **uma única instância do backend Java**, compartilhando o mesmo banco H2. Não exponha o servidor de desenvolvimento à internet.

### 7. Como funciona o projeto

O Java Spring Boot recebe as requisições da API REST, valida os dados, executa as regras de estoque e salva os produtos no H2. O Angular realiza o gerenciamento dos produtos e o Expo registra as movimentações. Quando uma entrada ou saída é realizada pelo Expo, o Java atualiza o banco e o Angular pode consultar o novo saldo ao atualizar sua listagem.

| Tecnologia | Endereço local padrão |
|---|---|
| API Java | http://localhost:8080/api/produtos |
| Angular | http://localhost:4200 |
| Expo Web | http://localhost:8081 |
| Console H2 | http://localhost:8080/h2-console |

### 8. Teste de integração

1. Cadastre no Angular um produto chamado **Caderno**, com quantidade 10 e estoque mínimo 3.
2. Atualize a listagem do Expo e abra o produto.
3. Registre uma saída de 8 unidades no Expo.
4. Atualize o Angular e confirme o saldo de 2 unidades, com indicação de estoque baixo.
5. Tente retirar mais 3 unidades no Expo.
6. Confirme a mensagem de estoque insuficiente e que o saldo continua em 2 unidades.

Esse procedimento demonstra a integração real entre Angular, Java, H2 e Expo.

---

## ✅ Conceito de Pronto — Definition of Done (DoD)

Uma Issue será considerada pronta quando cumprir seus requisitos funcionais e técnicos, possuir evidências de funcionamento e estiver revisada e integrada ao repositório oficial.

- [ ] Todos os requisitos da Issue foram implementados.
- [ ] O código está organizado e executa sem erros impeditivos.
- [ ] As funcionalidades, validações e regras de negócio foram testadas.
- [ ] A integração com a API real foi verificada, quando aplicável.
- [ ] Não existem dados fictícios substituindo o backend.
- [ ] O desenvolvimento foi realizado em uma branch de funcionalidade.
- [ ] Os commits seguem o padrão de emoji, tipo e descrição objetiva.
- [ ] O Pull Request está vinculado às Issues correspondentes.
- [ ] O código foi revisado e aprovado por outro integrante.
- [ ] As alterações foram integradas à branch `main`.
- [ ] A Issue foi movida para a coluna Concluído no GitHub Projects.
- [ ] A documentação foi atualizada, quando necessário.

O projeto estará pronto para entrega quando as funcionalidades obrigatórias estiverem implementadas, testadas e integradas, permitindo a demonstração completa do StockFlow conforme os requisitos do professor.
