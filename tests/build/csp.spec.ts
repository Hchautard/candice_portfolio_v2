import { test, expect, type Page } from '@playwright/test';

// Politique de sécurité (CSP) de public/_headers, sur le site construit (playwright.build.config.ts).
// Le build est servi avec les en-têtes de _headers (scripts/preview-headers.mjs), comme chez
// l'hébergeur : le navigateur bloque tout ce que la politique ne permet pas, et le signale.

const NEWS = [
    { id: 1, title: 'Convention de Montpellier', description: 'Trois jours de flash day.', content: '## Programme\n\nDes flashs **à prix doux**.', category: 'Événement', location: 'Montpellier', date_event: '2026-10-12', created_at: '2026-09-01T10:00:00Z' },
    { id: 2, title: 'Nouvelle planche de flashs', description: 'Douze flashs gothiques à adopter.', category: 'Création', location: 'Atelier', date_event: '2026-09-20', created_at: '2026-09-10T10:00:00Z' },
];
const REVIEWS = [
    { id: 1, author: 'Léa', rating: 5, comment: 'Un trait d’une finesse incroyable.', tattoo_style: 'Cyber-sigilism', created_at: '2026-10-01T12:00:00Z' },
];

// PNG de 1 × 1 px
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

/** Simule les services externes et relève tout ce que la politique bloque. */
async function watchPolicy(page: Page) {
    // Adresses factices de playwright.build.config.ts. Une requête refusée par la CSP n'arrive jamais ici.
    await page.route(/^https:\/\/csp-test\.supabase\.co\/rest\/v1\/(news|reviews)/, (route) =>
        route.fulfill({ json: route.request().url().includes('/news') ? NEWS : REVIEWS }));
    await page.route('https://api.emailjs.com/**', (route) => route.fulfill({ contentType: 'text/plain', body: 'OK' }));
    await page.route('https://api.cloudinary.com/**', (route) =>
        route.fulfill({ json: { secure_url: 'https://res.cloudinary.com/demo/image/upload/ref.png', public_id: 'tattoo_requests/ref' } }));

    // Chaque blocage déclenche un évènement dans la page ; Chromium l'écrit aussi dans la console
    await page.addInitScript(() => {
        const violations: string[] = [];
        Object.assign(window, { cspViolations: violations });
        document.addEventListener('securitypolicyviolation', (e) => {
            violations.push(`${e.effectiveDirective} ${e.blockedURI || 'inline'} (${e.sourceFile}:${e.lineNumber})`);
        });
    });
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
        if (/content.security.policy|refused to/i.test(message.text())) consoleErrors.push(message.text());
    });

    return async () => [...await page.evaluate(() => (window as unknown as { cspViolations: string[] }).cspViolations), ...consoleErrors];
}

// Parcourt la page de haut en bas : les images chargées à l'approche sont demandées elles aussi
async function scrollThrough(page: Page) {
    await page.evaluate(async () => {
        const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
            window.scrollTo(0, y);
            await pause(100);
        }
        await pause(300);
    });
}

const PAGES: [string, RegExp][] = [
    ['/', /Bienvenue chez l.Anomalie/],
    ['/tattoo', /Mes flashs/],
    ['/makeup', /Portfolio Makeup/],
    ['/project', /Bienvenue dans mon univers/],
    ['/contact', /Nous contacter/],
    ['/news/1', /Convention de Montpellier/],
    ['/page-inconnue', /Page introuvable/],
];

test.describe('content security policy', () => {
    for (const [path, heading] of PAGES) {
        test(`${path} loads without anything blocked`, async ({ page }) => {
            const errors: string[] = [];
            page.on('pageerror', (error) => errors.push(error.message));
            const blocked = await watchPolicy(page);

            const response = await page.goto(path);
            // Garde-fou : la page a bien reçu la politique (et les autres en-têtes de _headers)
            expect(response!.headers()['content-security-policy']).toContain("default-src 'self'");
            expect(response!.headers()['x-frame-options']).toBe('DENY');
            await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
            await page.waitForLoadState('networkidle');
            await scrollThrough(page);

            expect(await blocked()).toEqual([]);
            expect(errors).toEqual([]);
        });
    }

    test('news and reviews come from Supabase', async ({ page }) => {
        const blocked = await watchPolicy(page);
        await page.goto('/');

        await expect(page.locator('.news-section').getByRole('heading', { name: 'Convention de Montpellier' })).toBeVisible();
        await expect(page.getByText('Un trait d’une finesse incroyable.').first()).toBeAttached();
        expect(await blocked()).toEqual([]);
    });

    test('the 3D model is decoded (Draco worker and WebAssembly)', async ({ page }) => {
        const blocked = await watchPolicy(page);
        // Le décodeur Draco répond { type: 'decode' } une fois la géométrie décodée. Bloqué (worker
        // ou WebAssembly), il se tait : le modèle ne s'affiche jamais.
        await page.addInitScript(() => {
            const NativeWorker = window.Worker;
            Object.assign(window, { dracoDecoded: 0 });
            window.Worker = class extends NativeWorker {
                constructor(...args: ConstructorParameters<typeof Worker>) {
                    super(...args);
                    this.addEventListener('message', (e) => {
                        if (e.data?.type === 'decode') Object.assign(window, { dracoDecoded: (window as unknown as { dracoDecoded: number }).dracoDecoded + 1 });
                    });
                }
            };
        });
        await page.goto('/');

        const webGL = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
        });
        test.skip(!webGL, 'WebGL indisponible dans ce navigateur sans écran : le site n’affiche pas de 3D');

        await expect(page.locator('.model-container canvas')).toBeVisible();
        await expect.poll(() => page.evaluate(() => (window as unknown as { dracoDecoded: number }).dracoDecoded), { timeout: 30_000 }).toBeGreaterThan(0);
        expect(await blocked()).toEqual([]);
    });

    test('a tattoo request with an image goes through Cloudinary and EmailJS', async ({ page }) => {
        const blocked = await watchPolicy(page);
        await page.goto('/contact');
        await page.getByRole('button', { name: 'Projet tatouage' }).click();

        await page.getByLabel('Votre nom & prénom').fill('Alex Martin');
        await page.getByLabel('Votre e-mail').fill('alex@example.com');
        await page.getByLabel('Date de naissance').fill('1995-04-12');
        await page.getByLabel('Taille').fill('10x15cm');
        await page.getByLabel('Emplacement').fill('Avant-bras');
        await page.getByLabel('Description du projet').fill('Une rose gothique entourée de ronces.');
        await page.getByLabel('Images de référence').setInputFiles({ name: 'reference.png', mimeType: 'image/png', buffer: PNG });
        await page.getByRole('button', { name: 'Envoyer' }).click();

        await expect(page.getByText('Message envoyé ! Je vous réponds dès que possible.')).toBeVisible();
        await expect(page.getByText('Votre message a été envoyé, merci !')).toBeVisible();
        // La feuille de react-toastify est chargée (une balise <style> injectée serait bloquée)
        await expect(page.locator('.Toastify__toast-container')).toHaveCSS('position', 'fixed');
        expect(await blocked()).toEqual([]);
    });
});
