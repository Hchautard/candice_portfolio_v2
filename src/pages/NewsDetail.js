import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useData } from '../contexts/DataContext';
import DocumentTitleSetter from '../utils/title-setter.ts';
import creation from '../assets/images/news/creation.jpg';
import illustration from '../assets/images/news/illustration.jpg';
import event from '../assets/images/news/event.jpg';
import '../styles/NewsDetail.css';

const CATEGORY_IMAGES = {
    "Création": creation,
    "Illustration": illustration,
    "Événement": event,
};

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { news, loading } = useData();

    const item = news.find(n => String(n.id) === String(id));

    DocumentTitleSetter(item?.title || 'Actualité');

    useEffect(() => {
        if (!loading && !item) {
            navigate('/project');
        }
    }, [loading, item, navigate]);

    if (loading) return <div className="news-detail-loading">Chargement...</div>;
    if (!item) return null;

    const coverImage = CATEGORY_IMAGES[item.category] || creation;
    const formattedDate = item.date_event
        ? new Date(item.date_event).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : '';

    return (
        <motion.article
            className="news-detail"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="news-detail-inner">
                <button className="news-detail-back" onClick={() => navigate(-1)}>
                    ← Retour
                </button>

                <div
                    className="news-detail-cover"
                    style={{ backgroundImage: `url(${coverImage})` }}
                />

                <header className="news-detail-header">
                    {item.category && (
                        <span className="news-detail-category">{item.category}</span>
                    )}
                    <h1 className="news-detail-title">{item.title}</h1>
                    {(formattedDate || item.location) && (
                        <p className="news-detail-meta">
                            {formattedDate}
                            {formattedDate && item.location && <>&nbsp;|&nbsp;{item.location}</>}
                        </p>
                    )}
                </header>

                <div className="news-detail-body">
                    <ReactMarkdown>{item.content || item.description || ''}</ReactMarkdown>
                </div>
            </div>
        </motion.article>
    );
}
