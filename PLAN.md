# Plan d'implémentation — Site CV « Antonn Sassou » (local, front-end uniquement)

> **Mode d'emploi**
> 1. Dans Google Antigravity, créer un dossier de projet vide.
> 2. Y déposer ce fichier sous le nom `PLAN.md`.
> 3. Donner cette consigne à l'agent : « Implémente PLAN.md phase par phase. À la fin de chaque phase, vérifie le résultat dans le navigateur et montre-moi une capture avant de passer à la suivante. »

---

## 0. Objectif et périmètre

Construire **uniquement la page web, ses animations et ses interactions**. Le site doit fonctionner **en local**, en ouvrant `index.html`.

**Hors périmètre, à ne pas faire :**
- aucune base de données (pas de Supabase ni de Firebase) ;
- aucun backend, aucune API ;
- aucun `git push`, aucune création de dépôt GitHub ;
- aucun déploiement (pas de Vercel, Netlify ni Firebase Hosting) ;
- aucun compte ni service externe à créer.

**Rendu visé :** une page CV éditoriale et minimaliste, inspirée d'une maquette de référence :
- grand nom en typographie condensée noire ;
- portrait noir et blanc qui déborde sur un cercle vert ;
- filets fins ;
- un vert profond comme unique accent.

Langue du site : **français**.

## 1. Stack technique

- **HTML5 + CSS3 + JavaScript vanilla**, sans framework et sans étape de build.
- **Scripts classiques** (pas de `type="module"`), pour que la page fonctionne aussi en double-cliquant sur `index.html` (protocole `file://`).
- **GSAP 3 + ScrollTrigger** pour les animations, téléchargés dans `/vendor` pour fonctionner hors ligne.
- **Polices** téléchargées dans `/fonts` au format woff2 et déclarées en `@font-face` :
  - **Anton** pour le nom et les grands titres ;
  - **DM Sans** (400/500/700) pour le texte ;
  - **DM Serif Display** pour les gros chiffres.
- **Icônes** : SVG inline, trait de 1,5 px, `currentColor`.

### Arborescence

```
/cv-antonn
├── index.html
├── css/
│   ├── tokens.css        ← variables (couleurs, polices, espacements)
│   ├── base.css          ← reset, typographie, utilitaires
│   └── sections.css      ← styles de chaque section
├── js/
│   ├── content.js        ← TOUT le contenu du CV (seul fichier à modifier pour mettre à jour le CV)
│   ├── render.js         ← génère les sections à partir de content.js
│   ├── animations.js     ← animations GSAP
│   └── interactions.js   ← curseur, onglets, modale, formulaire, etc.
├── vendor/
│   ├── gsap.min.js
│   └── ScrollTrigger.min.js
├── fonts/                ← fichiers woff2
└── assets/
    ├── portrait.png      ← portrait détouré (fond transparent)
    ├── projets/case-room.jpg
    ├── projets/oryn.jpg
    ├── projets/statwin.jpg
    ├── projets/pipeline-ia.jpg
    └── cv-antonn-sassou.pdf   ← optionnel
```

L'ordre de chargement en bas de `<body>` est : `gsap`, `ScrollTrigger`, `content.js`, `render.js`, `animations.js`, `interactions.js`.

## 2. Design system (`css/tokens.css`)

```css
:root {
  --bg: #F3F3F1;
  --bg-alt: #ECECEA;
  --ink: #111111;
  --ink-soft: #555555;
  --line: #D6D6D3;
  --accent: #0F7A4F;
  --accent-soft: #E3EFE8;

  --font-display: 'Anton', 'Impact', sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-number: 'DM Serif Display', Georgia, serif;

  --container: 1200px;
  --gutter: clamp(16px, 4vw, 48px);
  --section-pad: clamp(56px, 8vw, 96px);
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  color-scheme: light;
}
```

### Typographie

- **Nom** :
  - police Anton ;
  - taille `clamp(64px, 12vw, 168px)` ;
  - `line-height: 0.92`, majuscules.
- **Labels de section** :
  - DM Sans 600, 14px, majuscules ;
  - `letter-spacing: 0.25em`.
- **Sous-titre du héros** : DM Sans 500, 14px, majuscules, `letter-spacing: 0.2em`, couleur `--accent`.
- **Micro-labels** : 11px, majuscules, `letter-spacing: 0.15em`.
- **Texte courant** : 16px, `line-height: 1.6`.

### Signatures visuelles

- Trait vert de 40 à 60px de large et 2px d'épaisseur sous les titres.
- Filets de 1px en `--line` entre les blocs.
- Aucune ombre, aucun dégradé, aucun arrondi supérieur à 2px.

## 3. Contenu (`js/content.js`)

À reprendre tel quel. C'est la **seule source de contenu** : `render.js` construit toute la page à partir de cet objet. Pour mettre le CV à jour, il suffit de modifier ce fichier.

```js
window.CV_CONTENT = {
  profile: {
    firstName: "Antonn",
    lastName: "Sassou",
    headline: "Logistique · E-commerce · Marketing IA",
    taglineLeft: ["Opérations rigoureuses", "Croissance mesurable"],
    taglineRight: ["Curriculum", "2026"],
    pitch: "Je transforme des opérations complexes en systèmes qui tournent — du dépôt au client final.",
    quote: "La rigueur d'un dépôt, l'audace d'un entrepreneur.",
    quoteAuthor: "Antonn Sassou",
    email: "sassouantonn17@gmail.com",
    whatsapp: "+22891073348",
    whatsappDisplay: "+228 91 07 33 48",
    location: "Lomé, Togo",
    availability: "Ouvert aux opportunités en logistique, e-commerce et marketing digital.",
    ctaText: ["Construisons", "quelque chose", "qui dure"],
    portrait: "assets/portrait.png",
    cvPdf: "assets/cv-antonn-sassou.pdf" // mettre null si pas de PDF
  },

  experiences: [
    {
      title: "Responsable de Dépôt",
      company: "CCT Batimat",
      location: "Lomé",
      period: "2024 – Aujourd'hui",
      category: "logistique",
      bullets: [
        "Gestion complète de l'exploitation du dépôt : réception, stockage, sorties et transferts de marchandises",
        "Organisation des réceptions de conteneurs : placement, déchargement, tri et répartition des marchandises",
        "Suivi des stocks et inventaires sous Jarvis : contrôle des écarts, fiabilisation des quantités, réduction des pertes",
        "Traitement des anomalies constatées au déchargement et remontée des incidents à la hiérarchie",
        "Application et contrôle des règles de sécurité et du port des EPI sur le site",
        "Encadrement de l'équipe de dépôt : organisation du travail, formation aux bonnes pratiques",
        "Reporting régulier de l'activité au Responsable Logistique (mouvements, niveaux de stock, incidents)",
        "Interface quotidienne avec les autres dépôts, les transporteurs et les services commerciaux"
      ]
    },
    {
      title: "Fondateur & Gérant",
      company: "Case Room",
      location: "Lomé · Cotonou",
      period: "2024 – Aujourd'hui",
      category: "entrepreneuriat",
      bullets: [
        "Création et pilotage d'une marque e-commerce en paiement à la livraison (COD) de coques de téléphone premium",
        "Développement sur 3 marchés : Togo, Bénin et Côte d'Ivoire",
        "Mise en place des opérations : commandes et livraisons coordonnées via WhatsApp, suivi dans Notion, contrôle des encaissements, détection des fausses commandes",
        "Recrutement et contractualisation d'un closer chargé de la confirmation des commandes et de la coordination des livraisons",
        "Sourcing fournisseurs sur Alibaba / 1688 et évaluation continue de nouveaux produits"
      ]
    },
    {
      title: "Fondateur",
      company: "Oryn",
      location: "Lomé",
      period: "2026 – Aujourd'hui",
      category: "entrepreneuriat",
      bullets: [
        "Lancement d'une seconde marque e-commerce COD, avec pour premier produit un ruban antidérapant à bandes luminescentes pour escaliers",
        "Création de l'identité de marque, de la page produit Shopify et des visuels publicitaires"
      ]
    },
    {
      title: "Media Buyer & Directeur Créatif",
      company: "Case Room · Oryn",
      location: "Lomé",
      period: "2024 – Aujourd'hui",
      category: "marketing",
      bullets: [
        "Pilotage des campagnes Meta Ads au Togo, au Bénin et en Côte d'Ivoire : stratégie pixel, structure et consolidation des campagnes",
        "Suivi d'indicateurs créatifs personnalisés (Hook Rate, Hold Rate) pour optimiser les publicités",
        "Pipeline de production vidéo par IA : rétro-ingénierie, script, storyboard, image ancre, clip Veo — en formats UGC et commerciaux",
        "Copywriting à réponse directe (AIDA, PAS, BAB, 4P) et création d'avatars UGC récurrents adaptés au public ouest-africain"
      ]
    },
    {
      title: "Assistant Responsable de Dépôt",
      company: "CCT Batimat",
      location: "Lomé",
      period: "2020 – 2023",
      category: "logistique",
      bullets: [
        "Appui au responsable dans la coordination quotidienne des activités du dépôt",
        "Réception et contrôle des marchandises : vérification des quantités, de la conformité et de l'état des produits",
        "Participation aux opérations de déchargement de conteneurs et au tri des marchandises",
        "Saisie et mise à jour des mouvements de stock sous Jarvis, participation aux inventaires périodiques",
        "Préparation des commandes et suivi des livraisons",
        "Rangement et optimisation de l'espace de stockage",
        "Suppléance du responsable en son absence"
      ]
    }
  ],

  education: [
    {
      degree: "Licence en Agronomie (Bac+3)",
      school: "École Supérieure d'Agronomie (ESA) — Université de Lomé",
      period: "2015 – 2019"
    }
  ],

  languages: [
    { name: "Français", level: "Courant" },
    { name: "Anglais", level: "Notions — lecture, écriture, expression de base" }
  ],

  projects: [
    {
      slug: "case-room",
      name: "Case Room",
      category: "Marque e-commerce COD",
      image: "assets/projets/case-room.jpg",
      featured: true,
      summary: "Coques de téléphone premium livrées en paiement à la livraison au Togo, au Bénin et en Côte d'Ivoire.",
      details: [
        "Lancée en 2024 à Lomé et Cotonou, Case Room est passée de la vente de coques simples à une opération multi-produits et multi-marchés.",
        "Gamme : Luxe Case, Metallic Case, Prestige Case, Ultra Case, coque MagSafe avec béquille intégrée.",
        "Opérations : commandes et livraisons via WhatsApp, suivi dans Notion, closer dédié, contrôle des encaissements et détection des fausses commandes.",
        "Acquisition : campagnes Meta Ads et production publicitaire assistée par IA."
      ],
      tags: ["COD", "Meta Ads", "Shopify", "Notion", "WhatsApp"]
    },
    {
      slug: "oryn",
      name: "Oryn",
      category: "Marque e-commerce COD · Maison",
      image: "assets/projets/oryn.jpg",
      featured: true,
      summary: "Seconde marque lancée en 2026, autour d'équipements pratiques pour la maison.",
      details: [
        "Premier produit : un ruban antidérapant à bandes luminescentes pour escaliers, imperméable, pensé pour la sécurité de nuit.",
        "Identité de marque (noir et vert citron), page produit Shopify et créations publicitaires produites avec Google Flow."
      ],
      tags: ["COD", "Shopify", "Google Flow", "Branding"]
    },
    {
      slug: "statwin",
      name: "StatWin",
      category: "SaaS de pronostics IA",
      image: "assets/projets/statwin.jpg",
      featured: true,
      summary: "Application de pronostics football assistés par l'IA pour les parieurs débutants d'Afrique de l'Ouest.",
      details: [
        "StatWin aide les parieurs débutants à prendre des décisions plus éclairées grâce à des pronostics générés par l'IA.",
        "Développée avec Google Antigravity et un backend Supabase. Modèle freemium avec abonnements payés par mobile money."
      ],
      tags: ["SaaS", "IA", "Supabase", "Mobile money"]
    },
    {
      slug: "pipeline-ia",
      name: "Pipeline Pub IA",
      category: "Production créative Meta Ads",
      image: "assets/projets/pipeline-ia.jpg",
      featured: false,
      summary: "Une chaîne de production publicitaire assistée par IA, du script au clip vidéo.",
      details: [
        "Un système complet pour produire des publicités à grande échelle : analyse des publicités concurrentes, script, storyboard, image ancre (Nano Banana Pro), puis clip vidéo (Veo).",
        "Il s'appuie sur des assistants IA sur mesure : générateur de scripts en plusieurs phases, banque de hooks basée sur 11 archétypes, générateurs de prompts image et vidéo."
      ],
      tags: ["Google Flow", "Veo", "Nano Banana Pro", "Higgsfield", "Claude"]
    }
  ],

  skills: [
    { label: "Gestion de dépôt & stocks", icon: "warehouse", level: 90 },
    { label: "Sécurité & encadrement", icon: "shield", level: 85 },
    { label: "E-commerce COD", icon: "cart", level: 90 },
    { label: "Meta Ads & acquisition", icon: "target", level: 85 },
    { label: "Production créative IA", icon: "sparkles", level: 85 },
    { label: "Sourcing Alibaba / 1688", icon: "globe", level: 80 }
  ],

  stats: [
    { value: 6, suffix: "+", label: "Ans en logistique" },
    { value: 2000, suffix: "+", label: "Commandes livrées" },
    { value: 3, suffix: "", label: "Marchés actifs" }
  ],

  tools: [
    "Jarvis", "Excel / Google Sheets", "Shopify", "Notion", "Meta Ads Manager",
    "Google Flow", "Veo", "Nano Banana Pro", "Higgsfield", "Supabase", "Claude", "WhatsApp Business"
  ]
};
```

## 4. Sections de la page

### 4.1 Barre de progression

Une barre de 2px en `--accent` est fixée tout en haut de l'écran. Sa largeur suit le pourcentage de défilement de la page.

### 4.2 Barre supérieure (`<header>`)

| Zone | Contenu |
|---|---|
| Gauche | `taglineLeft` sur 2 lignes, en micro-label |
| Centre | Monogramme en SVG : « A » en haut à gauche, « S » en bas à droite, diagonale fine verte |
| Droite | `taglineRight` sur 2 lignes, en micro-label |

Sur mobile, la zone gauche est masquée.

### 4.3 Héros

**Colonne gauche** (la grille fait `1.15fr 1fr`)
- `<h1>` : prénom et nom sur 2 lignes, en majuscules. Chaque lettre est enveloppée dans un `<span>` pour l'animation.
- `headline` en vert.
- `pitch`.
- Trait vert.
- Deux boutons texte :
  - « Me contacter », qui fait défiler jusqu'à `#contact` ;
  - « Télécharger le CV ↓ », masqué si `cvPdf` vaut `null`.

**Colonne droite**
- Un cercle `--accent` en CSS : `aspect-ratio: 1`, `width: 78%`, `border-radius: 50%`, en position absolue.
- Par-dessus, le portrait avec `filter: grayscale(1) contrast(1.05)`.
- Le bas du portrait colle au bas de la section et l'épaule déborde du cercle.
- Si l'image est introuvable, afficher une silhouette SVG grise (`onerror`).

**Indicateur de défilement** : en bas à gauche, un petit trait vertical qui pulse, accompagné du micro-label « DÉFILER ».

### 4.4 Projets phares (fond `--bg-alt`)

- La grille compte 4 colonnes :
  - colonne 1 : label « PROJETS PHARES », la phrase « Des projets construits de zéro, sur le terrain ouest-africain. » et un bouton vert « VOIR TOUS LES PROJETS → » ;
  - colonnes 2 à 4 : les 3 projets `featured`.
- Chaque carte affiche :
  - le numéro (01, 02, 03) ;
  - le nom en majuscules espacées ;
  - la catégorie ;
  - un trait vert ;
  - une image en 4:5.
- Si l'image est introuvable, afficher un bloc `--line` portant le nom du projet en Anton.

### 4.5 Parcours (`#parcours`)

La grille compte 2 colonnes.

**Gauche : « EXPÉRIENCE »**
- Des onglets filtrent les entrées : **Tout · Logistique · Entrepreneuriat · Marketing**.
- Chaque entrée affiche :
  - la période en micro-label vert ;
  - l'intitulé en DM Sans 700, 18px ;
  - « Entreprise · Lieu » ;
  - les 3 premières puces, puis un bouton « Voir plus » pour afficher le reste.

**Droite**
- « FORMATION ».
- « LANGUES ».

### 4.6 Compétences & Impact

**Gauche : « COMPÉTENCES & OUTILS »**
- Chaque ligne contient une icône, le label, une barre de 2px et le pourcentage.

**Droite : « IMPACT & EXPÉRIENCE »**
- Les 3 chiffres, en DM Serif Display 56px, séparés par des filets verticaux.
- Sous les chiffres, l'encadré citation.

**Sous la grille : bandeau d'outils**
- Les `tools` défilent horizontalement en boucle infinie, sous forme de chips (bordure 1px, majuscules, 11px).

### 4.7 Contact (`#contact`, fond `--bg-alt`)

**Colonne 1**
- « TRAVAILLONS ENSEMBLE ».
- Trait vert.
- `availability`.

**Colonne 2**
- **EMAIL** : lien `mailto:`, accompagné d'un bouton « Copier ».
- **WHATSAPP** : lien `https://wa.me/22891073348`.
- **LOCALISATION**.

**Colonne 3**
- Bloc-CTA encadré de vert (`ctaText` et une flèche).
- En dessous, le formulaire, qui ne nécessite aucun serveur (voir 6.8).

**Pied de page**
- « © 2026 Antonn Sassou ».
- Bouton « Haut de page », avec un anneau de progression.

## 5. Animations (`js/animations.js`, GSAP + ScrollTrigger)

| # | Élément | Animation |
|---|---|---|
| 1 | **Intro** (une fois au chargement, 1,6s au total) | Écran `--bg` plein. Le monogramme A/S se dessine : la diagonale s'étend avec `stroke-dashoffset` et les lettres apparaissent en fondu. L'écran remonte ensuite comme un rideau (`yPercent: -100`). Un clic permet de passer l'intro. |
| 2 | **Nom du héros** | Chaque lettre monte depuis un masque (`overflow: hidden`, `yPercent: 110` → 0), décalée de 0,035s, en `power4.out` |
| 3 | **Cercle vert** | `scale` de 0.6 à 1 avec un fondu, sur 0,9s, en même temps que le nom |
| 4 | **Portrait** | Monte de 60px vers 0 avec un fondu, 0,2s après le cercle |
| 5 | **Sous-titre, pitch, trait vert** | Apparition en cascade, chaque trait vert s'étirant de 0 à 60px (`scaleX`) |
| 6 | **Parallaxe douce du héros au scroll** | Le portrait descend de 8 %, le cercle de 4 %, avec `scrub` |
| 7 | **Révélations au scroll** | Les éléments portant `[data-reveal]` passent d'une opacité 0 et d'un y de 24 à leur état visible, une seule fois, avec un décalage de 0,08s entre éléments frères |
| 8 | **Labels de section** | Les lettres s'espacent progressivement (`letter-spacing` de 0.5em à 0.25em) avec un fondu |
| 9 | **Filets séparateurs** | Se dessinent de gauche à droite (`scaleX` 0 → 1) à l'entrée dans l'écran |
| 10 | **Barres de compétences** | Largeur de 0 à `level` % sur 1,1s, avec le pourcentage qui compte en même temps |
| 11 | **Chiffres d'impact** | Compteur de 0 à `value` sur 1,4s ; affichage « 2 000+ » avec une espace insécable comme séparateur de milliers |
| 12 | **Images des projets** | Révélées par un masque qui glisse de bas en haut (`clip-path: inset(100% 0 0 0)` → `inset(0)`) |
| 13 | **Bandeau d'outils** | Défilement continu en boucle (`xPercent`), mis en pause au survol |

**Règle globale** : si `prefers-reduced-motion: reduce` est activé, l'intro et toutes les animations sont désactivées, les valeurs finales s'affichent directement et le contenu est visible immédiatement.

## 6. Interactions (`js/interactions.js`)

### 6.1 Curseur personnalisé (desktop uniquement)

- Point vert de 8px, accompagné d'un cercle de 32px qui le suit avec un léger retard (lerp de 0.15).
- Au survol d'un lien ou d'un bouton, le cercle grossit et passe à 56px.
- Au survol d'une image de projet, le cercle affiche « VOIR ».
- Le curseur est désactivé sur les écrans tactiles (`pointer: coarse`).

### 6.2 Barre supérieure intelligente

- Après 120px, elle devient `sticky` avec un fond `--bg` à 92 % d'opacité et un `backdrop-filter: blur(8px)`.
- Elle se masque quand on descend et réapparaît quand on remonte.

### 6.3 Parallaxe à la souris (héros, desktop)

- Le portrait suit la souris de ±10px et le cercle de ±5px, en sens inverse, avec un lissage.

### 6.4 Cartes projet

- Au survol, l'image zoome à 1.04 et la flèche glisse.
- Au clic, une **modale de projet** s'ouvre en panneau latéral qui glisse depuis la droite. Elle contient :
  - une grande image ;
  - le nom en Anton ;
  - la catégorie en vert ;
  - les `details` ;
  - les `tags` ;
  - la navigation « ← Précédent / Suivant → ».
- La modale se ferme avec la croix, un clic sur le voile ou la touche `Échap`.
- Le focus reste piégé dans la modale tant qu'elle est ouverte, et le défilement de la page est bloqué.
- « VOIR TOUS LES PROJETS » ouvre la même modale en mode **grille** avec les 4 projets.

### 6.5 Carrousel mobile des projets

- Défilement horizontal en `scroll-snap`, chaque carte occupant 80 % de la largeur.
- Des points de pagination sous le carrousel suivent la carte active.

### 6.6 Onglets du parcours

- Au changement d'onglet, les entrées non concernées disparaissent en fondu et les restantes se réorganisent en douceur (technique FLIP de GSAP).
- Un soulignement vert glisse sous l'onglet actif.

### 6.7 « Voir plus » sur les expériences

- Le bloc s'ouvre en accordéon, avec une animation de hauteur.
- Le libellé passe de « Voir plus » à « Voir moins ».

### 6.8 Formulaire de contact (sans serveur)

- Champs :
  - Nom ;
  - Objet, avec une liste : *Opportunité d'emploi · Collaboration · Freelance · Autre* ;
  - Message.
- Deux boutons d'envoi :
  - **« Envoyer sur WhatsApp »**, qui construit le message (« Bonjour Antonn, je suis [Nom]. Objet : [Objet]. [Message] ») et ouvre `https://wa.me/22891073348?text=` suivi du texte encodé ;
  - **« Envoyer par email »**, qui ouvre `mailto:sassouantonn17@gmail.com` avec l'objet et le corps pré-remplis.
- Validation en direct :
  - le nom fait au moins 2 caractères et le message au moins 10 ;
  - le message d'erreur s'affiche sous le champ concerné ;
  - le bordereau du champ passe au rouge sombre `#A33`.
- Un compteur de caractères est affiché sous le message.

### 6.9 Copier l'email

- Au clic sur « Copier », l'adresse est copiée via `navigator.clipboard`.
- Un toast « Email copié ✓ » apparaît en bas pendant 2 secondes.

### 6.10 Bloc-CTA magnétique

- Au survol, le bloc suit légèrement la souris (±6px).
- Le fond devient `--accent` et le texte passe en blanc.
- La flèche glisse.
- Au clic, la page défile jusqu'au formulaire.

### 6.11 Bouton « Haut de page »

- Il apparaît après 600px de défilement.
- Un anneau SVG autour de la flèche se remplit selon la progression.
- Au clic, la page remonte en défilement fluide.

### 6.12 Navigation au clavier

- Tous les éléments interactifs sont accessibles avec `Tab`.
- Un `:focus-visible` affiche un contour de 2px en `--accent`, décalé de 3px.

## 7. Responsive

| Breakpoint | Comportement |
|---|---|
| ≥ 1200px | Mise en page complète, curseur personnalisé, parallaxe souris |
| 768–1199px | Héros en 2 colonnes ; projets en grille 2×2 ; parcours en 1 colonne, avec formation et langues en dessous |
| < 768px | Tout s'empile ; nom à environ 64px ; projets en carrousel ; formulaire en pleine largeur ; pas de curseur ni de parallaxe souris |

Contraintes valables partout :
- aucun scroll horizontal ;
- gouttière minimale de 16px ;
- zones tactiles de 44px minimum.

## 8. Phases d'exécution

**Phase 1 — Squelette**
- Créer l'arborescence et télécharger GSAP, ScrollTrigger et les polices en local.
- Écrire `tokens.css` et `base.css`.
- ✅ Validation : la page vide s'affiche avec les bonnes polices et le bon fond, y compris en ouvrant `index.html` directement.

**Phase 2 — Contenu et rendu**
- Créer `content.js` (section 3, sans modification) et `render.js` pour générer toutes les sections.
- ✅ Validation : tout le contenu s'affiche, sans aucune animation à ce stade.

**Phase 3 — Mise en page**
- Écrire le CSS de toutes les sections.
- ✅ Validation : capture à 1440px comparée à la maquette de référence. Le portrait touche le bas du héros et déborde du cercle.

**Phase 4 — Animations**
- Mettre en place les 13 animations de la section 5.
- ✅ Validation : animations fluides à 60 fps, déclenchées une seule fois, et `prefers-reduced-motion` respecté.

**Phase 5 — Interactions**
- Mettre en place les 12 interactions de la section 6.
- ✅ Validation : tester chaque interaction ; la modale se ferme avec `Échap` ; le formulaire ouvre WhatsApp avec le bon texte.

**Phase 6 — Finitions**
- Vérifier le responsive avec des captures à 1440, 768 et 375px.
- Vérifier l'accessibilité : contraste AA, navigation au clavier, `alt` sur les images, un seul `<h1>`.
- Vérifier qu'aucune erreur n'apparaît dans la console.
- ✅ Validation : score Lighthouse supérieur à 90 en performance, accessibilité et bonnes pratiques, mesuré en local.

## 9. Contraintes (ne pas faire)

- **Aucun déploiement, aucun `git push`, aucune base de données, aucun service externe.**
- Ne pas copier les textes, le nom ni la citation de la maquette de référence : seul le style est repris.
- Ne pas modifier le contenu de `content.js` sans ma demande.
- Pas d'ombres, de dégradés ni de coins arrondis ; pas d'animations à rebond ou exagérées.
- Ne pas intégrer le cercle vert dans l'image du portrait : il reste en CSS.
- Pas de lorem ipsum.
- Pas de lien LinkedIn.

## 10. Éléments qu'Antonn fournit

- [ ] `assets/portrait.png` : portrait détouré, généré avec le prompt JSON `@Antonn_Sassou`.
- [ ] 4 visuels de projets au format 4:5 dans `assets/projets/`.
- [ ] `assets/cv-antonn-sassou.pdf` (optionnel ; sinon, mettre `cvPdf: null` dans `content.js`).
