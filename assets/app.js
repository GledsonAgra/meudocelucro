/*
  APP.JS: lógica compartilhada por todas as páginas.

  Decisões importantes, explicadas aqui uma vez para não repetir em
  cada página:

  1. Tudo fica dentro de um único objeto "MDL" (Meu Doce Lucro), em vez
     de funções soltas no escopo global. Isso evita que uma variável
     chamada, por exemplo, "total" definida numa página bagunce outra.

  2. Este arquivo NÃO usa "import/export" (módulos ES). O motivo é que
     o site precisa abrir direto do arquivo no navegador (file://), sem
     servidor. Em muitos navegadores, módulos ES bloqueiam quando abertos
     assim, por causa de uma regra de segurança (CORS). Uma <script> comum,
     carregada na ordem certa, não tem esse problema.

  3. Não existe nenhuma chamada de rede aqui (fetch, XHR). Tudo é
     calculado no próprio aparelho da pessoa.
*/

var MDL = (function () {
  "use strict";

  /* ================= 1. Dinheiro, data e número ================= */

  function formatarMoeda(valor) {
    var numero = Number(valor);
    if (!isFinite(numero)) numero = 0;
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Converte um texto digitado como "R$ 5,49", "5,49" ou "5.49" em número
  // JS (5.49). Aceita os três formatos porque no celular é fácil digitar
  // o símbolo de moeda ou o ponto sem querer, no lugar da vírgula.
  function paraNumero(texto) {
    if (typeof texto === "number") return texto;
    if (!texto) return 0;
    // Tira tudo que não é dígito, vírgula, ponto ou sinal de menos.
    var soDigitos = String(texto).trim().replace(/[^\d,.-]/g, "");
    var limpo = soDigitos.replace(/\./g, "").replace(",", ".");
    var numero = parseFloat(limpo);
    if (isNaN(numero)) {
      numero = parseFloat(soDigitos.replace(",", "."));
    }
    return isNaN(numero) ? 0 : numero;
  }

  // "12 de ago.": formato curto em português, usado nas comparações
  // de histórico de preço.
  function formatarDataCurta(data) {
    var d = data instanceof Date ? data : new Date(data);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "short",
    }).format(d);
  }

  // "06/09/2026": formato longo, usado nas fichas impressas.
  function formatarDataLonga(data) {
    var d = data instanceof Date ? data : new Date(data);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  }

  /* ================= 2. Conversão de unidades =================
     A pessoa informa o tamanho da embalagem numa unidade (ex.: kg) e
     quanto usa na receita em outra da mesma família (ex.: g). O sistema
     converte tudo para uma unidade-base antes de fazer a conta.
     Família "peso": g e kg. Família "volume": ml e l. Família "unidade": un
     (coisas que não se pesam nem se medem em volume, tipo "1 embalagem"). */

  var FAMILIAS = {
    g: "peso", kg: "peso",
    ml: "volume", l: "volume",
    un: "unidade",
  };

  var PARA_BASE = {
    g: 1, kg: 1000,
    ml: 1, l: 1000,
    un: 1,
  };

  var ROTULO_FAMILIA = {
    peso: "peso (g ou kg)",
    volume: "volume (ml ou l)",
    unidade: "unidade (un)",
  };

  function familiaDaUnidade(unidade) {
    return FAMILIAS[unidade] || null;
  }

  function mesmaFamilia(u1, u2) {
    return familiaDaUnidade(u1) === familiaDaUnidade(u2);
  }

  function converterParaBase(valor, unidade) {
    var fator = PARA_BASE[unidade];
    return fator ? valor * fator : valor;
  }

  /* ================= 3. Custo de um ingrediente =================
     Recebe um objeto:
       { nome, precoEmbalagem, tamanhoEmbalagem, unidadeEmbalagem,
         quantidadeUsada, unidadeUsada }
     Devolve { ok: true, custo: 12.34 } ou { ok: false, mensagem: "..." }.
     A mensagem de erro sempre explica o que fazer, nunca só "erro". */
  function calcularCustoIngrediente(ing) {
    var preco = paraNumero(ing.precoEmbalagem);
    var tamanho = paraNumero(ing.tamanhoEmbalagem);
    var usado = paraNumero(ing.quantidadeUsada);
    var nome = ing.nome && ing.nome.trim() ? ing.nome.trim() : "esse ingrediente";

    if (!mesmaFamilia(ing.unidadeEmbalagem, ing.unidadeUsada)) {
      var famEmbalagem = ROTULO_FAMILIA[familiaDaUnidade(ing.unidadeEmbalagem)];
      var famUsada = ROTULO_FAMILIA[familiaDaUnidade(ing.unidadeUsada)];
      return {
        ok: false,
        mensagem:
          'Em "' + nome + '", a embalagem está em ' + famEmbalagem +
          " mas o quanto você usa está em " + famUsada +
          ". Deixe os dois na mesma família: ou os dois em peso (g/kg), " +
          "ou os dois em volume (ml/l), ou os dois em unidade (un).",
      };
    }
    if (tamanho <= 0) {
      return {
        ok: false,
        mensagem:
          'O tamanho da embalagem de "' + nome + '" precisa ser maior que zero.',
      };
    }
    if (preco < 0 || usado < 0) {
      return {
        ok: false,
        mensagem: 'Confira os valores de "' + nome + '", não pode ser negativo.',
      };
    }

    var tamanhoBase = converterParaBase(tamanho, ing.unidadeEmbalagem);
    var usadoBase = converterParaBase(usado, ing.unidadeUsada);
    var custoPorBase = preco / tamanhoBase;
    return { ok: true, custo: custoPorBase * usadoBase };
  }

  /* ================= 4. Guardar e ler dados (localStorage) =================
     O navegador guarda os dados só neste aparelho. Não existe servidor,
     login nem nuvem, por isso, se a pessoa trocar de celular, precisa
     começar as fichas de novo (isso é avisado na tela, não escondido). */

  var CHAVE_FICHAS = "mdl_fichas_v1";

  function obterFichas() {
    try {
      var bruto = localStorage.getItem(CHAVE_FICHAS);
      return bruto ? JSON.parse(bruto) : [];
    } catch (e) {
      return [];
    }
  }

  function salvarFichas(lista) {
    try {
      localStorage.setItem(CHAVE_FICHAS, JSON.stringify(lista));
      return true;
    } catch (e) {
      // Provavelmente localStorage bloqueado (aba anônima, navegador
      // configurado para não guardar nada). Avisamos na tela quem chamou.
      return false;
    }
  }

  function obterFichaPorId(id) {
    var lista = obterFichas();
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) return lista[i];
    }
    return null;
  }

  function excluirFicha(id) {
    var lista = obterFichas().filter(function (f) {
      return f.id !== id;
    });
    salvarFichas(lista);
  }

  function gerarId() {
    return "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /* ================= 5. Histórico de preço =================
     Regra central do produto: NUNCA reaproveitamos um preço antigo para
     calcular: a pessoa sempre digita o preço de hoje. O que guardamos é
     só o retrato do custo por unidade em cada data, para comparar depois. */

  // Compara o novo custo por unidade com o último registro do histórico.
  // Não altera nada, só devolve a frase pronta para mostrar na tela.
  function compararComHistorico(historico, novoCustoPorUnidade) {
    if (!historico || historico.length === 0) return null;
    var ultimo = historico[historico.length - 1];
    if (!ultimo || !ultimo.custo) return null;
    var variacao = ((novoCustoPorUnidade - ultimo.custo) / ultimo.custo) * 100;
    var dataAnterior = formatarDataCurta(ultimo.data);

    if (variacao > 1) {
      return {
        tipo: "alerta",
        mensagem:
          "Seu custo subiu " + variacao.toFixed(1).replace(".", ",") +
          "% desde " + dataAnterior + ". Reajuste o preço ou sua margem encolhe.",
      };
    }
    if (variacao < -1) {
      return {
        tipo: "lucro",
        mensagem:
          "Seu custo caiu " + Math.abs(variacao).toFixed(1).replace(".", ",") +
          "% desde " + dataAnterior + ". Dá pra fazer promoção esta semana sem perder margem.",
      };
    }
    return {
      tipo: "info",
      mensagem: "Custo praticamente igual ao de " + dataAnterior + ".",
    };
  }

  // Acrescenta o registro de hoje ao histórico (não sobrescreve o passado).
  function acrescentarHistorico(historico, custoPorUnidade) {
    var lista = historico ? historico.slice() : [];
    lista.push({ data: new Date().toISOString(), custo: custoPorUnidade });
    return lista;
  }

  /* ================= 6. Preço de venda sugerido =================
     Fórmula por MARGEM SOBRE A VENDA (não é a mesma coisa que multiplicar
     o custo): preço = custo ÷ (1 − margem). Assim, se o custo é R$ 5 e a
     margem é 50%, o preço é R$ 10, e os R$ 5 de lucro são 50% do PREÇO
     final, não 50% do custo. */
  function precoSugerido(custoPorUnidade, margem) {
    if (margem >= 1) return custoPorUnidade;
    return custoPorUnidade / (1 - margem);
  }

  /* ================= 7. Links de afiliado =================
     Constantes num único ponto do arquivo, fáceis de editar depois.
     Troque os valores abaixo pelos seus links de afiliado reais. */
  var LINKS_AFILIADOS = {
    balanca: "https://exemplo-parceiro.com.br/balanca-de-precisao",
    embalagem: "https://exemplo-parceiro.com.br/embalagens-para-doces",
    formaVolume: "https://exemplo-parceiro.com.br/formas-e-potes",
  };

  // Sugestão de afiliado depende do que foi calculado, nunca aparece
  // por padrão, só quando faz sentido para aquela conta específica.
  // "contexto" = { usouGramas, temCustoEmbalagem, rendimento }
  function sugerirAfiliados(contexto) {
    var sugestoes = [];

    if (contexto.usouGramas) {
      sugestoes.push({
        texto: "Medir em gramas no olho costuma custar caro no fim do mês. Uma balança de precisão paga o próprio preço em poucas fornadas.",
        rotulo: "Ver balança de precisão",
        link: LINKS_AFILIADOS.balanca,
      });
    }
    if (!contexto.temCustoEmbalagem) {
      sugestoes.push({
        texto: "Você não lançou nenhum custo de embalagem, o número acima está otimista. Uma embalagem caprichada também ajuda a vender mais caro.",
        rotulo: "Ver embalagens",
        link: LINKS_AFILIADOS.embalagem,
      });
    }
    if (contexto.rendimento >= 20) {
      sugestoes.push({
        texto: "Para rendimentos grandes, uma forma ou pote com medida certa evita desperdício de massa e recheio.",
        rotulo: "Ver formas e potes",
        link: LINKS_AFILIADOS.formaVolume,
      });
    }
    return sugestoes;
  }

  /* ================= 8. Expor a API pública ================= */
  return {
    formatarMoeda: formatarMoeda,
    paraNumero: paraNumero,
    formatarDataCurta: formatarDataCurta,
    formatarDataLonga: formatarDataLonga,
    mesmaFamilia: mesmaFamilia,
    familiaDaUnidade: familiaDaUnidade,
    calcularCustoIngrediente: calcularCustoIngrediente,
    obterFichas: obterFichas,
    salvarFichas: salvarFichas,
    obterFichaPorId: obterFichaPorId,
    excluirFicha: excluirFicha,
    gerarId: gerarId,
    compararComHistorico: compararComHistorico,
    acrescentarHistorico: acrescentarHistorico,
    precoSugerido: precoSugerido,
    LINKS_AFILIADOS: LINKS_AFILIADOS,
    sugerirAfiliados: sugerirAfiliados,
  };
})();
