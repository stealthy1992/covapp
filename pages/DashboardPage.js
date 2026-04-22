const BasePage = require('./BasePage');
const { expect } = require('@playwright/test')

class DashboardPage extends BasePage{
    constructor(context){
       super(context);
       this.context = context;
       this.selectors = {
            countryDropdown : this.context.pages()[0].getByRole('button', { name: /Country/ }),
            submitButton: this.context.pages()[0].getByRole('button', { name: /Submit/ }),
            listItem: this.context.pages()[0].getByRole('button', { name: /View Stats/ }).first()

       } 
    }

    async selectCountry(country){
        
        
        let option = await this.optionLocator(country);
        let countryList = await this.selectDropdownOption(this.selectors.countryDropdown, option);
        await this.selectors.submitButton.click();
        // Here to execute state search 
        
        // return countryList;
    }

    async selectProvince(province){
        
        const stateArray = [];
        let breakOuter = false;
        // await this.page.waitForSelector('[role="progressbar"]', { state: 'hidden' });
        await this.page.waitForSelector('.MuiDataGrid-cellContent', { state: 'visible' });
        while(true){
            await this.page.waitForSelector('[data-field="province"]', { state: 'visible'});
            // await this.page.waitForTimeout(2000);
            const states = await this.page.locator('[data-field="province"]').filter({ has: this.page.locator('.MuiDataGrid-cellContent')}).all();
            for (const state of states){
                const stateName = await state.innerText();
                // console.log('value without trim is: ',stateName);
                const stateNameTrimmed = stateName.trim();
                if (stateNameTrimmed.length > 0) {  // ← guard before pushing
                    // console.log('province value is: ', stateNameTrimmed);
                    // stateArray.push(stateNameTrimmed);
                    if(stateNameTrimmed === province){
                        await this.clickListItem(province);
                        breakOuter = true;
                        break;
                    }
                    
                }
                
            }
            if(breakOuter) break; 
            // console.log('states on current page is: ', stateArray);
            // const nextButton = await this.page.locator('[aria-label="Go to next page"]');
            await this.page.waitForSelector('button[aria-label="Go to next page"]', { state: 'visible'});
            const nextButton = await this.page.locator('button[aria-label="Go to next page"]');
            const isDisabled = await nextButton.isDisabled();
            // console.log('Check if next button is disabled?: ',isDisabled);
            if(isDisabled) break;
            await nextButton.click();
            await this.page.waitForLoadState('networkidle'); 
        }
        console.log('all provinces are: ', stateArray)
        // return stateArray;
    }

    async optionLocator(country){
        
       
        // console.log(countryList);
        let selectedOption = await this.page.getByRole('option', { name: country, exact: true });
        return selectedOption;
    }

   
    async clickListItem(province){
        await this.page.waitForSelector('[role="row"]', { state: 'visible'});
        await this.page.locator('[role="row"]').filter({ has: this.page.locator('[data-field="province"]', { hasText: province})})
        .locator('button', { hasText: 'View Stats'}).click();
        // await this.page.pause();
        
        // await this.page.locator('[role="row"]').filter({ has: this.page.locator('[data-field="province"]', {hasText: province})}).locator('button', { hasText: 'View Stats'}).click();
        // await this.selectors.listItem.click();
    }

}

module.exports = DashboardPage;