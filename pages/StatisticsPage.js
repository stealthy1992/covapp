const { test, expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class StatisticsPage extends BasePage{
    constructor(page){
        
        super(page);
        this.page=page;
        this.selectors = {
            
        }

    }

    async print(){
        console.log('a function in statistics page has been called');
    }
}

module.exports=StatisticsPage;