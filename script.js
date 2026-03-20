// =====================
// PAGE LOADER
// =====================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1400);
});

// =====================
// AUTO YEAR FOOTER
// =====================
document.getElementById('footerYear').textContent = new Date().getFullYear();

// =====================
// DARK / LIGHT TOGGLE
// =====================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '\u263E' : '\u2600\uFE0F';

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.textContent = next === 'dark' ? '\u263E' : '\u2600\uFE0F';
});

// =====================
// HAMBURGER MENU
// =====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
});
function closeNav() {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
}

// =====================
// CUSTOM CURSOR + SPARKLE TRAIL
// =====================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
const sparkleCanvas = document.getElementById('sparkle-canvas');
const sCtx = sparkleCanvas.getContext('2d');
let mx = 0, my = 0, fx = 0, fy = 0;
let sparks = [];

function resizeSparkle() {
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
}
resizeSparkle();
window.addEventListener('resize', resizeSparkle);

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
    // spawn sparkle
    for (let i = 0; i < 2; i++) {
        sparks.push({
            x: mx, y: my,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 1,
            r: Math.random() * 4 + 2,
            color: Math.random() > 0.5 ? '#a855f7' : '#ec4899'
        });
    }
});

function animateSparkles() {
    sCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    sparks = sparks.filter(s => s.life > 0);
    sparks.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        s.life -= 0.04; s.r *= 0.95;
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sCtx.fillStyle = s.color;
        sCtx.globalAlpha = s.life;
        sCtx.fill();
        sCtx.globalAlpha = 1;
    });
    requestAnimationFrame(animateSparkles);
}
animateSparkles();

function animateFollower() {
    fx += (mx - fx - 18) * 0.12;
    fy += (my - fy - 18) * 0.12;
    follower.style.transform = `translate(${fx}px, ${fy}px)`;
    requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.style.width = '52px'; follower.style.height = '52px';
        follower.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
        follower.style.width = '36px'; follower.style.height = '36px';
        follower.style.opacity = '0.5';
    });
});

// =====================
// PARTICLE BACKGROUND (HERO)
// =====================
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticle() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
resizeParticle();
window.addEventListener('resize', resizeParticle);

for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2
    });
}

function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(168,85,247,${p.opacity})`;
        pCtx.fill();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// =====================
// SCROLL REVEAL + SKILL BARS
// =====================
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
reveals.forEach(el => observer.observe(el));

// =====================
// 3D CARD TILT
// =====================
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    });
});

// =====================
// TYPING EFFECT
// =====================
const roles = ['Web Developer', 'AIML Student', 'Problem Solver', 'Creative Coder'];
let ri = 0, ci = 0, deleting = false;
const typingText = document.querySelector('.typing-text');

function type() {
    if (!typingText) return;
    const word = roles[ri];
    if (!deleting) {
        typingText.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
        typingText.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
}
setTimeout(type, 1200);

// =====================
// CONTACT FORM
// =====================
function sendMessage() {
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg = document.getElementById('fmsg').value.trim();
    if (!name || !email || !msg) { alert('Please fill in all required fields!'); return; }
    document.getElementById('form-msg').style.display = 'block';
    document.getElementById('fname').value = '';
    document.getElementById('femail').value = '';
    document.getElementById('fsubject').value = '';
    document.getElementById('fmsg').value = '';
}

// =====================
// SCROLL EVENTS
// =====================
const heroScroll = document.getElementById('heroScroll');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Hide scroll indicator
    if (heroScroll) {
        heroScroll.style.opacity = y > 60 ? '0' : '1';
        heroScroll.style.pointerEvents = y > 60 ? 'none' : 'auto';
    }

    // Back to top
    if (y > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');

    // Active nav highlight
    let current = '';
    sections.forEach(s => { if (y >= s.offsetTop - 200) current = s.id; });
    navLinks.forEach(a => {
        const href = a.getAttribute('href');
        if (href === '#' + current) a.classList.add('active');
        else a.classList.remove('active');
    });
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
