// Volet drag de la page Makeup (components/Makeup/DragSection.jsx).

// Photos et vidéos du drag. Sans `src`, un miroir de loge vide annonce le contenu à venir.
// Pour en publier une : déposer le fichier dans src/assets/images/makeup/drag/ (photo, puis
// npm run optimize:media) ou src/assets/video/ (vidéo), l'importer ici et le passer en `src`.
// kind : 'photo' ou 'video' ; label : ce que montre le média (texte alternatif d'une photo).
// Une vidéo vient avec ses sous-titres : fichier .vtt importé ici et passé en `captions` (et
// `poster`, l'image affichée avant la lecture).
export const DRAG_MEDIA = [
    { id: 'look', kind: 'photo', label: 'Un look drag complet' },
    { id: 'avant-apres', kind: 'photo', label: 'Avant, après' },
    { id: 'transformation', kind: 'video', label: 'La transformation, en vidéo' },
];

// Ce que Candice propose autour du drag. action.to : page du site ; action.instagram : conversation
// Instagram (nouvel onglet).
export const DRAG_INITIATIVES = [
    {
        id: 'cours',
        title: 'Cours de maquillage drag',
        text: 'Construire un visage de scène : sourcils effacés, contouring marqué, regard agrandi, faux cils et strass. Au programme du niveau Confirmé de mes cours.',
        action: { label: 'Demander les prochaines dates', to: '/contact' },
    },
    {
        id: 'accessoires',
        title: 'Coiffes et accessoires de scène',
        text: 'Couronnes, coiffes et bijoux de visage fabriqués à la main, pensés pour tenir toute une performance.',
        action: { label: 'Me parler de votre pièce', instagram: true },
    },
    {
        id: 'collaborations',
        title: 'Collaborations à Montpellier',
        text: "Shootings, soirées, défilés : je veux travailler avec les artistes drag d'ici. Vous performez ? Écrivez-moi.",
        action: { label: "M'écrire sur Instagram", instagram: true },
    },
];
