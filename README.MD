
# Commerce

Sistema contendo backend e frontend, com a finalidade de ler um arquivo CSV e através dele atualizar o preço dos produtos.

## Como executar?
Será necessário ter o NodeJs e o MySql5 instalados em sua máquina.

Clone os repositórios e instale as dependências em suas respectivas pastas (backend e frontend) usando `npm install`.

Na pasta `docs` está contido um arquivo chamado database.sql, nele existem os scripts necessários para popular as tabelas de produtos e packs.

Para executar ambos os projetos basta rodar no terminal: `npm run dev`

Na pasta `docs` há um arquivo cvs (`atualizacao_preco_exemplo.csv`) que pode ser usado como teste.



## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

### Backend

`PORT`: Porta onde deve ser executado o projeto

`DATABASE_HOST`: Endereço onde o banco de dados está rodando

`DATABASE_PORT`: Porta onde o banco de dados está rodando

`DATABASE_USER`: Usuário do banco de dados

`DATABASE_PASSWORD`:  Senha do usuário do banco de dados

`DATABASE_NAME`: Nome do banco de dados


### Frontend

`VITE_API`: Endereço onde o backend está rodando


![cover]()

