import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* Un seul navigateur à la fois : en parallèle, le serveur de dev saturait sous CRA (chunks en attente > 15 s)
     et la suite est plus lente qu'en séquentiel (~45 s pour les 3 navigateurs). */
  workers: 1,
  /* Marge pour le premier chargement des pages sur un serveur de dev non minifié */
  expect: { timeout: 15_000 },
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Lance le serveur de dev Vite (port 3000, cf. vite.config.js) ; en local, réutilise un `npm start` déjà ouvert */
  webServer: {
    command: 'npm start',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    /* Clés EmailJS et Cloudinary factices (prioritaires sur le .env pour Vite) : le formulaire peut aller
       jusqu'à l'envoi, que tests/contact.spec.ts intercepte. Un serveur réutilisé garde ses vraies clés,
       les envois restent interceptés. */
    env: {
      REACT_APP_EMAILJS_SERVICE_ID: 'service_test',
      REACT_APP_EMAILJS_DEFAULT_TEMPLATE_ID: 'template_question',
      REACT_APP_EMAILJS_TATTOO_TEMPLATE_ID: 'template_tattoo',
      REACT_APP_EMAILJS_PUBLIC_KEY: 'public_key_test',
      REACT_APP_CLOUDINARY_CLOUD_NAME: 'demo',
      REACT_APP_CLOUDINARY_UPLOAD_PRESET: 'preset_test',
    },
  },
});
