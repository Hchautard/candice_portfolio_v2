import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Les variables gardent leur préfixe CRA (REACT_APP_) : rien à renommer dans .env ni chez l'hébergeur
    const env = loadEnv(mode, process.cwd(), 'REACT_APP_');

    return {
        plugins: [
            react(),
            {
                // og:image et twitter:image doivent être absolus : %SITE_URL% = REACT_APP_SITE_URL (vide si absent)
                name: 'site-url',
                transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', (env.REACT_APP_SITE_URL || '').replace(/\/$/, '')),
            },
        ],
        envPrefix: 'REACT_APP_',
        server: { port: 3000, strictPort: true },
        preview: { port: 4173 },
        // Même dossier de sortie qu'avec Create React App : la config de l'hébergeur ne change pas
        build: { outDir: 'build' },
    };
});
