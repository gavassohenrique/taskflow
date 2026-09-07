const API_URL = window.TASKFLOW_API_URL || "http://localhost:3000/api/tarefas";

async function carregarTarefas() {
    try {
        const resposta = await fetch(API_URL);

        const tarefas = await resposta.json();

        mostrarTarefas(tarefas);

        atualizarDashboard(tarefas);

    } catch (erro) {
        console.error("Erro:", erro);
    }
}

function mostrarTarefas(tarefas) {
    const lista = document.getElementById("listaTarefas");

    lista.innerHTML = "";

    tarefas.forEach(tarefa => {

        const elemento = document.createElement("div");

        elemento.classList.add("tarefa");

        elemento.innerHTML = `
            <h3>${tarefa.titulo}</h3>

            <p>${tarefa.descricao || "Sem descrição"}</p>

            <p>
                <strong>Status:</strong>
                ${tarefa.status}
            </p>

            <p>
                <strong>Prioridade:</strong>
                ${tarefa.prioridade}
            </p>

            <p>
                <strong>Prazo:</strong>
                ${tarefa.prazo || "Não definido"}
            </p>

            <button onclick="concluirTarefa(${tarefa.id})">
                Concluir
            </button>

            <button onclick="excluirTarefa(${tarefa.id})">
                Excluir
            </button>
        `;

        lista.appendChild(elemento);
    });
}

function atualizarDashboard(tarefas) {

    document.getElementById("totalTarefas").textContent =
        tarefas.length;

    document.getElementById("pendentes").textContent =
        tarefas.filter(t => t.status === "Pendente").length;

    document.getElementById("andamento").textContent =
        tarefas.filter(t => t.status === "Em andamento").length;

    document.getElementById("concluidas").textContent =
        tarefas.filter(t => t.status === "Concluída").length;
}

async function criarTarefa() {

    const titulo =
        document.getElementById("titulo").value;

    const descricao =
        document.getElementById("descricao").value;

    const prioridade =
        document.getElementById("prioridade").value;

    const prazo =
        document.getElementById("prazo").value;

    if (!titulo) {
        alert("Digite um título.");
        return;
    }

    await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            titulo,
            descricao,
            prioridade,
            prazo,
            status: "Pendente"
        })
    });

    document.getElementById("titulo").value = "";

    document.getElementById("descricao").value = "";

    document.getElementById("prazo").value = "";

    carregarTarefas();
}

async function concluirTarefa(id) {

    const resposta =
        await fetch(`${API_URL}/${id}`);

    const tarefa =
        await resposta.json();

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            titulo: tarefa.titulo,
            descricao: tarefa.descricao,
            status: "Concluída",
            prioridade: tarefa.prioridade,
            prazo: tarefa.prazo
        })
    });

    carregarTarefas();
}

async function excluirTarefa(id) {

    if (!confirm("Deseja realmente excluir esta tarefa?")) {
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    carregarTarefas();
}

carregarTarefas();