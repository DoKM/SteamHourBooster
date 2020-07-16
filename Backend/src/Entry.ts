// import { timingSafeEqual } from "crypto";

class Entry {

    constructor() {
        this.classLibrary = new ClassLibrary()

        setTimeout(() => {
            this.botManager = new BotManager(this.classLibrary)
            this.classLibrary.setBotManager(this.botManager)
            
        }, 1000 * this.classLibrary.config.getTimeouts().startDelay);
    }

    private classLibrary:ClassLibrary
    private botManager: BotManager
}

/**
 * Init
 */
function init() {
    console.log('')
    console.log('Steam HourBooster By DoKM91AS');
    console.log('Version = 1.2.8');
    console.log('')

    
    

    let bot = new Entry()
    
}
console.log('Waiting 10 seconds')
//this wait is so that the js file is fully loaded, should probably find an alternative
setTimeout(() => {
    console.log('Done Waiting')
    init()
}, 1000 * 10);