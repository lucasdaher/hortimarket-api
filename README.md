# Hortimarket API

API RESTful completa desenvolvida em **Nest.js** e **TypeScript** para a plataforma de e-commerce "Hortimarket". O projeto simula o back-end de um marketplace de hortifrútis, gerenciando lojistas, clientes, produtos, carrinhos e pedidos.

O banco de dados utilizado é o **MySQL**, e a comunicação é gerenciada pelo ORM **TypeORM**.

## Integrantes do Grupo

- Lucas Gonçalves Daher Goes - UC24102381
- Murilo Farias Silva - UC24103352
- Ramon Miguel Rosa Pereira Ataides - UC24101290
- Maria Eduarda Rita Marques Noleto - UC24102958
- Rafael Canavarro dos Reis - UC24100056
- Marcos Alexandre Sousa Silva - UC24100928

## Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
- [MySQL](https://www.mysql.com/downloads/) (ou um servidor MySQL compatível, como MariaDB)
- [Git](https://git-scm.com/)

## Como Executar a Aplicação

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento local.

### 1. Clonar o Repositório

Abra seu terminal e clone o projeto para a sua máquina (substitua pela URL do seu repositório Git, se aplicável).

```bash
git clone https://github.com/lucasdaher/hortimarket-api .
cd <nome_da_pasta_que_você_criou_para_clonar>
```

### 2. Instalar as Dependências

Execute o comando abaixo para instalar todas as bibliotecas e pacotes necessários para o projeto.

```bash
npm install
```

### 3. Configurar o Banco de Dados

1.  Acesse seu servidor MySQL.
2.  Crie um novo banco de dados para o projeto. Recomendamos o nome `hortimarket`.
    ```sql
    CREATE DATABASE hortimarket;
    USE hortimarket;
    ```

### 4. Configurar as Variáveis de Ambiente

O projeto utiliza um arquivo `.env` para armazenar informações sensíveis, como as credenciais do banco de dados.

1.  Na raiz do projeto, crie um arquivo chamado `.env`.
2.  Copie o conteúdo do exemplo abaixo para dentro do seu arquivo `.env`.
3.  **Altere os valores** para corresponder à configuração do seu servidor MySQL.

**Exemplo de `.env`:**

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha_do_mysql (Deixe em branco caso não tenha senha)
DB_DATABASE=hortimarket

JWT_SECRET=SUA_CHAVE_JWT (Professor, você pode colocar qualquer coisa aqui para usar como chave)
```

### 5. Executar a Aplicação

Com tudo configurado, inicie o servidor em modo de desenvolvimento. Ele irá reiniciar automaticamente sempre que você alterar um arquivo.

```bash
npm run start:dev
```

Se tudo correu bem, você verá uma mensagem no terminal indicando que o Nest.js está rodando. A API estará disponível em: `http://localhost:3000`.

O Nest.js, com a configuração `synchronize: true`, irá criar automaticamente todas as tabelas no banco de dados na primeira vez que for iniciado.

## Testando as requisições

A maneira mais fácil e completa de testar todos os endpoints é utilizando o arquivo `requisicoes.http` que se encontra na raiz do projeto.

### Pré-requisito para Teste

- Instale a extensão **REST Client** no seu Visual Studio Code.

### Passos para Teste

1.  Com o servidor rodando, abra o arquivo `requisicoes.http` no VS Code.
2.  O arquivo está organizado em fluxos lógicos (Autenticação, Lojista, Cliente, etc.).
3.  Acima de cada bloco de requisição, você verá um texto clicável **"Send Request"**.
4.  Siga a ordem sugerida no arquivo para uma experiência de teste completa:
    - **Registre um Lojista e um Cliente.**
    - **Faça login com o Lojista** para obter o `lojistaToken`.
    - Use o `lojistaToken` para **criar uma loja e adicionar produtos**.
    - **Faça login com o Cliente** para obter o `clienteToken`.
    - Use o `clienteToken` para **navegar pelos produtos, favoritar, adicionar ao carrinho, gerenciar endereços e, finalmente, fazer o checkout**.

## Observações Importantes

### Logout

A autenticação via JWT (JSON Web Token) é do tipo "stateless" (sem estado). Isso significa que o servidor não armazena informações sobre tokens ativos. O logout, portanto, é uma **responsabilidade do cliente (front-end)**. A aplicação cliente deve simplesmente apagar/descartar o token de acesso que foi armazenado localmente para deslogar o usuário.
