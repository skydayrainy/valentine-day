// ===============================
// Valentine interactive script
// ===============================

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const confettiCanvas = document.getElementById('confettiCanvas');

// -------------------------------
// NO button always runs away
// -------------------------------
function moveNoButton() {
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  const padding = 20;

  const maxX = window.innerWidth - btnWidth - padding;
  const maxY = window.innerHeight - btnHeight - padding;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.position = 'fixed';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

// убегает при наведении (ПК)
noBtn.addEventListener('mouseenter', moveNoButton);

// убегает при попытке нажать (телефон)
noBtn.addEventListener('touchstart', moveNoButton);

// -------------------------------
// YES button logic
// -------------------------------
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

// -------------------------------
// Confetti animation
// -------------------------------
function startConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const pieces = [];
  const colors = [
    '#ff4d7e',
    '#ffb3c7',
    '#ffd6e0',
    '#ffd27a',
    '#ffc17a',
    '#a6ffcb'
  ];

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
      speed: random(1, 3),
      rotate: random(-0.05, 0.05)
    });
  }

  let frames = 0;

  function loop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (const p of pieces) {
      p.y += p.speed;
      p.x += Math.sin(p.r);
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

  setTimeout(() => {
    title.textContent = original;
  }, 1600);
});
