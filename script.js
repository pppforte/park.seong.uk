/**
 * script.js — park.seong.uk
 * Vanilla JS, progressive enhancement, no external dependencies.
 */

(function () {
  'use strict';

  /* ── Theme ──────────────────────────────────────────────────── */
  var THEME_KEY = 'psu-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (_) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
  }

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    var theme = stored ? stored : getSystemTheme();
    applyTheme(theme);
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  }

  // Listen for system preference changes (when no manual override)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  /* ── Scroll: header shadow ───────────────────────────────────── */
  function initHeaderScroll() {
    var header = document.querySelector('.header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 16) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Menu ─────────────────────────────────────────────── */
  function initMobileMenu() {
    var btn = document.getElementById('hamburger');
    var nav = document.getElementById('mobile-nav');
    if (!btn || !nav) return;

    function close() {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }

    function open() {
      btn.setAttribute('aria-expanded', 'true');
      nav.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        close();
      } else {
        open();
      }
    });

    // Close when a link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        close();
        btn.focus();
      }
    });

    // Close on resize past breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        close();
      }
    });
  }

  /* ── Smooth Scroll ───────────────────────────────────────────── */
  function initSmoothScroll() {
    var HEADER_HEIGHT = 64;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id = this.getAttribute('href').slice(1);
        var target = id ? document.getElementById(id) : null;
        if (!target) return;

        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
        window.scrollTo({ top: top, behavior: 'smooth' });

        // Move focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ── Intersection Observer: fade-in ─────────────────────────── */
  function initFadeIn() {
    if (!window.IntersectionObserver) {
      // Fallback: make all visible
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Skill Bars: animate width on scroll ─────────────────────── */
  function initSkillBars() {
    if (!window.IntersectionObserver) return;

    var bars = document.querySelectorAll('.skill-bar');
    if (!bars.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var bar = entry.target;
            var width = bar.dataset.width || '80%';
            bar.style.width = width;
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach(function (bar) {
      bar.style.width = '0';
      observer.observe(bar);
    });
  }

  /* ── Active nav link on scroll ───────────────────────────────── */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    if (!window.IntersectionObserver) return;

    var active = null;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              var match = link.getAttribute('href') === '#' + id;
              link.setAttribute('aria-current', match ? 'true' : 'false');
              if (match) link.style.color = 'var(--text)';
              else link.style.color = '';
            });
            active = id;
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ── Contact Form ───────────────────────────────────────────── */
  var CONTACT_API = 'https://a94l76zovf.execute-api.ap-northeast-2.amazonaws.com/prod/contact';

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var submitBtn = document.getElementById('contact-submit');
    var statusEl = document.getElementById('contact-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous status
      statusEl.className = 'form-status';
      statusEl.textContent = '';

      // Clear previous errors
      form.querySelectorAll('.form-input.error').forEach(function (el) {
        el.classList.remove('error');
      });

      var name = form.querySelector('#contact-name').value.trim();
      var email = form.querySelector('#contact-email').value.trim();
      var subject = form.querySelector('#contact-subject').value.trim();
      var message = form.querySelector('#contact-message').value.trim();

      // Validation
      var hasError = false;
      if (!name) {
        form.querySelector('#contact-name').classList.add('error');
        hasError = true;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.querySelector('#contact-email').classList.add('error');
        hasError = true;
      }
      if (!message) {
        form.querySelector('#contact-message').classList.add('error');
        hasError = true;
      }

      if (hasError) {
        statusEl.className = 'form-status error';
        statusEl.textContent = '필수 항목을 올바르게 입력해주세요.';
        return;
      }

      // Submit
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="spin"><circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-dashoffset="31.4"/></svg> 전송 중...';

      fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, subject: subject, message: message }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok) {
            statusEl.className = 'form-status success';
            statusEl.textContent = result.data.message || '메시지가 성공적으로 전송되었습니다.';
            form.reset();
          } else {
            statusEl.className = 'form-status error';
            statusEl.textContent = result.data.error || '전송에 실패했습니다. 다시 시도해주세요.';
          }
        })
        .catch(function () {
          statusEl.className = 'form-status error';
          statusEl.textContent = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg> 메시지 보내기';
        });
    });

    // Clear error on input
    form.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('input', function () {
        this.classList.remove('error');
      });
    });
  }

  /* ── Boot ────────────────────────────────────────────────────── */
  function boot() {
    // Remove no-js class once JS is running
    document.documentElement.classList.remove('no-js');

    initTheme();

    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initFadeIn();
    initSkillBars();
    initActiveNav();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
