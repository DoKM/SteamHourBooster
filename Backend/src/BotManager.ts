class BotManager {

    private readonly steamUser = require('steam-user')
    private readonly steamTOTP = require('steam-totp')

    constructor(classLibrary:ClassLibrary) {
        this.classLibrary = classLibrary

        this.loop()
    }

    private classLibrary:ClassLibrary


    private botInstances: BotInstance[] = []

    

    private loop() {
        this.gatherAccounts()
        setTimeout(() => {

            this.loop()
        }, 1000 * this.classLibrary.config.getTimeouts().getAccountsDelay);
    }

    /**
     * request all the steam accounts
     */
    private gatherAccounts() {
        let here = this
        if (!this.classLibrary.mysql.getStatus()) {
            return
        }
        this.classLibrary.mysql.getAccounts().then(function (accounts: SteamAccount[]) {


            accounts.forEach(account => {
                here.manageAccountData(account)
            });

        }).catch((error: any) => setImmediate(() => {
            console.log(error);
        }));
    }

    /**
     * manages the account, if it should exist or not
     * and does magic
     * @param account 
     */
    private manageAccountData(account: SteamAccount) {
        let here = false
        let index = 0;
        for (index = 0; index < this.botInstances.length && here === false; index++) {
            if (this.botInstances[index].alreadyHere(account.id)) {
                here = true
            }
        }
        index--
        if (!here) {
            if (account.Boost && account.StatusCode !== 5 && account.StatusCode !== 6) {
                account = this.Decrypt(account)
                this.botInstances.push(new BotInstance(this.steamUser, this.steamTOTP, account, this.classLibrary))
            } else if (account.StatusCode === 5) {
                this.classLibrary.mysql.markDelete(account.id);
            }

        } else {
            if (!account.Boost || account.StatusCode === 5) {
                
                if (account.StatusCode === 5) {
                    this.classLibrary.mysql.markDelete(account.id);
                }
                this.removeAccount(index)
            }
        }
    }



    public requestRemove(id: number) {
        let index = 0;
        let here = false;
        for (index = 0; index < this.botInstances.length && here === false; index++) {
            if (this.botInstances[index].alreadyHere(id)) {
                this.removeAccount(index)
                here = true
                return
            }
        }
    }

    private removeAccount(index:number){
        if(this.classLibrary.config.getDebug()){
            console.log("name of Account getting removed: "+ this.botInstances[index].getUserName())
        }
            try{
            this.botInstances[index].logOff()
            }catch{}
            this.botInstances.splice(index, 1)
            
        
    }
    /**
     * Decrypts and unsalts the password
     * @param account 
     * @return account
     */
    private Decrypt(account: SteamAccount): SteamAccount {
        let salt = this.classLibrary.config.getSalt()
        let salted = this.classLibrary.crypto.aesDecryptString(account.PWord)
        account.PWord = salted.slice(salt.salt1 + salt.salt2 + account.AccountName.length, salted.length - salt.salt3)
        return account
    }
}