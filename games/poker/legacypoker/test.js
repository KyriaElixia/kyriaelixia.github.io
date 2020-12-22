players = 0;
pot = 5000;

addPlayer = function() {

    if (document.getElementById("addPlayer").playerName.value != "") {

        var row = document.createElement("tr");

        var data = document.createElement("td");
        var name = document.createElement("p");
        var money = document.createElement("p");
        var nameV = document.createTextNode(document.getElementById("addPlayer").playerName.value);
        var moneyV = document.createTextNode(document.getElementById("addPlayer").playerMoney.value+" ");
        var moneyImg = document.createElement("img");

        var giveClass = document.createAttribute("class");
        var nameStyle = document.createAttribute("class");
        var moneyStyle = document.createAttribute("class");
        var currency = document.createAttribute("src");
        var currencyW = document.createAttribute("width");
        var currencyH = document.createAttribute("height");

        currency.value = "coin.png";
        currencyW.value = "35";
        currencyH.value = "35";
        giveClass.value = "element";
        nameStyle.value = "smallText";
        moneyStyle.value = "mediumText";



        var data2 = document.createElement("td");
        var foldButton = document.createElement("button");

        var buttonId = document.createAttribute("id");
        var buttonFunction = document.createAttribute("onclick");
        var buttonClass = document.createAttribute("class");

        buttonId.value = "button_"+players;
        buttonFunction.value = "foldPlayer("+players+");";
        buttonClass.value = "buttonKeypad";

        
        name.appendChild(nameV);
        money.appendChild(moneyV);
        money.appendChild(moneyImg);
        data.appendChild(name);
        data.appendChild(money);
        row.appendChild(data);

        data.setAttributeNode(giveClass);
        name.setAttributeNode(nameStyle);
        money.setAttributeNode(moneyStyle);
        moneyImg.setAttributeNode(currency);
        moneyImg.setAttributeNode(currencyW);
        moneyImg.setAttributeNode(currencyH);

        data2.appendChild(foldButton);
        row.appendChild(data2);

        foldButton.setAttributeNode(buttonId);
        foldButton.setAttributeNode(buttonFunction);
        foldButton.setAttributeNode(buttonClass);

        foldButton.innerHTML = "Fold";
        
        document.getElementById("playerList").appendChild(row);

        document.getElementById("addPlayer").playerName.value = "";

        players++;
    }
}

addToPot = function(amount) {
    
    pot += amount;
    document.getElementById("thePot").innerHTML = pot;

    var currency = document.createAttribute("src");
    var currencyW = document.createAttribute("width");
    var currencyH = document.createAttribute("height");
}