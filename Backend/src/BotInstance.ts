class BotInstance {

    constructor(SteamUser: any, steamTotp: any, user: SteamAccount, classLibrary: ClassLibrary) {

        this.SteamUser = SteamUser
        this.userInfo = user
        this.classLibrary = classLibrary
        this.steamTOTP = steamTotp
        this.steamClient = new SteamUser({
            dataDirectory: "./storage/sentry",
            autoRelogin: false
        });
        this.startup()
    }

    private readonly SteamUser: any
    private steamClient: any
    private steamTOTP: any

    private classLibrary: ClassLibrary

    private userInfo: SteamAccount

    
    private loginInfo: {
        firstLogin: boolean
        firtLogout: boolean
        loggedOn: boolean
    } = {
        firstLogin: true,
        firtLogout: true,
        loggedOn: false
    }
    private timeout:number
    public getUserName(): string {
        return this.userInfo.AccountName
    }

    private key: string

    /**
     * Loads the proper login details
     * @returns LoginDetails
     */
    private loginKey(): any {
        let sentrylocation = './storage/sentry/sentry.' + this.userInfo.AccountName + ".bin"
        if (this.classLibrary.commonFunctions.fs.existsSync(sentrylocation)) {

            return {
                accountName: this.userInfo.AccountName,
                password: this.userInfo.PWord,
                rememberPassword: true,
                sha_sentryfile: this.getSHA1(this.classLibrary.commonFunctions.fs.readFileSync(sentrylocation))
            }
        } else if (this.key) {
            return {
                accountName: this.userInfo.AccountName,
                loginKey: this.key,
                rememberPassword: true
            }
        } else {
            return {
                accountName: this.userInfo.AccountName,
                password: this.userInfo.PWord,
                rememberPassword: true
            }
        }
    }

    private getSHA1(bytes: any) {
        let shasum = this.classLibrary.crypto.Crypto.createHash('sha1');
        shasum.end(bytes);
        return shasum.read();
    }

    private startup(){
        let here = this

        this.steamClient.on('loggedOn', () => {
            console.log('login success: ' + here.userInfo.AccountName)

            here.loginInfo.loggedOn = true
            here.classLibrary.mysql.logInSuccess(here.userInfo.id)
            here.enterSteamID(here.steamClient.steamID.getSteam3RenderedID())
            //set Personastate to Online
            here.steamClient.setPersona(this.SteamUser.EPersonaState.Online)
            //parse games
            here.setPlayingGames()
        });

        this.steamClient.on('disconnected', () => {
            console.log(here.userInfo.AccountName + " : disconnected");
            
            here.loginInfo.loggedOn = false
            
            here.reconnect()
        });

        //used to take care of login erros and more
        this.steamClient.on('error', (err: any) => {
            console.log(here.userInfo.AccountName + " : Steam-Error: " + err + ' : '+ err.eresult);
            //somebody is already playing on this account
            //logout log back in after a bit
            switch (err.eresult) {
                case 3:
                    here.logOut(1)
                    break;
                case 5:
                    here.classLibrary.mysql.invalidPassword(here.userInfo.id)
                    here.classLibrary.botManager.requestRemove(here.userInfo.id)
                    break;
                case 6:
                    here.logOut(1)
                    break;
                case 65:
                    here.classLibrary.mysql.requestSteamGuardCode(here.userInfo.id)
                    break;
                case 84:
                    here.logOut(3)
                    break;
    

                default:
                    here.logOut(1)
                    break;
            }

            // if (err.eresult === 6) {

            //     here.logOut(1)
            // } else if (err.eresult === 5) {
            //     //invalid password
            //     here.classLibrary.mysql.invalidPassword(here.userInfo.id)
            //     here.classLibrary.botManager.requestRemove(here.userInfo.id)
            // } else if (err.eresult === 65) {
            //     //invalid authCode
            //     here.classLibrary.mysql.requestSteamGuardCode(here.userInfo.id)

            // } else if (err.eresult === 84) {

            //     here.logOut(3)
            // }
        });

        //sets the steam LoginKey, not really used but handy
        this.steamClient.on('loginKey', (key: any) => {
            if (key !== here.key) {
                here.key = key
            }
        });

        //code that runs when steamguard event fires
        this.steamClient.on('steamGuard', function (domain: string, callback: any) {
            let totpFileLocation = './storage/TOTP/TOTP.' + here.userInfo.AccountName + ".bin"
            if (here.classLibrary.commonFunctions.fs.existsSync(totpFileLocation)) {
                try {
                    callback(here.steamTOTP.generateAuthCode(here.classLibrary.crypto.aesDecryptString(here.classLibrary.commonFunctions.fs.readFileSync(totpFileLocation, 'utf8'))));
                    return
                } catch {
                    //take care of the error somehow
                    //maybe delete the totp file
                    here.classLibrary.commonFunctions.fs.unlink(totpFileLocation, function (err: any) {
                        if (err) throw err;
                        // if no error, file has been deleted successfully
                        console.log('File deleted!' + totpFileLocation);
                    });
                }
            }
            here.classLibrary.mysql.retrieveSteamCode(here.userInfo.id).then(function (code: string) {

                callback(code);
            }).catch((error: any) => setImmediate(() => {
                if (here.classLibrary.config.getDebug()) {
                    console.log(error);
                }
                if (error === 'timeout') {
                    here.classLibrary.botManager.requestRemove(here.userInfo.id)
                } else {

                    console.log('retrying :' + here.userInfo.AccountName)
                    here.login()
                }
            }));


        });

        this.steamClient.on('updateMachineAuth', function (sentry: any, callback: any) {
            if (this.classLibrary.config.getDebug()) {
                console.log('writing to file sentry');
            }
            let sentrylocation = './storage/sentry/sentry.' + this.userInfo.AccountName + ".bin"
            here.classLibrary.commonFunctions.fs.writeFileSync(sentrylocation, sentry.bytes);
            callback({
                sha_file: here.getSHA1(sentry.bytes)
            });
        });

        this.login()

    }

    /**
     * Logs in and more
     */
    private login() {
        let here = this
            
            
        if (this.steamClient.steamID !== null || this.loginInfo.loggedOn === true) {
            if(here.classLibrary.config.getDebug()){
                console.log('trying to login while connected')
            }
            return
        }

        if (this.loginInfo.firstLogin === false) {
            if(here.classLibrary.config.getDebug()){
                console.log('ignore one')
            }
            return
        } else {
            this.loginInfo.firstLogin = false
            this.loginInfo.firtLogout = true
        }
        console.log("Logging in " + this.userInfo.AccountName)


        this.steamClient.logOn(this.loginKey())

        //code that gets ran when loggedON event fires
        

    }



    /**
     *sets the games being played to the ones in the DB
     */
    private async setPlayingGames() {
        
        
        if(this.loginInfo.loggedOn === false){
            return
        }

        
        
        let here = this
        
        
        this.classLibrary.mysql.pullGamesByAccount(this.userInfo.id).then(function (games: Game[]) {
            
            let timeout = here.classLibrary.config.getTimeouts().gamesUpdateDelay
            if(here.classLibrary.config.getDebug()){
                console.log('playing state blocked? : '+here.steamClient.playingState.blocked);
            }
            if(!here.steamClient.playingState.blocked){
                here.steamClient.gamesPlayed(games);
            } else {
                timeout = here.classLibrary.config.getTimeouts().gamesUpdateErrorDelay
            }
            
            

            setTimeout(() => {
                here.setPlayingGames()
            }, 1000 * timeout);
        }).catch((error: any) => setImmediate(() => {
            console.log(error);
            setTimeout(() => {
                here.setPlayingGames()
            }, 1000 * here.classLibrary.config.getTimeouts().gamesUpdateErrorDelay);
        }));
    }

    /**
     *updates the steam id if its wrong
     * @param {string} ID
     */
    private enterSteamID(ID: string) {
        if (this.userInfo.SteamID === null || this.userInfo.SteamID.length < 5) {
            this.userInfo.SteamID = ID;
            this.classLibrary.mysql.updateSteamID(this.userInfo)
        }
    }

    /**
     * function to tell the bot manager if this account exists
     * @returns {boolean}
     */
    public alreadyHere(id: number): boolean {
        if (id === this.userInfo.id) {
            return true
        }
        return false
    }

    /**
     *logs the current account out
     */
    public logOff() {

        this.logOut(0)


    }
    /**
     *logs the current account out
     */
    private logOut(timeoutNumber:number) {

        this.setRelogTimeout(timeoutNumber)
        
        if (this.steamClient.steamID !== null && this.loginInfo.loggedOn === true) {
            if(this.classLibrary.config.getDebug()){
                console.log('logging out :')
            }

            if(this.loginInfo.firtLogout === true){
                this.loginInfo.firstLogin = true
                this.loginInfo.firtLogout = false
                this.steamClient.logOff()
            } 
        }
        if(this.classLibrary.config.getDebug()){
            console.log('trying to log out while not connected')
        }
        
    }

    private setRelogTimeout(timeoutNumber:number){
        
        switch (timeoutNumber) {
            case 1:
                this.timeout = 5*60
                break;
            case 2:
                this.timeout = 10*60
                break;
            case 3:
                this.timeout = 32*60
                break;
            default:
                this.timeout = 0.5*60
                break;
        }
        
        
        
    }

    private reconnect(){
        let here = this
            


            setTimeout(() => {
                if(here.classLibrary.config.getDebug()){
                    console.log('logging back in')
                }
                
                here.login()
            }, 1000 * here.timeout);

    }

    /**
     *relogs the current account
     *unused
     */
    private relog() {
        this.steamClient.relog()
    }




}

interface LoginDetails {
    accountName ? : string
    password ? : string
    loginKey ? : string
    rememberPassword ? : boolean
    shaSentryfile ? : any
}