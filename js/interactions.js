/**
 * interactions.js — Interactions utilisateur (Section 6 du plan)
 * 12 interactions : curseur, header intelligent, parallaxe souris,
 * modale projet & grille, carrousel mobile, onglets parcours, accordéon,
 * formulaire sans serveur, copie email, CTA magnétique, haut de page, navigation clavier.
 */

(function () {
  const content = window.CV_CONTENT;
  if (!content) return;

  // --- 6.1 Curseur personnalisé (Desktop uniquement) ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorCircle = document.getElementById('cursorCircle');
  const cursorText = document.getElementById('cursorText');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (cursorDot && cursorCircle && !isTouch) {
    let mouseX = -100, mouseY = -100;
    let circleX = -100, circleY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    // Boucle d'animation avec Lerp (0.15)
    function renderCursor() {
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;
      cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover sur liens et boutons
    const interactiveSelectors = 'a, button, select, input, textarea, .tab-btn, .cta-magnetic-card';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => cursorCircle.classList.add('is-hover-link'));
      el.addEventListener('mouseleave', () => cursorCircle.classList.remove('is-hover-link'));
    });

    // Hover sur cartes projet -> cercle "VOIR"
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        cursorCircle.classList.add('is-hover-project');
        if (cursorText) cursorText.textContent = 'VOIR';
      });
      card.addEventListener('mouseleave', () => {
        cursorCircle.classList.remove('is-hover-project');
        if (cursorText) cursorText.textContent = '';
      });
    });
  }

  // --- 6.2 Barre supérieure intelligente ---
  const header = document.getElementById('siteHeader');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 120) {
        header.classList.add('is-sticky');
        if (currentScroll > lastScroll && currentScroll > 240) {
          // Défilement vers le bas -> masquer
          header.classList.add('is-hidden');
        } else {
          // Remontée -> réafficher
          header.classList.remove('is-hidden');
        }
      } else {
        header.classList.remove('is-sticky', 'is-hidden');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- 6.3 Parallaxe à la souris (Héros, Desktop) ---
  const heroVisual = document.getElementById('heroVisual');
  const heroPortrait = document.getElementById('heroPortrait');
  const heroCircle = document.getElementById('heroCircle');

  if (heroVisual && heroPortrait && heroCircle && !isTouch) {
    let heroTargetPx = 0, heroTargetPy = 0;
    let heroCurrPx = 0, heroCurrPy = 0;

    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 à 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      heroTargetPx = nx * 20; // ±10px
      heroTargetPy = ny * 20;
    });

    heroVisual.addEventListener('mouseleave', () => {
      heroTargetPx = 0;
      heroTargetPy = 0;
    });

    function renderHeroParallax() {
      heroCurrPx += (heroTargetPx - heroCurrPx) * 0.1;
      heroCurrPy += (heroTargetPy - heroCurrPy) * 0.1;

      // Portrait suit ±10px, cercle opposé ±5px
      heroPortrait.style.transform = `translate3d(${heroCurrPx}px, ${heroCurrPy}px, 0)`;
      heroCircle.style.transform = `translate3d(${-heroCurrPx * 0.5}px, ${-heroCurrPy * 0.5}px, 0)`;

      requestAnimationFrame(renderHeroParallax);
    }
    requestAnimationFrame(renderHeroParallax);
  }

  // --- 6.4 Modale de projet (Drawer & Mode Grille) ---
  const modal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalDrawer = document.getElementById('modalDrawer');
  const modalClose = document.getElementById('modalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  const modalBody = document.getElementById('modalBody');
  const btnAllProjects = document.getElementById('btnAllProjects');

  let currentProjectIdx = 0;
  let isGridMode = false;

  function openProjectModal(indexOrSlug) {
    if (!modal) return;
    isGridMode = false;
    modalPrev.style.display = 'inline-block';
    modalNext.style.display = 'inline-block';

    if (typeof indexOrSlug === 'string') {
      currentProjectIdx = content.projects.findIndex(p => p.slug === indexOrSlug);
      if (currentProjectIdx === -1) currentProjectIdx = 0;
    } else {
      currentProjectIdx = indexOrSlug;
    }

    renderProjectDetail(currentProjectIdx);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function renderProjectDetail(idx) {
    const p = content.projects[idx];
    if (!p) return;

    modalBody.innerHTML = `
      <div class="modal-body-detail">
        <div class="modal-img-wrap">
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <div>
          <span class="modal-cat">${p.category}</span>
          <h2 class="modal-title font-display" style="margin-top: 6px;">${p.name}</h2>
          <hr class="green-bar" style="margin: 16px 0;" />
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;"><strong>${p.summary}</strong></p>
        </div>
        <div class="modal-details-list">
          ${p.details.map(d => `<p>• ${d}</p>`).join('')}
        </div>
        <div class="modal-tags">
          ${p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function openAllProjectsModal() {
    if (!modal) return;
    isGridMode = true;
    modalPrev.style.display = 'none';
    modalNext.style.display = 'none';

    modalBody.innerHTML = `
      <div class="modal-grid-container">
        <span class="section-label">PORTFOLIO COMPLET</span>
        <h2 class="modal-title font-display" style="margin: 8px 0 24px 0;">TOUS LES PROJETS</h2>
        <div class="modal-grid-wrap">
          ${content.projects.map((p, idx) => `
            <div class="modal-grid-card" data-index="${idx}" tabindex="0" role="button">
              <img src="${p.image}" alt="${p.name}" class="modal-grid-img" />
              <span class="micro-label" style="color: var(--accent);">${p.category}</span>
              <h3 style="font-size: 18px; font-weight: 700; margin-top: 4px;">${p.name}</h3>
              <p style="font-size: 13.5px; color: var(--ink-soft); margin-top: 6px;">${p.summary}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Clic sur une carte de la grille pour ouvrir son détail
    modalBody.querySelectorAll('.modal-grid-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index, 10);
        openProjectModal(idx);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(card.dataset.index, 10);
          openProjectModal(idx);
        }
      });
    });

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Écouteurs modale
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      openProjectModal(card.dataset.slug);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(card.dataset.slug);
      }
    });
  });

  if (btnAllProjects) {
    btnAllProjects.addEventListener('click', openAllProjectsModal);
  }

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  if (modalPrev) {
    modalPrev.addEventListener('click', () => {
      currentProjectIdx = (currentProjectIdx - 1 + content.projects.length) % content.projects.length;
      renderProjectDetail(currentProjectIdx);
    });
  }

  if (modalNext) {
    modalNext.addEventListener('click', () => {
      currentProjectIdx = (currentProjectIdx + 1) % content.projects.length;
      renderProjectDetail(currentProjectIdx);
    });
  }

  // Fermeture Échap & Piégeage du focus
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeProjectModal();
    }
  });

  // --- 6.5 Carrousel mobile des projets ---
  const projectsGrid = document.querySelector('.projects-grid');
  const carouselDots = document.getElementById('carouselDots');
  if (projectsGrid && carouselDots) {
    const cards = projectsGrid.querySelectorAll('.project-card');
    const dots = carouselDots.querySelectorAll('.dot');

    projectsGrid.addEventListener('scroll', () => {
      const scrollLeft = projectsGrid.scrollLeft;
      const cardWidth = cards[0] ? cards[0].offsetWidth : 1;
      const activeIdx = Math.round(scrollLeft / cardWidth);

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === Math.min(activeIdx, dots.length - 1));
      });
    }, { passive: true });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      });
    });
  }

  // --- 6.6 Onglets du parcours (Filtre expériences + glissière) ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabSlider = document.getElementById('tabSlider');
  const expItems = document.querySelectorAll('.exp-item');

  function updateTabSlider(btn) {
    if (!tabSlider || !btn) return;
    tabSlider.style.width = btn.offsetWidth + 'px';
    tabSlider.style.left = btn.offsetLeft + 'px';
  }

  // Position initiale du slider
  const initialActiveTab = document.querySelector('.tab-btn.active');
  if (initialActiveTab) updateTabSlider(initialActiveTab);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      updateTabSlider(btn);

      const cat = btn.dataset.category;

      expItems.forEach(item => {
        const itemCat = item.dataset.category;
        const matches = cat === 'all' || itemCat === cat;

        if (matches) {
          item.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(item, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          } else {
            item.style.opacity = '1';
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --- 6.7 Accordéon « Voir plus » sur les expériences ---
  document.querySelectorAll('.btn-expand-exp').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.exp-item');
      const extraList = parent.querySelector('.exp-bullets-extra');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        // Refermer
        extraList.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
        const count = extraList.querySelectorAll('li').length;
        btn.textContent = `Voir plus (${count}) ↓`;
      } else {
        // Déplier
        extraList.style.display = 'flex';
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Voir moins ↑';
        if (typeof gsap !== 'undefined') {
          gsap.from(extraList.children, {
            opacity: 0,
            y: 8,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out'
          });
        }
      }
    });
  });

  // --- 6.8 Formulaire de contact (sans serveur) ---
  const form = document.getElementById('contactForm');
  const formName = document.getElementById('formName');
  const formSubject = document.getElementById('formSubject');
  const formMessage = document.getElementById('formMessage');
  const nameError = document.getElementById('nameError');
  const messageError = document.getElementById('messageError');
  const charCounter = document.getElementById('charCounter');
  const btnSendWa = document.getElementById('btnSendWa');
  const btnSendMail = document.getElementById('btnSendMail');

  // Compteur de caractères en direct
  if (formMessage && charCounter) {
    formMessage.addEventListener('input', () => {
      const len = formMessage.value.length;
      charCounter.textContent = `${len} car.`;
    });
  }

  // Validation
  function validateForm() {
    let isValid = true;

    // Nom >= 2 car.
    if (!formName || formName.value.trim().length < 2) {
      if (nameError) nameError.textContent = 'Veuillez entrer au moins 2 caractères.';
      if (formName) formName.classList.add('is-invalid');
      isValid = false;
    } else {
      if (nameError) nameError.textContent = '';
      if (formName) formName.classList.remove('is-invalid');
    }

    // Message >= 10 car.
    if (!formMessage || formMessage.value.trim().length < 10) {
      if (messageError) messageError.textContent = 'Votre message doit comporter au moins 10 caractères.';
      if (formMessage) formMessage.classList.add('is-invalid');
      isValid = false;
    } else {
      if (messageError) messageError.textContent = '';
      if (formMessage) formMessage.classList.remove('is-invalid');
    }

    return isValid;
  }

  // Nettoyage des erreurs à la frappe
  if (formName) {
    formName.addEventListener('input', () => {
      if (formName.value.trim().length >= 2) {
        formName.classList.remove('is-invalid');
        if (nameError) nameError.textContent = '';
      }
    });
  }

  if (formMessage) {
    formMessage.addEventListener('input', () => {
      if (formMessage.value.trim().length >= 10) {
        formMessage.classList.remove('is-invalid');
        if (messageError) messageError.textContent = '';
      }
    });
  }

  // Envoi WhatsApp (activation directe sans bloquer sur la validation)
  if (btnSendWa) {
    btnSendWa.addEventListener('click', () => {
      const name = formName ? formName.value.trim() : '';
      const subject = formSubject ? formSubject.value : 'Contact';
      const msg = formMessage ? formMessage.value.trim() : '';

      let text;
      if (name && msg) {
        text = `Bonjour Antonn, je suis ${name}. Objet : ${subject}. ${msg}`;
      } else if (name) {
        text = `Bonjour Antonn, je suis ${name}. Je vous contacte au sujet de : ${subject}.`;
      } else if (msg) {
        text = `Bonjour Antonn, je vous contacte depuis votre site CV. Objet : ${subject}. ${msg}`;
      } else {
        text = `Bonjour Antonn, je vous contacte depuis votre site CV (Logistique · E-commerce · Marketing IA).`;
      }

      const waNumber = (content.profile.whatsapp || '+22891073348').replace(/\D/g, '');
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Envoi Email
  if (btnSendMail) {
    btnSendMail.addEventListener('click', () => {
      const name = formName ? formName.value.trim() : '';
      const subject = formSubject ? formSubject.value : 'Contact';
      const msg = formMessage ? formMessage.value.trim() : '';

      let mailSubject = `[${subject}] Message depuis le site CV`;
      let mailBody = `Bonjour Antonn,\n\nJe vous contacte depuis votre site CV.\n`;
      if (name && msg) {
        mailSubject = `[${subject}] Message de ${name}`;
        mailBody = `Bonjour Antonn,\n\nJe suis ${name}.\n\nObjet : ${subject}\n\n${msg}\n`;
      } else if (name) {
        mailSubject = `[${subject}] Message de ${name}`;
        mailBody = `Bonjour Antonn,\n\nJe suis ${name}.\n\nObjet : ${subject}\n`;
      } else if (msg) {
        mailSubject = `[${subject}] Message depuis le site CV`;
        mailBody = `Bonjour Antonn,\n\nObjet : ${subject}\n\n${msg}\n`;
      }

      const url = `mailto:${content.profile.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
      window.location.href = url;
    });
  }

  // --- 6.9 Copier l'email ---
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-active');
    setTimeout(() => {
      toast.classList.remove('is-active');
    }, 2000);
  }

  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content.profile.email)
          .then(() => showToast('Email copié ✓'))
          .catch(() => showToast('Email : ' + content.profile.email));
      } else {
        showToast('Email : ' + content.profile.email);
      }
    });
  }

  // --- 6.10 Bloc-CTA magnétique ---
  const ctaCard = document.getElementById('ctaMagneticCard');
  if (ctaCard && !isTouch) {
    ctaCard.addEventListener('mousemove', (e) => {
      const rect = ctaCard.getBoundingClientRect();
      const ox = (e.clientX - rect.left) / rect.width - 0.5;
      const oy = (e.clientY - rect.top) / rect.height - 0.5;
      ctaCard.style.transform = `translate3d(${ox * 12}px, ${oy * 12}px, 0)`;
    });

    ctaCard.addEventListener('mouseleave', () => {
      ctaCard.style.transform = 'translate3d(0, 0, 0)';
    });

    ctaCard.addEventListener('click', () => {
      const formEl = document.getElementById('contactForm');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (formName) formName.focus();
      }
    });
  }

  // --- 6.11 Bouton « Haut de page » avec anneau SVG ---
  const btnBackToTop = document.getElementById('btnBackToTop');
  const ringFill = document.getElementById('ringFill');

  if (btnBackToTop && ringFill) {
    // Calcul de circonférence du cercle r=16 -> 2 * PI * 16 ≈ 100.53
    const circumference = 2 * Math.PI * 16;
    ringFill.style.strokeDasharray = `${circumference} ${circumference}`;
    ringFill.style.strokeDashoffset = circumference;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct = docHeight > 0 ? scrollTop / docHeight : 0;

      // Afficher après 600px
      if (scrollTop > 600) {
        btnBackToTop.style.opacity = '1';
        btnBackToTop.style.pointerEvents = 'auto';
      } else {
        btnBackToTop.style.opacity = '0.5';
      }

      // Remplir l'anneau
      const offset = circumference - (scrollPct * circumference);
      ringFill.style.strokeDashoffset = offset;
    }, { passive: true });

    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 6.12 Navigation au clavier ---
  // Géré via CSS (:focus-visible) et gestion des touches Enter/Space ci-dessus.
})();
