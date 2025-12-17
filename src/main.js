import './style.css'

const DISCORD_ID = '418164209755619331';

document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'J') || (e.ctrlKey && e.key === 'u')) {
    e.preventDefault(); window.location.href = "https://slumpz.lat";
  }
});

const els = {
  discordPfp: document.getElementById('discord-pfp'),
  discordName: document.getElementById('discord-username'),
  discordStatusText: document.getElementById('discord-status-text'),
  statusDot: document.getElementById('status-dot'),
  clock: document.getElementById('clock'),
  card: document.getElementById('centerCard'),
  overlay: document.getElementById('overlay'),
  audio: document.getElementById('audio'),
  typewriter: document.getElementById('typewriter-text'),
  cardCanvas: document.getElementById('card-bg'),
  cursor: document.getElementById('cursor')
};

document.addEventListener('mousemove', (e) => {
  els.cursor.style.left = e.clientX + 'px';
  els.cursor.style.top = e.clientY + 'px';
});

const links = document.querySelectorAll('.hover-link');
links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    els.cursor.classList.add('active'); 
  });
  link.addEventListener('mouseleave', () => {
    els.cursor.classList.remove('active'); 
  });
});

els.overlay.addEventListener('click', () => {
  document.body.classList.add('entered');
  
  els.overlay.classList.add('hidden');
  setTimeout(() => els.card.classList.add('visible'), 100);
  if(els.audio) { els.audio.volume = 0.125; els.audio.play().catch(e => console.log(e)); }
});

const titles = ["test1", "test2", "test3", "test4", "test5", "mortuary.lol"];
let titleIndex = 0;
setInterval(() => { document.title = titles[titleIndex]; titleIndex = (titleIndex + 1) % titles.length; }, 500);

const descriptions = ["test1", "test2", "test3"];
let descIndex = 0, charIndex = 0, isDeleting = false;
function typeWriter() {
  const currentText = descriptions[descIndex];
  if (!isDeleting) {
    els.typewriter.innerText = currentText.substring(0, charIndex + 1); charIndex++;
    if (charIndex === currentText.length) { isDeleting = true; setTimeout(typeWriter, 2000); return; }
  } else {
    els.typewriter.innerText = currentText.substring(0, charIndex - 1); charIndex--;
    if (charIndex === 0) { isDeleting = false; descIndex = (descIndex + 1) % descriptions.length; }
  }
  setTimeout(typeWriter, isDeleting ? 50 : 100);
}
typeWriter();

let mouseX = window.innerWidth / 2;
window.addEventListener('mousemove', (e) => { mouseX = e.clientX; });

const maxTilt = 15, smoothness = 0.1; 
let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
els.card.addEventListener('mousemove', (e) => {
  const boxRect = els.card.getBoundingClientRect();
  const x = e.clientX - boxRect.left;
  const y = e.clientY - boxRect.top;
  const xPct = (x / boxRect.width) - 0.5;
  const yPct = (y / boxRect.height) - 0.5;
  targetX = yPct * maxTilt; targetY = xPct * -maxTilt; 
});
els.card.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
function animateTilt() {
  currentX += (targetX - currentX) * smoothness;
  currentY += (targetY - currentY) * smoothness;
  els.card.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
  requestAnimationFrame(animateTilt);
}
animateTilt();

const snowCanvas = document.createElement('canvas');
document.body.appendChild(snowCanvas);
const ctx = snowCanvas.getContext('2d');
let width, height;
function resizeSnow() { width = window.innerWidth; height = window.innerHeight; snowCanvas.width = width; snowCanvas.height = height; }
window.addEventListener('resize', resizeSnow); resizeSnow();

class Snowflake {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.radius = Math.random() * 2 + 1; 
    this.speedY = Math.random() * 1 + 1; 
    this.opacity = Math.random() * 0.4 + 0.4;
    this.sway = Math.random() * 0.1 - 0.05; 
  }
  update() { 
    const wind = (mouseX - (width / 2)) / 300; 
    this.y += this.speedY; this.x += wind + this.sway; 
    if (this.y > height) { this.y = -10; this.x = Math.random() * width; }
    if (this.x > width) this.x = 0; if (this.x < 0) this.x = width;
  }
  draw() { ctx.beginPath(); ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); }
}
const snowflakes = [];
for (let i = 0; i < 100; i++) snowflakes.push(new Snowflake(Math.random() * width, Math.random() * height));
function animateSnow() { ctx.clearRect(0, 0, width, height); snowflakes.forEach(f => { f.update(); f.draw(); }); requestAnimationFrame(animateSnow); }
animateSnow();

const cCtx = els.cardCanvas.getContext('2d');
let cWidth = els.cardCanvas.width = els.card.offsetWidth;
let cHeight = els.cardCanvas.height = els.card.offsetHeight;

class Particle {
  constructor() {
    this.x = Math.random() * cWidth;
    this.y = Math.random() * cHeight;
    this.vx = (Math.random() - 0.5) * 1.5; 
    this.vy = (Math.random() - 0.5) * 1.5; 
    this.size = Math.random() * 1.5 + 1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > cWidth) this.vx *= -1; 
    if (this.y < 0 || this.y > cHeight) this.vy *= -1;
  }
  draw() {
    cCtx.beginPath();
    cCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    cCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    cCtx.fill();
  }
}
const particles = [];
for (let i = 0; i < 40; i++) particles.push(new Particle()); 

function animateCardParticles() {
  cCtx.clearRect(0, 0, cWidth, cHeight);
  particles.forEach((p, index) => {
    p.update(); p.draw();
    for (let j = index + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x; const dy = p.y - p2.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 80) { 
        cCtx.beginPath();
        cCtx.strokeStyle = `rgba(255, 255, 255, ${1 - dist/80})`; 
        cCtx.lineWidth = 0.5;
        cCtx.moveTo(p.x, p.y); cCtx.lineTo(p2.x, p2.y);
        cCtx.stroke();
      }
    }
  });
  requestAnimationFrame(animateCardParticles);
}
animateCardParticles();

setInterval(() => { els.clock.innerText = new Date().toLocaleTimeString(); }, 1000);
const ws = new WebSocket('wss://api.lanyard.rest/socket');
ws.onopen = () => { ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } })); };
ws.onmessage = (event) => {
  const { t, d } = JSON.parse(event.data);
  if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') render(d);
};
function render(data) {
  const user = data.discord_user;
  if (user) {
    els.discordName.innerText = `@${user.username}`;
    els.discordPfp.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  }
  const statusMap = { online: 'extra/online.png', idle: 'extra/idle.png', dnd: 'extra/dnd.png', offline: 'extra/offline.png' };
  els.statusDot.src = statusMap[data.discord_status] || statusMap.offline;
  if (data.discord_status === 'offline') els.discordStatusText.innerText = "Currently Offline";
  else if (data.listening_to_spotify) els.discordStatusText.innerText = `Listening to ${data.spotify.song}`;
  else if (data.activities && data.activities.length > 0) {
    const act = data.activities.find(a => a.type !== 4);
    const custom = data.activities.find(a => a.type === 4);
    if (act) els.discordStatusText.innerText = `Playing ${act.name}`;
    else if (custom) els.discordStatusText.innerText = custom.state;
    else els.discordStatusText.innerText = "Online";
  } else els.discordStatusText.innerText = "Online";
}