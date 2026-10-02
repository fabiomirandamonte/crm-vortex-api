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
- **Tasks:** Tarefas com prioridades, datas de vencimento e statusaos clientes.

---

## Como executar o Projeto Localmente

### Pré-requisitos
- **Java 21** instalado
- **Docker e Docker Compose** instalados (ou PostgreSQL local na porta 5432)
- **Maven** (ou utilizar o wrapper `./mvnw`)

### Passo para execução

(... em construção!)

Data ultima atualização 01/10/2026.

