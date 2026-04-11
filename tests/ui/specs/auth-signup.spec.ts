// spec: tests/covid-app/test-plan.md
// seed: tests/covid-app/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication Suite', () => {
  test('User Signup - Happy Path', async ({ page }) => {
    const email = `testuser${Date.now()}@example.com`;

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

    // Verify Signup form is displayed with Register button
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();

    // Fill First Name with 'John'
    await page.getByRole('textbox', { name: 'First Name' }).fill('John');

    // Fill Last Name with 'Doe'
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');

    // Fill Email with unique email
    await page.getByRole('textbox', { name: 'Email' }).fill(email);

    // Fill Password with 'Password123'
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Password123');

    // Fill Confirm Password with 'Password123'
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password123');

    // Click Register button
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveURL('https://covapp-gamma.vercel.app/dashboard');
  });

  test('User Signup - Edge Cases and Validations', async ({ page }) => {
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

    // Attempt to submit signup form with all fields empty
    await page.getByRole('button', { name: 'Register' }).click();

    // Fill email with 'invalid-email'
    await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');

    // Submit form with invalid email
    await page.getByRole('button', { name: 'Register' }).click();

    // Fill password with 'pass123'
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('pass123');

    // Fill confirm password with 'pass456'
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('pass456');

    // Submit form with password mismatch
    await page.getByRole('button', { name: 'Register' }).click();

    // Fill password with '123'
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('123');

    // Submit form with weak password
    await page.getByRole('button', { name: 'Register' }).click();
  });
});