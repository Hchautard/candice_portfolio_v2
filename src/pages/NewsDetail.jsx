import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { useData } from '../contexts/DataContext';
import DocumentTitleSetter from '../utils/title-setter.ts';
import { tidyMarkdown } from '../utils/markdown';
import NewsStamp from '../components/News/NewsStamp';
import NewsPlace from '../components/News/NewsPlace';
import NewsEntry, { EVENT } from '../components/News/NewsEntry';
import '../styles/NewsDetail.css';

// Sous l'article, de quoi continuer la lecture
const OTHERS = 3;

// Un retour à la ligne dans Supabase reste un retour à la ligne sur le site (en Markdown pur,
// il faut une ligne vide ; « 60 € » puis « -15 % étudiant » se retrouvaient sur la même ligne)
const REMARK_PLUGINS = [remarkBreaks];

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { news, loading } = useData();

    const item = news.find(n => String(n.id) === String(id));

    DocumentTitleSetter(item?.title?.trim() || 'Actualité', { description: item?.description?.trim() });

    // Actualité inconnue (supprimée, lien erroné) : retour à la liste, sans garder l'adresse
    // morte dans l'historique (le bouton Précédent y renverrait aussitôt)
    useEffect(() => {
        if (!loading && !item) {
            navigate('/project#actualites', { replace: true });
        }
    }, [loading, item, navigate]);

    if (loading) return <div className="news-detail-loading">Chargement…</div>;
    if (!item) return null;

    const others = news.filter((n) => n !== item).slice(0, OTHERS);

    return (
        <div className="news-detail">
            <article className="news-detail-article">
                <Link className="news-detail-back" to="/project#actualites">Toutes les actualités</Link>

                <header className="news-detail-header">
                    <NewsStamp value={item.date_event} upcoming={item.category === EVENT} />
                    <div className="news-detail-heading">
                        {item.category && <p className="news-detail-category">{item.category}</p>}
                        <h1 className="news-detail-title">{item.title?.trim()}</h1>
                        <NewsPlace className="news-detail-place" location={item.location} />
                    </div>
                </header>

                {item.image && <img className="news-detail-cover" src={item.image} alt="" />}

                <div className="news-detail-body">
                    <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>{tidyMarkdown(item.content || item.description || '')}</ReactMarkdown>
                </div>
            </article>

            {others.length > 0 && (
                <section className="news-detail-more" aria-labelledby="news-more-title">
                    <h2 id="news-more-title" className="news-detail-more__title">Autres actualités</h2>
                    <ul className="news-feed__list">
                        {others.map((other) => <NewsEntry key={other.id} item={other} />)}
                    </ul>
                </section>
            )}
        </div>
    );
}
