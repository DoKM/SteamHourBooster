class MySQL {
    private mySQL: any = require('mysql');
    private connection: any

    constructor(classLibrary:ClassLibrary) {
        let here = this
        this.classLibrary = classLibrary
        
        // setTimeout(() => {
            here.createConnection()
        // }, 1000 * this.classLibrary.config.getTimeouts().mysqlConnectDelay);
        

    }

    public setBotManager(botManager:BotManager){
        this.botManager = botManager
    }

    private botManager:BotManager
    
    
    
    private connected: boolean = false
    
    
    private classLibrary:ClassLibrary

    public getStatus(): boolean {
        return this.connected
    }

    private startFunctions(){
        this.loopEncrypt()
        this.loopDeleteSentry()
        this.loopSteamTOTP()
    }

    private async loopSteamTOTP(){
        this.getSteamTOTP()
        setTimeout(() => {
            this.loopSteamTOTP()
        }, 1000 * this.classLibrary.config.getTimeouts().totpDelay);
    
    }

    /**
     * loop delete all the sentry files that shouldnt exist
     */
    private async loopDeleteSentry() {

        this.getSentryToDelete()
        setTimeout(() => {
            this.loopDeleteSentry()
        }, 1000 * this.classLibrary.config.getTimeouts().sentryDeleteDelay);
    }


/**
 * loop the encrypt acc function
 */
    private async loopEncrypt() {

        this.requestAccsToEnc()
        setTimeout(() => {
            this.loopEncrypt()
        }, 1000 * this.classLibrary.config.getTimeouts().encryptDelay);
    }

    /**
     * creates a connection to the mysql server
     * //should implement loading the cfg from a file
     */
    private createConnection() {
        this.connection = this.mySQL.createConnection(this.classLibrary.config.getMysqlConfig());

        let here = this
        this.connection.connect(function (err: any) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                setTimeout(() => {
                    here.createConnection()
                }, 1000 * here.classLibrary.config.getTimeouts().mysqlReconnect);
                return;
            } else {
                console.log('connected as id ' + here.connection.threadId);
                here.connected = true;
                here.startFunctions()
            }
        });
    }

    /**
     * decrypts; salts; encrypts the passwords from the db
    */
    private requestAccsToEnc() {

        if (this.connected) {

            let here = this
            this.connection.query('SELECT * FROM `s_accounts` WHERE `Encrypted` = "0"', function (error: any, results: SteamAccount[], fields: any) {

                results.forEach(result => {

                    let pwd = here.classLibrary.crypto.decryptDBRSAPWD(result.PWord)
                    let encryptedPassword = here.classLibrary.crypto.aesEncryptString(
                        here.classLibrary.commonFunctions.randomString(here.classLibrary.config.getSalt().salt1)
                         + result.AccountName + here.classLibrary.commonFunctions.randomString(here.classLibrary.config.getSalt().salt2)
                         + pwd
                         + here.classLibrary.commonFunctions.randomString(here.classLibrary.config.getSalt().salt3));

                    here.connection.query('UPDATE s_accounts SET Encrypted = "1", PWord = ? WHERE id = ?', [encryptedPassword, result.id],
                        function () {});
                });
            })
        }
    }

    /**
     * function to get all acounts from the DB
     * @returns promise
     */
    public getAccounts(): any {
        return this.getAllAccounts()
    }

    /**
     * function to get all acounts from the DB
     * @returns promise
     */
    private getAllAccounts(): any {
        if (this.connected) {
            let here = this
            return new Promise(function (resolve, reject) {

                here.connection.query('SELECT * FROM `s_accounts` WHERE `Encrypted` = "1"', function (error: any, accounts: SteamAccount[], fields: any) {

                    if (error) {
                        reject(error)
                    }

                    resolve(accounts);
                })

            })
        } else {
            return false
        }
    }

    /**
     * Gets all the games that a account should be playing
     * @param id Account ID
     * @returns promise
     */
    public pullGamesByAccount(id: number) {
        let here = this
        return new Promise(function (resolve, reject) {

            here.connection.query('SELECT * FROM `games` WHERE `account` = ?', [id], function (error: any, gamesObject: Game[], fields: any) {
                if (error) {
                    reject(error)
                }
                let games: number[] = []
                gamesObject.forEach(gameObject => {

                    games.push(gameObject.AppID)
                });

                resolve(games);
            })
        })
    }

    /**
     * updates the db with the steamID
     * @param account 
     */
    public updateSteamID(account: SteamAccount) {
        this.connection.query('UPDATE s_accounts SET SteamID = ? WHERE id = ?', [account.SteamID, account.id], function (err: any, result: any) {
            if (err) throw err;
        });
    }

    /**
     * sets a database value to indicate the requirement of a steamguardcode
     * @param id 
     */
    public requestSteamGuardCode(id: number) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 1, SteamGuardCode = 0 WHERE id = ?', [id],
            function () {});
    }

    /**
     * retrieves steamguard code from the db
     * @param id 
     * @param togetSteamStatus 
     * @returns promise
     */
    public retrieveSteamCode(id: number):any {
        let here = this
        this.requestSteamGuardCode(id)

        let tries = 0;
        return new Promise(function (resolve, reject) {

            function loopGuardCode(id: number) {
                
                if (tries >= here.classLibrary.config.getTimeouts().steamGuardTries) {
                    reject('timeout')
                    here.timeout(id)
                    return;
                }
                here.connection.query('SELECT * FROM s_accounts WHERE id = ?', [id], function (error: any, result: any, fields: any) {

                    result = result[0]
                    if (error) {
                        here.timeout(id)
                        reject(error)
                    }
                    if (result.StatusCode === 0) {
                        reject('success')
                        return
                    } else if (result.StatusCode === 3) {
                        here.timeout(id)
                        reject('timeout')
                        return
                    }
                    if (result.SteamGuardCode && result.StatusCode === 2) {
                        if (result.SteamGuardCode.length === 5) {

                            here.setSteamGuardStatus(0, id)
                            resolve(result.SteamGuardCode);
                            return;
                        } else {
                            here.retrieveSteamCode(id);
                        }
                    }
                    if (tries < here.classLibrary.config.getTimeouts().steamGuardTries && result.StatusCode === 1) {

                        tries++
                        setTimeout(() => {
                            loopGuardCode(id)
                        }, 1000 * here.classLibrary.config.getTimeouts().steamGuardDelay);
                    } else {
                        here.timeout(id)
                        return;
                    }
                })
            }
            loopGuardCode(id)
        })
    }

    /**
     * sets this account in the db to statuscode provided
     * @param statusID 
     * @param AccountID 
     */
    public setSteamGuardStatus(statusID: number, AccountID: number) {
        this.connection.query('UPDATE s_accounts SET StatusCode = ?, SteamGuardCode = 0 WHERE id = ?', [statusID, AccountID],
            function () {});
    }

    /**
     * Indicates that the steamguard has timeout
     * @param AccountID 
     */
    public timeout(AccountID: number) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 3, SteamGuardCode = 0, Boost = 0 WHERE id = ?', [AccountID],
            function () {});
        this.botManager.requestRemove(AccountID)
    }

    /**
     * disables the account
     * @param id 
     */
    public turnOffAccount(id: number) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 0, SteamGuardCode = 0, Boost = 0 WHERE id = ?', [id],
            function () {});
    }

    /**
     * returns a succesfull login
     * @param id 
     */
    public logInSuccess(id: number) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 0, SteamGuardCode = 0 WHERE id = ?', [id],
            function () {});
    }

    /**
     * returns a unsucessfull login
     * @param id 
     */
    public invalidPassword(id: number) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 4, Boost = 0 WHERE id = ?', [id],
            function () {});
    }

    /**
     * marks the account in the DB that it can be deleted
     * @param id 
     */
    public markDelete(id: number) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 6, Boost = 0 WHERE id = ?', [id],
            function () {});
    }

    /**
     * Gets the sentry files to delete from disk
     */
    private getSentryToDelete() {
        let here = this
        if (this.connected) {
            this.connection.query('SELECT * FROM delete_accs',
                function (error: any, results: any[], fields: any) {
                    if (error) {
                        console.log(error);
                        return
                    }

                    results.forEach(result => {
                        let deleteFiles = [
                            './storage/sentry/sentry.' + result.AccountName + ".bin",
                            './storage/TOTP/TOTP.' + result.AccountName + ".bin"
                    ]
                    deleteFiles.forEach(fileLocation => {
                        if (here.classLibrary.commonFunctions.fs.existsSync(fileLocation)) {
                            here.classLibrary.commonFunctions.fs.unlink(fileLocation, function (err: any) {
                                if (err) throw err;
                                // if no error, file has been deleted successfully
                                console.log('File deleted!' + fileLocation);
                            });
                        }
                    })
                        
                        here.connection.query('DELETE from delete_accs WHERE id = ?', [result.id],
                            function () {});
                    });
                });
        }
    }

    private getSteamTOTP(){
        let here = this
        if (this.connected) {
            this.connection.query('SELECT * FROM steam_2fa_keys',
                function (error: any, results: any[], fields: any) {
                    if (error) {
                        console.log(error);
                        return
                    }

                    results.forEach(result => {
                        let totpFileLocation = './storage/TOTP/TOTP.' + result.Account_Name + ".bin"
                        here.classLibrary.commonFunctions.writeFile(totpFileLocation, here.classLibrary.crypto.aesEncryptString(here.classLibrary.crypto.decryptDBRSAPWD(result.Shared_Secret)))
                        here.connection.query('DELETE from steam_2fa_keys WHERE id = ?', [result.id],
                            function () {});
                    });
                });
        }
    }


}

interface SteamAccount {
        id: number,
        AccountName: string,
        PWord: string,
        Boost: boolean,
        Encrypted: boolean,
        LoginKey?: string,
        SteamID?: string,
        StatusCode?: number,
        AccountOwner: number,
        created_at?: string,
        updated_at?: string
}

interface Game {
    id: number,
        AppID: number,
        account: number,
        created_at: string,
        updated_at: string
}