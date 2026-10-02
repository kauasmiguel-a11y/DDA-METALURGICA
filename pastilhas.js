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


const formulario = document.getElementById("form-pastilha");
const listaPastilhas = document.getElementById("lista-pastilhas");
const contador = document.getElementById("contador-pastilhas");

const CHAVE_MOVIMENTACOES = "movimentacoesDDA";

let pastilhas = [];

function verificarStatus(quantidade, minimo) {

    let status = "OK";
    let classeStatus = "status-ok";

    if (quantidade >= minimo) {

        status = "OK";
        classeStatus = "status-ok";

    } else if (quantidade > minimo * 0.5) {

        status = "Baixo";
        classeStatus = "status-warning";

    } else {

        status = "Crítico";
        classeStatus = "status-critical";

    }

    return {
        status: status,
        classeStatus: classeStatus
    };
}


function pastilhasFiltradas() {

    const texto =
        document.getElementById("busca").value.toLowerCase();

    const status =
        document.getElementById("status").value;

    const fornecedor =
        document.getElementById("filtro-fornecedor").value.toLowerCase();

    const classes = {
        ok: "status-ok",
        baixo: "status-warning",
        critico: "status-critical"
    };

    return pastilhas.filter(function (p) {

        const textoOk =
            String(p.codigo).toLowerCase().includes(texto) ||
            String(p.nome).toLowerCase().includes(texto);

        const statusOk =
            !status ||
            verificarStatus(p.quantidade, p.minimo).classeStatus === classes[status];

        const fornecedorOk =
            !fornecedor ||
            String(p.fornecedor).toLowerCase() === fornecedor;

        return textoOk && statusOk && fornecedorOk;

    });
}


function mostrarPastilhas() {

    listaPastilhas.innerHTML = "";

    const lista = pastilhasFiltradas();

    for (let i = 0; i < lista.length; i++) {

        const pastilha = lista[i];

        const resultado =
            verificarStatus(
                pastilha.quantidade,
                pastilha.minimo
            );

        const novaPastilha =
            document.createElement("div");

        novaPastilha.classList.add("pastilha");

        novaPastilha.innerHTML = `
            <div class="pastilha-info">

                <strong>
                    ${pastilha.codigo}
                </strong>

                <span>
                    ${pastilha.nome}
                </span>

                <span>
                    Categoria: ${pastilha.categoria}
                </span>

                <span>
                    Fornecedor: ${pastilha.fornecedor}
                </span>

                <span>
                    Preço: R$ ${pastilha.preco || 0}
                </span>

            </div>


            <div class="pastilha-estoque">

                <span>
                    Quantidade: ${pastilha.quantidade}
                </span>

                <span>
                    Mínimo: ${pastilha.minimo}
                </span>

                <span class="status ${resultado.classeStatus}">
                    ${resultado.status}
                </span>

            </div>


            <div class="pastilha-acoes">

                <button class="btn-ver" data-id="${pastilha.id}">
                    Ver
                </button>

                <button class="btn-editar" data-id="${pastilha.id}">
                    Editar
                </button>

                <button class="btn-excluir" data-id="${pastilha.id}">
                    Excluir
                </button>

            </div>
        `;

        listaPastilhas.appendChild(novaPastilha);

    }
}