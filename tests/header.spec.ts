import {test, expect} from '@playwright/test';

// Test the classic redirection of header links
test('Header links should navigate to correct pages', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Liste des liens et des URLs attendues
    const links = [
        { text: 'Accueil', url: '/' },
        { text: 'Shop', url: '/project' },
        { text: 'Tattoo', url: '/tattoo' },
        { text: 'Makeup', url: '/makeup' },
        { text: 'Contact', url: '/contact' },
    ];

    for (const link of links) {
        // Cliquer sur le lien
        await page.locator('.header-link', { hasText: link.text }).click();

        // Vérifier que l'URL est correcte
        await expect(page).toHaveURL(new RegExp(link.url + '$'));
    }
});

// Test the actual header component rendering and functionality
test('Header component should render and have functional links', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Vérifier que le header est visible
    const header = page.locator('.Header');
    await expect(header).toBeVisible();

    // Vérifier que la barre de navigation est visible
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();

    // Vérifier que tous les liens de navigation sont visibles
    const navLinks = page.locator('.header-link');
    await expect(navLinks).toHaveCount(5);
});



