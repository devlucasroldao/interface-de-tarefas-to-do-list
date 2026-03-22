const input = document.getElementById("inputTarefa");
const prioridade = document.getElementById("prioridade");
const listaPendentes = document.getElementById("listaPendentes");
const listaConcluidas = document.getElementById("listaConcluidas");

document.getElementById("btnAdicionar").addEventListener("click", adicionarTarefa);
document.getElementById("filtroPrioridade").addEventListener("change", aplicarFiltro);

let tarefas = {
  pendentes: [],
  concluidas: []
};

function salvarLocalStorage() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarLocalStorage() {
  const dados = localStorage.getItem("tarefas");
  if (dados) {
    tarefas = JSON.parse(dados);
    aplicarFiltro(); // já aplica o filtro ao carregar
    tarefas.concluidas.forEach(t => renderizarTarefa(t, true));
  }
}

function adicionarTarefa() {
  const nome = input.value.trim();
  if (nome === "") {
    alert("Escreve uma tarefa aí !!!");
    return;
  }

  const tarefa = {
    nome: nome,
    prioridade: prioridade.value,
    data: new Date().toLocaleString('pt-BR')
  };

  tarefas.pendentes.push(tarefa);
  salvarLocalStorage();
  input.value = "";
  aplicarFiltro();
}

function renderizarTarefa(tarefa, concluida) {
  const li = document.createElement("li");
  li.classList.add(tarefa.prioridade);

  const span = document.createElement("span");
  span.textContent = concluida ? `${tarefa.nome} - concluída em ${tarefa.data}` : tarefa.nome;

  const botoes = document.createElement("div");
  botoes.classList.add("botoes");

  if (!concluida) {
    const btnConcluir = document.createElement("button");
    btnConcluir.textContent = "Concluir";
    btnConcluir.classList.add("concluir");
    btnConcluir.onclick = () => concluirTarefa(tarefa, li);
    botoes.appendChild(btnConcluir);
  }

  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "Excluir";
  btnExcluir.classList.add("excluir");
  btnExcluir.onclick = () => excluirTarefa(tarefa, li, concluida);
  botoes.appendChild(btnExcluir);

  li.appendChild(span);
  li.appendChild(botoes);

  if (concluida) {
    listaConcluidas.appendChild(li);
  } else {
    listaPendentes.appendChild(li);
  }
}

function concluirTarefa(tarefa, li) {
  tarefas.pendentes = tarefas.pendentes.filter(t => t !== tarefa);
  tarefa.data = new Date().toLocaleString('pt-BR');
  tarefas.concluidas.push(tarefa);
  salvarLocalStorage();
  li.remove();
  renderizarTarefa(tarefa, true);
  aplicarFiltro();
}

function excluirTarefa(tarefa, li, concluida) {
  if (concluida) {
    tarefas.concluidas = tarefas.concluidas.filter(t => t !== tarefa);
  } else {
    tarefas.pendentes = tarefas.pendentes.filter(t => t !== tarefa);
  }
  salvarLocalStorage();
  li.remove();
}

function aplicarFiltro() {
  const filtro = document.getElementById("filtroPrioridade").value;
  listaPendentes.innerHTML = "";

  let tarefasFiltradas = tarefas.pendentes;
  if (filtro !== "todas") {
    tarefasFiltradas = tarefas.pendentes.filter(t => t.prioridade === filtro);
  }

  tarefasFiltradas.forEach(t => renderizarTarefa(t, false));
}

carregarLocalStorage();
