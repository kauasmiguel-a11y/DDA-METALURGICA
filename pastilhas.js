const API_URL = "https://6abb0663b2118ed7abb7de1b.mockapi.io/dda-metalurgica/pastilhas";

async function tratarResposta(resposta) {
    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    return await resposta.json();
}

// GET geral
async function listarPastilhas() {
    const resposta = await fetch(API_URL);
    return await tratarResposta(resposta);
}

// GET por id
async function buscarPastilhaPorId(id) {
    const resposta = await fetch(`${API_URL}/${id}`);
    return await tratarResposta(resposta);
}

// POST
async function criarPastilha(dados) {
    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });
    return await tratarResposta(resposta);
}

// PUT
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

    contador.innerHTML =
        lista.length === pastilhas.length
            ? `${pastilhas.length} itens cadastrados`
            : `${lista.length} de ${pastilhas.length} itens`;
}


function registrarMovimentacao(pastilha) {

    let movimentacoes =
        JSON.parse(
            localStorage.getItem(CHAVE_MOVIMENTACOES)
        ) || [];

    const data =
        new Date().toLocaleDateString("pt-BR");

    const movimentacao = {

        data: data,

        pastilha: pastilha.codigo,

        tipo: "Entrada",

        quantidade: pastilha.quantidade
    };

    movimentacoes.push(movimentacao);

    localStorage.setItem(
        CHAVE_MOVIMENTACOES,
        JSON.stringify(movimentacoes)
    );
}


const detalhe = document.getElementById("detalhe-pastilha");
const botaoSubmit = formulario.querySelector("button[type='submit']");

let idEmEdicao = null;


// GET geral
async function carregarPastilhas() {

    listaPastilhas.innerHTML =
        "<p style='padding:18px'>Carregando...</p>";

    try {

        pastilhas = await listarPastilhas();

        mostrarPastilhas();

    } catch (erro) {

        console.error(
            "Não foi possível consultar as pastilhas:",
            erro
        );

        listaPastilhas.innerHTML =
            `<p style='padding:18px'>Erro ao carregar: ${erro.message}</p>`;
    }
}


// POST ou PUT
formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const dados = {

            nome: document.getElementById("nome").value,

            codigo: document.getElementById("codigo").value,

            quantidade: Number(
                document.getElementById("quantidade-inicial").value
            ),

            minimo: Number(
                document.getElementById("estoque-minimo").value
            ),

            categoria: document.getElementById("categoria").value,

            fornecedor: document.getElementById("fornecedor").value,

            preco: Number(
                document.getElementById("preco").value
            )
        };

        try {

            if (idEmEdicao) {

                await atualizarPastilha(idEmEdicao, dados);

            } else {

                const criada = await criarPastilha(dados);

                registrarMovimentacao(criada);
            }

            idEmEdicao = null;

            botaoSubmit.innerHTML = "Cadastrar Pastilha";

            formulario.reset();

            await carregarPastilhas();

        } catch (erro) {

            console.error("Erro ao salvar:", erro);

            alert(
                "Não foi possível salvar: " + erro.message
            );
        }

    }
);


listaPastilhas.addEventListener(
    "click",
    async function (event) {

        const botao = event.target;

        const id = botao.dataset.id;

        if (!id) return;

        try {

            if (botao.classList.contains("btn-ver")) {

                const p = await buscarPastilhaPorId(id);

                detalhe.innerHTML = `
                    <h3>Detalhe da pastilha ${p.codigo}</h3>
                    <p>Nome: ${p.nome}</p>
                    <p>Categoria: ${p.categoria}</p>
                    <p>Fornecedor: ${p.fornecedor}</p>
                    <p>Preço: R$ ${p.preco || 0}</p>
                    <p>Quantidade: ${p.quantidade} (mínimo ${p.minimo})</p>
                `;

                detalhe.scrollIntoView();

            }


            if (botao.classList.contains("btn-editar")) {

                const p = await buscarPastilhaPorId(id);

                document.getElementById("nome").value = p.nome;

                document.getElementById("codigo").value = p.codigo;

                document.getElementById("quantidade-inicial").value =
                    p.quantidade;

                document.getElementById("estoque-minimo").value =
                    p.minimo;

                document.getElementById("categoria").value =
                    p.categoria;

                document.getElementById("fornecedor").value =
                    p.fornecedor;

                document.getElementById("preco").value =
                    p.preco;

                idEmEdicao = id;

                botaoSubmit.innerHTML =
                    "Salvar alterações";

                formulario.scrollIntoView();

            }


            if (botao.classList.contains("btn-excluir")) {

                if (!confirm("Excluir esta pastilha?")) return;

                await excluirPastilha(id);

                await carregarPastilhas();

            }

        } catch (erro) {

            console.error(
                "Erro na operação:",
                erro
            );

            alert(
                "Erro: " + erro.message
            );
        }

    }
);



document.getElementById("busca").addEventListener("input", mostrarPastilhas);

document.getElementById("status").addEventListener("change", mostrarPastilhas);

document.getElementById("filtro-fornecedor").addEventListener("change", mostrarPastilhas);


carregarPastilhas();