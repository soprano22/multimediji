// 1. Smooth scroll sa offsetom
function scrollWithOffset(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = window.innerWidth < 700 ? 74 : 82;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      // Zatvaranje menija i reset skrola pozadine
      document.getElementById('mobile-menu').classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  
  document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener("click", scrollWithOffset);
  });
  
  // 2. Mobile menu logika
  const mobileMenu = document.getElementById('mobile-menu');
  
  document.getElementById('mobile-menu-open').onclick = function() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  document.getElementById('mobile-menu-close').onclick = function() {
    mobileMenu.classList.remove('open');
    setTimeout(() => { document.body.style.overflow = ''; }, 300);
  }
  
  // 3. ScrollSpy: Automatsko podvlačenje stavki dok skroluješ
  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0
  };
  
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.navbar nav a, .mobile-menu a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
  
  // 4. Fade-in on scroll
  function fadeInOnScroll() {
    document.querySelectorAll('.fade-up').forEach(el => {
      let rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) el.classList.add('visible');
    });
  }
  document.addEventListener('scroll', fadeInOnScroll, { passive: true });
  window.addEventListener('DOMContentLoaded', fadeInOnScroll);
  
  // 5. Before & After Slider Logic
  (function() {
    const sliders = document.querySelectorAll('.ba-slider-container');
    if (!sliders.length) return;
  
    sliders.forEach(function(slider) {
      const handle = slider.querySelector('.ba-slider-handle');
      const afterLayer = slider.querySelector('.ba-slider-after');
      const range = slider.querySelector('.ba-slider-range');
  
      function applySlider(percent) {
        percent = Math.max(0, Math.min(100, Number(percent) || 0));
        slider.style.setProperty('--slider-pos', percent + '%');
        if (afterLayer) afterLayer.style.clipPath = 'inset(0 0 0 ' + percent + '%)';
        if (handle) handle.style.left = percent + '%';
        if (range && range.value !== String(percent)) range.value = String(percent);
      }
  
      let dragging = false;
  
      function getPercentFromEvent(e) {
        const rect = slider.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clampedX = Math.max(rect.left, Math.min(rect.right, clientX));
        return ((clampedX - rect.left) / rect.width) * 100;
      }
  
      function startDrag(e) {
        dragging = true;
        document.body.style.userSelect = 'none';
        applySlider(getPercentFromEvent(e));
      }
  
      function moveDrag(e) {
        if (!dragging) return;
        applySlider(getPercentFromEvent(e));
      }
  
      function stopDrag() {
        dragging = false;
        document.body.style.userSelect = '';
      }
  
      if (handle) {
        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag, { passive: false });
      }
      window.addEventListener('mousemove', moveDrag);
      window.addEventListener('touchmove', moveDrag, { passive: false });
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchend', stopDrag);
  
      if (range) {
        range.addEventListener('input', function(e) {
          applySlider(e.target.value);
        });
      }
      applySlider(range ? range.value : 50);
    });
  })();