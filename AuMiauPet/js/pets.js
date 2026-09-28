const corpoTabela = document.getElementById("pets-body");

const formularioPesquisa =
    document.getElementById("pesquisa-pets");

const campoPesquisa =
    document.getElementById("pesquisa-pet");

const mensagemPesquisa =
    document.getElementById("mensagem-pesquisa");


const dialogPet =
    document.getElementById("pet-dialog");

const formularioPet =
    document.getElementById("form-pet");

const botaoNovoPet =
    document.getElementById("novo-pet");

const botaoCancelarPet =
    document.getElementById("cancelar-pet");

const botaoSalvarPet =
    document.getElementById("btn-salvar-pet");

const tituloModal =
    document.getElementById("titulo-pet-modal");

const mensagemPet =
    document.getElementById("mensagem-pet");


const selecaoCliente =
    document.getElementById("cliente-pet");

const campoNome =
    document.getElementById("nome-pet");

const campoEspecie =
    document.getElementById("especie-pet");

const campoRaca =
    document.getElementById("raca-pet");

const campoNascimento =
    document.getElementById("nascimento-pet");


let petEmEdicao = null;


/* --------------------------------
   MOSTRAR MENSAGEM
-------------------------------- */

function mostrarToast(mensagem) {

    const toast =
        document.getElementById("pet-toast");

    toast.textContent = mensagem;

    toast.classList.add("on");

    setTimeout(function () {

        toast.classList.remove("on");

    }, 2000);

}


/* --------------------------------
   CRIAR CÉLULA
-------------------------------- */

function adicionarCelula(linha, texto) {

    const celula =
        document.createElement("td");

    celula.textContent = texto;

    linha.appendChild(celula);

}


/* --------------------------------
   MOSTRAR PETS
-------------------------------- */

function mostrarPets(lista) {

    corpoTabela.replaceChildren();


    if (lista.length === 0) {

        const linha =
            document.createElement("tr");

        const celula =
            document.createElement("td");

        celula.colSpan = 5;

        celula.textContent =
            "Nenhum pet encontrado.";

        linha.appendChild(celula);

        corpoTabela.appendChild(linha);

        return;
    }


    lista.forEach(function (pet) {

        const cliente =
            clientes.find(function (cliente) {

                return cliente.id ===
                    Number(pet.clienteId);

            });


        const linha =
            document.createElement("tr");


        adicionarCelula(
            linha,
            pet.nome
        );

        adicionarCelula(
            linha,
            pet.especie || "Não informado"
        );

        adicionarCelula(
            linha,
            pet.raca || "Não informado"
        );

        adicionarCelula(
            linha,
            cliente
                ? cliente.nome
                : "Responsável não encontrado"
        );


        const celulaAcoes =
            document.createElement("td");


        const botaoEditar =
            document.createElement("button");


        botaoEditar.type = "button";

        botaoEditar.textContent =
            "Editar";

        botaoEditar.classList.add(
            "pets-botao"
        );

        botaoEditar.dataset.id =
            pet.id;


        celulaAcoes.appendChild(
            botaoEditar
        );

        linha.appendChild(
            celulaAcoes
        );


        corpoTabela.appendChild(
            linha
        );

    });

}


/* --------------------------------
   NORMALIZAR PESQUISA
-------------------------------- */

function normalizarTexto(texto) {

    return texto
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


/* --------------------------------
   PREENCHER CLIENTES
-------------------------------- */

function preencherClientes() {

    selecaoCliente.innerHTML = `
        <option
            value=""
            disabled
            selected
        >
            Selecione o cliente
        </option>
    `;


    clientes.forEach(function (cliente) {

        const opcao =
            document.createElement("option");

        opcao.value =
            cliente.id;

        opcao.textContent =
            cliente.nome;

        selecaoCliente.appendChild(
            opcao
        );

    });

}


/* --------------------------------
   ABRIR MODAL
-------------------------------- */

function abrirModal(pet = null) {

    petEmEdicao = pet;

    formularioPet.reset();

    mensagemPet.textContent = "";

    preencherClientes();


    if (pet) {

        tituloModal.textContent =
            "Editar pet";

        botaoSalvarPet.textContent =
            "Salvar alterações";


        selecaoCliente.value =
            pet.clienteId;

        campoNome.value =
            pet.nome || "";

        campoEspecie.value =
            pet.especie || "";

        campoRaca.value =
            pet.raca || "";

        campoNascimento.value =
            pet.dataNascimento || "";

    } else {

        tituloModal.textContent =
            "Cadastrar pet";

        botaoSalvarPet.textContent =
            "Salvar pet";

    }


    dialogPet.showModal();

}


/* --------------------------------
   FECHAR MODAL
-------------------------------- */

function fecharModal() {

    dialogPet.close();

    petEmEdicao = null;

}


/* --------------------------------
   DATA MÁXIMA
-------------------------------- */

const hoje = new Date();

const ano =
    hoje.getFullYear();

const mes =
    String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

const dia =
    String(
        hoje.getDate()
    ).padStart(2, "0");


campoNascimento.max =
    `${ano}-${mes}-${dia}`;


/* --------------------------------
   PESQUISA
-------------------------------- */

formularioPesquisa.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const pesquisa =
            normalizarTexto(
                campoPesquisa.value
            );


        const resultado =
            pets.filter(function (pet) {

                return normalizarTexto(
                    pet.nome
                ).includes(pesquisa);

            });


        mostrarPets(resultado);


        mensagemPesquisa.textContent =
            pesquisa
                ? `${resultado.length} pet(s) encontrado(s).`
                : "";

    }
);


/* --------------------------------
   LIMPAR PESQUISA
-------------------------------- */

campoPesquisa.addEventListener(
    "input",
    function () {

        if (
            campoPesquisa.value.trim()
            === ""
        ) {

            mostrarPets(pets);

            mensagemPesquisa.textContent =
                "";

        }

    }
);


/* --------------------------------
   NOVO PET
-------------------------------- */

botaoNovoPet.addEventListener(
    "click",
    function () {

        abrirModal();

    }
);


/* --------------------------------
   CANCELAR
-------------------------------- */

botaoCancelarPet.addEventListener(
    "click",
    function () {

        fecharModal();

    }
);


/* --------------------------------
   EDITAR PET
-------------------------------- */

corpoTabela.addEventListener(
    "click",
    function (evento) {

        const botao =
            evento.target.closest(
                "button[data-id]"
            );


        if (!botao) {
            return;
        }


        const pet =
            pets.find(function (item) {

                return String(item.id)
                    === botao.dataset.id;

            });


        if (pet) {

            abrirModal(pet);

        }

    }
);


/* --------------------------------
   SALVAR
-------------------------------- */

formularioPet.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        if (
            !formularioPet.reportValidity()
        ) {
            return;
        }


        const dadosPet = {

            clienteId:
                Number(
                    selecaoCliente.value
                ),

            nome:
                campoNome.value.trim(),

            especie:
                campoEspecie.value,

            raca:
                campoRaca.value.trim(),

            dataNascimento:
                campoNascimento.value

        };


        if (petEmEdicao) {

            Object.assign(
                petEmEdicao,
                dadosPet
            );


            mostrarToast(
                "Pet atualizado com sucesso."
            );

        } else {

            pets.push({

                id: Date.now(),

                ...dadosPet

            });


            mostrarToast(
                "Pet cadastrado com sucesso."
            );

        }


        fecharModal();

        mostrarPets(pets);

        campoPesquisa.value = "";

        mensagemPesquisa.textContent = "";

    }
);


/* --------------------------------
   FECHAR CLICANDO FORA
-------------------------------- */

dialogPet.addEventListener(
    "click",
    function (evento) {

        if (
            evento.target === dialogPet
        ) {

            fecharModal();

        }

    }
);


/* --------------------------------
   INICIALIZAÇÃO
-------------------------------- */

mostrarPets(pets);