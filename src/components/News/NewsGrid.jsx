import {useData} from "../../contexts/DataContext";
import NewsCard from "./NewsCard";
import "../../styles/NewsGrid.css";

export default function NewsGrid() {
    const { news, loading, error } = useData();

    if (loading) return <div>Loading news...</div>;
    if (error) return <div>Error loading news: {error.message}</div>;

    const newsList = [...news]
        .sort((a, b) => new Date(b.date_event) - new Date(a.date_event))
        .slice(0, 3);

    const gridClasses = ['main', 'sub-top-right', 'sub-bottom-right'];

    return (
        <div className="news-grid-shop">
            {newsList.map((item, index) => (
                <div key={item.id || index} className={gridClasses[index]}>
                    <NewsCard
                        title={item.title}
                        description={item.description}
                        date={new Date(item.date_event).toLocaleDateString('fr-FR')}
                        category={item.category}
                    />
                </div>
            ))}
        </div>
    );
}