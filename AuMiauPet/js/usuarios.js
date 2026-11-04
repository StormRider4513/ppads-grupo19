const corpoUsuarios =
    document.getElementById("usuarios-body");

const campoPesquisa =
    document.getElementById("pesquisa-usuario");

const botaoNovoUsuario =
    document.getElementById("novo-usuario");

const modalUsuario =
    document.getElementById("usuario-dialog");

const formularioUsuario =
    document.getElementById("form-usuario");

const tituloModal =
    document.getElementById("titulo-usuario-modal");

const campoNome =
    document.getElementById("nome-usuario");

const campoEmail =
    document.getElementById("email-usuario");

const campoPerfil =
    document.getElementById("perfil-usuario");

const campoAtivo =
    document.getElementById("ativo-usuario");

const botaoCancelar =
    document.getElementById("cancelar-usuario");

const botaoSalvar =
    document.getElementById("salvar-usuario");


let usuarios = [];

let usuarioEmEdicao = null;


/* -------------------------------------------------------
   TOAST
------------------------------------------------------- */

function mostrarToast(mensagem) {

    const toast =
        document.getElementById("usuario-toast");

    toast.textContent =
        mensagem;

    toast.classList.add("on");


    setTimeout(function () {

        toast.classList.remove("on");

    }, 2000);

}


/* -------------------------------------------------------
   PERFIL
------------------------------------------------------- */

function formatarPerfil(perfil) {

    const perfis = {

        ADMINISTRADOR:
            "Administrador",

        GERENTE:
            "Gerente",

        FUNCIONARIO:
            "Funcionário",

        VETERINARIO:
            "Veterinário"

    };


    return perfis[perfil] || perfil;

}


/* -------------------------------------------------------
   CARREGAR USUÁRIOS
------------------------------------------------------- */

async function carregarUsuarios() {

    const { data, error } =
        await supabaseClient
            .from("usuarios")
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
            "Erro ao carregar usuários:",
            error
        );

        mostrarToast(
            "Erro ao carregar usuários."
        );

        return;

    }


    usuarios =
        data || [];


    mostrarUsuarios(
        usuarios
    );

}


/* -------------------------------------------------------
   MOSTRAR USUÁRIOS
------------------------------------------------------- */

function mostrarUsuarios(lista) {

    corpoUsuarios.innerHTML =
        "";


    if (
        lista.length === 0
    ) {

        corpoUsuarios.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="empty"
                >
                    Nenhum usuário cadastrado.
                </td>
            </tr>
        `;

        return;

    }


    lista.forEach(
        function (usuario) {

            const linha =
                document.createElement(
                    "tr"
                );


            const status =
                usuario.ativo
                    ? "Ativo"
                    : "Inativo";


            const classeStatus =
                usuario.ativo
                    ? "ativo"
                    : "inativo";


            linha.innerHTML = `

                <td>
                    ${usuario.nome}
                </td>

                <td>
                    ${usuario.email}
                </td>

                <td>
                    ${formatarPerfil(
                        usuario.perfil
                    )}
                </td>

                <td>

                    <span
                        class="
                            status-usuario
                            ${classeStatus}
                        "
                    >
                        ${status}
                    </span>

                </td>

                <td>

                    <div class="acoes-usuario">

                        <button
                            type="button"
                            class="
                                btn-usuario
                                btn-editar
                            "
                            data-id="${usuario.id}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="
                                btn-usuario
                                btn-status
                            "
                            data-id="${usuario.id}"
                        >
                            ${
                                usuario.ativo
                                    ? "Desativar"
                                    : "Ativar"
                            }
                        </button>


                        <button
                            type="button"
                            class="
                                btn-usuario
                                btn-excluir
                            "
                            data-id="${usuario.id}"
                        >
                            Excluir
                        </button>

                    </div>

                </td>

            `;


            corpoUsuarios.appendChild(
                linha
            );

        }
    );

}


/* -------------------------------------------------------
   PESQUISA
------------------------------------------------------- */

function pesquisarUsuarios() {

    const pesquisa =
        campoPesquisa.value
            .toLowerCase()
            .trim();


    if (!pesquisa) {

        mostrarUsuarios(
            usuarios
        );

        return;

    }


    const resultado =
        usuarios.filter(
            function (usuario) {

                const nome =
                    String(
                        usuario.nome || ""
                    )
                    .toLowerCase();

                const email =
                    String(
                        usuario.email || ""
                    )
                    .toLowerCase();

                const perfil =
                    formatarPerfil(
                        usuario.perfil
                    )
                    .toLowerCase();


                return (
                    nome.includes(pesquisa) ||
                    email.includes(pesquisa) ||
                    perfil.includes(pesquisa)
                );

            }
        );


    mostrarUsuarios(
        resultado
    );

}


/* -------------------------------------------------------
   ABRIR MODAL
------------------------------------------------------- */

function abrirModal(
    usuario = null
) {

    formularioUsuario.reset();

    usuarioEmEdicao =
        usuario;


    if (usuario) {

        tituloModal.textContent =
            "Editar usuário";

        botaoSalvar.innerHTML = `
            <i class="pi pi-check"></i>
            Salvar alterações
        `;


        campoNome.value =
            usuario.nome || "";

        campoEmail.value =
            usuario.email || "";

        campoPerfil.value =
            usuario.perfil || "";

        campoAtivo.value =
            String(
                usuario.ativo
            );

    } else {

        tituloModal.textContent =
            "Novo usuário";

        botaoSalvar.innerHTML = `
            <i class="pi pi-check"></i>
            Salvar usuário
        `;


        campoAtivo.value =
            "true";

    }


    modalUsuario.showModal();

}


/* -------------------------------------------------------
   FECHAR MODAL
------------------------------------------------------- */

function fecharModal() {

    modalUsuario.close();

    formularioUsuario.reset();

    usuarioEmEdicao =
        null;

}


/* -------------------------------------------------------
   VERIFICAR E-MAIL
------------------------------------------------------- */

async function emailJaExiste(
    email,
    ignorarId = null
) {

    let consulta =
        supabaseClient
            .from("usuarios")
            .select("id")
            .eq("email", email)
            .eq("excluido", false);


    if (ignorarId !== null) {

        consulta =
            consulta.neq(
                "id",
                ignorarId
            );

    }


    const { data, error } =
        await consulta
            .limit(1);


    if (error) {

        console.error(
            "Erro ao verificar e-mail:",
            error
        );

        return null;

    }


    return (
        data &&
        data.length > 0
    );

}


/* -------------------------------------------------------
   CADASTRAR
------------------------------------------------------- */

async function cadastrarUsuario(
    dados
) {

    const { data, error } =
        await supabaseClient
            .from("usuarios")
            .insert(dados)
            .select()
            .single();


    if (error) {

        console.error(
            "Erro ao cadastrar usuário:",
            error
        );

        mostrarToast(
            "Erro ao cadastrar usuário."
        );

        return false;

    }


    usuarios.push(
        data
    );


    mostrarToast(
        "Usuário cadastrado com sucesso."
    );

    return true;

}


/* -------------------------------------------------------
   ATUALIZAR
------------------------------------------------------- */

async function atualizarUsuario(
    id,
    dados
) {

    const { data, error } =
        await supabaseClient
            .from("usuarios")
            .update(dados)
            .eq(
                "id",
                id
            )
            .select()
            .single();


    if (error) {

        console.error(
            "Erro ao atualizar usuário:",
            error
        );

        mostrarToast(
            "Erro ao atualizar usuário."
        );

        return false;

    }


    usuarios =
        usuarios.map(
            function (usuario) {

                return (
                    usuario.id === id
                        ? data
                        : usuario
                );

            }
        );


    mostrarToast(
        "Usuário atualizado com sucesso."
    );

    return true;

}


/* -------------------------------------------------------
   SALVAR
------------------------------------------------------- */

formularioUsuario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (
            !formularioUsuario
                .reportValidity()
        ) {

            return;

        }


        const nome =
            campoNome.value
                .trim();

        const email =
            campoEmail.value
                .trim()
                .toLowerCase();

        const perfil =
            campoPerfil.value;

        const ativo =
            campoAtivo.value ===
            "true";


        const existe =
            await emailJaExiste(
                email,
                usuarioEmEdicao
                    ? usuarioEmEdicao.id
                    : null
            );


        if (existe === null) {

            mostrarToast(
                "Não foi possível validar o e-mail."
            );

            return;

        }


        if (existe) {

            mostrarToast(
                "Já existe um usuário com este e-mail."
            );

            return;

        }


        const dados = {

            nome:
                nome,

            email:
                email,

            perfil:
                perfil,

            ativo:
                ativo

        };


        let sucesso;


        if (
            usuarioEmEdicao
        ) {

            sucesso =
                await atualizarUsuario(
                    usuarioEmEdicao.id,
                    dados
                );

        } else {

            sucesso =
                await cadastrarUsuario(
                    {
                        ...dados,
                        excluido: false
                    }
                );

        }


        if (!sucesso) {

            return;

        }


        fecharModal();

        await carregarUsuarios();

    }
);


/* -------------------------------------------------------
   ALTERAR STATUS
------------------------------------------------------- */

async function alterarStatusUsuario(
    usuario
) {

    const novoStatus =
        !usuario.ativo;


    const texto =
        novoStatus
            ? "ativar"
            : "desativar";


    const confirmar =
        confirm(
            `Deseja realmente ${texto} este usuário?`
        );


    if (!confirmar) {

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("usuarios")
            .update({
                ativo:
                    novoStatus
            })
            .eq(
                "id",
                usuario.id
            )
            .select()
            .single();


    if (error) {

        console.error(
            "Erro ao alterar status do usuário:",
            error
        );

        mostrarToast(
            "Erro ao alterar status do usuário."
        );

        return;

    }


    usuarios =
        usuarios.map(
            function (item) {

                return (
                    item.id ===
                    usuario.id
                        ? data
                        : item
                );

            }
        );


    mostrarUsuarios(
        usuarios
    );


    mostrarToast(
        novoStatus
            ? "Usuário ativado."
            : "Usuário desativado."
    );

}


/* -------------------------------------------------------
   EXCLUSÃO LÓGICA
------------------------------------------------------- */

async function excluirUsuario(
    id
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este usuário?"
        );


    if (!confirmar) {

        return;

    }


    const { error } =
        await supabaseClient
            .from("usuarios")
            .update({

                excluido:
                    true,

                ativo:
                    false

            })
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "Erro ao excluir usuário:",
            error
        );

        mostrarToast(
            "Erro ao excluir usuário."
        );

        return;

    }


    usuarios =
        usuarios.filter(
            function (usuario) {

                return (
                    usuario.id !==
                    id
                );

            }
        );


    mostrarUsuarios(
        usuarios
    );


    mostrarToast(
        "Usuário excluído com sucesso."
    );

}


/* -------------------------------------------------------
   EVENTOS DA TABELA
------------------------------------------------------- */

corpoUsuarios.addEventListener(
    "click",
    function (event) {

        const botaoEditar =
            event.target.closest(
                ".btn-editar"
            );


        if (botaoEditar) {

            const id =
                Number(
                    botaoEditar
                        .dataset
                        .id
                );


            const usuario =
                usuarios.find(
                    function (item) {

                        return (
                            item.id === id
                        );

                    }
                );


            if (usuario) {

                abrirModal(
                    usuario
                );

            }


            return;

        }


        const botaoStatus =
            event.target.closest(
                ".btn-status"
            );


        if (botaoStatus) {

            const id =
                Number(
                    botaoStatus
                        .dataset
                        .id
                );


            const usuario =
                usuarios.find(
                    function (item) {

                        return (
                            item.id === id
                        );

                    }
                );


            if (usuario) {

                alterarStatusUsuario(
                    usuario
                );

            }


            return;

        }


        const botaoExcluir =
            event.target.closest(
                ".btn-excluir"
            );


        if (botaoExcluir) {

            const id =
                Number(
                    botaoExcluir
                        .dataset
                        .id
                );


            excluirUsuario(
                id
            );

        }

    }
);


/* -------------------------------------------------------
   NOVO
------------------------------------------------------- */

botaoNovoUsuario.addEventListener(
    "click",
    function () {

        abrirModal();

    }
);


/* -------------------------------------------------------
   CANCELAR
------------------------------------------------------- */

botaoCancelar.addEventListener(
    "click",
    fecharModal
);


/* -------------------------------------------------------
   PESQUISA
------------------------------------------------------- */

campoPesquisa.addEventListener(
    "input",
    pesquisarUsuarios
);


/* -------------------------------------------------------
   FECHAR AO CLICAR FORA
------------------------------------------------------- */

modalUsuario.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalUsuario
        ) {

            fecharModal();

        }

    }
);


/* -------------------------------------------------------
   INICIALIZAÇÃO
------------------------------------------------------- */

carregarUsuarios();