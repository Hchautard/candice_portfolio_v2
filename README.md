# L'Anomalie — Portfolio de Tatoueuse

Portfolio de Candice, tatoueuse indépendante basée à Saint-Rémy-de-Provence, spécialisée dans les styles **cyber-sigilism**, **gothique** et **dark fantasy**.

Construit avec **React**, **Three.js**, **Framer Motion** et **Supabase**.

---

## Démarrage rapide

```sh
npm install
npm start
```

L'app tourne sur **http://localhost:3000** par défaut.

---

## Structure du projet

```
/
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
│   ├── pages/               # Pages principales (Home, Tattoo, Makeup, Contact, Project)
│   ├── services/
│   │   └── database/        # Requêtes Supabase (reviews, news)
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
| `npm start`       | Lance le serveur de dev sur `localhost:3000`   |
| `npm run build`   | Build le site dans `./build/`                  |
| `npm test`        | Lance les tests Jest en mode watch             |
| `npm run lint`    | Analyse le code avec ESLint                    |

### Tests E2E (Playwright)

```sh
npx playwright install   # À faire une seule fois
npx playwright test      # Lance tous les tests
npx playwright test --ui # Mode interactif
```

---

## Pages principales

| Route        | Description                                       |
| :----------- | :------------------------------------------------ |
| `/`          | Accueil avec modèle 3D de machine à tatouer       |
| `/tattoo`    | Galerie de flashs avec distribution de cartes     |
| `/makeup`    | Galerie makeup en bento slider                    |
| `/project`   | Présentation du futur salon L'Anomalie            |
| `/contact`   | Formulaire de contact (général ou demande tattoo) |

---

## Stack technique

- [React 19](https://react.dev) — framework principal
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org) — modèle 3D
- [Framer Motion](https://www.framer.com/motion/) — animations de page
- [GSAP](https://gsap.com) — animation de distribution des cartes
- [Supabase](https://supabase.com) — base de données (avis clients, actualités)
- [EmailJS](https://www.emailjs.com) — envoi du formulaire de contact sans backend
- [Cloudinary](https://cloudinary.com) — upload des images de référence tatouage
- [Tailwind CSS](https://tailwindcss.com) — utilitaires CSS
- [Playwright](https://playwright.dev) — tests E2E