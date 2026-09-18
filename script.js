document.addEventListener('DOMContentLoaded', () => {
  // Load the small, progressive enhancement layer without changing the existing markup.
  const refinementStyles = document.createElement('link');
  refinementStyles.rel = 'stylesheet';
  refinementStyles.href = 'refinements.css';
  document.head.appendChild(refinementStyles);

  /* ========== TYPING EFFECT ========== */
  const textElement = document.getElementById('typing-text');
  const texts = ['IoT solutions.', 'embedded systems.', 'smart technology.'];
  let textIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const type = () => {
    if (!textElement) return;
    const text = texts[textIndex];
    textElement.textContent = text.slice(0, characterIndex);

    if (!deleting && characterIndex === text.length) {
      deleting = true;
      setTimeout(type, 1500);
      return;
    }

    if (deleting && characterIndex === 0) {
      deleting = false;
      textIndex = (textIndex + 1) % texts.length;
    } else {
      characterIndex += deleting ? -1 : 1;
    }

    setTimeout(type, deleting ? 45 : 95);
  };
  type();

  /* ========== REVEAL ON SCROLL ========== */
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    reveals.forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight - 100) {
        section.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll();

  /* ========== ACTIVE NAV HIGHLIGHT ========== */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const updateActiveNav = () => {
    const current = sections.reduce((active, section) => (
      window.scrollY >= section.offsetTop - 180 ? section.id : active
    ), '');
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ========== SCROLL PROGRESS + BACK TO TOP ========== */
  const progressBar = document.getElementById('scroll-progress');
  const backBtn = document.getElementById('backToTop');
  const updateScrollUI = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    if (backBtn) backBtn.classList.toggle('is-visible', window.scrollY > 300);
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();
  backBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ========== MOBILE NAVIGATION ========== */
  const nav = document.querySelector('.techno-nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileLinks = document.querySelectorAll('.nav-center-links a');
  const closeNav = () => {
    nav?.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('nav-open', !expanded);
  });
  mobileLinks.forEach((link) => link.addEventListener('click', closeNav));

  /* ========== ACCESSIBLE PROJECT MODAL ========== */
  const modal = document.getElementById('projectModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const closeBtn = modal?.querySelector('.modal-close');
  let lastFocusedElement;

  const closeModal = () => {
    if (!modal) return;
    modal.style.display = 'none';
    lastFocusedElement?.focus();
  };
  const openModal = (card) => {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    if (modalImg) {
      modalImg.src = card.dataset.img || '';
      modalImg.alt = `${card.dataset.title || 'Project'} preview`;
      modalImg.onerror = () => { modalImg.style.display = 'none'; };
      modalImg.onload = () => { modalImg.style.display = 'block'; };
    }
    if (modalTitle) modalTitle.textContent = card.dataset.title || '';
    if (modalDesc) modalDesc.textContent = card.dataset.desc || '';
    if (modalTech) modalTech.textContent = `Stack: ${card.dataset.tech || 'Not specified'}`;
    modal.style.display = 'flex';
    closeBtn?.focus();
  };
  document.querySelectorAll('.project-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const activate = (event) => {
      if (event.target.closest('a')) return;
      openModal(card);
    };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate(event);
      }
    });
  });
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

  /* ========== CERTIFICATE LIGHTBOX ========== */
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const certCloseBtn = certModal?.querySelector('.cert-close');
  document.querySelectorAll('.cert-item').forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    const openCertificate = () => {
      const image = item.querySelector('img');
      if (!image || !certModal || !certModalImg) return;
      certModalImg.src = image.src;
      certModalImg.alt = image.alt || 'Certificate preview';
      certModal.style.display = 'flex';
      certCloseBtn?.focus();
    };
    item.addEventListener('click', openCertificate);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCertificate();
      }
    });
  });
  const closeCertificate = () => { if (certModal) certModal.style.display = 'none'; };
  certCloseBtn?.addEventListener('click', closeCertificate);
  certModal?.addEventListener('click', (event) => { if (event.target === certModal) closeCertificate(); });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeNav();
    if (modal?.style.display === 'flex') closeModal();
    if (certModal?.style.display === 'flex') closeCertificate();
  });
});
