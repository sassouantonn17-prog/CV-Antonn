/**
 * render.js — Génération dynamique du DOM à partir de window.CV_CONTENT
 * Sans framework, scripts classiques
 */

(function () {
  const data = window.CV_CONTENT;
  if (!data) {
    console.error("CV_CONTENT non trouvé.");
    return;
  }

  // --- SVG Icons (1.5px stroke, currentColor) ---
  const ICONS = {
    arrowRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
    arrowUpRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`,
    arrowDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`,
    arrowUp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
    copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="1" ry="1"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    check: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    close: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    whatsapp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    mapPin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    quote: `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>`,
    // Skills
    warehouse: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-5 9 5v12H3z"></path><path d="M9 21v-7a3 3 0 0 1 6 0v7"></path></svg>`,
    shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    cart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    target: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    sparkles: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`,
    globe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
  };

  // Helper pour découper les lettres du nom pour l'animation GSAP
  function wrapLetters(text) {
    return text.split('').map(char => `<span class="char-wrap"><span class="char">${char === ' ' ? '&nbsp;' : char}</span></span>`).join('');
  }

  // --- Monogramme SVG ---
  function getMonogramSvg(idSuffix) {
    const sId = idSuffix ? `-${idSuffix}` : '';
    return `
      <svg class="monogram-svg" viewBox="0 0 48 48" width="44" height="44" aria-label="Monogramme Antonn Sassou" role="img">
        <text x="7" y="19" font-family="'Anton', sans-serif" font-size="20" fill="var(--ink)" class="mono-letter mono-a">A</text>
        <line x1="10" y1="38" x2="38" y2="10" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" class="mono-diag" id="monoDiag${sId}" />
        <text x="25" y="42" font-family="'Anton', sans-serif" font-size="20" fill="var(--ink)" class="mono-letter mono-s">S</text>
      </svg>
    `;
  }

  // --- 1. Intro Screen (Animation 1) ---
  const introHtml = `
    <div class="intro-curtain" id="introCurtain" aria-hidden="true">
      <div class="intro-content">
        ${getMonogramSvg('intro')}
        <p class="micro-label intro-label">Antonn Sassou · 2026</p>
      </div>
      <button class="intro-skip" id="introSkip" type="button">Passer ✕</button>
    </div>
  `;

  // --- 2. Progress Bar ---
  const progressBarHtml = `<div class="progress-bar" id="progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>`;

  // --- 3. Header ---
  const headerHtml = `
    <header class="site-header" id="siteHeader">
      <div class="container header-container">
        <div class="header-left micro-label">
          <span>${data.profile.taglineLeft[0]}</span>
          <span>${data.profile.taglineLeft[1]}</span>
        </div>
        <a href="#hero" class="header-center" aria-label="Retour en haut">
          ${getMonogramSvg('header')}
        </a>
        <div class="header-right micro-label">
          <span>${data.profile.taglineRight[0]}</span>
          <span>${data.profile.taglineRight[1]}</span>
        </div>
      </div>
    </header>
  `;

  // --- 4. Hero Section ---
  const cvPdfButton = data.profile.cvPdf ? `
    <a href="${data.profile.cvPdf}" download class="btn-text" id="btnCvPdf">
      Télécharger le CV ↓
    </a>
  ` : '';

  const heroHtml = `
    <section class="hero-section" id="hero">
      <div class="container hero-container">
        <div class="hero-col-left">
          <h1 class="hero-title font-display" aria-label="${data.profile.firstName} ${data.profile.lastName}">
            <div class="title-line">${wrapLetters(data.profile.firstName.toUpperCase())}</div>
            <div class="title-line">${wrapLetters(data.profile.lastName.toUpperCase())}</div>
          </h1>
          <p class="hero-subtitle" data-reveal>${data.profile.headline}</p>
          <hr class="green-bar" data-reveal />
          <p class="hero-pitch" data-reveal>${data.profile.pitch}</p>
          <div class="hero-actions" data-reveal>
            <a href="#contact" class="btn-text btn-contact">
              Me contacter ${ICONS.arrowRight}
            </a>
            ${cvPdfButton}
          </div>
        </div>

        <div class="hero-col-right" id="heroVisual">
          <div class="hero-circle" id="heroCircle"></div>
          <div class="hero-portrait-wrapper" id="heroPortraitWrapper">
            <img 
              src="${data.profile.portrait}" 
              alt="Portrait d'Antonn Sassou" 
              class="hero-portrait" 
              id="heroPortrait"
              loading="eager"
              onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 120\\' fill=\\'%23888888\\'><circle cx=\\'50\\' cy=\\'40\\' r=\\'25\\'/><path d=\\'M20,120 C20,80 80,80 80,120 Z\\'/></svg>'; this.classList.add('portrait-fallback');"
            />
          </div>
        </div>
      </div>

      <div class="scroll-indicator" aria-hidden="true">
        <div class="scroll-line"></div>
        <span class="micro-label">DÉFILER</span>
      </div>
    </section>
  `;

  // --- 5. Projects Section (Fond --bg-alt) ---
  const featuredProjects = data.projects.filter(p => p.featured);
  const projectCardsHtml = featuredProjects.map((p, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    return `
      <article class="project-card" data-slug="${p.slug}" data-reveal tabindex="0" role="button" aria-label="Voir le projet ${p.name}">
        <div class="project-card-header">
          <span class="micro-label project-num">${num}</span>
          <h3 class="project-card-name">${p.name}</h3>
        </div>
        <p class="project-card-cat text-soft">${p.category}</p>
        <hr class="green-bar project-bar" />
        <div class="project-card-media">
          <img 
            src="${p.image}" 
            alt="${p.name} — ${p.category}" 
            class="project-card-img" 
            loading="lazy"
            onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'project-card-fallback\\'><span class=\\'font-display\\'>${p.name}</span></div>';"
          />
          <div class="project-card-overlay">
            <span class="micro-label">VOIR LE PROJET</span>
            ${ICONS.arrowRight}
          </div>
        </div>
      </article>
    `;
  }).join('');

  const projectsHtml = `
    <section class="projects-section bg-alt section-pad" id="projets">
      <div class="container">
        <div class="projects-grid">
          <div class="projects-intro" data-reveal>
            <p class="section-label">PROJETS PHARES</p>
            <p class="projects-intro-text">Des projets construits de zéro, sur le terrain ouest-africain.</p>
            <button class="btn-all-projects" id="btnAllProjects" type="button">
              VOIR TOUS LES PROJETS ${ICONS.arrowRight}
            </button>
          </div>
          ${projectCardsHtml}
        </div>
        <div class="carousel-dots" id="carouselDots" aria-hidden="true">
          <button class="dot active" data-index="0" aria-label="Projet 1"></button>
          <button class="dot" data-index="1" aria-label="Projet 2"></button>
          <button class="dot" data-index="2" aria-label="Projet 3"></button>
        </div>
      </div>
    </section>
  `;

  // --- 6. Parcours Section (#parcours) ---
  const expCategories = [
    { key: "all", label: "Tout" },
    { key: "logistique", label: "Logistique" },
    { key: "entrepreneuriat", label: "Entrepreneuriat" },
    { key: "marketing", label: "Marketing" }
  ];

  const expTabsHtml = expCategories.map((c, i) => `
    <button class="tab-btn ${i === 0 ? 'active' : ''}" data-category="${c.key}" role="tab" aria-selected="${i === 0}">
      ${c.label}
    </button>
  `).join('');

  const expListHtml = data.experiences.map((exp, idx) => {
    const bulletsInitial = exp.bullets.slice(0, 3);
    const bulletsExtra = exp.bullets.slice(3);
    const hasMore = bulletsExtra.length > 0;

    return `
      <div class="exp-item" data-category="${exp.category}" data-reveal>
        <div class="exp-item-header">
          <span class="exp-period micro-label">${exp.period}</span>
          <h3 class="exp-title">${exp.title}</h3>
          <p class="exp-company text-soft">${exp.company} · ${exp.location}</p>
        </div>
        <ul class="exp-bullets">
          ${bulletsInitial.map(b => `<li>${b}</li>`).join('')}
        </ul>
        ${hasMore ? `
          <ul class="exp-bullets exp-bullets-extra" style="display: none;">
            ${bulletsExtra.map(b => `<li>${b}</li>`).join('')}
          </ul>
          <button class="btn-expand-exp" type="button" aria-expanded="false">
            Voir plus (${bulletsExtra.length}) ↓
          </button>
        ` : ''}
      </div>
    `;
  }).join('');

  const eduHtml = data.education.map(edu => `
    <div class="edu-item" data-reveal>
      <span class="micro-label exp-period">${edu.period}</span>
      <h3 class="edu-degree">${edu.degree}</h3>
      <p class="edu-school text-soft">${edu.school}</p>
    </div>
  `).join('');

  const langHtml = data.languages.map(l => `
    <div class="lang-item" data-reveal>
      <span class="lang-name">${l.name}</span>
      <span class="lang-level text-soft">${l.level}</span>
    </div>
  `).join('');

  const parcoursHtml = `
    <section class="parcours-section section-pad" id="parcours">
      <div class="container parcours-container">
        <!-- Colonne Gauche : Expériences -->
        <div class="parcours-col-left">
          <div class="parcours-header" data-reveal>
            <h2 class="section-label">EXPÉRIENCE</h2>
            <div class="exp-tabs" role="tablist">
              ${expTabsHtml}
              <div class="tab-slider" id="tabSlider"></div>
            </div>
          </div>
          <div class="exp-list" id="expList">
            ${expListHtml}
          </div>
        </div>

        <!-- Colonne Droite : Formation & Langues -->
        <div class="parcours-col-right">
          <div class="parcours-subgroup" data-reveal>
            <h2 class="section-label">FORMATION</h2>
            <div class="edu-list">
              ${eduHtml}
            </div>
          </div>

          <hr class="hairline" style="margin: 20px 0;" data-reveal />

          <div class="parcours-subgroup" data-reveal>
            <h2 class="section-label">LANGUES</h2>
            <div class="lang-list">
              ${langHtml}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // --- 7. Compétences & Impact Section ---
  const skillsListHtml = data.skills.map(s => `
    <div class="skill-row" data-reveal>
      <div class="skill-icon">${ICONS[s.icon] || ICONS.sparkles}</div>
      <span class="skill-label">${s.label}</span>
      <div class="skill-track">
        <div class="skill-fill" data-level="${s.level}" style="width: 0%;"></div>
      </div>
      <span class="skill-percent font-number" data-target="${s.level}">0%</span>
    </div>
  `).join('');

  const statsListHtml = data.stats.map(st => `
    <div class="stat-col" data-reveal>
      <div class="stat-value-wrap">
        <span class="stat-number font-number" data-value="${st.value}">0</span>
        <span class="stat-suffix font-number">${st.suffix}</span>
      </div>
      <p class="stat-label micro-label">${st.label}</p>
    </div>
  `).join('');

  // Marquee tools duplicated for continuous seamless loop
  const toolsChips = data.tools.map(t => `<span class="tool-chip">${t}</span>`).join('');

  const skillsImpactHtml = `
    <section class="skills-impact-section section-pad" id="competences">
      <div class="container">
        <div class="skills-impact-grid">
          <!-- Gauche : Compétences -->
          <div class="skills-col">
            <h2 class="section-label" data-reveal>COMPÉTENCES & OUTILS</h2>
            <div class="skills-list">
              ${skillsListHtml}
            </div>
          </div>

          <!-- Droite : Impact & Expérience -->
          <div class="impact-col">
            <h2 class="section-label" data-reveal>IMPACT & EXPÉRIENCE</h2>
            <div class="stats-row">
              ${statsListHtml}
            </div>
            
            <div class="quote-card" data-reveal>
              <div class="quote-icon-wrap">${ICONS.quote}</div>
              <blockquote class="quote-text">« ${data.profile.quote} »</blockquote>
              <cite class="quote-author micro-label">— ${data.profile.quoteAuthor}</cite>
            </div>
          </div>
        </div>
      </div>

      <!-- Bandeau d'outils défilant horizontalement -->
      <div class="tools-ticker-wrap" aria-label="Outils maîtrisés" data-reveal>
        <div class="tools-ticker" id="toolsTicker">
          <div class="tools-track">${toolsChips}</div>
          <div class="tools-track" aria-hidden="true">${toolsChips}</div>
        </div>
      </div>
    </section>
  `;

  // --- 8. Contact Section (#contact, Fond --bg-alt) ---
  const ctaLines = data.profile.ctaText.map(line => `<span>${line}</span>`).join('');

  const contactHtml = `
    <section class="contact-section bg-alt section-pad" id="contact">
      <div class="container">
        <div class="contact-grid">
          <!-- Col 1 : Intro -->
          <div class="contact-col contact-col-intro" data-reveal>
            <h2 class="section-label">TRAVAILLONS ENSEMBLE</h2>
            <hr class="green-bar" />
            <p class="contact-avail">${data.profile.availability}</p>
          </div>

          <!-- Col 2 : Direct info -->
          <div class="contact-col contact-col-info" data-reveal>
            <div class="contact-item">
              <span class="micro-label">EMAIL</span>
              <div class="contact-link-row">
                <a href="mailto:${data.profile.email}" class="contact-link email-link">
                  ${ICONS.mail} ${data.profile.email}
                </a>
                <button class="btn-copy" id="btnCopyEmail" type="button" aria-label="Copier l'email" title="Copier">
                  ${ICONS.copy}
                </button>
              </div>
            </div>

            <div class="contact-item">
              <span class="micro-label">WHATSAPP</span>
              <div class="contact-link-row">
                <a href="https://wa.me/${data.profile.whatsapp.replace('+', '')}" target="_blank" rel="noopener noreferrer" class="contact-link">
                  ${ICONS.whatsapp} ${data.profile.whatsappDisplay}
                </a>
              </div>
            </div>

            <div class="contact-item">
              <span class="micro-label">LOCALISATION</span>
              <div class="contact-link-row">
                <span class="contact-location text-soft">${ICONS.mapPin} ${data.profile.location}</span>
              </div>
            </div>
          </div>

          <!-- Col 3 : Bloc-CTA magnétique & Formulaire -->
          <div class="contact-col contact-col-form" data-reveal>
            <div class="cta-magnetic-card" id="ctaMagneticCard" tabindex="0" role="button" aria-label="Descendre au formulaire">
              <div class="cta-card-content">
                <div class="cta-lines font-display">${ctaLines}</div>
                <div class="cta-arrow">${ICONS.arrowRight}</div>
              </div>
            </div>

            <form class="contact-form" id="contactForm" novalidate>
              <div class="form-group">
                <label for="formName" class="micro-label">Nom complet *</label>
                <input type="text" id="formName" name="name" placeholder="Votre nom" required autocomplete="name" />
                <span class="form-error" id="nameError"></span>
              </div>

              <div class="form-group">
                <label for="formSubject" class="micro-label">Objet</label>
                <select id="formSubject" name="subject">
                  <option value="Opportunité d'emploi">Opportunité d'emploi</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div class="form-group">
                <label for="formMessage" class="micro-label">Message *</label>
                <textarea id="formMessage" name="message" rows="4" placeholder="Votre message..." required></textarea>
                <div class="char-count-row">
                  <span class="form-error" id="messageError"></span>
                  <span class="micro-label char-counter" id="charCounter">0 car.</span>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-submit btn-wa" id="btnSendWa">
                  ${ICONS.whatsapp} Envoyer sur WhatsApp
                </button>
                <button type="button" class="btn-submit btn-mail" id="btnSendMail">
                  ${ICONS.mail} Envoyer par email
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr class="hairline" style="margin: 64px 0 32px 0;" />

        <footer class="site-footer">
          <p class="micro-label">© 2026 Antonn Sassou — Tous droits réservés.</p>
          <button class="btn-back-to-top" id="btnBackToTop" type="button" aria-label="Retour en haut de page">
            <svg class="progress-ring" width="40" height="40" viewBox="0 0 40 40">
              <circle class="ring-bg" cx="20" cy="20" r="16" />
              <circle class="ring-fill" id="ringFill" cx="20" cy="20" r="16" />
            </svg>
            <span class="arrow-up">${ICONS.arrowUp}</span>
          </button>
        </footer>
      </div>
    </section>
  `;

  // --- 9. Modal Projet (Drawer & All Projects Grid) ---
  const modalHtml = `
    <div class="modal-overlay" id="projectModal" aria-hidden="true" role="dialog" aria-modal="true">
      <div class="modal-backdrop" id="modalBackdrop"></div>
      <div class="modal-drawer" id="modalDrawer" role="document">
        <div class="modal-header">
          <div class="modal-nav">
            <button class="modal-nav-btn" id="modalPrev" aria-label="Projet précédent">← Précédent</button>
            <button class="modal-nav-btn" id="modalNext" aria-label="Projet suivant">Suivant →</button>
          </div>
          <button class="modal-close-btn" id="modalClose" aria-label="Fermer la modale">${ICONS.close}</button>
        </div>
        <div class="modal-body" id="modalBody">
          <!-- Rempli dynamiquement au clic -->
        </div>
      </div>
    </div>
  `;

  // --- 10. Curseur Personnalisé & Toast ---
  const uiAddonsHtml = `
    <div class="custom-cursor-dot" id="cursorDot" aria-hidden="true"></div>
    <div class="custom-cursor-circle" id="cursorCircle" aria-hidden="true">
      <span class="cursor-text" id="cursorText"></span>
    </div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
  `;

  // --- Assemblage de la page dans #app ---
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = [
      progressBarHtml,
      introHtml,
      headerHtml,
      heroHtml,
      projectsHtml,
      parcoursHtml,
      skillsImpactHtml,
      contactHtml,
      modalHtml,
      uiAddonsHtml
    ].join('\n');
    console.log("render.js : Page rendue avec succès à partir de CV_CONTENT.");
  } else {
    console.error("#app non trouvé dans index.html.");
  }
})();
