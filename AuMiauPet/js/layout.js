document.addEventListener("DOMContentLoaded", () => {
    // Carrega a Topbar
    fetch("../components/topbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("topbar-container").innerHTML = data;
        });

    // Carrega a Sidebar e marca a página ativa
    fetch("../components/sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;

            // Destaca automaticamente o link da página atual no menu
            const page = window.location.pathname.split("/").pop();
            const links = document.querySelectorAll(".sidebar a");
            links.forEach(link => {
                if (link.getAttribute("href") === page) {
                    link.parentElement.classList.add("active");
                }
            });
        });
});