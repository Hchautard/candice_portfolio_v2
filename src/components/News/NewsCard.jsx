import "../../styles/NewsCard.css";

export default function NewsCard({ title, description, date, category }) {
    return (
        <div className="news-card-shop">
            <div className="news-header-shop">
                <div className="news-category-shop">{category}</div>
                <span className="news-date-shop">{date}</span>
            </div>
            <h4 className="news-title-shop">{title}</h4>
            <p className="news-description-shop">{description}</p>
            <div className="news-footer-shop">
                <div className="news-arrow-shop">Lire la suite →</div>
            </div>
        </div>
    );
}