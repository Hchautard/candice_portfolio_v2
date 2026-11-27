import PropTypes from 'prop-types';

/** Lieu d'une actualité, précédé d'un repère de carte */
export default function NewsPlace({ location, className }) {
    if (!location?.trim()) return null;

    return (
        <p className={className}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                <path
                    d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
                <circle cx="12" cy="9.5" r="2.5" fill="currentColor" />
            </svg>
            <span className="sr-only">Lieu : </span>
            {location.trim()}
        </p>
    );
}

NewsPlace.propTypes = {
    location: PropTypes.string,
    className: PropTypes.string,
};
