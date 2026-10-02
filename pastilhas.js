const API_URL = "https://6abb0663b2118ed7abb7de1b.mockapi.io/dda-metalurgica/pastilhas"

async function tratarResposta(resposta) {
    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    return await resposta.json();
}

//GET geral
async function listarPastilhas() {
    const resposta = await fetch(API_URL);
    return await tratarResposta(resposta);
}

// GET por id
async function buscarPastilhaPorId(id) {
    const resposta = await fetch(`${API_URL}/${id}`);
    return await tratarResposta(resposta);
}

//POST
async function criarPastilha(dados) {
    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });
    return await tratarResposta(resposta);
}

//PUT
async function atualizarPastilha(id, dados) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });
    return await tratarResposta(resposta);
}

// DELETE
async function excluirPastilha(id) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    return await tratarResposta(resposta);
}