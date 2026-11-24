import '../styles/Makeup.css';
import { useMemo } from 'react';
import BentoSlider from '../components/BentoSlider';
import DocumentTitleSetter from "../utils/title-setter.ts";
// Looks dans l'ordre d'affichage (file = nom du fichier dans assets/images/makeup, sans extension)
import MAKEUP_LOOKS from '../data/makeupLooks.json';

import { sizeOf, srcSetBuilder } from '../utils/responsive-images';

// Images optimisées en WebP via `npm run optimize:media`, avec leurs versions réduites (w640/…) ;
// miniatures floues de 20 px en JPG.
// import.meta.glob (Vite) liste les fichiers au build : chemin → URL de l'image
const images = import.meta.glob('../assets/images/makeup/*.webp', { eager: true, import: 'default' });
const thumbnails = import.meta.glob('../assets/images/makeup/thumbnails/*-small.{jpg,jpeg,JPG,JPEG}', { eager: true, import: 'default' });
const srcSetOf = srcSetBuilder(import.meta.glob('../assets/images/makeup/w*/*.webp', { eager: true, import: 'default' }));

// Clé commune = nom du fichier sans extension ni suffixe "-small", insensible à la casse
const baseName = (path) => path.split('/').pop().replace(/(-small)?\.[a-z]+$/i, '').toLowerCase();

function indexByName(modules) {
  return Object.fromEntries(Object.entries(modules).map(([path, url]) => [baseName(path), url]));
}

// Formater les images pour le slider (les looks sans image sont ignorés)
function formatImagesForSlider() {
  const full = indexByName(images);
  const small = indexByName(thumbnails);
  const paths = Object.fromEntries(Object.keys(images).map((path) => [baseName(path), path]));

  return MAKEUP_LOOKS
      .filter(({ file }) => full[file.toLowerCase()])
      .map(({ file, title, description }, index) => {
        const key = file.toLowerCase();
        const [width, height] = sizeOf(paths[key]) ?? [];
        return {
          id: index + 1,
          imageSrc: full[key],
          imageSrcSet: srcSetOf(paths[key], full[key]),
          // Proportions : la cellule recadre la photo (cover), sa largeur affichée en dépend
          aspectRatio: width && height ? width / height : undefined,
          imageSrcSmall: small[key] || full[key],
          title,
          description
        };
      });
}

function Makeup() {
  DocumentTitleSetter("Makeup");

  // import.meta.glob en mode eager est synchrone : la liste est prête dès le premier rendu,
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
