import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext';
import NewsEntry from './News/NewsEntry';
import '../styles/News.css';

// Sur l'accueil, les plus récentes (tri : services/database/news.js)
const LATEST = 3;

// Les dernières actualités, présentées comme la liste du salon (News/NewsFeed.jsx), en sombre sur
// le panneau clair de l'accueil ; les autres attendent sur la page Le salon.
export default function NewsSection() {
    const { news, loading, error } = useData();

    if (loading) return <p className="news-status">Chargement des actualités…</p>;
    if (error) return <p className="news-status">Les actualités sont indisponibles pour le moment.</p>;
    if (news.length === 0) return null;

    return (
        <motion.section
            className="news-section"
            aria-labelledby="home-news-title"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="news-section__inner">
                <h2 id="home-news-title" className="news-section__title">Actualités</h2>
                <ul className="news-feed__list news-feed__list--light">
                    {news.slice(0, LATEST).map((item) => <NewsEntry key={item.id} item={item} />)}
                </ul>
                {news.length > LATEST && (
                    <Link className="news-section__all" to="/project#actualites">Toutes les actualités</Link>
                )}
            </div>
        </motion.section>
    );
}
