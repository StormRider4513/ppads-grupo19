const KEY = "aumiaupet_clientes";
const seed = [
    { id: 1, nome: "Marina Souza", cpf: "52998224725", tel: "11987654321", email: "marina@email.com", end: "Rua das Flores, 120 - Tupã/SP", obs: "Tutora da Luna" },
    { id: 2, nome: "Carlos Almeida", cpf: "11144477735", tel: "14991234567", email: "", end: "", obs: "" }
];
let clientes = [], editId = null;
try { const s = localStorage.getItem(KEY); clientes = s ? JSON.parse(s) : seed } catch (e) { clientes = seed }
const $ = id => document.getElementById(id);
function save() { try { localStorage.setItem(KEY, JSON.stringify(clientes)) } catch (e) { } }
const fCpf = v => v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
const fTel = v => v.length === 11 ? v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3") : v.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
const dig = v => v.replace(/\D/g, "");
function cpfOk(c) {
    if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    for (let t = 9; t < 11; t++) { let s = 0; for (let i = 0; i < t; i++)s += c[i] * (t + 1 - i); if ((s * 10 % 11) % 10 != c[t]) return false } return true
}
function esc(s) { return s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) }
function toast(m) { const t = $("toast"); t.textContent = m; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 2200) }

function render() {
    const q = $("q").value.trim().toLowerCase(), qd = dig(q);
    const r = clientes.filter(c => !q || c.nome.toLowerCase().includes(q) || (qd && (c.cpf.includes(qd) || c.tel.includes(qd))))
        .sort((a, b) => a.nome.localeCompare(b.nome));
    if (!r.length) { $("lista").innerHTML = '<div class="empty">' + (clientes.length ? "Nenhum cliente encontrado para essa busca." : "Nenhum cliente cadastrado. Clique em Novo cliente para começar.") + "</div>"; return }
    $("lista").innerHTML = "<table><thead><tr><th>Nome</th><th>CPF</th><th>Telefone</th><th></th></tr></thead><tbody>" +
        r.map(c => `<tr><td>${esc(c.nome)}<small>${esc(c.email || "Sem e-mail")}</small></td><td>${fCpf(c.cpf)}</td><td>${fTel(c.tel)}</td><td><button class="link" data-id="${c.id}">Editar</button></td></tr>`).join("") + "</tbody></table>";
}
function open(c) {
    editId = c ? c.id : null; $("tit").textContent = c ? "Editar cliente" : "Novo cliente";
    $("nome").value = c ? c.nome : ""; $("cpf").value = c ? fCpf(c.cpf) : ""; $("tel").value = c ? fTel(c.tel) : "";
    $("email").value = c ? c.email : ""; $("end").value = c ? c.end : ""; $("obs").value = c ? c.obs : "";
    document.querySelectorAll(".e").forEach(e => e.textContent = ""); $("dlg").showModal(); $("nome").focus();
}
function validar() {
    const e = {}, n = $("nome").value.trim(), c = dig($("cpf").value), t = dig($("tel").value), m = $("email").value.trim();
    if (n.length < 3) e.nome = "Informe o nome completo.";
    if (!cpfOk(c)) e.cpf = "CPF inválido. Confira os 11 dígitos.";
    else if (clientes.some(x => x.cpf === c && x.id !== editId)) e.cpf = "Já existe um cliente com esse CPF.";
    if (t.length < 10 || t.length > 11) e.tel = "Informe DDD e telefone (10 ou 11 dígitos).";
    if (m && !/^\S+@\S+\.\S+$/.test(m)) e.email = "E-mail inválido.";
    document.querySelectorAll(".e").forEach(s => s.textContent = e[s.dataset.e] || "");
    return Object.keys(e).length ? null : { nome: n, cpf: c, tel: t, email: m, end: $("end").value.trim(), obs: $("obs").value.trim() };
}
$("novo").onclick = () => open(null);
$("cancel").onclick = () => $("dlg").close();
$("q").oninput = render;
$("lista").onclick = e => { const b = e.target.closest("button[data-id]"); if (b) open(clientes.find(c => c.id == b.dataset.id)) };
$("frm").onsubmit = ev => {
    ev.preventDefault(); const d = validar(); if (!d) return;
    if (editId) { clientes = clientes.map(c => c.id === editId ? { ...c, ...d } : c); toast("Cliente atualizado") }
    else { clientes.push({ id: Date.now(), ...d }); toast("Cliente cadastrado") }
    save(); $("dlg").close(); render()
};
render();
