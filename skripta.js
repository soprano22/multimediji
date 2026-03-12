// Smooth scroll for anchor links
function scrollWithOffset(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      let target = document.querySelector(href);
      if (target) {
        let offset = window.innerWidth < 700 ? 74 : 82;
        let y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        // Set active state
        document.querySelectorAll('.navbar nav a').forEach(x=>x.classList.remove('active'));
        let navLink = document.querySelector('.navbar nav a[href="'+href+'"]');
        if(navLink) navLink.classList.add('active');
      }
      // Close mobile menu if open
      document.getElementById('mobile-menu').classList.remove('open');
    }
  }
  document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener("click", scrollWithOffset);
  });
  // Mobile menu logic
  document.getElementById('mobile-menu-open').onclick = function() {
    document.getElementById('mobile-menu').classList.add('open');
    document.body.style.overflow='hidden';
  }
  document.getElementById('mobile-menu-close').onclick = function() {
    document.getElementById('mobile-menu').classList.remove('open');
    document.body.style.overflow='';
  }
  // Close on mobile link click
  document.querySelectorAll('.mobile-menu .scroll-link').forEach(link=>{
    link.onclick = function() {
      document.getElementById('mobile-menu').classList.remove('open');
      document.body.style.overflow='';
    }
  });

  // Simple fade-in on scroll
  function fadeInOnScroll() {
    document.querySelectorAll('.fade-up').forEach(el=>{
      let rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight*0.95) el.classList.add('visible');
    });
  }
  document.addEventListener('scroll', fadeInOnScroll,{passive:true});
  window.addEventListener('DOMContentLoaded',fadeInOnScroll);

  // Before & After SLIDER LOGIC (range + drag, supports multiple sliders)
  (function(){
    const sliders = document.querySelectorAll('.ba-slider-container');
    if (!sliders.length) return;

    sliders.forEach(function(slider){
      const handle = slider.querySelector('.ba-slider-handle');
      const afterLayer = slider.querySelector('.ba-slider-after');
      const range = slider.querySelector('.ba-slider-range');

      function applySlider(percent) {
        percent = Math.max(0, Math.min(100, Number(percent) || 0));
        slider.style.setProperty('--slider-pos', percent + '%');
        // After je na desnoj strani: sečemo levi deo (percent%)
        if (afterLayer) afterLayer.style.clipPath = 'inset(0 0 0 ' + percent + '%)';
        if (handle) handle.style.left = percent + '%';
        if (range && range.value !== String(percent)) range.value = String(percent);
      }

      // Mouse / touch drag - pomera se samo dok držite ručku
      let dragging = false;

      function getPercentFromEvent(e) {
        const rect = slider.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clampedX = Math.max(rect.left, Math.min(rect.right, clientX));
        return ((clampedX - rect.left) / rect.width) * 100;
      }

      function startDrag(e) {
        // Drag se pokreće samo kad kliknete na ručku
        dragging = true;
        document.body.style.userSelect = 'none';
        applySlider(getPercentFromEvent(e));
      }

      function moveDrag(e) {
        if (!dragging) return;
        applySlider(getPercentFromEvent(e));
        e.preventDefault();
      }

      function stopDrag() {
        dragging = false;
        document.body.style.userSelect = '';
      }

      if (handle) {
        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag, { passive: false });
      }
      window.addEventListener('mousemove', moveDrag, { passive: false });
      window.addEventListener('touchmove', moveDrag, { passive: false });
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchend', stopDrag);

      if (range) {
        range.addEventListener('input', function (e) {
          applySlider(e.target.value);
        });
      }

      // Initialize this slider to 50%
      applySlider(range ? range.value : 50);
    });
  })();