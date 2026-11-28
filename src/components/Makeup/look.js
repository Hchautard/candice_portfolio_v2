import PropTypes from 'prop-types';

// Un look : ses photos (la première sert de couverture), son titre et sa collection éventuelle.
// Construit dans pages/Makeup.jsx à partir de data/makeupLooks.json.
export const photoShape = PropTypes.shape({
    src: PropTypes.string.isRequired,
    srcSet: PropTypes.string,
    srcSmall: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
});

export const lookShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    series: PropTypes.string,
    title: PropTypes.string.isRequired,
    // Point de la couverture gardé quand la carte la recadre (object-position)
    focus: PropTypes.string,
    photos: PropTypes.arrayOf(photoShape).isRequired,
});

/** « Magic Garden : La princesse », ou le titre seul */
export const fullTitle = ({ series, title }) => (series ? `${series} : ${title}` : title);

/** Libellé du bouton qui ouvre les photos d'un look */
export const photosLabel = ({ photos }) => (photos.length > 1 ? `Voir les ${photos.length} photos` : 'Voir la photo');
