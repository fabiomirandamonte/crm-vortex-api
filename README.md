# 🏢 CRM Interno - API REST

###
Desenvolvimento de CRM interno para empresa

Descrição do Projeto:

Busco desenvolvedor fullstack para criação de um CRM/painel administrativo interno para minha empresa.

O objetivo é centralizar e organizar processos da operação em um único sistema, com uma interface simples, moderna e de fácil utilização.

Principais funcionalidades:

Login e controle de usuários/permissões;
Dashboard com indicadores;
Cadastro e gerenciamento de clientes;
Funil/status dos clientes;
Tarefas, responsáveis e prazos;
Histórico e observações;
Busca e filtros;
Relatórios básicos.


O sistema deve possuir frontend, backend e banco de dados, além de ser responsivo e preparado para receber novos módulos e integrações futuramente.


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
1. Suba o container do banco de dados (se aplicável via Docker Compose):
             docker-compose up -d

2. Execute a aplicação Spring Boot:
             ./mvnw spring-boot:run

## Autenticação e Segurança

A API utiliza uma arquiterura de segurança **Stateless** implementada com **Spring Boot**  e tokens **JWT (JSON Web Token)**, garantindo o controle de acesso granular baseado em funções (RBAC - Role-Based Access Control).

- **Criptografia de Senhas:** BCrypt(`BCryptPasswordEncoder`).
- **Autenticação Stateless:** Validação de tokens JWT em cada requisição através de filtro customizado (`JwtAuthenticaftionFilter`).
- **Provedor de Tokens:** Módulo dedicado (`JwtTokenProvider`) para geração, extração claims e validação de expiração e assinatura.
- **DTOs Validados:** `LoginRequest` e `TokenResponse` utilizando `jakarta.validation` para garantia de integridade dos dados de entrada.

---

## Status do Projeto (Data: 12/11/2026)

- [x] Modelagem do Banco de Dados (DER)
- [x] Scripts DDL e Seed Iniciais via Flyway
- [x] Configuração Docker Compose & Spring Boot (Java 21)
- [x] Mapeamento das Entidades JPA (`User`,`Role`, `Customer`, etc.)
- [x] Repositórios Spring Data JPA (`JpaRepository`)
- [x] Infraestrutura de Autenticação JWT (`JwtTokenProvider`, Dtos de Auth)
- [x] Configuração e Filtros do Spring Security (`SecurityConfig` e `JwtAuthenticationFilter`)
- [x] Endpoint de Autenticação (`/api/v1/auth/login`) com suporte a BCrypt.+
- [x] Mapeamento de Enums Nativos do PostgreSQL (task_status, task_priority) via Hibernate (@JdbcTypeCode(SqlTypes.NAMED_ENUM))
- [x] Módulo de Tarefas (Tasks) - Criação vinculada ao usuário autenticado e clientes
- [x] Endpoint RESTful (CRUDs e Dashboard)
- [ ] Integração com Frontend (React/TypeScript)


Data 06/11/2026 às 16:09
Próximas Demandas (Sequência do Projeto):

Módulo de Clientes (Customers): Desenvolver e validar o CRUD completo de clientes, garantindo a integração correta com as entidades do sistema.

Gerenciamento de Estágios do Funil (Funnel Stages): Criar os endpoints para movimentação e controle do pipeline de vendas dos clientes.

Notas de Clientes (Customer Notes): Implementar o histórico de anotações e interações para fechar o ciclo de acompanhamento.