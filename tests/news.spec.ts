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

        const section = page.getByRole('region', { name: 'Actualités', exact: true });
        await expect(section.getByRole('heading', { level: 3 })).toHaveText(LATEST_THREE);
        const stamp = section.locator('.news-stamp').first();
        await expect(stamp).toHaveAttribute('datetime', '2026-10-12');
        await expect(stamp).toHaveText('12 oct. 2026');
    });

    test('home leads to the full list when there are older news', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/');

        await page.getByRole('link', { name: 'Toutes les actualités' }).click();
        await expect(page).toHaveURL(/\/project#actualites$/);
        await expect(page.getByRole('heading', { name: 'Actualités', level: 2, exact: true })).toBeInViewport();
    });

    test('home: no link to the full list when every news item is already shown', async ({ page }) => {
        await mockSupabase(page, { news: NEWS.slice(0, 3) });
        await page.goto('/');

        await expect(page.locator('.news-entry')).toHaveCount(3);
        await expect(page.getByRole('link', { name: 'Toutes les actualités' })).toHaveCount(0);
    });

    test('a news item opens its own page', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/');

        await page.getByRole('link', { name: 'Convention de Montpellier', exact: true }).click();

        await expect(page).toHaveURL(/\/news\/1$/);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Convention de Montpellier');
        const header = page.locator('.news-detail-header');
        await expect(header.locator('time')).toHaveAttribute('datetime', '2026-10-12');
        await expect(header.locator('time')).toHaveText('12 oct. 2026');
        await expect(header.locator('.news-detail-place')).toHaveText('Lieu : Montpellier');
        // Le contenu est écrit en Markdown
        await expect(page.getByRole('heading', { name: 'Programme' })).toBeVisible();
        await expect(page.locator('.news-detail-body strong')).toHaveText('à prix doux');
        await expect(page).toHaveTitle(/^Convention de Montpellier/);
    });

    test('project page lists every news item, newest first', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/project');

        const feed = page.getByRole('region', { name: 'Actualités', exact: true });
        await expect(feed.getByRole('heading', { level: 3 })).toHaveText([...LATEST_THREE, 'Guest à Lyon', 'Ouverture des réservations']);
        // Le titre est le lien : c'est lui qu'annonce un lecteur d'écran
        await feed.getByRole('link', { name: 'Guest à Lyon' }).click();
        await expect(page).toHaveURL(/\/news\/4$/);
    });

    test('an event without a date says the date is to come', async ({ page }) => {
        await mockSupabase(page, {
            news: [
                NEWS[0],
                { id: 6, title: 'Soirée de lancement', description: 'Apéro et concert.', category: 'Événement', location: 'À définir', date_event: null, created_at: '2026-01-01T10:00:00Z' },
                { id: 7, title: 'Carnet de croquis', description: 'Mes recherches.', category: 'Création', date_event: null, created_at: '2026-01-01T10:00:00Z' },
            ],
        });
        await page.goto('/project');

        const party = page.locator('.news-entry', { hasText: 'Soirée de lancement' });
        await expect(party.locator('.news-stamp')).toHaveText('Date à venir');
        // Hors événement, pas de date du tout plutôt qu'une annonce trompeuse
        await expect(page.locator('.news-entry', { hasText: 'Carnet de croquis' }).locator('.news-stamp')).toHaveText('');
    });

    test('older news wait behind a button', async ({ page }) => {
        const many = Array.from({ length: 8 }, (_, i) => ({
            id: 100 + i,
            title: `Actualité ${i + 1}`,
            description: 'Résumé.',
            category: 'Création',
            date_event: `2026-0${9 - i}-01`,
            created_at: '2026-01-01T10:00:00Z',
        }));
        await mockSupabase(page, { news: many });
        await page.goto('/project');

        const titles = page.locator('.news-entry__title');
        await expect(titles).toHaveCount(6);
        await page.getByRole('button', { name: 'Afficher les plus anciennes (2)' }).click();
        await expect(titles).toHaveCount(8);
        // Au clavier, on reprend sur la première actualité qui vient d'apparaître
        await expect(page.getByRole('link', { name: 'Actualité 7' })).toBeFocused();
        await expect(page.getByRole('button', { name: /Afficher les plus anciennes/ })).toHaveCount(0);
    });

    test('a news photo, when given, shows in the list and on its page', async ({ page }) => {
        const image = 'https://demo.supabase.co/storage/v1/object/public/news/poz.webp';
        await page.route(image, (route) => route.fulfill({ status: 200, contentType: 'image/webp', body: '' }));
        await mockSupabase(page, { news: [{ ...NEWS[1], image }] });
        await page.goto('/project');

        await expect(page.locator('.news-entry__image')).toHaveAttribute('src', image);
        await page.getByRole('link', { name: 'Convention de Montpellier' }).click();
        await expect(page.locator('.news-detail-cover')).toHaveAttribute('src', image);
    });

    test('news content: loose bold and single line breaks are kept as written', async ({ page }) => {
        // Saisie à la main dans Supabase : espaces à l'intérieur des **, retours à la ligne simples
        const content = '- Niveau **Débutant **!\n- Niveau Confirmé\n\nAvec bienveillance et** attention**.\n\nPrix :** 60€ **\n**-15% étudiant**';
        await mockSupabase(page, { news: [{ ...NEWS[1], content }] });
        await page.goto('/news/1');

        const body = page.locator('.news-detail-body');
        await expect(body.locator('li')).toHaveText(['Niveau Débutant !', 'Niveau Confirmé']);
        await expect(body.locator('strong')).toHaveText(['Débutant', 'attention', '60€', '-15% étudiant']);
        await expect(body).not.toContainText('**');
        await expect(body.locator('p').last().locator('br')).toHaveCount(1);
    });

    test('a news page leads to other news and back to the full list', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/news/2');

        const more = page.getByRole('region', { name: 'Autres actualités' });
        await expect(more.getByRole('heading', { level: 3 })).toHaveText(['Convention de Montpellier', 'Illustration du mois', 'Guest à Lyon']);

        await page.getByRole('link', { name: 'Toutes les actualités' }).click();
        await expect(page).toHaveURL(/\/project#actualites$/);
        await expect(page.getByRole('heading', { name: 'Actualités', level: 2, exact: true })).toBeInViewport();
    });

    test('an unknown news id leads back to the news list', async ({ page }) => {
        await mockSupabase(page);
        await page.goto('/news/999');

        await expect(page).toHaveURL(/\/project#actualites$/);
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
