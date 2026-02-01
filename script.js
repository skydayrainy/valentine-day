// ===============================
// Valentine interactive script
// ===============================

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const confettiCanvas = document.getElementById('confettiCanvas');

// Чтобы кнопка NO всегда была поверх карточки
noBtn.style.zIndex = '10';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// -------------------------------
// NO button always stays on-screen
// -------------------------------
function moveNoButton() {
  const padding = 16;

  // Реальные размеры кнопки (надежнее, чем getBoundingClientRect в момент анимаций)
  const btnWidth = noBtn.offsetWidth || 100;
  const btnHeight = noBtn.offsetHeight || 40;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Границы, чтобы кнопка НЕ выходила за экран
  const minX = padding;
  const minY = padding;
  const maxX = Math.max(minX, vw - btnWidth - padding);
  const maxY = Math.max(minY, vh - btnHeight - padding);

  const x = clamp(Math.floor(Math.random() * (maxX - minX + 1)) + minX, minX, maxX);
  const y = clamp(Math.floor(Math.random() * (maxY - minY + 1)) + minY, minY, maxY);

  noBtn.style.position = 'fixed';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

// На всякий случай: стартовая позиция внутри экрана
window.addEventListener('load', () => {
  // чтобы не прыгала сразу — можно закомментировать
  // moveNoButton();
});

// Pointer events — лучший вариант (мышь + тач + стилус)
noBtn.addEventListener('pointerenter', () => {
  moveNoButton();
});

// Если человек пытается нажать — тоже убегает
noBtn.addEventListener('pointerdown', (e) => {
  // На телефоне иначе может "кликнуться" или залипнуть
  e.preventDefault();
  moveNoButton();
});

// Дополнительно: на некоторых мобильных браузерах helpful
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

// -------------------------------
// YES button logic
// -------------------------------
yesBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  startConfetti();
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// При изменении размера — вернем кнопку в нормальный режим
window.addEventListener('resize', () => {
  // Можно оставить текущую позицию, но безопаснее — пересчитать
  moveNoButton();
});

// -------------------------------
// Confetti animation
// -------------------------------
function startConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#ff4d7e','#ffb3c7','#ffd6e0','#ffd27a','#ffc17a','#a6ffcb'];

  const rand = (min, max) => Math.random() * (max - min) + min;

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: rand(0, confettiCanvas.width),
      y: rand(-confettiCanvas.height, 0),
      w: rand(6, 12),
      h: rand(8, 16),
      color: colors[Math.floor(Math.random() * colors.length)],
      r: rand(0, Math.PI * 2),
      speed: rand(1, 3),
      rotate: rand(-0.05, 0.05)
    });
  }

  let frames = 0;

  function loop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (const p of pieces) {
      p.y += p.speed;
      p.x += Math.sin(p.r) * 0.8;
      p.r += p.rotate;

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

// -------------------------------
// Easter egg: click on card
// -------------------------------
document.querySelector('.card').addEventListener('click', () => {
  const title = document.querySelector('.title');
  const original = title.textContent;
  title.textContent = "Assel, be my Valentine? 💕";
  setTimeout(() => { title.textContent = original; }, 1600);
});
