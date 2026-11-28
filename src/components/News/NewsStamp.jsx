import PropTypes from 'prop-types';
import { parseDate } from '../../utils/dates';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Date d'une actualité en tampon : le jour en grand, le mois et l'année dessous.
 * Sans date : « Date à venir » pour un événement, rien pour le reste (création, illustration…).
 */
export default function NewsStamp({ value, upcoming = false }) {
    const date = parseDate(value);

    if (!date) {
        return upcoming
            ? <p className="news-stamp news-stamp--soon">Date à venir</p>
            : <span className="news-stamp" aria-hidden="true" />;
    }

    const iso = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const month = date.toLocaleDateString('fr-FR', { month: 'short' });

    return (
        <time className="news-stamp" dateTime={iso}>
            <span className="news-stamp__day">{date.getDate()}</span>{' '}
            <span className="news-stamp__month">{month} {date.getFullYear()}</span>
        </time>
    );
}

NewsStamp.propTypes = {
    value: PropTypes.string,
    upcoming: PropTypes.bool,
};
