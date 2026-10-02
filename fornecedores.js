document.addEventListener("DOMContentLoaded", function () {

    // API

    const API_URL =
        "https://6abafbac5b549d818d62c1c5.mockapi.io/dda-metalurgica/fornecedores";

    window.fornecedorEditandoId = null;


    async function buscarFornecedores() {
        try {
            const resposta = await fetch(API_URL);

            if (!resposta.ok) {
                console.error(
                    "Erro ao buscar fornecedores:",
                    resposta.status
                );
                return;
            }

            const fornecedores = await resposta.json();

            atualizarLista(fornecedores);

        } catch (erro) {
            console.error("Erro na requisição GET:", erro);
        }
    }


    async function buscarFornecedorPorId(id) {
        try {
            const resposta =
                await fetch(`${API_URL}/${id}`);

            if (!resposta.ok) {
                console.error(
                    "Fornecedor não encontrado:",
                    resposta.status
                );
                return null;
            }

            return await resposta.json();

        } catch (erro) {
            console.error(
                "Erro ao buscar fornecedor por ID:",
                erro
            );
            return null;
        }
    }


    async function cadastrarFornecedor(fornecedor) {
        try {
            const resposta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fornecedor)
            });

            if (!resposta.ok) {
                console.error(
                    "Erro ao cadastrar fornecedor:",
                    resposta.status
                );
                return false;
            }

            const novoFornecedor = await resposta.json();

            console.log(
                "Fornecedor cadastrado:",
                novoFornecedor
            );

            await buscarFornecedores();

            return true;

        } catch (erro) {
            console.error(
                "Erro na requisição POST:",
                erro
            );
            return false;
        }
    }


    async function atualizarFornecedor(id, fornecedor) {
        try {
            const resposta =
                await fetch(`${API_URL}/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(fornecedor)
                });

            if (!resposta.ok) {
                console.error(
                    "Erro ao atualizar fornecedor:",
                    resposta.status
                );
                return false;
            }

            const fornecedorAtualizado =
                await resposta.json();

            console.log(
                "Fornecedor atualizado:",
                fornecedorAtualizado
            );

            await buscarFornecedores();

            return true;

        } catch (erro) {
            console.error(
                "Erro na requisição PUT:",
                erro
            );
            return false;
        }
    }


    async function excluirFornecedor(id) {
        try {
            const resposta =
                await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });

            if (!resposta.ok) {
                console.error(
                    "Erro ao excluir fornecedor:",
                    resposta.status
                );
                return;
            }

            console.log(
                "Fornecedor excluído:",
                id
            );

            await buscarFornecedores();

        } catch (erro) {
            console.error(
                "Erro na requisição DELETE:",
                erro
            );
        }
    }


    // Elementos

    const lista =
        document.getElementById("listaFornecedores");

    const contador =
        document.getElementById("contador");

    const botaoSalvar =
        document.getElementById("btnSalvarFornecedor");

    const tituloFormulario =
        document.getElementById("tituloFormulario");


    if (!lista || !contador) {
        console.error(
            "Erro: elementos principais não encontrados."
        );
        return;
    }


    // Lista

    function gerarEstrelas(avaliacao) {
        if (!avaliacao || avaliacao === "-") {
            return "-";
        }

        return "★".repeat(Number(avaliacao));
    }


    function atualizarLista(fornecedores) {
        lista.innerHTML = "";

        if (fornecedores.length === 0) {
            contador.textContent = "0 fornecedores";
            return;
        }

        fornecedores.forEach(function (fornecedor) {

            const item =
                document.createElement("div");

            item.classList.add("fornecedor-item");

            item.innerHTML = `
                <div class="fornecedor-dado fornecedor-nome">
                    ${fornecedor.nome}
                </div>

                <div class="fornecedor-dado fornecedor-cnpj">
                    ${fornecedor.cnpj}
                </div>

                <div class="fornecedor-dado fornecedor-telefone">
                    ${fornecedor.telefone}
                </div>

                <div class="fornecedor-dado fornecedor-cidade">
                    ${fornecedor.cidade}
                </div>

                <div class="fornecedor-dado fornecedor-avaliacao">
                    ${gerarEstrelas(fornecedor.avaliacao)}
                </div>

                <div class="fornecedor-dado fornecedor-status">
                    <span class="status ${fornecedor.statusClass || "status-ok"}">
                        ${fornecedor.status || "Ativo"}
                    </span>
                </div>

                <div class="fornecedor-acoes">
                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarFornecedor('${fornecedor.id}')">
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirFornecedor('${fornecedor.id}')">
                        Excluir
                    </button>
                </div>
            `;

            lista.appendChild(item);
        });

        contador.textContent =
            fornecedores.length === 1
                ? "1 fornecedor"
                : fornecedores.length + " fornecedores";
    }


    async function editarFornecedor(id) {
        const fornecedor =
            await buscarFornecedorPorId(id);

        if (!fornecedor) {
            alert("Fornecedor não encontrado.");
            return;
        }

        document.getElementById("nome").value =
            fornecedor.nome || "";

        document.getElementById("cnpj").value =
            fornecedor.cnpj || "";

        document.getElementById("telefone").value =
            fornecedor.telefone || "";

        document.getElementById("email").value =
            fornecedor.email || "";

        document.getElementById("cidade").value =
            fornecedor.cidade || "";

        document.getElementById("avaliacao").value =
            fornecedor.avaliacao || "";

        window.fornecedorEditandoId = id;

        tituloFormulario.textContent =
            "Editar Fornecedor";

        botaoSalvar.textContent =
            "Atualizar Fornecedor";

        document.getElementById("nome").focus();
    }


    window.buscarFornecedorPorId =
        buscarFornecedorPorId;

    window.cadastrarFornecedor =
        cadastrarFornecedor;

    window.atualizarFornecedor =
        atualizarFornecedor;

    window.editarFornecedor =
        editarFornecedor;

    window.excluirFornecedor =
        excluirFornecedor;

    window.gerarEstrelas =
        gerarEstrelas;


    buscarFornecedores();

});