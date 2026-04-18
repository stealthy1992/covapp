const { test, expect } = require('@playwright/test');
const LoginPage = require('../../../pages/LoginPage');
const DashboardPage = require('../../../pages/DashboardPage');
const { loadCSV, getCountries, getStatesByCountry, getCityByProvince } = require('../../../helpers/csvLoader');

const csvData  = loadCSV('regions_data_v2.csv');
const countries = getCountries(csvData);

test.describe('This will test the dropdown selection mechanism', () => {
    let loginPage, dashboardPage, countryList, countryName = 'China';

    test.beforeAll(async ({browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await loginPage.open();
        await loginPage.login('jamesb@gmail.com', 'James1234!');
        await page.waitForURL('https://covapp-gamma.vercel.app/dashboard');
    })

    test('this will select China from the dropdown list', async ({page}) => {
        countryList = await dashboardPage.selectCountry(countryName, countries);
        for (const country of countries) {
            expect(countryList).toContain(country);
        }

        // await dashboardPage.selectProvince('Chongqing');

        // // await page.locator('[role="row"]').filter({ has: page.locator('[data-field="active"]', {hasText: '1,913,230'})}).locator('button', { hasText: 'View Stats'}).click();
        await page.waitForLoadState('networkidle')
        await page.pause();
        
    })

    
    test(`The country of ${countryName} should show correct states/provinces`, async () => {
    
        const expectedProvinces = getStatesByCountry(csvData, countryName);
        const stateList = await dashboardPage.selectProvince();
        console.log('CSV data is: ', expectedProvinces);
        console.log('UI data is: ', stateList);
        for( let state of expectedProvinces){
            expect(stateList).toContain(state);
        }
    }) 
    
})