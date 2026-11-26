import { Link } from "react-router-dom";
import "../../styles/NewsCard.css";
import creation from "../../assets/images/news/creation.webp";
import illustration from "../../assets/images/news/illustration.webp";
import event from "../../assets/images/news/event.webp";

const CATEGORY_BACKGROUNDS = {
    "Création": creation,
    "Illustration": illustration,
    "Événement": event,
};

export default function NewsCard({ id, title, description, date, category, location, image, showDetails }) {
    const backgroundImage = CATEGORY_BACKGROUNDS[category] || creation;
    // Date et lieu indépendants : le lieu reste affiché quand la date manque
    const meta = [date, location].filter(Boolean).join(' | ');

    return (
        <Link
            to={`/news/${id}`}
            className="news-card-shop"
            aria-label={`Lire l'actualité : ${title}`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundBlendMode: "darken",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
        >
            <div className="news-header-shop">
                {category && showDetails && (
                    <div className="news-category-shop">{category}</div>
                )}
                {meta && <span className="news-date-shop">{meta}</span>}
            </div>
            {image && (
                <img className="news-card-image" src={image} alt="" />
            )}
            <h3 className="news-title-shop">{title}</h3>
            {showDetails && (
                <p className="news-description-shop">{description}</p>
            )}
            <div className="news-footer-shop">
                <div className="news-arrow-shop">Lire la suite →</div>
            </div>
        </Link>
    );
}
