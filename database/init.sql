CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    prioridade VARCHAR(20) NOT NULL DEFAULT 'Média',
    prazo DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tarefas
(titulo, descricao, status, prioridade, prazo)
VALUES
(
    'Configurar Docker',
    'Criar os containers da aplicação',
    'Concluída',
    'Alta',
    '2026-09-10'
),
(
    'Criar API',
    'Desenvolver API REST com Node.js',
    'Em andamento',
    'Alta',
    '2026-09-15'
),
(
    'Criar interface',
    'Desenvolver frontend do TaskFlow',
    'Pendente',
    'Média',
    '2026-09-20'
);