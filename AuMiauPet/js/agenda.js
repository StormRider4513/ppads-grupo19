const agendaBody =
    document.getElementById("agenda-body");

const campoPesquisa =
    document.getElementById("pesquisa");

const botaoPesquisar =
    document.getElementById("btn-pesquisar");

const botaoNovoAgendamento =
    document.getElementById("btn-novo-agendamento");


/* MODAL */

const modalAgendamento =
    document.getElementById("modal-agendamento");

const formularioAgendamento =
    document.getElementById("form-agendamento");

const tituloModal =
    document.getElementById("titulo-modal");

const botaoSalvar =
    document.getElementById("btn-salvar-agendamento");

const botaoCancelarModal =
    document.getElementById("btn-cancelar-modal");


/* CAMPOS */

const selectCliente =
    document.getElementById("cliente");

const selectPet =
    document.getElementById("pet");

const selectServico =
    document.getElementById("servico");

const inputData =
    document.getElementById("data");

const horariosContainer =
    document.getElementById(
        "horarios-disponiveis"
    );


let horarioSelecionado = null;

let agendamentoEmEdicao = null;


/* ----------------------------------
   AGENDAMENTOS FICTÍCIOS
---------------------------------- */

function criarAgendamentosIniciais() {

    const existentes =
        localStorage.getItem("agendamentos");

    if (existentes !== null) {
        return;
    }


    const agendamentosIniciais = [

        {
            id: 1,
            clienteId: 1,
            petId: 1,
            servico: "Banho",
            data: "2026-09-29",
            horario: "09:00"
        },

        {
            id: 2,
            clienteId: 2,
            petId: 2,
            servico: "Consulta veterinária",
            data: "2026-09-29",
            horario: "14:00"
        },

        {
            id: 3,
            clienteId: 3,
            petId: 3,
            servico: "Tosa",
            data: "2026-09-30",
            horario: "10:00"
        },

        {
            id: 4,
            clienteId: 1,
            petId: 4,
            servico: "Banho",
            data: "2026-10-01",
            horario: "15:00"
        }

    ];


    localStorage.setItem(
        "agendamentos",
        JSON.stringify(
            agendamentosIniciais
        )
    );

}


/* ----------------------------------
   LOCAL STORAGE
---------------------------------- */

function obterAgendamentos() {

    return JSON.parse(
        localStorage.getItem(
            "agendamentos"
        )
    ) || [];

}


function salvarAgendamentos(lista) {

    localStorage.setItem(
        "agendamentos",
        JSON.stringify(lista)
    );

}


/* ----------------------------------
   CLIENTE E PET
---------------------------------- */

function obterNomeCliente(clienteId) {

    const cliente =
        clientes.find(
            cliente =>
                cliente.id ===
                Number(clienteId)
        );

    return cliente
        ? cliente.nome
        : "Cliente não encontrado";

}


function obterNomePet(petId) {

    const pet =
        pets.find(
            pet =>
                pet.id ===
                Number(petId)
        );

    return pet
        ? pet.nome
        : "Pet não encontrado";

}


/* ----------------------------------
   DATA
---------------------------------- */

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes =
        data.split("-");

    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );

}


/* ----------------------------------
   TABELA
---------------------------------- */

function mostrarAgendamentos(lista) {

    agendaBody.innerHTML = "";


    if (lista.length === 0) {

        agendaBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="agenda-vazia"
                >
                    Nenhum agendamento encontrado.
                </td>
            </tr>
        `;

        return;
    }


    lista
        .sort(function (a, b) {

            const dataA =
                `${a.data} ${a.horario}`;

            const dataB =
                `${b.data} ${b.horario}`;

            return dataA.localeCompare(
                dataB
            );

        })
        .forEach(function (agendamento) {

            const linha =
                document.createElement("tr");


            linha.innerHTML = `

                <td>
                    ${formatarData(
                        agendamento.data
                    )}
                </td>

                <td>
                    ${agendamento.horario}
                </td>

                <td>
                    ${obterNomeCliente(
                        agendamento.clienteId
                    )}
                </td>

                <td>
                    ${obterNomePet(
                        agendamento.petId
                    )}
                </td>

                <td>
                    ${agendamento.servico}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-editar"
                        data-id="${agendamento.id}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-cancelar-agendamento"
                        data-id="${agendamento.id}"
                    >
                        Cancelar
                    </button>

                </td>

            `;


            agendaBody.appendChild(
                linha
            );

        });

}


/* ----------------------------------
   CLIENTES
---------------------------------- */

function carregarClientes() {

    selectCliente.innerHTML = `
        <option
            value=""
            disabled
            selected
        >
            Selecionar cliente
        </option>
    `;


    clientes.forEach(function (cliente) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            cliente.id;

        option.textContent =
            cliente.nome;

        selectCliente.appendChild(
            option
        );

    });

}


/* ----------------------------------
   PETS DO CLIENTE
---------------------------------- */

function carregarPets(clienteId) {

    selectPet.innerHTML = `
        <option
            value=""
            disabled
            selected
        >
            Selecionar pet
        </option>
    `;


    const petsDoCliente =
        pets.filter(function (pet) {

            return (
                pet.clienteId ===
                Number(clienteId)
            );

        });


    petsDoCliente.forEach(
        function (pet) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                pet.id;

            option.textContent =
                pet.nome;

            selectPet.appendChild(
                option
            );

        }
    );

}


/* ----------------------------------
   SERVIÇOS
---------------------------------- */

function carregarServicos() {

    selectServico.innerHTML = `
        <option
            value=""
            disabled
            selected
        >
            Selecionar serviço
        </option>
    `;


    servicos.forEach(
        function (servico) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                servico;

            option.textContent =
                servico;

            selectServico.appendChild(
                option
            );

        }
    );

}


/* ----------------------------------
   HORÁRIOS
---------------------------------- */

function carregarHorarios() {

    horariosContainer.innerHTML = "";

    horarioSelecionado =
        agendamentoEmEdicao
            ? horarioSelecionado
            : null;


    const data =
        inputData.value;


    if (!data) {

        horariosContainer.innerHTML = `
            <span class="mensagem-horarios">
                Escolha uma data
            </span>
        `;

        return;
    }


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


    const agendamentos =
        obterAgendamentos();


    horarios.forEach(
        function (horario) {

            const ocupado =
                agendamentos.some(
                    function (agendamento) {

                        if (
                            agendamentoEmEdicao &&
                            agendamento.id ===
                            agendamentoEmEdicao.id
                        ) {
                            return false;
                        }


                        return (
                            agendamento.data === data &&
                            agendamento.horario === horario
                        );

                    }
                );


            if (ocupado) {
                return;
            }


            const botao =
                document.createElement(
                    "button"
                );

            botao.type =
                "button";

            botao.className =
                "btn-horario";

            botao.textContent =
                horario;


            if (
                horarioSelecionado ===
                horario
            ) {

                botao.classList.add(
                    "selected"
                );

            }


            botao.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".btn-horario"
                        )
                        .forEach(
                            function (botao) {

                                botao.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    this.classList.add(
                        "selected"
                    );


                    horarioSelecionado =
                        horario;

                }
            );


            horariosContainer.appendChild(
                botao
            );

        }
    );


    if (
        horariosContainer
            .children.length === 0
    ) {

        horariosContainer.innerHTML = `
            <span class="mensagem-horarios">
                Não há horários disponíveis.
            </span>
        `;

    }

}


/* ----------------------------------
   ABRIR MODAL
---------------------------------- */

function abrirModal(
    agendamento = null
) {

    formularioAgendamento.reset();

    carregarClientes();

    carregarServicos();


    selectPet.innerHTML = `
        <option
            value=""
            disabled
            selected
        >
            Selecionar pet
        </option>
    `;


    horariosContainer.innerHTML = `
        <span class="mensagem-horarios">
            Escolha uma data
        </span>
    `;


    agendamentoEmEdicao =
        agendamento;

    horarioSelecionado =
        null;


    if (agendamento) {

        tituloModal.textContent =
            "Editar agendamento";

        botaoSalvar.textContent =
            "Salvar alterações";


        selectCliente.value =
            agendamento.clienteId;


        carregarPets(
            agendamento.clienteId
        );


        selectPet.value =
            agendamento.petId;


        selectServico.value =
            agendamento.servico;


        inputData.value =
            agendamento.data;


        horarioSelecionado =
            agendamento.horario;


        carregarHorarios();

    } else {

        tituloModal.textContent =
            "Novo agendamento";

        botaoSalvar.textContent =
            "Confirmar agendamento";

    }


    modalAgendamento.showModal();

}


/* ----------------------------------
   FECHAR MODAL
---------------------------------- */

function fecharModal() {

    modalAgendamento.close();

    formularioAgendamento.reset();

    agendamentoEmEdicao = null;

    horarioSelecionado = null;

}


/* ----------------------------------
   SALVAR
---------------------------------- */

function salvarAgendamento() {

    const clienteId =
        Number(
            selectCliente.value
        );

    const petId =
        Number(
            selectPet.value
        );

    const servico =
        selectServico.value;

    const data =
        inputData.value;


    if (
        !clienteId ||
        !petId ||
        !servico ||
        !data
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;
    }


    if (!horarioSelecionado) {

        alert(
            "Selecione um horário."
        );

        return;
    }


    const agendamentos =
        obterAgendamentos();


    if (agendamentoEmEdicao) {

        const indice =
            agendamentos.findIndex(
                function (agendamento) {

                    return (
                        agendamento.id ===
                        agendamentoEmEdicao.id
                    );

                }
            );


        if (indice !== -1) {

            agendamentos[indice] = {

                id:
                    agendamentoEmEdicao.id,

                clienteId:
                    clienteId,

                petId:
                    petId,

                servico:
                    servico,

                data:
                    data,

                horario:
                    horarioSelecionado

            };

        }


        salvarAgendamentos(
            agendamentos
        );


        mostrarToast(
            "Agendamento atualizado com sucesso."
        );

    } else {

        agendamentos.push({

            id: Date.now(),

            clienteId:
                clienteId,

            petId:
                petId,

            servico:
                servico,

            data:
                data,

            horario:
                horarioSelecionado

        });


        salvarAgendamentos(
            agendamentos
        );


        mostrarToast(
            "Agendamento realizado com sucesso."
        );

    }


    fecharModal();


    mostrarAgendamentos(
        obterAgendamentos()
    );

}


/* ----------------------------------
   CANCELAR AGENDAMENTO
---------------------------------- */

function cancelarAgendamento(id) {

    const confirmar =
        confirm(
            "Deseja realmente cancelar este agendamento?"
        );


    if (!confirmar) {
        return;
    }


    const agendamentos =
        obterAgendamentos();


    const novaLista =
        agendamentos.filter(
            function (agendamento) {

                return (
                    agendamento.id !==
                    Number(id)
                );

            }
        );


    salvarAgendamentos(
        novaLista
    );


    mostrarAgendamentos(
        novaLista
    );


    mostrarToast(
        "Agendamento cancelado."
    );

}


/* ----------------------------------
   PESQUISA
---------------------------------- */

function pesquisarAgendamentos() {

    const texto =
        campoPesquisa.value
            .toLowerCase()
            .trim();


    const agendamentos =
        obterAgendamentos();


    if (!texto) {

        mostrarAgendamentos(
            agendamentos
        );

        return;
    }


    const resultados =
        agendamentos.filter(
            function (agendamento) {

                const cliente =
                    obterNomeCliente(
                        agendamento.clienteId
                    ).toLowerCase();

                const pet =
                    obterNomePet(
                        agendamento.petId
                    ).toLowerCase();

                const servico =
                    agendamento.servico
                        .toLowerCase();


                return (
                    cliente.includes(texto) ||
                    pet.includes(texto) ||
                    servico.includes(texto) ||
                    agendamento.data.includes(texto) ||
                    agendamento.horario.includes(texto)
                );

            }
        );


    mostrarAgendamentos(
        resultados
    );

}


/* ----------------------------------
   TOAST
---------------------------------- */

function mostrarToast(mensagem) {

    const toast =
        document.getElementById(
            "agenda-toast"
        );


    toast.textContent =
        mensagem;


    toast.classList.add(
        "on"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "on"
            );

        },
        2000
    );

}


/* ----------------------------------
   EVENTOS
---------------------------------- */

botaoNovoAgendamento.addEventListener(
    "click",
    function () {

        abrirModal();

    }
);


botaoCancelarModal.addEventListener(
    "click",
    fecharModal
);


selectCliente.addEventListener(
    "change",
    function () {

        carregarPets(
            this.value
        );

    }
);


inputData.addEventListener(
    "change",
    function () {

        horarioSelecionado = null;

        carregarHorarios();

    }
);


formularioAgendamento.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        salvarAgendamento();

    }
);


botaoPesquisar.addEventListener(
    "click",
    pesquisarAgendamentos
);


campoPesquisa.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            pesquisarAgendamentos();

        }

    }
);


campoPesquisa.addEventListener(
    "input",
    function () {

        if (
            campoPesquisa.value
                .trim() === ""
        ) {

            mostrarAgendamentos(
                obterAgendamentos()
            );

        }

    }
);


/* ----------------------------------
   EDITAR / CANCELAR
---------------------------------- */

agendaBody.addEventListener(
    "click",
    function (event) {

        const botaoEditar =
            event.target.closest(
                ".btn-editar"
            );


        if (botaoEditar) {

            const id =
                Number(
                    botaoEditar.dataset.id
                );


            const agendamento =
                obterAgendamentos()
                    .find(
                        function (item) {

                            return (
                                item.id === id
                            );

                        }
                    );


            if (agendamento) {

                abrirModal(
                    agendamento
                );

            }


            return;
        }


        const botaoCancelar =
            event.target.closest(
                ".btn-cancelar-agendamento"
            );


        if (botaoCancelar) {

            cancelarAgendamento(
                botaoCancelar.dataset.id
            );

        }

    }
);


/* ----------------------------------
   FECHAR AO CLICAR FORA
---------------------------------- */

modalAgendamento.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalAgendamento
        ) {

            fecharModal();

        }

    }
);


/* ----------------------------------
   INICIALIZAÇÃO
---------------------------------- */

criarAgendamentosIniciais();

mostrarAgendamentos(
    obterAgendamentos()
);