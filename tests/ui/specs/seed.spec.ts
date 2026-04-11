import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // Intercept requests to the RapidAPI endpoint and add authorization headers
    await page.route('https://covid-19-statistics.p.rapidapi.com/**', (route) => {
      const headers = {
        ...route.request().headers(),
        'x-rapidapi-key': '4173325277msh9d2c8abd90bdcf8p1cd329jsnc97124ee98b3',
        'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
        'Content-Type': 'application/json'
      };
      route.continue({ headers });
    });

    await page.goto('https://covapp-gamma.vercel.app/');
  });
});
