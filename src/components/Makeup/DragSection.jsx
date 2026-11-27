import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { INSTAGRAM } from '../../data/social';
import { DRAG_INITIATIVES, DRAG_MEDIA } from '../../data/drag';

// Volet drag de la page Makeup, sous les looks : photos et vidéos dans des miroirs de loge
// (vides tant qu'elles n'existent pas), puis ce que Candice propose autour du drag.
// Contenus : src/data/drag.js.

export default function DragSection() {
    return (
        <section id="drag" className="drag" aria-labelledby="drag-title">
            <div className="drag__intro">
                <h2 id="drag-title" className="drag__title">Drag</h2>
                <p className="drag__lead">
                    Mes looks drag arrivent bientôt ici, en photos et en vidéos. En attendant, voici ce que je propose autour du drag.
                </p>
            </div>

            <ul className="drag__mirrors">
                {DRAG_MEDIA.map((media) => (
                    <li key={media.id} className="drag-mirror">
                        <div className="drag-mirror__glass">
                            <DragMedia media={media} />
                        </div>
                    </li>
                ))}
            </ul>

            <ul className="drag__initiatives">
                {DRAG_INITIATIVES.map(({ id, title, text, action }) => (
                    <li key={id} className="drag-initiative">
                        <h3 className="drag-initiative__title">{title}</h3>
                        <p className="drag-initiative__text">{text}</p>
                        {action.to ? (
                            <Link className="drag-initiative__action" to={action.to}>{action.label}</Link>
                        ) : (
                            <a className="drag-initiative__action" href={INSTAGRAM.dmUrl} target="_blank" rel="noopener noreferrer">
                                {action.label}
                                <span className="sr-only"> (Instagram, nouvel onglet)</span>
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

/** Photo ou vidéo publiée, sinon l'annonce de ce qui viendra dans ce miroir */
function DragMedia({ media }) {
    if (media.src && media.kind === 'video') {
        return (
            <video className="drag-mirror__media" src={media.src} poster={media.poster} controls preload="none" aria-label={media.label}>
                {/* Sous-titres (.vtt) : les paroles et les sons pour qui ne peut pas les entendre */}
                <track kind="captions" src={media.captions} srcLang="fr" label="Français" default />
            </video>
        );
    }
    if (media.src) {
        return <img className="drag-mirror__media" src={media.src} alt={media.label} loading="lazy" decoding="async" />;
    }
    return (
        <p className="drag-mirror__soon">
            <span className="drag-mirror__label">{media.label}</span>
            <span className="drag-mirror__status">{media.kind === 'video' ? 'Vidéo à venir' : 'Photo à venir'}</span>
        </p>
    );
}

DragMedia.propTypes = {
    media: PropTypes.shape({
        kind: PropTypes.oneOf(['photo', 'video']).isRequired,
        label: PropTypes.string.isRequired,
        src: PropTypes.string,
        poster: PropTypes.string,
        captions: PropTypes.string,
    }).isRequired,
};
