import { test, expect } from '@playwright/test';

test.describe('home 3D model', () => {
    // Modèle, éclairage et décodeur sont servis par le site : aucune adresse IP de visiteur ne part
    // vers un CDN tiers, et l'accueil ne dépend pas de leur disponibilité. Seul Supabase reste externe.
    test('loads nothing from third-party hosts', async ({ page, baseURL }) => {
        const siteOrigin = new URL(baseURL!).origin;
        const thirdParty: string[] = [];
        page.on('request', (request) => {
            const url = new URL(request.url());
            if (url.protocol === 'data:' || url.protocol === 'blob:') return;
            if (url.origin === siteOrigin || url.hostname.endsWith('.supabase.co')) return;
            thirdParty.push(url.href);
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        expect(thirdParty).toEqual([]);
    });

    // La licence CC BY 4.0 du modèle impose de créditer son auteur
    test('credits the model author in the footer', async ({ page }) => {
        await page.goto('/');
        const footer = page.locator('.site-footer');

        await expect(footer.getByRole('link', { name: 'sayshong' })).toHaveAttribute('href', 'https://sketchfab.com/sayshong');
        await expect(footer.getByRole('link', { name: /CC.BY.4\.0/ })).toHaveAttribute('href', /creativecommons\.org\/licenses\/by\/4\.0/);
    });
});
