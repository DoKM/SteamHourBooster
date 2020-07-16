var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BotInstance {
    constructor(SteamUser, steamTotp, user, classLibrary) {
        this.loginInfo = {
            firstLogin: true,
            firtLogout: true,
            loggedOn: false
        };
        this.SteamUser = SteamUser;
        this.userInfo = user;
        this.classLibrary = classLibrary;
        this.steamTOTP = steamTotp;
        this.steamClient = new SteamUser({
            dataDirectory: "./storage/sentry",
            autoRelogin: false
        });
        this.startup();
    }
    getUserName() {
        return this.userInfo.AccountName;
    }
    loginKey() {
        let sentrylocation = './storage/sentry/sentry.' + this.userInfo.AccountName + ".bin";
        if (this.classLibrary.commonFunctions.fs.existsSync(sentrylocation)) {
            return {
                accountName: this.userInfo.AccountName,
                password: this.userInfo.PWord,
                rememberPassword: true,
                sha_sentryfile: this.getSHA1(this.classLibrary.commonFunctions.fs.readFileSync(sentrylocation))
            };
        }
        else if (this.key) {
            return {
                accountName: this.userInfo.AccountName,
                loginKey: this.key,
                rememberPassword: true
            };
        }
        else {
            return {
                accountName: this.userInfo.AccountName,
                password: this.userInfo.PWord,
                rememberPassword: true
            };
        }
    }
    getSHA1(bytes) {
        let shasum = this.classLibrary.crypto.Crypto.createHash('sha1');
        shasum.end(bytes);
        return shasum.read();
    }
    startup() {
        let here = this;
        this.steamClient.on('loggedOn', () => {
            console.log('login success: ' + here.userInfo.AccountName);
            here.loginInfo.loggedOn = true;
            here.classLibrary.mysql.logInSuccess(here.userInfo.id);
            here.enterSteamID(here.steamClient.steamID.getSteam3RenderedID());
            here.steamClient.setPersona(this.SteamUser.EPersonaState.Online);
            here.setPlayingGames();
        });
        this.steamClient.on('disconnected', () => {
            console.log(here.userInfo.AccountName + " : disconnected");
            here.loginInfo.loggedOn = false;
            here.reconnect();
        });
        this.steamClient.on('error', (err) => {
            console.log(here.userInfo.AccountName + " : Steam-Error: " + err + ' : ' + err.eresult);
            switch (err.eresult) {
                case 3:
                    here.logOut(1);
                    break;
                case 5:
                    here.classLibrary.mysql.invalidPassword(here.userInfo.id);
                    here.classLibrary.botManager.requestRemove(here.userInfo.id);
                    break;
                case 6:
                    here.logOut(1);
                    break;
                case 65:
                    here.classLibrary.mysql.requestSteamGuardCode(here.userInfo.id);
                    break;
                case 84:
                    here.logOut(3);
                    break;
                default:
                    here.logOut(1);
                    break;
            }
        });
        this.steamClient.on('loginKey', (key) => {
            if (key !== here.key) {
                here.key = key;
            }
        });
        this.steamClient.on('steamGuard', function (domain, callback) {
            let totpFileLocation = './storage/TOTP/TOTP.' + here.userInfo.AccountName + ".bin";
            if (here.classLibrary.commonFunctions.fs.existsSync(totpFileLocation)) {
                try {
                    callback(here.steamTOTP.generateAuthCode(here.classLibrary.crypto.aesDecryptString(here.classLibrary.commonFunctions.fs.readFileSync(totpFileLocation, 'utf8'))));
                    return;
                }
                catch (_a) {
                    here.classLibrary.commonFunctions.fs.unlink(totpFileLocation, function (err) {
                        if (err)
                            throw err;
                        console.log('File deleted!' + totpFileLocation);
                    });
                }
            }
            here.classLibrary.mysql.retrieveSteamCode(here.userInfo.id).then(function (code) {
                callback(code);
            }).catch((error) => setImmediate(() => {
                if (here.classLibrary.config.getDebug()) {
                    console.log(error);
                }
                if (error === 'timeout') {
                    here.classLibrary.botManager.requestRemove(here.userInfo.id);
                }
                else {
                    console.log('retrying :' + here.userInfo.AccountName);
                    here.login();
                }
            }));
        });
        this.steamClient.on('updateMachineAuth', function (sentry, callback) {
            if (this.classLibrary.config.getDebug()) {
                console.log('writing to file sentry');
            }
            let sentrylocation = './storage/sentry/sentry.' + this.userInfo.AccountName + ".bin";
            here.classLibrary.commonFunctions.fs.writeFileSync(sentrylocation, sentry.bytes);
            callback({
                sha_file: here.getSHA1(sentry.bytes)
            });
        });
        this.login();
    }
    login() {
        let here = this;
        if (this.steamClient.steamID !== null || this.loginInfo.loggedOn === true) {
            if (here.classLibrary.config.getDebug()) {
                console.log('trying to login while connected');
            }
            return;
        }
        if (this.loginInfo.firstLogin === false) {
            if (here.classLibrary.config.getDebug()) {
                console.log('ignore one');
            }
            return;
        }
        else {
            this.loginInfo.firstLogin = false;
            this.loginInfo.firtLogout = true;
        }
        console.log("Logging in " + this.userInfo.AccountName);
        this.steamClient.logOn(this.loginKey());
    }
    setPlayingGames() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loginInfo.loggedOn === false) {
                return;
            }
            let here = this;
            this.classLibrary.mysql.pullGamesByAccount(this.userInfo.id).then(function (games) {
                let timeout = here.classLibrary.config.getTimeouts().gamesUpdateDelay;
                if (here.classLibrary.config.getDebug()) {
                    console.log('playing state blocked? : ' + here.steamClient.playingState.blocked);
                }
                if (!here.steamClient.playingState.blocked) {
                    here.steamClient.gamesPlayed(games);
                }
                else {
                    timeout = here.classLibrary.config.getTimeouts().gamesUpdateErrorDelay;
                }
                setTimeout(() => {
                    here.setPlayingGames();
                }, 1000 * timeout);
            }).catch((error) => setImmediate(() => {
                console.log(error);
                setTimeout(() => {
                    here.setPlayingGames();
                }, 1000 * here.classLibrary.config.getTimeouts().gamesUpdateErrorDelay);
            }));
        });
    }
    enterSteamID(ID) {
        if (this.userInfo.SteamID === null || this.userInfo.SteamID.length < 5) {
            this.userInfo.SteamID = ID;
            this.classLibrary.mysql.updateSteamID(this.userInfo);
        }
    }
    alreadyHere(id) {
        if (id === this.userInfo.id) {
            return true;
        }
        return false;
    }
    logOff() {
        this.logOut(0);
    }
    logOut(timeoutNumber) {
        this.setRelogTimeout(timeoutNumber);
        if (this.steamClient.steamID !== null && this.loginInfo.loggedOn === true) {
            if (this.classLibrary.config.getDebug()) {
                console.log('logging out :');
            }
            if (this.loginInfo.firtLogout === true) {
                this.loginInfo.firstLogin = true;
                this.loginInfo.firtLogout = false;
                this.steamClient.logOff();
            }
        }
        if (this.classLibrary.config.getDebug()) {
            console.log('trying to log out while not connected');
        }
    }
    setRelogTimeout(timeoutNumber) {
        switch (timeoutNumber) {
            case 1:
                this.timeout = 5 * 60;
                break;
            case 2:
                this.timeout = 10 * 60;
                break;
            case 3:
                this.timeout = 32 * 60;
                break;
            default:
                this.timeout = 0.5 * 60;
                break;
        }
    }
    reconnect() {
        let here = this;
        setTimeout(() => {
            if (here.classLibrary.config.getDebug()) {
                console.log('logging back in');
            }
            here.login();
        }, 1000 * here.timeout);
    }
    relog() {
        this.steamClient.relog();
    }
}
class BotManager {
    constructor(classLibrary) {
        this.steamUser = require('steam-user');
        this.steamTOTP = require('steam-totp');
        this.botInstances = [];
        this.classLibrary = classLibrary;
        this.loop();
    }
    loop() {
        this.gatherAccounts();
        setTimeout(() => {
            this.loop();
        }, 1000 * this.classLibrary.config.getTimeouts().getAccountsDelay);
    }
    gatherAccounts() {
        let here = this;
        if (!this.classLibrary.mysql.getStatus()) {
            return;
        }
        this.classLibrary.mysql.getAccounts().then(function (accounts) {
            accounts.forEach(account => {
                here.manageAccountData(account);
            });
        }).catch((error) => setImmediate(() => {
            console.log(error);
        }));
    }
    manageAccountData(account) {
        let here = false;
        let index = 0;
        for (index = 0; index < this.botInstances.length && here === false; index++) {
            if (this.botInstances[index].alreadyHere(account.id)) {
                here = true;
            }
        }
        index--;
        if (!here) {
            if (account.Boost && account.StatusCode !== 5 && account.StatusCode !== 6) {
                account = this.Decrypt(account);
                this.botInstances.push(new BotInstance(this.steamUser, this.steamTOTP, account, this.classLibrary));
            }
            else if (account.StatusCode === 5) {
                this.classLibrary.mysql.markDelete(account.id);
            }
        }
        else {
            if (!account.Boost || account.StatusCode === 5) {
                if (account.StatusCode === 5) {
                    this.classLibrary.mysql.markDelete(account.id);
                }
                this.removeAccount(index);
            }
        }
    }
    requestRemove(id) {
        let index = 0;
        let here = false;
        for (index = 0; index < this.botInstances.length && here === false; index++) {
            if (this.botInstances[index].alreadyHere(id)) {
                this.removeAccount(index);
                here = true;
                return;
            }
        }
    }
    removeAccount(index) {
        if (this.classLibrary.config.getDebug()) {
            console.log("name of Account getting removed: " + this.botInstances[index].getUserName());
        }
        try {
            this.botInstances[index].logOff();
        }
        catch (_a) { }
        this.botInstances.splice(index, 1);
    }
    Decrypt(account) {
        let salt = this.classLibrary.config.getSalt();
        let salted = this.classLibrary.crypto.aesDecryptString(account.PWord);
        account.PWord = salted.slice(salt.salt1 + salt.salt2 + account.AccountName.length, salted.length - salt.salt3);
        return account;
    }
}
class ClassLibrary {
    constructor() {
        this.commonFunctions = new CommonFunctions(this);
        this.config = new configuration(this);
        this.createStorageStructure();
        this.crypto = new Crypt(this);
        this.mysql = new MySQL(this);
    }
    setBotManager(botManager) {
        this.botManager = botManager;
        this.mysql.setBotManager(botManager);
    }
    createStorageStructure() {
        this.commonFunctions.checkIfFolderExistsCreate('./storage');
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto');
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto/AES');
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto/RSA');
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto/RSA/public');
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto/RSA/private');
        this.commonFunctions.checkIfFolderExistsCreate('./storage/sentry');
        this.commonFunctions.checkIfFolderExistsCreate('./storage/TOTP');
    }
}
class configuration {
    constructor(classLibrary) {
        this.config = {
            mysql: {
                host: 'mysql',
                user: 'SteamHourBooster',
                password: 'DoKM91ASonGithub',
                database: 'SteamHourBooster',
                insecureAuth: true
            },
            timeouts: {
                mysqlConnectDelay: 10,
                mysqlReconnect: 60,
                startDelay: 9,
                totpDelay: 60 * 3,
                sentryDeleteDelay: 60 * 10,
                getAccountsDelay: 60 * 1,
                encryptDelay: 60 * 3,
                steamGuardDelay: 5,
                steamGuardTries: 26,
                relogDelay: 60 * 10,
                gamesUpdateDelay: 30,
                gamesUpdateErrorDelay: 60 * 1.5,
                someBodyPlayingCheckDelay: 60
            },
            salt: {
                salt1: 14,
                salt2: 10,
                salt3: 32
            },
            debug: false
        };
        this.commonFunctions = classLibrary.commonFunctions;
    }
    getMysqlConfig() {
        return this.config.mysql;
    }
    getTimeouts() {
        return this.config.timeouts;
    }
    getSalt() {
        return this.config.salt;
    }
    getDebug() {
        return this.config.debug;
    }
}
class Crypt {
    constructor(classLibrary) {
        this.CryptoJS = require("crypto-js");
        this.Forge = require('node-forge');
        this.Crypto = require('crypto');
        this.commonFunctions = classLibrary.commonFunctions;
        this.keySetup();
    }
    rsaDecyptString(encrypted) {
        return this.rsaDecrypt(encrypted);
    }
    rsaDecrypt(encrypted) {
        return this.rsaPrivate.decrypt(encrypted);
    }
    aesDecryptString(encrypted) {
        return this.aesDecrypt(encrypted);
    }
    aesDecrypt(string) {
        return this.CryptoJS.AES.decrypt(string, this.key).toString(this.CryptoJS.enc.Utf8);
    }
    aesEncryptString(string) {
        return this.aesEncrypt(string);
    }
    aesEncrypt(string) {
        return this.CryptoJS.AES.encrypt(string, this.key).toString();
    }
    keySetup() {
        this.aesSetup();
        this.rsaSetup();
    }
    aesSetup() {
        let keyLocation = './storage/crypto/AES/Key.pem';
        if (!this.commonFunctions.fs.existsSync(keyLocation)) {
            this.key = this.commonFunctions.randomString(Math.floor(Math.random() * (100 - 30 + 1)) + 30);
            this.commonFunctions.writeFile(keyLocation, this.key);
            console.log('generated AES');
        }
        else {
            console.log('loaded AES');
            this.key = this.commonFunctions.fs.readFileSync(keyLocation, 'utf8');
        }
    }
    rsaSetup() {
        let here = this;
        let publicPath = './storage/crypto/RSA/public/Key.pem';
        let privatePath = './storage/crypto/RSA/private/Key.pem';
        let forgePrivateKey;
        if (this.commonFunctions.fs.existsSync(privatePath)) {
            let privateRSA = this.commonFunctions.fs.readFileSync(privatePath, 'utf8');
            forgePrivateKey = this.Forge.pki.privateKeyFromPem(privateRSA);
            console.log('loaded RSA Private Key');
            if (!this.commonFunctions.fs.existsSync(publicPath)) {
                let forgePublicKey = this.Forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);
                let PublicKeyPem = this.Forge.pki.publicKeyToPem(forgePublicKey);
                this.commonFunctions.writeFile(publicPath, PublicKeyPem);
                console.log('generated RSA public Key');
            }
            else {
                console.log('RSA public Key exists');
            }
        }
        else {
            this.Forge.pki.rsa.generateKeyPair({
                bits: 2048,
                workers: 2
            }, function (err, keypair) {
                forgePrivateKey = keypair.privateKey;
                let PrivateKeyPem = here.Forge.pki.privateKeyToPem(forgePrivateKey);
                let forgePublicKey = keypair.publicKey;
                let PublicKeyPem = here.Forge.pki.publicKeyToPem(forgePublicKey);
                here.commonFunctions.writeFile(privatePath, PrivateKeyPem);
                here.commonFunctions.writeFile(publicPath, PublicKeyPem);
            });
            console.log('generated new RSA key pair');
        }
        this.rsaPrivate = forgePrivateKey;
    }
    decryptDBRSAPWD(data) {
        let buf = Buffer.from(data, 'base64');
        return this.rsaDecrypt(buf);
    }
}
class Entry {
    constructor() {
        this.classLibrary = new ClassLibrary();
        setTimeout(() => {
            this.botManager = new BotManager(this.classLibrary);
            this.classLibrary.setBotManager(this.botManager);
        }, 1000 * this.classLibrary.config.getTimeouts().startDelay);
    }
}
function init() {
    console.log('');
    console.log('Steam HourBooster By DoKM91AS');
    console.log('Version = 1.2.8');
    console.log('');
    let bot = new Entry();
}
console.log('Waiting 10 seconds');
setTimeout(() => {
    console.log('Done Waiting');
    init();
}, 1000 * 10);
class MySQL {
    constructor(classLibrary) {
        this.mySQL = require('mysql');
        this.connected = false;
        let here = this;
        this.classLibrary = classLibrary;
        here.createConnection();
    }
    setBotManager(botManager) {
        this.botManager = botManager;
    }
    getStatus() {
        return this.connected;
    }
    startFunctions() {
        this.loopEncrypt();
        this.loopDeleteSentry();
        this.loopSteamTOTP();
    }
    loopSteamTOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            this.getSteamTOTP();
            setTimeout(() => {
                this.loopSteamTOTP();
            }, 1000 * this.classLibrary.config.getTimeouts().totpDelay);
        });
    }
    loopDeleteSentry() {
        return __awaiter(this, void 0, void 0, function* () {
            this.getSentryToDelete();
            setTimeout(() => {
                this.loopDeleteSentry();
            }, 1000 * this.classLibrary.config.getTimeouts().sentryDeleteDelay);
        });
    }
    loopEncrypt() {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestAccsToEnc();
            setTimeout(() => {
                this.loopEncrypt();
            }, 1000 * this.classLibrary.config.getTimeouts().encryptDelay);
        });
    }
    createConnection() {
        this.connection = this.mySQL.createConnection(this.classLibrary.config.getMysqlConfig());
        let here = this;
        this.connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                setTimeout(() => {
                    here.createConnection();
                }, 1000 * here.classLibrary.config.getTimeouts().mysqlReconnect);
                return;
            }
            else {
                console.log('connected as id ' + here.connection.threadId);
                here.connected = true;
                here.startFunctions();
            }
        });
    }
    requestAccsToEnc() {
        if (this.connected) {
            let here = this;
            this.connection.query('SELECT * FROM `s_accounts` WHERE `Encrypted` = "0"', function (error, results, fields) {
                results.forEach(result => {
                    let pwd = here.classLibrary.crypto.decryptDBRSAPWD(result.PWord);
                    let encryptedPassword = here.classLibrary.crypto.aesEncryptString(here.classLibrary.commonFunctions.randomString(here.classLibrary.config.getSalt().salt1)
                        + result.AccountName + here.classLibrary.commonFunctions.randomString(here.classLibrary.config.getSalt().salt2)
                        + pwd
                        + here.classLibrary.commonFunctions.randomString(here.classLibrary.config.getSalt().salt3));
                    here.connection.query('UPDATE s_accounts SET Encrypted = "1", PWord = ? WHERE id = ?', [encryptedPassword, result.id], function () { });
                });
            });
        }
    }
    getAccounts() {
        return this.getAllAccounts();
    }
    getAllAccounts() {
        if (this.connected) {
            let here = this;
            return new Promise(function (resolve, reject) {
                here.connection.query('SELECT * FROM `s_accounts` WHERE `Encrypted` = "1"', function (error, accounts, fields) {
                    if (error) {
                        reject(error);
                    }
                    resolve(accounts);
                });
            });
        }
        else {
            return false;
        }
    }
    pullGamesByAccount(id) {
        let here = this;
        return new Promise(function (resolve, reject) {
            here.connection.query('SELECT * FROM `games` WHERE `account` = ?', [id], function (error, gamesObject, fields) {
                if (error) {
                    reject(error);
                }
                let games = [];
                gamesObject.forEach(gameObject => {
                    games.push(gameObject.AppID);
                });
                resolve(games);
            });
        });
    }
    updateSteamID(account) {
        this.connection.query('UPDATE s_accounts SET SteamID = ? WHERE id = ?', [account.SteamID, account.id], function (err, result) {
            if (err)
                throw err;
        });
    }
    requestSteamGuardCode(id) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 1, SteamGuardCode = 0 WHERE id = ?', [id], function () { });
    }
    retrieveSteamCode(id) {
        let here = this;
        this.requestSteamGuardCode(id);
        let tries = 0;
        return new Promise(function (resolve, reject) {
            function loopGuardCode(id) {
                if (tries >= here.classLibrary.config.getTimeouts().steamGuardTries) {
                    reject('timeout');
                    here.timeout(id);
                    return;
                }
                here.connection.query('SELECT * FROM s_accounts WHERE id = ?', [id], function (error, result, fields) {
                    result = result[0];
                    if (error) {
                        here.timeout(id);
                        reject(error);
                    }
                    if (result.StatusCode === 0) {
                        reject('success');
                        return;
                    }
                    else if (result.StatusCode === 3) {
                        here.timeout(id);
                        reject('timeout');
                        return;
                    }
                    if (result.SteamGuardCode && result.StatusCode === 2) {
                        if (result.SteamGuardCode.length === 5) {
                            here.setSteamGuardStatus(0, id);
                            resolve(result.SteamGuardCode);
                            return;
                        }
                        else {
                            here.retrieveSteamCode(id);
                        }
                    }
                    if (tries < here.classLibrary.config.getTimeouts().steamGuardTries && result.StatusCode === 1) {
                        tries++;
                        setTimeout(() => {
                            loopGuardCode(id);
                        }, 1000 * here.classLibrary.config.getTimeouts().steamGuardDelay);
                    }
                    else {
                        here.timeout(id);
                        return;
                    }
                });
            }
            loopGuardCode(id);
        });
    }
    setSteamGuardStatus(statusID, AccountID) {
        this.connection.query('UPDATE s_accounts SET StatusCode = ?, SteamGuardCode = 0 WHERE id = ?', [statusID, AccountID], function () { });
    }
    timeout(AccountID) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 3, SteamGuardCode = 0, Boost = 0 WHERE id = ?', [AccountID], function () { });
        this.botManager.requestRemove(AccountID);
    }
    turnOffAccount(id) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 0, SteamGuardCode = 0, Boost = 0 WHERE id = ?', [id], function () { });
    }
    logInSuccess(id) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 0, SteamGuardCode = 0 WHERE id = ?', [id], function () { });
    }
    invalidPassword(id) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 4, Boost = 0 WHERE id = ?', [id], function () { });
    }
    markDelete(id) {
        this.connection.query('UPDATE s_accounts SET StatusCode = 6, Boost = 0 WHERE id = ?', [id], function () { });
    }
    getSentryToDelete() {
        let here = this;
        if (this.connected) {
            this.connection.query('SELECT * FROM delete_accs', function (error, results, fields) {
                if (error) {
                    console.log(error);
                    return;
                }
                results.forEach(result => {
                    let deleteFiles = [
                        './storage/sentry/sentry.' + result.AccountName + ".bin",
                        './storage/TOTP/TOTP.' + result.AccountName + ".bin"
                    ];
                    deleteFiles.forEach(fileLocation => {
                        if (here.classLibrary.commonFunctions.fs.existsSync(fileLocation)) {
                            here.classLibrary.commonFunctions.fs.unlink(fileLocation, function (err) {
                                if (err)
                                    throw err;
                                console.log('File deleted!' + fileLocation);
                            });
                        }
                    });
                    here.connection.query('DELETE from delete_accs WHERE id = ?', [result.id], function () { });
                });
            });
        }
    }
    getSteamTOTP() {
        let here = this;
        if (this.connected) {
            this.connection.query('SELECT * FROM steam_2fa_keys', function (error, results, fields) {
                if (error) {
                    console.log(error);
                    return;
                }
                results.forEach(result => {
                    let totpFileLocation = './storage/TOTP/TOTP.' + result.Account_Name + ".bin";
                    here.classLibrary.commonFunctions.writeFile(totpFileLocation, here.classLibrary.crypto.aesEncryptString(here.classLibrary.crypto.decryptDBRSAPWD(result.Shared_Secret)));
                    here.connection.query('DELETE from steam_2fa_keys WHERE id = ?', [result.id], function () { });
                });
            });
        }
    }
}
class CommonFunctions {
    constructor(classLibrary) {
        this.fs = require('fs');
        this.classLibrary = classLibrary;
    }
    writeFile(path, data) {
        this.writeFileWrap(path, data);
    }
    writeFileWrap(path, data) {
        this.fs.writeFile(path, data, function (err) {
            if (err)
                return console.log(err);
            console.log(path + " Written succesfully");
        });
    }
    randomString(length) {
        return this.randomStr(length);
    }
    randomStr(length) {
        const alphabet = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW!@#%^&';
        var ans = '';
        for (var i = length; i > 0; i--) {
            ans +=
                alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return ans;
    }
    checkIfFolderExistsCreate(path) {
        let doesntExist = false;
        if (!this.fs.existsSync(path)) {
            doesntExist = true;
            console.log('folder:' + path + " does not exist");
            console.log("making folder");
            this.fs.mkdir(path, (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log('Directory created successfully!');
            });
        }
        else {
            if (this.classLibrary.config.getDebug()) {
                console.log('folder:' + path + " exists");
            }
        }
        return doesntExist;
    }
}
//# sourceMappingURL=app.js.map