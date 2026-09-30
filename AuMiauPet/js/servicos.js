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

const unidadeDuracao =
    document.getElementById(
        "unidade-duracao"
    );


let servicos = [];

let servicoEmEdicao = null;


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
   CARREGAR SERVIÇOS
------------------------------------------------------- */

async function carregarServicos() {

    const { data, error } =
        await supabaseClient
            .from("servicos")
            .select("*")
            .eq("excluido", false)
            .order(
                "nome",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar serviços:",
            error
        );

        mostrarToast(
            "Erro ao carregar serviços."
        );

        return;

    }


    servicos =
        data || [];


    mostrarServicos();

}


/* -------------------------------------------------------
   MOSTRAR SERVIÇOS
------------------------------------------------------- */

function mostrarServicos() {

    corpoServicos.innerHTML =
        "";


    if (
        servicos.length === 0
    ) {

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
                        ${
                            servico.unidade_duracao === "horas"
                                ? `${servico.duracao_minutos / 60} ${
                                    servico.duracao_minutos === 60
                                        ? "hora"
                                        : "horas"
                                }`
                                : `${servico.duracao_minutos} ${
                                    servico.duracao_minutos === 1
                                        ? "minuto"
                                        : "minutos"
                                }`
                        }
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
   ABRIR MODAL
------------------------------------------------------- */

function abrirModal(servico = null) {

    formularioServico.reset();

    servicoEmEdicao = servico;

    if (servico) {

        tituloModal.textContent =
            "Editar serviço";

        botaoSalvar.textContent =
            "Salvar alterações";


        campoNome.value =
            servico.nome || "";

        campoDescricao.value =
            servico.descricao || "";

        campoValor.value =
            servico.valor || "";


        const unidade =
            servico.unidade_duracao || "minutos";

        unidadeDuracao.value =
            unidade;


        if (unidade === "horas") {

            campoDuracao.value =
                servico.duracao_minutos / 60;

        } else {

            campoDuracao.value =
                servico.duracao_minutos;

        }

    } else {

        tituloModal.textContent =
            "Novo serviço";

        botaoSalvar.textContent =
            "Salvar serviço";

        unidadeDuracao.value =
            "minutos";

    }


    modalServico.showModal();

}



/* -------------------------------------------------------
   FECHAR MODAL
------------------------------------------------------- */

function fecharModal() {

    modalServico.close();

    servicoEmEdicao =
        null;

}


/* -------------------------------------------------------
   CADASTRAR SERVIÇO
------------------------------------------------------- */

async function cadastrarServico(
    dados
) {

    const { data, error } =
        await supabaseClient
            .from("servicos")
            .insert(dados)
            .select()
            .single();


    if (error) {

        console.error(
            "Erro ao cadastrar serviço:",
            error
        );

        mostrarToast(
            "Erro ao cadastrar serviço."
        );

        return false;

    }


    servicos.push(
        data
    );


    mostrarToast(
        "Serviço cadastrado."
    );

    return true;

}


/* -------------------------------------------------------
   ATUALIZAR SERVIÇO
------------------------------------------------------- */

async function atualizarServico(
    id,
    dados
) {

    const { data, error } =
        await supabaseClient
            .from("servicos")
            .update(dados)
            .eq(
                "id",
                id
            )
            .select()
            .single();


    if (error) {

        console.error(
            "Erro ao atualizar serviço:",
            error
        );

        mostrarToast(
            "Erro ao atualizar serviço."
        );

        return false;

    }


    servicos =
        servicos.map(
            function (servico) {

                return servico.id === id
                    ? data
                    : servico;

            }
        );


    mostrarToast(
        "Serviço atualizado."
    );

    return true;

}


/* -------------------------------------------------------
   EXCLUIR SERVIÇO
------------------------------------------------------- */

async function excluirServico(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este serviço?"
        );


    if (!confirmar) {

        return;

    }


    const { error } =
        await supabaseClient
            .from("servicos")
            .update({
                excluido: true
            })
            .eq("id",id);

    if (error) {

        console.error(
            "Erro ao excluir serviço:",
            error
        );

        mostrarToast(
            "Erro ao excluir serviço."
        );

        return;

    }


    servicos =
        servicos.filter(
            function (servico) {

                return (
                    servico.id !== id
                );

            }
        );


    mostrarServicos();


    mostrarToast(
        "Serviço excluído."
    );

}


/* -------------------------------------------------------
   SALVAR FORMULÁRIO
------------------------------------------------------- */

formularioServico.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (
            !formularioServico
                .reportValidity()
        ) {

            return;

        }

    const duracaoInformada =
        Number(campoDuracao.value);

    const unidadeSelecionada =
        unidadeDuracao.value;

    const duracaoEmMinutos =
        unidadeSelecionada === "horas"
            ? duracaoInformada * 60
            : duracaoInformada;



        const dados = {
            nome:
                campoNome.value.trim(),

            descricao:
                campoDescricao.value.trim() || null,

            valor:
                Number(campoValor.value),

            duracao_minutos:
                duracaoEmMinutos,

            unidade_duracao:
                unidadeSelecionada
        };


        let sucesso;


        if (
            servicoEmEdicao
        ) {

            sucesso =
                await atualizarServico(
                    servicoEmEdicao.id,
                    dados
                );

        } else {

            sucesso =
                await cadastrarServico(
                    dados
                );

        }


        if (!sucesso) {

            return;

        }


        fecharModal();

        mostrarServicos();

    }
);


/* -------------------------------------------------------
   NOVO SERVIÇO
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
                servicos.find(
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


            excluirServico(
                id
            );

        }

    }
);


/* -------------------------------------------------------
   FECHAR CLICANDO FORA
------------------------------------------------------- */

modalServico.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalServico
        ) {

            fecharModal();

        }

    }
);


/* -------------------------------------------------------
   INICIALIZAÇÃO
------------------------------------------------------- */

carregarServicos();