function updateList(games){

    let table = document.createElement('table')
    table.id = 'GameList'
    let tr = document.createElement('tr')
    tr.appendChild(createStuff('th', 'AppID'))
    tr.appendChild(createStuff('th', 'App Name'))
    table.appendChild(tr)
    games.forEach(game => {
        let tr = document.createElement('tr')
        tr.appendChild(createStuff('td', game.id))
        tr.appendChild(createStuff('td', game.name))

    });
}

function createStuff(tag, string){
    let element = document.createElement('th')
    let textnode = document.createTextNode("AppID");
    element.appendChild(textnode)
    return element
}
