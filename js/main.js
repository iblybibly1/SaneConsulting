/* ============================================================
   SANE CONSULTING — JS
   Smooth scroll, GSAP animations, cursor, parallax, counters
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. REGISTER SCROLLTRIGGER ───────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── 2. LOADER ───────────────────────────────────────── */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('hidden');
      runHeroEntrance();
    }, 1650);
  }

  /* ── 3. HERO ENTRANCE ────────────────────────────────── */
  function runHeroEntrance() {
    const heading = document.querySelector('.hero-heading');
    if (heading) {
      const lines = heading.querySelectorAll('.reveal-line');
      lines.forEach(line => {
        const inner = document.createElement('span');
        inner.className = 'reveal-line-inner';
        while (line.firstChild) inner.appendChild(line.firstChild);
        line.appendChild(inner);
      });

      gsap.fromTo('.hero-heading .reveal-line-inner',
        { y: '110%' },
        { y: '0%', stagger: 0.13, duration: 1.15, ease: 'power4.out', delay: 0.1 }
      );
    }

    const overline = document.querySelector('.hero-text .overline');
    if (overline) {
      gsap.fromTo(overline, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.05 });
    }

    document.querySelectorAll('.hero .reveal-fade').forEach(el => {
      const delay = parseFloat(el.dataset.delay) || 0;
      gsap.fromTo(el,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay }
      );
    });
  }

  /* ── 4. HERO PARALLAX ────────────────────────────────── */
  function initHeroParallax() {
    const img = document.querySelector('.hero-img');
    if (!img) return;
    gsap.to(img, {
      y: '22%',
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ── 5. SCROLL REVEAL (IntersectionObserver) ─────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll('.sc-reveal, .sc-reveal-card, .sc-timeline');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    els.forEach(el => io.observe(el));
  }

  /* ── 6. TIMELINE ACTIVE STATE ────────────────────────── */
  function initTimeline() {
    document.querySelectorAll('.timeline-step').forEach(step => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 58%',
        end: 'bottom 28%',
        onEnter:     () => step.classList.add('active'),
        onLeave:     () => step.classList.remove('active'),
        onEnterBack: () => step.classList.add('active'),
        onLeaveBack: () => step.classList.remove('active'),
      });
    });
  }

  /* ── 7. NUMBER COUNTERS ──────────────────────────────── */
  function initCounters() {
    document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
      const target = parseInt(counter.dataset.count, 10);
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 88%',
        once: true,
        onEnter() {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.9,
            ease: 'power2.out',
            onUpdate() { counter.textContent = Math.round(obj.val); },
          });
        },
      });
    });
  }

  /* ── 8. HEADER SCROLL STATE ──────────────────────────── */
  function initHeaderScroll() {
    const header = document.getElementById('mainNav');
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 36);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 9. MOBILE MENU ──────────────────────────────────── */
  function initMobileMenu() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── 10. CUSTOM CURSOR ───────────────────────────────── */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = document.getElementById('cursor');
    const ring = document.getElementById('cursorFollower');
    if (!dot || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;

    (function loop() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      dot.style.cssText  = `left:${mx}px;top:${my}px`;
      ring.style.cssText = `left:${rx}px;top:${ry}px`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    const hoverSel = 'a, button, .bento-card, .tag, input, textarea';
    document.querySelectorAll(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── 11. NAV ACTIVE LINKS ────────────────────────────── */
  function initNavActive() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');

    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
          if (a) a.classList.add('active');
        }
      });
    }, { threshold: 0.4 }).observe;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
          if (a) a.classList.add('active');
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(s => io.observe(s));
  }

  /* ── 12. SMOOTH ANCHOR SCROLL ────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        const target = href === '#' ? null : document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = document.getElementById('mainNav')?.offsetHeight ?? 80;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
      });
    });
  }

  /* ── 13. FORM SUBMIT FEEDBACK ────────────────────────── */
  function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = 'Lähetetty <span class="material-symbols-outlined btn-icon">check_circle</span>';
      btn.disabled = true;
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 3200);
    });
  }

  /* ── 14. SUBTLE CARD TILT (desktop only) ─────────────── */
  function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = ((e.clientX - left) / width  - 0.5) * 5;
        const y = ((e.clientY - top)  / height - 0.5) * 5;
        card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
        card.style.transition = 'transform 0.05s linear';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  /* ── INIT ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initHeroParallax();
    initScrollReveal();
    initTimeline();
    initCounters();
    initHeaderScroll();
    initMobileMenu();
    initCursor();
    initNavActive();
    initSmoothScroll();
    initForm();
    initCardTilt();
  });

})();
