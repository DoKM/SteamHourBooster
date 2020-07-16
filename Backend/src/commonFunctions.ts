class CommonFunctions{

    public readonly fs = require('fs');

    constructor(classLibrary:ClassLibrary){
        this.classLibrary = classLibrary
    }

    private classLibrary:ClassLibrary

    /**
     * write file function
     * @param path:string 
     * @param data what should be written to disk
     */
    public writeFile(path:string, data:string){
        this.writeFileWrap(path, data);
    }

    /**
     * write file function
     * @param path:string 
     * @param data what should be written to disk
     */
    private writeFileWrap(path:string, data:string) {
        this.fs.writeFile(path, data, function (err: any) {
            if (err) return console.log(err);
            console.log(path + " Written succesfully");
        });
    }

    /**
     * generates (semi) random string
     * @param length 
     */
    public randomString(length:number){
        return this.randomStr(length)
    }

    /**
     * generates (semi) random string
     * @param length 
     */
    private randomStr(length:number) {
        const alphabet = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW!@#%^&' 
        var ans = ''; 
        for (var i = length; i > 0; i--) { 
            ans +=  
            alphabet[Math.floor(Math.random() * alphabet.length)]; 
        } 
        return ans; 
    } 
    
    /**
     * checks if folder exists otherwise creates it
     * @param path
     * @return boolean if the folder exists
     */
    public checkIfFolderExistsCreate(path:string):boolean{
        
        let doesntExist = false
        if(!this.fs.existsSync(path)){
            doesntExist = true
            console.log('folder:' + path + " does not exist");
            console.log("making folder");
            this.fs.mkdir(path, (err: any) => {
                if (err) {
                    return console.error(err);
                }
                console.log('Directory created successfully!');
            })
        } else {
            if(this.classLibrary.config.getDebug()){
            console.log('folder:' + path + " exists")
            }
        }
        return doesntExist
    }
    

}