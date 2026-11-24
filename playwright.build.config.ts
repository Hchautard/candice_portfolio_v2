import { defineConfig, devices } from '@playwright/test';

// Tests du site construit, tel qu'il sera publié (`npm run test:build`) : pour l'instant la politique
// de sécurité (CSP) de public/_headers. Le serveur de dev ne s'y prête pas, il ajoute ses propres
// scripts en ligne à la page.
const PORT = 4174;

// Services factices inscrits dans le build. Les tests interceptent ces adresses, mais le navigateur
// applique la CSP avant : un service oublié dans public/_headers fait échouer le test.
// Ces valeurs passent avant celles d'un .env local (Vite donne la priorité à process.env).
Object.assign(process.env, {
  REACT_APP_SUPABASE_URL: 'https://csp-test.supabase.co',
  REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY: 'sb_publishable_test',
  REACT_APP_EMAILJS_SERVICE_ID: 'service_test',
  REACT_APP_EMAILJS_DEFAULT_TEMPLATE_ID: 'template_question',
  REACT_APP_EMAILJS_TATTOO_TEMPLATE_ID: 'template_tattoo',
  REACT_APP_EMAILJS_PUBLIC_KEY: 'public_key_test',
  REACT_APP_CLOUDINARY_CLOUD_NAME: 'demo',
  REACT_APP_CLOUDINARY_UPLOAD_PRESET: 'preset_test',
});

export default defineConfig({
  testDir: './tests/build',
  outputDir: 'test-results/build',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  expect: { timeout: 15_000 },
  // Rapport rangé à côté de celui des tests principaux : la CI publie tout playwright-report/
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report/build' }]]
    : [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/build' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      // Sans GPU (CI), Chromium n'offre WebGL qu'avec ce rendu logiciel : il faut le modèle 3D
      use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--enable-unsafe-swiftshader'] } },
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

  // Build neuf à chaque lancement (quelques secondes), dans build-test/ : build/ garde les vraies clés.
  // Jamais de serveur réutilisé, il pourrait servir un ancien build.
  webServer: {
    command: `npx vite build --outDir build-test && npx vite preview --outDir build-test --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
