// Versions réduites des photos (sous-dossiers w400/, w560/… à côté de chaque photo) et taille des
// photos entières, produites par `npm run optimize:media`. Proposées au navigateur via srcset, elles
// lui permettent de télécharger la plus légère qui reste nette sur l'écran du visiteur.
import SIZES from '../assets/images/sizes.json';

// Clé commune à une photo et à ses versions : chemin depuis assets/images, sans dossier de version
// ('../assets/images/tattoo/w400/Hache.webp' → 'tattoo/Hache.webp')
const keyOf = (globPath) => globPath.replace(/^(?:\.\.\/)+assets\/images\//, '').replace(/\/w\d+\//, '/');

// [largeur, hauteur] de la photo entière
export const sizeOf = (globPath) => SIZES[keyOf(globPath)];

// `variants` : résultat d'un import.meta.glob sur les dossiers w*/ (Vite n'accepte que des motifs
// écrits en dur, chaque page déclare donc les siens). Renvoie (chemin, url) → srcset, ou undefined
// si la photo n'a pas de version réduite.
export function srcSetBuilder(variants) {
    const reduced = {};
    for (const [globPath, url] of Object.entries(variants)) {
        const width = /\/w(\d+)\/[^/]+$/.exec(globPath)?.[1];
        if (width) (reduced[keyOf(globPath)] ??= []).push(`${url} ${width}w`);
    }

    return (globPath, url) => {
        const key = keyOf(globPath);
        if (!reduced[key] || !SIZES[key]) return undefined;
        return [...reduced[key], `${url} ${SIZES[key][0]}w`].join(', ');
    };
}
