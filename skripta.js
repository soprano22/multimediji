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
      document.getElementById('mobile-menu').classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  
  document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener("click", scrollWithOffset);
  });
  
  // 2. Mobile menu logika
  const mobileMenu = document.getElementById('mobile-menu');
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  
  if(openBtn) {
    openBtn.onclick = function() {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  
  if(closeBtn) {
    closeBtn.onclick = function() {
      mobileMenu.classList.remove('open');
      setTimeout(() => { document.body.style.overflow = ''; }, 300);
    }
  }
  
  // 3. ScrollSpy: Podvlačenje stavki
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
  
  const spyObserver = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('section[id]').forEach(section => spyObserver.observe(section));
  
  // 4. Fade-in on scroll (SADA SE PONAVLJA)
  const fadeOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // Aktivira se malo pre nego što element dotakne dno
  };
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // UKLANJA KLASU kada element izađe iz vidokruga da bi se animacija ponovila
        entry.target.classList.remove('visible');
      }
    });
  }, fadeOptions);
  
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));
  
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
  
      if (handle) {
        handle.addEventListener('mousedown', () => dragging = true);
        handle.addEventListener('touchstart', () => dragging = true);
      }
  
      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        applySlider(getPercentFromEvent(e));
      });
  
      window.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        applySlider(getPercentFromEvent(e));
      }, { passive: false });
  
      window.addEventListener('mouseup', () => dragging = false);
      window.addEventListener('touchend', () => dragging = false);
  
      if (range) {
        range.addEventListener('input', (e) => applySlider(e.target.value));
      }
      applySlider(range ? range.value : 50);
    });
  })();