import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DocumentTitleSetter from '../utils/title-setter.ts';
import '../styles/NotFound.css';

// Adresse inconnue. Le serveur répond 200 à toutes les URL (réécriture dans render.yaml) :
// noindex évite que les moteurs de recherche indexent ces fausses pages.
export default function NotFound() {
    DocumentTitleSetter('Page introuvable');

    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex';
        document.head.appendChild(meta);
        return () => meta.remove();
    }, []);

    return (
        <main className="not-found">
            <div className="not-found-card">
                <p className="not-found-code" aria-hidden="true">404</p>
                <h1>Page introuvable</h1>
                <p>Cette page n&apos;existe pas, ou elle a changé d&apos;adresse.</p>
                <nav className="not-found-links" aria-label="Pages principales">
                    <Link to="/">Retour à l&apos;accueil</Link>
                    <Link to="/tattoo">Voir les tatouages</Link>
                    <Link to="/contact">Me contacter</Link>
                </nav>
            </div>
        </main>
    );
}
