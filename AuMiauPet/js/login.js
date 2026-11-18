const formularioLogin = document.getElementById("loginForm");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagem-login");
const botaoEntrar = formularioLogin.querySelector(".botaoEntrar");

async function verificarSessaoExistente() {
    const { data } = await supabaseClient.auth.getSession();

    if (data?.session && sessionStorage.getItem("usuarioLogado")) {
        window.location.href = "pages/dashboard.html";
    }
}

formularioLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = campoEmail.value.trim().toLowerCase();
    const senha = campoSenha.value;

    mensagemLogin.textContent = "";
    botaoEntrar.disabled = true;
    botaoEntrar.textContent = "Entrando...";

    const { data: authData, error: authError } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha
        });

    if (authError || !authData.user) {
        mensagemLogin.textContent = "E-mail ou senha inválidos.";
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = "Entrar";
        return;
    }

    const { data: usuarioSistema, error: erroUsuario } =
        await supabaseClient
            .from("usuarios")
            .select("id, nome, email, perfil, ativo")
            .ilike("email", email)
            .eq("excluido", false)
            .maybeSingle();

    if (erroUsuario) {
        console.error("Erro ao buscar usuário na tabela:", erroUsuario);
    }

    if (erroUsuario || !usuarioSistema) {
        await supabaseClient.auth.signOut();
        mensagemLogin.textContent = "Usuário não cadastrado no sistema.";
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = "Entrar";
        return;
    }

    if (!usuarioSistema.ativo) {
        await supabaseClient.auth.signOut();
        mensagemLogin.textContent = "Este usuário está inativo. Contate o administrador.";
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = "Entrar";
        return;
    }

    sessionStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioSistema)
    );

    window.location.href = "pages/dashboard.html";
});

campoEmail.addEventListener("input", function () {
    mensagemLogin.textContent = "";
});

campoSenha.addEventListener("input", function () {
    mensagemLogin.textContent = "";
});

verificarSessaoExistente();