import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import NewsCard from "./NewsCard";
import { formatDate } from "../../utils/dates";
import "../../styles/NewsList.css";

export default function NewsList({ skip = 0 }) {
    const { news, loading, error } = useData();
    const [currentPage, setCurrentPage] = useState(0);

    const ITEMS_PER_PAGE = 4;

    if (loading) return <div className="news-status">Chargement des actualités…</div>;
    if (error) return <div className="news-status">Les actualités sont indisponibles pour le moment.</div>;
    if (news.length === 0) return null;

    // Déjà triées de la plus récente à la plus ancienne (services/database/news.js)
    const allNews = news.slice(skip);

    if (allNews.length === 0) return null;

    const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const currentNews = allNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPrev = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const goToNext = () => {
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    return (
        <div className="news-list-section">
            <div className="news-list-header">
                <h2 className="news-list-section-title">
                    &#124; {skip > 0 ? 'Actualités précédentes' : 'Toutes les actualités'}
                </h2>
                {totalPages > 1 && (
                <div className="news-list-nav">
                    <button
                        className="news-list-arrow"
                        onClick={goToPrev}
                        aria-label="Actualités précédentes"
                    >
                        &#8249;
                    </button>
                    <button
                        className="news-list-arrow"
                        onClick={goToNext}
                        aria-label="Actualités suivantes"
                    >
                        &#8250;
                    </button>
                  </div>
                )}
            </div>

            <div className="news-list-row">
                {currentNews.map((item, index) => (
                    <div key={item.id || index} className="news-list-item">
                        <NewsCard
                            id={item.id}
                            title={item.title}
                            description={item.description}
                            date={formatDate(item.date_event)}
                            category={item.category}
                        />
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="news-list-dots">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`news-list-dot ${i === currentPage ? "news-list-dot-active" : ""}`}
                            onClick={() => setCurrentPage(i)}
                            aria-label={`Page ${i + 1}`}
                            aria-current={i === currentPage ? "page" : undefined}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}