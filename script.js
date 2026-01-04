const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const page3 = document.getElementById("page3");

const openBtn = document.getElementById("openBtn");
const replayBtn = document.getElementById("replayBtn");

const envelope = document.querySelector(".envelope");
const flames = Array.from(document.querySelectorAll(".flame"));
const counter = document.getElementById("counter");

let remaining = 5;

function goTo(pageEl){
  [page1,page2,page3].forEach(p=>p.classList.remove("active"));
  pageEl.classList.add("active");
}

openBtn.addEventListener("click", () => {
  // reset biar animasinya bisa ke-trigger lagi kalau di replay
  envelope.classList.remove("open", "lift");
  void envelope.offsetWidth; // reflow

  envelope.classList.add("lift");
  envelope.classList.add("open");

  setTimeout(() => {
    goTo(page2);
    remaining = 5;
    counter.textContent = `Candles left: ${remaining}`;

    flames.forEach(f => {
      f.classList.remove("off");
      f.classList.remove("puff");
    });
  }, 900);
});

// candle click: turn off flame + smoke puff
flames.forEach((flame) => {
  flame.addEventListener("click", () => {
    if (flame.classList.contains("off")) return;

    // puff asap
    flame.classList.add("puff");

    // matiin api sedikit setelah puff mulai
    setTimeout(() => {
      flame.classList.add("off");
    }, 80);

    // bersihin puff untuk replay
    setTimeout(() => {
      flame.classList.remove("puff");
    }, 650);

    remaining -= 1;
    counter.textContent = `Candles left: ${remaining}`;

    if (remaining <= 0) {
      setTimeout(() => {
        goTo(page3);
        startConfetti();
      }, 600);
    }
  });
});

replayBtn?.addEventListener("click", () => {
  stopConfetti();
  envelope.classList.remove("open");
  envelope.classList.remove("lift");
  goTo(page1);
});

/* --- Confetti (simple canvas) --- */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confettiId = null;
let pieces = [];

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function makePieces(){
  pieces = Array.from({length: 180}).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: 4 + Math.random() * 6,
    vx: -1.5 + Math.random() * 3,
    vy: 2 + Math.random() * 4,
    a: Math.random() * Math.PI * 2,
    va: -0.12 + Math.random() * 0.24,
    c: `hsl(${Math.floor(Math.random()*360)}, 90%, 65%)`
  }));
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of pieces){
    p.x += p.vx;
    p.y += p.vy;
    p.a += p.va;

    if(p.y > canvas.height + 30){
      p.y = -30;
      p.x = Math.random() * canvas.width;
    }
    if(p.x < -30) p.x = canvas.width + 30;
    if(p.x > canvas.width + 30) p.x = -30;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.a);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.4);
    ctx.restore();
  }
  confettiId = requestAnimationFrame(draw);
}

function startConfetti(){
  makePieces();
  if(confettiId) cancelAnimationFrame(confettiId);
  draw();
}
function stopConfetti(){
  if(confettiId) cancelAnimationFrame(confettiId);
  confettiId = null;
  ctx.clearRect(0,0,canvas.width,canvas.height);
}
