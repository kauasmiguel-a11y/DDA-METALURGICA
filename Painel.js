const CHAVE_PASTILHAS = "pastilhasDDA";
const CHAVE_MOVIMENTACOES = "movimentacoesDDA";


const totalItens =
    document.getElementById("total-itens");

const estoqueOk =
    document.getElementById("estoque-ok");

const estoqueBaixo =
    document.getElementById("estoque-baixo");

const estoqueCritico =
    document.getElementById("estoque-critico");


const listaAlertas =
    document.getElementById("lista-alertas");

const listaMovimentacoes =
    document.getElementById("lista-movimentacoes");


function obterPastilhas() {

    const dados =
        localStorage.getItem(
            CHAVE_PASTILHAS
        );


    if (dados) {

        return JSON.parse(dados);

    }


    return [];
}


function obterMovimentacoes() {

    const dados =
        localStorage.getItem(
            CHAVE_MOVIMENTACOES
        );


    if (dados) {

        return JSON.parse(dados);

    }


    return [];
}


function verificarStatus(pastilha) {

    if (
        pastilha.quantidade >=
        pastilha.minimo
    ) {

        return "OK";

    }


    if (
        pastilha.quantidade >
        pastilha.minimo * 0.5
    ) {

        return "Baixo";

    }


    return "Crítico";
}


function atualizarResumo(pastilhas) {

    let total = pastilhas.length;

    let ok = 0;

    let baixo = 0;

    let critico = 0;


    for (
        let i = 0;
        i < pastilhas.length;
        i++
    ) {

        const status =
            verificarStatus(
                pastilhas[i]
            );


        if (status === "OK") {

            ok++;

        } else if (status === "Baixo") {

            baixo++;

        } else {

            critico++;

        }

    }


    totalItens.textContent =
        total;

    estoqueOk.textContent =
        ok;

    estoqueBaixo.textContent =
        baixo;

    estoqueCritico.textContent =
        critico;
}


function atualizarAlertas(pastilhas) {

    listaAlertas.innerHTML = "";

    let encontrouAlerta = false;


    for (
        let i = 0;
        i < pastilhas.length;
        i++
    ) {

        const pastilha =
            pastilhas[i];


        const status =
            verificarStatus(
                pastilha
            );


        if (status !== "OK") {

            encontrouAlerta = true;


            const alerta =
                document.createElement("div");


            alerta.classList.add(
                "alert"
            );


            if (status === "Crítico") {

                alerta.classList.add(
                    "alert-critical"
                );

            } else {

                alerta.classList.add(
                    "alert-warning"
                );

            }


            const conteudo =
                document.createElement("div");


            conteudo.classList.add(
                "alert-content"
            );


            const nome =
                document.createElement("strong");


            nome.textContent =
                pastilha.descricao;


            const informacao =
                document.createElement("span");


            informacao.textContent =
                `Quantidade: ${pastilha.quantidade} | Mínimo: ${pastilha.minimo}`;


            conteudo.appendChild(
                nome
            );


            conteudo.appendChild(
                informacao
            );


            const statusElemento =
                document.createElement("span");


            statusElemento.classList.add(
                "status"
            );


            statusElemento.textContent =
                status;


            alerta.appendChild(
                conteudo
            );


            alerta.appendChild(
                statusElemento
            );


            listaAlertas.appendChild(
                alerta
            );

        }

    }


    if (!encontrouAlerta) {

        const mensagem =
            document.createElement("p");


        mensagem.textContent =
            "Nenhum alerta de estoque.";


        listaAlertas.appendChild(
            mensagem
        );

    }

}


function atualizarMovimentacoes() {

    const movimentacoes =
        obterMovimentacoes();


    listaMovimentacoes.innerHTML =
        "";


    if (movimentacoes.length === 0) {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `
            <td colspan="4">
                Nenhuma movimentação registrada.
            </td>
        `;


        listaMovimentacoes.appendChild(
            linha
        );


        return;
    }


    for (
        let i = 0;
        i < movimentacoes.length && i < 5;
        i++
    ) {

        const movimentacao =
            movimentacoes[i];


        const linha =
            document.createElement("tr");


        const quantidade =
            movimentacao.quantidade;


        let quantidadeExibida =
            quantidade;


        if (
            movimentacao.tipo === "Entrada"
        ) {

            quantidadeExibida =
                "+" + quantidade;

        } else {

            quantidadeExibida =
                "-" + quantidade;

        }


        linha.innerHTML = `
            <td>
                ${movimentacao.data}
            </td>

            <td>
                ${movimentacao.pastilha}
            </td>

            <td>
                ${movimentacao.tipo}
            </td>

            <td>
                ${quantidadeExibida}
            </td>
        `;


        listaMovimentacoes.appendChild(
            linha
        );

    }

}


function atualizarDashboard() {

    const pastilhas =
        obterPastilhas();


    atualizarResumo(
        pastilhas
    );


    atualizarAlertas(
        pastilhas
    );


    atualizarMovimentacoes();

}


/*
    Atualiza o Dashboard quando
    outra aba alterar o localStorage.
*/

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === CHAVE_PASTILHAS ||
            event.key === CHAVE_MOVIMENTACOES
        ) {

            atualizarDashboard();

        }

    }
);


/*
    Atualiza quando receber
    o aviso de estoque atualizado.
*/

window.addEventListener(
    "estoqueAtualizado",
    function () {

        atualizarDashboard();

    }
);


atualizarDashboard();