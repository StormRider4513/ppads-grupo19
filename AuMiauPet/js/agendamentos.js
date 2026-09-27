// Campos do formulário
const selectCliente = document.getElementById("cliente");
const selectPet = document.getElementById("pet");
const selectServico = document.getElementById("servico");
const inputData = document.getElementById("data");

// Área onde os horários disponíveis serão criados
const horariosContainer =
    document.getElementById("horarios-disponiveis");

// Guarda o horário escolhido pelo usuário
let horarioSelecionado = null;

// Formulário e botão de cancelar
const formulario = document.querySelector(".agendamento-form");
const botaoCancelar = document.querySelector(".btn-cancelar");


// Pega o ID que pode estar na URL.
//
// Exemplo:
// agendamentos.html?id=5
//
// Se não existir ID, significa que estamos criando
// um novo agendamento.
const parametros = new URLSearchParams(
    window.location.search
);

const idAgendamentoEdicao =
    parametros.get("id");


// Elementos que mudam quando estamos editando
const tituloAgendamento =
    document.getElementById("titulo-agendamento");

const botaoConfirmar =
    document.getElementById("btn-confirmar-agendamento");


// Preenche a lista de clientes
function carregarClientes() {

    clientes.forEach(cliente => {

        const option = document.createElement("option");

        option.value = cliente.id;
        option.textContent = cliente.nome;

        selectCliente.appendChild(option);
    });
}


// Carrega somente os pets pertencentes ao cliente escolhido
function carregarPets(clienteId) {

    // Limpa a lista atual de pets
    selectPet.innerHTML = `
        <option value="" disabled selected>
            Selecionar pet
        </option>
    `;

    // Filtra os pets pelo ID do cliente
    const petsDoCliente = pets.filter(
        pet => pet.clienteId === Number(clienteId)
    );

    // Adiciona os pets encontrados ao select
    petsDoCliente.forEach(pet => {

        const option = document.createElement("option");

        option.value = pet.id;
        option.textContent = pet.nome;

        selectPet.appendChild(option);
    });
}


// Preenche a lista de serviços
function carregarServicos() {

    servicos.forEach(servico => {

        const option = document.createElement("option");

        option.value = servico;
        option.textContent = servico;

        selectServico.appendChild(option);
    });
}


// Quando o cliente muda, os pets também são atualizados
selectCliente.addEventListener("change", function () {

    const clienteId = this.value;

    carregarPets(clienteId);
});


// Verifica se um horário está disponível
function horarioEstaDisponivel(data, horario) {

    const agendamentos = JSON.parse(
        localStorage.getItem("agendamentos")
    ) || [];

    return !agendamentos.some(agendamento => {

        // Durante a edição, o próprio agendamento não deve
        // bloquear o horário que ele já possui
        if (
            idAgendamentoEdicao &&
            agendamento.id === Number(idAgendamentoEdicao)
        ) {
            return false;
        }

        // Verifica se já existe outro agendamento
        // na mesma data e horário
        return (
            agendamento.data === data &&
            agendamento.horario === horario
        );
    });
}


// Salva um novo agendamento ou altera um existente
function salvarAgendamento() {

    const clienteId = Number(selectCliente.value);
    const petId = Number(selectPet.value);
    const servico = selectServico.value;
    const data = inputData.value;


    // Valida o cliente
    if (!clienteId) {
        alert("Selecione um cliente.");
        return;
    }


    // Valida o pet
    if (!petId) {
        alert("Selecione um pet.");
        return;
    }


    // Valida o serviço
    if (!servico) {
        alert("Selecione um serviço.");
        return;
    }


    // Valida a data
    if (!data) {
        alert("Informe a data.");
        return;
    }


    // Valida o horário
    if (!horarioSelecionado) {
        alert("Selecione um horário.");
        return;
    }


    // Verifica se o horário ainda está disponível
    if (!horarioEstaDisponivel(data, horarioSelecionado)) {

        alert(
            "Esse horário já está ocupado. " +
            "Selecione outro horário."
        );

        return;
    }


    // Recupera os agendamentos já salvos
    const agendamentos = JSON.parse(
        localStorage.getItem("agendamentos")
    ) || [];


    // Verifica se estamos editando um agendamento
    if (idAgendamentoEdicao) {

        // Procura a posição do agendamento na lista
        const indice = agendamentos.findIndex(
            agendamento =>
                agendamento.id === Number(idAgendamentoEdicao)
        );


        // Caso o agendamento não seja encontrado
        if (indice === -1) {
            alert("Agendamento não encontrado.");
            return;
        }


        // Atualiza os dados do agendamento
        agendamentos[indice] = {
            id: Number(idAgendamentoEdicao),
            clienteId: clienteId,
            petId: petId,
            servico: servico,
            data: data,
            horario: horarioSelecionado
        };


        // Salva a lista atualizada
        localStorage.setItem(
            "agendamentos",
            JSON.stringify(agendamentos)
        );


        alert("Agendamento alterado com sucesso.");


        // Volta para a agenda
        window.location.href = "agenda.html";

    } else {

        // Cria um novo agendamento
        const novoAgendamento = {
            id: Date.now(),
            clienteId: clienteId,
            petId: petId,
            servico: servico,
            data: data,
            horario: horarioSelecionado
        };


        // Adiciona o novo agendamento à lista
        agendamentos.push(novoAgendamento);


        // Salva no localStorage
        localStorage.setItem(
            "agendamentos",
            JSON.stringify(agendamentos)
        );


        alert("Agendamento realizado com sucesso.");


        // Limpa o formulário
        formulario.reset();


        // Limpa a lista de pets
        selectPet.innerHTML = `
            <option value="" disabled selected>
                Selecionar pet
            </option>
        `;


        // Volta a mensagem inicial dos horários
        horariosContainer.innerHTML = `
            <span class="mensagem-horarios">
                Escolha uma data
            </span>
        `;


        // Limpa o horário selecionado
        horarioSelecionado = null;
    }
}


// Cria os botões de horários disponíveis
function carregarHorarios() {

    // Limpa os horários anteriores
    horariosContainer.innerHTML = "";

    const data = inputData.value;


    // Se nenhuma data foi escolhida
    if (!data) {

        horariosContainer.innerHTML = `
            <span class="mensagem-horarios">
                Selecione uma data
            </span>
        `;

        return;
    }


    // Horários de funcionamento disponíveis
    const horarios = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00"
    ];


    // Recupera os agendamentos já existentes
    const agendamentos = JSON.parse(
        localStorage.getItem("agendamentos")
    ) || [];


    // Verifica cada horário
    horarios.forEach(horario => {

        // Procura se existe um agendamento nesse horário
        const agendamentoExistente = agendamentos.find(
            agendamento =>
                agendamento.data === data &&
                agendamento.horario === horario
        );


        // Se o horário estiver ocupado por outro agendamento,
        // ele não será mostrado
        if (
            agendamentoExistente &&
            (
                !idAgendamentoEdicao ||
                agendamentoExistente.id !== Number(idAgendamentoEdicao)
            )
        ) {
            return;
        }


        // Cria o botão do horário
        const botao = document.createElement("button");

        botao.type = "button";
        botao.classList.add("btn-horario");
        botao.textContent = horario;


        // Durante a edição, mantém selecionado
        // o horário que o agendamento já possuía
        if (
            idAgendamentoEdicao &&
            horario === horarioSelecionado
        ) {
            botao.classList.add("selected");
        }


        // Quando o usuário escolhe um horário
        botao.addEventListener("click", function () {

            // Remove a seleção dos outros horários
            document
                .querySelectorAll(".btn-horario")
                .forEach(botao => {
                    botao.classList.remove("selected");
                });


            // Marca o horário escolhido
            this.classList.add("selected");

            horarioSelecionado = this.textContent;
        });


        horariosContainer.appendChild(botao);
    });


    // Caso todos os horários estejam ocupados
    if (horariosContainer.children.length === 0) {

        horariosContainer.innerHTML = `
            <span class="mensagem-horarios">
                Não há horários disponíveis para esta data.
            </span>
        `;
    }
}


// Carrega os dados de um agendamento quando estamos editando
function carregarAgendamentoParaEdicao() {

    // Se não existe ID, é um novo agendamento
    if (!idAgendamentoEdicao) {
        return;
    }


    // Altera o título da página
    tituloAgendamento.textContent =
        "Editar agendamento";


    // Altera o texto do botão
    botaoConfirmar.textContent =
        "Salvar alterações";


    // Busca os agendamentos salvos
    const agendamentos = JSON.parse(
        localStorage.getItem("agendamentos")
    ) || [];


    // Procura o agendamento que será editado
    const agendamento = agendamentos.find(
        agendamento =>
            agendamento.id === Number(idAgendamentoEdicao)
    );


    // Caso o agendamento não exista
    if (!agendamento) {

        alert("Agendamento não encontrado.");

        window.location.href = "agenda.html";

        return;
    }


    // Preenche os campos com os dados atuais
    selectCliente.value = agendamento.clienteId;

    carregarPets(agendamento.clienteId);

    selectPet.value = agendamento.petId;

    selectServico.value = agendamento.servico;

    inputData.value = agendamento.data;

    horarioSelecionado = agendamento.horario;


    // Mostra os horários disponíveis
    carregarHorarios();
}


// Quando o formulário for enviado
formulario.addEventListener("submit", function (event) {

    // Impede o envio padrão do formulário
    event.preventDefault();

    salvarAgendamento();
});


// Botão cancelar do formulário
botaoCancelar.addEventListener("click", function () {

    // Limpa os campos
    formulario.reset();


    // Limpa os pets
    selectPet.innerHTML = `
        <option value="" disabled selected>
            Selecionar pet
        </option>
    `;


    // Limpa os horários
    horariosContainer.innerHTML = `
        <span class="mensagem-horarios">
            Escolha uma data
        </span>
    `;


    // Remove o horário selecionado
    horarioSelecionado = null;
});


// Quando a data mudar, atualiza os horários disponíveis
inputData.addEventListener(
    "change",
    carregarHorarios
);


// Carrega os dados necessários ao abrir a página
carregarClientes();
carregarServicos();
carregarAgendamentoParaEdicao();