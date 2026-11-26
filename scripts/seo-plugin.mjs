// Plugin Vite : balises qui ont besoin de l'URL publique du site (REACT_APP_SITE_URL).
// - index.html : %SITE_URL% (og:image, twitter:image) et fiche schema.org du salon (JSON-LD)
// - build : sitemap.xml et robots.txt (le sitemap n'est généré que si l'URL est connue)

// Même profil que src/data/social.js (non importé : Node le chargerait en CommonJS et Vite avertit)
const INSTAGRAM_URL = 'https://www.instagram.com/l__anomalie/';

// Pages du sitemap. Les actualités (/news/:id) viennent de Supabase : Google les trouve
// par les liens de la page Le salon.
const ROUTES = ['/', '/project', '/tattoo', '/makeup', '/contact'];

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

function sitemapXml(siteUrl) {
    const urls = ROUTES.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/** @param {string} siteUrl URL publique sans / final, ou chaîne vide si elle n'est pas définie */
export default function seo(siteUrl) {
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

        generateBundle() {
            const robots = ['User-agent: *', 'Disallow:'];

            if (siteUrl) {
                if (!/^https?:\/\//.test(siteUrl)) {
                    this.warn(`REACT_APP_SITE_URL doit commencer par https:// (valeur actuelle : ${siteUrl})`);
                }
                this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl) });
                robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
            } else {
                this.warn('REACT_APP_SITE_URL non défini : pas de sitemap.xml ni de lien canonique, og:image reste relative.');
            }

            this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` });
        },
    };
}
