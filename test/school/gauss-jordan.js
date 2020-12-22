//Elixia's Gauss-Jordan Eliminering

finnsMatris = false;
harValtRad = false;
valdRad = 0;
size = 0;
multipel = 0;

bytaValdRad = 0;
villByta = false;

matris = [];

createMatrix = function () {

    if (finnsMatris == true) {

        document.getElementById("tableHolder").removeChild(document.getElementById("theTable"));
    }
    document.getElementById("skapaMatris").style.display = "block";
    document.getElementById("firstSettings").style.display = "none";
    
    finnsMatris = true;

    theTable = document.createElement("table");
    tableId = document.createAttribute("id");
    tableId.value = "theTable";
    theTable.setAttributeNode(tableId);


    size = document.getElementById("sizeForm").matrixSize.value;
    
    matris = new Array(size);
    for (i = 0; i < size; i++) {
        matris[i] = new Array(size);
    }

    for (y = 0; y < size; y++) {

        row = document.createElement("tr");

        for (x = 0; x < size; x++) {

            data = document.createElement("td");
            dataId = document.createAttribute("id");
            dataId.value = "data_"+x+"_"+y;
            data.setAttributeNode(dataId);

            number = document.createElement("input");
            numberId = document.createAttribute("id");
            numberId.value = "number_"+x+"_"+y;
            numberType = document.createAttribute("type");
            numberType.value = "number";
            numberValue = document.createAttribute("value");
            numberValue.value = "";
            
            number.setAttributeNode(numberId);
            number.setAttributeNode(numberType);
            number.setAttributeNode(numberValue);

            data.appendChild(number);
            row.appendChild(data);
        }

        theTable.appendChild(row);
    }
    document.getElementById("tableHolder").appendChild(theTable);
}

addToMatrix = function () {

    for (y = 0; y < size; y++) {
        for (x = 0; x < size; x++) {
            matris[x][y] = parseInt(document.getElementById("number_"+y+"_"+x).value)
        }
    }

    document.getElementById("theTable").style.display = "none";
    document.getElementById("skapaMatris").style.display = "none";
    document.getElementById("settingsHolder").style.display = "block";

    theTable = document.createElement("table");
    tableId = document.createAttribute("id");
    tableId.value = "theRealTable";
    theTable.setAttributeNode(tableId);
    tablePadding = document.createAttribute("cellpadding");
    tablePadding.value = "25";
    theTable.setAttributeNode(tablePadding);

    for (y = 0; y < size; y++) {

        row = document.createElement("tr");

        for (x = 0; x < size; x++) {

            data = document.createElement("td");
            dataId = document.createAttribute("id");
            dataId.value = "matrix_"+x+"_"+y;
            data.setAttributeNode(dataId);
            dataAlign = document.createAttribute("align");
            dataAlign.value = "right";
            data.setAttributeNode(dataAlign);
                     
            row.appendChild(data);
        }

        dataWithButton = document.createElement("td");
        button = document.createElement("button");
        buttonId = document.createAttribute("id");
        buttonId.value = "button_"+y;
        buttonClick = document.createAttribute("onclick");
        buttonClick.value = "clickAction("+y+")";
        button.innerHTML = "Rad "+y;


        button.setAttributeNode(buttonId);
        button.setAttributeNode(buttonClick);        
        dataWithButton.appendChild(button);
        row.appendChild(dataWithButton);

        theTable.appendChild(row);
    }
    document.getElementById("tableHolder").appendChild(theTable);
    updateMatrix(); 
}

updateMatrix = function () {

    for (yy = 0; yy< size; yy++) {
        for (xx = 0; xx < size; xx++) {
            document.getElementById("matrix_"+yy+"_"+xx).innerHTML = matris[xx][yy];
        }
    }
}

clickAction = function (rad) {

    if (document.getElementById("settings").switch.checked == false) {

        if (harValtRad == true) {

            addHistory(rad);
            harValtRad = false;

            for (s = 0; s < size; s++) {

                matris[rad][s] += matris[valdRad][s] * multipel;
                // document.getElementById("number_"+s+"_"+rad).value = parseInt(document.getElementById("number_"+s+"_"+rad).value) + parseInt(document.getElementById("number_"+s+"_"+valdRad).value) * multipel;
                document.getElementById("meddelande").innerHTML = "";
            }
        }
        else {

            harValtRad = true;
            valdRad = rad;
            multipel = parseInt(document.getElementById("settings").matrixMultiplier.value);
            document.getElementById("meddelande").innerHTML = "Addera rad "+rad+" gånger "+multipel+" till ";
        }
    }
    else {

        if (villByta == true) {

            addHistory(rad);
            villByta = false;

            for (s = 0; s < size; s++) {

                temp = matris[rad][s];
                // temp = document.getElementById("number_"+s+"_"+rad).value;

                matris[rad][s] = matris[bytaValdRad][s];
                matris[bytaValdRad][s] = temp;
                // document.getElementById("number_"+s+"_"+rad).value = document.getElementById("number_"+s+"_"+bytaValdRad).value;
                // document.getElementById("number_"+s+"_"+bytaValdRad).value = temp;
                document.getElementById("meddelande").innerHTML = "";
            }

        }
        else {
            
            villByta = true;
            bytaValdRad = rad;
            document.getElementById("meddelande").innerHTML = "Byt plats på rad "+rad+" och ";
        }
    }
    updateMatrix();
}

addHistory = function (radKlickad) {

    newHistoryRow = document.createElement("tr");
    newHistoryData = document.createElement("td"); 
    theTable = document.createElement("table");
    tableId = document.createAttribute("id");
    tableId.value = "historyTable";
    theTable.setAttributeNode(tableId);

    for (y = 0; y < size; y++) {

        row = document.createElement("tr");

        for (x = 0; x < size; x++) {

            data = document.createElement("td");
            dataId = document.createAttribute("id");
            dataId.value = "history_"+x+"_"+y;
            data.setAttributeNode(dataId);
            data.innerHTML = matris[y][x];
            dataWidth = document.createAttribute("width");
            dataWidth.value = size;
            data.setAttributeNode(dataWidth);
                     
            row.appendChild(data);
        }

        theTable.appendChild(row);
    }
    row = document.createElement("tr");
    message = document.createElement("td");
    message.innerHTML = document.getElementById("meddelande").innerHTML + " rad "+radKlickad;
    messageCol = document.createAttribute("colspan");
    messageCol.value = "10";
    message.setAttributeNode(messageCol);
    messageWidth = document.createAttribute("width");
    messageWidth.value = "100%";
    message.setAttributeNode(messageWidth);
    row.appendChild(message);
    theTable.appendChild(row);
        
    spacing = document.createElement("br");
    row.appendChild(spacing);
    theTable.appendChild(row);


    newHistoryData.appendChild(theTable);
    newHistoryRow.appendChild(newHistoryData);
    document.getElementById("history").appendChild(newHistoryRow);
    /*
    for (yy = 0; yy< size; yy++) {
        for (xx = 0; xx < size; xx++) {
            document.getElementById("history_"+yy+"_"+xx).innerHTML = matris[xx][yy];
        }
    }
    */
}