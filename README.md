# AuMiau Pet

Sistema de gestão para Pet Shop desenvolvido para a disciplina de Práticas Profissionais em Análise e Desenvolvimento de Sistemas.

## Integrantes do Grupo 19

- Ana Clara Cândido Pereira
- Ana Laura Ali Magrao
- Luana Martins Arimitsu
- Marcelle de Souza Fontoura Silva

## Sobre o projeto

O AuMiau Pet é um sistema desenvolvido para auxiliar no gerenciamento das principais atividades de um pet shop.

Entre as principais funcionalidades estão:

- cadastro e gerenciamento de clientes;
- cadastro e gerenciamento de pets;
- cadastro e gerenciamento de serviços;
- criação e gerenciamento de agendamentos;
- gerenciamento de usuários;
- pesquisa e filtros de registros.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Supabase
- PostgreSQL
- Git
- GitHub

## Pré-requisitos

Para executar o projeto localmente, é necessário possuir:

- Git instalado;
- Visual Studio Code ou outro editor de código;
- navegador atualizado;
- extensão Live Server para o Visual Studio Code.

## Clonando o repositório

Abra um terminal e execute:

```bash
git clone https://github.com/StormRider4513/ppads-grupo19.git
```

Depois, acesse a pasta do projeto:

```bash
cd ppads-grupo19
```

## Abrindo o projeto

Abra o projeto no Visual Studio Code:

```bash
code .
```

Caso o comando `code` não esteja disponível, abra o Visual Studio Code manualmente e selecione a pasta do repositório.

## Configuração do Supabase

O projeto utiliza o Supabase como plataforma de banco de dados, utilizando PostgreSQL.

A configuração da conexão está localizada no arquivo:

```text
AuMiauPet/js/supabase.js
```

O arquivo deve possuir a URL do projeto Supabase e a chave pública utilizada pela aplicação.

Exemplo:

```javascript
const SUPABASE_URL = "URL_DO_PROJETO";
const SUPABASE_KEY = "CHAVE_PUBLICA";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
```

Não deve ser utilizada uma chave secreta do Supabase no código do frontend.

## Banco de dados

O sistema utiliza as seguintes tabelas principais:

- `clientes`
- `pets`
- `servicos`
- `agendamentos`
- `usuarios`

As tabelas utilizam Row Level Security (RLS) para controle de acesso às operações realizadas pelo frontend.

## Executando a aplicação

No Visual Studio Code:

1. Localize o arquivo `index.html` dentro da pasta `AuMiauPet`.
2. Clique com o botão direito sobre o arquivo.
3. Selecione **Open with Live Server**.
4. A aplicação será aberta automaticamente no navegador.

Um endereço local
