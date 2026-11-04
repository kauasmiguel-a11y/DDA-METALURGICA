const API_URL = "https://6abafbac5b549d818d62c1c5.mockapi.io/dda-metalurgica/pastilhas";

const CHAVE_MOVIMENTACOES = "movimentacoesDDA";

// BUSCAR PASTILHAS NA API
async function obterPastilhas() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        return await resposta.json();

    } catch (erro) {
        console.error("Não foi possível consultar as pastilhas:", erro);
        return null;
    }
}

// MESMA REGRA DA PÁGINA DE PASTILHAS
function verificarStatus(quantidade, minimo) {
    quantidade = Number(quantidade);
    minimo = Number(minimo);

    if (quantidade >= minimo) {
        return { status: "OK", classeStatus: "status-ok" };
    }

    if (quantidade > minimo * 0.5) {
        return { status: "Baixo", classeStatus: "status-warning" };
    }

    return { status: "Crítico", classeStatus: "status-critical" };
}

// MESMO FORMATO DE CÓDIGO DA PÁGINA DE PASTILHAS
function formatarCodigo(codigo) {
    return String(codigo ?? "-").replace(/^codigo/i, "Código");
}

// ATUALIZAR CARDS
function atualizarResumo(pastilhas) {
    let ok = 0;
    let baixo = 0;
    let critico = 0;

    pastilhas.forEach(p => {
        const { status } = verificarStatus(p.quantidade, p.minimo);

        if (status === "OK") ok++;
        else if (status === "Baixo") baixo++;
        else critico++;
    });

    document.getElementById("total-itens").textContent = pastilhas.length;
    document.getElementById("estoque-ok").textContent = ok;
    document.getElementById("estoque-baixo").textContent = baixo;
    document.getElementById("estoque-critico").textContent = critico;
}

// ATUALIZAR ALERTAS
function atualizarAlertas(pastilhas) {
    const lista = document.getElementById("lista-alertas");

    lista.innerHTML = "";

    const alertas = pastilhas
        .map(p => ({ pastilha: p, ...verificarStatus(p.quantidade, p.minimo) }))
        .filter(a => a.status !== "OK")
        .sort((a, b) => {
            // críticos primeiro, depois os de menor quantidade
            if (a.status !== b.status) return a.status === "Crítico" ? -1 : 1;
            return Number(a.pastilha.quantidade) - Number(b.pastilha.quantidade);
        });

    if (alertas.length === 0) {
        lista.innerHTML = "<li>Nenhum alerta de estoque no momento.</li>";
        return;
    }

    alertas.forEach(({ pastilha, status, classeStatus }) => {
        const item = document.createElement("li");
        item.className = status === "Crítico" ? "critico" : "baixo";

        const info = document.createElement("div");
        info.className = "alerta-info";

        const codigo = document.createElement("strong");
        codigo.textContent = formatarCodigo(pastilha.codigo);

        const nome = document.createElement("span");
        nome.textContent = pastilha.nome || "Pastilha sem nome";

        const detalhes = document.createElement("span");
        detalhes.textContent =
            `Quantidade: ${pastilha.quantidade} | Mínimo: ${pastilha.minimo}`;

        info.append(codigo, nome, detalhes);

        const badge = document.createElement("span");
        badge.className = `status ${classeStatus}`;
        badge.textContent = status;

        item.append(info, badge);
        lista.appendChild(item);
    });
}

// ATUALIZAR MOVIMENTAÇÕES (mesma chave do localStorage das pastilhas)
function atualizarMovimentacoes() {
    const tabela = document.getElementById("lista-movimentacoes");

    let movimentacoes = [];

    try {
        movimentacoes = JSON.parse(localStorage.getItem(CHAVE_MOVIMENTACOES)) || [];
    } catch (erro) {
        console.error("Movimentações inválidas no localStorage:", erro);
    }

    tabela.innerHTML = "";

    if (movimentacoes.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="4">Nenhuma movimentação registrada.</td>
            </tr>
        `;
        return;
    }

    const ultimas = [...movimentacoes].reverse().slice(0, 5);

    ultimas.forEach(movimentacao => {
        const linha = document.createElement("tr");

        const valores = [
            movimentacao.data,
            formatarCodigo(movimentacao.pastilha),
            movimentacao.tipo,
            movimentacao.quantidade
        ];

        valores.forEach(valor => {
            const celula = document.createElement("td");
            celula.textContent = valor ?? "-";
            linha.appendChild(celula);
        });

        tabela.appendChild(linha);
    });
}

// ATUALIZAR DASHBOARD
async function atualizarDashboard() {
    const pastilhas = await obterPastilhas();

    atualizarMovimentacoes();

    if (pastilhas === null) {
        ["total-itens", "estoque-ok", "estoque-baixo", "estoque-critico"]
            .forEach(id => document.getElementById(id).textContent = "-");

        document.getElementById("lista-alertas").innerHTML =
            "<li>Não foi possível carregar os dados do estoque.</li>";

        return;
    }

    atualizarResumo(pastilhas);
    atualizarAlertas(pastilhas);
}

// INICIALIZAR
document.addEventListener("DOMContentLoaded", atualizarDashboard);

// ATUALIZAR AO VOLTAR PARA A ABA OU QUANDO OUTRA ABA REGISTRAR ENTRADA
window.addEventListener("focus", atualizarDashboard);
window.addEventListener("storage", atualizarDashboard);