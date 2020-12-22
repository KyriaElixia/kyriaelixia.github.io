playerCount = 0;
settings = true;
selectingWinner = false;

pot = 0;

playerNames = [];
playerMoney = [];
playerBet = [];
playerFold = [];
playerLeave = [];

// STATS
playerTotalBet = [];
playerTotalWins = [];
playerTotalMoneyWon = [];
playerTotalFolds = [];

winStatRound = [];
winStatNames = [];
winStatMoney = [];


smallBlind = 0;
bigBlind = 1;

start = false;
firstCall = true;

addNewPlayer = function () {

    row = document.createElement("tr");

    rowClass = document.createAttribute("class");
    rowClass.value = "playerDataRow";
    row.setAttributeNode(rowClass);

    // NAME DATA

    nameData = document.createElement("td");

    nameDataClass = document.createAttribute("class");
    nameDataClass.value = "nameData";
    nameData.setAttributeNode(nameDataClass);

    // NAME DATA: NAME FORM
    nameForm = document.createElement("input");

    nameFormType = document.createAttribute("type");
    nameFormType.value = "text";
    nameForm.setAttributeNode(nameFormType);

    nameFormId = document.createAttribute("id");
    nameFormId.value = "name-form-"+playerCount;
    nameForm.setAttributeNode(nameFormId);

    nameFormStyle = document.createAttribute("style");
    nameFormStyle.value = "display:block;";
    nameForm.setAttributeNode(nameFormStyle);

    nameFormPlaceholder = document.createAttribute("Placeholder");
    nameFormPlaceholder.value = "Player "+ (playerCount + 1) + " name";
    nameForm.setAttributeNode(nameFormPlaceholder);

    nameFormClass = document.createAttribute("class");
    nameFormClass.value = "playerForm";
    nameForm.setAttributeNode(nameFormClass);

    nameFormSize = document.createAttribute("size");
    nameFormSize.value = "15";
    nameForm.setAttributeNode(nameFormSize);

    nameData.appendChild(nameForm);

    // NAME DATA: NAME TEXT

    nameText = document.createElement("p");

    nameTextId = document.createAttribute("id");
    nameTextId.value = "name-text-"+playerCount;
    nameText.setAttributeNode(nameTextId);

    nameTextStyle = document.createAttribute("style");
    nameTextStyle.value = "display:none;";
    nameText.setAttributeNode(nameTextStyle);

    nameTextClass = document.createAttribute("class");
    nameTextClass.value = "playerName";
    nameText.setAttributeNode(nameTextClass);

    nameData.appendChild(nameText);

    // MONEY DATA

    moneyData = document.createElement("td");

    // MONEY DATA: MONEY FORM

    moneyForm = document.createElement("input");
    
    moneyFormType = document.createAttribute("type");
    moneyFormType.value = "number";
    moneyForm.setAttributeNode(moneyFormType);

    moneyFormId = document.createAttribute("id");
    moneyFormId.value = "money-form-"+playerCount;
    moneyForm.setAttributeNode(moneyFormId);

    moneyFormStyle = document.createAttribute("style");
    moneyFormStyle.value = "display:block;";
    moneyForm.setAttributeNode(moneyFormStyle);

    moneyFormPlaceholder = document.createAttribute("Placeholder");
    moneyFormPlaceholder.value = "Player "+ (playerCount + 1) + " money";
    moneyForm.setAttributeNode(moneyFormPlaceholder);

    moneyFormClass = document.createAttribute("class");
    moneyFormClass.value = "playerForm";
    moneyForm.setAttributeNode(moneyFormClass);

    moneyFormValue = document.createAttribute("value");
    moneyForm.setAttributeNode(moneyFormValue);

    if (document.getElementById("settings").moneyPreset.value > 0) {

        moneyFormValue.value = document.getElementById("settings").moneyPreset.value;
    }

    moneyData.appendChild(moneyForm);

    // MONEY DATA: MONEY TEXT

    moneyTable = document.createElement("table");
    moneyRow = document.createElement("tr");
    betRow = document.createElement("tr");
    moneyHolder = document.createElement("td");
    betHolder = document.createElement("td");

    

    moneyText = document.createElement("p");
   
    moneyTextId = document.createAttribute("id");
    moneyTextId.value = "money-text-"+playerCount;
    moneyText.setAttributeNode(moneyTextId);

    moneyTextStyle = document.createAttribute("style");
    moneyTextStyle.value = "display:none;";
    moneyText.setAttributeNode(moneyTextStyle);

    moneyTextClass = document.createAttribute("class");
    moneyTextClass.value = "playerMoney";
    moneyText.setAttributeNode(moneyTextClass);

    betText = document.createElement("p");
   
    betTextId = document.createAttribute("id");
    betTextId.value = "bet-text-"+playerCount;
    betText.setAttributeNode(betTextId);

    betTextStyle = document.createAttribute("style");
    betTextStyle.value = "display:none;";
    betText.setAttributeNode(betTextStyle);

    betTextClass = document.createAttribute("class");
    betTextClass.value = "playerBet";
    betText.setAttributeNode(betTextClass);

    moneyHolder.appendChild(moneyText);
    betHolder.appendChild(betText);

    moneyRow.appendChild(moneyHolder);
    betRow.appendChild(betHolder);

    moneyTable.appendChild(moneyRow);
    moneyTable.appendChild(betRow);

    moneyData.appendChild(moneyTable);

    // COIN DATA
    
    coinData = document.createElement("td");

    // COIN DATA: IMAGE

    coinImage = document.createElement("img");

    coinImageSrc = document.createAttribute("src");
    coinImageSrc.value = "http://elixia.spelar.se/games/poker/sprites/coin.png";
    coinImage.setAttributeNode(coinImageSrc);

    coinImageWidth = document.createAttribute("Width");
    coinImageWidth.value = "30";
    coinImage.setAttributeNode(coinImageWidth);

    coinImageHeight = document.createAttribute("Height");
    coinImageHeight.value = "30";
    coinImage.setAttributeNode(coinImageHeight);

    coinData.appendChild(coinImage);

    // STATUS

    statusData = document.createElement("td");

    // STATUS: BIG

    statusDataBig = document.createElement("img");
    
    statusDataBigSrc = document.createAttribute("src");
    statusDataBigSrc.value = "http://elixia.spelar.se/games/poker/sprites/big.png";
    statusDataBig.setAttributeNode(statusDataBigSrc);

    statusDataBigWidth = document.createAttribute("Width");
    statusDataBigWidth.value = "30";
    statusDataBig.setAttributeNode(statusDataBigWidth);

    statusDataBigHeight = document.createAttribute("Height");
    statusDataBigHeight.value = "30";
    statusDataBig.setAttributeNode(statusDataBigHeight);

    statusDataBigId = document.createAttribute("id");
    statusDataBigId.value = "status-big-"+playerCount;
    statusDataBig.setAttributeNode(statusDataBigId);

    statusDataBigStyle = document.createAttribute("style");

    if (playerCount == bigBlind) {
        statusDataBigStyle.value = "display:;";
    }
    else {
        statusDataBigStyle.value = "display:none;";
    }

    statusDataBig.setAttributeNode(statusDataBigStyle);

    statusData.appendChild(statusDataBig);

    // STATUS: SMALL

    statusDataSmall = document.createElement("img");
    
    statusDataSmallSrc = document.createAttribute("src");
    statusDataSmallSrc.value = "http://elixia.spelar.se/games/poker/sprites/small.png";
    statusDataSmall.setAttributeNode(statusDataSmallSrc);

    statusDataSmallWidth = document.createAttribute("Width");
    statusDataSmallWidth.value = "30";
    statusDataSmall.setAttributeNode(statusDataSmallWidth);

    statusDataSmallHeight = document.createAttribute("Height");
    statusDataSmallHeight.value = "30";
    statusDataSmall.setAttributeNode(statusDataSmallHeight);

    statusDataSmallId = document.createAttribute("id");
    statusDataSmallId.value = "status-small-"+playerCount;
    statusDataSmall.setAttributeNode(statusDataSmallId);

    statusDataSmallStyle = document.createAttribute("style");

    if (playerCount == smallBlind) {

        statusDataSmallStyle.value = "display:;";
    }
    else {
        statusDataSmallStyle.value = "display:none;";
    }

    statusDataSmall.setAttributeNode(statusDataSmallStyle);

    statusData.appendChild(statusDataSmall);

    // BUTTONS

    buttonData = document.createElement("td");

    // BUTTONS: REMOVE

    buttonRemove = document.createElement("button");

    buttonRemoveId = document.createAttribute("id");
    buttonRemoveId.value = ("button-remove-"+playerCount);
    buttonRemove.setAttributeNode(buttonRemoveId);

    buttonRemoveClick = document.createAttribute("onclick");
    buttonRemoveClick.value = "removePlayer("+playerCount+");";
    buttonRemove.setAttributeNode(buttonRemoveClick);

    buttonRemoveClass = document.createAttribute("class");
    buttonRemoveClass.value = "buttonRemove";
    buttonRemove.setAttributeNode(buttonRemoveClass);

    buttonRemoveStyle = document.createAttribute("style");
    buttonRemoveStyle.value = "display:block;";
    buttonRemove.setAttributeNode(buttonRemoveStyle);

    buttonRemove.innerHTML = "Remove player";

    buttonData.appendChild(buttonRemove);

    // BUTTONS: FOLD

    buttonFold = document.createElement("button");

    buttonFoldId = document.createAttribute("id");
    buttonFoldId.value = ("button-fold-"+playerCount);
    buttonFold.setAttributeNode(buttonFoldId);

    buttonFoldClick = document.createAttribute("onclick");
    buttonFoldClick.value = "foldPlayer("+playerCount+");";
    buttonFold.setAttributeNode(buttonFoldClick);

    buttonFoldClass = document.createAttribute("class");
    buttonFoldClass.value = "buttonFold";
    buttonFold.setAttributeNode(buttonFoldClass);

    buttonFoldStyle = document.createAttribute("style");
    buttonFoldStyle.value = "display:none;";
    buttonFold.setAttributeNode(buttonFoldStyle);

    buttonFold.innerHTML = "Fold player";

    buttonData.appendChild(buttonFold);

    // BUTTONS: WIN

    buttonWin = document.createElement("button");

    buttonWinId = document.createAttribute("id");
    buttonWinId.value = ("button-win-"+playerCount);
    buttonWin.setAttributeNode(buttonWinId);

    buttonWinClick = document.createAttribute("onclick");
    buttonWinClick.value = "winPlayer("+playerCount+");";
    buttonWin.setAttributeNode(buttonWinClick);

    buttonWinClass = document.createAttribute("class");
    buttonWinClass.value = "buttonWin";
    buttonWin.setAttributeNode(buttonWinClass);

    buttonWinStyle = document.createAttribute("style");
    buttonWinStyle.value = "display:none;";
    buttonWin.setAttributeNode(buttonWinStyle);

    buttonWin.innerHTML = "Select as winner";

    buttonData.appendChild(buttonWin);

    // Appent data to row

    row.appendChild(nameData);
    row.appendChild(moneyData);
    row.appendChild(coinData);
    row.appendChild(statusData);
    row.appendChild(buttonData);

    document.getElementById("playerList").appendChild(row);


    // DIVIDER
    dividerRow = document.createElement("tr");
    dividerData = document.createElement("td");

    dividerDataClass = document.createAttribute("class");
    dividerDataClass.value = "playerDiv";
    dividerData.setAttributeNode(dividerDataClass);

    dividerDataSpan = document.createAttribute("colspan");
    dividerDataSpan.value = "5";
    dividerData.setAttributeNode(dividerDataSpan);

    dividerRow.appendChild(dividerData);
    document.getElementById("playerList").appendChild(dividerRow);



    document.getElementById("name-form-"+playerCount).focus();
    
    playerCount++;

    playerNames.push();
    playerMoney.push();
    playerBet.push();
    playerFold.push();
    playerLeave.push();

    playerTotalBet.push(0);
    playerTotalWins.push(0);
    playerTotalMoneyWon.push(0);
    playerTotalFolds.push(0);
}

updatePlayerList = function () {

    document.getElementById("playerListHolder").removeChild(document.getElementById("playerList"));

    // Player list
    playerList = document.createElement("table");
    
    playerListId = document.createAttribute("id")
    playerListId.value = "playerList";
    playerList.setAttributeNode(playerListId);

    playerListCellpadding = document.createAttribute("cellpadding");
    playerListCellpadding.value = "10";
    playerList.setAttributeNode(playerListCellpadding);

    bioRow = document.createElement("tr");
    bioData1 = document.createElement("td")
    bioData2 = document.createElement("td")
    bioData3 = document.createElement("td")
    bioData4 = document.createElement("td")

    bioData1.innerHTML = "Name";
    bioData2.innerHTML = "Money";

    bioDataAlign1 = document.createAttribute("align");
    bioDataAlign1.value = "center";
    bioData1.setAttributeNode(bioDataAlign1);

    bioDataAlign2 = document.createAttribute("align");
    bioDataAlign2.value = "center";
    bioData2.setAttributeNode(bioDataAlign2);

    bioRow.appendChild(bioData1);
    bioRow.appendChild(bioData2);
    bioRow.appendChild(bioData3);
    bioRow.appendChild(bioData4);

    playerList.appendChild(bioRow);

    for (p = 0; p < playerCount; p++){
        
        row = document.createElement("tr");

        rowClass = document.createAttribute("class");
        rowClass.value = "playerDataRow";
        row.setAttributeNode(rowClass);

        // NAME DATA

        nameData = document.createElement("td");

        nameDataClass = document.createAttribute("class");
        nameDataClass.value = "nameData";
        nameData.setAttributeNode(nameDataClass);

        // NAME DATA: NAME FORM
        nameForm = document.createElement("input");

        nameFormType = document.createAttribute("type");
        nameFormType.value = "text";
        nameForm.setAttributeNode(nameFormType);

        nameFormId = document.createAttribute("id");
        nameFormId.value = "name-form-"+p;
        nameForm.setAttributeNode(nameFormId);

        nameFormStyle = document.createAttribute("style");
        nameFormStyle.value = "display:block;";
        nameForm.setAttributeNode(nameFormStyle);

        nameFormPlaceholder = document.createAttribute("Placeholder");
        nameFormPlaceholder.value = "Player "+ (p + 1) + " name";
        nameForm.setAttributeNode(nameFormPlaceholder);

        nameFormClass = document.createAttribute("class");
        nameFormClass.value = "playerForm";
        nameForm.setAttributeNode(nameFormClass);

        nameFormSize = document.createAttribute("size");
        nameFormSize.value = "15";
        nameForm.setAttributeNode(nameFormSize);

        nameFormValue = document.createAttribute("value");
        nameFormValue.value = playerNames[p];
        nameForm.setAttributeNode(nameFormValue);

        nameData.appendChild(nameForm);

        // NAME DATA: NAME TEXT

        nameText = document.createElement("p");

        nameTextId = document.createAttribute("id");
        nameTextId.value = "name-text-"+p;
        nameText.setAttributeNode(nameTextId);

        nameTextStyle = document.createAttribute("style");
        nameTextStyle.value = "display:none;";
        nameText.setAttributeNode(nameTextStyle);

        nameTextClass = document.createAttribute("class");
        nameTextClass.value = "playerName";
        nameText.setAttributeNode(nameTextClass);

        nameData.appendChild(nameText);

        // MONEY DATA

        moneyData = document.createElement("td");

        // MONEY DATA: MONEY FORM

        moneyForm = document.createElement("input");
        
        moneyFormType = document.createAttribute("type");
        moneyFormType.value = "number";
        moneyForm.setAttributeNode(moneyFormType);

        moneyFormId = document.createAttribute("id");
        moneyFormId.value = "money-form-"+p;
        moneyForm.setAttributeNode(moneyFormId);

        moneyFormStyle = document.createAttribute("style");
        moneyFormStyle.value = "display:block;";
        moneyForm.setAttributeNode(moneyFormStyle);

        moneyFormPlaceholder = document.createAttribute("Placeholder");
        moneyFormPlaceholder.value = "Player "+ (p + 1) + " money";
        moneyForm.setAttributeNode(moneyFormPlaceholder);

        moneyFormClass = document.createAttribute("class");
        moneyFormClass.value = "playerForm";
        moneyForm.setAttributeNode(moneyFormClass);

        moneyFormValue = document.createAttribute("value");
        moneyFormValue.value = playerMoney[p];
        moneyForm.setAttributeNode(moneyFormValue);

        moneyData.appendChild(moneyForm);

        // MONEY DATA: MONEY TEXT

        moneyText = document.createElement("p");
    
        moneyTextId = document.createAttribute("id");
        moneyTextId.value = "money-text-"+p;
        moneyText.setAttributeNode(moneyTextId);

        moneyTextStyle = document.createAttribute("style");
        moneyTextStyle.value = "display:none;";
        moneyText.setAttributeNode(moneyTextStyle);

        moneyTextClass = document.createAttribute("class");
        moneyTextClass.value = "playerMoney";
        moneyText.setAttributeNode(moneyTextClass);

        moneyData.appendChild(moneyText);


        // COIN DATA
        
        coinData = document.createElement("td");

        // COIN DATA: IMAGE

        coinImage = document.createElement("img");

        coinImageSrc = document.createAttribute("src");
        coinImageSrc.value = "http://elixia.spelar.se/games/poker/sprites/coin.png";
        coinImage.setAttributeNode(coinImageSrc);

        coinImageWidth = document.createAttribute("Width");
        coinImageWidth.value = "30";
        coinImage.setAttributeNode(coinImageWidth);

        coinImageHeight = document.createAttribute("Height");
        coinImageHeight.value = "30";
        coinImage.setAttributeNode(coinImageHeight);

        coinData.appendChild(coinImage);

        // STATUS

        statusData = document.createElement("td");

        // STATUS: BIG

        statusDataBig = document.createElement("img");
        
        statusDataBigSrc = document.createAttribute("src");
        statusDataBigSrc.value = "http://elixia.spelar.se/games/poker/sprites/big.png";
        statusDataBig.setAttributeNode(statusDataBigSrc);

        statusDataBigWidth = document.createAttribute("Width");
        statusDataBigWidth.value = "30";
        statusDataBig.setAttributeNode(statusDataBigWidth);

        statusDataBigHeight = document.createAttribute("Height");
        statusDataBigHeight.value = "30";
        statusDataBig.setAttributeNode(statusDataBigHeight);

        statusDataBigId = document.createAttribute("id");
        statusDataBigId.value = "status-big-"+playerCount;
        statusDataBig.setAttributeNode(statusDataBigId);

        statusDataBigStyle = document.createAttribute("style");

        if (p == bigBlind) {
            statusDataBigStyle.value = "display:;";
        }
        else {
            statusDataBigStyle.value = "display:none;";
        }

        statusDataBig.setAttributeNode(statusDataBigStyle);

        statusData.appendChild(statusDataBig);

        // STATUS: SMALL

        statusDataSmall = document.createElement("img");
        
        statusDataSmallSrc = document.createAttribute("src");
        statusDataSmallSrc.value = "http://elixia.spelar.se/games/poker/sprites/small.png";
        statusDataSmall.setAttributeNode(statusDataSmallSrc);

        statusDataSmallWidth = document.createAttribute("Width");
        statusDataSmallWidth.value = "30";
        statusDataSmall.setAttributeNode(statusDataSmallWidth);

        statusDataSmallHeight = document.createAttribute("Height");
        statusDataSmallHeight.value = "30";
        statusDataSmall.setAttributeNode(statusDataSmallHeight);

        statusDataSmallId = document.createAttribute("id");
        statusDataSmallId.value = "status-small-"+playerCount;
        statusDataSmall.setAttributeNode(statusDataSmallId);

        statusDataSmallStyle = document.createAttribute("style");

        if (p == smallBlind) {

            statusDataSmallStyle.value = "display:;";
        }
        else {
            statusDataSmallStyle.value = "display:none;";
        }

        statusDataSmall.setAttributeNode(statusDataSmallStyle);

        statusData.appendChild(statusDataSmall);

        // BUTTONS

        buttonData = document.createElement("td");

        // BUTTONS: REMOVE

        buttonRemove = document.createElement("button");

        buttonRemoveId = document.createAttribute("id");
        buttonRemoveId.value = ("button-remove-"+p);
        buttonRemove.setAttributeNode(buttonRemoveId);

        buttonRemoveClick = document.createAttribute("onclick");
        buttonRemoveClick.value = "removePlayer("+p+");";
        buttonRemove.setAttributeNode(buttonRemoveClick);

        buttonRemoveClass = document.createAttribute("class");
        buttonRemoveClass.value = "buttonRemove";
        buttonRemove.setAttributeNode(buttonRemoveClass);

        buttonRemoveStyle = document.createAttribute("style");
        buttonRemoveStyle.value = "display:block;";
        buttonRemove.setAttributeNode(buttonRemoveStyle);

        buttonRemove.innerHTML = "Remove player";

        buttonData.appendChild(buttonRemove);

        // BUTTONS: FOLD

        buttonFold = document.createElement("button");

        buttonFoldId = document.createAttribute("id");
        buttonFoldId.value = ("button-fold-"+p);
        buttonFold.setAttributeNode(buttonFoldId);

        buttonFoldClick = document.createAttribute("onclick");
        buttonFoldClick.value = "foldPlayer("+p+");";
        buttonFold.setAttributeNode(buttonFoldClick);

        buttonFoldClass = document.createAttribute("class");
        buttonFoldClass.value = "buttonFold";
        buttonFold.setAttributeNode(buttonFoldClass);

        buttonFoldStyle = document.createAttribute("style");
        buttonFoldStyle.value = "display:none;";
        buttonFold.setAttributeNode(buttonFoldStyle);

        buttonFold.innerHTML = "Fold player";

        buttonData.appendChild(buttonFold);

        // BUTTONS: WIN

        buttonWin = document.createElement("button");

        buttonWinId = document.createAttribute("id");
        buttonWinId.value = ("button-win-"+p);
        buttonWin.setAttributeNode(buttonWinId);

        buttonWinClick = document.createAttribute("onclick");
        buttonWinClick.value = "winPlayer("+p+");";
        buttonWin.setAttributeNode(buttonWinClick);

        buttonWinClass = document.createAttribute("class");
        buttonWinClass.value = "buttonWin";
        buttonWin.setAttributeNode(buttonWinClass);

        buttonWinStyle = document.createAttribute("style");
        buttonWinStyle.value = "display:none;";
        buttonWin.setAttributeNode(buttonWinStyle);

        buttonWin.innerHTML = "Win player";

        buttonData.appendChild(buttonWin);

        // Appent data to row

        row.appendChild(nameData);
        row.appendChild(moneyData);
        row.appendChild(coinData);
        row.appendChild(statusData);
        row.appendChild(buttonData);
        
        playerList.appendChild(row);

        // DIVIDER
        dividerRow = document.createElement("tr");
        dividerData = document.createElement("td");

        dividerDataClass = document.createAttribute("class");
        dividerDataClass.value = "playerDiv";
        dividerData.setAttributeNode(dividerDataClass);
        
        dividerDataSpan = document.createAttribute("colspan");
        dividerDataSpan.value = "4";
        dividerData.setAttributeNode(dividerDataSpan);

        dividerRow.appendChild(dividerData);
        playerList.appendChild(dividerRow);
    }

    document.getElementById("playerListHolder").appendChild(playerList);
}