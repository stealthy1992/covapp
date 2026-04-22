const BasePage = require('../pages/BasePage');


class LoginPage extends BasePage{

    constructor(context){

        super(context);

        this.selectors = {

            email: '#email',
            password: '#password',
            loginButton: 'button[type="submit"]',
            // errorMessage: 'Firebase: Error (auth/invalid-email).'

        }
        
    }

    async open(){

        await this.navigate('https://covapp-gamma.vercel.app/signin');

    }

    async login(email, password){
        await this.fill(this.selectors.email, email);
        await this.fill(this.selectors.password, password);
        await this.click(this.selectors.loginButton);
    }

    async isErrorVisible(errorMessage){
        return this.isVisible(errorMessage);
    }

    async getErrorMessage(){
        return this.getText(this.selectors.errorMessage);
    }

}

module.exports = LoginPage;