import '../styles/Makeup.css';
import { useMemo } from 'react';
import BentoSlider from '../components/BentoSlider';
import DocumentTitleSetter from "../utils/title-setter.ts";

// Images optimisées en WebP via `npm run optimize:media` ; miniatures floues de 20 px en JPG
const images = require.context('../assets/images/makeup', false, /\.webp$/);
const thumbnails = require.context('../assets/images/makeup/thumbnails', false, /-small\.jpe?g$/i);

// Clé commune = nom du fichier sans extension ni suffixe "-small", insensible à la casse
const baseName = (key) => key.replace('./', '').replace(/(-small)?\.[a-z]+$/i, '').toLowerCase();

function indexByName(context) {
  return Object.fromEntries(context.keys().map(key => [baseName(key), context(key)]));
}

// Données des images avec titres et descriptions (clé = nom du fichier sans extension)
const imageData = {
  'flora_1': {
    title: "Magic Garden : La princesse",
    description: "Discover our collection of organic makeup products"
  },
  'flora_2': {
    title: "Magic Garden : La princesse",
    description: "Professional-grade brushes and applicators"
  },
  'alice_1': {
    title: "Allo Docteur Love : l'enivrante",
    description: "Express yourself with vibrant, long-lasting pigments"
  },
  'karole_1': {
    title: "Magic Garden : La sirène",
    description: "Makeup that nourishes your skin while enhancing your beauty"
  },
  'mira_1': {
    title: "Magic Garden : L'elfe",
    description: "Explore our exclusive seasonal palette with unique textures and finishes"
  },
  'karole_2': {
    title: "Portal",
    description: "Sustainable beauty products in recyclable packaging"
  },
  'song_1': {
    title: "Allo Docteur Love : la briseuse de coeur",
    description: "Inclusive shade ranges for all complexions"
  },
  'perles_1': {
    title: "Glam",
    description: "Free from harmful ingredients, gentle on sensitive skin"
  },
  'karole_3': {
    title: "Portal défilé POZ",
    description: "Just launched products to elevate your makeup routine"
  },
  'candice_1': {
    title: "Ice look",
    description: "Learn techniques from our expert makeup artists"
  },
  'carte_1': {
    title: "La reine de coeur",
    description: "Our most loved products that customers can't get enough of"
  },
  'ziggy_1': {
    title: "Look David Bowie",
    description: "Our most loved products that customers can't get enough of"
  },
  'hematome_1': {
    title: "Hématome",
    description: "Perfect combinations for gifting or trying something new"
  },
  'Clown': {
    title: "Clown",
    description: "Bold and creative clown makeup artistry"
  },
  'Pink_spider': {
    title: "Pink Spider",
    description: "Mystical spider-inspired pink makeup"
  },
  'Bloody_Mary': {
    title: "Bloody Mary",
    description: "Dramatic horror-inspired makeup look"
  },
  'fleau': {
    title: "Fléau",
    description: "Dark and haunting makeup creation"
  },
  'Zombie': {
    title: "Zombie",
    description: "Realistic zombie makeup effects"
  },
  'Blue2': {
    title: "Blue Avatar",
    description: "Fantasy blue character makeup"
  },
  'Goth': {
    title: "Gothic",
    description: "Classic gothic makeup style"
  },
  'Operetta': {
    title: "Operetta",
    description: "Theatrical operetta-inspired look"
  },
  'Freddy': {
    title: "Freddy",
    description: "Horror movie character makeup"
  },
  'Pearl': {
    title: "Pearl",
    description: "Elegant pearl-inspired makeup"
  },
  'Pearl2': {
    title: "Pearl 2",
    description: "Another pearl-inspired variation"
  },
  'Blue': {
    title: "Blue Dreams",
    description: "Dreamy blue makeup artistry"
  },
  'Chrome': {
    title: "Chrome",
    description: "Futuristic chrome makeup effect"
  },
};

// Ordre d'affichage
const displayOrder = [
  'flora_1',
  'alice_1',
  'karole_1',
  'mira_1',
  'karole_2',
  'song_1',
  'flora_2',
  'perles_1',
  'karole_3',
  'candice_1',
  'carte_1',
  'ziggy_1',
  'hematome_1',
  'Clown',
  'Pink_spider',
  'Bloody_Mary',
  'fleau',
  'Zombie',
  'Blue2',
  'Goth',
  'Operetta',
  'Freddy',
  'Pearl',
  'Pearl2',
  'Blue',
  'Chrome'
];

// Formater les images pour le slider
function formatImagesForSlider() {
  const full = indexByName(images);
  const small = indexByName(thumbnails);

  return displayOrder
      .map((name, index) => {
        const key = name.toLowerCase();
        if (!full[key] || !imageData[name]) return null;

        return {
          id: index + 1,
          imageSrc: full[key],
          imageSrcSmall: small[key] || full[key],
          title: imageData[name].title,
          description: imageData[name].description
        };
      })
      .filter(img => img !== null);
}

function Makeup() {
  DocumentTitleSetter("Makeup");

  // require.context est synchrone : la liste est prête dès le premier rendu,
  // les miniatures + LazyImage gèrent le chargement progressif des visuels
  const sliderImages = useMemo(() => formatImagesForSlider(), []);

  return (
      <div className="makeup-container">
        <h1 className="sr-only">Portfolio Makeup & Maquillage Artistique — L&apos;Anomalie</h1>
        <BentoSlider images={sliderImages} />
      </div>
  );
}

export default Makeup;
