-- Enums para garantir consistência em status de tarefas e prioridades
CREATE TYPE task_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- 1. Tabela de Perfis/Roles para RBAC
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 2. Tabela de Usuários do Sistema
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- 3. Tabela das Etapas do Funil de Vendas
CREATE TABLE funnel_stages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    stage_order INT NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 4. Tabela de Clientes
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    company_name VARCHAR(150),
    origin_channel VARCHAR(50), -- Ex: Indicação, Website, LinkedIn, Anúncio
    funnel_stage_id BIGINT NOT NULL,
    assigned_user_id BIGINT, -- Responsável pelo cliente
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_customers_stage FOREIGN KEY (funnel_stage_id) REFERENCES funnel_stages (id),
    CONSTRAINT fk_customers_user FOREIGN KEY (assigned_user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- 5. Tabela de Histórico e Observações de Clientes
CREATE TABLE customer_notes (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_notes_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
    CONSTRAINT fk_notes_author FOREIGN KEY (author_id) REFERENCES users (id)
);

-- 6. Tabela de Tarefas
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status task_status DEFAULT 'PENDING' NOT NULL,
    priority task_priority DEFAULT 'MEDIUM' NOT NULL,
    customer_id BIGINT,
    assigned_user_id BIGINT NOT NULL,
    created_by_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_tasks_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL,
    CONSTRAINT fk_tasks_assigned FOREIGN KEY (assigned_user_id) REFERENCES users (id),
    CONSTRAINT fk_tasks_creator FOREIGN KEY (created_by_id) REFERENCES users (id)
);

-- Índices para otimização de filtros e buscas frequentes
CREATE INDEX idx_customers_funnel_stage ON customers(funnel_stage_id);
CREATE INDEX idx_customers_assigned_user ON customers(assigned_user_id);
CREATE INDEX idx_tasks_assigned_user ON tasks(assigned_user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_notes_customer ON customer_notes(customer_id);