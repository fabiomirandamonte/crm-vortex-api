-- =====================================================================
-- V4__seed_mock_data.sql
-- Massa de dados de teste (50 registros: 5 usuários, 20 clientes,
-- 15 tarefas e 10 anotações de clientes)
-- =====================================================================

-- 1. USUÁRIOS ADICIONAIS (5 registros)
-- Senha padrão para usuários de teste (se necessário autenticar via BCrypt): admin123
INSERT INTO users (name, email, password_hash, role_id, active)
VALUES
    ('Mariana Alencar', 'mariana.alencar@crm.com', '$2a$10$wS2CgD9KZnJd8b3xY2h7uO.jQ0X4m0x6b9G3.1mH5bL8kQ9jW2L6a', (SELECT id FROM roles WHERE name = 'ROLE_MANAGER'), TRUE),
    ('Lucas Ferreira', 'lucas.ferreira@crm.com', '$2a$10$wS2CgD9KZnJd8b3xY2h7uO.jQ0X4m0x6b9G3.1mH5bL8kQ9jW2L6a', (SELECT id FROM roles WHERE name = 'ROLE_USER'), TRUE),
    ('Camila Rocha', 'camila.rocha@crm.com', '$2a$10$wS2CgD9KZnJd8b3xY2h7uO.jQ0X4m0x6b9G3.1mH5bL8kQ9jW2L6a', (SELECT id FROM roles WHERE name = 'ROLE_USER'), TRUE),
    ('Rafael Nogueira', 'rafael.nogueira@crm.com', '$2a$10$wS2CgD9KZnJd8b3xY2h7uO.jQ0X4m0x6b9G3.1mH5bL8kQ9jW2L6a', (SELECT id FROM roles WHERE name = 'ROLE_USER'), TRUE),
    ('Beatriz Souza', 'beatriz.souza@crm.com', '$2a$10$wS2CgD9KZnJd8b3xY2h7uO.jQ0X4m0x6b9G3.1mH5bL8kQ9jW2L6a', (SELECT id FROM roles WHERE name = 'ROLE_MANAGER'), TRUE)
ON CONFLICT (email) DO NOTHING;

-- 2. CLIENTES (20 registros)
INSERT INTO customers (name, email, phone, company_name, origin_channel, funnel_stage_id, assigned_user_id)
SELECT v.name, v.email, v.phone, v.company_name, v.origin_channel, fs.id, u.id
FROM (
    VALUES
        ('Ana Clara Mendes', 'ana.mendes@horizonte.com.br', '(11) 98765-4321', 'Horizonte Logística', 'LinkedIn', 1, 'lucas.ferreira@crm.com'),
        ('Bruno Henrique Costa', 'bruno.costa@solarisenergia.com.br', '(21) 97654-3210', 'Solaris Energia', 'Website', 2, 'camila.rocha@crm.com'),
        ('Carla Dias Lima', 'carla.lima@verdevale.com.br', '(31) 96543-2109', 'Verde Vale Alimentos', 'Indicação', 3, 'rafael.nogueira@crm.com'),
        ('Diego Martins Alves', 'diego.alves@techpulse.io', '(41) 95432-1098', 'TechPulse Soluções', 'Anúncio', 4, 'lucas.ferreira@crm.com'),
        ('Eduarda Ribeiro', 'eduarda@atelieforma.com.br', '(83) 99876-5432', 'Ateliê Forma & Estilo', 'Instagram', 5, 'camila.rocha@crm.com'),
        ('Felipe Augusto Santos', 'felipe.santos@apexindustrial.com.br', '(11) 94321-0987', 'Apex Industrial', 'LinkedIn', 5, 'mariana.alencar@crm.com'),
        ('Gabriela Teixeira', 'gabriela@vitaessencia.com.br', '(19) 93210-9876', 'Vita Essência Cosméticos', 'Indicação', 3, 'rafael.nogueira@crm.com'),
        ('Henrique Vasconcelos', 'h.vasconcelos@nordestecargo.com.br', '(81) 92109-8765', 'Nordeste Cargo Express', 'Website', 2, 'lucas.ferreira@crm.com'),
        ('Isabela Cavalcanti', 'isabela@luminahealth.com.br', '(83) 98811-2233', 'Lumina Saúde', 'LinkedIn', 4, 'beatriz.souza@crm.com'),
        ('João Pedro Oliveira', 'jp.oliveira@construforte.com.br', '(48) 97722-3344', 'ConstruForte Engenharia', 'Anúncio', 1, 'camila.rocha@crm.com'),
        ('Larissa Gomes Pereira', 'larissa.pereira@safraforte.agr.br', '(62) 96633-4455', 'Safra Forte Agro', 'Indicação', 5, 'mariana.alencar@crm.com'),
        ('Marcelo Vinicius Duarte', 'marcelo@novaviasistemas.com.br', '(51) 95544-5566', 'NovaVia Sistemas', 'Website', 6, 'rafael.nogueira@crm.com'),
        ('Natália Borges Cunha', 'natalia.cunha@belaforma.com.br', '(11) 94455-6677', 'BelaForma Estética', 'Instagram', 2, 'camila.rocha@crm.com'),
        ('Otávio Augusto Melo', 'otavio.melo@portodigitalpe.com.br', '(81) 93366-7788', 'Porto Digital Consultoria', 'LinkedIn', 3, 'lucas.ferreira@crm.com'),
        ('Patrícia Helena Freitas', 'patricia@biofito.com.br', '(31) 92277-8899', 'BioFito Laboratórios', 'Indicação', 4, 'beatriz.souza@crm.com'),
        ('Gustavo Henrique Reis', 'gustavo.reis@transsul.com.br', '(41) 91188-9900', 'TransSul Transportes', 'Anúncio', 6, 'rafael.nogueira@crm.com'),
        ('Renata Cristina Barros', 'renata.barros@casadovale.com.br', '(27) 99900-1122', 'Casa do Vale Distribuidora', 'Website', 1, 'lucas.ferreira@crm.com'),
        ('Samuel Rodrigues Vieira', 'samuel.vieira@cloudbridge.com.br', '(11) 98899-2211', 'CloudBridge TI', 'LinkedIn', 5, 'beatriz.souza@crm.com'),
        ('Tatiane Moura Silva', 'tatiane@modapraiaja.com.br', '(85) 97788-3322', 'Moda Praia Já', 'Instagram', 2, 'camila.rocha@crm.com'),
        ('Victor Hugo Carvalho', 'vh.carvalho@omegaeng.com.br', '(61) 96677-4433', 'Omega Engenharia', 'Indicação', 3, 'mariana.alencar@crm.com')
) AS v(name, email, phone, company_name, origin_channel, stage_order, assignee_email)
JOIN funnel_stages fs ON fs.stage_order = v.stage_order
LEFT JOIN users u ON u.email = v.assignee_email
WHERE NOT EXISTS (
    SELECT 1 FROM customers c WHERE c.email = v.email
);

-- 3. TAREFAS (15 registros)
INSERT INTO tasks (title, description, due_date, status, priority, customer_id, assigned_user_id, created_by_id)
SELECT
    v.title,
    v.description,
    CURRENT_TIMESTAMP + (v.offset_days || ' days')::interval,
    v.status::task_status,
    v.priority::task_priority,
    c.id,
    u_ass.id,
    u_cre.id
FROM (
    VALUES
        ('Enviar apresentação institucional', 'Apresentar cases de sucesso e plano inicial por e-mail.', 2, 'PENDING', 'HIGH', 'ana.mendes@horizonte.com.br', 'lucas.ferreira@crm.com', 'mariana.alencar@crm.com'),
        ('Agendar reunião de levantamento', 'Mapear gargalos operacionais com a equipe de TI.', 3, 'IN_PROGRESS', 'HIGH', 'bruno.costa@solarisenergia.com.br', 'camila.rocha@crm.com', 'mariana.alencar@crm.com'),
        ('Elaborar proposta comercial detalhada', 'Incluir cronograma de implantação e SLA de suporte.', 5, 'PENDING', 'URGENT', 'carla.lima@verdevale.com.br', 'rafael.nogueira@crm.com', 'beatriz.souza@crm.com'),
        ('Revisar cláusulas contratuais', 'Validar condições de pagamento e vigência com jurídico.', 1, 'IN_PROGRESS', 'URGENT', 'diego.alves@techpulse.io', 'lucas.ferreira@crm.com', 'admin@crm.com'),
        ('Enviar termo de boas-vindas e onboarding', 'Agendar kickoff inicial com o cliente.', -2, 'COMPLETED', 'MEDIUM', 'eduarda@atelieforma.com.br', 'camila.rocha@crm.com', 'camila.rocha@crm.com'),
        ('Preparar relatório trimestral de conta', 'Consolidar métricas de uso e renovação anual.', 7, 'PENDING', 'MEDIUM', 'felipe.santos@apexindustrial.com.br', 'mariana.alencar@crm.com', 'admin@crm.com'),
        ('Follow-up da proposta enviada', 'Ligar para esclarecer dúvidas sobre escopo e valores.', 1, 'PENDING', 'HIGH', 'gabriela@vitaessencia.com.br', 'rafael.nogueira@crm.com', 'rafael.nogueira@crm.com'),
        ('Qualificar lead do formulário web', 'Confirmar porte da empresa e urgência do projeto.', 4, 'PENDING', 'MEDIUM', 'h.vasconcelos@nordestecargo.com.br', 'lucas.ferreira@crm.com', 'lucas.ferreira@crm.com'),
        ('Realizar demonstração técnica', 'Mostrar painel de indicadores e fluxo de atendimento.', 2, 'IN_PROGRESS', 'HIGH', 'isabela@luminahealth.com.br', 'beatriz.souza@crm.com', 'beatriz.souza@crm.com'),
        ('Primeiro contato por telefone', 'Apresentar solução e agendar diagnóstico rápido.', 6, 'PENDING', 'LOW', 'jp.oliveira@construforte.com.br', 'camila.rocha@crm.com', 'camila.rocha@crm.com'),
        ('Agendar revisão de expansão', 'Avaliar ampliação de usuários para o próximo ciclo.', 10, 'PENDING', 'MEDIUM', 'larissa.pereira@safraforte.agr.br', 'mariana.alencar@crm.com', 'mariana.alencar@crm.com'),
        ('Registrar motivo de perda no CRM', 'Documentar feedback final para análise comercial.', -5, 'COMPLETED', 'LOW', 'marcelo@novaviasistemas.com.br', 'rafael.nogueira@crm.com', 'rafael.nogueira@crm.com'),
        ('Enviar catálogo de pacotes', 'Compartilhar comparativo de planos via WhatsApp/e-mail.', 3, 'PENDING', 'MEDIUM', 'natalia.cunha@belaforma.com.br', 'camila.rocha@crm.com', 'beatriz.souza@crm.com'),
        ('Ajustar orçamento de implantação', 'Rever custos de treinamento conforme solicitado.', 2, 'IN_PROGRESS', 'HIGH', 'otavio.melo@portodigitalpe.com.br', 'lucas.ferreira@crm.com', 'lucas.ferreira@crm.com'),
        ('Reunião cancelada pelo prospect', 'Cliente adiou projeto para o próximo semestre.', -3, 'CANCELED', 'LOW', 'gustavo.reis@transsul.com.br', 'rafael.nogueira@crm.com', 'admin@crm.com')
) AS v(title, description, offset_days, status, priority, customer_email, assignee_email, creator_email)
JOIN customers c ON c.email = v.customer_email
JOIN users u_ass ON u_ass.email = v.assignee_email
JOIN users u_cre ON u_cre.email = v.creator_email
WHERE NOT EXISTS (
    SELECT 1 FROM tasks t WHERE t.title = v.title AND t.customer_id = c.id
);

-- 4. ANOTAÇÕES DE CLIENTES (10 registros)
INSERT INTO customer_notes (customer_id, author_id, content)
SELECT c.id, u.id, v.content
FROM (
    VALUES
        ('ana.mendes@horizonte.com.br', 'lucas.ferreira@crm.com', 'Primeiro contato realizado. Cliente busca centralizar o atendimento de 3 filiais.'),
        ('bruno.costa@solarisenergia.com.br', 'camila.rocha@crm.com', 'Demonstrou interesse especial no acompanhamento de tarefas e histórico por cliente.'),
        ('carla.lima@verdevale.com.br', 'rafael.nogueira@crm.com', 'Proposta enviada com duas opções de pacote; aguardando retorno da diretoria.'),
        ('diego.alves@techpulse.io', 'lucas.ferreira@crm.com', 'Negociação avançada: ajustes finais no prazo de implantação e suporte.'),
        ('eduarda@atelieforma.com.br', 'camila.rocha@crm.com', 'Contrato assinado e conta ativada. Equipe elogiou a simplicidade do painel.'),
        ('felipe.santos@apexindustrial.com.br', 'mariana.alencar@crm.com', 'Reunião de acompanhamento mensal: alta adesão do time comercial ao funil.'),
        ('gabriela@vitaessencia.com.br', 'rafael.nogueira@crm.com', 'Solicitou ajuste na quantidade de licenças iniciais antes de fechar.'),
        ('isabela@luminahealth.com.br', 'beatriz.souza@crm.com', 'Validamos requisitos de segurança e controle de acesso por perfil (RBAC).'),
        ('larissa.pereira@safraforte.agr.br', 'mariana.alencar@crm.com', 'Cliente indicou outro contato do setor agrícola para nova oportunidade.'),
        ('samuel.vieira@cloudbridge.com.br', 'beatriz.souza@crm.com', 'Onboarding concluído com sucesso e primeiras métricas já visíveis no dashboard.')
) AS v(customer_email, author_email, content)
JOIN customers c ON c.email = v.customer_email
JOIN users u ON u.email = v.author_email
WHERE NOT EXISTS (
    SELECT 1 FROM customer_notes cn WHERE cn.customer_id = c.id AND cn.content = v.content
);