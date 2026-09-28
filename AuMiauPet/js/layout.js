document.addEventListener("DOMContentLoaded", () => {
    // Carrega a Topbar
    fetch("../components/topbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("topbar-container").innerHTML = data;
        });

    // Carrega a Sidebar e marca a seção ativa
    fetch("../components/sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;

            const paginaAtual = window.location.pathname.split("/").pop();

            // O cadastro também pertence à seção Pets.
            const paginaDoMenu = paginaAtual === "cadastro-pet.html"
                ? "pets.html"
                : paginaAtual;

            const links = document.querySelectorAll(".sidebar a");

            links.forEach(link => {
                const destino = link.getAttribute("href");

                // Ignora links que ainda não têm uma página definida.
                if (!destino || destino.startsWith("#")) {
                    return;
                }

                // Obtém o nome do arquivo, independentemente do caminho.
                const paginaDoLink = new URL(
                    destino,
                    window.location.href
                ).pathname.split("/").pop();

                link.parentElement.classList.toggle(
                    "active",
                    paginaDoLink === paginaDoMenu
                );
            });
        });
});