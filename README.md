# L'Anomalie — Portfolio de Tatoueuse

Portfolio de Candice, tatoueuse indépendante basée à Montpellier, spécialisée dans les styles **cyber-sigilism**, **gothique** et **dark fantasy**.

Construit avec **React** et **Vite**, **Three.js**, **Motion** et **Supabase**.

---

## Démarrage rapide

Node **22** (version fixée dans `.nvmrc`, `nvm use` la sélectionne) ; Vite demande au minimum Node 20.19.

```sh
npm install
cp .env.example .env   # puis remplir les clés (voir « Configuration »)
npm start
```

L'app tourne sur **http://localhost:3000** par défaut.

---

## Structure du projet

```
/
├── index.html               # Page HTML (balises SEO / partage), point d'entrée de Vite
├── vite.config.js           # Build, port 3000, préfixe REACT_APP_ des variables
├── public/
│   └── models/              # Modèles 3D (.glb)
├── src/
│   ├── assets/
│   │   ├── fonts/           # Polices Alice Wonderland & Coolvetica
│   │   ├── images/          # Backgrounds, photos tattoo & makeup
│   │   └── video/           # Vidéo projet shop
│   ├── components/          # Composants réutilisables
│   │   ├── BentoSlider.jsx  # Galerie makeup en grille responsive
│   │   ├── CardDistribution # Cartes tattoo distribuées avec GSAP
│   │   ├── ContactForm.js   # Formulaire de contact (défaut + tatouage)
│   │   ├── Header.js        # Navigation avec menu burger mobile
│   │   ├── LazyImage.js     # Lazy loading avec blur placeholder
│   │   └── NewsSection.js   # Section actualités animée
│   ├── contexts/
│   │   └── DataContext.js   # Chargement centralisé Supabase (news, avis)
│   ├── data/                # Contenus en JSON/JS (looks makeup, flashs, transcription vidéo)
│   ├── pages/               # Pages (Home, Tattoo, Makeup, Contact, Project, NewsDetail, NotFound)
│   ├── services/
│   │   └── database/        # Requêtes Supabase (reviews, news)
│   ├── index.jsx            # Point d'entrée : routes (chargées à la demande) et mise en page
│   ├── styles/              # CSS par page/composant
│   └── utils/
│       └── supabase.ts      # Client Supabase
└── tests/                   # Tests E2E Playwright
```

---

## Commandes disponibles

| Commande          | Action                                         |
| :---------------- | :--------------------------------------------- |
| `npm install`     | Installe les dépendances                       |
| `npm start`       | Lance le serveur de dev Vite sur `localhost:3000` |
| `npm run build`   | Build le site dans `./build/`                  |
| `npm run preview` | Sert le build en local sur `localhost:4173`    |
| `npm test`        | Lance les tests E2E Playwright                 |
| `npm run lint`    | Analyse le code avec ESLint                    |
| `npm run optimize:media` | Convertit les nouvelles images en WebP optimisé |

### Ajouter des photos

Déposer les PNG / JPG dans le dossier concerné (`src/assets/images/tattoo`, `tattoo/done`, `makeup`, `news`), puis :

```sh
npm run optimize:media
```

Chaque image est redimensionnée et remplacée par un `.webp` (quelques centaines de Ko au lieu de plusieurs Mo). L'original haute définition est rangé dans `media-originals/`, ignoré par git. Pour un nouveau fond de page utilisé en CSS, l'ajouter à la liste `only` dans `scripts/optimize-media.mjs`.

Pour une nouvelle vidéo (720p, ~1 Mb/s, lecture progressive) :

```sh
ffmpeg -i source.mp4 -vf "scale=720:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart src/assets/video/vid_project.mp4
```

### Tests E2E (Playwright)

```sh
npx playwright install   # À faire une seule fois
npx playwright test      # Lance tous les tests
npx playwright test --ui # Mode interactif
```

Playwright démarre lui-même le serveur de dev (`npm start`), ou réutilise celui déjà lancé sur le port 3000. Les tests ne dépendent pas de Supabase : sans `.env`, le site s'affiche simplement sans actualités ni avis (c'est le cas en CI).

---

## Configuration

Les clés sont lues dans `.env` (ignoré par git). Le modèle `.env.example` liste les variables utilisées par le code :

| Variables                                  | Service    | Sert à                                        |
| :----------------------------------------- | :--------- | :-------------------------------------------- |
| `REACT_APP_EMAILJS_*` (4)                  | EmailJS    | Envoyer le formulaire de contact              |
| `REACT_APP_CLOUDINARY_*` (2)               | Cloudinary | Héberger les images jointes à une demande     |
| `REACT_APP_SUPABASE_*` (2)                 | Supabase   | Lire les actualités et les avis               |
| `REACT_APP_SITE_URL`                       | —          | URL publique du site, pour l'image de partage |

Toutes les variables `REACT_APP_*` finissent dans le JavaScript public : n'y mettre que des clés publiques. Sans `.env`, le site fonctionne sans actualités, sans avis et sans envoi de formulaire.

---

## Mise en ligne

- `public/_redirects` renvoie toutes les URL vers `index.html` (format Netlify) : le routage se fait côté navigateur, et les adresses inconnues affichent la page 404 du site.
- Les variables de `.env` doivent aussi être définies chez l'hébergeur, puisqu'elles sont lues au moment du build.
- Pour que l'aperçu des liens partagés (`og:image`, `public/og-image.jpg`) fonctionne sur les réseaux sociaux, définir `REACT_APP_SITE_URL` (par exemple `https://mon-domaine.fr`) chez l'hébergeur : les réseaux exigent une adresse absolue, `vite.config.js` l'insère dans `index.html` au build.
- Commande de build `npm run build`, dossier publié `build/` (inchangés depuis Create React App).
- Version de Node : `.nvmrc` (22), lu par Render et par la CI, sauf si une variable `NODE_VERSION` est définie dans le tableau de bord de Render (elle passe avant). Avec un Node plus ancien que 20.19, le build Vite échoue.

---

## Pages principales

| Route        | Description                                       |
| :----------- | :------------------------------------------------ |
| `/`          | Accueil avec modèle 3D de machine à tatouer       |
| `/tattoo`    | Galerie de flashs avec distribution de cartes     |
| `/makeup`    | Galerie makeup en bento slider                    |
| `/project`   | Présentation du futur salon L'Anomalie            |
| `/contact`   | Formulaire de contact (général ou demande tattoo) |
| `/news/:id`  | Détail d'une actualité                            |

---

## Stack technique

- [React 19](https://react.dev) — framework principal
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org) — modèle 3D
- [Motion](https://motion.dev) (ex-Framer Motion) — animations de page
- [GSAP](https://gsap.com) — animation de distribution des cartes
- [Supabase](https://supabase.com) — base de données (avis clients, actualités)
- [EmailJS](https://www.emailjs.com) — envoi du formulaire de contact sans backend
- [Cloudinary](https://cloudinary.com) — upload des images de référence tatouage
- [Tailwind CSS](https://tailwindcss.com) — utilitaires CSS
- [Playwright](https://playwright.dev) — tests E2E