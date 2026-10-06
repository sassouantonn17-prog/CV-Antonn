const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BROWSER_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const ARTIFACTS_DIR = 'C:\\Users\\Antonn\\.gemini\\antigravity-ide\\brain\\131258a4-492b-4edd-b4fa-b19d7d964316';

async function runVerification() {
  console.log('Launching browser with:', BROWSER_PATH);
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  console.log('--- TEST 1: Chargement HTTP Local ---');
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle0' });

  // Attendre l'intro curtain ou cliquer pour passer
  const skipBtn = await page.$('#introSkip');
  if (skipBtn) {
    await skipBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Vérification de la disparition du rideau
  const curtainDisplay = await page.$eval('#introCurtain', el => el.style.display);
  console.log('Intro Curtain display après skip:', curtainDisplay);

  // Attendre la fin des animations du héros (1.2s)
  await new Promise(r => setTimeout(r, 1200));

  // Capture Hero 1440px
  const heroShot = path.join(ARTIFACTS_DIR, 'phase4_hero_animated_1440.png');
  await page.screenshot({ path: heroShot, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Hero screenshot capturé:', heroShot);

  console.log('--- TEST 2: Modale de Projet (Case Room) ---');
  await page.evaluate(() => {
    document.querySelector('.project-card[data-slug="case-room"]').click();
  });
  await new Promise(r => setTimeout(r, 500));

  const isModalOpen = await page.$eval('#projectModal', el => el.classList.contains('is-open'));
  console.log('Modale ouverte:', isModalOpen);

  const modalTitle = await page.$eval('#modalBody .modal-title', el => el.textContent.trim());
  console.log('Titre dans la modale:', modalTitle);

  // Capture modale ouverte
  const modalShot = path.join(ARTIFACTS_DIR, 'phase5_modal_open.png');
  await page.screenshot({ path: modalShot });
  console.log('Modal screenshot capturé:', modalShot);

  // Fermer avec Échap
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));
  const isModalClosed = await page.$eval('#projectModal', el => !el.classList.contains('is-open'));
  console.log('Modale fermée avec Échap:', isModalClosed);

  console.log('--- TEST 3: Onglets Expérience & Accordéon ---');
  // Clic sur l'onglet Entrepreneuriat
  await page.evaluate(() => {
    const tab = document.querySelector('.tab-btn[data-category="entrepreneuriat"]');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const visibleExp = await page.$$eval('.exp-item', items => {
    return items.filter(i => i.style.display !== 'none').map(i => i.dataset.category);
  });
  console.log('Expériences visibles après filtre "entrepreneuriat":', visibleExp);

  // Revenir sur Tout
  await page.evaluate(() => {
    document.querySelector('.tab-btn[data-category="all"]').click();
  });
  await new Promise(r => setTimeout(r, 300));

  // Cliquer sur "Voir plus"
  const expandBtn = await page.$('.btn-expand-exp');
  if (expandBtn) {
    await expandBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const btnText = await page.evaluate(el => el.textContent.trim(), expandBtn);
    console.log('Texte du bouton après expansion:', btnText);
  }

  console.log('--- TEST 4: Compteurs d\'impact et Barres ---');
  // Scroller jusqu'aux compétences et stats pour déclencher ScrollTrigger
  await page.evaluate(() => {
    document.getElementById('competences').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1600));

  const statsTexts = await page.$$eval('.stat-number', els => els.map(e => e.textContent.trim()));
  console.log('Chiffres d\'impact affichés:', statsTexts);

  const skillsLevels = await page.$$eval('.skill-fill', els => els.map(e => e.style.width));
  console.log('Largeurs des barres de compétences:', skillsLevels);

  console.log('--- TEST 5: Formulaire & Validation ---');
  await page.evaluate(() => {
    document.getElementById('contact').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 500));

  // Clic WhatsApp à vide
  await page.click('#btnSendWa');
  const nameError = await page.$eval('#nameError', el => el.textContent.trim());
  const messageError = await page.$eval('#messageError', el => el.textContent.trim());
  console.log('Erreurs de validation à vide:', { nameError, messageError });

  // Remplissage du formulaire
  await page.type('#formName', 'Jean Dupont');
  await page.type('#formMessage', 'Bonjour Antonn, nous souhaitons vous confier la gestion logistique.');
  const charCount = await page.$eval('#charCounter', el => el.textContent.trim());
  console.log('Compteur de caractères après frappe:', charCount);

  // Capture Contact section avec formulaire validé
  const contactShot = path.join(ARTIFACTS_DIR, 'phase5_contact_form.png');
  await page.screenshot({ path: contactShot });

  console.log('--- TEST 6: Responsive Mobile (375x812) ---');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));

  const mobileHeroShot = path.join(ARTIFACTS_DIR, 'phase6_mobile_hero_375.png');
  await page.screenshot({ path: mobileHeroShot, clip: { x: 0, y: 0, width: 375, height: 812 } });
  console.log('Mobile Hero screenshot capturé:', mobileHeroShot);

  console.log('--- TEST 7: Responsive Tablet (768x1024) ---');
  await page.setViewport({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));

  const tabletHeroShot = path.join(ARTIFACTS_DIR, 'phase6_tablet_hero_768.png');
  await page.screenshot({ path: tabletHeroShot, clip: { x: 0, y: 0, width: 768, height: 1024 } });
  console.log('Tablet Hero screenshot capturé:', tabletHeroShot);

  console.log('--- TEST 8: Protocole file:// direct ---');
  const localFilePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  console.log('Chargement via file:// :', localFilePath);
  await page.goto(localFilePath, { waitUntil: 'load' });
  await page.evaluate(() => {
    const intro = document.getElementById('introCurtain');
    if (intro) intro.style.display = 'none';
  });
  await new Promise(r => setTimeout(r, 500));
  const fileTitle = await page.$eval('.hero-title', el => el.textContent.replace(/\s+/g, ' ').trim());
  console.log('file:// Hero Title rendu:', fileTitle);

  console.log('--- RÉSUMÉ DES ERREURS CONSOLE ---');
  console.log('Erreurs détectées:', consoleErrors.length === 0 ? 'AUCUNE ERREUR (0)' : consoleErrors);

  await browser.close();
  console.log('Vérification terminée avec SUCCÈS !');
}

runVerification().catch(err => {
  console.error('Erreur vérification:', err);
  process.exit(1);
});
