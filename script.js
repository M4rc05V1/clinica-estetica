/* ============================================================
   LUMIÈRE ESTÉTICA — script.js
   Funcionalidades:
   · Barra de progresso de scroll
   · Navbar: scroll + active link + hamburger menu
   · Animações de entrada (AOS customizado)
   · Botão WhatsApp flutuante
   · Contador animado (números da seção "Sobre")
   · Tabs de serviço (se houver)
   · Smooth scroll para âncoras
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────────────────────────────
   1. BARRA DE PROGRESSO DE SCROLL
───────────────────────────────────────── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   2. NAVBAR — scroll, active link, hamburger
───────────────────────────────────────── */
(function initNavbar() {
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  const links     = $$('.nav-link');

  /* Scrolled state */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger toggle */
  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Fechar menu ao clicar num link */
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Active link via IntersectionObserver */
  const sections = $$('section[id], #hero');
  const navIds   = links.map(l => l.getAttribute('href')?.replace('#', ''));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      if (!navIds.includes(id)) return;
      links.forEach(l => l.classList.remove('active'));
      const active = links.find(l => l.getAttribute('href') === `#${id}`);
      active?.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();

/* ─────────────────────────────────────────
   3. ANIMAÇÕES DE ENTRADA (AOS customizado)
───────────────────────────────────────── */
(function initAOS() {
  const elements = $$('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-on');
        observer.unobserve(entry.target); // anima apenas uma vez
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────
   4. WHATSAPP FLUTUANTE — aparece após scroll
───────────────────────────────────────── */
(function initWppFloat() {
  const wpp = $('#wppFloat');
  if (!wpp) return;

  const toggle = () => {
    wpp.classList.toggle('visible', window.scrollY > 300);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
})();

/* ─────────────────────────────────────────
   5. CONTADOR ANIMADO (seção Sobre / Hero trust)
───────────────────────────────────────── */
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCount = (el) => {
    const target  = parseFloat(el.dataset.count);
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const dur     = parseInt(el.dataset.dur) || 1800;
    const start   = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      const value = easeOut(progress) * target;
      const display = Number.isInteger(target)
        ? Math.round(value)
        : value.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────
   6. SMOOTH SCROLL — âncoras internas
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navbar = $('#navbar');
    const offset = navbar ? navbar.offsetHeight : 0;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────
   7. LAZY LOADING — imagens com data-src
───────────────────────────────────────── */
(function initLazyLoad() {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  imgs.forEach(img => observer.observe(img));
})();

/* ─────────────────────────────────────────
   8. CARD HOVER — efeito de brilho suave
───────────────────────────────────────── */
(function initCardGlow() {
  const cards = $$('.service-card, .dep-card, .result-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
})();

/* ─────────────────────────────────────────
   9. INIT — dispara tudo no DOMContentLoaded
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  console.log('✦ Lumière Estética — script carregado');
});