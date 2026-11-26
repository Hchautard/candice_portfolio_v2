// Sert un build comme le fera Render : `vite preview`, plus les en-têtes déclarés dans render.yaml,
// que `vite preview` ignore. Utilisé par les tests du site construit (playwright.build.config.ts)
// pour vérifier la politique de sécurité (CSP).
//
//   node scripts/preview-headers.mjs [dossier du build] [port]     (par défaut : build 4173)

import { readFileSync } from 'node:fs';
import { preview } from 'vite';
import { parse } from 'yaml';

const [outDir = 'build', port = '4173'] = process.argv.slice(2);

// Chemins des en-têtes de Render : « /* » final couvre tout ce qui suit (/assets/* : /assets/a/b.js),
// « ** » n'importe quels caractères, « * » ailleurs un seul segment, sans « / » (/*.css)
function pathPattern(path) {
    const prefix = path.endsWith('/*');
    const escaped = (prefix ? path.slice(0, -1) : path).replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    const glob = escaped.split('**').map((part) => part.replaceAll('*', '[^/]*')).join('.*');
    return new RegExp(`^${glob}${prefix ? '' : '$'}`);
}

const { services = [] } = parse(readFileSync(new URL('../render.yaml', import.meta.url), 'utf8'));
const site = services.find(({ runtime }) => runtime === 'static');
if (!site?.headers?.length) throw new Error('render.yaml : aucun en-tête pour le site statique');

const rules = site.headers.map(({ path, name, value }) => ({ pattern: pathPattern(path), name, value }));

const server = await preview({
    build: { outDir },
    // 127.0.0.1 plutôt que localhost : sous Windows, localhost désigne d'abord ::1, et un navigateur
    // chargé qui se replie sur 127.0.0.1 trouvait porte close
    preview: { host: '127.0.0.1', port: Number(port), strictPort: true },
    plugins: [{
        name: 'render-headers',
        // Avant les fichiers du build : l'adresse demandée (/tattoo) n'est pas encore devenue /index.html
        configurePreviewServer(previewServer) {
            previewServer.middlewares.use((req, res, next) => {
                const { pathname } = new URL(req.url, 'http://localhost');
                for (const { pattern, name, value } of rules) {
                    if (pattern.test(pathname)) res.setHeader(name, value);
                }
                next();
            });
        },
    }],
});

server.printUrls();
