import { useNavigate } from "react-router-dom";
import "../../styles/NewsCard.css";
import creation from "../../assets/images/news/creation.jpg";
import illustration from "../../assets/images/news/illustration.jpg";
import event from "../../assets/images/news/event.jpg";

const CATEGORY_BACKGROUNDS = {
    "Création": creation,
    "Illustration": illustration,
    "Événement": event,
};

export default function NewsCard({ id, title, description, date, category, location, image, showDetails }) {
    const navigate = useNavigate();
    const backgroundImage = CATEGORY_BACKGROUNDS[category] || creation;

    return (
        <div
            className="news-card-shop"
            onClick={() => navigate(`/news/${id}`)}
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
                <span className="news-date-shop">
                    {date}{date && location && <>&nbsp;|&nbsp;{location}</>}
                </span>
            </div>
            {image && (
                <img className="news-card-image" src={image} alt={title} />
            )}
            <h4 className="news-title-shop">{title}</h4>
            {showDetails && (
                <p className="news-description-shop">{description}</p>
            )}
            <div className="news-footer-shop">
                <div className="news-arrow-shop">Lire la suite →</div>
            </div>
        </div>
    );
}
