// Contenu Markdown des actualités, saisi à la main dans Supabase.

const BOLD = /\*\*([^*\n]+?)\*\*/g;

/**
 * Markdown d'une actualité, avec le gras réparé. « **Débutant **! » ou « et** attention** » :
 * des ** collées à une espace côté texte ne mettent pas en gras, les astérisques s'affichent
 * telles quelles. Les espaces passent à l'extérieur (« **Débutant** ! », « et **attention** »).
 */
export function tidyMarkdown(text = '') {
    return text.replaceAll(BOLD, (match, inner) => {
        const word = inner.trim();
        if (!word) return match;
        const before = inner.slice(0, inner.length - inner.trimStart().length);
        const after = inner.slice(inner.trimEnd().length);
        return `${before}**${word}**${after}`;
    });
}
