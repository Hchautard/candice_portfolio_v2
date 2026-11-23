import '../styles/Makeup.css';
import { useMemo } from 'react';
import BentoSlider from '../components/BentoSlider';
import DocumentTitleSetter from "../utils/title-setter.ts";
// Looks dans l'ordre d'affichage (file = nom du fichier dans assets/images/makeup, sans extension)
import MAKEUP_LOOKS from '../data/makeupLooks.json';

// Images optimisées en WebP via `npm run optimize:media` ; miniatures floues de 20 px en JPG
const images = require.context('../assets/images/makeup', false, /\.webp$/);
const thumbnails = require.context('../assets/images/makeup/thumbnails', false, /-small\.jpe?g$/i);

// Clé commune = nom du fichier sans extension ni suffixe "-small", insensible à la casse
const baseName = (key) => key.replace('./', '').replace(/(-small)?\.[a-z]+$/i, '').toLowerCase();

function indexByName(context) {
  return Object.fromEntries(context.keys().map(key => [baseName(key), context(key)]));
}

// Formater les images pour le slider (les looks sans image sont ignorés)
function formatImagesForSlider() {
  const full = indexByName(images);
  const small = indexByName(thumbnails);

  return MAKEUP_LOOKS
      .filter(({ file }) => full[file.toLowerCase()])
      .map(({ file, title, description }, index) => {
        const key = file.toLowerCase();
        return {
          id: index + 1,
          imageSrc: full[key],
          imageSrcSmall: small[key] || full[key],
          title,
          description
        };
      });
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
