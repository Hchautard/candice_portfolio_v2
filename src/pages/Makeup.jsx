import '../styles/Makeup.css';
import { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import DocumentTitleSetter from "../utils/title-setter.ts";
import LookRing from '../components/Makeup/LookRing';
import LookGrid from '../components/Makeup/LookGrid';
import LookDialog from '../components/Makeup/LookDialog';
import DragSection from '../components/Makeup/DragSection';
// Looks dans l'ordre d'affichage, un par carte. photos : fichiers de assets/images/makeup, sans
// extension, la première sert de couverture. series (facultatif) : collection, affichée au-dessus
// du titre. focus (facultatif) : point de la couverture gardé quand la carte la recadre.
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

// Looks avec leurs photos (versions, miniature, dimensions). Une photo introuvable est ignorée,
// un look sans aucune photo aussi.
function buildLooks() {
  const full = indexByName(images);
  const small = indexByName(thumbnails);
  const paths = Object.fromEntries(Object.keys(images).map((path) => [baseName(path), path]));

  const photoOf = (file) => {
    const key = file.toLowerCase();
    if (!full[key]) return null;
    const [width, height] = sizeOf(paths[key]) ?? [];
    return {
      src: full[key],
      srcSet: srcSetOf(paths[key], full[key]),
      srcSmall: small[key] || full[key],
      width,
      height,
    };
  };

  return MAKEUP_LOOKS
      .map(({ series, title, focus, photos }, index) => ({
        id: index + 1,
        series,
        title,
        focus,
        photos: photos.map(photoOf).filter(Boolean),
      }))
      .filter((look) => look.photos.length > 0);
}

// import.meta.glob en mode eager est synchrone : la liste est prête dès le chargement de la page
const LOOKS = buildLooks();

function Makeup() {
  DocumentTitleSetter("Makeup", {
    description: "Maquillage artistique par Candice à Montpellier : looks fantastiques, effets spéciaux (zombie, hématome, clown), glam, défilés et drag.",
  });

  // « Réduire les animations » demandé par le système : grille fixe au lieu du cylindre qui tourne
  const reduceMotion = useReducedMotion();
  const [openLook, setOpenLook] = useState(null);
  const Gallery = reduceMotion ? LookGrid : LookRing;

  return (
      <div className="makeup-container">
        <h1 className="sr-only">Portfolio Makeup & Maquillage Artistique — L&apos;Anomalie</h1>
        {LOOKS.length > 0
            ? (
                <Gallery looks={LOOKS} onOpen={setOpenLook}>
                  {/* Le cylindre occupe une dizaine d'écrans de défilement : raccourci vers le drag */}
                  <a className="makeup-skip" href="#drag">Aller au volet drag</a>
                </Gallery>
            )
            : <p className="makeup-empty">Aucun look à afficher pour le moment.</p>}
        <DragSection />
        <LookDialog look={openLook} onClose={() => setOpenLook(null)} />
      </div>
  );
}

export default Makeup;
