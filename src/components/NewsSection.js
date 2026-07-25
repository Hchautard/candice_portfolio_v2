import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import "../styles/News.css";
import { useData } from '../contexts/DataContext';

export default function NewsSection() {
    const { news, loading, error } = useData();

    // Limit to the 3 most recent news items
    const newsList = [...news].sort((a, b) => new Date(b.date_event) - new Date(a.date_event)).slice(0, 3);
    const navigate = useNavigate();

    const handleNewsClick = (newsItem) => {
        navigate(`/news/${newsItem.id}`);
    };

    if (loading) return <div className="news-status">Chargement des actualités…</div>;
    if (error) return <div className="news-status">Les actualités sont indisponibles pour le moment.</div>;
    if (newsList.length === 0) return null;

    return (
        <motion.section
            className="news-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="container mx-auto px-4">
                <h2 className="section-title">Actualités</h2>
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleNewsClick(news);
                                }
                            }}
                            role="link"
                            tabIndex={0}
                            aria-label={`Lire l'actualité : ${news.title}`}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="news-category">{news.category}</div>
                            <h3 className="news-title">{news.title}</h3>
                            <p className="news-description">{news.description}</p>
                            <div className="news-footer">
                                <span className="news-date">{news.date_event ? new Date(news.date_event).toLocaleDateString('fr-FR') : ''}</span>
                                <span className="news-arrow">→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}