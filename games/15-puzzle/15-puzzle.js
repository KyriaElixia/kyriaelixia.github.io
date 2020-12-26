size = 150;
gameSize = 4;

gameGrid = [];

moves = 0;
time = 0;
clock = 0;

animationTimer = 0;

width = window.innerWidth;
height = window.innerHeight;
xHole = gameSize-1;
yHole = gameSize-1;

clikcable = true;
doAnimations = true;
firstClick = true;
settings = false;
shuffeling = false;

press = false;

window.addEventListener('keydown', function (e) { keyPress(e.keyCode); }); //Keydown listener
window.addEventListener('keyup', function (e) { press = false; }); //Keydown listener

createGame = function() {

    xZero = width/2 - size*gameSize/2;
    yZero = 4/3*size;

    document.getElementById("gameHolder").removeChild(document.getElementById("game"));
    document.getElementById("gameHolder").removeChild(document.getElementById("img"));
    document.getElementById("gameHolder").removeChild(document.getElementById("text"));
    document.getElementById("gameHolder").removeChild(document.getElementById("border"));

    gameTable = document.createElement("table");

    gameTableId = document.createAttribute("id");
    gameTableId.value = "game";
    gameTable.setAttributeNode(gameTableId);

    gameTableSpacing = document.createAttribute("cellspacing");
    gameTableSpacing.value="0";
    gameTable.setAttributeNode(gameTableSpacing);

    gameTablePadding = document.createAttribute("cellpadding");
    gameTablePadding.value="0";
    gameTable.setAttributeNode(gameTablePadding);

    gameTableStyle = document.createAttribute("style");
    gameTableStyle.value = "position: absolute; left: "+xZero+"; top: "+yZero+";";
    gameTable.setAttributeNode(gameTableStyle);

    imgTable = document.createElement("div");

    imgTableId = document.createAttribute("id");
    imgTableId.value = "img";
    imgTable.setAttributeNode(imgTableId);

    backgroundStyle = document.createAttribute("style");
    backgroundStyle.value = "position: absolute; left:"+xZero+"; top:"+yZero+"; width:"+gameSize*size+"; height:"+gameSize*size+"; background-image: url('https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/tiles/open-tile.png'); background-size: "+size+"px "+size+"px;";
    document.getElementById("backgroundDiv").setAttributeNode(backgroundStyle);

    textTable = document.createElement("div");

    textTableId = document.createAttribute("id");
    textTableId.value = "text";
    textTable.setAttributeNode(textTableId);

    gameGrid = new Array(gameSize);
    for (g = 0; g < gameSize; g++) {

        gameGrid[g] = new Array(gameSize);
    }

    for (y = 0; y < gameSize; y++) {

        gameRow = document.createElement("tr");

        for (x = 0; x < gameSize; x++) {
            
            tile = document.createElement("td");

            tileId = document.createAttribute("id");
            tileId.value = "tile_"+x+"_"+y;
            tile.setAttributeNode(tileId);

            tileImg = document.createElement("img");
            imgTable.appendChild(tileImg);

            tileImgSrc = document.createAttribute("src");
            tileImgSrc.value = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/tiles/tile.png";
            tileImg.setAttributeNode(tileImgSrc);

            tileImgId = document.createAttribute("id");
            tileImgId.value = "img_"+x+"_"+y;
            tileImg.setAttributeNode(tileImgId);

            tileImgStyle = document.createAttribute("style");
            tileImgStyle.value = "position: absolute; left:"+(xZero+x*size)+"; top:"+(yZero+y*size)+"; width:"+size+"; height:"+size+";";
            tileImg.setAttributeNode(tileImgStyle);

            tileContextMenu = document.createAttribute("oncontextmenu");
            tileContextMenu.value = "return false;";
            tile.setAttributeNode(tileContextMenu);

            tileText = document.createElement("div");
            textTable.appendChild(tileText);
            
            tileTextId = document.createAttribute("id");
            tileTextId.value = "textBox_"+x+"_"+y;
            tileText.setAttributeNode(tileTextId);

            tileTextStyle = document.createAttribute("style");
            tileTextStyle.value = "position: absolute; left:"+(xZero+x*size)+"; top:"+(yZero+y*size)+"; width:"+size+"; height:"+size+";";
            tileText.setAttributeNode(tileTextStyle);

            textSpan = document.createElement("span");            
            tileText.appendChild(textSpan);

            tileSpanId = document.createAttribute("id");
            tileSpanId.value = "text_"+x+"_"+y;
            textSpan.setAttributeNode(tileSpanId);

            tileSpanStyle = document.createAttribute("style");
            tileSpanStyle.value = "display: inline-block; vertical-align: middle; line-height: "+size+"px; font-size:"+(size*(2/5))+";";
            textSpan.setAttributeNode(tileSpanStyle);

            if (y != gameSize-1 || x != gameSize-1) {

                textSpan.innerHTML = y*gameSize+x+1;
                gameGrid[x][y] = y*gameSize+x+1;
            }
            else {

                gameGrid[x][y] = 0;
                tileImgStyle.value += "display: none;";
            }
            
            tileWidth = document.createAttribute("width");
            tileWidth.value = size;
            tile.setAttributeNode(tileWidth);

            tileHeight = document.createAttribute("height");
            tileHeight.value = size;
            tile.setAttributeNode(tileHeight);

            tileAlign = document.createAttribute("align");
            tileAlign.value = "center";
            tile.setAttributeNode(tileAlign);

            // custom font
            // tileClass = document.createAttribute("class");
            // tileClass.value = "potra";
            // tile.setAttributeNode(tileClass);

            // Set tile click properties
            tile.x = x;
            tile.y = y;

            tile.onmousedown = function() {
                
                if (firstClick == false) {
                    if (clikcable == true) {

                        move(this.x,this.y);                                                
                    }
                }
                else {

                    //startGame();
                }                          
            }
            //gameTable.appendChild(tile);
            gameRow.appendChild(tile);
        }

        gameTable.appendChild(gameRow);
    }
    //document.getElementById("gameHolder").appendChild(gameTable);
    document.getElementById("gameHolder").appendChild(imgTable);
    document.getElementById("gameHolder").appendChild(textTable);
    document.getElementById("gameHolder").appendChild(gameTable);
    
    createBorder();
}

createBorder = function() {

    borderSize = size/3;

    BxZero = xZero-borderSize;
    ByZero = yZero-borderSize;

    borderDiv = document.createElement("Div");

    borderDivId = document.createAttribute("Id");
    borderDivId.value = "border";
    borderDiv.setAttributeNode(borderDivId);

    document.getElementById("gameHolder").appendChild(borderDiv);
    
    lim = gameSize*3+2;

    for (t = 0; t < 2; t++) {
        for (b = 0; b < lim; b++) {
            
            borderImg = document.createElement("Img");
            borderDiv.appendChild(borderImg);

            borderImgSrc = document.createAttribute("Src");
            if (b == 0) {

                if (t == 0) {

                    // borderImgSrc.value = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/frame/cross-nes.png";
                    borderImgSrc.value = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/frame/corner-es.png";
                }
                else {
                    
                    borderImgSrc.value = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/frame/corner-ne.png";
                }
            }
            else if (b == lim-1) {

                if (t == 0) {

                    // borderImgSrc.value = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/frame/cross-nsw.png";
                    borderImgSrc.value = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/frame/corner-sw.png";
                }
                else {

                    borderImgSrc.value = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/frame/corner-nw.png";
                }
            }
            else {

                borderImgSrc.value = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/frame/line-h.png";
            }
            borderImg.setAttributeNode(borderImgSrc);

            borderImgStyle = document.createAttribute("Style");
            borderImgStyle.value = "position: absolute; left:"+(BxZero+b*borderSize)+"; top:"+(ByZero+(lim-1)*t*borderSize)+"; width:"+borderSize+"; height:"+borderSize+";";
            borderImg.setAttributeNode(borderImgStyle);

            borderImgDrag = document.createAttribute("ondragstart");
            borderImgDrag.value = "return false;";
            borderImg.setAttributeNode(borderImgDrag);

            borderImgDrop = document.createAttribute("ondrop");
            borderImgDrop.value = "return false;";
            borderImg.setAttributeNode(borderImgDrop);

            borderImgContextMenu = document.createAttribute("oncontextmenu");
            borderImgContextMenu.value = "return false;";
            borderImg.setAttributeNode(borderImgContextMenu);
        }
    }
    for (t = 0; t < 2; t++) {
        for (b = 1; b < lim-1; b++) {
            
            borderImg = document.createElement("Img");
            borderDiv.appendChild(borderImg);

            borderImgSrc = document.createAttribute("Src");
            borderImgSrc.value = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/frame/line-v.png";
            borderImg.setAttributeNode(borderImgSrc);

            borderImgStyle = document.createAttribute("Style");
            borderImgStyle.value = "position: absolute; left:"+(BxZero+(lim-1)*t*borderSize)+"; top:"+(ByZero+b*borderSize)+"; width:"+borderSize+"; height:"+borderSize+";";
            borderImg.setAttributeNode(borderImgStyle);

            borderImgDrag = document.createAttribute("ondragstart");
            borderImgDrag.value = "return false;";
            borderImg.setAttributeNode(borderImgDrag);

            borderImgDrop = document.createAttribute("ondrop");
            borderImgDrop.value = "return false;";
            borderImg.setAttributeNode(borderImgDrop);

            borderImgContextMenu = document.createAttribute("oncontextmenu");
            borderImgContextMenu.value = "return false;";
            borderImg.setAttributeNode(borderImgContextMenu);
        }
    }

    document.getElementById("displays").style = "position: absolute; top:"+(yZero+(gameSize+2/3)*size)+";";
    document.getElementById("clock").style = "position: absolute; left:"+xZero+";";
    document.getElementById("moves").style = "position: absolute; left:"+(xZero+(gameSize-1)*size-(Math.abs(size - (3*size*(13/50)+4*(13/150)))))+";";

    document.getElementById("bestTimes").style = "position: relative; top:"+(yZero+(gameSize+4/3)*size)+";";
}

startGame = function() {

    firstClick = false;
                    
    moves = -1;
    time = -1;
    timer();
    moveCounter();

    shuffle(250);
    clock = setInterval(timer, 1000);
}

keyPress = function (key) {

    console.log("keyPress: ", key);

    if (firstClick == true) {

        //startGame();
    }
    else {
        if (press == false && clikcable == true) {

            if (key == 83 || key == 40) { // S / down

                if (yHole-1 >= 0) {
                    move(xHole,yHole-1);
                }
            }
            else if (key == 87 || key == 38) { // W / up

                if (yHole+1 < gameSize) {
                    move(xHole,yHole+1);
                }
            }
            else if (key == 65 || key == 37) { // A / left

                if (xHole+1 < gameSize) {
                    move(xHole+1,yHole);
                }
            }
            else if (key == 68 || key == 39) { // D / right

                if (xHole-1 >= 0) {
                    move(xHole-1,yHole);
                }
            }
            press = true;
        }
    }
}

move = function(xC,yC) {

    if (xC == xHole) {

        if (yC < yHole) {

            dir = "down";
        }
        else if (yC > yHole) {

            dir = "up";
        }
        else {

            dir = "none";
        }
        dist = Math.abs(yC - yHole);
    }
    else if (yC == yHole) {

        if (xC < xHole) {

            dir = "right";
        }
        else if (xC > xHole) {

            dir = "left";
        }
        else {

            dir = "none";
        }
        dist = Math.abs(xC - xHole);
    }
    else {

        dir = "none";
    }
    
    switch(dir) {
        
        case "up":

            for (d = 0; d < dist; d++) {

                temp = gameGrid[xHole][yHole+d];
                gameGrid[xHole][yHole+d] = gameGrid[xHole][yHole+d+1];
                gameGrid[xHole][yHole+d+1] = temp;
                                         
            }
            yHole += dist;
            
        break;
        
        case "down":

            for (d = 0; d < dist; d++) {

                temp = gameGrid[xHole][yHole-d];
                gameGrid[xHole][yHole-d] = gameGrid[xHole][yHole-d-1];
                gameGrid[xHole][yHole-d-1] = temp;
            }            
            yHole -= dist;
            
        break;
        
        case "left":

        for (d = 0; d < dist; d++) {

            temp = gameGrid[xHole+d][yHole];
            gameGrid[xHole+d][yHole] = gameGrid[xHole+d+1][yHole];
            gameGrid[xHole+d+1][yHole] = temp;
        }     
        xHole += dist;   

        break;

        case "right":

            for (d = 0; d < dist; d++) {

                temp = gameGrid[xHole-d][yHole];
                gameGrid[xHole-d][yHole] = gameGrid[xHole-d-1][yHole];
                gameGrid[xHole-d-1][yHole] = temp;
            }            
            xHole -= dist;

        break;
        
        case "none":

        break;
    }
    
    if (shuffeling == false) {

        if (dir != "none") {

            moveCounter();
        }

        if (doAnimations == true) {

            moveAnimation(xC,yC,dir,dist,125/2);
        }
        else {
            render();

            if (xHole == gameSize-1 && yHole == gameSize-1) {
            
                setTimeout(winCheck,50);
            }
        }        
    }
}

moveAnimation = function(xClick,yClick,dir,dist,delay) {    

    clikcable = false;
    jump = 250/delay*1;
    jumps = (size/jump);

    runs = 0;
        
    animationTimeout = setInterval(animating,1);        

    function animating() {

        runs++;
        if (runs > jumps) {

            clearInterval(animationTimeout);
            setTimeout(render,1);
            clikcable = true;
            
            if (xHole == gameSize-1 && yHole == gameSize-1) {
        
                setTimeout(winCheck,10);
            }
        }
        else {

            for (d = 0; d < dist; d++) {                                               
                    
                if (dir == "up") {
                        
                    document.getElementById("img_"+xClick+"_"+(yClick-d)).style.top = parseInt(document.getElementById("img_"+xClick+"_"+(yClick-d)).style.top)-jump;
                    document.getElementById("textBox_"+xClick+"_"+(yClick-d)).style.top = parseInt(document.getElementById("textBox_"+xClick+"_"+(yClick-d)).style.top)-jump;
                }
                else if (dir == "down") {
                        
                    document.getElementById("img_"+xClick+"_"+(yClick+d)).style.top = parseInt(document.getElementById("img_"+xClick+"_"+(yClick+d)).style.top)+jump;
                    document.getElementById("textBox_"+xClick+"_"+(yClick+d)).style.top = parseInt(document.getElementById("textBox_"+xClick+"_"+(yClick+d)).style.top)+jump;
                }
                else if (dir == "left") {
                        
                    document.getElementById("img_"+(xClick-d)+"_"+yClick).style.left = parseInt(document.getElementById("img_"+(xClick-d)+"_"+yClick).style.left)-jump;
                    document.getElementById("textBox_"+(xClick-d)+"_"+yClick).style.left = parseInt(document.getElementById("textBox_"+(xClick-d)+"_"+yClick).style.left)-jump;
                }
                else if (dir == "right") {
                        
                    document.getElementById("img_"+(xClick+d)+"_"+yClick).style.left = parseInt(document.getElementById("img_"+(xClick+d)+"_"+yClick).style.left)+jump;
                    document.getElementById("textBox_"+(xClick+d)+"_"+yClick).style.left = parseInt(document.getElementById("textBox_"+(xClick+d)+"_"+yClick).style.left)+jump;
                }            
            }
        }           
    }    
}

render = function() {

    for (y = 0; y < gameSize; y++) {
        for (x = 0; x < gameSize; x++) {

            document.getElementById("img_"+x+"_"+y).style.left = (xZero+x*size);
            document.getElementById("img_"+x+"_"+y).style.top = (yZero+y*size);
            document.getElementById("textBox_"+x+"_"+y).style.left = (xZero+x*size);
            document.getElementById("textBox_"+x+"_"+y).style.top = (yZero+y*size);

            if (gameGrid[x][y] != 0) {

                document.getElementById("text_"+x+"_"+y).innerHTML = gameGrid[x][y];
                document.getElementById("img_"+x+"_"+y).style.display = "";
            }
            else {

                document.getElementById("text_"+x+"_"+y).innerHTML = "";
                document.getElementById("img_"+x+"_"+y).style.display = "none";

                xHole = x;
                yHole = y;
            }            
        }
    }
}

shuffle = function(turns) {

    shuffeling = true;

    toggledAnimations = false;
    if (doAnimations == true) {
        doAnimations = false;
        toggledAnimations = true;        
    }

    for (t = 0; t < turns; t++) {

        randomXY = Math.floor(Math.random()*2);
        randomMove = Math.floor(Math.random()*(gameSize-0.01));

        if (randomXY == 1) {
            
            while (randomMove == yHole) {

                randomMove = Math.floor(Math.random()*(gameSize-0.01));
            }
            move(xHole,randomMove);
        }
        else {

            while (randomMove == xHole) {

                randomMove = Math.floor(Math.random()*(gameSize-0.01));
            }
            move(randomMove,yHole);
        }        
    }

    if (toggledAnimations == true) {
        doAnimations = true;        
    }
    shuffeling = false;
    render();
}

winCheck = function() {

    hasWon = true;
    for (y = 0; y < gameSize; y++) {
        for (x = 0; x < gameSize; x++) {

            if (x != gameSize-1 || y != gameSize-1) {
                
                if (gameGrid[x][y] != y*gameSize+x+1) {
                    
                    hasWon = false;
                }
            }
        }
    }

    if (hasWon == true) {
        clearInterval(clock);
        clikcable = false;
        alert("win! time: "+time+" moves: "+moves);
        highscores();
    }
}

scaleGame = function(scale) {
    
    gameSize = scale;
    setCookie("15P_gameSize",gameSize,30);
    createGame();
    restart();
}

scaleTiles = function(scale) {

    size = scale;
    restart();
    createGame();
    document.getElementById("restartButton").width = size/2;
    document.getElementById("restartButton").height = size/2;

    document.getElementById("openSettings").width = size/2;
    document.getElementById("openSettings").height = size/2;

    document.getElementById("cookieButton").width = size/2;
    document.getElementById("cookieButton").height = size/2;

    document.getElementById("clock_100").width = 13/50*size;
    document.getElementById("clock_100").height = 46/75*size;
    document.getElementById("clock_10").width = 13/50*size;
    document.getElementById("clock_10").height = 46/75*size;
    document.getElementById("clock_1").width = 13/50*size;
    document.getElementById("clock_1").height = 46/75*size;
    document.getElementById("clock_div_1").width = 13/150*size;
    document.getElementById("clock_div_1").height = 46/75*size;
    document.getElementById("clock_div_2").width = 13/150*size;
    document.getElementById("clock_div_2").height = 46/75*size;
    document.getElementById("clock_div_3").width = 13/150*size;
    document.getElementById("clock_div_3").height = 46/75*size;
    document.getElementById("clock_div_4").width = 13/150*size;
    document.getElementById("clock_div_4").height = 46/75*size;

    document.getElementById("moves_100").width = 13/50*size;
    document.getElementById("moves_100").height = 46/75*size;
    document.getElementById("moves_10").width = 13/50*size;
    document.getElementById("moves_10").height = 46/75*size;
    document.getElementById("moves_1").width = 13/50*size;
    document.getElementById("moves_1").height = 46/75*size;
    document.getElementById("moves_div_1").width = 13/150*size;
    document.getElementById("moves_div_1").height = 46/75*size;
    document.getElementById("moves_div_2").width = 13/150*size;
    document.getElementById("moves_div_2").height = 46/75*size;
    document.getElementById("moves_div_3").width = 13/150*size;
    document.getElementById("moves_div_3").height = 46/75*size;
    document.getElementById("moves_div_4").width = 13/150*size;
    document.getElementById("moves_div_4").height = 46/75*size;

    setCookie("15P_size",size,30);
}

timer = function() {

    time++;

    hundra = Math.floor(time/100);
    tio = Math.floor((time % 100) / 10);
    ett = Math.floor((time % 100) % 10);

    document.getElementById("clock_100").src = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/digits/"+hundra+"-digit.png"; 
    document.getElementById("clock_10").src = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/digits/"+tio+"-digit.png";
    document.getElementById("clock_1").src = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/digits/"+ett+"-digit.png";
}

moveCounter = function() {

    moves++;

    hundra = Math.floor(moves/100);
    tio = Math.floor((moves % 100) / 10);
    ett = Math.floor((moves % 100) % 10);

    document.getElementById("moves_100").src = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/digits/"+hundra+"-digit.png"; 
    document.getElementById("moves_10").src = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/digits/"+tio+"-digit.png";
    document.getElementById("moves_1").src = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/digits/"+ett+"-digit.png";
}

restart = function() {

    createGame();
    clikcable = true;
    moves = -1;
    time = -1;
    firstClick = true;
    xHole = gameSize-1;
    yHole = gameSize-1;
    clearInterval(clock);
}

toggleOption = function(option) {

    if (option == "settings") {

        if (settings == false) {

            
            document.getElementById("settings").style.display = "block";                        
            settings = true;
        }
        else {

            // document.getElementById("gameHolder").style.display = "";
            document.getElementById("settings").style.display = "none";
            // document.getElementById("toggleSettings").src = "https://kyriaelixia.github.io/server/games/minesweeper/sprites/light_mode/buttons/settings.png";
            settings = false;
        }
    }

    if (option == "optionAnimation") {

        if (doAnimations == true) {

            doAnimations = false;
            document.getElementById("optionAnimation").checked = false;
        }
        else {

            doAnimations = true;
            document.getElementById("optionAnimation").checked = true;
        }
        setCookie("15P_doAnimations",doAnimations,30);
    }
}

highscores = function() {


    if (gameSize == 3) {

        time3 = parseInt(checkCookie("15P_time3",time)); 
        moves3 = parseInt(checkCookie("15P_moves3",moves));

        if (time <= time3) {

            setCookie("15P_time3",time,30);
            document.getElementById("time3").innerHTML = time;
        }

        if (moves <= moves3) {

            setCookie("15P_moves3",moves,30);
            document.getElementById("moves3").innerHTML = moves;
        }
    }
    else if (gameSize == 4) {

        time4 = parseInt(checkCookie("15P_time4",time)); 
        moves4 = parseInt(checkCookie("15P_moves4",moves));

        if (time <= time4) {

            setCookie("15P_time4",time,30);
            document.getElementById("time4").innerHTML = time;
        }

        if (moves <= moves4) {
            
            setCookie("15P_moves4",moves,30);
            document.getElementById("moves4").innerHTML = moves;
        }
    }
    else if (gameSize == 5) {

        time5 = parseInt(checkCookie("15P_time5",time)); 
        moves5 = parseInt(checkCookie("15P_moves5",moves));

        if (time <= time5) {
            
            setCookie("15P_time5",time,30);
            document.getElementById("time5").innerHTML = time;
        }

        if (moves <= moves5) {
            
            setCookie("15P_moves5",moves,30);
            document.getElementById("moves5").innerHTML = moves;
        }
    }
    else if (gameSize == 6) {

        time6 = parseInt(checkCookie("15P_time6",time)); 
        moves6 = parseInt(checkCookie("15P_moves6",moves));

        if (time <= time6) {
            
            setCookie("15P_time6",time,30);
            document.getElementById("time6").innerHTML = time;           
        }

        if (moves <= moves6) {
            
            setCookie("15P_moves6",moves,30);
            document.getElementById("moves6").innerHTML = moves;           
        }
    }
}

showCookies = function () {

    alert("This site uses cookies to store the latest settings you've played with so you don't have to set them manually every time you play. No other information outside of the game will ever be saved.");
}

loadCookies = function() {

    gameSize = parseInt(checkCookie("15P_gameSize",4));
    size = parseInt(checkCookie("15P_size",150));

    
    parseInt(checkCookie("15P_time4", 0));
    parseInt(checkCookie("15P_moves4",0));
    parseInt(checkCookie("15P_time5", 0));
    parseInt(checkCookie("15P_moves5",0));
    parseInt(checkCookie("15P_time6", 0));
    parseInt(checkCookie("15P_moves6",0));
    
    doAnimations = checkCookie("15P_doAnimations",true);
    readCookies =  checkCookie("15P_readCookies",false);

    if (doAnimations == "false") {

        doAnimations = false;
    }
    else {

        doAnimations = true;
        document.getElementById("optionAnimation").checked = true;
    }

    if (readCookies != "true") {

        showCookies();
        setCookie("15P_readCookies",true,30);
    }

    document.getElementById("time3").innerHTML = parseInt(checkCookie("15P_time3",0)); 
    document.getElementById("moves3").innerHTML = parseInt(checkCookie("15P_moves3",0));
    document.getElementById("time4").innerHTML = parseInt(checkCookie("15P_time4", 0));
    document.getElementById("moves4").innerHTML = parseInt(checkCookie("15P_moves4",0));
    document.getElementById("time5").innerHTML = parseInt(checkCookie("15P_time5", 0));
    document.getElementById("moves5").innerHTML = parseInt(checkCookie("15P_moves5",0));
    document.getElementById("time6").innerHTML = parseInt(checkCookie("15P_time6", 0));
    document.getElementById("moves6").innerHTML = parseInt(checkCookie("15P_moves6",0));
}

window.onkeydown = function(e) { // disable scroll on spacebar

    if ((e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) && e.target == document.body) {
        
        e.preventDefault();
    }
};

window.onload = function() {

    loadCookies();
    scaleTiles(size);
}