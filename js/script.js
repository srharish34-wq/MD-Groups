/* ===========================
   HERO SLIDER — hero.js
=========================== */

(function () {
  'use strict';

  /* ── Config ── */
  const AUTO_PLAY = true;
  const INTERVAL_MS = 5000;   // 5 seconds between slides

  /* ── State ── */
  let current = 0;
  let timer = null;
  let isAnim = false;

  /* ── Elements ── */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const fabTop = document.getElementById('fabTop');
  const total = slides.length;

  /* ── Go to slide ── */
  function goTo(index) {
    if (isAnim || index === current) return;
    isAnim = true;

    // Remove active from current
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    // Wrap index
    current = (index + total) % total;

    // Activate new slide
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    // Allow next transition after CSS duration (800ms)
    setTimeout(() => { isAnim = false; }, 850);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ── Auto-play ── */
  function startTimer() {
    if (!AUTO_PLAY) return;
    clearInterval(timer);
    timer = setInterval(next, INTERVAL_MS);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  /* ── Arrow buttons ── */
  nextBtn.addEventListener('click', () => { next(); startTimer(); });
  prevBtn.addEventListener('click', () => { prev(); startTimer(); });

  /* ── Dot navigation ── */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startTimer();
    });
  });

  /* ── Pause on hover ── */
  const slider = document.getElementById('heroSlider');
  slider.addEventListener('mouseenter', stopTimer);
  slider.addEventListener('mouseleave', startTimer);

  /* ── Touch / swipe support ── */
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {          // minimum swipe distance
      diff > 0 ? next() : prev();
      startTimer();
    }
  }, { passive: true });

  /* ── Keyboard navigation ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); startTimer(); }
    if (e.key === 'ArrowLeft') { prev(); startTimer(); }
  });

  /* ── Back to top button ── */
  if (fabTop) {
    fabTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Init ── */
  startTimer();

})();


/* ── FAQ accordion ── MUST be at top level, outside any (function(){})() wrapper ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const isOpen = btn.classList.contains('open');

  document.querySelectorAll('.faq-q.open').forEach(openBtn => {
    openBtn.classList.remove('open');
    openBtn.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
  });

  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}


/* ── TESTIMONIALS CAROUSEL ── */
(function () {
  const track = document.getElementById('testiTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoTimer;

  /* How many cards visible at once */
  function getVisible() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  /* Total number of "pages" */
  function maxIndex() {
    return total - getVisible();
  }

  /* Build dots */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'testi-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  /* Update dots highlight */
  function updateDots() {
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  /* Slide to index */
  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24;
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
    updateDots();
  }

  /* Auto-play */
  function startAuto() {
    autoTimer = setInterval(() => {
      goTo(current >= maxIndex() ? 0 : current + 1);
    }, 4000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  /* Touch / swipe support */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAuto();
    }
  });

  /* Rebuild on resize */
  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(current, maxIndex()));
  });

  /* Init */
  buildDots();
  goTo(0);
  startAuto();

})();