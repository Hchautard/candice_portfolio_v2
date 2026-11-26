import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import seo from './scripts/seo-plugin.mjs';

export default defineConfig(({ mode }) => {
    // Les variables gardent leur préfixe CRA (REACT_APP_) : rien à renommer dans .env ni chez l'hébergeur
    const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
    const siteUrl = (env.REACT_APP_SITE_URL || '').trim().replace(/\/$/, '');
    // Mêmes adresse et clé publique que le site : le sitemap liste les actualités qu'il affiche
    const supabase = { url: env.REACT_APP_SUPABASE_URL, key: env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY };

    return {
        // %SITE_URL% dans index.html, fiche JSON-LD, sitemap.xml et robots.txt (scripts/seo-plugin.mjs)
        plugins: [react(), seo(siteUrl, supabase)],
        envPrefix: 'REACT_APP_',
        server: { port: 3000, strictPort: true },
        preview: { port: 4173 },
        // Même dossier de sortie qu'avec Create React App : la config de l'hébergeur ne change pas
        build: { outDir: 'build' },
    };
});
