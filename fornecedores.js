
document.addEventListener("DOMContentLoaded", function () {

    // API

    const API_URL =
        "https://6abafbac5b549d818d62c1c5.mockapi.io/dda-metalurgica/fornecedores";

    window.fornecedorEditandoId = null;

    // Elementos

    const lista = document.getElementById("listaFornecedores");
    const contador = document.getElementById("contador");
    const botaoSalvar = document.getElementById("btnSalvarFornecedor");
    const tituloFormulario = document.getElementById("tituloFormulario");
    const form = document.getElementById("formFornecedor");

    const botaoBuscar = document.getElementById("btnBuscarFornecedor");
    const inputId = document.getElementById("idFornecedor");
    const resultadoFornecedor = document.getElementById("resultadoFornecedor");

    const campoNome = document.getElementById("nome");
    const campoCidade = document.getElementById("cidade");
    const campoCnpj = document.getElementById("cnpj");
    const campoTelefone = document.getElementById("telefone");

    if (!lista || !contador || !form) {
        console.error("Erro: elementos principais não encontrados.");
        return;
    }

    // Proteção dos dados exibidos no HTML

    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, function (caractere) {
            const caracteres = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return caracteres[caractere];
        });
    }

    // Buscar todos os fornecedores

    async function buscarFornecedores() {

        try {
            const resposta = await fetch(API_URL);

            if (!resposta.ok) {
                console.error("Erro ao buscar fornecedores:", resposta.status);
                return;
            }

            const fornecedores = await resposta.json();

            atualizarLista(fornecedores);

        } catch (erro) {
            console.error("Erro na requisição GET:", erro);
        }
    }

    // Buscar fornecedor por ID

    async function buscarFornecedorPorId(id) {

        try {
            const resposta = await fetch(`${API_URL}/${id}`);

            if (!resposta.ok) {
                console.error("Fornecedor não encontrado:", resposta.status);
                return null;
            }

            return await resposta.json();

        } catch (erro) {
            console.error("Erro ao buscar fornecedor por ID:", erro);
            return null;
        }
    }

    // Cadastrar fornecedor

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
                console.error("Erro ao cadastrar fornecedor:", resposta.status);
                return false;
            }

            await resposta.json();

            await buscarFornecedores();

            return true;

        } catch (erro) {
            console.error("Erro na requisição POST:", erro);
            return false;
        }
    }

    // Atualizar fornecedor

    async function atualizarFornecedor(id, fornecedor) {

        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fornecedor)
            });

            if (!resposta.ok) {
                console.error("Erro ao atualizar fornecedor:", resposta.status);
                return false;
            }

            await resposta.json();

            await buscarFornecedores();

            return true;

        } catch (erro) {
            console.error("Erro na requisição PUT:", erro);
            return false;
        }
    }

    // Excluir fornecedor

    async function excluirFornecedor(id) {

        const confirmar = confirm("Deseja realmente excluir este fornecedor?");

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!resposta.ok) {
                console.error("Erro ao excluir fornecedor:", resposta.status);
                alert("Não foi possível excluir o fornecedor.");
                return;
            }

            await buscarFornecedores();

        } catch (erro) {
            console.error("Erro na requisição DELETE:", erro);
        }
    }

    // Gerar estrelas

    function gerarEstrelas(avaliacao) {

        const quantidade = Number(avaliacao);

        if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 5) {
            return "-";
        }

        return "★".repeat(quantidade);
    }

    // Atualizar lista

    function atualizarLista(fornecedores) {

        lista.innerHTML = "";

        if (!Array.isArray(fornecedores) || fornecedores.length === 0) {
            contador.textContent = "0 fornecedores";
            return;
        }

        fornecedores.forEach(function (fornecedor) {

            const item = document.createElement("div");

            item.classList.add("fornecedor-item");

            item.innerHTML = `
                <div class="fornecedor-dado fornecedor-id">
                    ${escaparHTML(fornecedor.id)}
                </div>

                <div class="fornecedor-dado fornecedor-nome">
                    ${escaparHTML(fornecedor.nome)}
                </div>

                <div class="fornecedor-dado fornecedor-cnpj">
                    ${escaparHTML(fornecedor.cnpj)}
                </div>

                <div class="fornecedor-dado fornecedor-telefone">
                    ${escaparHTML(fornecedor.telefone)}
                </div>

                <div class="fornecedor-dado fornecedor-cidade">
                    ${escaparHTML(fornecedor.cidade)}
                </div>

                <div class="fornecedor-dado fornecedor-avaliacao">
                    ${gerarEstrelas(fornecedor.avaliacao)}
                </div>

                <div class="fornecedor-dado fornecedor-status">
                    <span class="status ${fornecedor.statusClass === "status-warning" ? "status-warning" : "status-ok"}">
                        ${escaparHTML(fornecedor.status || "Ativo")}
                    </span>
                </div>

                <div class="fornecedor-acoes">
                    <button type="button" class="btn-editar">
                        Editar
                    </button>

                    <button type="button" class="btn-excluir">
                        Excluir
                    </button>
                </div>
            `;

            const botoes = item.querySelectorAll("button");

            botoes[0].addEventListener("click", function () {
                editarFornecedor(fornecedor.id);
            });

            botoes[1].addEventListener("click", function () {
                excluirFornecedor(fornecedor.id);
            });

            lista.appendChild(item);
        });

        contador.textContent =
            fornecedores.length === 1
                ? "1 fornecedor"
                : fornecedores.length + " fornecedores";
    }

    // Editar fornecedor

    async function editarFornecedor(id) {

        const fornecedor = await buscarFornecedorPorId(id);

        if (!fornecedor) {
            alert("Fornecedor não encontrado.");
            return;
        }

        campoNome.value = fornecedor.nome || "";
        campoCnpj.value = fornecedor.cnpj || "";
        campoTelefone.value = fornecedor.telefone || "";
        document.getElementById("email").value = fornecedor.email || "";
        campoCidade.value = fornecedor.cidade || "";
        document.getElementById("avaliacao").value = fornecedor.avaliacao || "";

        window.fornecedorEditandoId = id;

        tituloFormulario.textContent = "Editar Fornecedor";
        botaoSalvar.textContent = "Atualizar Fornecedor";

        campoNome.focus();
    }

    // Disponibilizar funções para os botões

    window.buscarFornecedorPorId = buscarFornecedorPorId;
    window.cadastrarFornecedor = cadastrarFornecedor;
    window.atualizarFornecedor = atualizarFornecedor;
    window.editarFornecedor = editarFornecedor;
    window.excluirFornecedor = excluirFornecedor;
    window.gerarEstrelas = gerarEstrelas;

    // Formulário

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const nome = campoNome.value.trim();
        const cnpj = campoCnpj.value.trim();
        const telefone = campoTelefone.value.trim();
        const email = document.getElementById("email").value.trim();
        const cidade = campoCidade.value.trim();
        const avaliacao = document.getElementById("avaliacao").value;

        if (
            nome === "" ||
            cnpj === "" ||
            telefone === "" ||
            email === "" ||
            cidade === "" ||
            avaliacao === ""
        ) {
            alert("Preencha todos os campos!");
            return;
        }

        // Validar nome

        if (!/^[A-Za-zÀ-ÿ0-9\s&.,'()/\-]+$/.test(nome)) {
            alert("Digite um nome de fornecedor válido!");
            return;
        }

        // Validar CNPJ

        const cnpjNumeros = cnpj.replace(/\D/g, "");

        if (cnpjNumeros.length !== 14) {
            alert("O CNPJ deve conter 14 números!");
            return;
        }

        // Validar telefone

        const telefoneNumeros = telefone.replace(/\D/g, "");

        if (
            telefoneNumeros.length < 10 ||
            telefoneNumeros.length > 11
        ) {
            alert("O telefone deve conter 10 ou 11 números!");
            return;
        }

        // Validar e-mail

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Digite um e-mail válido!");
            return;
        }

        // Validar cidade

        if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(cidade)) {
            alert("Digite uma cidade válida!");
            return;
        }

        const fornecedor = {
            nome: nome,
            cnpj: cnpjNumeros,
            telefone: telefoneNumeros,
            email: email,
            cidade: cidade,
            avaliacao: avaliacao,
            status: "Ativo",
            statusClass: "status-ok"
        };

        if (window.fornecedorEditandoId !== null) {

            const sucesso = await atualizarFornecedor(
                window.fornecedorEditandoId,
                fornecedor
            );

            if (sucesso) {

                alert("Fornecedor atualizado com sucesso!");

                window.fornecedorEditandoId = null;

                form.reset();

                botaoSalvar.textContent = "Cadastrar Fornecedor";
                tituloFormulario.textContent = "Novo Fornecedor";
            }

        } else {

            const sucesso = await cadastrarFornecedor(fornecedor);

            if (sucesso) {
                alert("Fornecedor cadastrado com sucesso!");
                form.reset();
            }
        }
    });

    // Busca por ID

    botaoBuscar.addEventListener("click", async function () {

        const id = inputId.value.trim();

        if (!/^[1-9]\d*$/.test(id)) {
            alert("Digite um ID numérico válido.");
            return;
        }

        const fornecedor = await buscarFornecedorPorId(id);

        if (!fornecedor) {

            resultadoFornecedor.innerHTML = `
                <div class="resultado-fornecedor">
                    <strong>Fornecedor não encontrado.</strong>
                </div>
            `;

            return;
        }

        resultadoFornecedor.innerHTML = `
            <div class="resultado-fornecedor">
                <strong>ID:</strong> ${escaparHTML(fornecedor.id)}<br>
                <strong>Nome:</strong> ${escaparHTML(fornecedor.nome)}<br>
                <strong>CNPJ:</strong> ${escaparHTML(fornecedor.cnpj)}<br>
                <strong>Telefone:</strong> ${escaparHTML(fornecedor.telefone)}<br>
                <strong>E-mail:</strong> ${escaparHTML(fornecedor.email)}<br>
                <strong>Cidade:</strong> ${escaparHTML(fornecedor.cidade)}<br>
                <strong>Avaliação:</strong>
                ${gerarEstrelas(fornecedor.avaliacao)}<br>
                <strong>Status:</strong>
                ${escaparHTML(fornecedor.status || "Ativo")}
            </div>
        `;
    });

    // Campos do formulário

    campoNome.addEventListener("input", function () {

        this.value = this.value
            .replace(/[^A-Za-zÀ-ÿ0-9\s&.,'()/\-]/g, "")
            .toLocaleLowerCase("pt-BR")
            .replace(/(^|\s)\S/g, function (letra) {
                return letra.toLocaleUpperCase("pt-BR");
            });
    });

    campoCidade.addEventListener("input", function () {

        this.value = this.value
            .replace(/[^A-Za-zÀ-ÿ\s'-]/g, "")
            .toLocaleLowerCase("pt-BR")
            .replace(/(^|\s)\S/g, function (letra) {
                return letra.toLocaleUpperCase("pt-BR");
            });
    });

    campoCnpj.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 14);
    });

    campoTelefone.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 11);
    });

    // Carregar fornecedores ao abrir a página

    buscarFornecedores();

});
