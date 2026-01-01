import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import "../styles/News.css";
import { useData } from '../contexts/DataContext';

export default function NewsSection() {
    const { news, loading, error } = useData();

    const navigate = useNavigate();

    const newsList = news;
    console.log(news)
    const handleNewsClick = (newsItem) => {
        navigate(`/project?news=${newsItem.id}`);
    };

    if (loading) return <div>Loading news...</div>;
    if (error) return <div>Error loading news: {error.message}</div>;

    return (
        <motion.section
            className="news-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="container mx-auto px-4">
                <h3 className="section-title">Actualités</h3>
                <div className="news-grid">
                    {newsList.map((news, index) => (
                        <motion.div
                            key={news.id}
                            className="news-card"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => handleNewsClick(news)}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="news-category">{news.category}</div>
                            <h4 className="news-title">{news.title}</h4>
                            <p className="news-description">{news.description}</p>
                            <div className="news-footer">
                                <span className="news-date">{new Date(news.date_event).toLocaleDateString('fr-FR')}</span>
                                <span className="news-arrow">→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}