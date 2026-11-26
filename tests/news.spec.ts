import { test, expect, type Page } from '@playwright/test';

// Actualités et avis, avec une base Supabase factice (cf. playwright.config.ts) : chaque test
// intercepte ses requêtes et répond avec les données ci-dessous. Le motif ne porte que sur le
// chemin : il fonctionne aussi avec un serveur de dev déjà lancé sur la vraie base.

// Dates « AAAA-MM-JJ » comme dans la table news. Elles sont volontairement dans le désordre :
// le site doit afficher la plus récente d'abord.
const NEWS = [
    { id: 4, title: 'Guest à Lyon', description: 'Deux jours au salon Encre Noire.', category: 'Événement', location: 'Lyon', date_event: '2026-06-15', created_at: '2026-05-01T10:00:00Z' },
    { id: 1, title: 'Convention de Montpellier', description: 'Trois jours de flash day.', content: '## Programme\n\nDes flashs **à prix doux** tout le week-end.', category: 'Événement', location: 'Montpellier', date_event: '2026-10-12', created_at: '2026-09-01T10:00:00Z' },
    { id: 3, title: 'Illustration du mois', description: 'Une sorcière cyber-sigilism.', category: 'Illustration', location: 'Atelier', date_event: '2026-08-05', created_at: '2026-08-01T10:00:00Z' },
    { id: 5, title: 'Ouverture des réservations', description: 'Le carnet de rendez-vous est ouvert.', category: 'Création', location: 'Atelier', date_event: '2026-03-01', created_at: '2026-02-20T10:00:00Z' },
    { id: 2, title: 'Nouvelle planche de flashs', description: 'Douze flashs gothiques à adopter.', category: 'Création', location: 'Atelier', date_event: '2026-09-20', created_at: '2026-09-10T10:00:00Z' },
];

const REVIEWS = [
    { id: 1, author: 'Léa', rating: 5, comment: 'Un trait d’une finesse incroyable.', tattoo_style: 'Cyber-sigilism', created_at: '2026-10-01T12:00:00Z' },
    { id: 2, author: 'Maxime', rating: 4, comment: 'Très à l’écoute, projet adapté à mon bras.', tattoo_style: 'Gothique', created_at: '2026-09-15T12:00:00Z' },
];

const LATEST_THREE = ['Convention de Montpellier', 'Nouvelle planche de flashs', 'Illustration du mois'];

type Database = { news?: object[]; reviews?: object[]; status?: number };

async function mockSupabase(page: Page, { news = NEWS, reviews = REVIEWS, status = 200 }: Database = {}) {
    await page.route(/\/rest\/v1\/(news|reviews)(\?|$)/, (route) => {
        if (status !== 200) return route.fulfill({ status, json: { message: 'Service indisponible' } });
        const table = /\/rest\/v1\/(\w+)/.exec(route.request().url())?.[1];
        return route.fulfill({ json: table === 'news' ? news : reviews });
    });
}

// Les dates seules sont affichées dans le fuseau du visiteur : on fixe celui de Montpellier
test.use({ timezoneId: 'Europe/Paris', reducedMotion: 'reduce' });

test.describe('news', () => {
    test('home shows the three latest news, newest first', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/');

        const section = page.locator('.news-section');
        await expect(section.getByRole('heading', { level: 3 })).toHaveText(LATEST_THREE);
        await expect(section.locator('.news-date').first()).toHaveText('12/10/2026');
    });

    test('a news item opens its own page', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/');

        await page.getByRole('link', { name: "Lire l'actualité : Convention de Montpellier" }).click();

        await expect(page).toHaveURL(/\/news\/1$/);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Convention de Montpellier');
        await expect(page.locator('.news-detail-meta')).toHaveText('12 octobre 2026 | Montpellier');
        // Le contenu est écrit en Markdown
        await expect(page.getByRole('heading', { name: 'Programme' })).toBeVisible();
        await expect(page.locator('.news-detail-body strong')).toHaveText('à prix doux');
        await expect(page).toHaveTitle(/^Convention de Montpellier/);
    });

    test('project page shows the latest news in a grid, then the older ones', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/project');

        await expect(page.locator('.news-grid-shop .news-title-shop')).toHaveText(LATEST_THREE);
        await expect(page.locator('.news-list-row .news-title-shop')).toHaveText(['Guest à Lyon', 'Ouverture des réservations']);
    });

    test('an unknown news id leads back to the project page', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/news/999');

        await expect(page).toHaveURL(/\/project$/);
    });

    test('no news: the section is not shown', async ({ page }) => {
        await mockSupabase(page, { news: [] });
        await page.goto('/');

        await expect(page.getByRole('heading', { name: 'Avis Clients' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Actualités' })).toHaveCount(0);
    });

    test('database outage: a message replaces the news, nothing crashes', async ({ page }) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));
        await mockSupabase(page, { status: 503 });
        await page.goto('/');

        await expect(page.getByText('Les actualités sont indisponibles pour le moment.')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Avis Clients' })).toHaveCount(0);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(pageErrors).toEqual([]);
    });
});

test.describe('reviews', () => {
    test('home shows each review once to assistive technologies, with its rating', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/');

        // Les copies servant à la boucle de défilement sont masquées (aria-hidden)
        const cards = page.locator('.review-card-carousel:not([aria-hidden="true"])');
        await expect(cards.locator('.client-name')).toHaveText(['Léa', 'Maxime']);
        await expect(cards.first().getByRole('img', { name: 'Note : 5 sur 5' })).toBeVisible();
        await expect(cards.first().locator('.review-comment')).toHaveText('Un trait d’une finesse incroyable.');
    });
});
