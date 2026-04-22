const { test, expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const { CompareSharp } = require('@mui/icons-material');


class StatisticsPage extends BasePage{
    constructor(context){
        
        super(context);
        this.context=context;
        this.selectors = {
            datepickerButton: this.context.pages()[0].getByRole('button', { name: /Choose date/ }),
            yearDropdown: this.context.pages()[0].locator('.MuiIconButton-sizeSmall').nth(1),
            monthBack: this.context.pages()[0].locator('.MuiIconButton-sizeSmall').nth(2),
            monthForward: this.context.pages()[0].locator('.MuiIconButton-sizeSmall').nth(3),
            currentMonth: this.context.pages()[0].locator('[role="presentation"]'),
            tooltipLabel: this.context.pages()[0].locator('.recharts-tooltip-label'),
            tooltipKey: this.context.pages()[0].locator('.recharts-tooltip-item-name'),
            tooltipValue: this.context.pages()[0].locator('.recharts-tooltip-item-value'),
            chartWrapper: this.context.pages()[0].locator('.recharts-wrapper'),
            activeCases: this.context.pages()[0].locator('.recharts-bar-rectangle path[name="Active Cases"]').first(),
            confirmedCases: this.context.pages()[0].locator('.recharts-bar-rectangle path[name="Confirmed Cases"]').first(),
            deaths: this.context.pages()[0].locator('.recharts-bar-rectangle path[name="Deaths"]').first(),
            recovered: this.context.pages()[0].locator('.recharts-bar-rectangle path[name="Recovered"]').first(),
        }

    }

    async reformatDate(dateStr) {
      const [year, month, day] = dateStr.split("-");
      return `${month}/${day}/${year}`;
    }


    async datePicker(date){
        const months = [
          "January", "February", "March", "April",
          "May", "June", "July", "August",
          "September", "October", "November", "December"
        ];

        const [ month, day, year ] = date.split('/');
        const dayInt = parseInt(day, 10);
        const selectedMonth = months[parseInt(month) - 1];
        // console.log(year);
        await this.selectors.datepickerButton.waitFor({ state: 'visible'});
        await this.selectors.datepickerButton.click();
        // await this.page.waitForTimeout(3000);
        // await this.page.locator(`button[aria-label="${date}"]`).click();
        await this.selectors.yearDropdown.click();
        await this.page.waitForTimeout(3000);
        await this.page.locator('button', { hasText: year}).click();
        await this.navigateToMonth(selectedMonth);
        await this.page.locator('button', { hasText: dayInt}).first().click();
        // await this.page.locator('button', { has: `[aria-label="${day}"]`}).click();




    }

    async navigateToMonth(targetMonth) {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      
        // Get the currently displayed month (adjust selector to match your calendar)
        const currentMonthText = await this.page.locator('[aria-live="polite"]').first().innerText();
        const [currentMonth, currentYear] = currentMonthText.split(' ');
      
        const currentIndex = months.indexOf(currentMonth);
        const targetIndex  = months.indexOf(targetMonth);
      
        if (currentIndex === -1) throw new Error(`Current month "${currentMonth}" not recognized`);
        if (targetIndex  === -1) throw new Error(`Target month "${targetMonth}" not recognized`);
      
        if (currentIndex === targetIndex) return; // Already on the correct month
      
        const diff = targetIndex - currentIndex;
      
        if (diff > 0) {
          // Click Next diff times
          for (let i = 0; i < diff; i++) {
            await this.page.waitForTimeout(500);
            await this.selectors.monthForward.click();
          }
        } else {
          // Click Previous abs(diff) times
          for (let i = 0; i < Math.abs(diff); i++) {
            await this.page.waitForTimeout(500);
            await this.selectors.monthBack.click();
          }
        }
      }

      async verifyChartValues(){

        // this.page = await this.getPage(); //
        const seen = new Set();
        const uniqueIndices = [];
        const result = [];  // array — push on each iteration
        await this.selectors.chartWrapper.waitFor({ state: 'visible' });
        await this.page.waitForSelector('.recharts-layer.recharts-bar');

        const barGroup = this.page.locator('.recharts-layer.recharts-bar').first();
        const bars = barGroup.locator('path');
        const count = await bars.count();
        // const mainBars = count / 2;
        console.log('Total bar paths found:', count);

        for (let i = 0; i < count; i++) {
          
            const name = await bars.nth(i).getAttribute('name');
            const height = await bars.nth(i).getAttribute('height');
            console.log(`Bar ${i}: name="${name}", height="${height}"`);
            // if (!await bars.nth(i).isVisible()) {
            //   console.warn(`Bar ${i}: path not visible, skipping`);
            //   continue;
            // }
          
            await bars.nth(i).hover();
            // await bars.nth(i).hover({timeout: 2000});
            // await this.page.waitForTimeout(500);

            await this.page.waitForSelector('.recharts-tooltip-wrapper', { state: 'visible'});

            const mainLabel = (await this.selectors.tooltipLabel.textContent()).trim();
    
            const previous = parseInt((await this.selectors.tooltipValue.first().textContent()).trim(), 10);

        
            const today = parseInt((await this.selectors.tooltipValue.last().textContent()).trim(), 10);

            result.push({
              [mainLabel] : {
                previous: previous,
                today: today
              }
            })

        }
        console.log('statistics are: ', result);
        return result;

        
      }


    async print(){
        console.log('a function in statistics page has been called');
    }
}

module.exports=StatisticsPage;