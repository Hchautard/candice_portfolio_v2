import { test, expect, type Page } from '@playwright/test';

// Page Makeup : carrousel en cylindre (un look par carte), qui tourne au défilement, au glisser,
// avec les flèches et au clavier ; photos d'un look dans une fenêtre ; grille fixe quand le
// système demande de réduire les animations. Looks : src/data/makeupLooks.json (23).

const LOOK_COUNT = 23;

// Titre du look affiché sous le cylindre, et son compteur (« 01 / 23 » à l'écran)
const activeTitle = (page: Page) => page.locator('.look-title[data-active] .look-title__name');
const counter = (page: Page) => page.locator('.look-ring__counter');

// Défilement d'un look à l'autre : hauteur de la section moins l'écran, répartie entre les looks
// (la section commence en haut de la page : le look n est de face à n × ce défilement)
const scrollPerLook = (page: Page) => page.evaluate((count) => {
    const section = document.querySelector('.look-ring') as HTMLElement;
    return (section.offsetHeight - innerHeight) / (count - 1);
}, LOOK_COUNT);

test.describe('makeup carousel', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/makeup');
        await expect(activeTitle(page)).toHaveText('La princesse');
    });

    test('shows one card per look, the first one in front', async ({ page }) => {
        await expect(page.locator('.look-card')).toHaveCount(LOOK_COUNT);
        await expect(page.locator('.look-title[data-active] .look-title__series')).toHaveText('Magic Garden');
        await expect(counter(page)).toHaveText(/01\s*\/\s*sur\s*23/);
        // Le look de face est le seul atteignable avec Tab
        await expect(page.locator('.look-card[tabindex="0"]')).toHaveCount(1);
        await expect(page.locator('.look-card[data-active]')).toHaveAttribute('aria-label', /La princesse/);
    });

    test('arrows turn to the next and previous looks', async ({ page }) => {
        await page.getByRole('button', { name: 'Look suivant' }).click();
        await expect(activeTitle(page)).toHaveText("L'enivrante");
        await expect(counter(page)).toHaveText(/02/);

        await page.getByRole('button', { name: 'Look précédent' }).click();
        await expect(activeTitle(page)).toHaveText('La princesse');
        await expect(page.getByRole('button', { name: 'Look précédent' })).toHaveAttribute('aria-disabled', 'true');
    });

    test('the keyboard turns the cylinder and moves the focus along', async ({ page }) => {
        const front = page.locator('.look-card[data-active]');
        await front.focus();

        await page.keyboard.press('ArrowRight');
        await expect(activeTitle(page)).toHaveText("L'enivrante");
        await expect(page.locator('.look-card[data-active]')).toBeFocused();

        await page.keyboard.press('End');
        await expect(activeTitle(page)).toHaveText('Chrome');
        await expect(counter(page)).toHaveText(/23\s*\/\s*sur\s*23/);
        await expect(page.locator('.look-card[data-active]')).toBeFocused();
    });

    test('scrolling turns to the next look and stops on it', async ({ page }) => {
        const perLook = await scrollPerLook(page);

        await page.locator('.look-ring__viewport').hover();
        await page.mouse.wheel(0, perLook * 0.6);

        await expect(activeTitle(page)).toHaveText("L'enivrante");
        // Arrêté sur le look : la page est calée sur sa position, pas entre deux looks
        await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5_000 }).toBeCloseTo(perLook, -1);
    });

    test('dragging the cylinder to the left brings the next look', async ({ page }) => {
        const viewport = page.locator('.look-ring__viewport');
        const box = (await viewport.boundingBox())!;
        const y = box.y + box.height / 2;

        await page.mouse.move(box.x + box.width * 0.6, y);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.5, y, { steps: 5 });
        await page.mouse.move(box.x + box.width * 0.35, y, { steps: 5 });
        await page.mouse.up();

        await expect(activeTitle(page)).toHaveText(/L'enivrante|La sirène/);
        // Le relâchement n'ouvre pas les photos
        await expect(page.getByRole('dialog')).toBeHidden();
    });

    test('a neighbouring card turns to its look, the front card opens its photos', async ({ page }) => {
        await page.getByRole('button', { name: "Afficher le look Allo Docteur Love : L'enivrante" }).click();
        await expect(activeTitle(page)).toHaveText("L'enivrante");
        await expect(page.getByRole('dialog')).toBeHidden();

        // Clic à la souris, une fois la rotation finie, la page calée sur le look (locator.click
        // ferait d'abord défiler la page vers la place d'origine de la carte dans WebKit : elle
        // est dans une scène collante)
        const perLook = await scrollPerLook(page);
        await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(perLook, -1);
        const card = (await page.locator('.look-card[data-active]').boundingBox())!;
        await page.mouse.click(card.x + card.width / 2, card.y + card.height / 2);
        await expect(page.getByRole('dialog', { name: "L'enivrante" })).toBeVisible();
    });

    test('the photos of a look open in a window that closes with Escape', async ({ page }) => {
        // Au clavier : à la fermeture, le navigateur rend la main au bouton qui a ouvert la fenêtre
        const open = page.getByRole('button', { name: 'Voir les 2 photos', exact: true });
        await open.focus();
        await page.keyboard.press('Enter');

        const dialog = page.getByRole('dialog', { name: 'La princesse' });
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole('img')).toHaveCount(2);
        await expect(dialog.getByRole('img').first()).toHaveAttribute('alt', 'Maquillage Magic Garden : La princesse, photo 1 sur 2');
        // La page ne défile pas sous la fenêtre
        await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden');

        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(open).toBeFocused();
    });

    test('the close button and a click beside the window close it', async ({ page }) => {
        await page.getByRole('button', { name: 'Voir les 2 photos', exact: true }).click();
        const dialog = page.getByRole('dialog');
        await dialog.getByRole('button', { name: 'Fermer' }).click();
        await expect(dialog).toBeHidden();

        await page.getByRole('button', { name: 'Voir les 2 photos', exact: true }).click();
        await expect(dialog).toBeVisible();
        await page.mouse.click(5, 5);
        await expect(dialog).toBeHidden();
    });
});

test.describe('makeup carousel on a phone', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('the front card and its title fit on the screen', async ({ page }) => {
        await page.goto('/makeup');
        const card = await page.locator('.look-card[data-active]').boundingBox();
        const open = await page.getByRole('button', { name: /^Voir (la|les)/ }).boundingBox();

        expect(card!.x).toBeGreaterThanOrEqual(0);
        expect(card!.x + card!.width).toBeLessThanOrEqual(390);
        expect(open!.y + open!.height).toBeLessThanOrEqual(844);
        // Pas de défilement horizontal de la page
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });
});

test.describe('makeup looks without motion', () => {
    test('a still grid of looks replaces the cylinder', async ({ page }) => {
        // Réglage du système « réduire les animations » (test.use({ reducedMotion }) ne l'applique pas)
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/makeup');

        await expect(page.locator('.look-ring')).toHaveCount(0);
        const looks = page.getByRole('list', { name: 'Looks maquillage' }).getByRole('button');
        await expect(looks).toHaveCount(LOOK_COUNT);

        await looks.filter({ hasText: 'Pearl' }).click();
        await expect(page.getByRole('dialog', { name: 'Pearl' }).getByRole('img')).toHaveCount(2);
    });
});
