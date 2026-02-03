const yesBtn = document.getElementById('yesBtn');
const noBtn  = document.getElementById('noBtn');
const modal  = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const confettiCanvas = document.getElementById('confettiCanvas');

const wrap = document.querySelector('.wrap');

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function moveNoButtonInsideWrap() {
  const padding = 12;

  // Ensure NO is positioned relative to the wrap
  noBtn.style.position = 'absolute';
  noBtn.style.zIndex = '50';

  const wrapRect = wrap.getBoundingClientRect();

  // Button size
  const bw = noBtn.offsetWidth || 110;
  const bh = noBtn.offsetHeight || 44;

  // Limits INSIDE wrap
  const minX = padding;
  const minY = padding;
  const maxX = Math.max(minX, wrapRect.width  - bw - padding);
  const maxY = Math.max(minY, wrapRect.height - bh - padding);

  // Random point inside wrap
  const x = clamp(Math.floor(Math.random() * (maxX - minX + 1)) + minX, minX, maxX);
  const y = clamp(Math.floor(Math.random() * (maxY - minY + 1)) + minY, minY, maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

// ПК: навёл — убежала
noBtn.addEventListener('pointerenter', moveNoButtonInsideWrap);

// Телефон/ПК: попытался нажать — убежала
noBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  moveNoButtonInsideWrap();
});

// iOS safety
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButtonInsideWrap();
}, { passive: false });

// Если размер меняется — пересчёт
window.addEventListener('resize', moveNoButtonInsideWrap);

// YES
yesBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  startConfetti();
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Confetti
function startConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#ff4d7e','#ffb3c7','#ffd6e0','#ffd27a','#ffc17a','#a6ffcb'];
  const rand = (min, max) => Math.random() * (max - min) + min;

  for (let i = 0; i < 140; i++) {
    pieces.push({
      x: rand(0, confettiCanvas.width),
      y: rand(-confettiCanvas.height, 0),
      w: rand(6, 12),
      h: rand(8, 16),
      color: colors[Math.floor(Math.random() * colors.length)],
      r: rand(0, Math.PI * 2),
      speed: rand(1.2, 3.2),
      rotate: rand(-0.06, 0.06)
    });
  }

  let frames = 0;

  function loop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (const p of pieces) {
      p.y += p.speed;
      p.x += Math.sin(p.r) * 0.9;
      p.r += p.rotate;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    frames++;
    if (frames < 320) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }

  loop();
}

// Easter egg
document.querySelector('.card').addEventListener('click', () => {
  const title = document.querySelector('.title');
  const original = title.textContent;
  title.textContent = "Amira, be my Valentine? 💕";
  setTimeout(() => (title.textContent = original), 1600);
});
