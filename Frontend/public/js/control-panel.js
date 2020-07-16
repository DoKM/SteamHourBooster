
var gameList = []

$('#multiSelect').multiselect({
    enableFiltering: true,
    enableCaseInsensitiveFiltering: true,
    maxHeight: 450,
    maxWidth: 450,
    buttonWidth: '400px',
    dropRight: true,
    keepOrder: true,
    onChange: function () {
        // updateList()

        gameList = $('#multiSelect option:selected').map(function (a, item) {

            let game = {
                AppID: item.value,
                GameName: item.innerText
            }
            return game
        }).get()
        updateGameList(gameList)
    }
});

function updateGameList(games) {
try {
    updateList(games)
}catch{}

}

function updateList(games) {
    try {
        let deleteTable = document.getElementById('TableGameList')
        deleteTable.parentNode.removeChild(deleteTable)
    } catch {
    }
    let table = document.createElement('table')
    table.id = 'TableGameList'
    table.classList.add("table")
    table.classList.add("w-100")
    let tr = document.createElement('tr')
    let appID = createStuff('th', 'AppID')
    appID.classList.add('AppID')

    appID.classList.add('w-0')
    tr.appendChild(appID)
    tr.appendChild(createStuff('th', 'App Name'))
    table.appendChild(tr)
    console.log(games)
    games.forEach(game => {
        let tr = document.createElement('tr')
        let id = createStuff('td', game.AppID)
        id.classList.add('AppID')
        tr.appendChild(id)
        tr.appendChild(createStuff('td', game.GameName))
        table.appendChild(tr)

    });
    document.getElementById('Gamelist').appendChild(table)
}

function createStuff(tag, string) {
    let element = document.createElement(tag)
    let textnode = document.createTextNode(string);
    element.appendChild(textnode)
    return element
}

function sendFetchTo(url, body, method) {
    return fetch(url, {
        method: method,
        credentials: "same-origin",
        body: JSON.stringify(body),
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.head.querySelector("[name~=csrf-token][content]").content
        }
    })
}

function toggleAcc(){
    let statusIndicator = document.getElementById('BoostStatus')
    let status = document.getElementById('Status')
    let boost = statusIndicator.value === 'true'?true:false
    let body = {
        Boost: boost
    }
    console.log(body)
    sendFetchTo(toggleURL, body, 'post').then(function (response) {
        return response.text().then(function (text) {
            console.log((text === "1"?'true':'false'))

            statusIndicator.value = (text === "1"?'true':'false')
            status.classList.add((text === "1"?'badge-success':'badge-warning'))
            status.classList.remove((text === "1"?'badge-warning':'badge-success'))
            status.innerText = (text === "1"?'Active':'Inactive')


        })
    })
}

function SendAccountList(){
    sendFetchTo(gamesURL, {games: gameList}, 'Post').then(function(response){
        window.location.reload(true);
    })
}




function initSend(){
    document.getElementById('submitGames').addEventListener('click', SendAccountList)
}

function deleteAccount(){
    console.log(deleteUrl)
    sendFetchTo(deleteUrl, 'body', 'delete').then(function (response) {
        return response.text().then(function (text) {
            if(text === 'marked'){
                window.location.reload(true);
            } else if(text === 'deleted') {
                window.location.replace(home);

            } else if(text === 'wait'){
                console.log('wait')
                $('#wait').modal('toggle')
            }


        })
    })
}

function steamGuardShow(){
    console.log('steamguard')
    $('#SteamGuardCode').modal('toggle')
}

function sendSteamGuardCode(){
    let code = document.getElementById('steamGuardCodeInput').value
    if(code.length !== 5){

        document.getElementById('steamGuardCallback').innerText = 'The code was too '+(code.length<5?'short':'long')+'. Please reenter te code.'
        return
    }
    sendFetchTo(guardURL, {code: code}, 'post')

    $('#SteamGuardCode').modal('toggle')
}

function toggleTOTPModal(){
    $('#SteamTOTP').modal('toggle')
}

function toggleAccInit() {
    console.log('load')
    document.getElementById('boostToggle').addEventListener('click', toggleAcc);

}

function sendTOTP(){
    let code = document.getElementById('steamTOTPKey').value
    code = code.replace(/ /g,'')

    if(code.length > 15 && (code[code.length-1] === '=')){
        let body = {}
        body.code = code
        sendFetchTo(steamShared_SecretUrl, body, 'POST').then(function (response) {
            return response.text().then(function (text) {
                if(text === 'success'){
                    window.location.reload(true);
                }
            })})
    } else {
        document.getElementById('Shared_SecretLength').className = (code.length > 15)?'':'text-warning'
        document.getElementById('Shared_SecretSign').className = (code[code.length-1] === '=')?'':'text-warning'


    }
}

window.addEventListener('load', init);

function init() {
    try {
        toggleAccInit()
    } catch {
    }
    try {
        initManual()
    } catch {
    }
    try {
        initSend()
    } catch {
    }
    document.getElementById('sendSteamTOTPButton').addEventListener('click', sendTOTP)
    document.getElementById('SteamTOTPButton').addEventListener('click', toggleTOTPModal)
    document.getElementById('DeleteAccount').addEventListener('click', deleteAccount)
    document.getElementById('steamGuardButton').addEventListener('click', steamGuardShow)
    document.getElementById('sendGuardCodeButton').addEventListener('click', sendSteamGuardCode)
}

