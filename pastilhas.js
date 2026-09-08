const formulario = document.getElementById("form-pastilha");
const listaPastilhas = document.getElementById("lista-pastilhas");
const contador = document.getElementById("contador-pastilhas");

const CHAVE_PASTILHAS = "pastilhasDDA";
const CHAVE_MOVIMENTACOES = "movimentacoesDDA";


let pastilhas =
    JSON.parse(localStorage.getItem(CHAVE_PASTILHAS)) || [];


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

function mostrarPastilhas() {

    listaPastilhas.innerHTML = "";

    for (let i = 0; i < pastilhas.length; i++) {

        const pastilha = pastilhas[i];

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
                    ${pastilha.descricao}
                </span>

                <span>
                    Fabricante: ${pastilha.fabricante}
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
        `;


        listaPastilhas.appendChild(novaPastilha);

    }


    contador.textContent =
        `${pastilhas.length} itens cadastrados`;
}


function registrarMovimentacao(pastilha) {

    let movimentacoes =
        JSON.parse(
            localStorage.getItem(CHAVE_MOVIMENTACOES)
        ) || [];


    const dataAtual =
        new Date();


    const data =
        dataAtual.toLocaleDateString("pt-BR");


    const movimentacao = {

        data: data,

        pastilha: pastilha.codigo,

        tipo: "Entrada",

        quantidade: pastilha.quantidade

    };


    movimentacoes.unshift(
        movimentacao
    );


    localStorage.setItem(
        CHAVE_MOVIMENTACOES,
        JSON.stringify(movimentacoes)
    );
}


formulario.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const codigo =
            document.getElementById("codigo").value;


        const descricao =
            document.getElementById("descricao").value;


        const fabricante =
            document.getElementById("fabricante-novo").value;


        const minimo =
            Number(
                document.getElementById("estoque-minimo").value
            );


        const quantidade =
            Number(
                document.getElementById("quantidade-inicial").value
            );


        const novaPastilha = {

            codigo: codigo,

            descricao: descricao,

            fabricante: fabricante,

            quantidade: quantidade,

            minimo: minimo

        };


        pastilhas.push(
            novaPastilha
        );


        localStorage.setItem(
            CHAVE_PASTILHAS,
            JSON.stringify(pastilhas)
        );


        registrarMovimentacao(
            novaPastilha
        );


        mostrarPastilhas();


        formulario.reset();

        /*
            Atualiza o Dashboard caso
            ele esteja aberto na mesma página.
        */

        window.dispatchEvent(
            new Event("estoqueAtualizado")
        );

    }
);


mostrarPastilhas();

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === CHAVE_PASTILHAS ||
            event.key === CHAVE_MOVIMENTACOES
        ) {

            pastilhas =
                JSON.parse(
                    localStorage.getItem(CHAVE_PASTILHAS)
                ) || [];


            mostrarPastilhas();

        }

    }
);