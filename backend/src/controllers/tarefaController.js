const pool = require("../database/database");

async function listarTarefas(req, res) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM tarefas ORDER BY id DESC"
        );

        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar tarefas"
        });
    }
}

async function buscarTarefa(req, res) {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT * FROM tarefas WHERE id = $1",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Tarefa não encontrada"
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar tarefa"
        });
    }
}

async function criarTarefa(req, res) {
    try {
        const {
            titulo,
            descricao,
            status,
            prioridade,
            prazo
        } = req.body;

        if (!titulo) {
            return res.status(400).json({
                erro: "O título da tarefa é obrigatório"
            });
        }

        const resultado = await pool.query(
            `INSERT INTO tarefas
            (titulo, descricao, status, prioridade, prazo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                titulo,
                descricao || "",
                status || "Pendente",
                prioridade || "Média",
                prazo || null
            ]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao criar tarefa"
        });
    }
}

async function atualizarTarefa(req, res) {
    try {
        const { id } = req.params;

        const {
            titulo,
            descricao,
            status,
            prioridade,
            prazo
        } = req.body;

        const resultado = await pool.query(
            `UPDATE tarefas
             SET titulo = $1,
                 descricao = $2,
                 status = $3,
                 prioridade = $4,
                 prazo = $5
             WHERE id = $6
             RETURNING *`,
            [
                titulo,
                descricao,
                status,
                prioridade,
                prazo || null,
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Tarefa não encontrada"
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao atualizar tarefa"
        });
    }
}

async function excluirTarefa(req, res) {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            "DELETE FROM tarefas WHERE id = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Tarefa não encontrada"
            });
        }

        res.json({
            mensagem: "Tarefa excluída com sucesso"
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao excluir tarefa"
        });
    }
}

module.exports = {
    listarTarefas,
    buscarTarefa,
    criarTarefa,
    atualizarTarefa,
    excluirTarefa
};