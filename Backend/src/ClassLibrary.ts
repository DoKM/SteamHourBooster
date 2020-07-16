class ClassLibrary{
    constructor(){
        
        this.commonFunctions = new CommonFunctions(this)
        
        
        this.config = new configuration(this)
        this.createStorageStructure()

        this.crypto = new Crypt(this)
        this.mysql = new MySQL(this)
    }

    public mysql:MySQL
    public commonFunctions:CommonFunctions
    public crypto:Crypt
    public botManager:BotManager

    public config:configuration

    public setBotManager(botManager:BotManager){
        this.botManager = botManager
        this.mysql.setBotManager(botManager)
    }
    
    /**
     * Setups Folder Structure
     */
    private createStorageStructure(){
        this.commonFunctions.checkIfFolderExistsCreate('./storage')
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto')
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto/AES')
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto/RSA')
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto/RSA/public')
        this.commonFunctions.checkIfFolderExistsCreate('./storage/crypto/RSA/private')
        this.commonFunctions.checkIfFolderExistsCreate('./storage/sentry')
        this.commonFunctions.checkIfFolderExistsCreate('./storage/TOTP')
    }
}