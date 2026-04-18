const { test, expect } = require('@playwright/test');
const LoginPage = require('../../../pages/LoginPage');

test.describe('Login', () => {
    let loginPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
    })

    test('This will log user in and redirects them to dashboard page', async ({page}) => {
        await loginPage.login('jamesb@gmail.com', 'James1234!');
        await page.waitForURL('https://covapp-gamma.vercel.app/dashboard');
        await page.waitForLoadState('networkidle')
        await page.pause();
        // expect(page.url()).toContain('/dashboard');
        

    })

    test('should check the error message if email is in wrong format', async () => {
        await loginPage.login('jamesb', 'James1234!');
        const errorLocator = await loginPage.isErrorVisible(
            'Firebase: Error (auth/invalid-email).'
        )
        await expect(errorLocator).toBeVisible();
        expect(errorLocator).toContainText('invalid-email'); 
    })

    test('Should check the error message if user is not found', async () => {
        await loginPage.login('jame@gmail.com', 'James1234!');
        const errorLocator = await loginPage.isErrorVisible(
            'Firebase: Error (auth/user-not-found).'
        )
        await expect(errorLocator).toBeVisible();
        expect(errorLocator).toContainText('user-not-found');  
    })

    test('Should check the error message if password is invalid', async () => {
        await loginPage.login('jamesb@gmail.com', 'blahblah!');
        const errorLocator = await loginPage.isErrorVisible(
            'Firebase: Error (auth/wrong-password).'
        )
        await expect(errorLocator).toBeVisible();
        expect(errorLocator).toContainText('wrong-password');  
    })
})