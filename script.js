
let badgeUpdateHandler = null;

function showSection(id) {
  document.querySelectorAll('main, section').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  if (id === 'palavras') {
    startBadgeSequence();
  } else {
    stopBadgeSequence();
  }
}

function backToMenu() {
  document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));
  document.getElementById('menu-inicial').classList.remove('hidden');
  stopBadgeSequence();
}

// Modal
function abrirModal(src, legenda) {
  document.getElementById('modal-img').src = src;
  document.getElementById('modal-caption').innerText = legenda;
  document.getElementById('modal').classList.remove('hidden');
}
function fecharModal() {
  document.getElementById('modal').classList.add('hidden');
}

function startBadgeSequence() {
  stopBadgeSequence();
  const spans = document.querySelectorAll('#palavras .badges span');
  const video = document.getElementById('video-fundo');
  const intervalo = 2; // segundos
  spans.forEach(s => s.classList.remove('show'));

  badgeUpdateHandler = () => {
    const index = Math.floor(video.currentTime / intervalo) % spans.length;
    spans.forEach((s, i) => s.classList.toggle('show', i === index));
  };

  badgeUpdateHandler();
  video.addEventListener('timeupdate', badgeUpdateHandler);
}

function stopBadgeSequence() {
  const spans = document.querySelectorAll('#palavras .badges span');
  const video = document.getElementById('video-fundo');
  if (badgeUpdateHandler && video) {
    video.removeEventListener('timeupdate', badgeUpdateHandler);
    badgeUpdateHandler = null;
  }
  spans.forEach(s => s.classList.remove('show'));
}

// Quiz multipasso
const perguntas = [
  { tipo: 'radio', pergunta: 'Qual foi o lugar do nosso primeiro encontro?', opcoes: ['Taguatinga Shopping, BK', 'Parque da Cidade'] },
  { tipo: 'radio', pergunta: 'Qual é a minha comida favorita?', opcoes: ['Churrasco', 'Pizza'] },
  { tipo: 'text', pergunta: 'Tem algum mês do ano que eu gosto mais?' },
  { tipo: 'radio', pergunta: 'Qual foi o presente mais marcante que você já me deu?', opcoes: ['Carrinho da Hotwheels com uma foto nossa', 'Livro especial', 'Cartão personalizado', 'Outra lembrança'] },
  { tipo: 'text', pergunta: 'Em qual filme ou série a gente se parece mais como casal?' },
  { tipo: 'text', pergunta: 'Se eu pudesse viajar para qualquer lugar, qual seria o destino?' },
  { tipo: 'text', pergunta: 'Qual mania minha te faz rir mais?' },
  { tipo: 'text', pergunta: 'Qual anime marcou o início da nossa jornada?', placeholder: 'Spy Family' },
  { tipo: 'date', pergunta: 'Quando é nosso “aniversário”?' },
  { tipo: 'text', pergunta: 'Qual frase ou palavra eu sempre digo pra te provocar?' }
];

let etapaAtual = 0;

function carregarQuiz() {
  mostrarPergunta();
}

function mostrarPergunta() {
  const form = document.getElementById('quiz-form');
  form.innerHTML = '';
  const p = perguntas[etapaAtual];

  const div = document.createElement('div');
  div.classList.add('pergunta');

  const label = document.createElement('label');
  label.innerText = p.pergunta;
  div.appendChild(label);

  if (p.tipo === 'radio') {
    p.opcoes.forEach(op => {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${etapaAtual}`;
      input.value = op;
      div.appendChild(input);
      div.appendChild(document.createTextNode(op));
      div.appendChild(document.createElement('br'));
    });
  } else {
    const input = document.createElement('input');
    input.type = p.tipo === 'date' ? 'date' : 'text';
    input.name = `q${etapaAtual}`;
    if (p.placeholder) input.placeholder = p.placeholder;
    div.appendChild(input);
  }

  form.appendChild(div);

  const nav = document.createElement('div');
  nav.style.marginTop = "1em";
  nav.style.display = "flex";
  nav.style.justifyContent = "space-between";

  if (etapaAtual > 0) {
    const btnVoltar = document.createElement('button');
    btnVoltar.type = "button";
    btnVoltar.innerText = "Anterior";
    btnVoltar.onclick = () => {
      etapaAtual--;
      mostrarPergunta();
    };
    nav.appendChild(btnVoltar);
  }

  if (etapaAtual < perguntas.length - 1) {
    const btnProx = document.createElement('button');
    btnProx.type = "button";
    btnProx.innerText = "Próxima";
    btnProx.onclick = () => {
      etapaAtual++;
      mostrarPergunta();
    };
    nav.appendChild(btnProx);
  } else {
    const btnEnviar = document.createElement('button');
    btnEnviar.type = "submit";
    btnEnviar.innerText = "Enviar";
    nav.appendChild(btnEnviar);
  }

  form.appendChild(nav);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarQuiz();
  document.getElementById("quiz-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const form = document.getElementById("quiz-form");
    
    const acertos = Array.from(form.querySelectorAll("input[type='radio']:checked")).filter(input =>
      input.value.includes("Taguatinga") || input.value.includes("Pizza") || input.value.includes("Hotwheels")
    ).length;
    form.innerHTML = `<div class="quiz-completo">Quiz finalizado! 🥰<br>Sua nota: <strong>${acertos}/3</strong><br>Obrigado por responder com o coração.</div>`;
    
  });
});
