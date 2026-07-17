(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------------
     Avatar image fallback (shows an emoji placeholder until hamza.jpg exists)
  ----------------------------------------------------------------------- */
  const avatarImg = document.getElementById('avatar-img');
  const heroAvatar = document.getElementById('hero-avatar');
  avatarImg.addEventListener('error', () => heroAvatar.classList.add('no-image'), { once: true });

  /* -----------------------------------------------------------------------
     Footer year
  ----------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------------------
     Nav: scrolled state + mobile toggle
  ----------------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -----------------------------------------------------------------------
     Scroll reveal
  ----------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* -----------------------------------------------------------------------
     Hamza Meter: animate fills into view
  ----------------------------------------------------------------------- */
  const meterFills = document.querySelectorAll('.meter-fill');
  const meterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.setProperty('--fill', `${entry.target.dataset.fill}%`);
          meterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );
  meterFills.forEach((el) => meterObserver.observe(el));

  /* -----------------------------------------------------------------------
     Floating background particles (emoji)
  ----------------------------------------------------------------------- */
  const PARTICLE_EMOJIS = ['🇩🇪', '🇬🇧', '📚', '☕', '🦉', '🧠', '✨', 'Ja', 'Yes'];
  const particleContainer = document.getElementById('particles');

  function spawnParticle() {
    if (prefersReducedMotion) return;
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
    el.style.left = `${Math.random() * 100}vw`;
    const duration = 10 + Math.random() * 10;
    el.style.animationDuration = `${duration}s`;
    el.style.fontSize = `${16 + Math.random() * 16}px`;
    particleContainer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 500);
  }

  if (!prefersReducedMotion) {
    for (let i = 0; i < 8; i++) setTimeout(spawnParticle, i * 900);
    setInterval(spawnParticle, 2200);
  }

  /* -----------------------------------------------------------------------
     Random floating speech bubbles (German / English words)
  ----------------------------------------------------------------------- */
  const BUBBLE_WORDS = [
    'Achtung!', 'Ja genau', 'Innit?', 'Der... die... das?!', 'Wunderbar',
    'Actually, wait—', 'Streak +1', 'Grammatik who?', 'Cheers mate', 'Also...',
    'Basically ja', 'Confidence: 100%',
  ];
  const bubbleContainer = document.getElementById('bubbles');

  function spawnBubble() {
    if (prefersReducedMotion) return;
    const el = document.createElement('span');
    el.className = 'bubble';
    el.textContent = BUBBLE_WORDS[Math.floor(Math.random() * BUBBLE_WORDS.length)];
    el.style.left = `${8 + Math.random() * 78}vw`;
    el.style.top = `${15 + Math.random() * 65}vh`;
    bubbleContainer.appendChild(el);
    setTimeout(() => el.remove(), 6200);
  }

  if (!prefersReducedMotion) {
    setInterval(spawnBubble, 3400);
  }

  /* -----------------------------------------------------------------------
     Confetti (canvas particle burst) — triggered by "H" key or button
  ----------------------------------------------------------------------- */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  let confettiRunning = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const CONFETTI_COLORS = ['#8b5cf6', '#22d3ee', '#f472b6', '#fbbf24', '#fb7185'];

  function burstConfetti() {
    const count = 140;
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.25,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 14 - 4,
        size: 5 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 16,
        gravity: 0.35 + Math.random() * 0.2,
        life: 0,
        maxLife: 130 + Math.random() * 40,
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(animateConfetti);
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces = confettiPieces.filter((p) => p.life < p.maxLife);

    confettiPieces.forEach((p) => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.life += 1;

      const fade = 1 - p.life / p.maxLife;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(fade, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function triggerConfetti() {
    if (prefersReducedMotion) return;
    burstConfetti();
  }

  document.getElementById('confetti-btn').addEventListener('click', triggerConfetti);

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'h') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    triggerConfetti();
  });

  /* -----------------------------------------------------------------------
     Hero title click: funny shake + subtitle swap easter egg
  ----------------------------------------------------------------------- */
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const ORIGINAL_SUBTITLE = heroSubtitle.textContent;
  const SILLY_SUBTITLES = [
    'ERROR 404: Grammar Not Found',
    'Loading confidence... 100% complete',
    'Achtung! Legendary status detected',
    'Duolingo owl has left the chat',
    'Fluent in vibes, semi-fluent in everything else',
  ];
  let titleClicks = 0;

  heroTitle.addEventListener('click', () => {
    heroTitle.classList.remove('shake');
    void heroTitle.offsetWidth; // restart animation
    heroTitle.classList.add('shake');
    triggerConfetti();

    titleClicks += 1;
    heroSubtitle.textContent = SILLY_SUBTITLES[titleClicks % SILLY_SUBTITLES.length];
    clearTimeout(heroTitle._resetTimer);
    heroTitle._resetTimer = setTimeout(() => {
      heroSubtitle.textContent = ORIGINAL_SUBTITLE;
    }, 2600);
  });

  /* -----------------------------------------------------------------------
     Quotes: spotlight rotator
  ----------------------------------------------------------------------- */
  const QUOTES = [
    "Confidence is saying a German word even if you know it's probably wrong.",
    'If nobody understands you, just say it louder.',
    '"Fluent enough" is a state of mind, not a skill level.',
    "Real recognize real. Real also recognize 'der, die, das' is fake law.",
    'Duolingo can send notifications. Duolingo cannot send fear into me anymore.',
    "I didn't mispronounce it. I invented a new dialect.",
    'Grammar is a suggestion. Vibes are the actual grade.',
    'Somewhere, a German article is crying. It is not my problem.',
    'The streak must be fed. The streak is always hungry.',
  ];

  const spotlightQuote = document.getElementById('spotlight-quote');
  const newQuoteBtn = document.getElementById('new-quote-btn');
  let lastQuoteIndex = -1;

  function showRandomQuote() {
    let index;
    do {
      index = Math.floor(Math.random() * QUOTES.length);
    } while (index === lastQuoteIndex && QUOTES.length > 1);
    lastQuoteIndex = index;

    spotlightQuote.style.opacity = '0';
    setTimeout(() => {
      spotlightQuote.textContent = QUOTES[index];
      spotlightQuote.style.opacity = '1';
    }, 220);
  }

  spotlightQuote.style.transition = 'opacity 0.25s ease';
  newQuoteBtn.addEventListener('click', showRandomQuote);

  /* -----------------------------------------------------------------------
     Random motivational popup toast
  ----------------------------------------------------------------------- */
  const TOAST_MESSAGES = [
    "🔥 Hamza hasn't lost his streak. The streak lost itself trying to keep up.",
    '📢 Reminder: grammar is temporary, confidence is forever.',
    '🦉 The Duolingo owl just blinked first.',
    '🧠 Fun fact: he just switched languages mid-thought again.',
    '☕ Coffee level critical. Deploying emergency espresso.',
    "🇩🇪 Der, die, das status: still undefeated. He's working on it.",
  ];

  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  const toastClose = document.getElementById('toast-close');
  let toastTimer = null;

  function showToast() {
    if (document.hidden) return;
    const msg = TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];
    toastText.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 5200);
  }

  function hideToast() {
    toast.classList.remove('show');
  }

  toastClose.addEventListener('click', hideToast);

  setTimeout(showToast, 8000);
  setInterval(showToast, 22000);
})();
