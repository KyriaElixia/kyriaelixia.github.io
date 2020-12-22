players = [];
stats = [];
hand = 1;
settingsStatus = true;
update = true;
tableRadius = 300;

player = function() {

    this.money = parseInt(document.getElementById("start-money").value);
    this.bet = 0;
    this.name;

    this.fold = false;
    this.out = false;

    this.wins = 0;
    
    this.stats = [];

    this.id = players.length;
}

stat = function(winner,winHand) {

    this.winner = winner;
    this.round = hand; 
    this.money = pot;
    this.winningHand = winHand;
}

addPlayer = function() {
    
    if (document.getElementById("start-money").value != "") {

        table = document.createElement("table"); document.getElementById("player-list").appendChild(table);
        row = document.createElement("tr"); table.appendChild(row);

        //NAME
        data = document.createElement("td"); row.appendChild(data); 
        input = document.createElement("input"); data.appendChild(input)
        
        input.id = "name_setup_" + players.length;
        input.placeholder = "Name";
        
        data.appendChild(input);

        players.push(new player());

        document.getElementById("settings-toggle").style.display = ""
    }
    else {

        alert("Can't create player unless a starting money amount is given");
    }
}

settings = function() {

    canStart = true;
    for (p = 0; p < players.length; p++) {

        if (document.getElementById("name_setup_"+p).value == "") {

            canStart = false;
        }
    }
    if (canStart) {
        if (settingsStatus == false) {

            document.getElementById("settings").style.display = "";
            document.getElementById("game").style.display = "none";
            document.getElementById("settings-toggle").innerHTML = "close settings";
            document.getElementById("play-table").style.display = "none"
            
            settingsStatus = true;
        }
        else {

            document.getElementById("settings").style.display = "none";
            document.getElementById("game").style.display = "";
            document.getElementById("settings-toggle").innerHTML = "open settings";
            document.getElementById("play-table").style.display = ""

            settingsStatus = false;
        }
        gameUpdate();
    }
    else {

        alert("Can't "+document.getElementById("settings-toggle").innerHTML+" unless all players are named");
    }
}

gameUpdate = function() {
       
    document.getElementById("layout").remove();
    layout = document.createElement("div");
    layout.id = "layout";
    document.getElementById("game-table").appendChild(layout);
    
    xCenter = window.innerWidth/2;
    yCenter = window.innerHeight/2;
    angle = 2*Math.PI/players.length;
    radius = tableRadius+100;

    for (p = 0; p < players.length; p++) {

        players[p].name = document.getElementById("name_setup_"+p).value;

        var badge = document.createElement("table");
        badge.border = "1";
        badge.id = "badge_"+p;
        badge.style.position = "absolute"
        badge.style.left = (xCenter-Math.cos((p)*angle)*radius);
        badge.style.top = (yCenter-Math.sin((p)*angle)*radius);
        layout.appendChild(badge);
               
        var firstRow = document.createElement("tr");
        badge.appendChild(firstRow);

        var name = document.createElement("td");
        name.id = "name_"+p;       
        name.innerHTML = document.getElementById("name_setup_"+p).value;
        name.colSpan = "3";
        name.className = "player";
        firstRow.appendChild(name);

        var buttonHolder = document.createElement("td");
        buttonHolder.id = "button_"+p;
        buttonHolder.rowSpan = "3";
        firstRow.appendChild(buttonHolder);

        //buttons

        var buttonFold = button(p,"fold","Fold");
        buttonHolder.appendChild(buttonFold);

        var buttonLeave = button(p,"leave","Leave");
        buttonLeave.style.display = "none";
        buttonHolder.appendChild(buttonLeave);

        var buttonWin = button(p,"win","Win");
        buttonWin.style.display = "none";
        buttonHolder.appendChild(buttonWin);

        var secondRow = document.createElement("tr");
        badge.appendChild(secondRow);

        var moneyData = document.createElement("td");
        moneyData.innerHTML = players[p].money;
        secondRow.appendChild(moneyData);

        var moneyCoin = document.createElement("td");
        secondRow.appendChild(moneyCoin);

        var statusData = document.createElement("td");
        secondRow.appendChild(statusData);

        var moneyCoinImg = document.createElement("img");
        moneyCoinImg.src = "sprites/coin.png";
        moneyCoinImg.width = "25";
        moneyCoinImg.height = "25";        
        moneyCoin.appendChild(moneyCoinImg);

        var thirdRow = document.createElement("tr");
        badge.appendChild(thirdRow);

        var betData = document.createElement("td");
        betData.innerHTML = players[p].bet;
        thirdRow.appendChild(betData);
        
        var betCoin = document.createElement("td");
        thirdRow.appendChild(betCoin);
        
        var betCoinImg = document.createElement("img");
        betCoinImg.src = "sprites/coin.png";
        betCoinImg.width = "25";
        betCoinImg.height = "25";        
        betCoin.appendChild(betCoinImg);
        
        var betDesc = document.createElement("td");
        betDesc.innerHTML = "bet";
        thirdRow.appendChild(betDesc);
                
    }
    for (p = 0; p < players.length; p++) {
        
        document.getElementById("badge_"+p).style.left = parseInt(document.getElementById("badge_"+p).style.left) - document.getElementById("badge_"+p).offsetWidth/2;
        document.getElementById("badge_"+p).style.top = parseInt(document.getElementById("badge_"+p).style.top) - document.getElementById("badge_"+p).offsetHeight/2;
        
    }
    setup();
}

button = function(id,action,description) {

    newButton = document.createElement("button");
    newButton.id = action+"-button_"+id;
    newButton.setAttribute("onclick",action+"('"+id+"');");
    newButton.innerHTML = description;

    return newButton;
}

fold = function(id) {

    console.log("folded",parseInt(id));
}

leave = function(id) {

    console.log("left",parseInt(id));
}

win = function(id) {

    console.log("won",parseInt(id));
}

setup = function() {

    circleTable = document.getElementById("circle");
    potHolder = document.getElementById("pot-holder");

    circleTable.style.left = window.innerWidth/2-tableRadius;
    circleTable.style.top = window.innerHeight/2-tableRadius;
    circleTable.style.width = (2*tableRadius);
    circleTable.style.height = (2*tableRadius);

    potHolder.style.left = window.innerWidth/2-potHolder.offsetWidth/2;
    potHolder.style.top = window.innerHeight/2-potHolder.offsetHeight/2;
}

// window.onload = function() {

//     //setup();
// }