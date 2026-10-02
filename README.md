# Sistema de Controle de Estoque de Pastilhas Industriais

## Entrada do sistema

**Painel.html**

---

## Sobre o projeto

Este projeto foi desenvolvido para apresentar uma proposta de sistema web para a **DDA Metalúrgica**.

Atualmente, o controle do estoque é realizado por meio de planilhas manuais, o que pode dificultar o acompanhamento das movimentações, a organização das informações e aumentar o risco de erros nos registros.

O projeto começou com a construção da interface utilizando **HTML e CSS** e, posteriormente, passou a utilizar **JavaScript** para adicionar interatividade e funcionalidades ao sistema.

Nesta etapa, o projeto também evoluiu para o consumo de uma **API real**, utilizando o serviço **MockAPI**, permitindo que os dados cadastrados sejam armazenados e manipulados por meio de requisições HTTP.

---

## Objetivo

Desenvolver um sistema de gestão de estoque para facilitar o cadastro, a organização e o acompanhamento das pastilhas industriais.

O sistema busca proporcionar uma visualização mais prática das informações do estoque, permitindo também o cadastro, consulta, atualização e exclusão dos registros.

---

## Funcionalidades e telas

O sistema contempla:

* Cadastro de pastilhas industriais;
* Cadastro de fabricantes;
* Registro de entradas de materiais;
* Registro de saídas de materiais;
* Acompanhamento da situação do estoque;
* Identificação de itens com estoque **OK, Baixo ou Crítico**;
* Visualização de alertas de estoque;
* Visualização das movimentações realizadas;
* Atualização das informações do painel de controle;
* Integração entre a tela de cadastro de pastilhas e o dashboard;
* Consulta de pastilhas por ID;
* Integração com uma API externa para armazenamento dos dados;
* Operações de cadastro, consulta, atualização e exclusão de registros.

---

## UX/UI

Durante o desenvolvimento, foram considerados aspectos relacionados à experiência e à interface do usuário, buscando:

* navegação simples;
* organização das informações;
* consistência visual entre as telas;
* facilidade de uso;
* layout responsivo;
* apresentação clara das informações do estoque.

A estrutura visual desenvolvida nas etapas anteriores foi mantida durante a implementação das novas funcionalidades, buscando preservar a identidade visual do sistema.

---

## Tecnologias utilizadas

* **HTML5**;
* **CSS3**;
* **JavaScript**;
* **Fetch API**;
* **MockAPI**;
* **Git**;
* **GitHub**.

---

## JavaScript

O JavaScript é utilizado no projeto para adicionar interatividade e permitir que as páginas respondam às ações realizadas pelo usuário.

Entre suas aplicações estão:

* processamento dos dados cadastrados;
* criação e atualização dos elementos da página;
* cálculo da situação do estoque;
* geração de alertas;
* registro das movimentações;
* atualização das informações exibidas no dashboard;
* integração entre as diferentes telas do sistema;
* comunicação com a API por meio do `fetch()`.

A utilização do JavaScript permite que as informações apresentadas na interface sejam atualizadas de acordo com os dados recebidos e enviados pelo sistema.

---

## Integração com API

Nesta etapa do projeto, o sistema passou a consumir uma API real utilizando o **MockAPI**.

Como a DDA Metalúrgica não possui uma API própria, foi utilizado o MockAPI para criar uma API gratuita capaz de armazenar os dados das pastilhas e disponibilizar endpoints para o sistema.

A API utilizada possui um recurso chamado **pastilhas**, com campos definidos de acordo com as necessidades do sistema.

### Estrutura dos dados

Os registros das pastilhas possuem os seguintes campos:

* `id` — identificador automático do registro;
* `nome` — nome da pastilha;
* `codigo` — código da pastilha;
* `quantidade` — quantidade disponível em estoque;
* `categoria` — categoria da pastilha;
* `fornecedor` — fornecedor relacionado ao produto;
* `preco` — preço da pastilha.

---

## Consumo da API

A comunicação entre o sistema e a API é realizada utilizando o método `fetch()` do JavaScript.

Por meio dele, o sistema consegue enviar requisições para consultar, cadastrar, atualizar e excluir informações.

As principais operações utilizadas são:

### GET

Utilizado para consultar informações.

O **GET geral** busca todos os registros cadastrados na API e apresenta as pastilhas na interface do sistema.

Também é utilizado o **GET com parâmetro de caminho** para consultar uma pastilha específica por meio do seu `id`.

Exemplo:

```text
/pastilhas/3
```

Nesse caso, o sistema solicita especificamente o registro que possui o ID `3`.

### POST

Utilizado para cadastrar uma nova pastilha.

Os dados preenchidos no formulário são transformados em JSON utilizando `JSON.stringify()` e enviados para a API.

### PUT

Utilizado para atualizar os dados de uma pastilha já cadastrada.

O sistema utiliza o ID do registro para identificar qual pastilha deverá ser atualizada.

### DELETE

Utilizado para excluir uma pastilha cadastrada.

Assim como no PUT, o ID é utilizado para identificar o registro que será excluído.

---

## CRUD

A integração com a API permite realizar o CRUD completo dos registros.

**CRUD** representa as principais operações realizadas sobre os dados:

* **Create** — criação de registros;
* **Read** — leitura dos registros;
* **Update** — atualização dos registros;
* **Delete** — exclusão dos registros.

No projeto, essas operações são realizadas utilizando os métodos HTTP:

| Operação | Método | Função                 |
| -------- | ------ | ---------------------- |
| Create   | POST   | Cadastrar uma pastilha |
| Read     | GET    | Consultar pastilhas    |
| Update   | PUT    | Atualizar uma pastilha |
| Delete   | DELETE | Excluir uma pastilha   |

Após as operações, a interface é atualizada para apresentar os dados atuais da API.

---

## Verificação das respostas

Durante as requisições, o sistema realiza uma verificação básica da resposta utilizando `response.ok`.

Essa verificação permite identificar se a requisição foi realizada corretamente antes de continuar o processamento dos dados.

Em caso de erro, o sistema pode apresentar informações no console para auxiliar na identificação do problema.

---

## Estrutura do sistema

O sistema possui diferentes telas responsáveis por funções específicas:

* **Painel:** apresenta um resumo do estoque, alertas e movimentações recentes;
* **Pastilhas:** permite cadastrar, consultar, atualizar e visualizar as pastilhas industriais;
* **Fabricantes:** destinada ao gerenciamento dos fabricantes cadastrados;
* **Relatórios:** destinada à apresentação das informações e movimentações do sistema.

As informações cadastradas na tela de pastilhas podem ser utilizadas pelo painel para apresentar a situação atual do estoque.

---

## API utilizada

A API foi criada utilizando o **MockAPI**, conforme proposto na atividade.

O recurso utilizado para esta etapa é:

```text
https://SEU-ID.mockapi.io/pastilhas
```

A URL deve ser substituída pelo endereço do projeto criado pela equipe no MockAPI.

---

## SA1 — Interação com APIs

Nesta etapa da Situação de Aprendizagem, o objetivo foi evoluir o sistema desenvolvido nas etapas anteriores para consumir uma API existente.

A atividade contempla:

* consumo de uma API por meio do `fetch()`;
* realização de requisições GET;
* consulta de registros por ID;
* envio de dados utilizando POST;
* atualização de registros utilizando PUT;
* exclusão de registros utilizando DELETE;
* utilização de `JSON.stringify()` no envio dos dados;
* verificação básica das respostas da API;
* atualização da interface de acordo com os dados recebidos.

Dessa forma, o sistema deixa de trabalhar apenas com dados fictícios presentes na interface e passa a utilizar dados armazenados em uma API.

---

## Equipe

### Líder

**Miguel**

### Colaboradores

**Wesley**

**Tatiane**

**Simon**

---

## Repositório

**Link do repositório:**

https://github.com/kauasmiguel-a11y/Situa-o-aprendizagem-HTML-CSS.git
