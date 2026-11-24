// Sert un build comme le fera l'hébergeur : `vite preview`, plus les en-têtes de son fichier
// _headers (format Netlify), que `vite preview` ignore. Utilisé par les tests du site construit
// (playwright.build.config.ts) pour vérifier la politique de sécurité (CSP).
//
//   node scripts/preview-headers.mjs [dossier du build] [port]     (par défaut : build 4173)

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { preview } from 'vite';

const [outDir = 'build', port = '4173'] = process.argv.slice(2);

// Une adresse (/*, /assets/*) en début de ligne, puis ses en-têtes indentés ; # pour les commentaires
function parseHeaders(text) {
    const rules = [];
    for (const line of text.split(/\r?\n/)) {
        if (!line.trim() || line.trim().startsWith('#')) continue;
        if (!/^\s/.test(line)) {
            const glob = line.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*');
            rules.push({ pattern: new RegExp(`^${glob}$`), headers: [] });
            continue;
        }
        const separator = line.indexOf(':');
        rules.at(-1).headers.push([line.slice(0, separator).trim(), line.slice(separator + 1).trim()]);
    }
    return rules;
}

const rules = parseHeaders(readFileSync(join(outDir, '_headers'), 'utf8'));

const server = await preview({
    build: { outDir },
    // 127.0.0.1 plutôt que localhost : sous Windows, localhost désigne d'abord ::1, et un navigateur
    // chargé qui se replie sur 127.0.0.1 trouvait porte close
    preview: { host: '127.0.0.1', port: Number(port), strictPort: true },
    plugins: [{
        name: 'headers-file',
        // Avant les fichiers du build : l'adresse demandée (/tattoo) n'est pas encore devenue /index.html
        configurePreviewServer(previewServer) {
            previewServer.middlewares.use((req, res, next) => {
                const { pathname } = new URL(req.url, 'http://localhost');
                for (const rule of rules.filter(({ pattern }) => pattern.test(pathname))) {
                    for (const [name, value] of rule.headers) res.setHeader(name, value);
                }
                next();
            });
        },
    }],
});

server.printUrls();
