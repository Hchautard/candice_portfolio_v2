import { test, expect, type Page } from '@playwright/test';

// Formulaire de contact et parcours « Adopter ce flash ».
// Rien ne part jamais : EmailJS et Cloudinary sont interceptés dans chaque test, avec les clés
// factices de playwright.config.ts (ou les vraies clés du .env si un `npm start` est réutilisé).

// PNG de 1 × 1 px
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const image = (name: string) => ({ name, mimeType: 'image/png', buffer: PNG });

const SUCCESS = 'Message envoyé ! Je vous réponds dès que possible.';

type Email = { service_id: string; template_id: string; template_params: Record<string, unknown> };

async function mockServices(page: Page, { uploadStatus = 200, emailStatus = 200 } = {}) {
    const emails: Email[] = [];
    const uploads: string[] = [];

    await page.route('https://api.emailjs.com/**', async (route) => {
        emails.push(route.request().postDataJSON());
        await route.fulfill({ status: emailStatus, contentType: 'text/plain', body: emailStatus === 200 ? 'OK' : 'Server error' });
    });
    await page.route('https://api.cloudinary.com/**', async (route) => {
        uploads.push(route.request().url());
        if (uploadStatus !== 200) {
            await route.fulfill({ status: uploadStatus, json: { error: { message: 'Upload failed' } } });
            return;
        }
        const n = uploads.length;
        await route.fulfill({
            json: { secure_url: `https://res.cloudinary.com/demo/image/upload/ref-${n}.png`, public_id: `tattoo_requests/ref-${n}` },
        });
    });

    return { emails, uploads };
}

async function fillIdentity(page: Page) {
    await page.getByLabel('Votre nom & prénom').fill('Alex Martin');
    await page.getByLabel('Votre e-mail').fill('alex@example.com');
    await page.getByLabel('Date de naissance').fill('1995-04-12');
}

async function fillTattooRequest(page: Page) {
    await fillIdentity(page);
    await page.getByLabel('Taille').fill('10x15cm');
    await page.getByLabel('Emplacement').fill('Avant-bras');
    await page.getByLabel('Description du projet').fill('Une rose gothique entourée de ronces.');
}

const send = (page: Page) => page.getByRole('button', { name: 'Envoyer' }).click();

test.describe('contact form', () => {
    test('empty question: every error shown, focus on the first field, error cleared while typing', async ({ page }) => {
        const { emails } = await mockServices(page);
        await page.goto('/contact');

        await send(page);

        const name = page.getByLabel('Votre nom & prénom');
        await expect(name).toBeFocused();
        await expect(name).toHaveAttribute('aria-invalid', 'true');
        await expect(name).toHaveAccessibleDescription('Le nom doit contenir au moins 2 caractères.');
        for (const message of [
            'Adresse e-mail invalide.',
            'La date de naissance est requise.',
            "L'objet doit contenir au moins 5 caractères.",
            'Le message doit contenir au moins 10 caractères.',
        ]) {
            await expect(page.getByText(message)).toBeVisible();
        }

        await name.fill('Alex Martin');
        await expect(name).not.toHaveAttribute('aria-invalid');
        await expect(page.getByText('Le nom doit contenir au moins 2 caractères.')).toHaveCount(0);
        expect(emails).toHaveLength(0);
    });

    test('question sent: EmailJS gets the fields, success shown, form emptied', async ({ page }) => {
        const { emails } = await mockServices(page);
        await page.goto('/contact');

        await fillIdentity(page);
        await page.getByLabel('Objet').fill('Disponibilités en mars');
        await page.getByLabel('Votre message').fill('Bonjour, avez-vous des créneaux en mars ?');
        await send(page);

        await expect(page.getByText(SUCCESS)).toBeVisible();
        expect(emails).toHaveLength(1);
        expect(emails[0].template_params).toMatchObject({
            name: 'Alex Martin',
            email: 'alex@example.com',
            birthdate: '1995-04-12',
            subject: 'Disponibilités en mars',
            message: 'Bonjour, avez-vous des créneaux en mars ?',
        });
        await expect(page.getByLabel('Votre nom & prénom')).toHaveValue('');
        await expect(page.getByLabel('Objet')).toHaveValue('');
    });

    test('"Projet tatouage" swaps the fields and starts from an empty form', async ({ page }) => {
        await page.goto('/contact');
        await page.getByLabel('Votre nom & prénom').fill('Alex Martin');

        const tattooTab = page.getByRole('button', { name: 'Projet tatouage' });
        await tattooTab.click();

        await expect(tattooTab).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByRole('button', { name: 'Question' })).toHaveAttribute('aria-pressed', 'false');
        await expect(page.getByLabel('Objet')).toHaveCount(0);
        await expect(page.getByLabel('Taille')).toBeVisible();
        await expect(page.getByLabel('Emplacement')).toBeVisible();
        await expect(page.getByLabel('Description du projet')).toBeVisible();
        await expect(page.getByLabel('Votre nom & prénom')).toHaveValue('');
    });

    test('tattoo request with an image: uploaded first, its URL sent in the e-mail', async ({ page }) => {
        const { emails, uploads } = await mockServices(page);
        await page.goto('/contact');
        await page.getByRole('button', { name: 'Projet tatouage' }).click();

        await fillTattooRequest(page);
        await page.getByLabel('Images de référence').setInputFiles(image('reference.png'));
        await expect(page.getByText('1 fichier sélectionné')).toBeVisible();
        await expect(page.getByText('reference.png (1 Ko)')).toBeVisible();
        await send(page);

        await expect(page.getByText(SUCCESS)).toBeVisible();
        expect(uploads).toHaveLength(1);
        expect(emails).toHaveLength(1);
        expect(emails[0].template_params).toMatchObject({
            size: '10x15cm',
            placement: 'Avant-bras',
            description: 'Une rose gothique entourée de ronces.',
            imageUrls: 'https://res.cloudinary.com/demo/image/upload/ref-1.png',
            oneOrManyTattoosText: 'Un seul tatouage',
            isForACoverageText: 'Non',
        });
        // Les objets File ne partent pas dans le mail : seules les URL
        expect(emails[0].template_params).not.toHaveProperty('files');
    });

    test('failed image upload: nothing e-mailed, the error names the image', async ({ page }) => {
        const { emails } = await mockServices(page, { uploadStatus: 500 });
        await page.goto('/contact');
        await page.getByRole('button', { name: 'Projet tatouage' }).click();

        await fillTattooRequest(page);
        await page.getByLabel('Images de référence').setInputFiles(image('reference.png'));
        await send(page);

        await expect(page.getByRole('alert')).toContainText("Impossible d'envoyer l'image reference.png");
        expect(emails).toHaveLength(0);
        // La demande reste remplie pour réessayer
        await expect(page.getByLabel('Taille')).toHaveValue('10x15cm');
    });

    test('files refused before sending: not an image, more than 5', async ({ page }) => {
        await page.goto('/contact');
        await page.getByRole('button', { name: 'Projet tatouage' }).click();
        const files = page.getByLabel('Images de référence');

        await files.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('notes') });
        await expect(page.getByText('Seules les images sont acceptées : notes.txt.')).toBeVisible();
        await expect(files).toHaveAttribute('aria-invalid', 'true');

        await files.setInputFiles(['1', '2', '3', '4', '5', '6'].map((n) => image(`ref-${n}.png`)));
        await expect(page.getByText('5 images maximum (vous en avez choisi 6).')).toBeVisible();
        await expect(page.getByText(/fichiers? sélectionnés?/)).toHaveCount(0);
    });

    test('e-mail service down: readable error, the message is kept', async ({ page }) => {
        await mockServices(page, { emailStatus: 500 });
        await page.goto('/contact');

        await fillIdentity(page);
        await page.getByLabel('Objet').fill('Disponibilités en mars');
        await page.getByLabel('Votre message').fill('Bonjour, avez-vous des créneaux en mars ?');
        await send(page);

        await expect(page.getByRole('alert')).toHaveText(
            "L'envoi a échoué. Réessayez dans quelques minutes, ou écrivez-moi sur Instagram (@l__anomalie).",
        );
        await expect(page.getByLabel('Votre message')).toHaveValue('Bonjour, avez-vous des créneaux en mars ?');
    });

    test('robot filling the hidden field: success shown, nothing sent', async ({ page }) => {
        const { emails } = await mockServices(page);
        await page.goto('/contact');

        await fillIdentity(page);
        await page.getByLabel('Objet').fill('Offre exceptionnelle');
        await page.getByLabel('Votre message').fill('Cliquez sur ce lien pour gagner.');
        await page.locator('#website').fill('https://spam.example', { force: true });
        await send(page);

        await expect(page.getByText(SUCCESS)).toBeVisible();
        expect(emails).toHaveLength(0);
    });
});

test.describe('adopt a flash', () => {
    // Retournement instantané (GSAP suit prefers-reduced-motion) : pas d'attente sur l'animation
    test.use({ reducedMotion: 'reduce' });

    const cards = (page: Page) => page.locator('#card-distribution-container > div');

    test('available flash: "Adopter ce flash" opens a prefilled tattoo request', async ({ page }) => {
        await page.goto('/tattoo');

        // Carte disponible : « Disponible ! » au dos, pas de photo de réalisation
        const card = cards(page).filter({ hasText: 'Disponible !' }).first();
        const flip = card.getByRole('button');
        const flashName = (await flip.getAttribute('aria-label'))?.match(/« (.+) »/)?.[1];
        expect(flashName).toBeTruthy();

        await expect(card.getByRole('link', { name: 'Adopter ce flash' })).toHaveCount(0);
        await flip.click();
        await expect(flip).toHaveAttribute('aria-pressed', 'true');
        await card.getByRole('link', { name: 'Adopter ce flash' }).click();

        await expect(page).toHaveURL(`/contact?flash=${encodeURIComponent(flashName ?? '')}`);
        await expect(page.getByRole('button', { name: 'Projet tatouage' })).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByLabel('Description du projet')).toHaveValue(`Je souhaite adopter le flash « ${flashName} ».`);
    });

    test('flash already tattooed: no adopt link once flipped', async ({ page }) => {
        await page.goto('/tattoo');

        const card = cards(page).filter({ hasNotText: 'Disponible !' }).first();
        await card.getByRole('button').click();

        await expect(card.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
        await expect(card.getByRole('link', { name: 'Adopter ce flash' })).toHaveCount(0);
    });

    test('keyboard: Enter flips the card and flips it back', async ({ page }) => {
        await page.goto('/tattoo');

        const card = cards(page).filter({ hasText: 'Disponible !' }).first();
        const flip = card.getByRole('button');
        await flip.focus();

        await page.keyboard.press('Enter');
        await expect(flip).toHaveAttribute('aria-pressed', 'true');
        await expect(card.getByRole('link', { name: 'Adopter ce flash' })).toBeVisible();

        await page.keyboard.press('Enter');
        await expect(flip).toHaveAttribute('aria-pressed', 'false');
        await expect(card.getByRole('link', { name: 'Adopter ce flash' })).toHaveCount(0);
    });

    test('flash name from the address is cleaned and capped at 80 characters', async ({ page }) => {
        const raw = `Cyber\u0007 étoile ${'x'.repeat(100)}`;
        await page.goto(`/contact?flash=${encodeURIComponent(raw)}`);

        await expect(page.getByLabel('Description du projet')).toHaveValue(
            `Je souhaite adopter le flash « Cyber étoile ${'x'.repeat(67)} ».`,
        );
    });
});
