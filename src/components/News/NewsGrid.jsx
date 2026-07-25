import {useData} from "../../contexts/DataContext";
import NewsCard from "./NewsCard";
import "../../styles/NewsGrid.css";

export default function NewsGrid() {
    const {news, loading, error} = useData();

    if (loading) return <div className="news-status">Chargement des actualités…</div>;
    if (error) return <div className="news-status">Les actualités sont indisponibles pour le moment.</div>;

    const newsList = [...news]
        .sort((a, b) => new Date(b.date_event) - new Date(a.date_event))
        .slice(0, 3);

    if (newsList.length === 0) return null;

    const gridClasses = ['main', 'sub-top-right', 'sub-bottom-right'];

    return (
        <>
            <h2 className="news-grid-shop-section-title">&#124; Dernières nouvelles</h2>
            <div className="news-grid-shop">
                {newsList.map((item, index) => (
                    <div key={item.id || index} className={gridClasses[index]}>
                        <NewsCard
                            id={item.id}
                            title={item.title}
                            description={item.description}
                            date={new Date(item.date_event).toLocaleDateString('fr-FR')}
                            category={item.category}
                            location={item.location}
                            showDetails
                        />
                    </div>
                ))}
            </div>
        </>
    );
}