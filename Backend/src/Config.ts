class configuration {
    constructor(classLibrary:ClassLibrary){

        this.commonFunctions = classLibrary.commonFunctions
    }
    
    
    private commonFunctions:CommonFunctions

    public getMysqlConfig():MysqlConfig{
        return this.config.mysql
    }

    public getTimeouts():Timeouts{
        return this.config.timeouts
    }

    public getSalt():Salt{
        return this.config.salt
    }

    public getDebug():boolean{
        return this.config.debug
    }

    private readonly config:Config = {
        //mysql Config
        mysql: {
            host: 'mysql',
            user: 'SteamHourBooster',
            password: 'DoKM91ASonGithub',
            database: 'SteamHourBooster',
            insecureAuth: true
        },
        //time it takes to reconect in seconds, * 60 to get minutes
        timeouts: {
            mysqlConnectDelay: 10,
            mysqlReconnect: 60,
            startDelay: 9,
            totpDelay: 60*3,
            sentryDeleteDelay: 60*10,
            getAccountsDelay: 60*1,
            encryptDelay: 60*3,
            steamGuardDelay:5,
            //not seconds but amount of loops until it stops
            steamGuardTries: 26,
            relogDelay: 60*10,
            gamesUpdateDelay: 30,
            gamesUpdateErrorDelay: 60*1.5,
            someBodyPlayingCheckDelay: 60
            

        },
        //length of the salt
        salt: {
            salt1: 14,
            salt2: 10,
            salt3: 32
        },
        debug: false 

    }



}

interface Config {
    mysql:MysqlConfig
    timeouts:Timeouts
    salt:Salt
    debug:boolean
}

interface MysqlConfig {
    host:string
    user:string
    password:string
    database:string
    insecureAuth:boolean
}

interface Timeouts {
    mysqlConnectDelay: number
    mysqlReconnect:number
    startDelay: number
    totpDelay: number
    sentryDeleteDelay: number
    getAccountsDelay: number
    encryptDelay: number
    steamGuardDelay:number
    steamGuardTries:number
    relogDelay:number
    gamesUpdateDelay:number
    gamesUpdateErrorDelay:number
    someBodyPlayingCheckDelay:number
}

interface Salt{
    salt1:number
    salt2:number
    salt3:number
}