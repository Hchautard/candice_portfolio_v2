import { useEffect, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { fullTitle, lookShape } from './look';

// Photos d'un look, en grand, dans une fenêtre <dialog> : Échap, le bouton ou un clic à côté
// la ferment, et le navigateur rend ensuite la main à l'élément qui l'avait ouverte.

// Hauteur des photos (Makeup.css, .look-dialog__photo) : sert à choisir leur version (srcset)
const PHOTO_HEIGHT_VH = 72;
const PHOTO_MAX_HEIGHT = 900;

function photoSizes({ width, height }) {
    if (!width || !height) return '100vw';
    const ratio = width / height;
    return `min(${(PHOTO_HEIGHT_VH * ratio).toFixed(1)}vh, ${Math.round(PHOTO_MAX_HEIGHT * ratio)}px, calc(100vw - 72px))`;
}

LookDialog.propTypes = {
    look: lookShape,
    onClose: PropTypes.func.isRequired,
};

export default function LookDialog({ look, onClose }) {
    const dialogRef = useRef(null);
    const titleId = useId();
    // Dernier look ouvert : son contenu reste affiché pendant que la fenêtre se ferme
    const [shown, setShown] = useState(look);
    if (look && look !== shown) setShown(look);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (look && !dialog.open) dialog.showModal();
        if (!look && dialog.open) dialog.close();
    }, [look]);

    return (
        <dialog
            ref={dialogRef}
            className="look-dialog"
            aria-labelledby={titleId}
            onClose={onClose}
            // Clic sur le fond (la fenêtre n'a pas de marge intérieure : seul le fond la touche)
            onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
        >
            {shown && (
                <div className="look-dialog__inner">
                    <header className="look-dialog__header">
                        <div>
                            {shown.series && <p className="look-dialog__series">{shown.series}</p>}
                            <h2 id={titleId} className="look-dialog__title">{shown.title}</h2>
                        </div>
                        <button
                            type="button"
                            className="look-dialog__close"
                            aria-label="Fermer"
                            onClick={() => dialogRef.current.close()}
                        >
                            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    </header>

                    <ul className="look-dialog__photos">
                        {shown.photos.map((photo, i) => (
                            <li key={photo.src}>
                                <img
                                    className="look-dialog__photo"
                                    src={photo.src}
                                    srcSet={photo.srcSet}
                                    sizes={photo.srcSet && photoSizes(photo)}
                                    width={photo.width}
                                    height={photo.height}
                                    alt={`Maquillage ${fullTitle(shown)}${shown.photos.length > 1 ? `, photo ${i + 1} sur ${shown.photos.length}` : ''}`}
                                    decoding="async"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </dialog>
    );
}
