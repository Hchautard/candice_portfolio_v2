import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NewsStamp from './NewsStamp';
import NewsPlace from './NewsPlace';
import '../../styles/NewsFeed.css';

export const EVENT = 'Événement';

// Une actualité dans une liste : la date en tampon, puis la catégorie, le titre, le résumé et
// le lieu. Le lien porte sur le titre (c'est lui que lit un lecteur d'écran) et couvre toute la
// ligne au clic. image (colonne facultative dans Supabase) : adresse d'une photo.
export default function NewsEntry({ item }) {
    const title = item.title?.trim();
    const description = item.description?.trim();

    return (
        <li className="news-entry">
            <NewsStamp value={item.date_event} upcoming={item.category === EVENT} />
            <div className="news-entry__body">
                {item.category && <p className="news-entry__category">{item.category}</p>}
                <h3 className="news-entry__title">
                    <Link className="news-entry__link" to={`/news/${item.id}`}>{title}</Link>
                </h3>
                {description && <p className="news-entry__text">{description}</p>}
                <NewsPlace className="news-entry__place" location={item.location} />
            </div>
            {item.image && (
                <img className="news-entry__image" src={item.image} alt="" loading="lazy" decoding="async" />
            )}
        </li>
    );
}

const newsShape = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    location: PropTypes.string,
    date_event: PropTypes.string,
    image: PropTypes.string,
});

NewsEntry.propTypes = {
    item: newsShape.isRequired,
};
