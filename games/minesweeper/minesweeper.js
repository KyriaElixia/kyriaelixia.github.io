// TODOs

// DONE --- hindra klickning vid uppspelning av inspelning
// TODO --- kunna pausa och ändra tid på en time bar (for inspelning)
// DONE --- spela in när man använder mellanslag
// DONE --- fixa så att open/close peek inte drar ner musen till högra hörnet 
// DONE --- stoppa inspelning med restart knappen?
// DONE --- replay timer går från 207 till 148; fixa;
// DONE --- lägga till så att uppspelning beror på tiden i recordedGame[x][3] där x är en variabel
// DONE --- detta kommer fixa teleportering samt att playback tiden är kortare än vad spelet är vanligtvis

// TODO --- Fixa pause playknapp
// TODO --- skala om playback funktionerna, inställninagr och statistiken
// TODO --- Optimera rensning av tomma rutor

width = 16;
height = 16;
mines = 40;

size = 25;

mouseX = -1;
mouseY = -1;

minesLeft = mines;

firstClick = true;
clickDown = false;
gameEnd = false;
toggleErrors = false;
settings = false;
toggleQMarks = false;
enableRetry = false;
retrying = false;
time = 0;
theTimer = "firstClick sets timer here";
showBestTimes = true;
showStats = false;
difficulty = "beginner";

instaClick = false;
hover = false;
peek = false
peekX = -1;
peekY = -1;
playback = false;

gameStatus = "playing";

darkMode = false;
mode_path = "light_mode";

recordGame = true;
recordedGame = [];

window.addEventListener('keydown', function (e) { keyPress(e.keyCode); });

grid = new Array(width);
field = new Array(width);
for (x = 0; x < width; x++) {

    grid[x] = new Array(height);
    field[x] = new Array(height);
    for (y = 0; y < height; y++) {
        grid[x][y] = 0;
        field[x][y] = "hidden";
    }
}

statCols = ["O", "B", "I", "E", "C"];
statRows = ["GP", "GW", "GL", "AGT", "AWT", "ALT"];

createField = function () {

    document.getElementById("fieldHolder").removeChild(document.getElementById("field"));

    xOffset = 1;
    yOffset = 1+5;

    xLimit = width + xOffset;
    yLimit = height + yOffset;

    newField = document.createElement("table");

    fieldId = document.createAttribute("id");
    fieldId.value="field";
    newField.setAttributeNode(fieldId);

    fieldSpacing = document.createAttribute("cellspacing");
    fieldSpacing.value = "0";
    newField.setAttributeNode(fieldSpacing);

    for (y = 0; y <= yLimit; y++) {

        row = document.createElement("tr");

        for (x = 0; x <= xLimit; x++) {

            dont = false;
            // DATA
            data = document.createElement("td");

            dataClass = document.createAttribute("class");
            if (darkMode) {

                pf = "playFieldDark";
                document.body.style.backgroundColor = "#777777";
            } else {

                pf = "playField";
                document.body.style.backgroundColor = "#ebebeb";
            }
            dataClass.value = pf;
            data.setAttributeNode(dataClass);

            //data = document.createElement("td");

            if (y == 3 && x == 1) {
                // stops shit from fucking up
                dont = true;
            }
            else if (y >= 1 && y <= 4 && x == 1) {
                
                dataColSpan = document.createAttribute("colspan");
                dataColSpan.value = width;
                data.setAttributeNode(dataColSpan);

                dataRowSpan = document.createAttribute("rowspan");
                
                if (y == 2) {

                    dataRowSpan.value = 2;

                    // TIMER DISPLAY

                    timerData = document.createElement("td");
                    timerTable = document.createElement("table");
                    timerRow = document.createElement("tr");

                    timerTableSpacing = document.createAttribute("cellspacing");
                    timerTableSpacing.value = "0";
                    timerTable.setAttributeNode(timerTableSpacing);

                    timerDataStyle = document.createAttribute("style");
                    timerDataStyle.value = "padding: 0px;";
                    timerData.setAttributeNode(timerDataStyle);

                    timerTitle = document.createAttribute("title");
                    timerTitle.value = "Current game duration";
                    timerData.setAttributeNode(timerTitle);

                    currentDigit = 100;
                    for (d = 0; d < 7; d++) {
                    
                        timerDiv = document.createElement("td");

                        timerDivStyle = document.createAttribute("style");
                        timerDivStyle.value = "padding: 0px;";
                        timerDiv.setAttributeNode(timerDivStyle);

                        timerDivider = document.createElement("img");
                        timerDivider.style.userSelect = "none";

                        timerDividerDrag = document.createAttribute("ondragstart");
                        timerDividerDrag.value = "return false;";
                        timerDivider.setAttributeNode(timerDividerDrag);

                        timerDividerDrop = document.createAttribute("ondrop");
                        timerDividerDrop.value = "return false;";
                        timerDivider.setAttributeNode(timerDividerDrop);

                        if (d%2 == 0) {

                            timerDividerImg = document.createAttribute("src");
                            timerDividerImg.value = "sprites/" + mode_path + "/digits/digit-divider.png";
                            timerDivider.setAttributeNode(timerDividerImg);

                            timerDividerWidth = document.createAttribute("width");
                            timerDividerWidth.value = Math.floor((195*(1/105)*size)/7)*1.0;
                            timerDivider.setAttributeNode(timerDividerWidth);
 
                            timerDividerHeight = document.createAttribute("height");
                            timerDividerHeight.value = Math.floor(195*(1/105)*size)*1.0;
                            timerDivider.setAttributeNode(timerDividerHeight);

                            timerDiv.appendChild(timerDivider);
                            timerRow.appendChild(timerDiv);
                        }
                        else {
                            
                            timerDividerImg = document.createAttribute("src");
                            timerDividerImg.value = "sprites/" + mode_path + "/digits/blank-digit.png";
                            timerDivider.setAttributeNode(timerDividerImg);

                            timerDividerWidth = document.createAttribute("width");
                            timerDividerWidth.value = Math.floor((195*(1/105)*size)/(7/3))*1.0;
                            timerDivider.setAttributeNode(timerDividerWidth);

                            timerDividerHeight = document.createAttribute("height");
                            timerDividerHeight.value = Math.floor(195*(1/105)*size)*1.0;
                            timerDivider.setAttributeNode(timerDividerHeight);

                            timerDividerId = document.createAttribute("id");
                            timerDividerId.value = "digit_timer_"+currentDigit;
                            timerDivider.setAttributeNode(timerDividerId);
                            currentDigit /= 10;

                            timerDiv.appendChild(timerDivider);
                            timerRow.appendChild(timerDiv);
                        }
                                    
                    }
                    timerTable.appendChild(timerRow);
                    timerData.appendChild(timerTable);
                    

                    // SMILEY
                    anotherTable = document.createElement("table");
                    anotherRow = document.createElement("tr");
                    anotherData = document.createElement("td");

                    anotherTableSpacing = document.createAttribute("cellspacing");
                    anotherTableSpacing.value = "0";
                    anotherTable.setAttributeNode(anotherTableSpacing);

                    anotherTableAlign = document.createAttribute("align");
                    anotherTableAlign.value = "center";
                    anotherTable.setAttributeNode(anotherTableAlign)

                    anotherDataStyle = document.createAttribute("style");
                    anotherDataStyle.value = "padding: 0px;";
                    anotherData.setAttributeNode(anotherDataStyle);

                    anotherDataWidth = document.createAttribute("width");
                    anotherDataWidth.value = size*width-(2*(size*(91/25)))-(8/6)*size;
                    anotherData.setAttributeNode(anotherDataWidth);                    

                    newDiv = document.createElement("div");
                    dataImg = document.createElement("img");
                    dataImg.style.userSelect = "none";
                    newDiv.style.userSelect = "none";

                    divContext = document.createAttribute("oncontextmenu");
                    divContext.value = "return false;";
                    newDiv.setAttributeNode(divContext);

                    anotherTitle = document.createAttribute("title");
                    anotherTitle.value = "Start a new game";
                    dataImg.setAttributeNode(anotherTitle);

                    // SMILEY: SIZE
                    imgWidth = document.createAttribute("width");
                    imgWidth.value = size*2;
                    dataImg.setAttributeNode(imgWidth);

                    imgHeight = document.createAttribute("height");
                    imgHeight.value = size*2;
                    dataImg.setAttributeNode(imgHeight);

                    // SMILEY: ONDRAG & ONDROP
                    imgDrag = document.createAttribute("ondragstart");
                    imgDrag.value = "return false;";
                    dataImg.setAttributeNode(imgDrag);

                    imgDrop = document.createAttribute("ondrop");
                    imgDrop.value = "return false;";
                    dataImg.setAttributeNode(imgDrop);

                    // SMILEY DIV: ALIGN
                    divAlign = document.createAttribute("align");
                    divAlign.value = "center";
                    newDiv.setAttributeNode(divAlign);

                    // SMILEY: CLICK
                    imgClick = document.createAttribute("onclick");
                    imgClick.value = "restart();";
                    dataImg.setAttributeNode(imgClick);


                    // SMILEY: ID
                    imgId = document.createAttribute("id");
                    imgId.value = "smiley";
                    dataImg.setAttributeNode(imgId);

                    // SMILEY: SOURCE
                    imgSrc = document.createAttribute("src");
                    imgSrc.value = "sprites/" + mode_path + "/buttons/happy.png"
                    dataImg.setAttributeNode(imgSrc);
                    
                    dataImg.setAttributeNode(imgSrc);


                    // MINES DISPLAY

                    minesData = document.createElement("td");
                    minesTable = document.createElement("table");
                    minesRow = document.createElement("tr");

                    minesTableSpacing = document.createAttribute("cellspacing");
                    minesTableSpacing.value = "0";
                    minesTable.setAttributeNode(minesTableSpacing);

                    minesDataStyle = document.createAttribute("style");
                    minesDataStyle.value = "padding: 0px;";
                    minesData.setAttributeNode(minesDataStyle);

                    minesTitle = document.createAttribute("title");
                    minesTitle.value = "Mines left";
                    minesData.setAttributeNode(minesTitle);

                    currentDigit = 100;
                    for (d = 0; d < 7; d++) {
                    
                        minesDiv = document.createElement("td");

                        minesDivStyle = document.createAttribute("style");
                        minesDivStyle.value = "padding: 0px;";
                        minesDiv.setAttributeNode(minesDivStyle);

                        minesDivider = document.createElement("img");
                        minesDivider.style.userSelect = "none";

                        minesDividerDrag = document.createAttribute("ondragstart");
                        minesDividerDrag.value = "return false;";
                        minesDivider.setAttributeNode(minesDividerDrag);

                        minesDividerDrop = document.createAttribute("ondrop");
                        minesDividerDrop.value = "return false;";
                        minesDivider.setAttributeNode(minesDividerDrop);

                        if (d%2 == 0) {

                            minesDividerImg = document.createAttribute("src");
                            minesDividerImg.value = "sprites/" + mode_path + "/digits/digit-divider.png";
                            minesDivider.setAttributeNode(minesDividerImg);

                            minesDividerWidth = document.createAttribute("width");
                            minesDividerWidth.value = Math.floor((195*(1/105)*size)/7)*1.0;
                            minesDivider.setAttributeNode(minesDividerWidth);
 
                            minesDividerHeight = document.createAttribute("height");
                            minesDividerHeight.value = Math.floor(195*(1/105)*size)*1.0;
                            minesDivider.setAttributeNode(minesDividerHeight);

                            minesDiv.appendChild(minesDivider);
                            minesRow.appendChild(minesDiv);
                        }
                        else {
                            
                            minesDividerImg = document.createAttribute("src");
                            minesDividerImg.value = "sprites/" + mode_path + "/digits/blank-digit.png";
                            minesDivider.setAttributeNode(minesDividerImg);

                            minesDividerWidth = document.createAttribute("width");
                            minesDividerWidth.value = Math.floor((195*(1/105)*size)/(7/3))*1.0;
                            minesDivider.setAttributeNode(minesDividerWidth);

                            minesDividerHeight = document.createAttribute("height");
                            minesDividerHeight.value = Math.floor(195*(1/105)*size)*1.0;
                            minesDivider.setAttributeNode(minesDividerHeight);

                            minesDividerId = document.createAttribute("id");
                            minesDividerId.value = "digit_mines_"+currentDigit;
                            minesDivider.setAttributeNode(minesDividerId);
                            currentDigit /= 10;

                            minesDiv.appendChild(minesDivider);
                            minesRow.appendChild(minesDiv);
                        }
                                    
                    }
                    minesTable.appendChild(minesRow);
                    minesData.appendChild(minesTable);
                    newDiv.appendChild(dataImg);
                    anotherData.appendChild(newDiv);
                    anotherRow.appendChild(timerData);
                    anotherRow.appendChild(anotherData);
                    anotherRow.appendChild(minesData);
                    anotherTable.appendChild(anotherRow);
                    data.appendChild(anotherTable);

                }
                else {
                    dataRowSpan.value = 1;
                }
                data.setAttributeNode(dataRowSpan);

                row.appendChild(data);
            }
            
            if ((y > 0 && y < 5 && x > 1 && x <= width)) {

                dont=true;
            }
            else {

                
                // TILE
                newDiv = document.createElement("div");
                dataImg = document.createElement("img");
                dataImg.style.userSelect = "none";
                newDiv.style.userSelect = "none";

                divContext = document.createAttribute("oncontextmenu");
                divContext.value = "return false;";
                newDiv.setAttributeNode(divContext);

                // IMAGE: SIZE
                imgWidth = document.createAttribute("width");
                imgWidth.value = size;
                dataImg.setAttributeNode(imgWidth);

                imgHeight = document.createAttribute("height");
                imgHeight.value = size;
                dataImg.setAttributeNode(imgHeight);

                // IMAGE: ONDRAG & ONDROP
                imgDrag = document.createAttribute("ondragstart");
                imgDrag.value = "return false;";
                dataImg.setAttributeNode(imgDrag);

                imgDrop = document.createAttribute("ondrop");
                imgDrop.value = "return false;";
                dataImg.setAttributeNode(imgDrop);

                // IMAGE: SOURCE
                imgSrc = document.createAttribute("src");                
            }

            // TOP ROW
            if (y == 0) {

                if (x == 0) {
                    
                    imgSrc.value = "sprites/" + mode_path + "/frame/corner-es.png";
                }
                else if (x == xLimit) {
                    
                    imgSrc.value = "sprites/" + mode_path + "/frame/corner-sw.png";
                }
                else {
                    
                    imgSrc.value = "sprites/" + mode_path + "/frame/line-h.png";
                }
            }
            else if (y < 5 && x > 0 && x < width) {
                
                
            }
            else if (y == 5) {
                
                if (x == 0) {
                    
                    imgSrc.value = "sprites/" + mode_path + "/frame/cross-nes.png";
                }
                else if (x == xLimit) {
                    
                    imgSrc.value = "sprites/" + mode_path + "/frame/cross-nsw.png";
                }
                else {
                    
                    imgSrc.value = "sprites/" + mode_path + "/frame/line-h.png";
                }
            }
            // BOTTOM ROW
            else if (y == yLimit) {

                if (x == 0) {
                    
                    imgSrc.value = "sprites/" + mode_path + "/frame/corner-ne.png";
                }
                else if (x == xLimit) {
                    
                    imgSrc.value = "sprites/" + mode_path + "/frame/corner-nw.png";
                }
                else {
                    
                    imgSrc.value = "sprites/" + mode_path + "/frame/line-h.png";
                }
            }
            // LEFT & RIGHT COLUMN
            else if (x == 0 || x == xLimit) {

                imgSrc.value = "sprites/" + mode_path + "/frame/line-v.png";
            }
            else {

                imgSrc.value = getPicture(field[x-xOffset][y-yOffset]);
                

                // SET TILE ID
                tileId = document.createAttribute("id");
                tileId.value = "tile_"+(x-xOffset)+"_"+(y-yOffset);
                dataImg.setAttributeNode(tileId);

                // DIV PROPERTIES

                newDiv.x = x-xOffset;
                newDiv.y = y-yOffset;

                newDiv.onmouseover = function () {                

                    mouseX = this.x;
                    mouseY = this.y;
                    
                    if (hover && field[this.x][this.y] == "hidden") {
                        document.getElementById("tile_" + this.x + "_" + this.y).src = "sprites/" + mode_path + "/tiles/open-tile.png";
                        this.changed = true;
                    }                    
                };
                newDiv.onmouseout = function () {

                    if (hover && field[this.x][this.y] == "hidden" && this.changed ) {

                        document.getElementById("tile_" + this.x + "_" + this.y).src = "sprites/" + mode_path + "/tiles/tile.png";
                        this.changed = false;
                    }                    
                    mouseX = -1;
                    mouseY = -1;                    
                }; 
                newDiv.onmousedown = function (e) {

                    if (e.which == 1 && gameEnd == false && playback == false) {

                        if (instaClick) {

                            if (firstClick == true) {

                                if (retrying == false) {
                                    shuffleField(this.x,this.y);
                                }                                
                                theTimer = setInterval(updateTime,1000);
                            }
                            
                            if (recordGame && !gameEnd) {
                                recordedGame.push(["leftClick",this.x,this.y,time]);                                
                            }
                            newAction("leftClick",this.x,this.y);
                            clearOpenTiles();                            
                        }
                        else {
                            
                            if (field[this.x][this.y] == "hidden") {
                                document.getElementById("tile_" + this.x + "_" + this.y).src = "sprites/" + mode_path + "/tiles/open-tile.png";
                                this.changed = true;
                                hover = true;
                            }
                            else if (field[this.x][this.y] >= 1 && field[this.x][this.y] <= 8 && hover == false) {
                                
                                openPeek(this.x,this.y);
                                if (recordGame && !gameEnd && peek) {
                                    recordedGame.push(["openPeek",this.x,this.y,time]);                                    
                                }                               
                            }
                        }
                    }
                    else if (e.which == 3  && gameEnd == false && hover == false && playback == false) {
                        
                        if (recordGame && !gameEnd) {
                            recordedGame.push(["rightClick",this.x,this.y,time]);                            
                        }
                        newAction("rightClick",this.x,this.y);
                    }
                };
                newDiv.onmouseup = function (e) {

                    if (!instaClick && gameEnd == false && peek == false && e.which == 1 && playback == false) {

                        if (firstClick == true) {

                            if (retrying == false) {
                                shuffleField(this.x,this.y);
                            }
                            firstClick = false;
                            theTimer = setInterval(updateTime, 1000);
                        }

                        if (recordGame && !gameEnd) {
                            recordedGame.push(["leftClick",this.x,this.y,time]);                            
                        }
                        newAction("leftClick",this.x,this.y);                        
                        clearOpenTiles();
                    }
                    hover = false;                    
                };                               
            }

            dataImg.setAttributeNode(imgSrc);

            newDiv.appendChild(dataImg);
            data.appendChild(newDiv);

            if (dont == false) {
                row.appendChild(data);
            }
            
        }        
        newField.appendChild(row);       
    }

    document.getElementById("fieldHolder").appendChild(newField);
    setSmiley();
    setMineDisplay();
    setTimerDisplay();
}

playbackBar = function() {

    this.updateBar = function(u) {

        percent = u/ (parseInt(document.getElementById("playbackBar").max) * FPS)*100;
        if (darkMode) {
            document.getElementById("playbackBar").style.backgroundImage = "linear-gradient(to right, rgb(86,23,14), rgb(86,23,14) " + percent + "%, rgb(25,3,2) " + percent + "%, rgb(25,3,2))";
        } else {
            document.getElementById("playbackBar").style.backgroundImage = "linear-gradient(to right, rgb(179,37,24), rgb(179,37,24) " + percent + "%, rgb(61,6,3) " + percent + "%, rgb(61,6,3))";
        }
    }

    this.setTime = function(t) {        

        document.getElementById("playbackBar").value = t;

        min1 = Math.floor(t/60);        
        sec1 = t%60 < 10 ? "0" + t%60 : "" + t%60;
        
        maxt = parseInt(document.getElementById("playbackBar").max) - t        
        min2 = Math.floor(maxt/60);
        sec2 = maxt%60 < 10 ? "0" + maxt%60 : "" + maxt%60;
        
        document.getElementById("showTimeNow").innerHTML = min1 + ":" + sec1;
        document.getElementById("showTimeLeft").innerHTML = "-" + min2 + ":" + sec2;
    }
    this.setLength = function(l) {

        document.getElementById("playbackBar").max = l;
    }
    this.setWidth = function(w) {

        document.getElementById("playbackBar").style.width = w;
    }
    this.show = function() {

        document.getElementById("playbackBarHolder").style.display = "";
    }
    this.hide = function() {

        document.getElementById("playbackBarHolder").style.display = "none";
    }
}

openPeek = function(xx,yy) {

    flagCount = 0;
    if (xx - 1 >= 0)                       { if (field[xx - 1][yy]     == "flag") { flagCount++; } }
    if (xx + 1 < width)                    { if (field[xx + 1][yy]     == "flag") { flagCount++; } }
    if (yy - 1 >= 0)                       { if (field[xx][yy - 1]     == "flag") { flagCount++; } }
    if (yy + 1 < height)                   { if (field[xx][yy + 1]     == "flag") { flagCount++; } }
    if (xx - 1 >= 0    && yy - 1 >= 0)     { if (field[xx - 1][yy - 1] == "flag") { flagCount++; } }
    if (xx - 1 >= 0    && yy + 1 < height) { if (field[xx - 1][yy + 1] == "flag") { flagCount++; } }
    if (xx + 1 < width && yy - 1 >= 0)     { if (field[xx + 1][yy - 1] == "flag") { flagCount++; } }
    if (xx + 1 < width && yy + 1 < height) { if (field[xx + 1][yy + 1] == "flag") { flagCount++; } }

    if (flagCount != field[xx][yy]) {

        peek = true;
        peekX = xx;
        peekY = yy;

        if (xx - 1 >= 0)                      { if (field[xx - 1][yy]     == "hidden") { document.getElementById("tile_" + (xx - 1) + "_" + yy).src = "sprites/" + mode_path + "/tiles/open-tile.png";       } }
        if (xx + 1 < width)                   { if (field[xx + 1][yy]     == "hidden") { document.getElementById("tile_" + (xx + 1) + "_" + yy).src = "sprites/" + mode_path + "/tiles/open-tile.png";       } }
        if (yy - 1 >= 0)                      { if (field[xx][yy - 1]     == "hidden") { document.getElementById("tile_" + xx + "_" + (yy - 1)).src = "sprites/" + mode_path + "/tiles/open-tile.png";       } }
        if (yy + 1 < height)                  { if (field[xx][yy + 1]     == "hidden") { document.getElementById("tile_" + xx + "_" + (yy + 1)).src = "sprites/" + mode_path + "/tiles/open-tile.png";       } }
        if (xx - 1 >= 0    && yy - 1 >= 0)     { if (field[xx - 1][yy - 1] == "hidden") { document.getElementById("tile_" + (xx - 1) + "_" + (yy - 1)).src = "sprites/" + mode_path + "/tiles/open-tile.png"; } }
        if (xx - 1 >= 0    && yy + 1 < height) { if (field[xx - 1][yy + 1] == "hidden") { document.getElementById("tile_" + (xx - 1) + "_" + (yy + 1)).src = "sprites/" + mode_path + "/tiles/open-tile.png"; } }
        if (xx + 1 < width && yy - 1 >= 0)     { if (field[xx + 1][yy - 1] == "hidden") { document.getElementById("tile_" + (xx + 1) + "_" + (yy - 1)).src = "sprites/" + mode_path + "/tiles/open-tile.png"; } }
        if (xx + 1 < width && yy + 1 < height) { if (field[xx + 1][yy + 1] == "hidden") { document.getElementById("tile_" + (xx + 1) + "_" + (yy + 1)).src = "sprites/" + mode_path + "/tiles/open-tile.png"; } }        
    }
}

closePeek = function() {
    
    if (peek == true) {

        if (peekX - 1 >= 0)                          { if (field[peekX - 1][peekY]     == "hidden") { document.getElementById("tile_" + (peekX - 1) + "_" + peekY).src = "sprites/" + mode_path + "/tiles/tile.png";       } }
        if (peekX + 1 < width)                       { if (field[peekX + 1][peekY]     == "hidden") { document.getElementById("tile_" + (peekX + 1) + "_" + peekY).src = "sprites/" + mode_path + "/tiles/tile.png";       } }
        if (peekY - 1 >= 0)                          { if (field[peekX][peekY - 1]     == "hidden") { document.getElementById("tile_" + peekX + "_" + (peekY - 1)).src = "sprites/" + mode_path + "/tiles/tile.png";       } }
        if (peekY + 1 < height)                      { if (field[peekX][peekY + 1]     == "hidden") { document.getElementById("tile_" + peekX + "_" + (peekY + 1)).src = "sprites/" + mode_path + "/tiles/tile.png";       } }
        if (peekX - 1 >= 0    && peekY - 1 >= 0)     { if (field[peekX - 1][peekY - 1] == "hidden") { document.getElementById("tile_" + (peekX - 1) + "_" + (peekY - 1)).src = "sprites/" + mode_path + "/tiles/tile.png"; } }
        if (peekX - 1 >= 0    && peekY + 1 < height) { if (field[peekX - 1][peekY + 1] == "hidden") { document.getElementById("tile_" + (peekX - 1) + "_" + (peekY + 1)).src = "sprites/" + mode_path + "/tiles/tile.png"; } }
        if (peekX + 1 < width && peekY - 1 >= 0)     { if (field[peekX + 1][peekY - 1] == "hidden") { document.getElementById("tile_" + (peekX + 1) + "_" + (peekY - 1)).src = "sprites/" + mode_path + "/tiles/tile.png"; } }
        if (peekX + 1 < width && peekY + 1 < height) { if (field[peekX + 1][peekY + 1] == "hidden") { document.getElementById("tile_" + (peekX + 1) + "_" + (peekY + 1)).src = "sprites/" + mode_path + "/tiles/tile.png"; } }
        
        peek = false;
        peekX = -1;
        peekY = -1;
    }
}

getPicture = function (tileContent) {

    picturePath = "";

    if (tileContent == "hidden") {

        picturePath = "sprites/" + mode_path + "/tiles/tile.png";
    }
    else if (tileContent == 0) {

        picturePath = "sprites/" + mode_path + "/tiles/open-tile.png";
    }
    else if (tileContent >= 1 && tileContent <= 8) {

        picturePath = "sprites/" + mode_path + "/tiles/" + tileContent + "-tile.png";
    }
    else if (tileContent == "flag") {

        picturePath = "sprites/" + mode_path + "/tiles/flag.png";
    }
    else if (tileContent == "bomb") {

        picturePath = "sprites/" + mode_path + "/tiles/bomb.png";
    }
    else if (tileContent == "not" || tileContent == "exploded") {

        picturePath = "sprites/" + mode_path + "/tiles/" + tileContent + "-bomb.png";
    }
    else if (tileContent == "maybe") {

        picturePath = "sprites/" + mode_path + "/tiles/maybe.png";
    }

    return picturePath;
}

setSmiley = function () {

    if (gameStatus == "loss") {
        
        document.getElementById("smiley").src = "sprites/" + mode_path + "/buttons/dead.png";
    }
    else if (gameStatus == "win") {

        document.getElementById("smiley").src = "sprites/" + mode_path + "/buttons/cool.png";

        if (Math.floor(Math.random()*100) < 5) {

            document.getElementById("smiley").src = "sprites/" + mode_path + "/buttons/kiss.png";
        }
    }
    else {

        document.getElementById("smiley").src = "sprites/" + mode_path + "/buttons/happy.png";
    }
}

setMineDisplay = function () {

    
    minesLeftDisplay = Math.abs(minesLeft);

    hundra = Math.floor(minesLeftDisplay/100);
    tio = Math.floor((minesLeftDisplay % 100) / 10);
    ett = Math.floor((minesLeftDisplay % 100) % 10);

    if (minesLeft >= 0) {        

        document.getElementById("digit_mines_100").src = "sprites/" + mode_path + "/digits/" + hundra + "-digit.png";
    }
    else {

        document.getElementById("digit_mines_100").src = "sprites/" + mode_path + "/digits/digit-negative.png";
    }


    document.getElementById("digit_mines_10").src = "sprites/" + mode_path + "/digits/"+tio+"-digit.png";
    document.getElementById("digit_mines_1").src = "sprites/" + mode_path + "/digits/"+ett+"-digit.png";
}

setTimerDisplay = function () {


    hundra = Math.floor(time/100);
    tio = Math.floor((time % 100) / 10);
    ett = Math.floor((time % 100) % 10);


    if (time > 999) {

        document.getElementById("digit_timer_100").src = "sprites/" + mode_path + "/digits/9-digit.png";
        document.getElementById("digit_timer_10").src = "sprites/" + mode_path + "/digits/9-digit.png";
        document.getElementById("digit_timer_1").src = "sprites/" + mode_path + "/digits/9-digit.png";
    }
    else {
        
        document.getElementById("digit_timer_100").src = "sprites/" + mode_path + "/digits/" + hundra + "-digit.png";
        document.getElementById("digit_timer_10").src = "sprites/" + mode_path + "/digits/" + tio + "-digit.png";
        document.getElementById("digit_timer_1").src = "sprites/" + mode_path + "/digits/" + ett + "-digit.png";
    }
}

updateTime = function () {

    time++;
    setTimerDisplay();
}

keyPress = function (key) {
    
    if (key == 32 && gameEnd == false && playback == false) {

        if (mouseX != -1 && mouseY != -1) {
            
            if (recordGame && !gameEnd) {
                recordedGame.push(["spacebar",mouseX,mouseY,time])                
            }
            newAction("spacebar",mouseX,mouseY);
        }
    }
    else if (key == 13) {

        restart();
    }
}

newAction = function (action,x,y) {

    if (action == "leftClick") {

        if (field[x][y] == "hidden") {

            field[x][y] = grid[x][y];
            
            document.getElementById("tile_" + x + "_" + y).src = getPicture(field[x][y]);

            if (field[x][y] == "bomb") {

                field[x][y] = "exploded";
                conditions("loss");                
            }
        }
        else if (field[x][y] >= 1 && field[x][y] <= 8) {

            specialAction(x,y);
            updateField();
        }
    }
    else if (action == "rightClick") {

        if (field[x][y] == "hidden") {

            field[x][y] = "flag";
            minesLeft--;

            document.getElementById("tile_" + x + "_" + y).src = getPicture(field[x][y]);
            setMineDisplay();
        }
        else if (field[x][y] == "flag" || field[x][y] == "maybe") {

            if (toggleQMarks == true && field[x][y] == "flag") {

                field[x][y] = "maybe";
                minesLeft++;

                document.getElementById("tile_" + x + "_" + y).src = getPicture(field[x][y]);
                setMineDisplay();
            }
            else {

                if (toggleQMarks == false && field[x][y] != "maybe") {

                    minesLeft++;
                    setMineDisplay();
                }
                field[x][y] = "hidden";

                document.getElementById("tile_" + x + "_" + y).src = getPicture(field[x][y]);                
            }            
        }
        
        if (toggleErrors == true) {

            updateField();
        }
    }
    else if (action == "spacebar") {

        if (field[x][y] == "hidden") {

            field[x][y] = "flag";
            minesLeft--;
            setMineDisplay();
        }
        else if (field[x][y] == "flag" || field[x][y] == "maybe") {

            if (toggleQMarks == true && field[x][y] == "flag") {

                field[x][y] = "maybe";
                minesLeft++;
                setMineDisplay();
            }
            else {

                if (toggleQMarks == false && field[x][y] != "maybe") {

                    minesLeft++;
                    setMineDisplay();
                }
                field[x][y] = "hidden";                               
            }            
        }
        else if (field[x][y] != "hidden" && field[x][y] != "flag" && field[x][y] != 0) {

            specialAction(x,y);
        }
        updateField();                
    }
    conditions();
}

specialAction = function (x,y) {

    flagCount = 0;
    if (x - 1 >= 0)                      { if (field[x - 1][y]     == "flag") { flagCount++; } }
    if (x + 1 < width)                   { if (field[x + 1][y]     == "flag") { flagCount++; } }
    if (y - 1 >= 0)                      { if (field[x][y - 1]     == "flag") { flagCount++; } }
    if (y + 1 < height)                  { if (field[x][y + 1]     == "flag") { flagCount++; } }
    if (x - 1 >= 0    && y - 1 >= 0)     { if (field[x - 1][y - 1] == "flag") { flagCount++; } }
    if (x - 1 >= 0    && y + 1 < height) { if (field[x - 1][y + 1] == "flag") { flagCount++; } }
    if (x + 1 < width && y - 1 >= 0)     { if (field[x + 1][y - 1] == "flag") { flagCount++; } }
    if (x + 1 < width && y + 1 < height) { if (field[x + 1][y + 1] == "flag") { flagCount++; } }

    if (flagCount == field[x][y]) {

        if (x - 1 >= 0)                      { if (field[x - 1][y]     == "hidden") { field[x - 1][y]     = grid[x - 1][y];     } }
        if (x + 1 < width)                   { if (field[x + 1][y]     == "hidden") { field[x + 1][y]     = grid[x + 1][y];     } }
        if (y - 1 >= 0)                      { if (field[x][y - 1]     == "hidden") { field[x][y - 1]     = grid[x][y - 1];     } }
        if (y + 1 < height)                  { if (field[x][y + 1]     == "hidden") { field[x][y + 1]     = grid[x][y + 1];     } }
        if (x - 1 >= 0    && y - 1 >= 0)     { if (field[x - 1][y - 1] == "hidden") { field[x - 1][y - 1] = grid[x - 1][y - 1]; } }
        if (x - 1 >= 0    && y + 1 < height) { if (field[x - 1][y + 1] == "hidden") { field[x - 1][y + 1] = grid[x - 1][y + 1]; } }
        if (x + 1 < width && y - 1 >= 0)     { if (field[x + 1][y - 1] == "hidden") { field[x + 1][y - 1] = grid[x + 1][y - 1]; } }
        if (x + 1 < width && y + 1 < height) { if (field[x + 1][y + 1] == "hidden") { field[x + 1][y + 1] = grid[x + 1][y + 1]; } }

        hasLost = false;
        if (x - 1 >= 0)                      { if (field[x - 1][y]     == "bomb") { field[x - 1][y]     = "exploded"; hasLost = true; } }
        if (x + 1 < width)                   { if (field[x + 1][y]     == "bomb") { field[x + 1][y]     = "exploded"; hasLost = true; } }
        if (y - 1 >= 0)                      { if (field[x][y - 1]     == "bomb") { field[x][y - 1]     = "exploded"; hasLost = true; } }
        if (y + 1 < height)                  { if (field[x][y + 1]     == "bomb") { field[x][y + 1]     = "exploded"; hasLost = true; } }
        if (x - 1 >= 0    && y - 1 >= 0)     { if (field[x - 1][y - 1] == "bomb") { field[x - 1][y - 1] = "exploded"; hasLost = true; } }
        if (x - 1 >= 0    && y + 1 < height) { if (field[x - 1][y + 1] == "bomb") { field[x - 1][y + 1] = "exploded"; hasLost = true; } }
        if (x + 1 < width && y - 1 >= 0)     { if (field[x + 1][y - 1] == "bomb") { field[x + 1][y - 1] = "exploded"; hasLost = true; } }
        if (x + 1 < width && y + 1 < height) { if (field[x + 1][y + 1] == "bomb") { field[x + 1][y + 1] = "exploded"; hasLost = true; } }

        clearOpenTiles();

        if (hasLost == true) {
    
            conditions("loss");
        }
    }
}

conditions = function (status) {

    if (status == "loss") {

        if (time > 10) {
            
            statistics(status);
        }

        gameStatus = "loss";
        gameEnd = true;
        clearInterval(theTimer);
        document.getElementById("playbackButton").style.display = "";
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {

                if (grid[x][y] == "bomb" && field[x][y] != "exploded" && field[x][y] != "flag") {
                    field[x][y] = grid[x][y];
                }
                else if (field[x][y] == "flag" && grid[x][y] != "bomb") {
                    field[x][y] = "not";
                }
            }
        }
        updateField();         
    }
    else {

        mineCheck = 0;
        allCleared = true;
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {

                if (field[x][y] == "flag" && grid[x][y] == "bomb") {
                    
                    mineCheck++;
                }
                else if (field[x][y] == "hidden") {

                    allCleared = false;
                }
            }
        }

        if (mineCheck == mines && allCleared == true && minesLeft == 0) {
            
            gameStatus = "win";
            statistics("win");
            gameEnd = true;
            document.getElementById("playbackButton").style.display = "";
            highscores();
            clearInterval(theTimer);
            minesLeft = mines;
            
            allCleared = false;
        }
    }
    setSmiley();
    dispStats();
}

updateField = function () {

    for (a = 0; a < width; a++) {
        for (b = 0; b < height; b++) {
            
            document.getElementById("tile_" + a + "_" + b).src = getPicture(field[a][b]);
            
            if (toggleErrors == true) {

                showError(a,b);
            }
        }
    }
}

shuffleField = function (posX,posY) {
    
    console.log("shuffle",posX,posY);

    placeMines = mines;
    while (placeMines > 0) {
        for (yy = 0; yy < height; yy++) {
            for (xx = 0; xx < width; xx++) {

                place = Math.floor(Math.random()*100);
                
                if (place < 5 && (xx != posX || yy != posY) && placeMines > 0 && grid[xx][yy] != "bomb") {
                    grid[xx][yy] = "bomb";
                    placeMines--;
                }
            }
        }
    }
    for (yy = 0; yy < height; yy++) {
        for (xx = 0; xx < width; xx++) {

            if (grid[xx][yy] != "bomb") {

                bombCount = 0;
                if (xx - 1 >= 0)                       { if (grid[xx - 1][yy]     == "bomb") { bombCount++; } }
                if (xx + 1 < width)                    { if (grid[xx + 1][yy]     == "bomb") { bombCount++; } }
                if (yy - 1 >= 0)                       { if (grid[xx][yy - 1]     == "bomb") { bombCount++; } }
                if (yy + 1 < height)                   { if (grid[xx][yy + 1]     == "bomb") { bombCount++; } }
                if (xx - 1 >= 0    && yy - 1 >= 0)     { if (grid[xx - 1][yy - 1] == "bomb") { bombCount++; } }
                if (xx - 1 >= 0    && yy + 1 < height) { if (grid[xx - 1][yy + 1] == "bomb") { bombCount++; } }
                if (xx + 1 < width && yy - 1 >= 0)     { if (grid[xx + 1][yy - 1] == "bomb") { bombCount++; } }
                if (xx + 1 < width && yy + 1 < height) { if (grid[xx + 1][yy + 1] == "bomb") { bombCount++; } }

                grid[xx][yy] = bombCount;
            }
        }
    }
}

clearOpenTiles = function () {

    doOver = 1;
    while (doOver > 0) {
        doOver--;
        for (yy = 0; yy < height; yy++) {
            for (xx = 0; xx < width; xx++) {

                if (field[xx][yy] == 0) {

                    if (xx - 1 >= 0)                       { if (field[xx - 1][yy]     == "hidden") { newAction("leftClick",xx-1,yy);   doOver = 1; } }
                    if (xx + 1 < width)                    { if (field[xx + 1][yy]     == "hidden") { newAction("leftClick",xx+1,yy);   doOver = 1; } }
                    if (yy - 1 >= 0)                       { if (field[xx][yy - 1]     == "hidden") { newAction("leftClick",xx,yy-1);   doOver = 1; } }
                    if (yy + 1 < height)                   { if (field[xx][yy + 1]     == "hidden") { newAction("leftClick",xx,yy+1);   doOver = 1; } }
                    if (xx - 1 >= 0 && yy - 1 >= 0)        { if (field[xx - 1][yy - 1] == "hidden") { newAction("leftClick",xx-1,yy-1); doOver = 1; } }
                    if (xx - 1 >= 0 && yy + 1 < height)    { if (field[xx - 1][yy + 1] == "hidden") { newAction("leftClick",xx-1,yy+1); doOver = 1; } }
                    if (xx + 1 < width && yy - 1 >= 0)     { if (field[xx + 1][yy - 1] == "hidden") { newAction("leftClick",xx+1,yy-1); doOver = 1; } }
                    if (xx + 1 < width && yy + 1 < height) { if (field[xx + 1][yy + 1] == "hidden") { newAction("leftClick",xx+1,yy+1); doOver = 1; } }
                }
            }
        }
    }
}

newGame = function () {

    console.log("new game");
    setCookie("MS_difficulty",difficulty,30);

    grid = new Array(width);
    field = new Array(width);
    for (x = 0; x < width; x++) {

        grid[x] = new Array(height);
        field[x] = new Array(height);
        for (y = 0; y < height; y++) {
            grid[x][y] = 0;
            field[x][y] = "hidden";
        }
    }
    
    createField();
    restart();
    setSmiley();
    setMineDisplay();
    setTimerDisplay();

    setCookie("MS_width",width,30);
    setCookie("MS_height",height,30);
    setCookie("MS_mines",mines,30);
}

loadCookies = function () {

    //VARS
    size = parseInt(checkCookie("MS_size",25));
    width = parseInt(checkCookie("MS_width",16));
    height = parseInt(checkCookie("MS_height",16));
    mines = parseInt(checkCookie("MS_mines",40));
    difficulty = checkCookie("MS_difficulty","beginner");

    //SETTINGS
    toggleQMarks = checkCookie("MS_toggleQMarks",false);
    toggleErrors = checkCookie("MS_toggleErrors",false);
    enableRetry = checkCookie("MS_enableRetry",false);
    showBestTimes = checkCookie("MS_showBestTimes",true);
    showStats = checkCookie("MS_showStats",false);

    visitedSite = checkCookie("MS_readCookies",false);    

    if (visitedSite == false) {

        setCookie("MS_readCookies",true,30);
        showCookies();        
    }

    // console.log("cookie","size",checkCookie("MS_size",25));
    // console.log("cookie","width",checkCookie("MS_width",16));
    // console.log("cookie","height",checkCookie("MS_height",16));
    // console.log("cookie","mines",checkCookie("MS_mines",40));
    // console.log("cookie","toggleQMarks",checkCookie("MS_toggleQMarks",false));
    // console.log("cookie","toggleErrors",checkCookie("MS_toggleErrors",false));
    // console.log("cookie","enableRetry",checkCookie("MS_enableRetry",false));
    //console.log("cookie","showBestTimes",checkCookie("MS_showBestTimes",true));

    if (toggleQMarks == "true") {
        
        toggleQMarks = true;
        document.getElementById("extraSettings").questionmarks.checked = true;
    }
    else {

        toggleQMarks = false;
    }

    if (toggleErrors == "true") {
        
        toggleErrors = true;
        document.getElementById("extraSettings").showErrors.checked = true;
    }
    else {

        toggleErrors = false;
    }
    
    if (enableRetry == "true") {
        
        enableRetry = true;
        document.getElementById("extraSettings").retry.checked = true;
        document.getElementById("retryButton").style.display = "";
    }
    else {

        enableRetry = false;
    }

    if (showBestTimes == true || showBestTimes == "true") {
        
        showBestTimes = true;
        document.getElementById("extraSettings").bestTimes.checked = true;
        document.getElementById("bestTimesHolder").style.display = "";      
    }
    else {

        showBestTimes = false;
    }

    if (showStats == "true") {
        
        showStats = true;
        document.getElementById("extraSettings").stats.checked = true;
        document.getElementById("statsHolder").style.display = "";
    }
    else {

        showStats = false;
    }

    resizeButtons();
    dispStats();
}

restart = function () {

    if (playback == true) {

        cursor.deleteCursor();
        clearInterval(tiktok);
        playback = false;
    }
    playBar.hide(); 
    
    console.log("restart");
    clearInterval(theTimer);
    time = 0;
    document.getElementById("playbackButton").style.display = "none";

    firstClick = true;
    minesLeft = mines;
    gameEnd = false;
    gameStatus = "playing";
    retrying = false;

    grid = new Array(width);
    field = new Array(width);
    for (x = 0; x < width; x++) {

        grid[x] = new Array(height);
        field[x] = new Array(height);
        for (y = 0; y < height; y++) {
            grid[x][y] = 0;
            field[x][y] = "hidden";
        }
    }
    updateField();
    setSmiley();
    setMineDisplay();
    setTimerDisplay();

    recordedGame = [];    
}

retry = function () {

    if (firstClick == false && playback == false) {

        console.log("retry");
        clearInterval(theTimer);
        time = 0;

        minesLeft = mines;
        gameEnd = false;
        gameStatus = "playing";
        retrying = true;
        firstClick = true;

        field = new Array(width);
        for (x = 0; x < width; x++) {

            field[x] = new Array(height);
            for (y = 0; y < height; y++) {

                field[x][y] = "hidden";
            }
        }

        updateField();
        setSmiley();
        setMineDisplay();
        setTimerDisplay();
    }
}

toggleExtra = function (setting) {

    
    if (setting == 1) {

        if (toggleQMarks == false) {
            
            toggleQMarks = true;
        }
        else {
                        
            toggleQMarks = false;
        }
        setCookie("MS_toggleQMarks",toggleQMarks,30);
    }
    else if (setting == 2) {

        if (toggleErrors == false) {
            
            toggleErrors = true;
        }
        else {
                        
            toggleErrors = false;
        }
        setCookie("MS_toggleErrors",toggleErrors,30);
    }
    else if (setting == 3) {

        if (enableRetry == false) {

            document.getElementById("retryButton").style.display = "";
            enableRetry = true;
        }
        else {
            
            document.getElementById("retryButton").style.display = "none";
            enableRetry = false;
        }
        setCookie("MS_enableRetry",enableRetry,30);
    }
    else if (setting == 4) {

        if (showBestTimes == false) {
            
            document.getElementById("bestTimesHolder").style.display = "";
            showBestTimes = true;
        }
        else {
            
            document.getElementById("bestTimesHolder").style.display = "none";
            showBestTimes = false;
        }
        setCookie("MS_showBestTimes",showBestTimes,30);
    }
    else if (setting == 5) {

        if (showStats == false) {
            
            document.getElementById("statsHolder").style.display = "";
            showStats = true;
        }
        else {
            
            document.getElementById("statsHolder").style.display = "none";
            showStats = false;
        }
        setCookie("MS_showStats",showStats,30);
    }
}

toggleSettings = function () {

    if (settings == false) {

        settings = true;

        //document.getElementById("fieldHolder").style.display = "none";
        document.getElementById("settings").style.display = "block";
    }
    else {

        settings = false;

        //document.getElementById("fieldHolder").style.display = "block";
        document.getElementById("settings").style.display = "none";
    }

}

resizeButtons = function () {

    document.getElementById("settingsButton").width = 2*size;
    document.getElementById("settingsButton").height = 2*size;

    document.getElementById("popupButton").width = 2*size;
    document.getElementById("popupButton").height = 2*size;

    document.getElementById("retryButton").width = 2*size;
    document.getElementById("retryButton").height = 2*size;

    document.getElementById("cookieButton").width = 2*size;
    document.getElementById("cookieButton").height = 2*size;

    document.getElementById("controllsButton").width = 2*size;
    document.getElementById("controllsButton").height = 2*size;

    document.getElementById("modeButton").width = 2*size;
    document.getElementById("modeButton").height = 2*size;

    document.getElementById("playbackButton").width = 2*size;
    document.getElementById("playbackButton").height = 2*size;

    resize = size;
    if (size < 25) {

        resize = 25;
    }
    diffs = ["B","I","E"];
    for (d = 0; d < 3; d++) {
        for (h = 1; h <= 4; h++) {
                
            document.getElementById("div"+diffs[d]+h).width = Math.floor((195*(1/105)*resize)/7)*1.0;
            document.getElementById("div"+diffs[d]+h).height = Math.floor(195*(1/105)*resize)*1.0;
        }
        for (n = 1; n <= 3; n++) {

            document.getElementById("digit"+diffs[d]+n).width = Math.floor((195*(1/105)*resize)/(7/3))*1.0;
            document.getElementById("digit"+diffs[d]+n).height = Math.floor(195*(1/105)*resize)*1.0;
        }
    }
    
    setCookie("MS_size",size,30);
}

customFieldSize = function () {

    newWidth = numberFilter(document.getElementById("customField").customWidth.value); 
    newHeight = numberFilter(document.getElementById("customField").customHeight.value);
    newMines = numberFilter(document.getElementById("customField").customMines.value);

    if (newWidth == 9 && newHeight == 9 && newMines == 10) { difficulty = "beginner"; }
    else if (newWidth == 16 && newHeight == 16 && newMines == 40) { difficulty = "intermediate"; }
    else if (newWidth == 30 && newHeight == 16 && newMines == 99) { difficulty = "expert"; }
    else { difficulty = "custom" }

    if (parseInt(newWidth) < 9) {
        
        newWidth = "9";
    }
    if (parseInt(newHeight) < 9) {
        
        newHeight = "9";
    }
    if (parseInt(newMines) > (0.8*(parseInt(newWidth)*parseInt(newHeight)))) {
        console.log("threshold",0.8*(parseInt(newWidth)*parseInt(newHeight)))
        newMines = Math.floor(0.8*(parseInt(newWidth)*parseInt(newHeight)).toString());        
    }


    if (newWidth.length > 0) {

        width = parseInt(newWidth);
        document.getElementById("customField").customWidth.value = newWidth;
    }
    else {

        document.getElementById("customField").customWidth.value = width;
    }

    if (newHeight.length > 0) {
        
        height = parseInt(newHeight);
        document.getElementById("customField").customHeight.value = newHeight;
    }
    else {
        
        document.getElementById("customField").customHeight.value = height;
    }

    if (newMines.length > 0) {
        
        mines = parseInt(newMines);
        document.getElementById("customField").customMines.value = newMines;
    }
    else {

        document.getElementById("customField").customMines.value = mines;
    }

    setCookie("MS_width",width,30);
    setCookie("MS_height",height,30);   
    setCookie("MS_mines",mines,30);
    setCookie("MS_difficulty",difficulty,30);
}

numberFilter = function (aString) {

    newStr = "";
    for (t = 0; t < aString.length; t++) {

        if (isNaN(aString.charAt(t)) == false) {
            newStr += aString.charAt(t);
        }
    }
    return newStr;
}

showError = function (a,b) {


    if (field[a][b] >= 1 && field[a][b] <= 8) {

        tileCount = 0;

        if (a - 1 >= 0)                      { if (field[a - 1][b] == "flag")     { tileCount++; } }
        if (a + 1 < width)                   { if (field[a + 1][b] == "flag")     { tileCount++; } }
        if (b - 1 >= 0)                      { if (field[a][b - 1] == "flag")     { tileCount++; } }
        if (b + 1 < height)                  { if (field[a][b + 1] == "flag")     { tileCount++; } }
        if (a - 1 >= 0 && b - 1 >= 0)        { if (field[a - 1][b - 1] == "flag") { tileCount++; } }
        if (a - 1 >= 0 && b + 1 < height)    { if (field[a - 1][b + 1] == "flag") { tileCount++; } }
        if (a + 1 < width && b - 1 >= 0)     { if (field[a + 1][b - 1] == "flag") { tileCount++; } }
        if (a + 1 < width && b + 1 < height) { if (field[a + 1][b + 1] == "flag") { tileCount++; } }

        if (tileCount > field[a][b]) {
            
            document.getElementById("tile_" + a + "_" + b).src = "sprites/" + mode_path + "/tiles/error-" + field[a][b] + ".png";
        }
    }
}

showCookies = function () {

    alert("This site uses cookies to store the latest settings you've played with so you don't have to set them manually every time you play. No other information outside of the game will ever be saved.");
}

showControlls = function () {

    alert("Controls:\n• Left click (on unopened tile) - Open tile\n• Left Click (on number with as many neighboring tiles marked) - Open all unopened neighboring tiles\n• Right click - Mark tile (flag or \"?\")\n• Spacebar (on unopened tile) -Mark tile (flag or \"?\")\n• Spacebar (on number with as many neighboring tiles marked) - Open all unopened neighboring tiles\n\n• Pressing on the smiley of pressing enter starts a new game\n\nObjective:\nClear the minefield by marking all mines and opening the rest. The numbers tell how many mines are in the neightboring eight tiles.");
}

highscores = function () {

    bTime = parseInt(checkCookie("MS_statBT_B",-1));
    iTime = parseInt(checkCookie("MS_statBT_I",-1));
    eTime = parseInt(checkCookie("MS_statBT_E",-1));

    if (gameEnd == true && gameStatus == "win" && retrying == false) {        

        if (width == 9 && height == 9 && mines == 10) {                    
            
            if (time < bTime || bTime == -1) {
                
                setCookie("MS_statBT_B",time,30);
                bTime = time;
                alert("New highscore: "+time+" seconds on beginner difficulty");
            }
        }
        else if (width == 16 && height == 16 && mines == 40) {                        
            
            if (time < iTime || iTime == -1) {
                
                setCookie("MS_statBT_I",time,30);
                iTime = time;
                alert("New highscore: "+time+" seconds on intermediate difficulty");
            }
        }
        else if (width == 30 && height == 16 && mines == 99) {
                        
            if (time < eTime || eTime == -1) {

                setCookie("MS_statBT_E",time,30);
                eTime = time;
                alert("New highscore: "+time+" seconds on expert difficulty");
            }
        }        
    }

    times = [bTime,iTime,eTime];
    diffs = ["B","I","E"];
    for (d = 0; d < 3; d++) {

        hundra = Math.floor(times[d]/100);
        tio = Math.floor((times[d] % 100) / 10);
        ett = Math.floor((times[d] % 100) % 10);

        numbs = [hundra,tio,ett];

        for (h = 1; h <= 4; h++) {
                
            document.getElementById("div"+diffs[d]+h).src = "sprites/" + mode_path + "/digits/digit-divider.png";
        }
        for (n = 1; n <= 3; n++) {

            if (times[d] >= 0) {
                
                document.getElementById("digit"+diffs[d]+n).src = "sprites/" + mode_path + "/digits/"+numbs[n-1]+"-digit.png";
            }
        }
    }

}

toggleDarkMode = function () {

    if (darkMode) {

        mode_path = "light_mode";
        darkMode = false;
        document.getElementById("statsHolder").style.backgroundColor = "#dbdbdb";
        document.getElementById("settingsBorder").style.border = "10px solid rgb(220, 220, 220)"
                
        colorLines = document.getElementsByName("colorLine")
        for (d = 0; d < colorLines.length; d++) {                        
            
            colorLines[d].style.backgroundColor = "rgb(220,220,220)"            
        }

        document.getElementById("customField").customWidth.style.backgroundColor = "rgb(220, 220, 220)"; 
        document.getElementById("customField").customHeight.style.backgroundColor = "rgb(220, 220, 220)";
        document.getElementById("customField").customMines.style.backgroundColor = "rgb(220, 220, 220)";
        
    } else {

        mode_path = "dark_mode";
        darkMode = true;
        document.getElementById("statsHolder").style.backgroundColor = "#636363";
        document.getElementById("settingsBorder").style.border = "10px solid rgb(99, 99, 99)"
        
        colorLines = document.getElementsByName("colorLine")
        for (d = 0; d < colorLines.length; d++) {                        
            
            colorLines[d].style.backgroundColor = "rgb(99,99,99)"            
        }

        document.getElementById("customField").customWidth.style.backgroundColor = "rgb(99,99,99)"; 
        document.getElementById("customField").customHeight.style.backgroundColor = "rgb(99,99,99)";
        document.getElementById("customField").customMines.style.backgroundColor = "rgb(99,99,99)";
    }
    setCookie("MS_darkMode",darkMode,30);

    createField();
    

    document.getElementById("cookieButton").src = "sprites/" + mode_path + "/buttons/cookie.png";
    document.getElementById("controllsButton").src = "sprites/" + mode_path + "/buttons/controlls.png";
    document.getElementById("settingsButton").src = "sprites/" + mode_path + "/buttons/settings.png";
    document.getElementById("popupButton").src = "sprites/" + mode_path + "/buttons/popup.png";
    document.getElementById("retryButton").src = "sprites/" + mode_path + "/buttons/retry.png";
    document.getElementById("modeButton").src = "sprites/" + mode_path + "/buttons/mode.png";
    document.getElementById("playbackButton").src = "sprites/" + mode_path + "/buttons/playback.png";
    //document.getElementById("closeSettingsButton").src = "sprites/" + mode_path + "/buttons/close-settings.png";

    document.getElementById("resize75").src = "sprites/" + mode_path + "/tiles/tile.png";
    document.getElementById("resize50").src = "sprites/" + mode_path + "/tiles/tile.png";
    document.getElementById("resize37.5").src = "sprites/" + mode_path + "/tiles/tile.png";
    document.getElementById("resize25").src = "sprites/" + mode_path + "/tiles/tile.png";
    document.getElementById("resize15").src = "sprites/" + mode_path + "/tiles/tile.png";

    document.getElementById("widthIcon").src = "sprites/" + mode_path + "/buttons/width-arrows.png";
    document.getElementById("heightIcon").src = "sprites/" + mode_path + "/buttons/height-arrows.png";
    document.getElementById("bombIcon").src = "sprites/" + mode_path + "/tiles/bomb.png";
    document.getElementById("retryIcon").src = "sprites/" + mode_path + "/buttons/retry.png";
    document.getElementById("maybeIcon").src = "sprites/" + mode_path + "/tiles/maybe.png";

    document.getElementById("divB1").src = "sprites/" + mode_path + "/digits/digit-divider.png";
    document.getElementById("digitB1").src = "sprites/" + mode_path + "/digits/blank-digit.png";
    document.getElementById("divB2").src = "sprites/" + mode_path + "/digits/digit-divider.png";
    document.getElementById("digitB2").src = "sprites/" + mode_path + "/digits/blank-digit.png";
    document.getElementById("divB3").src = "sprites/" + mode_path + "/digits/digit-divider.png";
    document.getElementById("digitB3").src = "sprites/" + mode_path + "/digits/blank-digit.png";
    document.getElementById("divB4").src = "sprites/" + mode_path + "/digits/digit-divider.png";

    document.getElementById("divI1").src = "sprites/" + mode_path + "/digits/digit-divider.png";
    document.getElementById("digitI1").src = "sprites/" + mode_path + "/digits/blank-digit.png";
    document.getElementById("divI2").src = "sprites/" + mode_path + "/digits/digit-divider.png";
    document.getElementById("digitI2").src = "sprites/" + mode_path + "/digits/blank-digit.png";
    document.getElementById("divI3").src = "sprites/" + mode_path + "/digits/digit-divider.png";
    document.getElementById("digitI3").src = "sprites/" + mode_path + "/digits/blank-digit.png";
    document.getElementById("divI4").src = "sprites/" + mode_path + "/digits/digit-divider.png";

    document.getElementById("divE1").src = "sprites/" + mode_path + "/digits/digit-divider.png";
    document.getElementById("digitE1").src = "sprites/" + mode_path + "/digits/blank-digit.png";
    document.getElementById("divE2").src = "sprites/" + mode_path + "/digits/digit-divider.png";
    document.getElementById("digitE2").src = "sprites/" + mode_path + "/digits/blank-digit.png";
    document.getElementById("divE3").src = "sprites/" + mode_path + "/digits/digit-divider.png";
    document.getElementById("digitE3").src = "sprites/" + mode_path + "/digits/blank-digit.png";
    document.getElementById("divE4").src = "sprites/" + mode_path + "/digits/digit-divider.png";

    highscores();
}

statistics = function(stat_status) {

    statCol = "";
    if (difficulty == "beginner") {
        statCol = statCols[1]
    }
    else if (difficulty == "intermediate") {
        statCol = statCols[2]
    }
    else if (difficulty == "expert") {
        statCol = statCols[3]
    } else {
        statCol = statCols[4]
    }   

    if (stat_status == "win" && playback == false) {

        GP_col = parseInt(checkCookie("MS_statGP_"+statCol,0));
        AGT_col = parseInt(checkCookie("MS_statAGT_"+statCol,0));
        GW_col = parseInt(checkCookie("MS_statGW_"+statCol,0));
        AWT_col = parseInt(checkCookie("MS_statAWT_"+statCol,0));
        
        AGT_col = (AGT_col * GP_col + time)/(GP_col + 1);
        AWT_col = (AWT_col * GW_col + time)/(GW_col + 1);
        GP_col++;
        GW_col++;

        setCookie("MS_statGP_"+statCol,GP_col,30);
        setCookie("MS_statGW_"+statCol,GW_col,30);
        setCookie("MS_statAWT_"+statCol,Math.round(AWT_col),30);
        setCookie("MS_statAGT_"+statCol,Math.round(AGT_col),30);

        //---------------------------------------------------------

        GP_O = parseInt(checkCookie("MS_statGP_O",0));
        AGT_O = parseInt(checkCookie("MS_statAGT_O",0));
        GW_O = parseInt(checkCookie("MS_statGW_O",0));        
        AWT_O = parseInt(checkCookie("MS_statAWT_O",0));

        AGT_O = (AGT_O * GP_O + time)/(GP_O + 1);
        AWT_O = (AWT_O * GW_O + time)/(GW_O + 1);
        GP_O++;
        GW_O++;
        
        setCookie("MS_statGP_O",GP_O,30);
        setCookie("MS_statGW_O",GW_O,30);
        setCookie("MS_statAWT_O",Math.round(AWT_O),30);
        setCookie("MS_statAGT_O",Math.round(AGT_O),30);
    }
    else if (stat_status == "loss" && playback == false) {

        GP_col = parseInt(checkCookie("MS_statGP_"+statCol,0));
        AGT_col = parseInt(checkCookie("MS_statAGT_"+statCol,0));
        GL_col = parseInt(checkCookie("MS_statGL_"+statCol,0));
        ALT_col = parseInt(checkCookie("MS_statALT_"+statCol,0));

        AGT_col = (AGT_col * GP_col + time)/(GP_col + 1);
        ALT_col = (ALT_col * GL_col + time)/(GL_col + 1);
        GP_col++;
        GL_col++;

        setCookie("MS_statGP_"+statCol,GP_col,30);
        setCookie("MS_statGL_"+statCol,GL_col,30);
        setCookie("MS_statALT_"+statCol,Math.round(ALT_col),30);
        setCookie("MS_statAGT_"+statCol,Math.round(AGT_col),30);
        
        //---------------------------------------------------------
        
        GP_O = parseInt(checkCookie("MS_statGP_O",0));
        AGT_O = parseInt(checkCookie("MS_statAGT_O",0));
        GL_O = parseInt(checkCookie("MS_statGL_O",0));
        ALT_O = parseInt(checkCookie("MS_statALT_O",0));

        AGT_O = (AGT_O * GP_O + time)/(GP_O + 1);
        ALT_O = (ALT_O * GL_O + time)/(GL_O + 1);
        GP_O++;
        GL_O++;

        setCookie("MS_statGP_O",GP_O,30);
        setCookie("MS_statGL_O",GL_O,30);
        setCookie("MS_statALT_O",Math.round(ALT_O),30);
        setCookie("MS_statAGT_O",Math.round(AGT_O),30);
    }
}

dispStats = function() {

    for (r in statRows) {
        for (c in statCols) {

            document.getElementById("stat" + statRows[r] + "_" + statCols[c]).innerHTML = checkCookie("MS_stat" + statRows[r] + "_" + statCols[c], "N/A");
        }
    }
}

clearStats = function() {

    for (r in statRows) {
        for (c in statCols) {

            setCookie("MS_stat" + statRows[r] + "_" + statCols[c],0,30);
        }
    }    
    dispStats();
}   

spawnCursor = function(cx,cy) {

    this.cursor = document.createElement("img");
    this.cursor.style.position = "absolute";
    this.cursor.style.userSelect = "none";    
    this.cursor_offsetX = parseInt(document.getElementById("field").offsetLeft);
    this.cursor_offsetY = parseInt(document.getElementById("field").offsetTop);
    this.cursor.style.left = this.cursor_offsetX + (cx + 1) * size;
    this.cursor.style.top = this.cursor_offsetY + (cy + 6) * size;
    this.cursor.style.width = size;
    this.cursor.style.height = size;
    this.cursor.src = "sprites/cursor.png"
    document.body.appendChild(this.cursor);

    this.cursorX = this.cursor_offsetX + (cx + 1) * size;
    this.cursorY = this.cursor_offsetY + (cy + 6) * size;

    this.moveCursor = function(x1,x2,y1,y2,t) {

        if (t != 0) {

            this.cursorX += (x2 - x1) * size / t;
            this.cursorY += (y2 - y1) * size / t;

            this.cursor.style.left = this.cursorX;
            this.cursor.style.top = this.cursorY;
        }
    };

    this.setPosition = function(sx,sy) {


        this.cursorX = this.cursor_offsetX + (sx + 1) * size;
        this.cursorY = this.cursor_offsetY + (sy + 6) * size;

        this.cursor.style.left = this.cursorX;
        this.cursor.style.top = this.cursorY;
    };

    this.deleteCursor = function() {
        
        document.body.removeChild(this.cursor);
    }
}

FPS = 120;
multiplier = 1;
playRecording = function() {    
    
    if (recordedGame.length > 0 && playback == false && gameEnd == true) {
        
        firstClick = false;
        retry();
        playback = true;
        pausePlayback = false;        
        document.getElementById("pausePlay").innerHTML = "❙❙";
        time = -1;         
        
        tikTime = -FPS/4;
        currentAction = 0;

        cursor = new spawnCursor(recordedGame[0][1],recordedGame[0][2]);


        playBar.setTime(0);
        //playBar.setWidth(width*size);
        playBar.setLength(recordedGame[recordedGame.length - 1][3]);
        playBar.show();

        tiktok = setInterval(tiktokClock,1000/(FPS*multiplier));
    }   
}

changePlaybackRate = function() {
    
    clearInterval(tiktok); 
    multiplier = parseInt(document.getElementById("playbackSpeed").value);
    document.getElementById("showPlaybackRate").innerHTML = "x" + multiplier;
    
    if (playback) {
        
        tiktok = setInterval(tiktokClock,1000/(FPS*multiplier));
    }
}

pausePlay = function() {

    //❙❙//►
    if (playback) {

        if (pausePlayback) {

            pausePlayback = false;
            document.getElementById("pausePlay").innerHTML = "❙❙";
            tiktok = setInterval(tiktokClock,1000/(FPS*multiplier));

        } else {

            pausePlayback = true;
            document.getElementById("pausePlay").innerHTML = "►";
            clearInterval(tiktok);
        }
    }
    else {
        playRecording();
    }
}

tiktokClock = function() {

    if (tikTime < 0) {
 
    }
    else if (tikTime % FPS == 0) {
        
        cat(tikTime/FPS);
        pat();
 
    } else {

        pat();        
    }

    tikTime++;
    playBar.updateBar(tikTime);

    if (tikTime == (recordedGame[recordedGame.length-1][3] + 1) * FPS) {
        
        cursor.deleteCursor();
        clearInterval(tiktok);
        playback = false; 
        document.getElementById("pausePlay").innerHTML = "►";
    }
    
    if (tikTime % FPS == 0 && playback == true) {
    
        time++;
        setTimerDisplay();
        playBar.setTime(time);        
    }
}

cat = function(at) { // Collect Action at Time

    timeActions = [];
    Xs = [];
    Ys = [];

    for (r = 0; r < recordedGame.length; r++) {

        if (recordedGame[r][3] == at) {
            
            timeActions.push(r);
            Xs.push(recordedGame[r][1])
            Ys.push(recordedGame[r][2])
        }
    }

    if (timeActions.length > 0) {

        if ((timeActions[timeActions.length-1] + 1) != recordedGame.length) {

            Xs.push(recordedGame[(timeActions[timeActions.length-1] + 1)][1]);
            Ys.push(recordedGame[(timeActions[timeActions.length-1] + 1)][2]);
            
        } else {

            Xs.push(Xs[Xs.length - 1]);
            Ys.push(Ys[Ys.length - 1]);
        }
    } 

    timeDiff = Math.round(FPS / timeActions.length);
    currentAction = 0;
}

pat = function() { // Play Actions at Time

    if (timeActions.length > 0) {

        if ((tikTime % FPS) % timeDiff == 0) {
            
            apa = recordedGame[timeActions[currentAction]][0]; // Action Play X
            apx = recordedGame[timeActions[currentAction]][1];
            apy = recordedGame[timeActions[currentAction]][2];
            apt = recordedGame[timeActions[currentAction]][3];

            cursor.setPosition(apx, apy);

            if (apa == "openPeek") {

                openPeek(apx, apy);
            }
            else if (apa == "closePeek") {

                closePeek();

            } else {

                newAction(apa, apx, apy);

                if (apa == "leftClick") {

                    clearOpenTiles();
                }
            }
            currentAction++;

        } else {

            x1 = Xs[currentAction - 1];
            y1 = Ys[currentAction - 1];

            x2 = Xs[currentAction];
            y2 = Ys[currentAction];

            cursor.moveCursor(x1,x2,y1,y2,timeDiff)
            lastX = x2;
            lasty = y2;
        }
    } else {

        cursor.setPosition(lastX,lasty)        
    }
}

pbf = function(pbt) { // PlayBack From (argument: PlayBack Time)

    if (recordedGame.length > 0) {

        if (playback == true) {

            cursor.deleteCursor();
        }   
        clearInterval(tiktok); 

        firstClick = false;
        playback = false; // for retry
        retry();
        playback = true;
        time = -1;         
        
        tikTime = -FPS/4;
        currentAction = 0;

        for (f = 0; f < recordedGame.length; f++) {

            if (recordedGame[f][3] == pbt) {
                
                break;
            } 
            else if (recordedGame[f][0] != "openPeek" && recordedGame[f][0] != "closePeek") {

                newAction(recordedGame[f][0],recordedGame[f][1],recordedGame[f][2]);
                
                if (recordedGame[f][0] == "leftClick") {

                    clearOpenTiles();
                }
            }
        }

        time = pbt;
        tikTime = pbt*FPS;

        playBar.setTime(time);
        playBar.updateBar(tikTime);
        document.getElementById("pausePlay").innerHTML = "❙❙";

        cursor = new spawnCursor(recordedGame[0][1],recordedGame[0][2]);
        
        tiktok = setInterval(tiktokClock,1000/(FPS*multiplier));
    }
}

popupGame = function() {
    //void 
    console.log("popup",size,width,height,size*width,size*height)
    window.open('https://kyriaelixia.github.com/server/games/minesweeper','1539021673468','width=' + size * width + ',height=' + size * height + ',toolbar=0,menubar=0,location=0,status=0,scrollbars=0,resizable=1,left=0,top=0');return false;
    
}

tiktokClockBACKUP = function() { // UNUSED OLD PLAYBACK

    tt = (recordedGame[currentAction][3] * FPS);
    
    if (tikTime % 20 == 0) {
        //console.log("tick:",tikTime,tt,"time:",time,tt/FPS,tikTime >= tt - FPS)
    }
    //console.log(recordedGame[currentAction][3]*FPS,tikTime,"+", FPS,"-", moveTimes[currentAction])

    if (tikTime < 0) {
        
    }
    else if (true) { 
        
        if (((tikTime % FPS) % moveTimes[currentAction]) == 0 && time == recordedGame[currentAction][3]) {
            //console.log("action at:",tikTime,recordedGame[currentAction][3]*FPS,"time",time,recordedGame[currentAction][3],moveTimes[currentAction])
            
            ax = recordedGame[currentAction][1];
            ay = recordedGame[currentAction][2];
            
            cursor.setPosition(ax,ay);

            if (recordedGame[currentAction][0] == "openPeek") {
                
                openPeek(recordedGame[currentAction][1],recordedGame[currentAction][2]);
            }
            else if (recordedGame[currentAction][0] == "closePeek") {

                closePeek();

            } else {

                newAction(recordedGame[currentAction][0],recordedGame[currentAction][1],recordedGame[currentAction][2]);

                if (recordedGame[currentAction][0] == "leftClick") {
                    
                    clearOpenTiles();
                }
            }

            console.log("action",tikTime,currentAction,recordedGame[currentAction][3]*FPS,moveTimes[currentAction],subAction[currentAction]);

            tillTime = recordedGame[currentAction][3];
            currentAction++;            
        } 
        else if (tikTime >= recordedGame[currentAction][3] * FPS - moveTimes[currentAction-1]) {
            //console.log(tikTime,">=",recordedGame[currentAction][3] * FPS - moveTimes[currentAction])
            console.log("move",tikTime,currentAction,recordedGame[currentAction][3]*FPS,moveTimes[currentAction],subAction[currentAction]);
            x1 = recordedGame[currentAction - 1][1];
            x2 = recordedGame[currentAction][1];
            y1 = recordedGame[currentAction - 1][2];
            y2 = recordedGame[currentAction][2];

            cursor.moveCursor(x1,x2,y1,y2,moveTimes[currentAction])
        }       
    }
    
    tikTime++;
    if (tikTime % FPS == 0) {
    
        time++;
        setTimerDisplay();
    }

    if (currentAction == recordedGame.length) {
        
        cursor.deleteCursor();
        clearInterval(tiktok);
        playback = false;       
    }
}

exportGrid = function() {
    
    exported = "";

    widths = [5,4,3,2,1];
    
    for (w = 0; w < widths.length; w++) {
        if (width % widths[w] == 0) {
            group = widths[w];
            break;
        }
    }

    base = Math.pow(2,group);

    ww = radix.convert(width,10,32); if (ww.length == 1) { ww = "0" + ww; }
    hh = radix.convert(height,10,32); if (hh.length == 1) { hh = "0" + hh; }

    exported += group + "_" + ww + "_" + hh + "_";

    for (y = 0; y < height; y++) {
        for (x = 0; x < width/group; x++) {
            
            slice = "";
            for (g = 0; g < group; g++) {

                if (grid[x*group+g][y] == "bomb") {

                    slice += "1";
                } else {

                    slice += "0";
                } 
            }
            exported += radix.convert(slice,2,base);
        }
    }
    return exported;
}

importGrid = function(gridcode) {

    group = gridcode[0];
    width = radix.convert(gridcode.slice(2,4),32,10);
    height = radix.convert(gridcode.slice(5,7),32,10);

    base = Math.pow(2,group);
    map = gridcode.slice(9);

    for (y = 0; y < height; y++) {
        for (wg = 0; wg < width/group; wg++) {

            slice = radix.convert(map[y*width/group + wg],base,2);
            for (s = 0; s < slice.length; s++) {

                if (slice[s] == "1") {
                    grid[wg*group+s][y] = "bomb";   
                } else {
                    grid[wg*group+s][y] = 0; 
                }
            }
        }
    }
    enableRetry = false; // v
    toggleExtra(3); // ENABLES RETRY BUT HAS TO BE FALSE FIRST;
}

window.onkeydown = function(e) { // disable scroll on spacebar

    if (e.keyCode == 32 && e.target == document.body) {
        
        e.preventDefault();
    }
};

window.onload = function () {

    elements = document.getElementsByTagName("*");
    imgs = document.getElementsByTagName("img");
    for (e in elements) {

        elements[e].ondragstart = function() { return false; }
        
        if (elements[e].tagName == "IMG") {
            elements[e].style.userSelect = "none";            
        }
    }
    playBar = new playbackBar();
    createField();
    loadCookies();
    highscores();
    newGame();

    darkModeCheck = "" + checkCookie("MS_darkMode",false);        
    if (darkModeCheck != "false") {

        toggleDarkMode();
    }
    document.getElementById("playbackSpeed").value = 1;
}

window.onmouseup = function() {
    
    hover = false;
    if (peek == true) {

        if (recordGame && !gameEnd) {

            recordedGame.push(["closePeek",peekX,peekY,time])            
        }
        closePeek();
    }    
}

