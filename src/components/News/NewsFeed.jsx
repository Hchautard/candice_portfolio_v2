import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import NewsEntry from './NewsEntry';

// Au-delà, les plus anciennes attendent derrière un bouton
const FIRST_PAGE = 6;

// Toutes les actualités, de la plus récente à la plus ancienne (tri : services/database/news.js).
// Page Le salon ; « Toutes les actualités », sur la page d'une actualité, ramène ici (#actualites).
export default function NewsFeed() {
    const { news, loading, error } = useData();
    const [showAll, setShowAll] = useState(false);
    const { hash } = useLocation();
    const sectionRef = useRef(null);
    const listRef = useRef(null);

    // Le navigateur ne trouve pas #actualites au chargement : la liste arrive après Supabase
    useEffect(() => {
        if (!loading && hash === '#actualites') sectionRef.current?.scrollIntoView();
    }, [loading, hash]);

    // Clavier : après « Afficher les plus anciennes », on reprend sur la première affichée
    useEffect(() => {
        if (showAll) listRef.current?.children[FIRST_PAGE]?.querySelector('a')?.focus();
    }, [showAll]);

    if (!loading && !error && news.length === 0) return null;

    const shown = showAll ? news : news.slice(0, FIRST_PAGE);
    const hidden = news.length - shown.length;

    return (
        <section id="actualites" ref={sectionRef} className="news-feed" aria-labelledby="news-feed-title">
            <header className="news-feed__header">
                <h2 id="news-feed-title" className="news-feed__title">Actualités</h2>
                <p className="news-feed__lead">Cours, défilés, soirées et nouvelles pièces : ce que je prépare.</p>
            </header>

            {loading && <p className="news-feed__status">Chargement des actualités…</p>}
            {error && <p className="news-feed__status">Les actualités sont indisponibles pour le moment.</p>}

            {!loading && !error && (
                <>
                    <ul ref={listRef} className="news-feed__list">
                        {shown.map((item) => <NewsEntry key={item.id} item={item} />)}
                    </ul>
                    {hidden > 0 && (
                        <button type="button" className="news-feed__more" onClick={() => setShowAll(true)}>
                            Afficher les plus anciennes ({hidden})
                        </button>
                    )}
                </>
            )}
        </section>
    );
}
