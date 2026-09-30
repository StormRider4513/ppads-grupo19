let clientes = [];
let editId = null;

const $ = (id) => document.getElementById(id);


/* -------------------------------------------------------
   FORMATAÇÕES
------------------------------------------------------- */

const fCpf = (v) => {
  const valor = String(v || "").replace(/\D/g, "");

  return valor.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    "$1.$2.$3-$4"
  );
};


const fTel = (v) => {
  const valor = String(v || "").replace(/\D/g, "");

  return valor.length === 11
    ? valor.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        "($1) $2-$3"
      )
    : valor.replace(
        /^(\d{2})(\d{4})(\d{4})$/,
        "($1) $2-$3"
      );
};


const dig = (v) => String(v || "").replace(/\D/g, "");


/* -------------------------------------------------------
   VALIDAÇÃO DE CPF
------------------------------------------------------- */

function cpfOk(c) {

  if (
    c.length !== 11 ||
    /^(\d)\1+$/.test(c)
  ) {
    return false;
  }

  for (let t = 9; t < 11; t++) {

    let soma = 0;

    for (let i = 0; i < t; i++) {
      soma += c[i] * (t + 1 - i);
    }

    if (
      (((soma * 10) % 11) % 10) != c[t]
    ) {
      return false;
    }

  }

  return true;
}


/* -------------------------------------------------------
   SEGURANÇA HTML
------------------------------------------------------- */

function esc(valor) {

  return String(valor ?? "").replace(
    /[&<>"]/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      })[c]
  );

}


/* -------------------------------------------------------
   TOAST
------------------------------------------------------- */

function toast(mensagem) {

  const t = $("toast");

  t.textContent = mensagem;

  t.classList.add("on");

  setTimeout(() => {
    t.classList.remove("on");
  }, 2200);

}


/* -------------------------------------------------------
   CARREGAR CLIENTES DO SUPABASE
------------------------------------------------------- */

async function carregarClientes() {

  const { data, error } = await supabaseClient
    .from("clientes")
    .select("*")
    .order("nome", {
      ascending: true,
    });


  if (error) {

    console.error(
      "Erro ao carregar clientes:",
      error
    );

    toast("Erro ao carregar clientes");

    return;

  }


  clientes = data || [];

  render();

}


/* -------------------------------------------------------
   RENDERIZAR TABELA
------------------------------------------------------- */

function render() {

  const q = $("q")
    .value
    .trim()
    .toLowerCase();

  const qd = dig(q);


  const resultado = clientes.filter((c) => {

    const nome =
      String(c.nome || "").toLowerCase();

    const cpf =
      dig(c.cpf);

    const telefone =
      dig(c.telefone);

    return (
      !q ||
      nome.includes(q) ||
      (
        qd &&
        (
          cpf.includes(qd) ||
          telefone.includes(qd)
        )
      )
    );

  });


  if (!resultado.length) {

    $("lista").innerHTML =
      '<div class="empty">' +
      (
        clientes.length
          ? "Nenhum cliente encontrado para essa busca."
          : "Nenhum cliente cadastrado. Clique em Novo cliente para começar."
      ) +
      "</div>";

    return;

  }


  $("lista").innerHTML = `
    <table>

      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Telefone</th>
          <th></th>
        </tr>
      </thead>

      <tbody>

        ${resultado
          .map(
            (c) => `
              <tr>

                <td>
                  ${esc(c.nome)}

                  <small>
                    ${esc(
                      c.email || "Sem e-mail"
                    )}
                  </small>
                </td>

                <td>
                  ${fCpf(c.cpf)}
                </td>

                <td>
                  ${fTel(c.telefone)}
                </td>

                <td>

                  <button
                    class="link"
                    data-id="${c.id}"
                  >
                    Editar
                  </button>

                </td>

              </tr>
            `
          )
          .join("")}

      </tbody>

    </table>
  `;

}


/* -------------------------------------------------------
   ABRIR MODAL
------------------------------------------------------- */

function open(c) {

  editId = c
    ? c.id
    : null;


  $("tit").textContent =
    c
      ? "Editar cliente"
      : "Novo cliente";


  $("nome").value =
    c
      ? c.nome
      : "";


  $("cpf").value =
    c
      ? fCpf(c.cpf)
      : "";


  $("tel").value =
    c
      ? fTel(c.telefone)
      : "";


  $("email").value =
    c
      ? c.email || ""
      : "";


  $("end").value =
    c
      ? c.endereco || ""
      : "";


  $("obs").value =
    c
      ? c.observacoes || ""
      : "";


  document
    .querySelectorAll(".e")
    .forEach(
      (e) =>
        (e.textContent = "")
    );


  $("dlg").showModal();

  $("nome").focus();

}


/* -------------------------------------------------------
   VALIDAR FORMULÁRIO
------------------------------------------------------- */

function validar() {

  const erros = {};


  const nome =
    $("nome")
      .value
      .trim();


  const cpf =
    dig(
      $("cpf").value
    );


  const telefone =
    dig(
      $("tel").value
    );


  const email =
    $("email")
      .value
      .trim();


  if (nome.length < 3) {

    erros.nome =
      "Informe o nome completo.";

  }


  if (!cpfOk(cpf)) {

    erros.cpf =
      "CPF inválido. Confira os 11 dígitos.";

  } else if (
    clientes.some(
      (x) =>
        x.cpf === cpf &&
        String(x.id) !== String(editId)
    )
  ) {

    erros.cpf =
      "Já existe um cliente com esse CPF.";

  }


  if (
    telefone.length < 10 ||
    telefone.length > 11
  ) {

    erros.tel =
      "Informe DDD e telefone (10 ou 11 dígitos).";

  }


  if (
    email &&
    !/^\S+@\S+\.\S+$/.test(email)
  ) {

    erros.email =
      "E-mail inválido.";

  }


  document
    .querySelectorAll(".e")
    .forEach(
      (s) =>
        (
          s.textContent =
            erros[s.dataset.e] || ""
        )
    );


  if (
    Object.keys(erros).length
  ) {
    return null;
  }


  return {

    nome: nome,

    cpf: cpf,

    telefone: telefone,

    email: email || null,

    endereco:
      $("end")
        .value
        .trim() || null,

    observacoes:
      $("obs")
        .value
        .trim() || null,

  };

}


/* -------------------------------------------------------
   CADASTRAR CLIENTE
------------------------------------------------------- */

async function cadastrarCliente(cliente) {

  const { data, error } =
    await supabaseClient
      .from("clientes")
      .insert(cliente)
      .select()
      .single();


  if (error) {

    console.error(
      "Erro ao cadastrar cliente:",
      error
    );

    toast(
      "Erro ao cadastrar cliente"
    );

    return false;

  }


  clientes.push(data);

  toast(
    "Cliente cadastrado"
  );

  return true;

}


/* -------------------------------------------------------
   ATUALIZAR CLIENTE
------------------------------------------------------- */

async function atualizarCliente(
  id,
  cliente
) {

  const { data, error } =
    await supabaseClient
      .from("clientes")
      .update(cliente)
      .eq("id", id)
      .select()
      .single();


  if (error) {

    console.error(
      "Erro ao atualizar cliente:",
      error
    );

    toast(
      "Erro ao atualizar cliente"
    );

    return false;

  }


  clientes =
    clientes.map(
      (c) =>
        c.id === id
          ? data
          : c
    );


  toast(
    "Cliente atualizado"
  );

  return true;

}


/* -------------------------------------------------------
   NOVO CLIENTE
------------------------------------------------------- */

$("novo").onclick = () => {

  open(null);

};


/* -------------------------------------------------------
   CANCELAR
------------------------------------------------------- */

$("cancel").onclick = () => {

  $("dlg").close();

};


/* -------------------------------------------------------
   PESQUISA
------------------------------------------------------- */

$("q").oninput = render;


/* -------------------------------------------------------
   EDITAR CLIENTE
------------------------------------------------------- */

$("lista").onclick = (e) => {

  const botao =
    e.target.closest(
      "button[data-id]"
    );


  if (!botao) {
    return;
  }


  const cliente =
    clientes.find(
      (c) =>
        String(c.id) ===
        String(botao.dataset.id)
    );


  if (cliente) {

    open(cliente);

  }

};


/* -------------------------------------------------------
   SALVAR FORMULÁRIO
------------------------------------------------------- */

$("frm").onsubmit =
  async (ev) => {

    ev.preventDefault();


    const dados =
      validar();


    if (!dados) {
      return;
    }


    let sucesso;


    if (editId !== null) {

      sucesso =
        await atualizarCliente(
          editId,
          dados
        );

    } else {

      sucesso =
        await cadastrarCliente(
          dados
        );

    }


    if (!sucesso) {
      return;
    }


    $("dlg").close();

    render();

  };


/* -------------------------------------------------------
   INICIALIZAÇÃO
------------------------------------------------------- */

carregarClientes();