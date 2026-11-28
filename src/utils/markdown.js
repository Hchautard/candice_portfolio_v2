// Contenu Markdown des actualités, saisi à la main dans Supabase.

const BOLD = /\*\*([^*\n]+?)\*\*/g;

// Retour à la ligne simple (pas une ligne vide) : en Markdown, il ne compte que comme une espace
const SINGLE_NEWLINE = /([^\n])\n(?=[^\n])/g;

/**
 * Markdown d'une actualité, écrit comme l'autrice l'entend :
 * - le gras réparé : « **Débutant **! » ou « et** attention** » (des ** collées à une espace
 *   côté texte) affichaient les astérisques ; les espaces passent à l'extérieur ;
 * - un retour à la ligne reste un retour à la ligne (« 60 € » puis « -15 % étudiant » se
 *   retrouvaient sur la même ligne) : deux espaces en fin de ligne, le saut de ligne Markdown.
 */
export function tidyMarkdown(text = '') {
    return text
        .replaceAll('\r\n', '\n')
        .replaceAll(BOLD, (match, inner) => {
            const word = inner.trim();
            if (!word) return match;
            const before = inner.slice(0, inner.length - inner.trimStart().length);
            const after = inner.slice(inner.trimEnd().length);
            return `${before}**${word}**${after}`;
        })
        .replaceAll(SINGLE_NEWLINE, '$1  \n');
}
