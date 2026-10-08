/* ==========================================================================
   INK HOUSE MEDIA — Global Scripts
   Version: 3.3 (In-page video modal · redirect removed)
   Vanilla JS · No dependencies
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     0. UTILITIES
     ======================================================================== */

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);

  /* ========================================================================
     1. MOBILE NAVIGATION
     ======================================================================== */

  function initMobileNav() {
    const toggle = $('.nav-toggle');
    const nav    = $('.main-nav');
    if (!toggle || !nav) return;

    const openNav = () => {
      nav.classList.add('open');
      toggle.textContent = '✕';
      toggle.setAttribute('aria-expanded', 'true');
    };

    const closeNav = () => {
      nav.classList.remove('open');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-expanded', 'false');
    };

    on(toggle, 'click', (e) => {
      e.stopPropagation();
      nav.classList.contains('open') ? closeNav() : openNav();
    });

    $$('.main-nav a').forEach(link => on(link, 'click', closeNav));

    on(document, 'click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });

    let resizeTimer;
    on(window, 'resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 720) closeNav();
      }, 150);
    });

    toggle.setAttribute('aria-expanded', 'false');
  }

  /* ========================================================================
     2. ACTIVE NAV LINK
     ======================================================================== */

  function initActiveNav() {
    const links = $$('.main-nav a');
    if (!links.length) return;

    let path = window.location.pathname.split('/').pop().toLowerCase();
    if (!path) path = 'index.html';

    links.forEach(link => {
      const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0].toLowerCase();
      if (href === path) link.classList.add('active');
    });
  }

  /* ========================================================================
     3. STICKY HEADER SHADOW
     ======================================================================== */

  function initHeaderScroll() {
    const header = $('.site-header');
    if (!header) return;

    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    on(window, 'scroll', onScroll, { passive: true });
  }

  /* ========================================================================
     4. FAQ — Dropdown Accordion
     ======================================================================== */

  function initFaq() {
    const items = $$('.faq-item');
    if (!items.length) return;

    const closeItem = (item) => {
      const panel = $('.faq-a', item);
      const btn   = $('.faq-q', item);
      if (!panel || !btn) return;
      item.classList.remove('open');
      panel.style.maxHeight = null;
      btn.setAttribute('aria-expanded', 'false');
    };

    const openItem = (item) => {
      const panel = $('.faq-a', item);
      const btn   = $('.faq-q', item);
      if (!panel || !btn) return;
      item.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    };

    items.forEach(item => {
      const btn = $('.faq-q', item);
      if (!btn) return;

      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('type', 'button');

      on(btn, 'click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(other => {
          if (other !== item && other.classList.contains('open')) closeItem(other);
        });
        isOpen ? closeItem(item) : openItem(item);
      });
    });

    let resizeTimer;
    on(window, 'resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        items.forEach(item => {
          if (!item.classList.contains('open')) return;
          const panel = $('.faq-a', item);
          if (panel) {
            panel.style.maxHeight = 'none';
            panel.style.maxHeight = panel.scrollHeight + 'px';
          }
        });
      }, 180);
    });
  }

  /* ========================================================================
     5. PORTFOLIO GENRE FILTER
     ======================================================================== */

  function initPortfolioFilter() {
    const buttons = $$('.filter-tabs button');
    const cards   = $$('[data-genre]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
      on(btn, 'click', () => {
        const filter = btn.dataset.filter || 'all';

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.genre === filter;

          if (match) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = 'none';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ========================================================================
     6. SCROLL REVEAL
     ======================================================================== */

  function initScrollReveal() {
    const els = $$('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    els.forEach(el => io.observe(el));
  }

  /* ========================================================================
     7. CONTACT FORM
     ======================================================================== */

  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    on(form, 'submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        alert('Thank you! Your request has been received. We\'ll reply within 24 hours.');
        form.reset();
        btn.textContent = original;
        btn.disabled = false;
      }, 700);
    });
  }

  /* ========================================================================
     8. NEWSLETTER FORMS
     ======================================================================== */

  function initNewsletters() {
    const forms = $$('.newsletter');
    if (!forms.length) return;

    forms.forEach(form => {
      on(form, 'submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const value = input ? input.value.trim() : '';

        if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
          alert('Please enter a valid email address.');
          return;
        }

        alert('Subscribed! Welcome to Ink House Media.');
        form.reset();
      });
    });
  }

  /* ========================================================================
     9. BACK TO TOP
     ======================================================================== */

  function initBackToTop() {
    const btn = $('.back-to-top');
    if (!btn) return;

    const onScroll = () => btn.classList.toggle('show', window.scrollY > 500);
    onScroll();
    on(window, 'scroll', onScroll, { passive: true });

    on(btn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========================================================================
     10. SMOOTH SCROLL FOR ANCHORS
     ======================================================================== */

  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(link => {
      on(link, 'click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#' || id.length < 2) return;

        const target = document.getElementById(id.slice(1));
        if (!target) return;

        e.preventDefault();
        const header = $('.site-header');
        const offset = header ? header.offsetHeight + 12 : 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: 'smooth' });
        if (history.replaceState) history.replaceState(null, '', id);
      });
    });
  }

  /* ========================================================================
     11. CURRENT YEAR
     ======================================================================== */

  function initFooterYear() {
    const slots = $$('[data-year]');
    if (!slots.length) return;
    const year = new Date().getFullYear();
    slots.forEach(el => { el.textContent = year; });
  }

  /* ========================================================================
     12. LAZY IMAGES
     ======================================================================== */

  function initLazyImages() {
    const imgs = $$('img:not([loading])');
    imgs.forEach(img => img.setAttribute('loading', 'lazy'));
  }

  /* ========================================================================
     13. EXTERNAL LINKS
     ======================================================================== */

  function initExternalLinks() {
    const host = window.location.hostname;
    $$('a[href^="http"]').forEach(link => {
      try {
        const url = new URL(link.href);
        if (url.hostname !== host && !link.target) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (_) { /* ignore */ }
    });
  }

  /* ========================================================================
     14. VIDEO MODAL — Play portfolio videos in-page
     Replaces old redirect behavior. Any element with [data-video] opens
     an in-page YouTube embed in a dark modal overlay.
     ======================================================================== */

  function initVideoModal() {
    const triggers = $$('[data-video]');
    if (!triggers.length) return;

    /* ---- Build the modal once ---- */
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Video player');
    modal.hidden = true;
    modal.innerHTML = `
      <div class="video-modal__shell">
        <button class="video-modal__close" type="button" aria-label="Close video">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="video-modal__frame"></div>
        <div class="video-modal__caption">
          <h3></h3>
          <p></p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const frame     = modal.querySelector('.video-modal__frame');
    const captionH3 = modal.querySelector('.video-modal__caption h3');
    const captionP  = modal.querySelector('.video-modal__caption p');
    const closeBtn  = modal.querySelector('.video-modal__close');

    /* ---- Convert any YouTube URL to an embed URL ---- */
    const toEmbedUrl = (url) => {
      if (!url) return null;
      let id = '';

      if (/youtu\.be\//i.test(url)) {
        id = url.split('youtu.be/')[1].split(/[?&#]/)[0];
      } else if (/[?&]v=/i.test(url)) {
        id = url.split(/[?&]v=/)[1].split(/[?&#]/)[0];
      } else if (/youtube\.com\/embed\//i.test(url)) {
        id = url.split('/embed/')[1].split(/[?&#]/)[0];
      } else if (/youtube\.com\/shorts\//i.test(url)) {
        id = url.split('/shorts/')[1].split(/[?&#]/)[0];
      } else {
        id = url.trim();
      }

      if (!id) return null;
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    };

    /* ---- Open / close ---- */
    const openModal = (url, title, subtitle) => {
      const embed = toEmbedUrl(url);
      if (!embed) return;

      frame.innerHTML = `
        <iframe
          src="${embed}"
          title="${title || 'Trailer'}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      `;

      captionH3.textContent = title || '';
      captionP.textContent  = subtitle || '';
      captionH3.style.display = title ? '' : 'none';
      captionP.style.display  = subtitle ? '' : 'none';

      modal.hidden = false;
      requestAnimationFrame(() => {
        modal.classList.add('is-open');
        document.body.classList.add('video-modal-open');
      });
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      document.body.classList.remove('video-modal-open');
      setTimeout(() => {
        modal.hidden = true;
        frame.innerHTML = ''; // stops playback
      }, 320);
    };

    /* ---- Wire up every trigger ---- */
    triggers.forEach(card => {
      const url = (card.dataset.video || '').trim();
      if (!url) return;

      card.style.cursor = 'pointer';
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
      }

      const activate = (e) => {
        if (e) e.preventDefault();
        const titleEl = card.querySelector('h3');
        const subEl   = card.querySelector('p');
        openModal(
          url,
          titleEl ? titleEl.textContent.trim() : '',
          subEl   ? subEl.textContent.trim()   : ''
        );
      };

      card.addEventListener('click', activate);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') activate(e);
      });
    });

    /* ---- Close interactions ---- */
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ========================================================================
     15. BOOK CAROUSEL — Auto-rotating
     ======================================================================== */

  function initBookCarousel() {
    const carousels = $$('.book-carousel');
    if (!carousels.length) return;

    carousels.forEach(carousel => {
      const track    = $('.book-carousel__track', carousel);
      const items    = $$('.book-carousel__item', carousel);
      const prevBtn  = $('.book-carousel__prev', carousel);
      const nextBtn  = $('.book-carousel__next', carousel);
      const dotsWrap = $('.book-carousel__dots', carousel);
      const progress = $('.book-carousel__progress-bar', carousel);

      if (!track || !items.length) return;

      const rawInterval = parseInt(carousel.dataset.interval, 10);
      const interval = Math.min(
        30000,
        Math.max(5000, isNaN(rawInterval) ? 5000 : rawInterval)
      );

      const getPerView = () => {
        if (window.innerWidth <= 420)  return 1;
        if (window.innerWidth <= 720)  return 2;
        if (window.innerWidth <= 960)  return 3;
        if (window.innerWidth <= 1080) return 4;
        return 5;
      };

      let perView = getPerView();
      let index = 0;
      let timerId = null;
      let isPaused = false;

      const totalPages = () => Math.max(1, items.length - perView + 1);

      const buildDots = () => {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        const pages = totalPages();
        for (let i = 0; i < pages; i++) {
          const dot = document.createElement('button');
          dot.className = 'book-carousel__dot' + (i === index ? ' active' : '');
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          dot.addEventListener('click', () => { goTo(i); resetTimer(); });
          dotsWrap.appendChild(dot);
        }
      };

      const updateDots = () => {
        if (!dotsWrap) return;
        const dots = $$('.book-carousel__dot', dotsWrap);
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
      };

      const goTo = (i) => {
        const pages = totalPages();
        if (i < 0) i = pages - 1;
        if (i >= pages) i = 0;
        index = i;

        const card = items[0];
        const gap = parseFloat(getComputedStyle(track).gap) || 20;
        const shift = index * (card.offsetWidth + gap);

        track.style.transform = `translateX(-${shift}px)`;
        updateDots();
      };

      const next = () => goTo(index + 1);
      const prev = () => goTo(index - 1);

      if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
      if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

      const startTimer = () => {
        stopTimer();
        timerId = setInterval(next, interval);

        if (progress) {
          progress.style.transition = 'none';
          progress.style.width = '0%';
          void progress.offsetWidth;
          progress.style.transition = `width ${interval}ms linear`;
          progress.style.width = '100%';
        }
      };

      const stopTimer = () => {
        if (timerId) clearInterval(timerId);
        timerId = null;
        if (progress) {
          progress.style.transition = 'none';
          progress.style.width = '0%';
        }
      };

      const resetTimer = () => {
        if (!isPaused) startTimer();
      };

      carousel.addEventListener('mouseenter', () => { isPaused = true; stopTimer(); });
      carousel.addEventListener('mouseleave', () => { isPaused = false; startTimer(); });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopTimer();
        else if (!isPaused) startTimer();
      });

      let touchStartX = 0;
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      carousel.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? next() : prev();
          resetTimer();
        }
      }, { passive: true });

      carousel.setAttribute('tabindex', '0');
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { next(); resetTimer(); }
        if (e.key === 'ArrowLeft')  { prev(); resetTimer(); }
      });

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const newPerView = getPerView();
          if (newPerView !== perView) {
            perView = newPerView;
            index = 0;
            buildDots();
          }
          goTo(index);
        }, 180);
      });

      buildDots();
      goTo(0);
      startTimer();
    });
  }

  /* ========================================================================
     16. WELCOME POPUP — Two-step
     ======================================================================== */

  function initWelcomePopup() {
    const popup = document.getElementById('welcomePopup');
    if (!popup) return;

    const step1 = document.getElementById('popupStep1');
    const step2 = document.getElementById('popupStep2');
    const nextBtn = popup.querySelector('[data-popup-next]');
    const closeBtns = popup.querySelectorAll('[data-popup-close]');
    const copyBtn = popup.querySelector('[data-copy-coupon]');
    const couponEl = document.getElementById('couponCode');

    const STORAGE_KEY = 'ihm_welcome_popup_seen';
    const DAYS_BEFORE_RESHOW = 3;
    const DELAY_MS = 800;
    const DISABLE_ON_PAGES = ['contact.html'];

    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (DISABLE_ON_PAGES.includes(currentPage)) return;

    try {
      const seenAt = localStorage.getItem(STORAGE_KEY);
      if (seenAt) {
        const daysSince = (Date.now() - parseInt(seenAt, 10)) / (1000 * 60 * 60 * 24);
        if (daysSince < DAYS_BEFORE_RESHOW) return;
      }
    } catch (_) {}

    const open = () => {
      popup.hidden = false;
      requestAnimationFrame(() => {
        popup.classList.add('is-open');
        document.body.classList.add('popup-open');
      });
    };

    const close = () => {
      popup.classList.remove('is-open');
      document.body.classList.remove('popup-open');
      setTimeout(() => {
        popup.hidden = true;
        if (step1) step1.style.display = '';
        if (step2) step2.style.display = 'none';
      }, 350);
      try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (_) {}
    };

    const goToStep2 = () => {
      if (step1) step1.style.display = 'none';
      if (step2) {
        step2.style.display = '';
        step2.scrollTop = 0;
      }
    };

    if (nextBtn) nextBtn.addEventListener('click', goToStep2);
    closeBtns.forEach(btn => btn.addEventListener('click', close));

    popup.addEventListener('click', (e) => {
      if (e.target === popup) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('is-open')) close();
    });

    if (copyBtn && couponEl) {
      copyBtn.addEventListener('click', async () => {
        const code = couponEl.textContent.trim();
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.textContent = 'Copied ✓';
          setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
        } catch (_) {
          const range = document.createRange();
          range.selectNode(couponEl);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          copyBtn.textContent = 'Select & copy';
        }
      });
    }

    setTimeout(open, DELAY_MS);
  }

  /* ========================================================================
     17. BOOTSTRAP
     ======================================================================== */

  function boot() {
    initMobileNav();
    initActiveNav();
    initHeaderScroll();
    initFaq();
    initPortfolioFilter();
    initScrollReveal();
    initContactForm();
    initNewsletters();
    initBackToTop();
    initSmoothAnchors();
    initFooterYear();
    initLazyImages();
    initExternalLinks();
    initVideoModal();       /* ← new: in-page player */
    initBookCarousel();
    initWelcomePopup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();