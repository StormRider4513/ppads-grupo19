// Corpo da tabela onde os agendamentos serão mostrados
const agendaBody = document.getElementById("agenda-body");

// Campo usado para pesquisar agendamentos
const campoPesquisa = document.getElementById("pesquisa");

// Botão de pesquisa
const botaoPesquisar = document.getElementById("btn-pesquisar");

// Botão para criar um novo agendamento
const botaoNovoAgendamento =
    document.getElementById("btn-novo-agendamento");


// Busca os agendamentos que estão salvos no navegador
function obterAgendamentos() {

    return JSON.parse(
        localStorage.getItem("agendamentos")
    ) || [];
}


// Procura o nome do cliente pelo ID
function obterNomeCliente(clienteId) {

    const cliente = clientes.find(
        cliente => cliente.id === Number(clienteId)
    );

    return cliente ? cliente.nome : "Cliente não encontrado";
}


// Procura o nome do pet pelo ID
function obterNomePet(petId) {

    const pet = pets.find(
        pet => pet.id === Number(petId)
    );

    return pet ? pet.nome : "Pet não encontrado";
}


// Mostra os agendamentos na tabela
function mostrarAgendamentos(lista) {

    // Limpa a tabela antes de adicionar os dados
    agendaBody.innerHTML = "";

    // Caso não exista nenhum agendamento
    if (lista.length === 0) {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td colspan="6" class="agenda-vazia">
                Nenhum agendamento encontrado.
            </td>
        `;

        agendaBody.appendChild(linha);

        return;
    }

    // Percorre todos os agendamentos
    lista.forEach(agendamento => {

        const linha = document.createElement("tr");

        // Busca os nomes usando os IDs salvos no agendamento
        const nomeCliente =
            obterNomeCliente(agendamento.clienteId);

        const nomePet =
            obterNomePet(agendamento.petId);

        // Monta a linha da tabela
        linha.innerHTML = `
            <td>${formatarData(agendamento.data)}</td>

            <td>${agendamento.horario}</td>

            <td>${nomeCliente}</td>

            <td>${nomePet}</td>

            <td>${agendamento.servico}</td>

            <td>
                <button
                    type="button"
                    class="btn-editar"
                    data-id="${agendamento.id}">
                    Editar
                </button>

                <button
                    type="button"
                    class="btn-cancelar-agendamento"
                    data-id="${agendamento.id}">
                    Cancelar
                </button>
            </td>
        `;

        agendaBody.appendChild(linha);
    });
}


// Pesquisa os agendamentos de acordo com o texto digitado
function pesquisarAgendamentos() {

    const texto = campoPesquisa.value
        .toLowerCase()
        .trim();

    const agendamentos = obterAgendamentos();

    // Se o campo estiver vazio, mostra todos os agendamentos
    if (texto === "") {

        mostrarAgendamentos(agendamentos);

        return;
    }

    // Filtra os agendamentos que possuem o texto pesquisado
    const resultados = agendamentos.filter(agendamento => {

        const cliente =
            obterNomeCliente(agendamento.clienteId)
                .toLowerCase();

        const pet =
            obterNomePet(agendamento.petId)
                .toLowerCase();

        const servico =
            agendamento.servico.toLowerCase();

        const data =
            agendamento.data.toLowerCase();

        const horario =
            agendamento.horario.toLowerCase();

        return (
            cliente.includes(texto) ||
            pet.includes(texto) ||
            servico.includes(texto) ||
            data.includes(texto) ||
            horario.includes(texto)
        );
    });

    mostrarAgendamentos(resultados);
}


// Executa a pesquisa ao clicar no botão
botaoPesquisar.addEventListener(
    "click",
    pesquisarAgendamentos
);


// Também permite pesquisar apertando Enter
campoPesquisa.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            pesquisarAgendamentos();
        }
    }
);


// Abre a página para criar um novo agendamento
botaoNovoAgendamento.addEventListener(
    "click",
    function () {

        window.location.href = "agendamentos.html";
    }
);


// Converte a data de YYYY-MM-DD para DD/MM/YYYY
function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// Mostra os agendamentos assim que a página é carregada
mostrarAgendamentos(
    obterAgendamentos()
);


// Cancela um agendamento
function cancelarAgendamento(id) {

    const confirmar = confirm(
        "Deseja realmente cancelar este agendamento?"
    );

    // Se o usuário clicar em "Cancelar" na confirmação,
    // nada será alterado
    if (!confirmar) {
        return;
    }

    const agendamentos = obterAgendamentos();

    // Remove o agendamento que possui o ID informado
    const novosAgendamentos = agendamentos.filter(
        agendamento => agendamento.id !== Number(id)
    );

    // Salva novamente a lista atualizada
    localStorage.setItem(
        "agendamentos",
        JSON.stringify(novosAgendamentos)
    );

    alert("Agendamento cancelado com sucesso.");

    // Atualiza a tabela
    mostrarAgendamentos(novosAgendamentos);
}


// Verifica os cliques nos botões da tabela
agendaBody.addEventListener("click", function (event) {

    // Verifica se o botão clicado foi "Cancelar"
    if (
        event.target.classList.contains(
            "btn-cancelar-agendamento"
        )
    ) {

        const id = event.target.dataset.id;

        cancelarAgendamento(id);
    }
});


// Verifica os cliques no botão "Editar"
agendaBody.addEventListener("click", function (event) {

    if (
        event.target.classList.contains("btn-editar")
    ) {

        const id = event.target.dataset.id;

        // Envia o ID do agendamento para a página de edição
        window.location.href =
            `agendamentos.html?id=${id}`;
    }
});