// Mensagens do seletor de humor
const moodMessages = {
  calmo: "Que bom! Cultivar a calma também é cuidar de si. Vamos manter esse espaço?",
  sobrecarregado: "Respire fundo. Dividir o peso com alguém pode tornar tudo mais leve.",
  estressado: "O estresse é um sinal, não uma sentença. Existem caminhos para aliviar.",
  esperancoso: "A esperança é um ótimo ponto de partida para transformar sua rotina.",
  feliz: "Celebre esse momento! Terapia também é sobre fortalecer o que vai bem.",
  triste: "Sua tristeza merece acolhimento. Você não precisa enfrentá-la sozinho(a)."
};
const msg = document.querySelector('.mood__msg');
document.querySelectorAll('.mood__chips button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood__chips button').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    msg.textContent = `“${moodMessages[btn.dataset.mood]}”`;
  });
});

// Revelar ao rolar
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Contadores
const counter = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now(), dur = 1600;
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counter.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counter.observe(el));

// Menu mobile
const menuBtn = document.querySelector('.menu-btn');
const menu = document.createElement('div');
menu.className = 'mobile-menu';
menu.innerHTML = `<button class="close" aria-label="Fechar menu">✕</button>
  <a href="#inicio">Início</a><a href="#sobre">Sobre</a><a href="#servicos">Atendimentos</a>
  <a href="#valores">Valores</a><a href="#agendar">Conversa gratuita</a>`;
document.body.appendChild(menu);
const toggle = open => { menu.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open); };
menuBtn.addEventListener('click', () => toggle(true));
menu.addEventListener('click', e => { if (e.target.matches('a, .close')) toggle(false); });
