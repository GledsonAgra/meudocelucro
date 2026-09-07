/*
  CADASTRO.JS: pede nome e e-mail no momento de salvar a ficha ou gerar o PDF,
  e manda os dados para a planilha do Google.

  ================= AS TRÊS DECISÕES QUE EXPLICAM ESTE ARQUIVO =================

  1. O cadastro NÃO fica na entrada do site.
     Quem chega ainda não viu valor nenhum e não tem motivo pra entregar
     e-mail. Aqui o pedido só aparece depois que a pessoa já calculou e já
     viu o próprio custo na tela, no clique de guardar aquilo. Capta menos
     gente, mas capta gente que quer o produto.

  2. Este arquivo não altera nenhum outro arquivo do site.
     Ele escuta os cliques no nível do documento e, quando o clique é numa
     das ações protegidas, segura o clique antes de ele chegar ao botão.
     Depois do cadastro, ele mesmo reenvia o clique. Por isso dá pra
     acrescentar (e um dia remover) o cadastro mexendo numa linha só de
     cada página, sem tocar na lógica da calculadora nem das fichas.

  3. O envio é "manda e segue".
     O Google não deixa um site ler a resposta do formulário (é uma regra de
     segurança do navegador, não um defeito daqui). Então o envio vai por um
     quadro escondido e o site não espera confirmação. Se a internet cair no
     instante do envio, a pessoa não fica travada: ela salva a ficha do mesmo
     jeito e o único prejuízo é aquele lead não aparecer na planilha.
     Nunca vale barrar o uso do site por causa de uma captação.
*/

var MDL_CADASTRO = (function () {
  "use strict";

  /* =================== 1. Configuração ===================
     Endereço de envio e os identificadores de cada campo do formulário.

     ATENÇÃO, PRA VOCÊ NO FUTURO: se um dia você apagar uma pergunta do
     formulário e criar outra no lugar, o número muda e o envio para de
     funcionar em silêncio. Nesse caso, gere um novo link pré-preenchido
     (três pontinhos → Preencher formulário automaticamente) e troque os
     números aqui embaixo. Acrescentar pergunta nova não quebra nada. */
  var URL_ENVIO =
    "https://docs.google.com/forms/d/e/1FAIpQLSfi7X6NWGWrIhBVzPt4PeV-p95a5wrVlDVhlmkxH8T5bLeHDw/formResponse";

  var CAMPOS = {
    nome:   "entry.538163241",
    email:  "entry.1961235529",
    rede:   "entry.1578945846",
    arroba: "entry.214082249",
  };

  // Os textos abaixo têm que ser IGUAIS às opções da lista suspensa no
  // Google Forms, letra por letra. Se lá estiver "TikTok" e aqui "Tiktok",
  // o Google descarta a resposta inteira, não só esse campo.
  var OPCOES_REDE = ["Instagram", "TikTok", "Facebook", "Não tenho ainda"];

  // Quais ações do site exigem cadastro. Tudo aqui é "guardar o trabalho":
  // salvar a ficha, imprimir uma ficha, gerar o caderno completo.
  var ACOES_PROTEGIDAS = "#btn-salvar-ficha, #btn-imprimir-caderno, [data-imprimir]";

  var CHAVE = "mdl_cadastro_v1";

  /* =================== 2. Memória local ===================
     O cadastro é pedido UMA vez por aparelho. Quem já preencheu não vê a
     janela de novo: pedir duas vezes é o jeito mais rápido de fazer a
     pessoa desistir e ir embora. */

  function jaCadastrou() {
    try {
      return !!localStorage.getItem(CHAVE);
    } catch (e) {
      // Navegador em modo anônimo, ou com dados bloqueados. Nesse caso a
      // pessoa vai ver a janela de novo numa próxima visita. Paciência:
      // é melhor que travar o site.
      return false;
    }
  }

  function guardarLocalmente(dados) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch (e) {
      /* segue o jogo */
    }
  }

  /* =================== 3. Envio para a planilha =================== */

  function enviarParaPlanilha(dados) {
    try {
      var quadro = document.createElement("iframe");
      quadro.name = "mdl-envio-" + Date.now();
      quadro.setAttribute("aria-hidden", "true");
      quadro.style.display = "none";
      document.body.appendChild(quadro);

      var form = document.createElement("form");
      form.action = URL_ENVIO;
      form.method = "POST";
      form.target = quadro.name;
      form.style.display = "none";

      Object.keys(CAMPOS).forEach(function (chave) {
        var campo = document.createElement("input");
        campo.type = "hidden";
        campo.name = CAMPOS[chave];
        campo.value = dados[chave] || "";
        form.appendChild(campo);
      });

      document.body.appendChild(form);
      form.submit();

      // Limpeza depois que o envio já saiu. Sem isso, cada cadastro
      // deixaria um quadro escondido pendurado na página.
      window.setTimeout(function () {
        if (form.parentNode) form.parentNode.removeChild(form);
        if (quadro.parentNode) quadro.parentNode.removeChild(quadro);
      }, 8000);
    } catch (e) {
      /* Nada a fazer: a pessoa não pode ser prejudicada por isso. */
    }
  }

  /* =================== 4. A janela ===================
     Montada por JavaScript de propósito: assim o HTML das páginas não
     precisa carregar um bloco escondido que só aparece de vez em quando. */

  var fundo = null;
  var acaoPendente = null;

  function fechar() {
    if (fundo && fundo.parentNode) fundo.parentNode.removeChild(fundo);
    fundo = null;
    document.removeEventListener("keydown", aoTeclar);
  }

  function aoTeclar(ev) {
    if (ev.key === "Escape") fechar();
  }

  function emailParecevalido(texto) {
    // Verificação de bom senso, não de rigor: pega o erro comum (esqueceu
    // o arroba, esqueceu o ponto) sem barrar endereço legítimo esquisito.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto.trim());
  }

  function abrir(elementoOrigem) {
    if (fundo) return;
    acaoPendente = elementoOrigem;

    fundo = document.createElement("div");
    fundo.className = "mdl-fundo";
    fundo.innerHTML =
      '<div class="mdl-caixa" role="dialog" aria-modal="true" aria-labelledby="mdl-titulo">' +
        '<h2 id="mdl-titulo">Antes de guardar</h2>' +
        '<p class="mdl-intro">Sua ficha fica salva neste aparelho. Deixe seu contato ' +
          "para receber avisos quando o custo dos ingredientes mudar.</p>" +

        '<div class="campo">' +
          '<label for="mdl-nome">Seu nome</label>' +
          '<input type="text" id="mdl-nome" autocomplete="name" placeholder="Como te chamam">' +
        "</div>" +

        '<div class="campo">' +
          '<label for="mdl-email">Seu e-mail</label>' +
          '<input type="email" id="mdl-email" autocomplete="email" inputmode="email" placeholder="voce@exemplo.com">' +
        "</div>" +

        '<div class="campo">' +
          '<label for="mdl-rede">Onde você divulga (opcional)</label>' +
          '<select id="mdl-rede">' +
            '<option value="">Escolher</option>' +
            OPCOES_REDE.map(function (o) {
              return '<option value="' + o + '">' + o + "</option>";
            }).join("") +
          "</select>" +
        "</div>" +

        '<div class="campo">' +
          '<label for="mdl-arroba">Seu @ (opcional)</label>' +
          '<input type="text" id="mdl-arroba" placeholder="@seuperfil">' +
        "</div>" +

        '<p class="mdl-erro" id="mdl-erro" hidden></p>' +

        '<div class="mdl-acoes">' +
          '<button type="button" class="btn btn-primario btn-bloco" id="mdl-confirmar">Guardar minha ficha</button>' +
          '<button type="button" class="btn btn-secundario btn-bloco" id="mdl-cancelar">Agora não</button>' +
        "</div>" +

        '<p class="mdl-rodape">Só usamos seu e-mail para falar sobre custo e preço. ' +
          "Você pode pedir para sair a qualquer momento.</p>" +
      "</div>";

    document.body.appendChild(fundo);
    document.addEventListener("keydown", aoTeclar);

    // Clicar fora da caixa fecha, igual a pessoa espera de qualquer app.
    fundo.addEventListener("click", function (ev) {
      if (ev.target === fundo) fechar();
    });

    document.getElementById("mdl-cancelar").addEventListener("click", fechar);
    document.getElementById("mdl-confirmar").addEventListener("click", confirmar);
    document.getElementById("mdl-nome").focus();
  }

  function confirmar() {
    var nome = document.getElementById("mdl-nome").value.trim();
    var email = document.getElementById("mdl-email").value.trim();
    var rede = document.getElementById("mdl-rede").value;
    var arroba = document.getElementById("mdl-arroba").value.trim();
    var erro = document.getElementById("mdl-erro");

    // Mensagem de erro diz o que fazer, não só que deu errado.
    if (!nome) {
      erro.textContent = "Escreva seu nome para continuar.";
      erro.hidden = false;
      document.getElementById("mdl-nome").focus();
      return;
    }
    if (!emailParecevalido(email)) {
      erro.textContent = "Confira o e-mail, parece faltar alguma coisa.";
      erro.hidden = false;
      document.getElementById("mdl-email").focus();
      return;
    }
    erro.hidden = true;

    var dados = {
      nome: nome,
      email: email,
      rede: rede,
      arroba: arroba,
      data: new Date().toISOString(),
    };

    guardarLocalmente(dados);
    enviarParaPlanilha(dados);

    var alvo = acaoPendente;
    fechar();

    // Reenvia o clique que ficou esperando. Agora jaCadastrou() responde
    // que sim, então o clique passa direto e a ação original acontece.
    if (alvo) window.setTimeout(function () { alvo.click(); }, 0);
  }

  /* =================== 5. A interceptação ===================
     Escutamos na fase de captura, no documento inteiro. Isso faz este
     código rodar ANTES do botão receber o clique: é o único jeito de
     segurar a ação sem mexer no script da calculadora ou das fichas. */

  document.addEventListener(
    "click",
    function (ev) {
      var alvo = ev.target && ev.target.closest
        ? ev.target.closest(ACOES_PROTEGIDAS)
        : null;
      if (!alvo) return;
      if (jaCadastrou()) return;

      ev.preventDefault();
      ev.stopPropagation();
      abrir(alvo);
    },
    true
  );

  /* =================== 6. Porta de saída ===================
     Exposto para o caso de você querer conferir no console do navegador
     (MDL_CADASTRO.dados()) ou limpar o cadastro para testar a janela de
     novo (MDL_CADASTRO.limpar() e recarregue a página). */
  return {
    jaCadastrou: jaCadastrou,
    dados: function () {
      try {
        return JSON.parse(localStorage.getItem(CHAVE) || "null");
      } catch (e) {
        return null;
      }
    },
    limpar: function () {
      try {
        localStorage.removeItem(CHAVE);
      } catch (e) {}
    },
  };
})();
