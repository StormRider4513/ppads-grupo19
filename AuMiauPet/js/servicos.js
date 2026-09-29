const corpoServicos =
    document.getElementById(
        "servicos-body"
    );

const botaoNovoServico =
    document.getElementById(
        "novo-servico"
    );

const modalServico =
    document.getElementById(
        "servico-dialog"
    );

const formularioServico =
    document.getElementById(
        "form-servico"
    );

const tituloModal =
    document.getElementById(
        "titulo-servico-modal"
    );

const botaoCancelar =
    document.getElementById(
        "cancelar-servico"
    );

const botaoSalvar =
    document.getElementById(
        "salvar-servico"
    );


const campoNome =
    document.getElementById(
        "nome-servico"
    );

const campoDescricao =
    document.getElementById(
        "descricao-servico"
    );

const campoValor =
    document.getElementById(
        "valor-servico"
    );

const campoDuracao =
    document.getElementById(
        "duracao-servico"
    );


let servicoEmEdicao = null;


/* -------------------------------------------------------
   DADOS INICIAIS
------------------------------------------------------- */

function criarServicosIniciais() {

    const existentes =
        localStorage.getItem(
            "servicos"
        );


    if (existentes) {
        return;
    }


    const lista = [

        {
            id: 1,
            nome: "Banho",
            descricao:
                "Banho completo para o pet.",
            valor: 60,
            duracao: 60
        },

        {
            id: 2,
            nome: "Tosa",
            descricao:
                "Serviço de tosa.",
            valor: 80,
            duracao: 90
        },

        {
            id: 3,
            nome:
                "Consulta veterinária",
            descricao:
                "Consulta clínica veterinária.",
            valor: 150,
            duracao: 45
        }

    ];


    localStorage.setItem(
        "servicos",
        JSON.stringify(lista)
    );

}


/* -------------------------------------------------------
   STORAGE
------------------------------------------------------- */

function obterServicos() {

    return JSON.parse(
        localStorage.getItem(
            "servicos"
        )
    ) || [];

}


function salvarServicos(lista) {

    localStorage.setItem(
        "servicos",
        JSON.stringify(lista)
    );

}


/* -------------------------------------------------------
   FORMATAR VALOR
------------------------------------------------------- */

function formatarValor(valor) {

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


/* -------------------------------------------------------
   TABELA
------------------------------------------------------- */

function mostrarServicos() {

    const servicos =
        obterServicos();


    corpoServicos.innerHTML =
        "";


    if (servicos.length === 0) {

        corpoServicos.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum serviço cadastrado.
                </td>
            </tr>
        `;

        return;
    }


    servicos.forEach(
        function (servico) {

            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    ${servico.nome}
                </td>

                <td>
                    ${servico.descricao || "-"}
                </td>

                <td>
                    ${formatarValor(
                        servico.valor
                    )}
                </td>

                <td>
                    ${servico.duracao} min
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-editar"
                        data-id="${servico.id}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        data-id="${servico.id}"
                    >
                        Excluir
                    </button>

                </td>

            `;


            corpoServicos.appendChild(
                linha
            );

        }
    );

}


/* -------------------------------------------------------
   MODAL
------------------------------------------------------- */

function abrirModal(servico = null) {

    formularioServico.reset();

    servicoEmEdicao =
        servico;


    if (servico) {

        tituloModal.textContent =
            "Editar serviço";

        botaoSalvar.textContent =
            "Salvar alterações";


        campoNome.value =
            servico.nome;

        campoDescricao.value =
            servico.descricao;

        campoValor.value =
            servico.valor;

        campoDuracao.value =
            servico.duracao;

    } else {

        tituloModal.textContent =
            "Novo serviço";

        botaoSalvar.textContent =
            "Salvar serviço";

    }


    modalServico.showModal();

}


function fecharModal() {

    modalServico.close();

    servicoEmEdicao =
        null;

}


/* -------------------------------------------------------
   SALVAR
------------------------------------------------------- */

formularioServico.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (
            !formularioServico
                .reportValidity()
        ) {
            return;
        }


        const servicos =
            obterServicos();


        const dados = {

            nome:
                campoNome.value.trim(),

            descricao:
                campoDescricao.value.trim(),

            valor:
                Number(
                    campoValor.value
                ),

            duracao:
                Number(
                    campoDuracao.value
                )

        };


        if (servicoEmEdicao) {

            const indice =
                servicos.findIndex(
                    function (item) {

                        return (
                            item.id ===
                            servicoEmEdicao.id
                        );

                    }
                );


            if (indice !== -1) {

                servicos[indice] = {

                    id:
                        servicoEmEdicao.id,

                    ...dados

                };

            }


            mostrarToast(
                "Serviço atualizado."
            );

        } else {

            servicos.push({

                id: Date.now(),

                ...dados

            });


            mostrarToast(
                "Serviço cadastrado."
            );

        }


        salvarServicos(
            servicos
        );


        fecharModal();

        mostrarServicos();

    }
);


/* -------------------------------------------------------
   NOVO
------------------------------------------------------- */

botaoNovoServico.addEventListener(
    "click",
    function () {

        abrirModal();

    }
);


/* -------------------------------------------------------
   CANCELAR MODAL
------------------------------------------------------- */

botaoCancelar.addEventListener(
    "click",
    fecharModal
);


/* -------------------------------------------------------
   EDITAR / EXCLUIR
------------------------------------------------------- */

corpoServicos.addEventListener(
    "click",
    function (event) {

        const editar =
            event.target.closest(
                ".btn-editar"
            );


        if (editar) {

            const id =
                Number(
                    editar.dataset.id
                );


            const servico =
                obterServicos()
                    .find(
                        function (item) {

                            return (
                                item.id === id
                            );

                        }
                    );


            if (servico) {

                abrirModal(
                    servico
                );

            }


            return;
        }


        const excluir =
            event.target.closest(
                ".btn-excluir"
            );


        if (excluir) {

            const id =
                Number(
                    excluir.dataset.id
                );


            excluirServico(id);

        }

    }
);


/* -------------------------------------------------------
   EXCLUIR
------------------------------------------------------- */

function excluirServico(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este serviço?"
        );


    if (!confirmar) {
        return;
    }


    const servicos =
        obterServicos()
            .filter(
                function (servico) {

                    return (
                        servico.id !== id
                    );

                }
            );


    salvarServicos(
        servicos
    );


    mostrarServicos();


    mostrarToast(
        "Serviço excluído."
    );

}


/* -------------------------------------------------------
   TOAST
------------------------------------------------------- */

function mostrarToast(mensagem) {

    const toast =
        document.getElementById(
            "servico-toast"
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


/* -------------------------------------------------------
   INICIALIZAÇÃO
------------------------------------------------------- */

criarServicosIniciais();

mostrarServicos();