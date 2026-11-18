async function validarAcesso() {
    const { data } = await supabaseClient.auth.getSession();
    const dadosSalvos = sessionStorage.getItem("usuarioLogado");

    if (!data?.session || !dadosSalvos) {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "../index.html";
        return null;
    }

    const usuario = JSON.parse(dadosSalvos);
    const paginaAtual = window.location.pathname.split("/").pop();

    if (
        paginaAtual === "usuarios.html" &&
        usuario.perfil !== "ADMINISTRADOR"
    ) {
        window.location.href = "dashboard.html";
        return null;
    }

    return usuario;
}

document.addEventListener("DOMContentLoaded", async () => {
    const usuarioLogado = await validarAcesso();

    if (!usuarioLogado) {
        return;
    }

    // Carrega a Topbar e configura o logout
    fetch("../components/topbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("topbar-container").innerHTML = data;

            const botaoSair = document.querySelector(".btn-sair");

            if (botaoSair) {
                botaoSair.addEventListener("click", async () => {
                    await supabaseClient.auth.signOut();
                    sessionStorage.removeItem("usuarioLogado");
                    window.location.href = "../index.html";
                });
            }
        });

    // Carrega a Sidebar, aplica permissão de perfil e marca a seção ativa
    fetch("../components/sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;

            const paginaAtual = window.location.pathname.split("/").pop();

            const paginaDoMenu = paginaAtual === "cadastro-pet.html"
                ? "pets.html"
                : paginaAtual;

            const links = document.querySelectorAll(".sidebar a");

            links.forEach(link => {
                const destino = link.getAttribute("href");

                if (!destino || destino.startsWith("#")) {
                    return;
                }

                const paginaDoLink = new URL(
                    destino,
                    window.location.href
                ).pathname.split("/").pop();

                // Oculta Usuários para perfis que não são Administrador
                if (
                    paginaDoLink === "usuarios.html" &&
                    usuarioLogado.perfil !== "ADMINISTRADOR"
                ) {
                    link.parentElement.remove();
                    return;
                }

                link.parentElement.classList.toggle(
                    "active",
                    paginaDoLink === paginaDoMenu
                );
            });
        });
});