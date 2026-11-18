/* -------------------------------------------------------
   UTILITÁRIOS COMPARTILHADOS
   (toast, confirmação, escape de HTML, normalização)
------------------------------------------------------- */

(function () {

    let temporizadorToast = null;


    /* ---------- ESCAPAR HTML ---------- */

    window.esc = function (valor) {

        const mapa = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return String(valor ?? "").replace(
            /[&<>"']/g,
            function (c) {
                return mapa[c];
            }
        );

    };


    /* ---------- NORMALIZAR TEXTO (busca sem acento) ---------- */

    window.normalizarTexto = function (texto) {

        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    };


    /* ---------- TOAST ---------- */

    function tipoDaMensagem(mensagem) {

        const m = window.normalizarTexto(mensagem);

        if (m.startsWith("erro")) {
            return "erro";
        }

        if (
            m.startsWith("nao e possivel") ||
            m.startsWith("nao foi possivel") ||
            m.startsWith("ja existe") ||
            m.startsWith("preencha") ||
            m.startsWith("selecione")
        ) {
            return "aviso";
        }

        return "sucesso";

    }


    function obterToast() {

        let toast =
            document.querySelector(".toast-global");

        if (!toast) {

            toast = document.createElement("div");

            toast.className = "toast-global";

            document.body.appendChild(toast);

        }

        return toast;

    }


    /*
       tipo é opcional: "sucesso", "erro" ou "aviso".
       Se for omitido, é deduzido pelo início da mensagem.
    */

    window.mostrarToast = function (mensagem, tipo) {

        const tipoFinal =
            tipo || tipoDaMensagem(mensagem);

        const toast = obterToast();

        toast.textContent = mensagem;

        toast.className =
            "toast-global " + tipoFinal;

        toast.setAttribute(
            "role",
            tipoFinal === "erro" ? "alert" : "status"
        );

        void toast.offsetWidth;

        toast.classList.add("on");

        clearTimeout(temporizadorToast);

        temporizadorToast = setTimeout(
            function () {
                toast.classList.remove("on");
            },
            tipoFinal === "sucesso" ? 2500 : 4500
        );

    };


    /* ---------- CONFIRMAÇÃO ---------- */

    window.confirmarAcao = function (opcoes) {

        const o = Object.assign(
            {
                titulo: "Confirmar ação",
                mensagem: "",
                textoConfirmar: "Confirmar",
                textoCancelar: "Cancelar",
                perigo: false
            },
            opcoes
        );

        return new Promise(function (resolve) {

            const dialog =
                document.createElement("dialog");

            dialog.className = "confirm-dialog";

            dialog.innerHTML = `
                <div class="confirm-corpo">
                    <h2>${window.esc(o.titulo)}</h2>
                    <p>${window.esc(o.mensagem)}</p>

                    <div class="confirm-acoes">
                        <button type="button" class="confirm-cancelar">
                            ${window.esc(o.textoCancelar)}
                        </button>

                        <button type="button"
                            class="confirm-ok ${o.perigo ? "perigo" : ""}">
                            ${window.esc(o.textoConfirmar)}
                        </button>
                    </div>
                </div>
            `;

            let resultado = false;

            function fechar(valor) {
                resultado = valor;
                dialog.close();
            }

            dialog
                .querySelector(".confirm-cancelar")
                .addEventListener("click", function () {
                    fechar(false);
                });

            dialog
                .querySelector(".confirm-ok")
                .addEventListener("click", function () {
                    fechar(true);
                });

            // clique no fundo escuro
            dialog.addEventListener("click", function (event) {
                if (event.target === dialog) {
                    fechar(false);
                }
            });

            // fecha por qualquer caminho (inclusive Esc)
            dialog.addEventListener("close", function () {
                dialog.remove();
                resolve(resultado);
            });

            document.body.appendChild(dialog);

            dialog.showModal();

            dialog
                .querySelector(".confirm-cancelar")
                .focus();

        });

    };

})();