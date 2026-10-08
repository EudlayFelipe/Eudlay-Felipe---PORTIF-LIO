/* =========================================================
   script.js - interações do portfólio (JavaScript puro, sem bibliotecas)
   Ordem do arquivo:
   1. Tema claro/escuro
   2. Menu responsivo (hambúrguer)
   3. Destaque do link da seção atual
   4. Validação do formulário de contato
   5. Modal de confirmação
   6. Ano no rodapé
   ========================================================= */

/* ---------- Referências aos elementos do HTML ---------- */
const html = document.documentElement;                 // tag <html>
const btnTema = document.getElementById("btnTema");
const iconeTema = document.getElementById("iconeTema");
const btnMenu = document.getElementById("btnMenu");
const menu = document.getElementById("menu");
const linksMenu = document.querySelectorAll(".menu__link");

/* =========================================================
   1. TEMA CLARO / ESCURO
   O CSS troca as cores quando <html> tem data-tema="escuro".
   ========================================================= */
function atualizarIconeTema() {
  // Mostra a lua no tema claro (clique leva ao escuro) e o sol no escuro
  const escuro = html.getAttribute("data-tema") === "escuro";
  iconeTema.textContent = escuro ? "☀️" : "🌙";
}

btnTema.addEventListener("click", function () {
  const escuro = html.getAttribute("data-tema") === "escuro";
  const novoTema = escuro ? "claro" : "escuro";

  html.setAttribute("data-tema", novoTema);
  atualizarIconeTema();

  // Guarda a escolha no navegador para lembrar na próxima visita
  try {
    localStorage.setItem("tema", novoTema);
  } catch (e) {
    /* Se o navegador bloquear o armazenamento, o tema só vale nesta visita */
  }
});

atualizarIconeTema(); // ajusta o ícone quando a página abre

/* =========================================================
   2. MENU RESPONSIVO
   Em telas pequenas o menu abre/fecha ao clicar no hambúrguer.
   ========================================================= */
function alternarMenu(abrir) {
  menu.classList.toggle("aberto", abrir);
  btnMenu.setAttribute("aria-expanded", String(abrir));
}

btnMenu.addEventListener("click", function () {
  const estaAberto = menu.classList.contains("aberto");
  alternarMenu(!estaAberto);
});

// Fecha o menu depois que o usuário escolhe uma seção
linksMenu.forEach(function (link) {
  link.addEventListener("click", function () {
    alternarMenu(false);
  });
});

/* =========================================================
   3. LINK ATIVO CONFORME A ROLAGEM
   O IntersectionObserver avisa quando uma seção entra na área visível.
   ========================================================= */
const secoes = document.querySelectorAll("main section");

const observador = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        // Remove "ativo" de todos e coloca só no link da seção visível
        linksMenu.forEach(function (link) {
          const ehDestaSecao = link.getAttribute("href") === "#" + entrada.target.id;
          link.classList.toggle("ativo", ehDestaSecao);
        });
      }
    });
  },
  // A seção conta como "atual" quando cruza a faixa do meio da tela
  { rootMargin: "-40% 0px -55% 0px" }
);

secoes.forEach(function (secao) {
  observador.observe(secao);
});

/* =========================================================
   4. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
   ========================================================= */
const form = document.getElementById("formContato");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoMensagem = document.getElementById("mensagem");

// Expressão regular simples para e-mail: algo@dominio.ext
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Mostra ou limpa a mensagem de erro de um campo
function mostrarErro(campo, idErro, texto) {
  document.getElementById(idErro).textContent = texto;
  // A classe "invalido" (no .campo pai) deixa a borda vermelha no CSS
  campo.parentElement.classList.toggle("invalido", texto !== "");
}

// Cada função devolve true se o campo está válido
function validarNome() {
  const valor = campoNome.value.trim();
  if (valor === "") {
    mostrarErro(campoNome, "erroNome", "Digite seu nome.");
    return false;
  }
  if (valor.length < 3) {
    mostrarErro(campoNome, "erroNome", "O nome precisa ter pelo menos 3 letras.");
    return false;
  }
  mostrarErro(campoNome, "erroNome", "");
  return true;
}

function validarEmail() {
  const valor = campoEmail.value.trim();
  if (valor === "") {
    mostrarErro(campoEmail, "erroEmail", "Digite seu e-mail.");
    return false;
  }
  if (!regexEmail.test(valor)) {
    mostrarErro(campoEmail, "erroEmail", "Use um e-mail válido, como usuario@dominio.com.");
    return false;
  }
  mostrarErro(campoEmail, "erroEmail", "");
  return true;
}

function validarMensagem() {
  const valor = campoMensagem.value.trim();
  if (valor === "") {
    mostrarErro(campoMensagem, "erroMensagem", "Escreva sua mensagem.");
    return false;
  }
  if (valor.length < 10) {
    mostrarErro(campoMensagem, "erroMensagem", "A mensagem precisa ter pelo menos 10 caracteres.");
    return false;
  }
  mostrarErro(campoMensagem, "erroMensagem", "");
  return true;
}

// Revalida cada campo quando o usuário sai dele
campoNome.addEventListener("blur", validarNome);
campoEmail.addEventListener("blur", validarEmail);
campoMensagem.addEventListener("blur", validarMensagem);

// Evento de envio do formulário
form.addEventListener("submit", function (evento) {
  evento.preventDefault(); // impede o envio real (a página não recarrega)

  // Roda as três validações (sem "&&" direto para mostrar todos os erros de uma vez)
  const nomeOk = validarNome();
  const emailOk = validarEmail();
  const mensagemOk = validarMensagem();

  if (nomeOk && emailOk && mensagemOk) {
    // SIMULAÇÃO do envio: não há servidor, só limpamos e avisamos
    form.reset();
    abrirModal();
  }
});

/* =========================================================
   5. MODAL DE CONFIRMAÇÃO
   ========================================================= */
const modal = document.getElementById("modal");
const modalFechar = document.getElementById("modalFechar");

function abrirModal() {
  modal.hidden = false;      // remove o atributo hidden e o modal aparece
  modalFechar.focus();       // leva o foco para o botão (acessibilidade)
}

function fecharModal() {
  modal.hidden = true;
}

modalFechar.addEventListener("click", fecharModal);

// Clicar no fundo escuro (fora da caixa) também fecha
modal.addEventListener("click", function (evento) {
  if (evento.target === modal) {
    fecharModal();
  }
});

// Tecla Esc fecha o modal
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && !modal.hidden) {
    fecharModal();
  }
});

/* =========================================================
   6. ANO ATUAL NO RODAPÉ
   ========================================================= */
document.getElementById("ano").textContent = new Date().getFullYear();