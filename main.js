/* ======================================================
   SEREMET MECAFUSION — Main SPA JavaScript
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ── Loading Screen ──
  initLoadingScreen();
  
  // ── Navigation ──
  initNavigation();
  
  // ── Scroll Animations ──
  initScrollReveal();
  
  // ── Parallax ──
  initParallax();
  
  // ── Lightbox ──
  initLightbox();
  
  // ── Contact Form ──
  initContactForm();
  
  // ── Smooth Scroll SPA ──
  initSmoothScroll();
  
  // ── Active Section Tracking ──
  initSectionTracking();
  
  // ── Cookie Consent ──
  initCookieConsent();
});


/* ═══════════════════════════════════════════
   LOADING SCREEN — "The Welding Arc"
   ═══════════════════════════════════════════ */
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  
  // Wait for assets to load or timeout after 3s
  const hideLoading = () => {
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = '';
  };
  
  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
  
  // Hide after animation completes (~2.5s) + buffer
  window.addEventListener('load', () => {
    setTimeout(hideLoading, 2800);
  });
  
  // Fallback: force hide after 4s even if not fully loaded
  setTimeout(hideLoading, 4000);
}


/* ═══════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════ */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');
  
  // Sticky navbar on scroll
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = scrollY;
  }, { passive: true });
  
  // Mobile burger toggle
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    burger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  
  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}


/* ═══════════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
   ═══════════════════════════════════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  reveals.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════
   PARALLAX EFFECT
   ═══════════════════════════════════════════ */
function initParallax() {
  const heroBg = document.getElementById('hero-bg');
  
  if (!heroBg) return;
  
  // Use transform for better performance
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = document.getElementById('hero').offsetHeight;
        
        if (scrollY < heroHeight) {
          const parallaxOffset = scrollY * 0.4;
          heroBg.style.transform = `translateY(${parallaxOffset}px) scale(1.1)`;
        }
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ═══════════════════════════════════════════
   LIGHTBOX — Full-Screen Image Viewer
   ═══════════════════════════════════════════ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  
  let currentIndex = 0;
  let visibleItems = [];
  
  function getVisibleItems() {
    return Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
  }
  
  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function updateLightbox() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-overlay h4');
    const desc = item.querySelector('.gallery-overlay p');
    
    // Add loading animation
    lightboxImg.style.opacity = '0';
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = title ? title.textContent : '';
    lightboxDesc.textContent = desc ? desc.textContent : '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    
    lightboxImg.onload = () => {
      lightboxImg.style.opacity = '1';
    };
  }
  
  function nextImage() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightbox();
  }
  
  function prevImage() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightbox();
  }
  
  // Open lightbox on gallery item click
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const visible = getVisibleItems();
      const idx = visible.indexOf(item);
      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });
  
  // Close
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Navigation
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
  });
  
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
    }
  });
  
  // Touch/swipe support for lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  }, { passive: true });
}


/* ═══════════════════════════════════════════
   SMOOTH SCROLL SPA
   ═══════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


/* ═══════════════════════════════════════════
   ACTIVE SECTION TRACKING
   ═══════════════════════════════════════════ */
function initSectionTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.dataset.section === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
}


/* ═══════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    
    if (!name || !email || !message) {
      showFormFeedback('Compila tutti i campi obbligatori *', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showFormFeedback('Inserisci un indirizzo email valido', 'error');
      return;
    }
    
    // Simulate form submission
    const submitBtn = document.getElementById('form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span style="opacity:0.7">Invio in corso...</span>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      showFormFeedback('Richiesta inviata con successo! Ti contatteremo al più presto.', 'success');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormFeedback(message, type) {
  // Remove existing feedback
  const existing = document.querySelector('.form-feedback');
  if (existing) existing.remove();
  
  const feedback = document.createElement('div');
  feedback.className = 'form-feedback';
  feedback.textContent = message;
  
  Object.assign(feedback.style, {
    padding: '12px 20px',
    marginTop: '12px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)',
    animation: 'fadeIn 0.3s ease',
    background: type === 'success' ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 80, 80, 0.1)',
    border: `1px solid ${type === 'success' ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255, 80, 80, 0.3)'}`,
    color: type === 'success' ? '#00D4FF' : '#FF5050'
  });
  
  const form = document.getElementById('contact-form');
  form.appendChild(feedback);
  
  // Auto-remove after 5s
  setTimeout(() => {
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.3s ease';
    setTimeout(() => feedback.remove(), 300);
  }, 5000);
}

/* ═══════════════════════════════════════════
   COOKIE CONSENT
   ═══════════════════════════════════════════ */
function initCookieConsent() {
  const STORAGE_KEY = 'seremet-cookie-consent';
  const CONSENT_VERSION = 1; // bump per invalidare i consensi precedenti

  const overlay = document.getElementById('cookie-overlay');
  const dialog = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  const settingsBtn = document.getElementById('cookie-settings');

  if (!overlay || !dialog || !acceptBtn || !rejectBtn) return;

  let lastFocused = null;

  function readConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.version !== CONSENT_VERSION) return null;
      if (data.status !== 'accepted' && data.status !== 'rejected') return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(status) {
    const data = { status: status, version: CONSENT_VERSION, date: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* storage non disponibile: la scelta vale solo per questa sessione */ }
    applyConsent(status);
    document.dispatchEvent(new CustomEvent('cookieconsent', { detail: data }));
  }

  function applyConsent(status) {
    // I cookie/script analitici vanno attivati solo qui, con consenso 'accepted'.
    if (status === 'accepted') {
      // loadAnalytics();
    }
  }

  function openModal() {
    lastFocused = document.activeElement;
    overlay.classList.remove('hidden');
    document.body.classList.add('cookie-lock');
    setTimeout(() => acceptBtn.focus(), 50);
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    overlay.classList.add('hidden');
    document.body.classList.remove('cookie-lock');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function onKeydown(e) {
    // Nessuna chiusura senza scelta: Esc non chiude la prima volta.
    if (e.key === 'Escape' && readConsent()) {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      // Focus trap sui pulsanti del dialog
      const focusables = dialog.querySelectorAll('button, a[href]');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  acceptBtn.addEventListener('click', () => {
    saveConsent('accepted');
    closeModal();
  });

  rejectBtn.addEventListener('click', () => {
    saveConsent('rejected');
    closeModal();
  });

  // Riapri le preferenze dal footer
  if (settingsBtn) {
    settingsBtn.addEventListener('click', openModal);
  }

  // Chiusura cliccando sullo sfondo, solo se una scelta è già stata fatta
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && readConsent()) closeModal();
  });

  const existing = readConsent();
  if (existing) {
    applyConsent(existing.status);
  } else {
    // Mostra dopo la schermata di caricamento per non sovrapporre le animazioni
    setTimeout(openModal, 3200);
  }
}
