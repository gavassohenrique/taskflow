require("dotenv").config();

const express = require("express");
const cors = require("cors");

const tarefaRoutes = require("./routes/tarefaRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "TaskFlow API funcionando!"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        sistema: "TaskFlow"
    });
});

app.use("/api/tarefas", tarefaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});