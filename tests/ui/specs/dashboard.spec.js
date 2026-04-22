const { test, expect } = require('@playwright/test');
const LoginPage = require('../../../pages/LoginPage');
const DashboardPage = require('../../../pages/DashboardPage');
const StatisticsPage = require('../../../pages/StatisticsPage');

const { loadCSV, getCountries, getStatesByCountry, getCityByProvince, getRow } = require('../../../helpers/csvLoader');

const csvData  = loadCSV('regions_data_v2.csv');
const countries = getCountries(csvData);

test.describe('This will test the dropdown selection mechanism', () => {
    let countryList, countryName = 'China';
    let context, page, loginPage, dashboardPage, statisticsPage, countryData;

    test.beforeAll(async ({browser }) => {
        test.setTimeout(120000);
        context = await browser.newContext();
        page = await context.newPage();
        loginPage = new LoginPage(context);
        dashboardPage = new DashboardPage(context);
        statisticsPage = new StatisticsPage(context);
        countryData = getRow(csvData);
        

        await loginPage.open();
        await loginPage.login('jamesb@gmail.com', 'James1234!');
        await page.waitForURL('https://covapp-gamma.vercel.app/dashboard', { timeout: 10000});
    })

    test.afterAll(async () => {
        await page.close();
        await context.close();
        // await page.pause();
        // await context.close(); // ✅ clean up after ALL tests are done
      });

    test('this will do data-driven testing on the statistics section', async ({request}) => {

        

        for(let country of countryData){

            await dashboardPage.selectCountry(country.region_name);
            await dashboardPage.selectProvince(country.region_province);
            await page.waitForURL('https://covapp-gamma.vercel.app/provincestats');
            const response = await request.get('https://covid-19-statistics.p.rapidapi.com/reports', {
                headers: {
                    'x-rapidapi-key': '4173325277msh9d2c8abd90bdcf8p1cd329jsnc97124ee98b3',
                    'Content-Type': 'application/json'
                },
                params: {
                    region_province: country.region_province,
                    date: country.date,
                }
            });

            const apiData = await response.json();
            const data = apiData?.data[0];
            console.log('API response is: ', apiData);
            const statsDate = await statisticsPage.reformatDate(country.date);
            await statisticsPage.datePicker(statsDate);
            const result = await statisticsPage.verifyChartValues();

            if(result[0]['Active Cases']?.previous !== undefined){
                expect.soft(result[0]['Active Cases']?.previous).toBe(data.active);
            }

            if(result[0]['Active Cases']?.today !== undefined){
                expect.soft(result[0]['Active Cases']?.today).toBe(data.active_diff);
            }
            
            if(result[1]['Confirmed Cases']?.previous !== undefined){
                expect.soft(result[1]['Confirmed Cases']?.previous).toBe(data.confirmed);
            }
           
            if(result[1]['Confirmed Cases']?.today !== undefined){
                expect.soft(result[1]['Confirmed Cases']?.today).toBe(data.confirmed_diff);
            }

            if(result[2]?.Deaths?.previous !== undefined){
                expect.soft(result[2].Deaths?.previous).toBe(data.deaths);
            }
           
            if(result[2]?.Deaths?.today !== undefined){
                expect.soft(result[2].Deaths?.today).toBe(data.deaths_diff);
            }

            if(result[3]?.Recovered?.previous !== undefined){
                expect.soft(result[3].Recovered?.previous).toBe(data.recovered);
            }

            if(result[3]?.Recovered?.today !== undefined){
                expect.soft(result[3].Recovered?.today).toBe(data.recovered_diff);
            }
           
            console.log('All assertions passed.')
            await page.waitForTimeout(2000);
            await loginPage.open();
            await loginPage.login('jamesb@gmail.com', 'James1234!');
            await page.waitForURL('https://covapp-gamma.vercel.app/dashboard', { timeout: 10000});


        }

        expect(page).toHaveURL('https://covapp-gamma.vercel.app/dashboard');
        
    })     
    
})