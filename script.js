// script.js - interactive behaviour

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const confettiCanvas = document.getElementById('confettiCanvas');

// Move the NO button to a random position (keeps inside viewport)
function moveNoButton() {
  const rect = noBtn.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 20;

  const maxX = Math.max(0, vw - rect.width - margin);
  const maxY = Math.max(0, vh - rect.height - margin);

  const x = Math.floor(Math.random() * maxX) + margin;
  const y = Math.floor(Math.random() * maxY) + margin;

  noBtn.style.position = 'fixed';
  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';
}

// Hover on NO → it runs away
noBtn.addEventListener('mouseenter', () => {
  moveNoButton();
});

// Click YES
yesBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  startConfetti();
});

// Close modal
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Reset NO button on resize
window.addEventListener('resize', () => {
  noBtn.style.position = '';
  noBtn.style.left = '';
  noBtn.style.top = '';
});

// -----------------------------
// Confetti
// -----------------------------
function startConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#ff4d7e','#ffb3c7','#ffd6e0','#ffd27a','#ffc17a','#a6ffcb'];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: random(0, confettiCanvas.width),
      y: random(-confettiCanvas.height, 0),
      w: random(6, 12),
      h: random(8, 16),
      color: colors[Math.floor(Math.random() * colors.length)],
      r: random(0, Math.PI * 2),
      s: random(1, 3),
      rx: random(-0.05, 0.05)
    });
  }

  let frames = 0;

  function loop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (const p of pieces) {
      p.y += p.s;
      p.x += Math.sin(p.r) * 0.8;
      p.r += p.rx;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    frames++;
    if (frames < 300) {
      requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  loop();
}

// Easter egg: click card text
document.querySelector('.card').addEventListener('click', () => {
  const t = document.querySelector('.title');
  const original = t.textContent;
  t.textContent = "Assel, be my Valentine? 💕";
  setTimeout(() => {
    t.textContent = original;
  }, 1600);
});
