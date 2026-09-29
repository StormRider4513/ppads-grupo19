const formularioLogin = document.getElementById("loginForm");
const campoUsuario = document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagem-login");

const USUARIO_FIXO = "user";
const SENHA_FIXA = "password";

formularioLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value.trim();

    if (usuario === USUARIO_FIXO && senha === SENHA_FIXA) {
        sessionStorage.setItem("usuarioAutenticado", "true");
        window.location.href = "pages/dashboard.html";
        return;
    }

    mensagemLogin.textContent = "Usuário ou senha inválidos.";
});

campoUsuario.addEventListener("input", function () {
    mensagemLogin.textContent = "";
});

campoSenha.addEventListener("input", function () {
    mensagemLogin.textContent = "";
});