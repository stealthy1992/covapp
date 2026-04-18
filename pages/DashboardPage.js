const BasePage = require('./BasePage');
const { expect } = require('@playwright/test')

class DashboardPage extends BasePage{
    constructor(page){
       super(page);
       this.page = page;
       this.selectors = {
            countryDropdown : this.page.getByRole('button', { name: /Country/ }),
            submitButton: this.page.getByRole('button', { name: /Submit/ }),
            listItem: this.page.getByRole('button', { name: /View Stats/ }).first()

       } 
    }

    async selectCountry(country, countries){
        
        
        let option = await this.optionLocator(country);
        let countryList = await this.selectDropdownOption(this.selectors.countryDropdown, option, countries);
        await this.selectors.submitButton.click();
        // Here to execute state search 
        
        return countryList;
    }

    async selectProvince(){
        // await this.page.locator('[role="row"]').filter({ has: this.page.locator('[data-field="province"]', { hasText: province})})
        // .locator('button', { hasText: 'View Stats'}).click();
        const stateArray = [];
        while(true){
            await this.page.waitForSelector('[role="row"]', { state: 'visible'});
            const states = await this.page.locator('.MuiDataGrid-row').all();
            
            for (const state of states){
                const stateName = await state.locator('[data-field="province"]').innerText();
                // console.log(stateName)
                stateArray.push(stateName);
            }
            // console.log('states on current page is: ', stateArray);
            // const nextButton = await this.page.locator('[aria-label="Go to next page"]');
            await this.page.waitForSelector('button[aria-label="Go to next page"]', { state: 'visible'});
            const nextButton = await this.page.locator('button[aria-label="Go to next page"]');
            const isDisabled = await nextButton.isDisabled();
            console.log(isDisabled);
            if(isDisabled) break;
            await nextButton.click();
            await this.page.waitForLoadState('networkidle'); 
        }
        return stateArray;
    }

    async optionLocator(country){
        
       
        // console.log(countryList);
        let selectedOption = await this.page.getByRole('option', { name: country, exact: true });
        return selectedOption;
    }

    async clickListItem(){
        await this.selectors.listItem.click();
    }

}

module.exports = DashboardPage;