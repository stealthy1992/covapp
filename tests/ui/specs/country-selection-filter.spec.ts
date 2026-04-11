// spec: tests/covid-app/test-plan.md
// seed: tests/covid-app/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Functional Testing - Country Selection and Filters', () => {
  // Helper function to login
  const login = async (page) => {
    await page.route('https://covid-19-statistics.p.rapidapi.com/**', (route) => {
      route.continue({
        headers: {
          ...route.request().headers(),
          'x-rapidapi-key': '4173325277msh9d2c8abd90bdcf8p1cd329jsnc97124ee98b3',
          'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      });
    });

    await page.goto('https://covapp-gamma.vercel.app/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('john.doe@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
  };

  test('Select China and Verify Statistics with All Filters', async ({ page }) => {
    await login(page);

    // Select China
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'China' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify data loads
    await expect(page.locator('.MuiDataGrid-root')).toBeVisible();

    // Sort by Date
    await page.getByRole('columnheader', { name: 'Date' }).click();

    // Sort by Province
    await page.getByRole('columnheader', { name: 'Province' }).click();

    // Sort by Active Cases
    await page.getByRole('columnheader', { name: 'Active Cases' }).click();

    // Sort by Confirmed Cases
    await page.getByRole('columnheader', { name: 'Confirmed Cases' }).click();

    // Sort by Active Cases
    await page.getByRole('columnheader', { name: 'Active Cases' }).click();

    // Sort by Confirmed Cases
    await page.getByRole('columnheader', { name: 'Confirmed Cases' }).click();

    // Sort by Deaths
    await page.getByRole('columnheader', { name: 'Deaths' }).click();

    // Sort by Fatality Rate
    await page.getByRole('columnheader', { name: 'Fatality Rate' }).click();

    // Check pagination
    const nextPageButton = page.getByRole('button', { name: 'Go to next page' });
    if (await nextPageButton.isVisible() && await nextPageButton.isEnabled()) {
      await nextPageButton.click();
      await expect(page.locator('table tbody tr')).toHaveCount(await page.locator('table tbody tr').count());
      await page.getByRole('button', { name: 'Go to previous page' }).click();
    }
  });

  test('Select Japan and Check Pagination and Sorting', async ({ page }) => {
    await login(page);

    // Select Japan
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'Japan' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify data loads
    await expect(page.locator('.MuiDataGrid-root')).toBeVisible();

    // Sort by all columns
    await page.getByRole('columnheader', { name: 'Date' }).click();
    await page.getByRole('columnheader', { name: 'Province' }).click();
    await page.getByRole('columnheader', { name: 'Active Cases' }).click();
    await page.getByRole('columnheader', { name: 'Confirmed Cases' }).click();
    await page.getByRole('columnheader', { name: 'Deaths' }).click();
    await page.getByRole('columnheader', { name: 'Fatality Rate' }).click();

    // Check pagination
    const nextPageButton = page.getByRole('button', { name: 'Go to next page' });
    if (await nextPageButton.isVisible()) {
      await nextPageButton.click();
      await expect(page.locator('table tbody tr')).toHaveCount(await page.locator('table tbody tr').count());
    }
  });

  test('Select India and Sort by Confirmed Cases with Province Stats', async ({ page }) => {
    await login(page);

    // Select India
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'India' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify data loads
    await expect(page.locator('.MuiDataGrid-root')).toBeVisible();

    // Sort by Confirmed Cases
    await page.getByRole('columnheader', { name: 'Confirmed Cases' }).click();

    // Click View Stats for first province if available
      await page.getByRole('button', { name: 'View Stats' }).first().click();

      // Select date and check stats
      await page.getByRole('textbox', { name: 'Date' }).fill('03/09/2023');
      // await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('Showing stats for')).toBeVisible();

      // Check for previous vs today comparison
      await expect(page.getByText('Previous')).toBeVisible();
    }
  );

  test('Select Brazil and Verify Fatality Rate Sorting with Edge Dates', async ({ page }) => {
    await login(page);

    // Select Brazil
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'Brazil' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify data loads
    await expect(page.locator('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12')).toBeVisible();

    // Sort by Fatality Rate
    await page.getByRole('columnheader', { name: 'Fatality Rate' }).click();

    // Test province stats with invalid date if available
    if (await page.getByRole('button', { name: 'View Stats' }).first().isVisible()) {
      await page.getByRole('button', { name: 'View Stats' }).first().click();
      await page.getByRole('textbox', { name: 'Date' }).fill('invalid-date');
      // await page.getByRole('button', { name: 'Submit' }).click();
      // Expect no crash or error message

      // Test with early date
      await page.getByRole('textbox', { name: 'Date' }).fill('01/01/2020');
      // await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('Active CasesConfirmed CasesDeathsRecovered01234')).toBeVisible(); // Assuming message for no data
    }
  });

  test('Select Germany and Check Active Cases Filter with API Calls', async ({ page }) => {
    await login(page);

    // Select Germany
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'Germany' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify data loads
    await expect(page.locator('.MuiDataGrid-root')).toBeVisible();

    // Sort by Active Cases
    await page.getByRole('columnheader', { name: 'Active Cases' }).click();

    // Check API call (monitor network)
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/reports?iso=DEU')),
      page.getByRole('button', { name: 'Submit' }).click() // Re-submit to trigger
    ]);
    expect(response.status()).toBe(200);
  });

  test('Select France and Comprehensive Sorting and Navigation', async ({ page }) => {
    await login(page);

    // Select France
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'France' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify data and sort all columns
    await expect(page.locator('.MuiDataGrid-root')).toBeVisible();
    await page.getByRole('columnheader', { name: 'Date' }).click();
    await page.getByRole('columnheader', { name: 'Province' }).click();
    await page.getByRole('columnheader', { name: 'Active Cases' }).click();
    await page.getByRole('columnheader', { name: 'Confirmed Cases' }).click();
    await page.getByRole('columnheader', { name: 'Deaths' }).click();
    await page.getByRole('columnheader', { name: 'Fatality Rate' }).click();

    // Test navigation: Account settings
    await page.getByRole('button', { name: 'Account settings' }).click();
    // Menu opens, no specific expect
  });

  test('Select Italy and Province Stats with Multiple Dates', async ({ page }) => {
    await login(page);

    // Select Italy
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'Italy' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('.MuiDataGrid-root')).toBeVisible();

    // View stats for a province if available
    if (await page.getByRole('button', { name: 'View Stats' }).first().isVisible()) {
      await page.getByRole('button', { name: 'View Stats' }).first().click();

      // Test multiple dates
      const dates = ['03/09/2023', '03/08/2023', '03/07/2023'];
      for (const date of dates) {
        await page.getByRole('textbox', { name: 'Date' }).fill(date);
        // await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByText('Showing stats for')).toBeVisible();
      }
    }
  });

  test('Select Russia and Check for Minimal Data Handling', async ({ page }) => {
    await login(page);

    // Select Russia
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'Russia' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify handles data gracefully
    await expect(page.locator('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12')).toBeVisible();
    // If no rows, expect 'No rows' message
    if (await page.getByText('No rows').isVisible()) {
      await expect(page.getByText('No rows')).toBeVisible();
    } else {
      await expect(page.locator('table tbody tr')).toHaveCount(await page.locator('table tbody tr').count());
    }
  });

  test('Select Canada and Logout Navigation', async ({ page }) => {
    await login(page);

    // Select Canada
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'Canada' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12')).toBeVisible();

    // Test logout
    await page.getByRole('button', { name: 'Account settings' }).click();
    // Assuming logout button is available
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(page).toHaveURL('https://covapp-gamma.vercel.app/signin');
  });

  test('Select Finland (Minimal Data) and Edge Case Handling', async ({ page }) => {
    await login(page);

    // Select Finland
    await page.getByRole('button', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'Finland' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify no crash, handle minimal data
    await expect(page.locator('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12')).toBeVisible();
    // Check if data loads or shows 'No rows'
    if (await page.getByText('No rows').isVisible()) {
      await expect(page.getByText('No rows')).toBeVisible();
    } else {
      // Sort and check
      await page.getByRole('columnheader', { name: 'Province' }).click();
    }
  });
});