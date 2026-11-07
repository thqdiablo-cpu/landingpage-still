/* =========================================================
   The Things I Didn't Do — interactions & motion
   GSAP + ScrollTrigger + Lenis (smooth scroll)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Config ----------
     Forms POST JSON to these URLs (e.g. Formspree, Getform, a serverless
     function). Leave empty to disable sending; the form then shows an error. */
  var FORM_ENDPOINTS = {
    contact: '',
    newsletter: ''
  };

  var GALLERY = [];
  for (var i = 1; i <= 22; i++) GALLERY.push(('0' + i).slice(-2));

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var animate = hasGsap && !reduceMotion;
  var isDesktop = function () { return window.matchMedia('(min-width: 861px)').matches; };
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  clearTimeout(window.__ttiddFallback);
  if (!animate) {
    root.classList.remove('js');
    root.classList.add('no-anim');
  }

  /* ---------- Build gallery ---------- */
  var track = document.querySelector('[data-gallery]');
  GALLERY.forEach(function (n, idx) {
    var b = document.createElement('button');
    b.className = 'shot';
    b.type = 'button';
    b.setAttribute('aria-label', 'Open behind-the-scenes photo ' + (idx + 1));
    b.dataset.index = idx;
    b.innerHTML = '<img src="assets/img/g' + n + '-sm.webp" alt="" loading="lazy" decoding="async">';
    track.appendChild(b);
  });

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (animate && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.25, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    var el = target === '#top' ? 0 : document.querySelector(target);
    if (el === null) return;
    if (lenis) lenis.scrollTo(el, { offset: el === 0 ? 0 : -60, duration: 1.6 });
    else if (el === 0) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href.length < 2) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(href);
  });

  /* ---------- Mobile menu ---------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  function closeMenu() {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });

  /* ---------- Header behaviour ---------- */
  var header = document.querySelector('.header');
  var lastY = 0;
  function onScroll(y) {
    header.classList.toggle('is-scrolled', y > 40);
    var hide = y > lastY && y > window.innerHeight * 0.6 && !nav.classList.contains('is-open');
    header.classList.toggle('is-hidden', hide);
    lastY = y;
  }
  if (lenis) lenis.on('scroll', function (l) { onScroll(l.scroll); });
  else window.addEventListener('scroll', function () { onScroll(window.scrollY); }, { passive: true });

  /* ---------- Accordion (crew departments) ---------- */
  document.querySelectorAll('.dept').forEach(function (d) {
    var summary = d.querySelector('summary');
    var list = d.querySelector('ul');
    summary.addEventListener('click', function (e) {
      if (!animate) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(list, { height: 0, opacity: 0, duration: .5, ease: 'power3.inOut', onComplete: function () { d.open = false; gsap.set(list, { clearProps: 'all' }); ScrollTrigger.refresh(); } });
      } else {
        d.open = true;
        gsap.fromTo(list, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: .6, ease: 'power3.out', onComplete: function () { gsap.set(list, { clearProps: 'all' }); ScrollTrigger.refresh(); } });
        gsap.from(list.children, { y: 12, opacity: 0, stagger: .04, duration: .5, ease: 'power2.out', delay: .1 });
      }
    });
  });

  /* ---------- Modals ---------- */
  var lastFocus = null;
  function openModal(m) {
    lastFocus = document.activeElement;
    m.hidden = false;
    if (lenis) lenis.stop();
    body.style.overflow = 'hidden';
    if (animate) {
      gsap.fromTo(m.querySelector('.modal__backdrop'), { opacity: 0 }, { opacity: 1, duration: .5, ease: 'power2.out' });
      var inner = m.querySelector('.modal__dialog, .lightbox__img');
      gsap.fromTo(inner, { opacity: 0, scale: .92, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: .8, ease: 'expo.out' });
      gsap.fromTo(m.querySelectorAll('.modal__close, .lightbox__nav, .lightbox__count'), { opacity: 0 }, { opacity: 1, duration: .5, delay: .2 });
    }
    m.querySelector('.modal__close').focus();
  }
  function closeModal(m) {
    var done = function () {
      m.hidden = true;
      body.style.overflow = '';
      if (lenis) lenis.start();
      if (lastFocus) lastFocus.focus();
    };
    var v = m.querySelector('video');
    if (v) v.pause();
    if (animate) {
      gsap.to(m.querySelector('.modal__dialog, .lightbox__img'), { opacity: 0, scale: .96, duration: .35, ease: 'power2.in' });
      gsap.to(m.querySelector('.modal__backdrop'), { opacity: 0, duration: .45, delay: .1, onComplete: done });
    } else done();
  }
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(m); });
  });
  document.addEventListener('keydown', function (e) {
    var open = document.querySelector('.modal:not([hidden])');
    if (e.key === 'Escape') { if (open) closeModal(open); closeMenu(); }
    if (open && open === lightbox) {
      if (e.key === 'ArrowRight') showShot(current + 1);
      if (e.key === 'ArrowLeft') showShot(current - 1);
    }
  });

  // Trailer
  var trailer = document.querySelector('[data-modal="trailer"]');
  var trailerVideo = trailer.querySelector('video');
  document.querySelectorAll('[data-trailer]').forEach(function (b) {
    b.addEventListener('click', function () {
      openModal(trailer);
      trailerVideo.currentTime = 0;
      var p = trailerVideo.play();
      if (p && p.catch) p.catch(function () {});
    });
  });

  // Lightbox
  var lightbox = document.querySelector('[data-modal="lightbox"]');
  var lbImg = lightbox.querySelector('.lightbox__img');
  var lbCount = lightbox.querySelector('.lightbox__count');
  var current = 0;
  function showShot(i) {
    current = (i + GALLERY.length) % GALLERY.length;
    var src = 'assets/img/g' + GALLERY[current] + '.webp';
    lbCount.textContent = (current + 1) + ' / ' + GALLERY.length;
    if (animate && !lightbox.hidden) {
      gsap.to(lbImg, { opacity: 0, x: -20, duration: .2, onComplete: function () {
        lbImg.src = src;
        gsap.fromTo(lbImg, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: .5, ease: 'power3.out' });
      } });
    } else lbImg.src = src;
  }
  track.addEventListener('click', function (e) {
    var s = e.target.closest('.shot');
    if (!s || track.dataset.dragged === '1') return;
    lightbox.hidden = true;
    showShot(+s.dataset.index);
    openModal(lightbox);
  });
  lightbox.querySelectorAll('[data-lb]').forEach(function (b) {
    b.addEventListener('click', function () { showShot(current + (+b.dataset.lb)); });
  });

  /* ---------- Forms ---------- */
  document.querySelectorAll('[data-form]').forEach(function (form) {
    var status = form.querySelector('.form__status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var valid = f.value.trim() !== '' && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        var wrap = f.closest('.field');
        if (wrap) wrap.classList.toggle('is-invalid', !valid);
        if (!valid) ok = false;
      });
      status.className = 'form__status';
      if (!ok) {
        status.textContent = 'Please fill in the required fields with a valid email.';
        status.classList.add('is-error');
        if (animate) gsap.fromTo(form, { x: -8 }, { x: 0, duration: .6, ease: 'elastic.out(1, .3)' });
        return;
      }
      var endpoint = FORM_ENDPOINTS[form.dataset.form];
      if (!endpoint) {
        status.textContent = 'Sending is not available right now. Please try again later.';
        status.classList.add('is-error');
        console.warn('[TTIDD] No endpoint configured for form "' + form.dataset.form + '" (see FORM_ENDPOINTS in js/main.js).');
        return;
      }
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      status.textContent = 'Sending…';
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          status.textContent = form.dataset.form === 'newsletter' ? 'You are subscribed. Thank you!' : 'Message sent. We will get back to you soon.';
          status.classList.add('is-ok');
          form.reset();
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please try again.';
          status.classList.add('is-error');
        })
        .then(function () { btn.disabled = false; });
    });
  });

  /* ---------- Pointer effects ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.topic').forEach(function (t) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        t.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        t.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
    if (hasGsap) {
      document.querySelectorAll('.card').forEach(function (c) {
        var rx = gsap.quickTo(c, 'rotationX', { duration: .6, ease: 'power3.out' });
        var ry = gsap.quickTo(c, 'rotationY', { duration: .6, ease: 'power3.out' });
        gsap.set(c, { transformPerspective: 900 });
        c.addEventListener('pointermove', function (e) {
          var r = c.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - .5) * 10);
          rx(-((e.clientY - r.top) / r.height - .5) * 10);
        });
        c.addEventListener('pointerleave', function () { rx(0); ry(0); });
      });
    }
  }

  if (!animate) {
    body.classList.remove('is-loading');
    track.closest('.gallery').classList.add('is-native');
    return;
  }

  /* =========================================================
     Motion
     ========================================================= */
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  /* ---------- Text splitting ---------- */
  function splitWords(el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'); o.className = 'split-word';
            var i = document.createElement('span'); i.textContent = part;
            o.appendChild(i); frag.appendChild(o);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return el.querySelectorAll('.split-word > span');
  }

  /* ---------- Preloader & hero intro ---------- */
  var pre = document.querySelector('.preloader');
  var preCount = pre.querySelector('.preloader__count span');
  var heroVideo = document.querySelector('.hero__video');
  var heroImg = document.querySelector('[data-hero="title"]');

  var heroIntro = gsap.timeline({ paused: true })
    .fromTo(heroVideo, { scale: 1.25 }, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
    .fromTo('[data-hero="eyebrow"]', { opacity: 0, y: 20, letterSpacing: '.4em' }, { opacity: 1, y: 0, letterSpacing: '.06em', duration: 1.4 }, .35)
    .fromTo(heroImg, { opacity: 1, clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power2.inOut' }, .55)
    .fromTo('[data-hero="actions"]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1 }, 1.6)
    .fromTo('[data-hero="scroll"]', { opacity: 0 }, { opacity: 1, duration: 1 }, 2.1)
    .fromTo('.header', { yPercent: -100 }, { yPercent: 0, duration: 1.2, clearProps: 'transform' }, 1.2);

  var progress = { v: 0 };
  var loaded = 0;
  var assets = [document.querySelector('.preloader__logo'), heroImg];
  var targetPct = 0;
  function bump() { loaded++; targetPct = Math.min(100, Math.round(loaded / (assets.length + 1) * 100)); }
  assets.forEach(function (img) { if (img.complete) bump(); else { img.addEventListener('load', bump, { once: true }); img.addEventListener('error', bump, { once: true }); } });
  if (heroVideo.readyState >= 2) bump(); else { heroVideo.addEventListener('loadeddata', bump, { once: true }); heroVideo.addEventListener('error', bump, { once: true }); }
  var maxWait = gsap.delayedCall(3.2, function () { targetPct = 100; });

  gsap.to('.preloader__logo', { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut', delay: .2 });
  var ticker = function () {
    progress.v += (Math.max(targetPct, Math.min(progress.v + 0.6, 90)) - progress.v) * 0.08;
    var p = Math.min(100, Math.round(progress.v));
    preCount.textContent = p;
    gsap.set('.preloader__bar span', { scaleX: progress.v / 100 });
    if (targetPct >= 100 && progress.v > 99.4) {
      gsap.ticker.remove(ticker);
      maxWait.kill();
      preCount.textContent = 100;
      finishLoading();
    }
  };
  gsap.ticker.add(ticker);

  function finishLoading() {
    gsap.timeline({ delay: .25, onComplete: function () { pre.remove(); } })
      .to('.preloader__inner', { opacity: 0, y: -20, duration: .6, ease: 'power2.in' })
      .to('.preloader__panel--top', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=.1')
      .to('.preloader__panel--bottom', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, '<')
      .add(function () { body.classList.remove('is-loading'); heroIntro.play(); }, '-=.9');
  }
  body.classList.add('is-loading');
  window.scrollTo(0, 0);

  /* ---------- Hero scroll-out ---------- */
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__content', { yPercent: -30, opacity: 0, ease: 'none' }, 0)
    .to('.hero__media', { yPercent: 25, ease: 'none' }, 0)
    .to('.hero__media', { scale: 1.1, ease: 'none' }, 0)
    .to('.hero__scroll', { opacity: 0, ease: 'none', duration: .2 }, 0);

  /* ---------- Scroll progress ---------- */
  gsap.to('.scroll-progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  /* ---------- Split headings ---------- */
  document.querySelectorAll('[data-split]').forEach(function (h) {
    var words = splitWords(h);
    gsap.fromTo(words, { yPercent: 115, rotate: 4 }, {
      yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: .06,
      scrollTrigger: { trigger: h, start: 'top 85%', once: true }
    });
  });

  /* ---------- Simple reveals ---------- */
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    var isCard = el.dataset.reveal === 'card';
    gsap.fromTo(el,
      isCard ? { opacity: 0, y: 70, scale: .96 } : { opacity: 0, y: 40 },
      { opacity: 1, y: 0, scale: 1, duration: isCard ? 1.4 : 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  document.querySelectorAll('[data-reveal-group]').forEach(function (g) {
    gsap.fromTo(g.children, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out',
      scrollTrigger: { trigger: g, start: 'top 85%', once: true }
    });
  });

  /* ---------- Staggered lists ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (list) {
    var items = list.children;
    if (list.dataset.stagger === 'cast') {
      ScrollTrigger.batch(items, {
        start: 'top 92%', once: true,
        onEnter: function (batch) {
          gsap.fromTo(batch, { opacity: 0, y: 80, clipPath: 'inset(30% 0 0 0 round 18px)' }, {
            opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0 round 18px)', duration: 1.3, ease: 'expo.out', stagger: .09,
            onComplete: function () { gsap.set(batch, { clearProps: 'clipPath' }); }
          });
          batch.forEach(function (card) {
            gsap.fromTo(card.querySelector('img'), { scale: 1.3 }, { scale: 1.04, duration: 1.8, ease: 'expo.out', clearProps: 'transform' });
          });
        }
      });
    } else {
      gsap.fromTo(items, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.1, stagger: .1, ease: 'expo.out',
        scrollTrigger: { trigger: list, start: 'top 85%', once: true }
      });
    }
  });

  /* ---------- Topic icons: gentle float ---------- */
  document.querySelectorAll('.topic img').forEach(function (img, i) {
    gsap.to(img, { y: -6, duration: 2.4 + i * .3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .2 });
  });

  /* ---------- Parallax backgrounds ---------- */
  document.querySelectorAll('.parallax-bg img').forEach(function (img) {
    var s = parseFloat(img.dataset.speed || .15) * 100;
    gsap.fromTo(img, { yPercent: -s / 2 }, {
      yPercent: s / 2, ease: 'none',
      scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- Scroll-scrubbed question ---------- */
  var q = document.querySelector('[data-scrub-words]');
  if (q) {
    var highlight = ['murders?', 'notebook?', 'imagination,'];
    q.innerHTML = q.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="w' + (highlight.indexOf(w) > -1 ? ' w--gold' : '') + '">' + w + '</span>';
    }).join(' ');
    gsap.to(q.querySelectorAll('.w'), {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: q, start: 'top 80%', end: 'bottom 45%', scrub: .6 }
    });
    gsap.fromTo(q, { scale: .94 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: q, start: 'top bottom', end: 'center center', scrub: true } });
  }

  /* ---------- Marquee reacts to scroll velocity ---------- */
  var mq = document.querySelector('.marquee__track');
  if (mq && lenis) {
    var skew = gsap.quickTo('.marquee', 'skewX', { duration: .5, ease: 'power3.out' });
    lenis.on('scroll', function (l) { skew(gsap.utils.clamp(-6, 6, l.velocity * -0.25)); });
  }

  /* ---------- Gallery: horizontal pinned scroll on desktop ---------- */
  var gallery = document.querySelector('.gallery');
  var mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', function () {
    gallery.classList.remove('is-native');
    var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tween = gsap.to(track, {
      x: function () { return -distance(); }, ease: 'none',
      scrollTrigger: {
        trigger: gallery, pin: '.gallery__pin', start: 'top top',
        end: function () { return '+=' + Math.round(distance() * 0.65); },
        scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) { gallery.style.setProperty('--p', self.progress.toFixed(4)); }
      }
    });
    track.querySelectorAll('.shot').forEach(function (s) {
      gsap.fromTo(s.querySelector('img'), { xPercent: -6, scale: 1.18 }, {
        xPercent: 6, scale: 1.18, ease: 'none',
        scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
      });
      gsap.fromTo(s, { opacity: 0, scale: .9 }, {
        opacity: 1, scale: 1, ease: 'power2.out',
        scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left 105%', end: 'left 70%', scrub: true }
      });
    });
  });
  mm.add('(max-width: 860px)', function () {
    gallery.classList.add('is-native');
    var upd = function () {
      var max = track.scrollWidth - track.clientWidth;
      gallery.style.setProperty('--p', max > 0 ? (track.scrollLeft / max).toFixed(4) : 0);
    };
    track.addEventListener('scroll', upd, { passive: true });
    return function () { track.removeEventListener('scroll', upd); };
  });

  /* ---------- Active nav link ---------- */
  document.querySelectorAll('.nav__menu a').forEach(function (a) {
    var sec = document.querySelector(a.getAttribute('href'));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: function (self) { a.classList.toggle('is-active', self.isActive); }
    });
  });

  /* ---------- Refresh after media loads ---------- */
  var refreshCall = gsap.delayedCall(.3, function () { ScrollTrigger.refresh(); }).pause();
  var queueRefresh = function () { refreshCall.restart(true); };
  window.addEventListener('load', queueRefresh);
  document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
    if (!img.complete) img.addEventListener('load', queueRefresh, { once: true });
  });
})();
