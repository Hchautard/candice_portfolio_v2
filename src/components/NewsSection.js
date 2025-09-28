import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import newsData from '../data/news.json';
import "../styles/News.css";

export default function NewsSection() {
    const navigate = useNavigate();

    const newsItems = newsData.news;

    const handleNewsClick = (newsItem) => {
        navigate(`/project?news=${newsItem.id}`);
    };

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
                    {newsItems.map((news, index) => (
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
                                <span className="news-date">{new Date(news.date).toLocaleDateString('fr-FR')}</span>
                                <span className="news-arrow">→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}