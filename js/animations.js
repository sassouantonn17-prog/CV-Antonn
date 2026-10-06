/**
 * animations.js — Animations GSAP 3 + ScrollTrigger (Section 5 du plan)
 * 13 animations fluides à 60fps, déclenchées une seule fois
 */

(function () {
  // Vérification de GSAP et ScrollTrigger
  if (typeof gsap === 'undefined') {
    console.warn("GSAP non chargé.");
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Règle globale : prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const introCurtain = document.getElementById('introCurtain');

  if (prefersReduced) {
    if (introCurtain) introCurtain.style.display = 'none';
    // Révéler immédiatement tout
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.skill-fill').forEach(fill => {
      fill.style.width = fill.dataset.level + '%';
    });
    document.querySelectorAll('.skill-percent').forEach(p => {
      p.textContent = p.dataset.target + '%';
    });
    document.querySelectorAll('.stat-number').forEach(s => {
      const v = parseInt(s.dataset.value, 10);
      s.textContent = v >= 1000 ? v.toLocaleString('fr-FR') : v;
    });
    document.querySelectorAll('.hairline, .green-bar').forEach(line => {
      line.style.transform = 'none';
    });
    return;
  }

  // --- Animation 1 : Intro Curtain (1.6s au total) ---
  let introSkipped = false;
  const skipIntro = () => {
    if (introSkipped) return;
    introSkipped = true;
    if (introCurtain) {
      gsap.killTweensOf('#introCurtain, #monoDiag-intro, .mono-a, .mono-s');
      gsap.to(introCurtain, {
        yPercent: -100,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          introCurtain.style.display = 'none';
          initHeroAnimations();
        }
      });
    }
  };

  const introSkipBtn = document.getElementById('introSkip');
  if (introSkipBtn) introSkipBtn.addEventListener('click', skipIntro);
  if (introCurtain) introCurtain.addEventListener('click', skipIntro);

  const introTl = gsap.timeline({
    onComplete: () => {
      if (!introSkipped) {
        introSkipped = true;
        gsap.to(introCurtain, {
          yPercent: -100,
          duration: 0.65,
          ease: 'power3.inOut',
          onComplete: () => {
            introCurtain.style.display = 'none';
            initHeroAnimations();
          }
        });
      }
    }
  });

  // Diagonale monogramme s'étend
  introTl.fromTo('#monoDiag-intro', 
    { strokeDasharray: 40, strokeDashoffset: 40 },
    { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }
  )
  .fromTo('.intro-content .mono-letter',
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.4, stagger: 0.15, ease: 'power2.out' },
    '-=0.4'
  )
  .fromTo('.intro-label',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
    '-=0.2'
  )
  .to({}, { duration: 0.2 }); // pause avant montée

  // --- Animations 2 à 5 : Révélation du Héros ---
  function initHeroAnimations() {
    const heroTl = gsap.timeline();

    // 2. Nom du héros (lettre par lettre)
    heroTl.fromTo('.hero-title .char', 
      { yPercent: 110 },
      { yPercent: 0, duration: 0.85, stagger: 0.032, ease: 'power4.out' },
      0
    );

    // 3. Cercle vert (scale 0.6 à 1 + fondu, 0.9s)
    heroTl.fromTo('#heroCircle',
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' },
      0
    );

    // 4. Portrait (monte de 60px vers 0, fondu, 0.2s après cercle)
    heroTl.fromTo('#heroPortrait',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' },
      0.2
    );

    // 5. Sous-titre, pitch, trait vert en cascade
    heroTl.fromTo('.hero-col-left .hero-subtitle',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      0.4
    );

    heroTl.fromTo('.hero-col-left .green-bar',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, ease: 'power2.out' },
      0.55
    );

    heroTl.fromTo('.hero-col-left .hero-pitch, .hero-col-left .hero-actions',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      0.65
    );

    // 6. Parallaxe douce au scroll (portrait -8%, cercle -4%)
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to('#heroPortrait', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to('#heroCircle', {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Lancer les ScrollTriggers pour le reste de la page
    initScrollAnimations();
  }

  function initScrollAnimations() {
    if (typeof ScrollTrigger === 'undefined') return;

    // --- 7. Révélations au scroll ([data-reveal]) ---
    // Regrouper par conteneurs frères pour appliquer le stagger de 0.08s
    const revealContainers = document.querySelectorAll('.projects-grid, .parcours-col-left, .parcours-col-right, .skills-col, .impact-col, .contact-grid');

    revealContainers.forEach(container => {
      const items = container.querySelectorAll('[data-reveal]');
      if (items.length > 0) {
        gsap.fromTo(items,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 82%',
              once: true
            }
          }
        );
      }
    });

    // Éléments data-reveal isolés
    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (!el.closest('.projects-grid, .parcours-col-left, .parcours-col-right, .skills-col, .impact-col, .contact-grid, .hero-col-left')) {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    });

    // --- 8. Labels de section (espacement lettres 0.5em -> 0.25em + fondu) ---
    document.querySelectorAll('.section-label').forEach(label => {
      gsap.fromTo(label,
        { letterSpacing: '0.45em', opacity: 0.4 },
        {
          letterSpacing: '0.25em',
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: label,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // --- 9. Filets séparateurs (scaleX 0 -> 1) ---
    document.querySelectorAll('.hairline').forEach(line => {
      gsap.fromTo(line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 90%',
            once: true
          }
        }
      );
    });

    // --- 10. Barres de compétences (0 -> level% + compteur numérique) ---
    ScrollTrigger.create({
      trigger: '.skills-list',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('.skill-row').forEach(row => {
          const fill = row.querySelector('.skill-fill');
          const percent = row.querySelector('.skill-percent');
          const target = parseInt(fill.dataset.level, 10) || 0;

          // Animation de la barre
          gsap.to(fill, {
            width: target + '%',
            duration: 1.1,
            ease: 'power2.out'
          });

          // Compteur numérique
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: target,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: () => {
              percent.textContent = Math.round(counterObj.val) + '%';
            }
          });
        });
      }
    });

    // --- 11. Chiffres d'impact (compteur 0 -> value avec espace insécable) ---
    ScrollTrigger.create({
      trigger: '.stats-row',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('.stat-col').forEach(col => {
          const numEl = col.querySelector('.stat-number');
          const targetVal = parseInt(numEl.dataset.value, 10) || 0;
          const counterObj = { val: 0 };

          gsap.to(counterObj, {
            val: targetVal,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              const current = Math.round(counterObj.val);
              if (current >= 1000) {
                // Espace insécable française
                numEl.textContent = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
              } else {
                numEl.textContent = current;
              }
            }
          });
        });
      }
    });

    // --- 12. Images des projets (clip-path inset(100% 0 0 0) -> inset(0)) ---
    document.querySelectorAll('.project-card-media').forEach(media => {
      gsap.fromTo(media,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: media,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // --- 13. Bandeau d'outils (défilement continu infini) ---
    const ticker = document.getElementById('toolsTicker');
    if (ticker) {
      const tickerWidth = ticker.querySelector('.tools-track').offsetWidth;
      const tickerTween = gsap.to(ticker, {
        x: -tickerWidth,
        duration: 25,
        ease: 'none',
        repeat: -1
      });

      ticker.addEventListener('mouseenter', () => tickerTween.pause());
      ticker.addEventListener('mouseleave', () => tickerTween.play());
    }

    // Barre de progression haut de page
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(progress));
      }, { passive: true });
    }
  }
})();
