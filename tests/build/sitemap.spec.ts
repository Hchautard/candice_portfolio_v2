import { test, expect } from '@playwright/test';
import { createServer, type IncomingHttpHeaders, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import seo from '../../scripts/seo-plugin.mjs';

// sitemap.xml produit au build par scripts/seo-plugin.mjs : pages fixes et actualités lues dans
// Supabase. Une fausse base sur la machine répond à la place de Supabase.

const SITE_URL = 'https://lanomalie.example';
const PAGES = ['/', '/project', '/tattoo', '/makeup', '/contact'].map((path) => SITE_URL + path);

// Aucun navigateur ici : un seul passage suffit
test.skip(({ browserName }) => browserName !== 'chromium', 'Test sans navigateur, lancé une seule fois');

type FakeSupabase = { url: string; requests: { url: string; headers: IncomingHttpHeaders }[]; close: () => Promise<void> };

/** Fausse base Supabase : répond `status` et `body` à toute requête, et les note. */
async function fakeSupabase(status: number, body: unknown): Promise<FakeSupabase> {
    const requests: FakeSupabase['requests'] = [];
    const server: Server = createServer((req, res) => {
        requests.push({ url: req.url!, headers: req.headers });
        res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(body));
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as AddressInfo;
    return {
        url: `http://127.0.0.1:${port}`,
        requests,
        close: () => new Promise((resolve) => server.close(() => resolve())),
    };
}

/** Étape de build du plugin : fichiers produits et avertissements affichés. */
async function build(siteUrl: string, supabase: { url?: string; key?: string }) {
    const files: Record<string, string> = {};
    const warnings: string[] = [];
    await seo(siteUrl, supabase).generateBundle.call({
        emitFile: ({ fileName, source }: { fileName: string; source: string }) => { files[fileName] = source; },
        warn: (message: string) => warnings.push(message),
    });
    const locs = [...(files['sitemap.xml'] ?? '').matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) => loc);
    return { files, warnings, locs };
}

test.describe('sitemap.xml', () => {
    test('lists the news read from Supabase after the fixed pages', async () => {
        const supabase = await fakeSupabase(200, [{ id: 3 }, { id: 13 }]);
        try {
            const { files, warnings, locs } = await build(SITE_URL, { url: supabase.url, key: 'sb_publishable_test' });

            expect(locs).toEqual([...PAGES, `${SITE_URL}/news/3`, `${SITE_URL}/news/13`]);
            expect(files['robots.txt']).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
            expect(warnings).toEqual([]);
            // Même requête et même clé publique que le site
            expect(supabase.requests).toHaveLength(1);
            expect(supabase.requests[0].url).toBe('/rest/v1/news?select=id&order=id');
            expect(supabase.requests[0].headers.apikey).toBe('sb_publishable_test');
            expect(supabase.requests[0].headers.authorization).toBe('Bearer sb_publishable_test');
        } finally {
            await supabase.close();
        }
    });

    test('Supabase failing: the build goes on with the fixed pages and warns', async () => {
        const supabase = await fakeSupabase(500, { message: 'panne' });
        try {
            const { warnings, locs } = await build(SITE_URL, { url: supabase.url, key: 'sb_publishable_test' });

            expect(locs).toEqual(PAGES);
            expect(warnings).toEqual([expect.stringContaining('HTTP 500')]);
        } finally {
            await supabase.close();
        }
    });

    test('Supabase unreachable: the build goes on with the fixed pages and warns', async () => {
        const supabase = await fakeSupabase(200, []);
        await supabase.close();

        const { warnings, locs } = await build(SITE_URL, { url: supabase.url, key: 'sb_publishable_test' });

        expect(locs).toEqual(PAGES);
        expect(warnings).toEqual([expect.stringContaining('sitemap.xml sans elles')]);
    });

    test('without Supabase settings, only the fixed pages', async () => {
        const { warnings, locs } = await build(SITE_URL, {});

        expect(locs).toEqual(PAGES);
        expect(warnings).toEqual(['Supabase non configuré : sitemap.xml sans les actualités.']);
    });

    test('without the site URL, no sitemap and no request to Supabase', async () => {
        const supabase = await fakeSupabase(200, [{ id: 3 }]);
        try {
            const { files } = await build('', { url: supabase.url, key: 'sb_publishable_test' });

            expect(files['sitemap.xml']).toBeUndefined();
            expect(supabase.requests).toEqual([]);
        } finally {
            await supabase.close();
        }
    });
});
