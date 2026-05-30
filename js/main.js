/* ============================================================
   SANE CONSULTING — JS
   ============================================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ── HERO ENTRANCE ───────────────────────────────────── */
  function initHeroEntrance() {
    gsap.to('.sc-line', { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.2 });
    gsap.to('.hero .sc-fade', {
      opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
      stagger: 0.15, delay: 0.55
    });
  }

  /* ── HERO PARALLAX ───────────────────────────────────── */
  function initParallax() {
    gsap.to('.hero-img', {
      y: '20%',
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────────────── */
  function initScrollReveal() {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.sc-reveal, .sc-card, .sc-timeline').forEach(el => io.observe(el));
  }

  /* ── TIMELINE ACTIVE STATE ───────────────────────────── */
  function initTimeline() {
    document.querySelectorAll('.timeline-step').forEach(step => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%', end: 'bottom 30%',
        onEnter:     () => step.classList.add('active'),
        onLeave:     () => step.classList.remove('active'),
        onEnterBack: () => step.classList.add('active'),
        onLeaveBack: () => step.classList.remove('active'),
      });
    });
  }

  /* ── HEADER SCROLL ───────────────────────────────────── */
  function initHeaderScroll() {
    const header = document.getElementById('mainNav');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── MOBILE MENU ─────────────────────────────────────── */
  function initMobileMenu() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('.mobile-link').forEach(l => {
      l.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  /* ── SMOOTH ANCHOR SCROLL ────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        const target = href === '#' ? null : document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = document.getElementById('mainNav')?.offsetHeight ?? 72;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      });
    });
  }

  /* ── FORM ────────────────────────────────────────────── */
  function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.textContent = 'Lähetetty ✓';
      btn.disabled = true;
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 3000);
    });
  }

  /* ── INIT ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initHeroEntrance();
    initParallax();
    initScrollReveal();
    initTimeline();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initForm();
  });

})();
