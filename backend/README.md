# Process Mapper Backend

## Descrição

Este é o backend do projeto Process Mapper, desenvolvido em TypeScript com Express. Ele fornece uma API RESTful para gerenciar áreas e processos, utilizando um banco de dados em memória para simular a persistência de dados, similar a um H2 Console para desenvolvimento e demonstração.

## Funcionalidades da API

### Áreas (`/api/areas`)

- **`POST /api/areas`**: Cria uma nova área.
  - **Corpo da Requisição**: `{ "name": "string", "description": "string" }`
  - **Resposta de Sucesso**: `201 Created` com o objeto da área criada.
  - **Exemplo de Requisição**:
    ```json
    {
      "name": "Recursos Humanos",
      "description": "Responsável pela gestão de pessoas."
    }
    ```

- **`GET /api/areas`**: Retorna todas as áreas cadastradas.
  - **Resposta de Sucesso**: `200 OK` com um array de objetos de área.

- **`GET /api/areas/:id`**: Retorna uma área específica pelo ID.
  - **Resposta de Sucesso**: `200 OK` com o objeto da área.
  - **Resposta de Erro**: `404 Not Found` se a área não for encontrada.

- **`PUT /api/areas/:id`**: Atualiza uma área existente pelo ID.
  - **Corpo da Requisição**: `{ "name"?: "string", "description"?: "string" }`
  - **Resposta de Sucesso**: `200 OK` com o objeto da área atualizada.
  - **Resposta de Erro**: `404 Not Found` se a área não for encontrada.

- **`DELETE /api/areas/:id`**: Exclui uma área e todos os processos associados a ela.
  - **Resposta de Sucesso**: `204 No Content`.
  - **Resposta de Erro**: `404 Not Found` se a área não for encontrada.

### Processos (`/api/processes`)

- **`POST /api/processes`**: Cria um novo processo.
  - **Corpo da Requisição**: 
    ```json
    {
      "name": "string",
      "description"?: "string",
      "areaId": "string",
      "parentId"?: "string",
      "tools"?: "string",
      "responsible"?: "string",
      "documentation"?: "string",
      "type": "manual" | "systemic"
    }
    ```
  - **Resposta de Sucesso**: `201 Created` com o objeto do processo criado.
  - **Resposta de Erro**: `400 Bad Request` se `name`, `areaId` ou `type` estiverem faltando, ou se `areaId` ou `parentId` forem inválidos.

- **`GET /api/processes`**: Retorna todos os processos cadastrados. Pode ser filtrado por `areaId`.
  - **Parâmetros de Query**: `?areaId=string` (opcional)
  - **Resposta de Sucesso**: `200 OK` com um array de objetos de processo.

- **`GET /api/processes/:id`**: Retorna um processo específico pelo ID.
  - **Resposta de Sucesso**: `200 OK` com o objeto do processo.
  - **Resposta de Erro**: `404 Not Found` se o processo não for encontrado.

- **`PUT /api/processes/:id`**: Atualiza um processo existente pelo ID.
  - **Corpo da Requisição**: `{ "name"?: "string", ... }` (qualquer campo do processo)
  - **Resposta de Sucesso**: `200 OK` com o objeto do processo atualizado.
  - **Resposta de Erro**: `404 Not Found` se o processo não for encontrado, ou `400 Bad Request` se `areaId` ou `parentId` forem inválidos.

- **`DELETE /api/processes/:id`**: Exclui um processo e todos os seus subprocessos aninhados.
  - **Resposta de Sucesso**: `204 No Content`.
  - **Resposta de Erro**: `404 Not Found` se o processo não for encontrado.

### Endpoints de Controle do Banco de Dados em Memória (H2-like Console)

- **`GET /db/state`**: Retorna o estado atual do banco de dados em memória (todas as áreas e processos).
  - **Resposta de Sucesso**: `200 OK` com um objeto contendo `areas` e `processes`.

- **`POST /db/seed`**: Popula o banco de dados em memória com dados de exemplo.
  - **Resposta de Sucesso**: `200 OK` com `{ "message": "Database seeded with sample data." }`.

- **`POST /db/reset`**: Limpa todos os dados do banco de dados em memória.
  - **Resposta de Sucesso**: `200 OK` com `{ "message": "Database reset." }`.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para Node.js.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **CORS**: Middleware para habilitar Cross-Origin Resource Sharing.
- **Body-parser**: Middleware para analisar corpos de requisição HTTP.
- **UUID**: Para geração de IDs únicos.
- **Nodemon**: Para reiniciar automaticamente o servidor durante o desenvolvimento.
- **ts-node**: Para executar arquivos TypeScript diretamente.

## Estrutura do Projeto

```
process-mapper-backend/
├── src/
│   ├── repositories/
│   │   └── AreaRepository.ts    # Lógica do banco de dados 
│   │   └── ProcessRepository.ts    # Lógica do banco de dados 
│   ├── routes/
│   │   ├── areas.ts         # Rotas da API para áreas
│   │   └── processes.ts     # Rotas da API para processos
│   └── index.ts             # Ponto de entrada da aplicação Express
├── package.json
├── tsconfig.json
└── README.md
```

## Como Executar

### Pré-requisitos
- Node.js (versão 20.18.0 ou superior recomendada)
- npm (gerenciador de pacotes)

### Instalação

1.  Navegue até o diretório `process-mapper-backend`:
    ```bash
    cd process-mapper-backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```

### Execução

- **Modo de Desenvolvimento (com Nodemon)**:
  ```bash
  npm run dev
  ```
  O servidor será iniciado em `http://localhost:3000` e reiniciará automaticamente a cada alteração no código.

- **Modo de Produção (após build)**:
  1.  Compile o código TypeScript para JavaScript:
      ```bash
      npm run build
      ```
  2.  Inicie o servidor:
      ```bash
      npm start
      ```
  O servidor será iniciado em `http://localhost:3000`.

## Testando a API

Você pode usar ferramentas como `curl`, Postman, Insomnia ou o próprio navegador para testar os endpoints. Abaixo estão alguns exemplos usando `curl`:

### Popular o Banco de Dados com Dados de Exemplo
```bash
curl -X POST http://localhost:3000/db/seed
```

### Obter Todas as Áreas
```bash
curl http://localhost:3000/api/areas
```

### Obter Todos os Processos
```bash
curl http://localhost:3000/api/processes
```

### Obter o Estado Completo do Banco de Dados
```bash
curl http://localhost:3000/db/state
```

## Considerações

Este backend utiliza um banco de dados em memória, o que significa que todos os dados são perdidos quando o servidor é reiniciado. Para uma aplicação em produção, seria necessário integrar um banco de dados persistente (como PostgreSQL, MongoDB, MySQL, etc.) e implementar uma camada de ORM/ODM.

## Autor

Desenvolvido por Manus AI.

