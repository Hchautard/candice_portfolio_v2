import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import NewsCard from "./NewsCard";
import "../../styles/NewsList.css";

export default function NewsList() {
    const { news, loading, error } = useData();
    const [currentPage, setCurrentPage] = useState(0);

    const ITEMS_PER_PAGE = 4;

    if (loading) return <div>Loading news...</div>;
    if (error) return <div>Error loading news: {error.message}</div>;

    const allNews = [...news].sort(
        (a, b) => new Date(b.date_event) - new Date(a.date_event)
    );

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
                <span className="news-list-section-title">
                    &#124; Toutes les actualités
                </span>
                {ITEMS_PER_PAGE > 4 && (
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
                            title={item.title}
                            description={item.description}
                            date={item.date_event ? new Date(item.date_event).toLocaleDateString('fr-FR') : ''}
                            content={item.content}
                        />
                    </div>
                ))}
            </div>

            {totalPages > 1 && ITEMS_PER_PAGE > 4 && (
                <div className="news-list-dots">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`news-list-dot ${i === currentPage ? "news-list-dot-active" : ""}`}
                            onClick={() => setCurrentPage(i)}
                            aria-label={`Page ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}