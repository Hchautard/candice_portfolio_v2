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
├── scripts/                 # Optimisation des médias, plugin SEO (sitemap, robots.txt, JSON-LD)
├── public/
│   ├── draco/               # Décodeur Draco du modèle 3D (copie de three)
│   ├── hdri/                # Éclairage du modèle 3D
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
│       ├── supabase.ts      # Client Supabase
│       └── title-setter.ts  # Titre d'onglet, description et lien canonique de chaque page
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
| `npm run test:build` | Teste le site construit (politique de sécurité, sitemap) |
| `npm run lint`    | Analyse le code avec ESLint                    |
| `npm run optimize:media` | Convertit les nouvelles images en WebP optimisé |
| `npm run optimize:3d` | Régénère le modèle 3D et son éclairage allégés |

### Ajouter des photos

Déposer les PNG / JPG dans le dossier concerné (`src/assets/images/tattoo`, `tattoo/done`, `makeup`), puis :

```sh
npm run optimize:media
```

Chaque image est redimensionnée et remplacée par un `.webp` (quelques centaines de Ko au lieu de plusieurs Mo). L'original haute définition est rangé dans `media-originals/`, ignoré par git. Pour un nouveau fond de page utilisé en CSS, l'ajouter à la liste `only` dans `scripts/optimize-media.mjs`.

Pour les flashs, les réalisations et le makeup, la commande prépare aussi des versions réduites (sous-dossiers `w400/`, `w560/`, `w640/`…) et note la taille de chaque photo dans `src/assets/images/sizes.json`. Le site les propose au navigateur (`srcset`), qui télécharge la plus légère restant nette : sur la page Tattoo, de 20 % (Mac Retina) à 60 % (écran d'ordinateur standard) d'images en moins. Ces dossiers et ce fichier sont à committer avec les photos.

Pour une nouvelle vidéo (720p, ~1 Mb/s, lecture progressive) :

```sh
ffmpeg -i source.mp4 -vf "scale=720:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart src/assets/video/vid_project.mp4
```

### Modèle 3D de l'accueil

Le modèle (`public/models/tattoo_machine/scene-v3.glb`), son éclairage (`public/hdri/`) et le décodeur Draco (`public/draco/`) sont servis par le site lui-même, sans CDN tiers. `npm run optimize:3d` les produit à partir des sources rangées dans `media-originals/` (voir l'en-tête de `scripts/optimize-3d.mjs`) : rendu identique à l'original, pour 1,9 Mo au lieu de 4,2 Mo.

Le modèle est sous licence CC BY 4.0 : le crédit de son auteur, dans le pied de page, doit rester.

### Actualités

Elles s'écrivent dans Supabase (table `news`) et s'affichent en bas de la page Le salon, de la plus récente à la plus ancienne : les six premières, puis un bouton pour les autres. Chacune a sa page (`/news/:id`), suivie de trois autres actualités.

| Colonne       | Contenu                                                                                          |
| :------------ | :----------------------------------------------------------------------------------------------- |
| `title`       | Titre                                                                                            |
| `description` | Résumé d'une ou deux phrases, affiché dans la liste                                              |
| `content`     | Texte de la page, en Markdown : `**gras**`, `## Intertitre`, `- ` pour une liste. Un retour à la ligne reste un retour à la ligne |
| `category`    | `Événement`, `Création` ou `Illustration`                                                        |
| `date_event`  | Date de l'événement ou de la nouveauté. Vide tant qu'elle n'est pas fixée : un événement affiche alors « Date à venir » |
| `location`    | Lieu (facultatif)                                                                                |
| `image`       | Photo (facultatif) : son adresse publique sur Supabase Storage ou Cloudinary. Une autre adresse est bloquée par la politique de sécurité (`render.yaml`). Sans photo, l'actualité s'affiche en texte seul |

### Tests E2E (Playwright)

```sh
npx playwright install   # À faire une seule fois
npx playwright test      # Lance tous les tests
npx playwright test --ui # Mode interactif
npm run test:build       # Site construit : politique de sécurité de render.yaml, sitemap
```

Playwright démarre lui-même le serveur de dev (`npm start`), ou réutilise celui déjà lancé sur le port 3000. Les tests ne contactent jamais la vraie base : `playwright.config.ts` pointe Supabase vers une adresse factice du serveur de dev, et `tests/news.spec.ts` y répond avec des actualités et des avis de test (tri, page détail, Markdown, panne). Ailleurs, personne ne répond et le site affiche « actualités indisponibles », comme pendant une panne.

`tests/contact.spec.ts` remplit et envoie le formulaire (question, demande tatouage avec image, erreurs, « Adopter ce flash ») : les appels à EmailJS et Cloudinary sont interceptés, aucun message ni image ne part. Le serveur lancé par Playwright reçoit des clés factices (`playwright.config.ts`).

---

## Configuration

Les clés sont lues dans `.env` (ignoré par git). Le modèle `.env.example` liste les variables utilisées par le code :

| Variables                                  | Service    | Sert à                                        |
| :----------------------------------------- | :--------- | :-------------------------------------------- |
| `REACT_APP_EMAILJS_*` (4)                  | EmailJS    | Envoyer le formulaire de contact              |
| `REACT_APP_CLOUDINARY_*` (2)               | Cloudinary | Héberger les images jointes à une demande     |
| `REACT_APP_SUPABASE_*` (2)                 | Supabase   | Lire les actualités et les avis               |
| `REACT_APP_SITE_URL`                       | —          | URL publique : image de partage, liens canoniques, sitemap |

Toutes les variables `REACT_APP_*` finissent dans le JavaScript public : n'y mettre que des clés publiques. Sans `.env`, le site fonctionne sans actualités, sans avis et sans envoi de formulaire.

---

## Mise en ligne

- Le site est un « Static Site » Render, décrit par `render.yaml` (Render ne lit pas les fichiers `_redirects` et `_headers` de Netlify) :
  - toutes les URL servent `index.html` : le routage se fait côté navigateur, et les adresses inconnues affichent la page 404 du site ;
  - en-têtes de sécurité sur toutes les adresses, et cache d'un an pour les fichiers de `build/assets/`, dont le nom change à chaque modification ;
  - politique de sécurité (CSP) : elle liste les seuls services externes permis (Supabase, EmailJS, Cloudinary). Pour en ajouter un (police en ligne, vidéo YouTube, statistiques…), y ajouter son adresse, sinon le navigateur le bloque. `npm run test:build` vérifie chaque page du build avec cette politique, en CI aussi.
- Rattacher `render.yaml` au site, une seule fois : dans Render, **New → Blueprint**, puis ce dépôt. Render l'applique au site dont le nom est celui du champ `name` ; avec un autre nom, il créerait un second site. Vérifier la liste des changements avant **Deploy Blueprint**. Ensuite, chaque modification de `render.yaml` arrivée sur `main` est appliquée seule ; les variables d'environnement du tableau de bord sont conservées.
- Les variables de `.env` doivent aussi être définies chez l'hébergeur, puisqu'elles sont lues au moment du build.
- Définir `REACT_APP_SITE_URL` (par exemple `https://mon-domaine.fr`) chez l'hébergeur. Elle sert à tout ce qui exige une adresse absolue :
  - l'aperçu des liens partagés sur les réseaux (`og:image`, `public/og-image.jpg`) ;
  - le lien canonique de chaque page (`src/utils/title-setter.ts`), qui évite que `/home` et `/` comptent comme deux pages ;
  - `sitemap.xml` et la ligne `Sitemap:` de `robots.txt`, générés au build par `scripts/seo-plugin.mjs`, avec la fiche « salon de tatouage » (schema.org, JSON-LD) insérée dans `index.html`.

  Sans elle, le build réussit mais avertit : pas de sitemap ni de lien canonique. Une fois le site en ligne, déclarer `https://mon-domaine.fr/sitemap.xml` dans Google Search Console.
- Le sitemap liste les pages fixes et les actualités (`/news/:id`), lues dans Supabase au moment du build avec les mêmes clés que le site. Une actualité ajoutée ou supprimée dans Supabase n'y change qu'au déploiement suivant : dans Render, **Manual Deploy → Deploy latest commit**. Si Supabase ne répond pas pendant le build, le site est quand même publié, avec un sitemap sans actualités (avertissement dans le journal du build).
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