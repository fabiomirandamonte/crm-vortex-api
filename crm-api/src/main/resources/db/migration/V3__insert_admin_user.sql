-- Inserção de Usuário Admin Inicial (Senha padrão: admin123)
-- Hash BCrypt para 'admin123': $2a$10$e8.4oJk42.kM04T6aA03mOp5/mOa.J/zN/bI29J2JjG8.O9T1G2K6 (ou gerado via Spring)
INSERT INTO users (name, email, password_hash, role_id, active)
VALUES (
    'Administrador CRM',
    'admin@crm.com',
    '$2a$10$wS2CgD9KZnJd8b3xY2h7uO.jQ0X4m0x6b9G3.1mH5bL8kQ9jW2L6a', -- BCrypt de 'admin123'
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'),
    TRUE
) ON CONFLICT (email) DO NOTHING;