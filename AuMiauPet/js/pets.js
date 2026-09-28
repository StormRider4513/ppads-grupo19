// ---------- PÁGINA DE LISTAGEM ----------

const corpoTabela = document.getElementById("pets-body");
const formularioPesquisa = document.getElementById("pesquisa-pets");

if (corpoTabela && formularioPesquisa) {
    const campoPesquisa = document.getElementById("pesquisa-pet");
    const mensagemPesquisa = document.getElementById("mensagem-pesquisa");

    // Cria uma célula da tabela.
    function adicionarCelula(linha, texto) {
        const celula = document.createElement("td");

        celula.textContent = texto;
        linha.appendChild(celula);
    }

    // Mostra os pets na tabela.
    function mostrarPets(lista) {
        corpoTabela.replaceChildren();

        if (lista.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            celula.colSpan = 5;
            celula.textContent = "Nenhum pet encontrado.";

            linha.appendChild(celula);
            corpoTabela.appendChild(linha);

            return;
        }

        lista.forEach(function (pet) {
            const cliente = clientes.find(function (cliente) {
                return cliente.id === Number(pet.clienteId);
            });

            const linha = document.createElement("tr");

            adicionarCelula(linha, pet.nome);
            adicionarCelula(linha, pet.especie || "Não informado");
            adicionarCelula(linha, pet.raca || "Não informado");

            adicionarCelula(
                linha,
                cliente ? cliente.nome : "Responsável não encontrado"
            );

            // Link para editar o pet desta linha.
            const celulaAcoes = document.createElement("td");
            const linkEditar = document.createElement("a");

            linkEditar.textContent = "Editar";
            linkEditar.classList.add("pets-botao");
            linkEditar.href =
                `cadastro-pet.html?id=${encodeURIComponent(pet.id)}`;

            celulaAcoes.appendChild(linkEditar);
            linha.appendChild(celulaAcoes);

            corpoTabela.appendChild(linha);
        });
    }

    // Permite pesquisar sem diferenciar maiúsculas e acentos.
    function normalizarTexto(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    // Pesquisa ao clicar no botão ou apertar Enter.
    formularioPesquisa.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const pesquisa = normalizarTexto(campoPesquisa.value);

        const resultado = pets.filter(function (pet) {
            return normalizarTexto(pet.nome).includes(pesquisa);
        });

        mostrarPets(resultado);

        mensagemPesquisa.textContent = pesquisa
            ? `${resultado.length} pet(s) encontrado(s).`
            : "";
    });

    // Mostra todos os pets ao limpar a pesquisa.
    campoPesquisa.addEventListener("input", function () {
        if (campoPesquisa.value.trim() === "") {
            mostrarPets(pets);
            mensagemPesquisa.textContent = "";
        }
    });

    mostrarPets(pets);
}


// ---------- PÁGINA DE CADASTRO E EDIÇÃO ----------

const formularioPet = document.getElementById("form-pet");

if (formularioPet) {
    const selecaoCliente = document.getElementById("cliente-pet");
    const campoNome = document.getElementById("nome-pet");
    const campoEspecie = document.getElementById("especie-pet");
    const campoRaca = document.getElementById("raca-pet");
    const campoNascimento = document.getElementById("nascimento-pet");
    const botaoSalvar = document.getElementById("btn-salvar-pet");
    const mensagem = document.getElementById("mensagem-pet");
    const titulo = document.querySelector(".pets-container h2");

    // Verifica se a URL possui o ID de um pet.
    const parametros = new URLSearchParams(window.location.search);
    const idPet = parametros.get("id");
    const modoEdicao = idPet !== null;

    // Preenche a lista de responsáveis.
    clientes.forEach(function (cliente) {
        const opcao = document.createElement("option");

        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;

        selecaoCliente.appendChild(opcao);
    });

    // Impede selecionar uma data de nascimento futura.
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    campoNascimento.max = `${ano}-${mes}-${dia}`;

    // Preenche o formulário quando estamos editando.
    if (modoEdicao) {
        const pet = pets.find(function (pet) {
            return String(pet.id) === idPet;
        });

        if (titulo) {
            titulo.textContent = "Editar pet";
        }

        document.title = "Editar pet - AuMiau Pet";
        botaoSalvar.textContent = "Salvar alterações";

        if (pet) {
            selecaoCliente.value = pet.clienteId;
            campoNome.value = pet.nome;
            campoEspecie.value = pet.especie || "";
            campoRaca.value = pet.raca || "";
            campoNascimento.value = pet.dataNascimento || "";
        } else {
            mensagem.textContent =
                "Pet não encontrado. Clique em Cancelar para voltar à lista.";

            botaoSalvar.disabled = true;
        }
    }

    // Impede o envio do formulário nesta etapa.
    formularioPet.addEventListener("submit", function (evento) {
        evento.preventDefault();
    });

    // Valida os campos, mas ainda não salva.
    botaoSalvar.addEventListener("click", function () {
        if (!formularioPet.reportValidity()) {
            return;
        }

        mensagem.textContent = modoEdicao
            ? "Esta é uma prévia da edição. As alterações ainda não foram salvas."
            : "Esta é uma prévia do cadastro. O pet ainda não foi salvo.";
    });
}