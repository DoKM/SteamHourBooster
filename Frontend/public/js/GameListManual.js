function addNewGame(){
    let game = {
        AppID: document.getElementById('AppID').value,
        GameName: document.getElementById('GameName').value,
    }
    console.log(game)
    gameList.push(game)
    updateGameList(gameList)
}

function clearInput(){
    document.getElementById('AppID').value = ''
    document.getElementById('GameName').value = ''
}




function initManual(){
    document.getElementById('addNewGame').addEventListener('click', addNewGame)
    document.getElementById('clearInput').addEventListener('click', clearInput)
}
