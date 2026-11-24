// src/contexts/DataContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { getReviews } from '../services/database/reviews';
import { getNews } from '../services/database/news';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [reviewsData, newsData] = await Promise.all([
                    getReviews(),
                    getNews()
                ]);
                setReviews(reviewsData || []);
                setNews(newsData || []);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ reviews, news, loading, error }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === null) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};