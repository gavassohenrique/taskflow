const express = require("express");

const {
    listarTarefas,
    buscarTarefa,
    criarTarefa,
    atualizarTarefa,
    excluirTarefa
} = require("../controllers/tarefaController");

const router = express.Router();

router.get("/", listarTarefas);
router.get("/:id", buscarTarefa);
router.post("/", criarTarefa);
router.put("/:id", atualizarTarefa);
router.delete("/:id", excluirTarefa);

module.exports = router;