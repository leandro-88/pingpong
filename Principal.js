let somColisao;
let somPonto;
let somFundo;
let imgRaquete;
let imgRaqueteOponente;
let toqueY;

let chanceDeErrar = 0;

// Variáveis da bolinha
let xBolinha = 400;
let yBolinha = 300;
let diametro = 20;
let raio = diametro / 2;

// Velocidade da bolinha
let velocidadeXBolinha = 8;
let velocidadeYBolinha = 8;
let raqueteDiametro = 120;  // Ajuste o tamanho da raquete
let raqueteRaio = raqueteDiametro / 2;

// Variáveis da raquete
let xRaquete = 10;
let yRaquete = 240;

// Variáveis do oponente
let xRaqueteOponente = 665;
let yRaqueteOponente; // Será ajustado no setup()
let velocidadeYOponente;

let colidiu = false;

// Placar do jogo
let meusPontos = 0;
let pontosDoOponente = 0;

function preload() {
  // Carregando as imagens e sons
  imgRaquete = loadImage('Thadeu.png');  // Imagem da sua raquete
  imgRaqueteOponente = loadImage('Lucca.png');  // Imagem da raquete do oponente
  somColisao = loadSound('colisao.mp3');
  somPonto = loadSound('ponto.mp3');
  somFundo = loadSound('fundo.mp3');
}

function setup() {
  createCanvas(800, 600);
  somFundo.loop();

  // Posição inicial mais centralizada para a raquete do oponente
  yRaqueteOponente = height / 2 - raqueteDiametro / 2;

  // Inicializa variável de toque
  toqueY = height / 2;
}

function draw() {
  background(0);
  mostraBolinha();
  movimentaBolinha();
  verificaColisaoBorda();
  mostraRaquete(xRaquete, yRaquete, imgRaquete);  // Sua raquete
  movimentaMinhaRaquete();
  verificaColisaoRaquete(xRaquete, yRaquete);
  mostraRaquete(xRaqueteOponente, yRaqueteOponente, imgRaqueteOponente);  // Raquete do oponente
  movimentaRaqueteOponente();
  verificaColisaoRaquete(xRaqueteOponente, yRaqueteOponente);
  incluiPlacar();
  marcaPonto();
}

function mostraBolinha() {
  circle(xBolinha, yBolinha, diametro);
}

function movimentaBolinha() {
  xBolinha += velocidadeXBolinha;
  yBolinha += velocidadeYBolinha;
}

function verificaColisaoBorda() {
  if (xBolinha + raio > width || xBolinha - raio < 0) {
    velocidadeXBolinha *= -1;
    somColisao.play();
  }
  if (yBolinha + raio > height || yBolinha - raio < 0) {
    velocidadeYBolinha *= -1;
    somColisao.play();
  }
}

function mostraRaquete(x, y, img) {
  // Desenha a imagem da raquete como um círculo
  push();
  ellipseMode(CENTER);
  imageMode(CENTER);
  image(img, x + raqueteRaio, y + raqueteRaio, raqueteDiametro, raqueteDiametro);
  pop();
}

function movimentaMinhaRaquete() {
  // Movimentação da raquete controlada pelo toque
  yRaquete = toqueY;

  // Constrain para manter a raquete dentro dos limites
  yRaquete = constrain(yRaquete, 5, height - raqueteDiametro - 5);
}

function verificaColisaoRaquete(x, y) {
  colidiu = collideRectCircle(x, y, raqueteDiametro, raqueteDiametro, xBolinha, yBolinha, diametro);
  if (colidiu) {
    velocidadeXBolinha *= -1;
    somColisao.play();
  }
}

function movimentaRaqueteOponente() {
  let meioRaquete = raqueteDiametro / 2;
  velocidadeYOponente = yBolinha - yRaqueteOponente - meioRaquete - 30;
  yRaqueteOponente += velocidadeYOponente + chanceDeErrar;
  yRaqueteOponente = constrain(yRaqueteOponente, 5, height - raqueteDiametro - 5);
  calculaChanceDeErrar();
}

function incluiPlacar() {
  stroke(255);
  textSize(15);
  textAlign(CENTER, CENTER);
  fill(color(255, 140, 0));
  
  // Retângulos laranja para o placar
  rect(width / 4 - 12, 10, 25, 20); // Centraliza o primeiro retângulo laranja
  rect(3 * width / 4 - 12, 10, 25, 20); // Centraliza o segundo retângulo laranja
  
  // Texto dentro dos retângulos
  fill(255);
  text(meusPontos, width / 4, 20); // Nome da imagem com a primeira letra maiúscula dentro do retângulo
  text(pontosDoOponente, 3 * width / 4, 20); // Nome da imagem com a primeira letra maiúscula dentro do retângulo
  
  // Nome da raquete fora do retângulo
  textAlign(CENTER);
  text("Thadeu", width / 4, 50); // Ajuste a posição conforme necessário
  text("Lucca", 3 * width / 4, 50); // Ajuste a posição conforme necessário
}

function marcaPonto() {
  if (xBolinha > 791) {
    // Verifica se a bolinha está atrás da raquete do oponente
    if (yBolinha > yRaqueteOponente + raqueteRaio || yBolinha < yRaqueteOponente - raqueteRaio) {
      meusPontos += 1;
      somPonto.play();
      reiniciaBolinha();
    }
  }
  if (xBolinha < 9) {
    // Verifica se a bolinha está atrás da sua raquete
    if (yBolinha > yRaquete + raqueteRaio || yBolinha < yRaquete - raqueteRaio) {
      pontosDoOponente += 1;
      somPonto.play();
      reiniciaBolinha();
    }
  }
}

function reiniciaBolinha() {
  xBolinha = width / 2;
  yBolinha = height / 2;
  velocidadeXBolinha *= -1;
}

function calculaChanceDeErrar() {
  if (pontosDoOponente >= meusPontos) {
    chanceDeErrar += 3;  // Aumentei o incremento
    if (chanceDeErrar >= 10) {
      chanceDeErrar = 90;  // Ajustei o limite superior
    }
  } else {
    chanceDeErrar -= 3;  // Aumentei o decremento
    if (chanceDeErrar <= 6) {
      chanceDeErrar = 80;  // Ajustei o limite inferior
    }
  }
}

function mousePressed() {
  // Atualiza a posição do toque no eixo Y
  toqueY = mouseY;
}
