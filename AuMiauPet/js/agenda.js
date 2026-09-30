const agendaBody =
    document.getElementById("agenda-body");

const campoPesquisa =
    document.getElementById("pesquisa");

const botaoPesquisar =
    document.getElementById("btn-pesquisar");

const botaoNovoAgendamento =
    document.getElementById("btn-novo-agendamento");

const filtrosRapidos =
    document.querySelectorAll(".filtro-rapido");

const botaoLimparFiltros =
    document.getElementById("btn-limpar-filtros");

let filtroAtual = "todos";


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
    document.getElementById("horarios-disponiveis");


let horarioSelecionado = null;
let agendamentoEmEdicao = null;

let agendamentos = [];
let clientes = [];
let pets = [];
let servicos = [];


/* ----------------------------------
   TOAST
---------------------------------- */

function mostrarToast(mensagem) {

    const toast =
        document.getElementById("agenda-toast");

    toast.textContent = mensagem;

    toast.classList.add("on");

    setTimeout(function () {

        toast.classList.remove("on");

    }, 2000);

}


/* ----------------------------------
   DATA
---------------------------------- */

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function obterHoraAtual() {

    const agora = new Date();

    const horas =
        String(agora.getHours()).padStart(2, "0");

    const minutos =
        String(agora.getMinutes()).padStart(2, "0");

    return `${horas}:${minutos}`;

}


function definirDataMinima() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes =
        String(hoje.getMonth() + 1)
            .padStart(2, "0");

    const dia =
        String(hoje.getDate())
            .padStart(2, "0");

    inputData.min =
        `${ano}-${mes}-${dia}`;

}


/* ----------------------------------
   CARREGAR DADOS DO SUPABASE
---------------------------------- */

async function carregarClientesBanco() {

    const { data, error } =
        await supabaseClient
            .from("clientes")
            .select("id, nome")
            .eq("excluido", false)
            .order("nome", {
                ascending: true
            });

    if (error) {

        console.error(
            "Erro ao carregar clientes:",
            error
        );

        return false;
    }

    clientes = data || [];

    return true;

}


async function carregarPetsBanco() {

    const { data, error } =
        await supabaseClient
            .from("pets")
            .select("id, cliente_id, nome")
            .eq("excluido", false)
            .order("nome", {
                ascending: true
            });

    if (error) {

        console.error(
            "Erro ao carregar pets:",
            error
        );

        return false;
    }

    pets = data || [];

    return true;

}


async function carregarServicosBanco() {

    const { data, error } =
        await supabaseClient
            .from("servicos")
            .select(
                "id, nome, duracao_minutos"
            )
            .eq("excluido", false)
            .order("nome", {
                ascending: true
            });

    if (error) {

        console.error(
            "Erro ao carregar serviços:",
            error
        );

        return false;
    }

    servicos = data || [];

    return true;

}


async function carregarAgendamentos() {

    const { data, error } =
        await supabaseClient
            .from("agendamentos")
            .select("*")
            .eq("excluido", false)
            .order("data_agendamento", {
                ascending: true
            })
            .order("hora_agendamento", {
                ascending: true
            });

    if (error) {

        console.error(
            "Erro ao carregar agendamentos:",
            error
        );

        mostrarToast(
            "Erro ao carregar agendamentos."
        );

        return;
    }

    agendamentos = data || [];

    mostrarAgendamentos(
        agendamentos
    );

}


/* ----------------------------------
   CLIENTE / PET / SERVIÇO
---------------------------------- */

function obterNomeCliente(clienteId) {

    const cliente =
        clientes.find(function (cliente) {

            return String(cliente.id) ===
                String(clienteId);

        });

    return cliente
        ? cliente.nome
        : "Cliente não encontrado";

}


function obterNomePet(petId) {

    const pet =
        pets.find(function (pet) {

            return String(pet.id) ===
                String(petId);

        });

    return pet
        ? pet.nome
        : "Pet não encontrado";

}


function obterNomeServico(servicoId) {

    const servico =
        servicos.find(function (servico) {

            return String(servico.id) ===
                String(servicoId);

        });

    return servico
        ? servico.nome
        : "Serviço não encontrado";

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
        .slice()
        .sort(function (a, b) {

            const dataA =
                `${a.data_agendamento} ${a.hora_agendamento}`;

            const dataB =
                `${b.data_agendamento} ${b.hora_agendamento}`;

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
                        agendamento.data_agendamento
                    )}
                </td>

                <td>
                    ${String(
                        agendamento.hora_agendamento
                    ).substring(0, 5)}
                </td>

                <td>
                    ${obterNomeCliente(
                        agendamento.cliente_id
                    )}
                </td>

                <td>
                    ${obterNomePet(
                        agendamento.pet_id
                    )}
                </td>

                <td>
                    ${obterNomeServico(
                        agendamento.servico_id
                    )}
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
            document.createElement("option");

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

            return String(
                pet.cliente_id
            ) === String(
                clienteId
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
                servico.id;

            option.textContent =
                servico.nome;

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


    const agora =
        new Date();

    const hoje =
        `${agora.getFullYear()}-` +
        `${String(
            agora.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
            agora.getDate()
        ).padStart(2, "0")}`;

    const horaAtual =
        `${String(
            agora.getHours()
        ).padStart(2, "0")}:` +
        `${String(
            agora.getMinutes()
        ).padStart(2, "0")}`;


    if (data < hoje) {

        horariosContainer.innerHTML = `
            <span class="mensagem-horarios">
                Não é possível agendar em uma data passada.
            </span>
        `;

        return;
    }


    horarios.forEach(
        function (horario) {

            if (
                data === hoje &&
                horario <= horaAtual
            ) {

                return;

            }


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
                            agendamento.data_agendamento ===
                                data &&
                            String(
                                agendamento.hora_agendamento
                            ).substring(0, 5) ===
                                horario
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

    definirDataMinima();

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
            agendamento.cliente_id;


        carregarPets(
            agendamento.cliente_id
        );


        selectPet.value =
            agendamento.pet_id;


        selectServico.value =
            agendamento.servico_id;


        inputData.value =
            agendamento.data_agendamento;


        horarioSelecionado =
            String(
                agendamento.hora_agendamento
            ).substring(0, 5);


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

    agendamentoEmEdicao =
        null;

    horarioSelecionado =
        null;

}


/* ----------------------------------
   CADASTRAR AGENDAMENTO
---------------------------------- */

async function cadastrarAgendamento(
    dados
) {

    const { data, error } =
        await supabaseClient
            .from("agendamentos")
            .insert(dados)
            .select()
            .single();


    if (error) {

        console.error(
            "Erro ao cadastrar agendamento:",
            error
        );

        mostrarToast(
            "Erro ao realizar agendamento."
        );

        return false;

    }


    agendamentos.push(
        data
    );


    mostrarToast(
        "Agendamento realizado com sucesso."
    );

    return true;

}


/* ----------------------------------
   ATUALIZAR AGENDAMENTO
---------------------------------- */

async function atualizarAgendamento(
    id,
    dados
) {

    const { data, error } =
        await supabaseClient
            .from("agendamentos")
            .update(dados)
            .eq("id", id)
            .select()
            .single();


    if (error) {

        console.error(
            "Erro ao atualizar agendamento:",
            error
        );

        mostrarToast(
            "Erro ao atualizar agendamento."
        );

        return false;

    }


    agendamentos =
        agendamentos.map(
            function (agendamento) {

                return agendamento.id === id
                    ? data
                    : agendamento;

            }
        );


    mostrarToast(
        "Agendamento atualizado com sucesso."
    );

    return true;

}


/* ----------------------------------
   SALVAR
---------------------------------- */

async function salvarAgendamento() {

    const clienteId =
        Number(
            selectCliente.value
        );

    const petId =
        Number(
            selectPet.value
        );

    const servicoId =
        Number(
            selectServico.value
        );

    const data =
        inputData.value;


    const agora =
        new Date();

    const dataHoje =
        `${agora.getFullYear()}-` +
        `${String(
            agora.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
            agora.getDate()
        ).padStart(2, "0")}`;

    const horaAtual =
        obterHoraAtual();


    if (data < dataHoje) {

        alert(
            "Não é possível realizar agendamentos em datas passadas."
        );

        return;

    }


    if (
        data === dataHoje &&
        horarioSelecionado &&
        horarioSelecionado <= horaAtual
    ) {

        alert(
            "Não é possível realizar agendamento em um horário que já passou."
        );

        horarioSelecionado = null;

        carregarHorarios();

        return;

    }


    if (
        !clienteId ||
        !petId ||
        !servicoId ||
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


    const dados = {

        cliente_id:
            clienteId,

        pet_id:
            petId,

        servico_id:
            servicoId,

        data_agendamento:
            data,

        hora_agendamento:
            horarioSelecionado,

        status:
            "AGENDADO",

        excluido:
            false

    };


    let sucesso;


    if (agendamentoEmEdicao) {

        sucesso =
            await atualizarAgendamento(
                agendamentoEmEdicao.id,
                dados
            );

    } else {

        sucesso =
            await cadastrarAgendamento(
                dados
            );

    }


    if (!sucesso) {

        return;

    }


    fecharModal();

    mostrarAgendamentos(
        agendamentos
    );

}


/* ----------------------------------
   CANCELAR / EXCLUSÃO LÓGICA
---------------------------------- */

async function cancelarAgendamento(id) {

    const confirmar =
        confirm(
            "Deseja realmente cancelar este agendamento?"
        );


    if (!confirmar) {

        return;

    }


    const { error } =
        await supabaseClient
            .from("agendamentos")
            .update({

                excluido: true,

                status: "CANCELADO"

            })
            .eq(
                "id",
                Number(id)
            );


    if (error) {

        console.error(
            "Erro ao cancelar agendamento:",
            error
        );

        mostrarToast(
            "Erro ao cancelar agendamento."
        );

        return;

    }


    agendamentos =
        agendamentos.filter(
            function (agendamento) {

                return agendamento.id !==
                    Number(id);

            }
        );


    mostrarAgendamentos(
        agendamentos
    );


    mostrarToast(
        "Agendamento cancelado."
    );

}


/* ----------------------------------
   FILTROS
---------------------------------- */

function aplicarFiltros() {

    const texto =
        campoPesquisa.value
            .toLowerCase()
            .trim();


    let lista =
        [...agendamentos];


    if (
        filtroAtual !== "todos" &&
        filtroAtual !== "hoje"
    ) {

        lista =
            lista.filter(
                function (agendamento) {

                    const nomeServico =
                        obterNomeServico(
                            agendamento.servico_id
                        )
                        .toLowerCase();

                    return (
                        nomeServico ===
                        filtroAtual.toLowerCase()
                    );

                }
            );

    }


    if (
        filtroAtual === "hoje"
    ) {

        const hoje =
            new Date();

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

        const dataHoje =
            `${ano}-${mes}-${dia}`;


        lista =
            lista.filter(
                function (agendamento) {

                    return (
                        agendamento.data_agendamento ===
                        dataHoje
                    );

                }
            );

    }


    if (texto) {

        lista =
            lista.filter(
                function (agendamento) {

                    const cliente =
                        obterNomeCliente(
                            agendamento.cliente_id
                        ).toLowerCase();

                    const pet =
                        obterNomePet(
                            agendamento.pet_id
                        ).toLowerCase();

                    const servico =
                        obterNomeServico(
                            agendamento.servico_id
                        ).toLowerCase();

                    const horario =
                        String(
                            agendamento.hora_agendamento
                        ).substring(0, 5);


                    return (
                        cliente.includes(texto) ||
                        pet.includes(texto) ||
                        servico.includes(texto) ||
                        agendamento.data_agendamento.includes(texto) ||
                        horario.includes(texto)
                    );

                }
            );

    }


    mostrarAgendamentos(
        lista
    );

}


function marcarFiltroAtivo(
    filtro
) {

    filtrosRapidos.forEach(
        function (botao) {

            botao.classList.remove(
                "ativo"
            );

            if (
                botao.dataset.filtro ===
                filtro
            ) {

                botao.classList.add(
                    "ativo"
                );

            }

        }
    );

}


function pesquisarAgendamentos() {

    aplicarFiltros();

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

        horarioSelecionado =
            null;

        carregarHorarios();

    }
);


formularioAgendamento.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        await salvarAgendamento();

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

            event.preventDefault();

            pesquisarAgendamentos();

        }

    }
);


campoPesquisa.addEventListener(
    "input",
    function () {

        aplicarFiltros();

    }
);


filtrosRapidos.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                filtroAtual =
                    this.dataset.filtro;

                marcarFiltroAtivo(
                    filtroAtual
                );

                aplicarFiltros();

            }
        );

    }
);


botaoLimparFiltros.addEventListener(
    "click",
    function () {

        filtroAtual =
            "todos";

        campoPesquisa.value =
            "";

        marcarFiltroAtivo(
            "todos"
        );

        mostrarAgendamentos(
            agendamentos
        );

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
                agendamentos.find(
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

async function inicializarAgenda() {

    definirDataMinima();

    await carregarClientesBanco();

    await carregarPetsBanco();

    await carregarServicosBanco();

    await carregarAgendamentos();

}


inicializarAgenda();