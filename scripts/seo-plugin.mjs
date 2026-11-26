// Plugin Vite : balises qui ont besoin de l'URL publique du site (REACT_APP_SITE_URL).
// - index.html : %SITE_URL% (og:image, twitter:image) et fiche schema.org du salon (JSON-LD)
// - build : sitemap.xml et robots.txt (le sitemap n'est généré que si l'URL est connue), avec
//   les actualités lues dans Supabase à ce moment-là

// Même profil que src/data/social.js (non importé : Node le chargerait en CommonJS et Vite avertit)
const INSTAGRAM_URL = 'https://www.instagram.com/l__anomalie/';

// Pages fixes du sitemap ; les actualités (/news/:id) s'y ajoutent au build
const ROUTES = ['/', '/project', '/tattoo', '/makeup', '/contact'];

// Supabase trop lent : le build continue sans les actualités plutôt que de rester bloqué
const SUPABASE_TIMEOUT_MS = 10_000;

/**
 * Identifiants des actualités, lus avec la clé publique du site : la base ne renvoie que ce
 * qu'un visiteur peut voir (règles RLS). Erreur si elle ne répond pas correctement.
 */
async function fetchNewsIds({ url, key }) {
    // Même adresse que le client du site (src/utils/supabase.ts)
    const endpoint = new URL('rest/v1/news', url.endsWith('/') ? url : `${url}/`);
    endpoint.search = new URLSearchParams({ select: 'id', order: 'id' }).toString();

    const response = await fetch(endpoint, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`réponse HTTP ${response.status}`);

    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('réponse inattendue');
    return rows.map((row) => row?.id).filter((id) => id != null);
}

/** Adresses des actualités ; liste vide, avec un avertissement, si Supabase n'est pas joignable */
async function newsRoutes(supabase, warn) {
    if (!supabase.url || !supabase.key) {
        warn('Supabase non configuré : sitemap.xml sans les actualités.');
        return [];
    }
    try {
        const ids = await fetchNewsIds(supabase);
        return ids.map((id) => `/news/${encodeURIComponent(id)}`);
    } catch (error) {
        // fetch ne dit que « fetch failed » : la cause précise l'erreur (adresse introuvable…)
        warn(`Actualités non lues dans Supabase (${error.cause?.message || error.message}) : sitemap.xml sans elles.`);
        return [];
    }
}

const XML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
const escapeXml = (text) => text.replace(/[&<>"']/g, (char) => XML_ENTITIES[char]);

// Fiche « salon de tatouage » lue par Google (nom, ville, Instagram). Pas d'adresse postale
// ni d'horaires : le salon est à venir, seule la ville est indiquée.
function businessJsonLd(siteUrl) {
    return {
        '@context': 'https://schema.org',
        '@type': 'TattooParlor',
        name: "L'Anomalie",
        description: 'Tatoueuse indépendante à Montpellier : cyber-sigilism, gothique et dark fantasy, flashs à adopter et projets sur mesure.',
        founder: { '@type': 'Person', name: 'Candice', jobTitle: 'Tatoueuse' },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Montpellier',
            addressRegion: 'Occitanie',
            addressCountry: 'FR',
        },
        areaServed: { '@type': 'City', name: 'Montpellier' },
        sameAs: [INSTAGRAM_URL],
        ...(siteUrl && {
            url: `${siteUrl}/`,
            image: `${siteUrl}/og-image.jpg`,
            logo: `${siteUrl}/logo512.png`,
        }),
    };
}

function sitemapXml(siteUrl, paths) {
    const urls = paths.map((path) => `  <url><loc>${escapeXml(siteUrl + path)}</loc></url>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * @param {string} siteUrl URL publique sans / final, ou chaîne vide si elle n'est pas définie
 * @param {{ url?: string, key?: string }} supabase Adresse et clé publique de Supabase (actualités du sitemap)
 */
export default function seo(siteUrl, supabase = {}) {
    return {
        name: 'seo',

        transformIndexHtml(html) {
            // « < » échappé : le JSON ne peut pas refermer la balise <script>
            const jsonLd = JSON.stringify(businessJsonLd(siteUrl)).replaceAll('<', '\\u003c');
            return {
                html: html.replaceAll('%SITE_URL%', siteUrl),
                tags: [{ tag: 'script', attrs: { type: 'application/ld+json' }, children: jsonLd, injectTo: 'head' }],
            };
        },

        async generateBundle() {
            const robots = ['User-agent: *', 'Disallow:'];

            if (siteUrl) {
                if (!/^https?:\/\//.test(siteUrl)) {
                    this.warn(`REACT_APP_SITE_URL doit commencer par https:// (valeur actuelle : ${siteUrl})`);
                }
                const news = await newsRoutes(supabase, (message) => this.warn(message));
                this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl, [...ROUTES, ...news]) });
                robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
            } else {
                this.warn('REACT_APP_SITE_URL non défini : pas de sitemap.xml ni de lien canonique, og:image reste relative.');
            }

            this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` });
        },
    };
}
