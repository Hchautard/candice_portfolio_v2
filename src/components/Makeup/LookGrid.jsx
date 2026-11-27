import PropTypes from 'prop-types';
import { fullTitle, lookShape, photosLabel } from './look';

// Version sans mouvement du carrousel (réglage « réduire les animations » du système) :
// une grille de looks, chacun ouvre ses photos.

// Largeur d'une carte de la grille (Makeup.css, .look-grid) : 2 colonnes sur téléphone
const CARD_SIZES = '(max-width: 600px) 50vw, 300px';

LookGrid.propTypes = {
    looks: PropTypes.arrayOf(lookShape).isRequired,
    onOpen: PropTypes.func.isRequired,
};

export default function LookGrid({ looks, onOpen }) {
    return (
        <ul className="look-grid" aria-label="Looks maquillage">
            {looks.map((look) => {
                const cover = look.photos[0];
                return (
                    <li key={look.id}>
                        <button
                            type="button"
                            className="look-grid__card"
                            aria-label={`${fullTitle(look)} : ${photosLabel(look).toLowerCase()}`}
                            onClick={() => onOpen(look)}
                        >
                            <img
                                className="look-grid__photo"
                                src={cover.src}
                                srcSet={cover.srcSet}
                                sizes={cover.srcSet && CARD_SIZES}
                                width={cover.width}
                                height={cover.height}
                                style={look.focus ? { objectPosition: look.focus } : undefined}
                                alt=""
                                loading="lazy"
                                decoding="async"
                            />
                            <span className="look-grid__caption">
                                {look.series && <span className="look-title__series">{look.series}</span>}
                                <span className="look-grid__title">{look.title}</span>
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
