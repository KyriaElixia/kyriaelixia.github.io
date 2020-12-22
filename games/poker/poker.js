
removePlayer = function (delPlayer) {

    for (p = 0; p < playerCount; p++) {

        playerNames[p] = document.getElementById("name-form-"+p).value;
        playerMoney[p] = parseInt(document.getElementById("money-form-"+p).value);
    }

    playerNames.splice(delPlayer,1);
    playerMoney.splice(delPlayer,1);
    playerBet.splice(delPlayer,1);
    playerFold.splice(delPlayer,1);
    playerLeave.splice(delPlayer,1);

    playerCount--;

    updatePlayerList();
}

foldPlayer = function (foldPlayer) {

    console.log("folded "+foldPlayer)

    playerFold[foldPlayer] = true;
    playerTotalFolds[foldPlayer] += 1;
    document.getElementById("name-text-"+foldPlayer).style.color = "lightgray";
    document.getElementById("money-text-"+foldPlayer).style.color = "lightgray";
    document.getElementById("button-win-"+foldPlayer).disabled = true;
    document.getElementById("button-fold-"+foldPlayer).disabled = true;
}

leavePlayer = function (leavePlayer) {

    console.log("player leave "+leavePlayer)

    playerLeave[leavePlayer] = true;

    document.getElementById("name-text-"+leavePlayer).style.color = "lightpink";
    document.getElementById("money-text-"+leavePlayer).style.color = "lightpink";
    document.getElementById("button-win-"+leavePlayer).disabled = true;
    document.getElementById("button-fold-"+leavePlayer).disabled = true;
}

toggleWinner = function () {

    if (selectingWinner == false) {

        for (l = 0; l < playerCount; l++) {

            document.getElementById("button-fold-"+l).style.display = "none";
            document.getElementById("button-win-"+l).style.display = "block";
        } 

        selectingWinner = true;

        document.getElementById("toggleWinner").innerHTML = "Untoggle winner selection";
    }
    else {
        
        for (l = 0; l < playerCount; l++) {

            document.getElementById("button-fold-"+l).style.display = "block";
            document.getElementById("button-win-"+l).style.display = "none";
        }

        selectingWinner = false;

        document.getElementById("toggleWinner").innerHTML = "Select winner";
    }
}

winPlayer = function (winPlayer) {

    winnerStats(winPlayer,pot);

    playerMoney[winPlayer] += pot;
    playerTotalMoneyWon[winPlayer] += pot;
    playerTotalWins[winPlayer] += 1;
    pot = 0;

    document.getElementById("money-form-"+winPlayer).value = playerMoney[winPlayer];
    document.getElementById("money-text-"+winPlayer).innerHTML = playerMoney[winPlayer];
    document.getElementById("thePot").innerHTML = 0;

    for (r = 0; r < playerCount; r++) {

        playerTotalBet[r] += playerBet[r];

        playerBet[r] = 0;
        playerFold[r] = false;
        if (playerLeave[r] == false) {

            document.getElementById("name-text-"+r).style.color = "black";
            document.getElementById("money-text-"+r).style.color = "black";
            document.getElementById("button-win-"+r).disabled = false;
            document.getElementById("button-fold-"+r).disabled = false;
        }
    }

    firstCall = true;
    toggleWinner();
    updateBlinds();

    for (r = 0; r < playerCount; r++) {

        document.getElementById("bet-text-"+r).innerHTML = -playerBet[r];
    }
}

updateBlinds = function () {

    bb = parseInt(document.getElementById("bigBlind").value);
    sb = parseInt(document.getElementById("smallBlind").value);

    document.getElementById("status-big-"+bigBlind).style.display = "none";
    document.getElementById("status-small-"+smallBlind).style.display = "none";

    smallBlind++;
    smallBlind %= playerCount;
    while (playerMoney[smallBlind] < sb || playerLeave[smallBlind] == true) {

        leavePlayer(smallBlind);

        smallBlind++;
        smallBlind %= playerCount;
    }

    bigBlind++;
    bigBlind %= playerCount;
    while (playerMoney[bigBlind] < bb || playerLeave[bigBlind] == true) {

        leavePlayer(bigBlind);
    
        bigBlind++;
        bigBlind %= playerCount;
    }

    document.getElementById("status-big-"+bigBlind).style.display = "block";
    document.getElementById("status-small-"+smallBlind).style.display = "block";

    payBlinds();
}

payBlinds = function () {

    bb = parseInt(document.getElementById("bigBlind").value);
    sb = parseInt(document.getElementById("smallBlind").value);

    pot += bb + sb;

    playerMoney[bigBlind] -= bb;
    playerBet[bigBlind] += bb;

    playerMoney[smallBlind] -= sb;
    playerBet[smallBlind] += sb;

    document.getElementById("money-text-"+bigBlind).innerHTML = playerMoney[bigBlind];
    document.getElementById("money-text-"+smallBlind).innerHTML = playerMoney[smallBlind];
    document.getElementById("thePot").innerHTML = pot;

    document.getElementById("money-form-"+bigBlind).value = playerMoney[bigBlind];
    document.getElementById("money-form-"+smallBlind).value = playerMoney[smallBlind];
}

addToPotCustom = function () {

    newBet = parseInt(document.getElementById("customBet").customBetSlider.value);

    addToPot(newBet);
}

addToPot = function (bet) {

    if (firstCall == true) {
        maxBet = 0;
        for (m = 0; m < playerCount; m++) {
            
            if (playerBet[m] > maxBet) { maxBet = playerBet[m]; }
        }
    }

    for (b = 0; b < playerCount; b++) {
        //console.log("for",b);
        if (playerFold[b] == false && playerLeave[b] == false) {
            
            callBlind = 0;
            if (firstCall == true) {

                callBlind = maxBet - playerBet[b];
            } 

            if (playerMoney[b] >= bet + callBlind) {
                //console.log("if",b)
                pot += bet + callBlind;
                playerMoney[b] -= bet + callBlind;
                playerBet[b] += bet + callBlind;

                document.getElementById("money-form-"+b).value = playerMoney[b];
                document.getElementById("money-text-"+b).innerHTML = playerMoney[b];
                document.getElementById("bet-text-"+b).innerHTML = -playerBet[b];
            }
            else {

                foldPlayer(b);                
            }
        }
    }

    firstCall = false;
    document.getElementById("thePot").innerHTML = pot;
}

toggleSettings = function () {

    if (selectingWinner == true) {

        toggleWinner();
    }

    for (p = 0; p < playerCount; p++) {

        playerNames[p] = document.getElementById("name-form-"+p).value;
        playerMoney[p] = parseInt(document.getElementById("money-form-"+p).value);
        playerBet[p] = 0;
        playerFold[p] = false;
        playerLeave[p] = false;
        
        if (settings == true) {

            // Settings
            document.getElementById("settingsHolder").style.display = "none";

            // Name
            document.getElementById("name-form-"+p).style.display = "none";
            document.getElementById("name-text-"+p).innerHTML = document.getElementById("name-form-"+p).value;
            document.getElementById("name-text-"+p).style.display = "block";

            // Money
            document.getElementById("money-form-"+p).style.display = "none";
            document.getElementById("money-text-"+p).innerHTML = document.getElementById("money-form-"+p).value;
            document.getElementById("money-text-"+p).style.display = "block";
            document.getElementById("bet-text-"+p).style.display = "block";            

            // Buttons
            document.getElementById("button-remove-"+p).style.display = "none";
            document.getElementById("button-fold-"+p).style.display = "block";

            // Bet and pot
            document.getElementById("betHolder").style.display = "";
            document.getElementById("potHolder").style.display = "";

            // Special buttons
            document.getElementById("toggleWinner").style.display = "";
            document.getElementById("newPlayerButton").style.display = "none";
        }
        else {

            // Settings
            document.getElementById("settingsHolder").style.display = "table-row";            

            // Name
            document.getElementById("name-form-"+p).style.display = "block";            
            document.getElementById("name-text-"+p).style.display = "none";

            // Money
            document.getElementById("money-form-"+p).style.display = "block";            
            document.getElementById("money-text-"+p).style.display = "none";
            document.getElementById("bet-text-"+p).style.display = "none";    

            // Buttons
            document.getElementById("button-remove-"+p).style.display = "block";
            document.getElementById("button-fold-"+p).style.display = "none";

            // Bet and pot
            document.getElementById("betHolder").style.display = "none";
            document.getElementById("potHolder").style.display = "none";

            // Special buttons
            document.getElementById("toggleWinner").style.display = "none";
            document.getElementById("newPlayerButton").style.display = "";
        }
    }

    if (settings == true) {

        settings = false;
        document.getElementById("toggleSettingsButton").innerHTML = "Open settings";
    }
    else {

        settings = true;
        document.getElementById("toggleSettingsButton").innerHTML = "Close settings";
    }

    if (start == false) {

        start = true;

        payBlinds();
        
        for (b = 0; b < playerCount; b++) {
            
            document.getElementById("bet-text-"+b).innerHTML = -playerBet[b];
        }
    }
}

winnerStats = function(winner,amount) {

    winStatRound.push(winStatRound.length + 1);
    winStatNames.push(playerNames[winner]);
    winStatMoney.push(amount);

    statRow = document.createElement("tr");
    statData = document.createElement("td");

    statData.innerHTML = (winStatRound.length)+". " + playerNames[winner] + " won " + amount + "!";

    statRow.appendChild(statData);
    document.getElementById("statsHolder").appendChild(statRow);
} 

document.getElementById("customBet").customBetSlider.oninput = function () {

    document.getElementById("customBetButton").innerHTML = document.getElementById("customBet").customBetSlider.value;
    //document.getElementById("customBetSlider").blur(); 
}
