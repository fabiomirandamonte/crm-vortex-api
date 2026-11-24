# 🏢 CRM Vortex — Full-Stack Customer Relationship Management

Sistema corporativo de gerenciamento de relacionamento com clientes (CRM) e painel administrativo interno, estruturado em arquitetura **Monorepo** para centralizar e organizar operações comerciais, funil de vendas, tarefas e controle de acesso.

---

## 🏗️ Arquitetura do Monorepo

```text
crm-vortex/
├── crm-api/             # Backend RESTful API (Java 21, Spring Boot 3, Spring Security, JWT, PostgreSQL)
├── crm-web/             # Frontend SPA (React, TypeScript, Vite, Tailwind CSS)
├── docker-compose.yml   # Orquestração do banco de dados PostgreSQL
└── README.md            # Documentação principal do projeto
```

---

## 🚀 Tecnologias Utilizadas

### Backend (`crm-api`)
- **Linguagem:** Java 21
- **Framework:** Spring Boot 3
- **Segurança:** Spring Security & JWT (JSON Web Token)
- **Banco de Dados:** PostgreSQL 16
- **Controle de Migração:** Flyway
- **Conteinerização:** Docker & Docker Compose
- **Gerenciador de Dependências:** Maven

### Frontend (`crm-web`)
- **Biblioteca & Linguagem:** React & TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS
- **Comunicação HTTP:** Axios (com interceptors para injeção automática de token `Bearer` e tratamento de sessão `401`)
- **Roteamento & Ícones:** React Router DOM & Lucide React

---

## 🗄️ Estrutura e Modelagem do Banco de Dados

O banco de dados foi modelado para suportar permissões baseadas em funções (RBAC), controle do funil de vendas, acompanhamento de clientes e gerenciamento de tarefas com prazos e status.

### Entidades Principais
- **Roles:** Níveis de acesso (`ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_USER`).
- **Users:** Usuários do sistema vinculados às suas respectivas funções.
- **Funnel Stages:** Etapas personalizáveis do funil de vendas.
- **Customers:** Clientes cadastrados e vinculados às etapas do funil e usuários responsáveis.
- **Customer Notes:** Histórico e observações registradas para cada cliente.
- **Tasks:** Tarefas com prioridades, datas de vencimento e status vinculadas aos clientes.

---

## 🔐 Autenticação e Segurança

A API utiliza uma arquitetura de segurança **Stateless** implementada com **Spring Boot** e tokens **JWT (JSON Web Token)**, garantindo o controle de acesso granular baseado em funções (**RBAC** — *Role-Based Access Control*).

- **Criptografia de Senhas:** `BCrypt` (`BCryptPasswordEncoder`).
- **Autenticação Stateless:** Validação de tokens JWT em cada requisição através de filtro customizado (`JwtAuthenticationFilter`).
- **Provedor de Tokens:** Módulo dedicado (`JwtTokenProvider`) para geração, extração de *claims* e validação de expiração e assinatura.
- **DTOs Validados:** `LoginRequest` e `TokenResponse` utilizando `jakarta.validation` para garantia de integridade dos dados de entrada.

---

## ⚙️ Como Executar o Projeto Localmente

# Opção 1: Execução Completa via Docker Compose (Recomendado)

Sobe o banco de dados PostgreSQL 16 (com healthcheck), o backend Spring Boot (`crm-api`) e o frontend React + Nginx (`crm-web`) na mesma rede Docker:

```
    docker compose up --build -d
```

* Frontend (Nginx): http://localhost:5173
* Backend API: http://localhost:8080/api/v1
* PostgreSQL: localhost:5432 (banco crm_db, volume persistente pgdata)

Para acompanhar os logs e encerrar os containers:

```
    docker compose logs -f
    docker compose down
```

Principais Variáveis de Ambiente (docker-compose.yml / application.yml)

* DB_URL, DB_USERNAME, DB_PASSWORD: Conexão JDBC do Spring Boot com o PostgreSQL.
* APP_JWT_SECRET, APP_JWT_EXPIRATION_MS: Chave de assinatura HMAC e tempo de expiração do JWT.
* APP_CORS_ALLOWED_ORIGINS: Origens permitidas no CORS (ex.: http://localhost:5173).
* VITE_API_URL: URL base da API usada no build do frontend (padrão /api/v1 no Docker via proxy do Nginx).

<br>
<br>

# Opção 2: Execução Local (Desenvolvimento)

Pré-requisitos

* Java 21 instalado
* Node.js 18+ e npm instalados
* Docker e Docker Compose instalados (ou PostgreSQL local na porta 5432)
* Maven (ou utilizar o wrapper ./mvnw)

1. Subir o Banco de Dados

Na raiz do repositório (crm-vortex/):

        docker compose up -d postgres


2. Executar o Backend (crm-api)

```
    cd crm-api
    ./mvnw spring-boot:run
```

A API estará disponível em http://localhost:8080/api/v1.

3. Executar o Frontend (crm-web)

Em outro terminal, a partir da raiz do projeto:

    cd crm-web
    npm install
    npm run dev

A interface web estará disponível em http://localhost:5173.

---

## 📌 Status do Projeto (Atualizado em: 24/11/2026)

### Backend (`crm-api`)
- [x] Modelagem do Banco de Dados (DER)
- [x] Scripts DDL e Seed Iniciais via Flyway
- [x] Configuração Docker Compose & Spring Boot (Java 21)
- [x] Mapeamento das Entidades JPA (`User`, `Role`, `Customer`, `FunnelStage`, `Task`, `CustomerNote`)
- [x] Repositórios Spring Data JPA (`JpaRepository`)
- [x] Infraestrutura de Autenticação JWT (`JwtTokenProvider`, DTOs de Auth, `SecurityConfig` e `JwtAuthenticationFilter`)
- [x] Endpoint de Autenticação (`/api/v1/auth/login`) com suporte a BCrypt
- [x] Mapeamento de Enums Nativos do PostgreSQL (`task_status`, `task_priority`) via Hibernate (`@JdbcTypeCode(SqlTypes.NAMED_ENUM)`)
- [x] CRUDs RESTful completos (Customers, Funnel Stages, Tasks, Customer Notes e Dashboard)

### Frontend (`crm-web`) & Monorepo
- [x] Reestruturação em Monorepo (`crm-api` + `crm-web`)
- [x] Tela de Login responsiva e fluxo de autenticação JWT (`AuthContext` + rotas protegidas)
- [x] Layout base com navegação modular (`TopNavBar`)
- [x] Interface de Gestão de Clientes (`CustomersPage`): listagem, busca/filtros dinâmicos, cadastro, edição, exclusão e atualização inline de estágio do funil (`PATCH /api/v1/customers/{id}/funnel-stage`)
- [x] Interface de gerenciamento de Estágios do Funil (`Funnel Stages UI`)
- [x] Interface de Tarefas (`Tasks UI`): listagem, filtros por status/prioridade e CRUD completo vinculado a clientes
- [x] Interface de Histórico e Anotações (`Notes UI`): linha do tempo de interações e anotações por cliente
- [x] Painel Administrativo (`Admin UI`): gerenciamento de usuários internos, credenciais e perfis de acesso (`ADMIN` / `USER`)
- [x] Dashboard de indicadores (visão consolidada do pipeline e tarefas)
