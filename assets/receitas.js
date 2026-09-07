/*
  RECEITAS.JS: índice das receitas do site.

  Para que serve este arquivo:
  1. A home (index.html) lê esta lista para montar os cartões de receita,
     sem precisar repetir HTML de cartão em lugar nenhum.
  2. A calculadora (calcular.html) lê esta lista quando a pessoa chega
     vinda de uma receita (link "?receita=alfajor"), para já
     preencher os nomes, quantidades e unidades dos ingredientes,
     faltando só os preços, que só a própria pessoa sabe.

  Importante: esta lista é só um ÍNDICE. O conteúdo completo de cada
  receita (modo de preparo, foto, texto) mora no próprio arquivo HTML
  dela, em /receitas/. Isso é o que permite o Google indexar cada
  receita na sua própria URL.

  Ao publicar uma receita nova (copiando o MODELO-RECEITA.html), lembre
  de acrescentar um objeto aqui também: é o que faz ela aparecer na
  home e funcionar o botão "calcular o custo desta receita".

  Foto: salve o arquivo dentro de /assets-fotos/ (pasta na raiz do
  projeto, do lado de /assets/ e /receitas/) e escreva o nome EXATO do
  arquivo, com a extensão, no campo "foto": por exemplo "Alfajor.png".
  Não precisa ser minúsculo nem igual ao "id": o nome é livre, é só
  bater com o arquivo salvo. Sem o campo "foto", a receita aparece sem
  foto (só o degradê), sem gerar nenhum erro.
*/

var RECEITAS = [
  {
    id: "alfajor",
    titulo: "Alfajor",
    resumo: "Massa de três ingredientes, recheio de doce de leite e cobertura de chocolate.",
    url: "receitas/alfajor.html",
    foto: "Alfajor.png",
    tempoPreparo: "50 min",
    rendimento: 30,
    unidadeRendimento: "unidades",
    ingredientesCalculo: [
      { nome: "Amido de milho (maisena)", quantidade: 500, unidade: "g" },
      { nome: "Leite condensado", quantidade: 395, unidade: "g" },
      { nome: "Margarina", quantidade: 100, unidade: "g" },
      { nome: "Doce de leite (recheio)", quantidade: 450, unidade: "g" },
      { nome: "Chocolate (cobertura)", quantidade: 700, unidade: "g" },
    ],
  },
  {
    id: "amendoim-doce",
    titulo: "Amendoim doce",
    resumo: "Amendoim caramelizado e torrado no forno, crocante por fora, ótimo pra vender em pacotinhos.",
    url: "receitas/amendoim-doce.html",
    foto: "Amendoim doce.png",
    tempoPreparo: "40 min",
    // Rendimento estimado (a receita não veio com essa informação):
    // 500 g de amendoim + 360 g de açúcar somam cerca de 800 g depois de
    // prontos, dividido em pacotinhos de 100 g. Ajuste esse número na
    // calculadora se a sua porção for diferente.
    rendimento: 8,
    unidadeRendimento: "pacotes de 100g",
    ingredientesCalculo: [
      { nome: "Amendoim cru", quantidade: 500, unidade: "g" },
      { nome: "Açúcar", quantidade: 360, unidade: "g" },
      { nome: "Água", quantidade: 240, unidade: "ml" },
      { nome: "Fermento em pó", quantidade: 10, unidade: "g" },
      { nome: "Chocolate em pó", quantidade: 20, unidade: "g" },
      { nome: "Canela em pó", quantidade: 3, unidade: "g" },
    ],
  },
  {
    id: "biscoito-de-coco-amanteigado",
    titulo: "Biscoito de coco amanteigado",
    resumo: "Biscoitinho amanteigado de coco, macio por dentro e crocante por fora.",
    url: "receitas/biscoito-de-coco-amanteigado.html",
    foto: "Biscoito de coco amanteigado.png",
    // Tempo e rendimento estimados (a receita não veio com essa
    // informação): 710 g de massa ao todo, em biscoitos de ~18 g crus,
    // dá uns 35 biscoitos. Ajuste na calculadora se o seu ficar diferente.
    tempoPreparo: "35 min",
    rendimento: 35,
    unidadeRendimento: "unidades",
    ingredientesCalculo: [
      { nome: "Amido de milho (maisena)", quantidade: 200, unidade: "g" },
      { nome: "Farinha de trigo", quantidade: 130, unidade: "g" },
      { nome: "Açúcar", quantidade: 130, unidade: "g" },
      // "Coco ralado - qb" na receita original (quantidade a gosto, sem
      // medida exata): usei 50 g como estimativa razoável para o
      // tamanho desta massa. Ajuste no valor real que você usar.
      { nome: "Coco ralado", quantidade: 50, unidade: "g" },
      { nome: "Manteiga", quantidade: 200, unidade: "g" },
    ],
  },
  {
    id: "bala-de-coco-baiana",
    titulo: "Bala de coco baiana",
    resumo: "Bolinha de coco cremosa por dentro, com casquinha crocante de caramelo por fora.",
    url: "receitas/bala-de-coco-baiana.html",
    foto: "Bala de coco baiana.png",
    // Tempo e rendimento estimados (a receita não veio com essa
    // informação): a massa de coco dá uns 810 g, em bolinhas de ~18 g,
    // rende umas 45 balas. Ajuste na calculadora se o seu ficar diferente.
    tempoPreparo: "1 h 10 min",
    rendimento: 45,
    unidadeRendimento: "unidades",
    ingredientesCalculo: [
      { nome: "Leite condensado", quantidade: 395, unidade: "g" },
      { nome: "Leite de coco", quantidade: 200, unidade: "ml" },
      // "1 colher de margarina" na receita original, sem especificar o
      // tamanho da colher: assumi colher de sopa (~15 g).
      { nome: "Margarina", quantidade: 15, unidade: "g" },
      { nome: "Coco fresco ralado sem açúcar", quantidade: 200, unidade: "g" },
      { nome: "Açúcar refinado (caramelo)", quantidade: 500, unidade: "g" },
      { nome: "Água (caramelo)", quantidade: 250, unidade: "ml" },
      // "1 colher de vinagre branco", mesma suposição: colher de sopa (~15 ml).
      { nome: "Vinagre branco (caramelo)", quantidade: 15, unidade: "ml" },
    ],
  },
  {
    id: "bolo-de-rosquinha-mabel",
    titulo: "Bolo de rosquinha Mabel",
    resumo: "Bolo simples de liquidificador, feito com rosquinha Mabel, leite e fermento.",
    url: "receitas/bolo-de-rosquinha-mabel.html",
    foto: "Bolo de rosquinha Mabel.png",
    // Tempo e rendimento estimados (a receita não veio com essa
    // informação): a massa toda dá quase 1 kg, num bolo com furo no
    // meio, rendendo umas 12 fatias. Ajuste na calculadora se o seu
    // ficar diferente.
    tempoPreparo: "35 min",
    rendimento: 12,
    unidadeRendimento: "fatias",
    ingredientesCalculo: [
      { nome: "Rosquinha Mabel", quantidade: 500, unidade: "g" },
      // "2 xícaras de leite" na receita original: usei a xícara de chá
      // padrão (240 ml), então 2 xícaras = 480 ml.
      { nome: "Leite", quantidade: 480, unidade: "ml" },
      // "1 tampinha de fermento em pó" (medida caseira, sem gramatura
      // exata): estimei 10 g, próximo de 1 colher de sopa rasa.
      { nome: "Fermento em pó", quantidade: 10, unidade: "g" },
    ],
  },
  {
    id: "suspiro",
    titulo: "Suspiro",
    resumo: "Suspiro crocante por fora e macio por dentro, feito com clara, açúcar e limão.",
    url: "receitas/suspiro.html",
    foto: "Suspiro.png",
    // Tempo e rendimento estimados (a receita não veio com essa
    // informação): 770 g de massa ao todo, em suspiros pequenos de
    // ~10 g, rende uns 80. Ajuste na calculadora se o seu ficar diferente.
    tempoPreparo: "2 h 15 min",
    rendimento: 80,
    unidadeRendimento: "unidades",
    ingredientesCalculo: [
      { nome: "Clara de ovo", quantidade: 250, unidade: "g" },
      { nome: "Açúcar refinado", quantidade: 500, unidade: "g" },
      { nome: "Suco de limão", quantidade: 20, unidade: "ml" },
    ],
  },
  {
    id: "brownie",
    titulo: "Brownie",
    resumo: "Brownie de chocolate, casquinha crocante por fora e macio por dentro.",
    url: "receitas/brownie.html",
    foto: "Brownie.png",
    // Rendimento estimado (a receita não veio com essa informação):
    // forma de 20x20cm cortada em quadrados de ~5cm rende 16 pedaços.
    // Ajuste na calculadora se o seu corte for diferente.
    tempoPreparo: "1 h",
    rendimento: 16,
    unidadeRendimento: "pedaços",
    ingredientesCalculo: [
      { nome: "Ovo", quantidade: 3, unidade: "un" },
      // A receita deu a medida da própria xícara: 240 g. Usei isso pra
      // converter tudo que é "xícara" aqui.
      { nome: "Açúcar", quantidade: 360, unidade: "g" },
      // "Colher de sopa" contada como 15 g/ml, mesma convenção usada
      // nas outras receitas do site.
      { nome: "Manteiga derretida", quantidade: 60, unidade: "g" },
      { nome: "Chocolate em pó", quantidade: 30, unidade: "g" },
      { nome: "Farinha de trigo", quantidade: 360, unidade: "g" },
      { nome: "Chocolate derretido", quantidade: 200, unidade: "g" },
    ],
  },
  {
    id: "mini-churros",
    titulo: "Mini churros",
    resumo: "Churros pequenos, crocantes por fora e macios por dentro, passados em açúcar e canela.",
    url: "receitas/mini-churros.html",
    foto: "Mini Churros.png",
    // Rendimento estimado (a receita não veio com essa informação):
    // a massa toda dá quase 1 kg, e mini churros são pequenos, uns
    // 9-10 g cada um cru, rendendo perto de 100 unidades. Ajuste na
    // calculadora se o seu ficar diferente.
    tempoPreparo: "45 min",
    rendimento: 100,
    unidadeRendimento: "unidades",
    ingredientesCalculo: [
      { nome: "Leite", quantidade: 200, unidade: "ml" },
      { nome: "Água", quantidade: 200, unidade: "ml" },
      { nome: "Manteiga", quantidade: 100, unidade: "g" },
      // "2 colheres de sopa" contadas como 15 g cada, mesma convenção
      // das outras receitas.
      { nome: "Açúcar", quantidade: 30, unidade: "g" },
      // "1 pitada de sal" (medida caseira, sem gramatura exata):
      // estimei 1 g.
      { nome: "Sal", quantidade: 1, unidade: "g" },
      { nome: "Farinha de trigo", quantidade: 220, unidade: "g" },
      { nome: "Ovo", quantidade: 4, unidade: "un" },
      // Os três itens abaixo (açúcar/canela pra finalizar, doce de
      // leite de acompanhamento, óleo de fritura) não vieram com
      // quantidade na receita original: estimei valores razoáveis
      // pra um lote deste tamanho. Ajuste no que você realmente gasta.
      { nome: "Açúcar (para finalizar)", quantidade: 100, unidade: "g" },
      { nome: "Canela em pó (para finalizar)", quantidade: 10, unidade: "g" },
      { nome: "Doce de leite (para acompanhar)", quantidade: 200, unidade: "g" },
      { nome: "Óleo (para fritar)", quantidade: 500, unidade: "ml" },
    ],
  },
];
