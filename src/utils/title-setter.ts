import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = "L'Anomalie";
// Accueil : le titre porte le métier et la ville, ce que Google affiche en premier
const HOME_TITLE = `${SITE_NAME} — Tatoueuse à Montpellier`;

// Le lien canonique doit être absolu : sans REACT_APP_SITE_URL, il n'est pas ajouté
const SITE_URL = (import.meta.env.REACT_APP_SITE_URL || '').replace(/\/$/, '');

// Description de index.html, remise sur les pages qui n'en donnent pas
const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
const DEFAULT_DESCRIPTION = descriptionTag?.content ?? '';

type PageMeta = {
    /** Phrase affichée sous le titre dans les résultats de recherche (~150 caractères) */
    description?: string;
    /** Adresse de référence quand la page en a plusieurs (/home → /) ; par défaut l'adresse courante */
    canonicalPath?: string;
    /** Page à ne pas indexer (404) : balise robots noindex, pas de lien canonique */
    noindex?: boolean;
};

// Titre d'onglet, description et lien canonique de la page. Google exécute le JavaScript
// et lit ces balises après le rendu ; les aperçus de partage gardent celles de index.html.
function DocumentTitleSetter(title: string, { description, canonicalPath, noindex = false }: PageMeta = {}) {
    const { pathname } = useLocation();

    useEffect(() => {
        document.title = title === 'Accueil' ? HOME_TITLE : `${title} — ${SITE_NAME}`;
        descriptionTag?.setAttribute('content', description || DEFAULT_DESCRIPTION);
    }, [title, description]);

    useEffect(() => {
        let tag: HTMLElement;
        if (noindex) {
            const robots = document.createElement('meta');
            robots.name = 'robots';
            robots.content = 'noindex';
            tag = robots;
        } else if (SITE_URL) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = SITE_URL + (canonicalPath ?? pathname);
            tag = canonical;
        } else {
            return undefined;
        }
        document.head.appendChild(tag);
        return () => tag.remove();
    }, [noindex, canonicalPath, pathname]);
}
export default DocumentTitleSetter
