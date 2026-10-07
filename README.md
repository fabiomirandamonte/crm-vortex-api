# 🏢 CRM Interno - API REST

API RESTful para sistema de CRM e painel administrativo interno, desenvolvido para centralizar e gerenciar clientes, funil de vendas, tarefas e permissões de acesso.

## Tecnologias Utilizadas

- **Linguagem:** Java 21
- **Framework:** Spring Boot 3
- **Banco de Dados:** PostgreSQL 16
- **Controle de Migração:** Flyway
- **Conteinerização:** Docker & Docker Compose
- **Gerenciador de Dependências:** Maven

## Estrutura e Modelagem do Banco de Dados

O banco de dados foi modelado para suportar permissões baseadas em funções (RBAC), controle do funil de vendas, acompanhamento de clientes e gerenciamento de tarefas com prazos e status.

### Entidades Principais
- **Roles:** Níveis de acesso (`ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_USER`).
- **Users:** Usuários do sistema vinculado às suas respectivas funções.
- **Funnel Stages:** Etapas de personalizáveis do funil de vendas.
- **Custtomers:**  Clientes cadastrados e vinculados a etapas do funil responsáveis.
- **Customer Notes:** Histórico e obersvações registradas para cada cliente.
- **Tasks:** Tarefas com prioridades, datas de vencimento e status aos clientes.

---

## Como executar o Projeto Localmente

### Pré-requisitos
- **Java 21** instalado
- **Docker e Docker Compose** instalados (ou PostgreSQL local na porta 5432)
- **Maven** (ou utilizar o wrapper `./mvnw`)

### Passo para execução

(... em construção!)

## Autenticação e Segurança

A API utiliza uma arquiterura de segurança **Stateless** implementada com **Spring Boot**  e tokens **JWT (JSON Web Token)**, garantindo o controle de acesso granular baseado em funções (RBAC - Role-Based Access Control).

- **Criptografia de Senhas:** BCrypt(`BCryptPasswordEncoder`).
- **Autenticação Stateless:** Validação de tokens JWT em cada requisição através de filtro customizado (`JwtAuthenticaftionFilter`).
- **Provedor de Tokens:** Módulo dedicado (`JwtTokenProvider`) para geração, extração claims e validação de expiração e assinatura.
- **DTOs Validados:** `LoginRequest` e `TokenResponse` utilizando `jakarta.validation` para garantia de integridade dos dados de entrada.

---

## Status do Projeto (Data: 06/10/2026)

- [x] Modelagem do Banco de Dados (DER)
- [x] Scripts DDL e Seed Iniciais via Flyway
- [x] Configuração Docker Compose & Spring Boot (Java 21)
- [x] Mapeamento das Entidades JPA (`User`,`Role`, `Customer`, etc.)
- [x] Repositórios Spring Data JPA (`JpaRepository`)
- [x] Infraestrutura de Autenticação JWT (`JwtTokenProvider`, Dtos de Auth)
- [ ] Configuração e Filtros do Spring Security (`SecurityConfig` e `JwtAuthenticationFilter`)
- [ ] Endpoint de Autenticação (`/api/v1/auth/login`)
- [ ] Endpoint RESTful (CRUDs e Dashboard)
- [ ] Integração com Frontend (React/TypeScript)
