-- Test users for authentication system
-- Insert test users into usuarios table

-- Regular user (tipo: usuario)
INSERT INTO usuarios (nome, email, senha, cpf, telefone, data_nascimento, tipo, ativo) VALUES
('João Silva', 'joao.silva@email.com', '$2b$10$rOz8vZxZxZxZxZxZxZxZxO8vZxZxZxZxZxZxZxZxZxZxZxZxZx', '123.456.789-01', '(11) 99999-1111', '1990-05-15', 'usuario', TRUE);

-- Company user (tipo: empresa) - using CPF from existing company
INSERT INTO usuarios (nome, email, senha, cpf, telefone, data_nascimento, tipo, ativo) VALUES
('Maria Santos', 'maria.santos@email.com', '$2b$10$rOz8vZxZxZxZxZxZxZxZxO8vZxZxZxZxZxZxZxZxZxZxZxZx', '111.111.111-01', '(11) 99999-2222', '1985-08-20', 'empresa', TRUE);

-- Another company user
INSERT INTO usuarios (nome, email, senha, cpf, telefone, data_nascimento, tipo, ativo) VALUES
('Pedro Oliveira', 'pedro.oliveira@email.com', '$2b$10$rOz8vZxZxZxZxZxZxZxZxO8vZxZxZxZxZxZxZxZxZxZxZxZx', '222.222.222-02', '(21) 99999-3333', '1982-12-10', 'empresa', TRUE);

-- Admin user (tipo: admin)
INSERT INTO usuarios (nome, email, senha, telefone, tipo, ativo) VALUES
('Administrador Sistema', 'admin@idebrasil.com.br', '$2b$10$rOz8vZxZxZxZxZxZxZxZxO8vZxZxZxZxZxZxZxZxZxZxZxZx', '(11) 99999-0000', 'admin', TRUE);