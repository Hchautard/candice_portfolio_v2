import React from 'react';
import "../../styles/NewsGrid.css";
import {useData} from "../../contexts/DataContext";
import NewsCard from "./NewsCard";

export default function NewsGrid() {
    const { news, loading, error } = useData();

    const newsList = news.sort((a, b) => new Date(b.date_event) - new Date(a.date_event)).slice(0, 3);

    console.log("News data in NewsGrid:", newsList);
    if (loading) return <div>Loading news...</div>;
    if (error) return <div>Error loading news: {error.message}</div>;

    return (
        <div className="news-grid-shop">
            <div className="main">
                <NewsCard
                    title={newsList[0].title}
                    description={newsList[0].description}
                    date={new Date(newsList[0].date_event).toLocaleDateString('fr-FR')}
                    category={newsList[0].category}
                />
            </div>
            <div className="sub-top-right">
                <NewsCard
                    title={newsList[1].title}
                    description={newsList[1].description}
                    date={new Date(newsList[1].date_event).toLocaleDateString('fr-FR')}
                    category={newsList[1].category}
                />
            </div>
            <div className="sub-bottom-right">
                <NewsCard
                    title={newsList[2].title}
                    description={newsList[2].description}
                    date={new Date(newsList[2].date_event).toLocaleDateString('fr-FR')}
                    category={newsList[2].category}
                />
            </div>
        </div>
    );
}