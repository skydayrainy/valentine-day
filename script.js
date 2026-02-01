// ===============================
// Valentine interactive script
// NO runs forever + never causes scrollbars (PC + mobile)
// ===============================

const yesBtn = document.getElementById('yesBtn');
const noBtn  = document.getElementById('noBtn');
const modal  = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const confettiCanvas = document.getElementById('confettiCanvas');

noBtn.style.zIndex = '50';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// ✅ use the real visible viewport box
function viewportBox() {
  const vv = window.visualViewport;
  if (vv) {
    // vv.width/height = visible area, vv.offsetLeft/Top = shift on mobile
    return {
      left: vv.offsetLeft,
      top: vv.offsetTop,
      width: vv.width,
      height: vv.height
    };
  }
  // fallback
  return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
}

function moveNoButton() {
  const padding = 16;
  const vp = viewportBox();

  const bw = noBtn.offsetWidth  || 110;
  const bh = noBtn.offsetHeight || 44;

  const minX = vp.left + padding;
  const minY = vp.top  + padding;

  const maxX = Math.max(minX, vp.left + vp.width  - bw - padding);
  const maxY = Math.max(minY, vp.top  + vp.height - bh - padding);

  const x = clamp(
    Math.floor(Math.random() * (maxX - minX + 1)) + minX,
    minX, maxX
  );

  const y = clamp(
    Math.floor(Math.random() * (maxY - minY + 1)) + minY,
    minY, maxY
  );

  noBtn.style.position = 'fixed';
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

// ✅ works on mouse + touch
noBtn.addEventListener('pointerenter', moveNoButton);
noBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  moveNoButton();
});

// extra iOS safety
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

// keep inside on viewport changes
window.addEventListener('resize', moveNoButton);
window.visualViewport?.addEventListener('resize', moveNoButton);
window.visualViewport?.addEventListener('scroll', moveNoButton);

// YES
yesBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  startConfetti();
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// -----------------------------
// Confetti
// -----------------------------
function startConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width  = window.innerWidth;
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
  title.textContent = "Assel, be my Valentine? 💕";
  setTimeout(() => (title.textContent = original), 1600);
});
