class Crypt {
    private CryptoJS = require("crypto-js");
    private Forge = require('node-forge');
    public Crypto = require('crypto');
    // private NodeRSA = require('node-rsa');
    constructor(classLibrary: ClassLibrary) {
        this.commonFunctions = classLibrary.commonFunctions

        this.keySetup()

    }

    private commonFunctions: CommonFunctions

    private key: string
    private rsaPrivate: any



    /**
     * decrypts a RSA encrypted string
     * @param encrypted 
     */
    public rsaDecyptString(encrypted: string): string {
        return this.rsaDecrypt(encrypted)
    }

    /**
     * decrypts a RSA encrypted string
     * @param encrypted 
     */
    private rsaDecrypt(encrypted: string): string {
        return this.rsaPrivate.decrypt(encrypted)
    }

    /**
     * decrypts a AES encrypted string
     * @param encrypted 
     */
    public aesDecryptString(encrypted: string): string {
        return this.aesDecrypt(encrypted);
    }

    /**
     * decrypts a AES encrypted string
     * @param encrypted 
     */
    private aesDecrypt(string: string): string {
        return this.CryptoJS.AES.decrypt(string, this.key).toString(this.CryptoJS.enc.Utf8);
    }

    /**
     * encrypts a string with AES
     * @param string 
     */
    public aesEncryptString(string: string): string {
        return this.aesEncrypt(string);
    }

    /**
     * encrypts a string with AES
     * @param string 
     */
    private aesEncrypt(string: string): string {
        return this.CryptoJS.AES.encrypt(string, this.key).toString();
    }

    /**
     *  calls the two encryption setup functions
     */
    private keySetup(){
        this.aesSetup()
        this.rsaSetup()
    }

    /**
     * Checks if the AES Key exists
     * Loads it if it does
     * Creates a AES key if it doesn't
     */
    private aesSetup() {

        let keyLocation = './storage/crypto/AES/Key.pem'

        if (!this.commonFunctions.fs.existsSync(keyLocation)) {

            this.key = this.commonFunctions.randomString(Math.floor(Math.random() * (100 - 30 + 1)) + 30)
            
            this.commonFunctions.writeFile(keyLocation, this.key)
            console.log('generated AES')

        } else {
            console.log('loaded AES')
            this.key = this.commonFunctions.fs.readFileSync(keyLocation, 'utf8')
        }


    }

    /**
     * Checks if the RSA Private key exists
     * Loads it if it does then checks if public key exists and if it doesnt creates it from the private key
     * Creates a RSA public and private pair if it doesnt exist
     */
    private rsaSetup() {
        let here = this

        let publicPath = './storage/crypto/RSA/public/Key.pem'
        let privatePath = './storage/crypto/RSA/private/Key.pem'


        let forgePrivateKey

        if (this.commonFunctions.fs.existsSync(privatePath)) {

            let privateRSA = this.commonFunctions.fs.readFileSync(privatePath, 'utf8')
            forgePrivateKey = this.Forge.pki.privateKeyFromPem(privateRSA);
            console.log('loaded RSA Private Key')
            if (!this.commonFunctions.fs.existsSync(publicPath)) {

                let forgePublicKey = this.Forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);
                let PublicKeyPem = this.Forge.pki.publicKeyToPem(forgePublicKey);
                this.commonFunctions.writeFile(publicPath, PublicKeyPem)
                console.log('generated RSA public Key')
            } else {
                console.log('RSA public Key exists')
            }

        } else {

            this.Forge.pki.rsa.generateKeyPair({
                bits: 2048,
                workers: 2
            }, function (err: any, keypair: any) {
                forgePrivateKey = keypair.privateKey
                let PrivateKeyPem = here.Forge.pki.privateKeyToPem(forgePrivateKey)
                let forgePublicKey = keypair.publicKey
                let PublicKeyPem = here.Forge.pki.publicKeyToPem(forgePublicKey)
                here.commonFunctions.writeFile(privatePath, PrivateKeyPem)
                here.commonFunctions.writeFile(publicPath, PublicKeyPem)
            });
            console.log('generated new RSA key pair')
        }
        this.rsaPrivate = forgePrivateKey
    }

    /**
     *
     *
     * @param {string} data
     * @returns {string}
     * @memberof Crypt
     */
    public decryptDBRSAPWD(data: string): string {
        let buf: any = Buffer.from(data, 'base64'); // Ta-da
        return this.rsaDecrypt(buf);
    }

}