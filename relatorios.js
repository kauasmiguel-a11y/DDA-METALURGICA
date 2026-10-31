
const API_URL = "https://6abb0663b2118ed7abb7de1b.mockapi.io/dda-metalurgica/pastilhas";

const corpoRelatorio = document.getElementById("corpo-relatorio");

const filtroRelatorio = document.getElementById("filtro-relatorio");

const totalProdutos = document.getElementById("total-produtos");
const totalQuantidade = document.getElementById("total-quantidade");
const valorTotal = document.getElementById("valor-total");

const tituloRelatorio = document.getElementById("titulo-relatorio");
const dataRelatorio = document.getElementById("data-relatorio");

let produtos = [];

// DATA ATUAL

function obterDataAtual() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

dataRelatorio.value = obterDataAtual();

// FORMATAÇÃO

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// CARREGAR ESTOQUE

async function carregarEstoque() {
    try {
        corpoRelatorio.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    Carregando produtos...
                </td>
            </tr>
        `;

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Não foi possível consultar o estoque.");
        }

        const dados = await resposta.json();

        produtos = dados.map(produto => ({
            codigo: produto.codigo ?? "",
            nome: produto.nome ?? "",
            quantidade: Number(produto.quantidade) || 0,
            minimo: Number(produto.minimo) || 0,
            fornecedor: produto.fornecedor ?? "",
            preco: Number(produto.preco) || 0
        }));

        renderizarTabela();

    } catch (erro) {
        console.error(erro);

        corpoRelatorio.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    Erro ao carregar os produtos. Verifique a conexão com a API.
                </td>
            </tr>
        `;
    }
}

// FILTRAR PRODUTOS

function obterProdutosFiltrados() {
    if (filtroRelatorio.value === "reposicao") {
        return produtos.filter(produto =>
            produto.quantidade <= produto.minimo
        );
    }

    return produtos;
}

// CRIAR CAMPO EDITÁVEL

function criarCampo(valor, tipo, callback) {
    const input = document.createElement("input");

    input.type = tipo;
    input.value = valor;

    if (tipo === "number") {
        input.min = "0";
        input.step = "any";
    }

    input.addEventListener("input", () => {
        callback(input.value);
        atualizarResumo();
    });

    return input;
}

// MONTAR TABELA

function renderizarTabela() {
    corpoRelatorio.replaceChildren();

    const lista = obterProdutosFiltrados();

    if (lista.length === 0) {
        const linha = document.createElement("tr");
        const coluna = document.createElement("td");

        coluna.colSpan = 7;
        coluna.className = "empty-message";
        coluna.textContent = "Nenhum produto encontrado.";

        linha.appendChild(coluna);
        corpoRelatorio.appendChild(linha);

        atualizarResumo();
        return;
    }

    lista.forEach(produto => {
        const indice = produtos.indexOf(produto);

        const linha = document.createElement("tr");

        const campos = [
            ["codigo", "text"],
            ["nome", "text"],
            ["quantidade", "number"],
            ["minimo", "number"],
            ["fornecedor", "text"]
        ];

        campos.forEach(([campo, tipo]) => {
            const coluna = document.createElement("td");

            const input = criarCampo(
                produto[campo],
                tipo,
                valor => {
                    produto[campo] = tipo === "number"
                        ? Number(valor)
                        : valor;

                    if (campo === "quantidade") {
                        atualizarValorLinha(produto, linha);
                    }
                }
            );

            coluna.appendChild(input);
            linha.appendChild(coluna);
        });

        const colunaValor = document.createElement("td");
        colunaValor.className = "valor-total";

        atualizarValorLinha(produto, linha, colunaValor);

        linha.appendChild(colunaValor);

        const colunaAcao = document.createElement("td");
        colunaAcao.className = "no-print";

        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn-delete";

        botaoExcluir.addEventListener("click", () => {
            produtos.splice(indice, 1);
            renderizarTabela();
        });

        colunaAcao.appendChild(botaoExcluir);
        linha.appendChild(colunaAcao);

        corpoRelatorio.appendChild(linha);
    });

    atualizarResumo();
}

// CALCULAR VALOR DA LINHA

function atualizarValorLinha(produto, linha, colunaExistente) {
    const coluna = colunaExistente || linha.querySelector(".valor-total");

    if (!coluna) return;

    const total = produto.quantidade * produto.preco;

    coluna.textContent = formatarMoeda(total);
}

// ATUALIZAR RESUMO

function atualizarResumo() {
    const lista = obterProdutosFiltrados();

    const quantidade = lista.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    const valor = lista.reduce(
        (total, produto) => total + produto.quantidade * produto.preco,
        0
    );

    totalProdutos.textContent = lista.length;
    totalQuantidade.textContent = quantidade;
    valorTotal.textContent = formatarMoeda(valor);
}

// ADICIONAR LINHA

document.getElementById("btn-adicionar").addEventListener("click", () => {
    produtos.push({
        codigo: "",
        nome: "",
        quantidade: 0,
        minimo: 0,
        fornecedor: "",
        preco: 0
    });

    filtroRelatorio.value = "todos";

    renderizarTabela();
});

// ATUALIZAR ESTOQUE

document.getElementById("btn-atualizar").addEventListener("click", () => {
    carregarEstoque();
});

// FILTRO

filtroRelatorio.addEventListener("change", () => {
    renderizarTabela();

    tituloRelatorio.value =
        filtroRelatorio.value === "reposicao"
            ? "Relatório de Necessidade de Reposição"
            : "Relatório de Estoque";
});

// LIMPAR RELATÓRIO

document.getElementById("btn-limpar").addEventListener("click", () => {
    const confirmar = confirm(
        "Deseja limpar a tabela e as observações deste relatório?"
    );

    if (!confirmar) return;

    produtos = [];

    document.getElementById("observacoes").value = "";
    document.getElementById("descricao-relatorio").value = "";

    renderizarTabela();
});

// IMPRIMIR

document.getElementById("btn-imprimir").addEventListener("click", () => {
    window.print();
});

// INICIAR

carregarEstoque();
