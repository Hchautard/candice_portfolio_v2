// Dates venant de Supabase : colonnes « date » (AAAA-MM-JJ), « timestamp » ou « timestamptz »

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

// Une date nulle convertie donne le 01/01/1970 (ou le 31/12/1969 selon le fuseau) :
// avant 1971, ce n'est pas une vraie date d'actualité, on la traite comme absente
const MIN_YEAR = 1971;

/** Date valide, ou null si la valeur est absente, illisible ou une date nulle convertie */
export function parseDate(value) {
    if (!value) return null;

    // new Date('2026-03-15') lit la date en UTC : elle s'afficherait la veille à l'ouest de Greenwich
    const dateOnly = typeof value === 'string' ? DATE_ONLY.exec(value) : null;
    const date = dateOnly
        ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
        : new Date(value);

    if (Number.isNaN(date.getTime()) || date.getFullYear() < MIN_YEAR) return null;
    return date;
}

/** Date en français (« 15/03/2026 » par défaut), ou chaîne vide si elle n'est pas valide */
export function formatDate(value, options) {
    const date = parseDate(value);
    return date ? date.toLocaleDateString('fr-FR', options) : '';
}

/** Tri du plus récent au plus ancien sur `key` ; les éléments sans date valide passent à la fin */
export const byDateDesc = (key) => (a, b) => {
    const dateA = parseDate(a[key]);
    const dateB = parseDate(b[key]);
    if (!dateA || !dateB) return Number(!dateA) - Number(!dateB);
    return dateB - dateA;
};
