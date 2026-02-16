import "../../styles/NewsGrid.css";

export default function NewsCard({ title, description, date, category }) {
    return (
        <div className="news-card-shop">
            <div className="news-category">{category}</div>
            <h4 className="news-title">{title}</h4>
            <p className="news-description">{description}</p>
            <div className="news-footer">
                <span className="news-date">{date}</span>
            </div>
        </div>
    );
}