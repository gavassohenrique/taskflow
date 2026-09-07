TaskFlow

Sistema de gerenciamento de tarefas desenvolvido como projeto de CI/CD, com frontend web, API REST, PostgreSQL e deploy automatizado na Microsoft Azure.

Tecnologias

HTML

CSS

JavaScript

Node.js

Express

PostgreSQL

Docker

Docker Compose

GitHub

GitHub Actions

Azure Container Registry (ACR)

Azure Container Apps

Azure Database for PostgreSQL

Funcionalidades

Criar tarefas

Listar tarefas

Concluir tarefas

Excluir tarefas

Definir prioridade

Definir prazo

Dashboard com quantidade de tarefas por status

Arquitetura

Frontend (Nginx)
       |
       v
Backend (Node.js + Express)
       |
       v
Azure Database for PostgreSQL

CI/CD

GitHub
   |
   | push para main
   v
GitHub Actions
   |
   +--> npm ci
   +--> validação JavaScript
   +--> validação Docker Compose
   +--> build Docker
   |
   v
Azure Container Registry
   |
   +--> taskflow-backend:<commit>
   +--> taskflow-frontend:<commit>
   |
   v
Azure Container Apps
   |
   +--> taskflow-backend
   +--> taskflow-frontend

A cada push na branch main, o GitHub Actions executa a etapa de CI. Se ela for concluída com sucesso, a etapa de CD autentica no Azure, publica as imagens no Azure Container Registry e atualiza os Container Apps.

O Azure Container Apps cria uma nova revisão quando a aplicação é atualizada. As imagens são identificadas pela SHA do commit, evitando depender da tag latest durante o deploy.

Estrutura do projeto

taskflow/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── tarefaController.js
│   │   ├── database/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   └── tarefaRoutes.js
│   │   ├── server.js
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── package-lock.json
│   └── .env              # somente local; não versionado
├── database/
│   └── init.sql
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .gitignore
├── docker-compose.yml
└── README.md

Execução local

Na raiz do projeto:

docker compose up --build

Frontend: http://localhost:8080

Backend: http://localhost:3000

Health Check: http://localhost:3000/health

O arquivo .env não deve ser enviado ao GitHub.

Docker

O frontend utiliza nginx:alpine para servir os arquivos estáticos. O backend utiliza uma imagem Node.js Alpine.

docker build -t taskflow-backend ./backend
docker build -t taskflow-frontend ./frontend

CI/CD com GitHub Actions

O workflow está em .github/workflows/ci.yml.

CI

Executado em pushes para main e pull requests direcionados para main.

Checkout do código.

Configuração do Node.js.

npm ci.

node --check src/server.js.

docker compose config.

Build das imagens Docker do backend e frontend.

CD

Executado somente em push para main após o sucesso da CI.

Login no Azure usando AZURE_CREDENTIALS.

Login no Azure Container Registry.

Build das imagens.

Push para taskflowacr.azurecr.io usando a SHA do commit como tag.

Atualização do taskflow-backend.

Atualização do taskflow-frontend.

Infraestrutura Azure

Resource Group: taskflow-rg

Azure Container Registry: taskflowacr

Container Apps Environment: taskflow-env

Container App: taskflow-backend

Container App: taskflow-frontend

Azure Database for PostgreSQL: taskflow-postgres2026

O Container Apps usa identidade gerenciada para fazer pull das imagens privadas do ACR. A senha do PostgreSQL é armazenada como secret no Container App.

Deploy automático

Após um pipeline bem-sucedido, o Azure Container Apps cria novas revisões. A revisão ativa recebe o tráfego de produção.

Segurança

Não versionar .env, senhas, secrets do GitHub, credenciais de Service Principal, tokens ou chaves privadas.

Resultado

Código
  ↓
GitHub
  ↓
GitHub Actions
  ↓
Validações e build
  ↓
Docker
  ↓
Azure Container Registry
  ↓
Azure Container Apps
  ↓
Aplicação em produção