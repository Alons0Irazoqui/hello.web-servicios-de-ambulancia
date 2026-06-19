/**
 * AMBULANCIAS MÉDICAS — main.js
 * ─────────────────────────────────────────────────────────
 * Big Tech Level — JavaScript Nativo Puro
 * Sin librerías externas. Sin GSAP. Sin Anime.js.
 * Sólo JS nativo + CSS avanzado.
 * ─────────────────────────────────────────────────────────
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   MÓDULO: IMAGE FALLBACK
   ─────────────────────────────────────────────────────────
   Detecta imágenes rotas (IDs inválidos, bloqueo de CDN,
   protocolo file://) y las reemplaza automáticamente por
   imágenes de ambulancias desde loremflickr.com que no
   requieren API key ni Referer HTTP.
   ═══════════════════════════════════════════════════════════ */
(function initImageFallback() {

  /* Imágenes de ambulancias reales desde Flickr CC — sin restricciones */
  const FALLBACKS = [
    'https://loremflickr.com/800/500/ambulance,emergency?lock=10',
    'https://loremflickr.com/800/500/ambulance,rescue?lock=20',
    'https://loremflickr.com/800/500/ambulance?lock=30',
    'https://loremflickr.com/800/500/ambulance,medical?lock=40',
    'https://loremflickr.com/800/500/ambulance,emergency?lock=50',
    'https://loremflickr.com/800/500/ambulance,rescue?lock=60',
    'https://loremflickr.com/800/500/ambulance?lock=70',
    'https://loremflickr.com/800/500/ambulance,medical?lock=80',
    'https://loremflickr.com/800/500/ambulance,emergency?lock=90',
    'https://loremflickr.com/800/500/ambulance?lock=100',
    'https://loremflickr.com/800/500/ambulance,rescue?lock=110',
    'https://loremflickr.com/800/500/ambulance,medical?lock=120',
    'https://loremflickr.com/800/500/ambulance?lock=130',
    'https://loremflickr.com/800/500/ambulance,emergency?lock=140',
    'https://loremflickr.com/800/500/ambulance,rescue?lock=150',
    'https://loremflickr.com/800/500/ambulance?lock=160',
    'https://loremflickr.com/800/500/ambulance,medical?lock=170',
    'https://loremflickr.com/800/500/ambulance?lock=180',
    'https://loremflickr.com/800/500/ambulance,emergency?lock=190',
    'https://loremflickr.com/800/500/ambulance,rescue?lock=200',
    'https://loremflickr.com/800/500/ambulance?lock=210',
    'https://loremflickr.com/800/500/ambulance,medical?lock=220',
  ];

  let fallbackIndex = 0;

  function attachFallback(img, index) {
    /* Si la imagen ya está rota antes de que el script corra */
    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
      img.src = FALLBACKS[index % FALLBACKS.length];
      img.removeAttribute('srcset');
      return;
    }

    /* Listener para cuando falle al cargar */
    img.addEventListener('error', function onError() {
      img.removeEventListener('error', onError);
      img.src = FALLBACKS[index % FALLBACKS.length];
      img.removeAttribute('srcset');
    }, { once: true });
  }

  /* Ejecutar inmediatamente en las imágenes del DOM actual */
  function run() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach((img, i) => attachFallback(img, i));
  }

  /* Si el DOM ya está listo, ejecutar ahora */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();

/* ═══════════════════════════════════════════════════════════
   UTILIDADES
   ═══════════════════════════════════════════════════════════ */

/** lerp: interpolación lineal suave para animaciones fluidas */
const lerp = (a, b, t) => a + (b - a) * t;

/** clamp: limita un valor entre min y max */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Obtiene elemento del DOM de forma segura */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];


/* ═══════════════════════════════════════════════════════════
   MÓDULO: LOADER PREMIUM
   ─────────────────────────────────────────────────────────
   Secuencia:
   0ms    → Cruz SVG empieza a dibujarse
   600ms  → Fill interior de la cruz aparece
   700ms  → Texto de marca sube
   1000ms → Barra de progreso visible
   1050ms → Barra empieza a llenarse (JS animado)
   2200ms → Loader sale con slide up
   2700ms → Hero entrada comienza
   ═══════════════════════════════════════════════════════════ */
const Loader = (() => {
  let loader, progressFill, progressGlow, brandText, progressWrap, dots;

  function init() {
    loader       = $('#loader');
    progressFill = $('.loader-progress-fill');
    progressGlow = $('.loader-progress-glow');
    brandText    = $('.loader-brand-text');
    progressWrap = $('.loader-progress-wrap');
    dots         = $('.loader-dots');

    if (!loader) { HeroAnimations.play(); return; }

    /* Calcular longitud real del path de la cruz */
    const crossPath = $('.loader-cross-path');
    if (crossPath) {
      const len = crossPath.getTotalLength ? crossPath.getTotalLength() : 310;
      crossPath.style.setProperty('--cross-length', len);
      crossPath.style.strokeDasharray  = len;
      crossPath.style.strokeDashoffset = len;
    }

    _runSequence();
  }

  function _runSequence() {

    /* Fase 1 (0ms): Dibujar cruz con CSS animation */
    setTimeout(() => {
      const crossPath = $('.loader-cross-path');
      const crossFill = $('.loader-cross-fill');
      if (crossPath) {
        crossPath.style.animation = 'drawCross 0.9s cubic-bezier(0.16,1,0.3,1) forwards';
      }
      /* Fill interior */
      setTimeout(() => {
        if (crossFill) {
          crossFill.style.animation = 'fillCross 0.5s ease forwards';
        }
      }, 700);
    }, 80);

    /* Fase 2 (700ms): Texto de marca sube */
    setTimeout(() => {
      if (brandText) {
        brandText.style.animation = 'textFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards';
      }
    }, 750);

    /* Fase 3 (1000ms): Barra de progreso aparece */
    setTimeout(() => {
      if (progressWrap) {
        progressWrap.style.animation = 'textFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards';
      }
      if (dots) {
        dots.style.animation = 'textFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards 0.1s';
      }
    }, 1050);

    /* Fase 4 (1100ms): Barra se llena con rAF */
    setTimeout(() => {
      if (progressGlow) progressGlow.style.opacity = '1';
      _animateBar(1100);
    }, 1100);

    /* Fase 5 (2300ms): Loader sale hacia arriba */
    setTimeout(() => _hide(), 2300);
  }

  function _animateBar(duration) {
    if (!progressFill) return;
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = clamp(elapsed / duration, 0, 1);
      /* easeInOutQuart */
      const eased = progress < 0.5
        ? 8 * progress ** 4
        : 1 - (-2 * progress + 2) ** 4 / 2;
      const pct = eased * 100;

      progressFill.style.width = pct + '%';

      /* El glow sigue a la barra */
      if (progressGlow) {
        progressGlow.style.left = pct + '%';
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function _hide() {
    if (!loader) { HeroAnimations.play(); return; }

    /* Slide hacia arriba */
    loader.style.transition = 'transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.75s ease';
    loader.style.transform  = 'translateY(-100%)';
    loader.style.opacity    = '0';

    setTimeout(() => {
      loader.style.display = 'none';
      HeroAnimations.play(); /* ← Inicia las animaciones del Hero */
    }, 750);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: HERO ANIMATIONS
   ─────────────────────────────────────────────────────────
   Entrada secuencial tipo Big Tech usando CSS keyframes
   disparados con clases y transiciones JS.
   ═══════════════════════════════════════════════════════════ */
const HeroAnimations = (() => {

  /* Aplica animación CSS directamente a un elemento */
  function _animate(el, animStr, delay = 0) {
    if (!el) return;
    setTimeout(() => {
      el.style.animation = animStr;
      /* Asegurar que quede visible al terminar */
      el.style.opacity = '1';
    }, delay);
  }

  /* Aplica transition + transform/opacity para fade-slide */
  function _fadeSlide(el, delay = 0, fromY = 30, duration = 700) {
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = `translateY(${fromY}px)`;
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1), transform ${duration}ms cubic-bezier(0.16,1,0.3,1)`;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  }

  function play() {
    const badge      = $('#hero-badge');
    const titleLines = $$('.title-inner');
    const desc       = $('#hero-desc');
    const ctas       = $('#hero-ctas');
    const trust      = $('#hero-trust');
    const trustItems = $$('.hero-trust-item');
    const metric     = $('#hero-metric');
    const floatCards = $('#hero-float-cards');
    const miniCards  = $$('.glass-card-mini');
    const blobWrap   = $('#hero-blob-wrap');

    /* Blob — aparece desde la derecha */
    if (blobWrap) {
      blobWrap.style.opacity   = '0';
      blobWrap.style.transform = 'translateX(40px) translateY(-50%)';
      blobWrap.style.transition = 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 300ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) 300ms';
      setTimeout(() => {
        blobWrap.style.opacity   = '1';
        blobWrap.style.transform = 'translateX(0) translateY(-50%)';
      }, 300);
    }

    /* Badge — scale + fade */
    if (badge) {
      badge.style.transform  = 'scale(0.8) translateY(-10px)';
      badge.style.transition = 'opacity 0.6s cubic-bezier(0.34,1.56,0.64,1), transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
      setTimeout(() => {
        badge.style.opacity   = '1';
        badge.style.transform = 'scale(1) translateY(0)';
      }, 100);
    }

    /* Título — clip-path reveal Big Tech */
    titleLines.forEach((el, i) => {
      el.style.clipPath   = 'inset(0 0 105% 0)';
      el.style.transform  = 'translateY(24px)';
      el.style.transition = `clip-path 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.75s ease`;
      setTimeout(() => {
        el.style.opacity  = '1';
        el.style.clipPath = 'inset(0 0 0% 0)';
        el.style.transform= 'translateY(0)';
      }, 240 + i * 130);
    });

    /* Descripción */
    _fadeSlide(desc, 660, 28, 750);

    /* CTAs */
    if (ctas) {
      ctas.style.opacity = '1';
      const btns = $$('a, button', ctas);
      btns.forEach((btn, i) => {
        btn.style.opacity   = '0';
        btn.style.transform = 'translateY(24px) scale(0.95)';
        btn.style.transition = `opacity 0.6s cubic-bezier(0.34,1.56,0.64,1) ${810 + i * 90}ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${810 + i * 90}ms`;
        setTimeout(() => {
          btn.style.opacity   = '1';
          btn.style.transform = 'translateY(0) scale(1)';
        }, 810 + i * 90);
      });
    }

    /* Trust items — fade desde abajo con stagger */
    if (trust) trust.style.opacity = '1';
    trustItems.forEach((item, i) => {
      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        item.style.opacity    = '1';
        item.style.transform  = 'translateX(0)';
      }, 1040 + i * 80);
    });

    /* Métricas */
    _fadeSlide(metric, 1220, 20, 700);

    /* Mini tarjetas flotantes — stagger spring */
    if (floatCards) floatCards.style.opacity = '1';
    miniCards.forEach((card, i) => {
      card.style.transform  = 'scale(0.7) translateY(18px)';
      card.style.transition = `opacity 0.6s cubic-bezier(0.34,1.56,0.64,1) ${1380 + i * 120}ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${1380 + i * 120}ms`;
      setTimeout(() => {
        card.style.opacity   = '1';
        card.style.transform = 'scale(1) translateY(0)';
      }, 1380 + i * 120);
    });
  }

  return { play };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: CANVAS PARTICLES
   ─────────────────────────────────────────────────────────
   Partículas en forma de cruz médica que flotan
   hacia arriba. 100% nativo — Canvas API puro.
   ═══════════════════════════════════════════════════════════ */
const Particles = (() => {
  let canvas, ctx, particles = [], raf;
  const COLORS = [
    'rgba(211,47,47,0.5)',
    'rgba(25,118,210,0.38)',
    'rgba(255,255,255,0.18)',
    'rgba(211,47,47,0.28)',
  ];
  const COUNT = window.innerWidth < 768 ? 14 : 26;

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x         = Math.random() * canvas.width;
      this.y         = initial ? Math.random() * canvas.height : canvas.height + 20;
      this.size      = Math.random() * 10 + 4;
      this.speed     = Math.random() * 0.45 + 0.15;
      this.drift     = (Math.random() - 0.5) * 0.35;
      this.rotation  = Math.random() * Math.PI * 2;
      this.rotSpeed  = (Math.random() - 0.5) * 0.015;
      this.color     = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity   = 0;
      this.maxOpacity = Math.random() * 0.45 + 0.10;
      this.life      = 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      const s = this.size;
      const t = s * 0.32;
      /* Cruz médica */
      ctx.fillRect(-t, -s / 2, t * 2, s);
      ctx.fillRect(-s / 2, -t, s, t * 2);
      ctx.restore();
    }

    update() {
      this.y        -= this.speed;
      this.x        += this.drift;
      this.rotation += this.rotSpeed;
      this.life     += this.speed;

      const traveled = 1 - (this.y / canvas.height);
      if (traveled < 0.15) {
        this.opacity = (traveled / 0.15) * this.maxOpacity;
      } else if (traveled > 0.78) {
        this.opacity = ((1 - traveled) / 0.22) * this.maxOpacity;
      } else {
        this.opacity = this.maxOpacity;
      }

      if (this.y < -25) this.reset();
    }
  }

  function init() {
    canvas = $('#hero-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    _resize();
    window.addEventListener('resize', _resize, { passive: true });

    for (let i = 0; i < COUNT; i++) {
      particles.push(new Particle());
    }
    _loop();
  }

  function _resize() {
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function _loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(_loop);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: MOUSE PARALLAX & 3D TILT
   ─────────────────────────────────────────────────────────
   Efecto de profundidad: cada elemento se mueve a
   velocidad diferente en respuesta al mouse.
   Smooth lerp en rAF para movimiento fluido.
   ═══════════════════════════════════════════════════════════ */
const MouseEffects = (() => {
  /* Posición real del mouse (normalizada -1 a 1) */
  let mouseX = 0, mouseY = 0;
  /* Posición suavizada (lerp target) */
  let smoothX = 0, smoothY = 0;
  let raf;

  const LERP_SPEED = 0.055; /* Qué tan rápido sigue al mouse */

  /* Elementos con parallax */
  const PARALLAX = [
    { id: 'orb1',   speedX: -6,  speedY: -4  },
    { id: 'orb2',   speedX: 5,   speedY: 3   },
    { id: 'orb3',   speedX: 8,   speedY: 6   },
  ];
  let cachedEls = [];

  function init() {
    /* Solo en desktop */
    if (window.innerWidth < 1024) return;

    cachedEls = PARALLAX.map(p => ({
      ...p,
      el: document.getElementById(p.id)
    })).filter(p => p.el);

    window.addEventListener('mousemove', _onMouseMove, { passive: true });
    _loop();
  }

  function _onMouseMove(e) {
    /* Normalizar a -1..1 desde el centro de la ventana */
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function _loop() {
    /* Suavizar con lerp */
    smoothX = lerp(smoothX, mouseX, LERP_SPEED);
    smoothY = lerp(smoothY, mouseY, LERP_SPEED);

    /* Aplicar parallax a cada elemento */
    cachedEls.forEach(({ el, speedX, speedY }) => {
      if (!el) return;
      const tx = smoothX * speedX;
      const ty = smoothY * speedY;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    /* Parallax sutil del blob */
    const blobWrap = document.getElementById('hero-blob-wrap');
    if (blobWrap) {
      blobWrap.style.marginLeft = `${smoothX * -10}px`;
      blobWrap.style.marginTop  = `${smoothY * -8}px`;
    }

    /* 3D tilt de la imagen del hero */
    _apply3DTilt();

    raf = requestAnimationFrame(_loop);
  }

  /* Suavizado de tilt */
  let tiltX = 0, tiltY = 0;
  function _apply3DTilt() {
    const frame = $('#hero-img-frame');
    if (!frame) return;

    tiltX = lerp(tiltX, smoothY * -6,  0.08); /* Tilt vertical */
    tiltY = lerp(tiltY, smoothX *  8,  0.08); /* Tilt horizontal */

    frame.style.transform = `
      perspective(1200px)
      rotateX(${tiltX}deg)
      rotateY(${tiltY}deg)
      scale3d(1.01, 1.01, 1.01)
    `;
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: RIPPLE EFFECT
   ─────────────────────────────────────────────────────────
   Efecto de onda al hacer click en botones.
   ═══════════════════════════════════════════════════════════ */
const Ripple = (() => {
  function init() {
    $$('[data-ripple]').forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', _createRipple);
    });
  }

  function _createRipple(e) {
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x    = e.clientX - rect.left - size / 2;
    const y    = e.clientY - rect.top  - size / 2;

    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;
    btn.appendChild(wave);
    setTimeout(() => wave.remove(), 700);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: NAVBAR
   ═══════════════════════════════════════════════════════════ */
const Navbar = (() => {
  let navbar, hamburger, mobileMenu, lastScroll = 0;

  function init() {
    navbar     = $('#navbar');
    hamburger  = $('#hamburger');
    mobileMenu = $('#mobile-menu');

    if (!navbar) return;

    window.addEventListener('scroll', _onScroll, { passive: true });

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', _toggleMenu);
      /* Cerrar con links */
      $$('a', mobileMenu).forEach(a => a.addEventListener('click', _closeMenu));
    }

    /* Cerrar menú al resize */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) _closeMenu();
    });
  }

  function _onScroll() {
    const sy = window.scrollY;
    navbar.classList.toggle('scrolled', sy > 40);
    lastScroll = sy;
  }

  function _toggleMenu() {
    const open = mobileMenu.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars',  !open);
      icon.classList.toggle('fa-times', open);
    }
  }

  function _closeMenu() {
    mobileMenu.classList.remove('open');
    const icon = hamburger?.querySelector('i');
    if (icon) {
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    }
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: SCROLL REVEAL
   ─────────────────────────────────────────────────────────
   IntersectionObserver para animar elementos
   al entrar en el viewport.
   ═══════════════════════════════════════════════════════════ */
const ScrollReveal = (() => {
  function init() {
    const options = { rootMargin: '0px', threshold: 0.12 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    $$('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: TRUST BAR ANIMATION
   ─────────────────────────────────────────────────────────
   Stagger de entrada para los 4 ítems del trust bar.
   ═══════════════════════════════════════════════════════════ */
const TrustBar = (() => {
  function init() {
    const section = $('#trust-bar');
    if (!section) return;

    const items = $$('.trust-item', section);

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        items.forEach((item, i) => {
          item.style.opacity   = '0';
          item.style.transform = 'translateY(28px) scale(0.95)';
          setTimeout(() => {
            item.style.transition = `opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.34,1.56,0.64,1)`;
            item.style.opacity   = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 80 + i * 110);
        });
        obs.disconnect();
      }
    }, { threshold: 0.25 });

    obs.observe(section);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: SERVICE CARDS — STAGGER
   ═══════════════════════════════════════════════════════════ */
const ServiceCards = (() => {
  function init() {
    const section = $('#servicios');
    if (!section) return;

    const cards = $$('.service-card', section);
    cards.forEach(c => {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(50px) scale(0.95)';
    });

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = `opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)`;
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 120 + i * 130);
        });
        obs.disconnect();
      }
    }, { threshold: 0.10 });

    obs.observe(section);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: FLEET CARDS
   ═══════════════════════════════════════════════════════════ */
const FleetCards = (() => {
  function init() {
    const section = $('#unidades');
    if (!section) return;
    const cards = $$('.fleet-card', section);
    cards.forEach(c => {
      c.style.opacity   = '0';
      c.style.transform = 'scale(0.90) translateY(40px)';
    });

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = `opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.34,1.56,0.64,1)`;
            card.style.opacity   = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 100 + i * 150);
        });
        obs.disconnect();
      }
    }, { threshold: 0.10 });

    obs.observe(section);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: WHY US CARDS
   ═══════════════════════════════════════════════════════════ */
const WhyCards = (() => {
  function init() {
    const section = $('#nosotros');
    if (!section) return;
    const cards = $$('.why-card', section);
    cards.forEach(c => {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(40px)';
    });

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = `opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)`;
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, 80 + i * 140);
        });
        obs.disconnect();
      }
    }, { threshold: 0.15 });

    obs.observe(section);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: STATS COUNTER
   ─────────────────────────────────────────────────────────
   Contador numérico animado con easing al entrar
   en el viewport.
   ═══════════════════════════════════════════════════════════ */
const StatsCounter = (() => {

  function _easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function _animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const DURATION = 1800;
    let   startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      const elapsed  = ts - startTime;
      const progress = clamp(elapsed / DURATION, 0, 1);
      const eased    = _easeOutQuart(progress);
      const value    = Math.round(eased * target);
      el.textContent = value.toLocaleString('es-MX') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    const section = $('#stats');
    if (!section) return;

    const cards = $$('.stat-card', section);
    cards.forEach(c => {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(30px)';
    });

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        /* Animar entrada de cards */
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = `opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)`;
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, i * 120);
        });
        /* Disparar contadores */
        setTimeout(() => {
          $$('[data-target]', section).forEach(el => _animateCounter(el));
        }, 250);
        obs.disconnect();
      }
    }, { threshold: 0.25 });

    obs.observe(section);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: FAQ ACCORDION
   ═══════════════════════════════════════════════════════════ */
const FAQ = (() => {
  function init() {
    $$('.faq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item     = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        /* Cerrar todos */
        $$('.faq-item.active').forEach(i => i.classList.remove('active'));

        /* Abrir el clickeado si estaba cerrado */
        if (!isActive) item.classList.add('active');
      });
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: SMOOTH SCROLL
   ═══════════════════════════════════════════════════════════ */
const SmoothScroll = (() => {
  function init() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href   = a.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: GRADIENT MESH — Orbes de fondo dinámicos
   ─────────────────────────────────────────────────────────
   Los orbes del hero cambian de tamaño y posición
   sutilmente al hacer scroll.
   ═══════════════════════════════════════════════════════════ */
const GradientMesh = (() => {
  let orb1, orb2, orb3;

  function init() {
    orb1 = $('#orb1');
    orb2 = $('#orb2');
    orb3 = $('#orb3');
    if (!orb1 || !orb2) return;

    window.addEventListener('scroll', _onScroll, { passive: true });
  }

  function _onScroll() {
    const sy = window.scrollY;
    const heroH = $('#hero')?.offsetHeight || window.innerHeight;
    if (sy > heroH) return;

    const t = sy / heroH;

    /* Pequeño desplazamiento de parallax en los orbes al hacer scroll */
    if (orb1) orb1.style.transform = `translateY(${t * 60}px) scale(${1 + t * 0.15})`;
    if (orb2) orb2.style.transform = `translateY(${-t * 40}px)`;
    if (orb3) orb3.style.transform = `translateY(${t * 30}px) scale(${1 - t * 0.2})`;
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: HOVER 3D CARDS — secciones restantes
   ─────────────────────────────────────────────────────────
   Micro-tilt 3D al hacer hover en tarjetas de
   servicios, flota y "por qué elegirnos".
   ═══════════════════════════════════════════════════════════ */
const HoverTilt = (() => {
  const CARDS = '.service-card, .fleet-card, .why-card, .stat-card';
  const MAX_TILT = 6; /* grados */

  function init() {
    $$(CARDS).forEach(card => {
      card.addEventListener('mousemove', _onMove);
      card.addEventListener('mouseleave', _onLeave);
    });
  }

  function _onMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);

    const rotX = -dy * MAX_TILT;
    const rotY =  dx * MAX_TILT;

    card.style.transition = 'transform 0.1s ease';
    card.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
  }

  function _onLeave(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
    card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: BUTTON HOVER GLOW
   ─────────────────────────────────────────────────────────
   Efecto de resplandor dinámico que sigue al cursor
   dentro de los botones CTA principales.
   ═══════════════════════════════════════════════════════════ */
const ButtonGlow = (() => {
  function init() {
    $$('.btn-primary, .btn-secondary, .btn-nav').forEach(btn => {
      btn.addEventListener('mousemove', _onMove);
      btn.addEventListener('mouseleave', _onLeave);
    });
  }

  function _onMove(e) {
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    btn.style.setProperty('--glow-x', `${x}px`);
    btn.style.setProperty('--glow-y', `${y}px`);
    btn.style.backgroundImage = `radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(255,255,255,0.18) 0%, transparent 60%), ${getComputedStyle(btn).backgroundImage.replace(/radial-gradient[^,]+,?\s*/g, '') || ''}`;
  }

  function _onLeave(e) {
    const btn = e.currentTarget;
    btn.style.backgroundImage = '';
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: EVENTS SECTION — stagger imágenes
   ═══════════════════════════════════════════════════════════ */
const EventsSection = (() => {
  function init() {
    const section = $('#eventos');
    if (!section) return;

    const imgs = $$('img', section);
    imgs.forEach(img => {
      img.style.opacity   = '0';
      img.style.transform = 'scale(0.92)';
    });

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        imgs.forEach((img, i) => {
          setTimeout(() => {
            img.style.transition = `opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)`;
            img.style.opacity   = '1';
            img.style.transform = 'scale(1)';
          }, i * 180);
        });
        obs.disconnect();
      }
    }, { threshold: 0.15 });

    obs.observe(section);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: FLOATING BUTTONS — entrada suave
   ═══════════════════════════════════════════════════════════ */
const FloatBtns = (() => {
  function init() {
    const btns = $('#float-btns');
    if (!btns) return;

    btns.style.opacity   = '0';
    btns.style.transform = 'translateX(-20px)';

    setTimeout(() => {
      btns.style.transition = 'opacity 0.7s ease 0.5s, transform 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.5s';
      btns.style.opacity    = '1';
      btns.style.transform  = 'translateX(0)';
    }, 2800);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   MÓDULO: PERFORMANCE GUARD
   ─────────────────────────────────────────────────────────
   Detecta rendimiento bajo y reduce efectos en
   dispositivos con poca potencia.
   ═══════════════════════════════════════════════════════════ */
const PerfGuard = (() => {
  function check() {
    /* Navegadores que soportan deviceMemory */
    if (navigator.deviceMemory && navigator.deviceMemory < 2) {
      document.documentElement.classList.add('low-perf');
    }
    /* Detectar conexión lenta */
    if (navigator.connection) {
      const conn = navigator.connection;
      if (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {
        document.documentElement.classList.add('low-perf');
      }
    }
  }

  return { check };
})();


/* ═══════════════════════════════════════════════════════════
   BOOT — Inicialización de todos los módulos
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Comprobación de rendimiento */
  PerfGuard.check();

  /* ─ Navbar (siempre primero) */
  Navbar.init();

  /* ─ Smooth scroll */
  SmoothScroll.init();

  /* ─ Ripple en botones */
  Ripple.init();

  /* ─ FAQ accordion */
  FAQ.init();

  /* ─ Canvas de partículas del Hero */
  Particles.init();

  /* ─ Efecto de parallax con mouse (desktop) */
  MouseEffects.init();

  /* ─ Gradient mesh / parallax scroll en orbes */
  GradientMesh.init();

  /* ─ Scroll reveal genérico (.reveal, .reveal-left, .reveal-right) */
  ScrollReveal.init();

  /* ─ Trust bar animada */
  TrustBar.init();

  /* ─ Stagger de cada sección */
  ServiceCards.init();
  FleetCards.init();
  WhyCards.init();
  EventsSection.init();

  /* ─ Contadores de estadísticas */
  StatsCounter.init();

  /* ─ Hover 3D en cards */
  HoverTilt.init();

  /* ─ Botones flotantes */
  FloatBtns.init();

  /* ─ LOADER (siempre al final — dispara Hero anim al terminar) */
  Loader.init();

});
