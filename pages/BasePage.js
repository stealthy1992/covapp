
const { test, expect } = require('@playwright/test');

class BasePage{

    constructor(context){

        this.context = context;
    }

    get page() {
        return this.context.pages()[0];  // handy getter for convenience
    }

    async navigate(path){

        await this.page.goto(path);
    }

    async click(selector){

        await this.page.locator(selector).click();
    }

    async fill(selector, value){
        // console.log('values are: ', selector, ' and ',value);
        await this.page.locator(selector).fill(value);

    }

    async getText(selector){

        return await this.page.locator(selector).innerText();

    }

    async isVisible(errorMessage){
        console.log('Message is ', errorMessage);
        const errorLocator = this.page.getByText(errorMessage, { exact: true })
        // console.log(errorLocator)
        return errorLocator;
        // return await this.page.locator(selector).isVisible();

    }

    async waitForSelector(selector){

        await this.page.locator(selector).waitFor({ state: 'visible' });

    }

    async selectDropdownOption(selector, option){
        
        await selector.click();
        await this.page.waitForSelector('[role="listbox"]', { state: 'visible' });
        const countryList = await this.page.locator('[role="option"]').allTextContents(); 
        await option.click();
        return countryList;

    }

    async screenshot(name) {
        await this.page.screenshot({
          path: `test-results/screenshots/${name}.png`,
          fullPage: true,
        });
    }

}

module.exports = BasePage;