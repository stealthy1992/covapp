const { test, assert, expect } = require('@playwright/test');
const LoginPage = require('../../../pages/LoginPage');
const DashboardPage = require('../../../pages/DashboardPage');
const StatisticsPage = require('../../../pages/StatisticsPage');

test.describe('This section will test the statistics/detail page', () => {

    let loginPage, dashboardPage, statisticsPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        statisticsPage = new StatisticsPage(page);
        await loginPage.open();
        await loginPage.login('jamesb@gmail.com', 'James1234!');
        await dashboardPage.selectCountry('China');
        await dashboardPage.selectProvince('Chongqing');
        await page.waitForURL('https://covapp-gamma.vercel.app/provincestats');
    })

    test('this will open the date picker and will pick a date', async ({page}) => {

        // The placeholder is unique enough — just target it directly
        // const dateInput = page.locator('[placeholder="mm/dd/yyyy"]');
        // await dateInput.fill('12/25/2021');

        await page.locator('[aria-label="Choose date"]').click();
        await page.getByRole('button', { name: 'calendar view is open, switch to year view'}).click();
        await page.getByRole('button', { name: '2021'}).click();
        await page.getByRole('button', { name: 'Previous month'}).click();
        await page.getByRole('button', { name: 'Mar 11, 2021'}).click();

        // await page.locator('[aria-label="calendar view is open, switch to year view]').click();
    })
})