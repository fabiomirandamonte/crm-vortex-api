-- Inserção de Roles básicas
INSERT INTO roles (name, description) VALUES 
('ROLE_ADMIN', 'Acesso total ao sistema'),
('ROLE_MANAGER', 'Acesso a relatórios, clientes e gerenciamento de tarefas'),
('ROLE_USER', 'Acesso operacional aos seus clientes e tarefas');

-- Inserção de Etapas Padrão do Funil
INSERT INTO funnel_stages (name, stage_order, description) VALUES 
('Prospecção', 1, 'Primeiro contato realizado ou lead captado'),
('Qualificação', 2, 'Análise das necessidades do cliente'),
('Proposta Enviada', 3, 'Proposta comercial entregue'),
('Em Negociação', 4, 'Ajustes de escopo e contrato'),
('Fechado / Ganho', 5, 'Venda concluída com sucesso'),
('Perdido', 6, 'Oportunidade descartada');