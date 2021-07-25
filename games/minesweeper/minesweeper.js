// TODO:
// - game recording and playback
// - savestate when switching between game and editor / when leaving and reloading page
// - cookie information display
// - statistics (wins, losses, flags placed, bombs marked, incorrectly flagged, fastest wins)
// - how to play / controls explanation
// - separate this file (minesweeper.js) into more files
// - 50/50% detection and exclusion?
// - better shuffle spread
// - inverted mouse controls option
// - different/custom sprite packs option?

width = 16;
height = 16;
mines = 40;
minesLeft = mines;

scale = 40;
time = 0;
timeCounter = 0;
borderWidth = 2;

dark_mode = false;
restartButton_state = "happy";
clickDown = false;
firstClick = true;
maybe = false;
playing = true;
clearing = false;
fastOpening = false;
restartHover = false;
keyDown = false;
flagWarning = true;
freeBorder = false;
peeking = false;
retrying = false;

editing = false;
document.getElementById("toggleEditor").checked = false;

mx = -1;
my = -1;
peek_x = 0;
peek_y = 0;

clearList = [];
recordedGame = [];

grid = new Array(width);
field = new Array(width);
for (i = 0; i < width; i++) {
    grid[i] = new Array(height);
    field[i] = new Array(height);
    for (j = 0; j < height; j++) {
        grid[i][j] = "tile";
        field[i][j] = "tile";
    }
}

compressor = new cmp();

imgSrc = {}
updateImgSrc = function() {

    mode = dark_mode ? "dark_mode" : "light_mode";
    imgSrc = {
        "tile":             "sprites/" + mode + "/tiles/tile.png",
        "0-tile":           "sprites/" + mode + "/tiles/open-tile.png",
        "1-tile":           "sprites/" + mode + "/tiles/1-tile.png",
        "2-tile":           "sprites/" + mode + "/tiles/2-tile.png",
        "3-tile":           "sprites/" + mode + "/tiles/3-tile.png",
        "4-tile":           "sprites/" + mode + "/tiles/4-tile.png",
        "5-tile":           "sprites/" + mode + "/tiles/5-tile.png",
        "6-tile":           "sprites/" + mode + "/tiles/6-tile.png",
        "7-tile":           "sprites/" + mode + "/tiles/7-tile.png",
        "8-tile":           "sprites/" + mode + "/tiles/8-tile.png",
        "error-1":          "sprites/" + mode + "/tiles/error-1.png",
        "error-2":          "sprites/" + mode + "/tiles/error-2.png",
        "error-3":          "sprites/" + mode + "/tiles/error-3.png",
        "error-4":          "sprites/" + mode + "/tiles/error-4.png",
        "error-5":          "sprites/" + mode + "/tiles/error-5.png",
        "error-6":          "sprites/" + mode + "/tiles/error-6.png",
        "error-7":          "sprites/" + mode + "/tiles/error-7.png",
        "error-8":          "sprites/" + mode + "/tiles/error-8.png",
        "bomb":             "sprites/" + mode + "/tiles/bomb.png",
        "not-bomb":         "sprites/" + mode + "/tiles/not-bomb.png",
        "exploded-bomb":    "sprites/" + mode + "/tiles/exploded-bomb.png",
        "flag":             "sprites/" + mode + "/tiles/flag.png",
        "maybe":            "sprites/" + mode + "/tiles/maybe.png",
        "line-v":           "sprites/" + mode + "/frame/line-v.png",
        "line-h":           "sprites/" + mode + "/frame/line-h.png",
        "cross-nes":        "sprites/" + mode + "/frame/cross-nes.png",
        "cross-nsw":        "sprites/" + mode + "/frame/cross-nsw.png",
        "corner-ne":        "sprites/" + mode + "/frame/corner-ne.png",
        "corner-nw":        "sprites/" + mode + "/frame/corner-nw.png",
        "corner-es":        "sprites/" + mode + "/frame/corner-es.png",
        "corner-sw":        "sprites/" + mode + "/frame/corner-sw.png",
        "divider":          "sprites/" + mode + "/digits/digit-divider.png",
        "blank-digit":      "sprites/" + mode + "/digits/blank-digit.png",
        "happy":            "sprites/" + mode + "/buttons/happy.png",
        "dead":             "sprites/" + mode + "/buttons/dead.png",
        "cool":             "sprites/" + mode + "/buttons/cool.png",
        "kiss":             "sprites/" + mode + "/buttons/kiss.png",
        "settings":         "sprites/" + mode + "/buttons/settings.png",
        "retry":            "sprites/" + mode + "/buttons/retry-overlay.png",
        "happy_pushed":     "sprites/" + mode + "/buttons/happy_pushed.png",
        "dead_pushed":      "sprites/" + mode + "/buttons/dead_pushed.png",
        "cool_pushed":      "sprites/" + mode + "/buttons/cool_pushed.png",
        "kiss_pushed":      "sprites/" + mode + "/buttons/kiss_pushed.png",
        "settings_pushed":  "sprites/" + mode + "/buttons/settings_pushed.png"     
    }
}

gameWindow = document.getElementById("game");
gameWindowBar = document.getElementById("game_bar");

createGameGrid = function() {

    updateImgSrc();

    gameDiv = document.createElement("div");
    gameDiv.style.position = "relative";
    gameDiv.id = "gameDiv";

    headerSize = 4;
    xOffset = 1;
    yOffset = 1;
    hOffset = yOffset + headerSize;


    // INNER GAME CONTAINER
    for (h = 0; h < height; h++) {
        for (w = 0; w < width; w++) {
            
            gameDiv.appendChild(createGameTile(w, h, xOffset, hOffset, imgSrc[field[w][h]]));
        }
    }

    // GAME BORDER EDGES
    for (h = 0; h < height; h++) { //vertical
      
        gameDiv.appendChild(createBorderTile(0, h, 0, hOffset, imgSrc["line-v"]));
        gameDiv.appendChild(createBorderTile(width, h, xOffset, hOffset, imgSrc["line-v"]));
    }

    for (w = 0; w < width; w++) { //horisontal
        
        gameDiv.appendChild(createBorderTile(w, 0, xOffset, 0, imgSrc["line-h"]));        
        gameDiv.appendChild(createBorderTile(w, 0, xOffset, hOffset-1, imgSrc["line-h"]));
        gameDiv.appendChild(createBorderTile(w, height, xOffset, hOffset, imgSrc["line-h"]));  
    }

    for (h = 0; h < headerSize-1; h++) {

        gameDiv.appendChild(createBorderTile(0, h, 0, yOffset, imgSrc["line-v"]));
        gameDiv.appendChild(createBorderTile(width, h, xOffset, yOffset, imgSrc["line-v"]));
    }

    // GAME BORDER CORNERS AND CROSSES
    gameDiv.appendChild(createBorderTile(0, 0, 0, hOffset-1, imgSrc["cross-nes"]));
    gameDiv.appendChild(createBorderTile(width, 0, xOffset, hOffset-1, imgSrc["cross-nsw"]));
    gameDiv.appendChild(createBorderTile(0, height, 0, hOffset, imgSrc["corner-ne"]));
    gameDiv.appendChild(createBorderTile(width, height, xOffset, hOffset, imgSrc["corner-nw"]));
    gameDiv.appendChild(createBorderTile(0, 0, 0, 0, imgSrc["corner-es"])); 
    gameDiv.appendChild(createBorderTile(width, 0, xOffset, 0, imgSrc["corner-sw"]));


    //GAME TIMER AND MINE COUNTER
    timerScale = 2/9 * scale;
    // x_diff = (3*scale-13*timerScale)/2;
    x_diff = 0;
    x_diff =(7*scale - 2*13*timerScale)/4

    gameDiv.appendChild(createCounterTile(scale + x_diff, 5/2*scale-7/2*timerScale, "timer", timerScale));
    gameDiv.appendChild(createCounterTile((width-2) * scale + (3*scale-13*timerScale) - x_diff, 5/2*scale-7/2*timerScale, "mines", timerScale));


    //
    gameDiv.appendChild(createRestartButton());
    gameDiv.appendChild(createRetryOverlay());

    
    // RESIZING THE WINDOW
    gameWindow.style.width = (width + 2*xOffset) * scale;
    gameWindow.style.height = (height + 2*yOffset + hOffset-1) * scale + parseInt(gameWindowBar.style.height) + 2*borderWidth; // 30 = window bar height
    gameWindowBar.style.width = (width + 2*xOffset) * scale;
    setGameTitle();
    
    if (dark_mode) {
        gameWindow.style.backgroundColor = "#636363";
        document.body.style.backgroundColor = "#777777";
    } else {
        gameWindow.style.backgroundColor = "#bdbdbd";
        document.body.style.backgroundColor = "#ebebeb";
    }
    
    gameWindow.appendChild(gameDiv);
    
    setTimerDisplay();
    setMinesDisplay();
    gameWindow.style.left = gameWindow_x;
    gameWindow.style.top =  gameWindow_y;
    settingsWindow.style.left = settingsWindow_x;
    settingsWindow.style.top =  settingsWindow_y;
    shareWindow.style.left = shareWindow_x;
    shareWindow.style.top =  shareWindow_y;
    
    
    if (retrying) {
        toggleRetry(true);
    }
}

createGameTile = function(xx, yy, dx, dy, src) {

    tile = document.createElement("div");
    tile.style.userSelect = "none";
    tile.oncontextmenu = function() {return false;};
    tile.style.position = "absolute";
    tile.style.left = (xx + dx) * scale;
    tile.style.top = (yy + dy) * scale;
    tile.style.width = scale;
    tile.style.height = scale;
    tile.id = "gameTile_" + xx + "_" + yy;

    tileImg = document.createElement("img");
    tileImg.style.userSelect = "none";
    tileImg.width = scale;
    tileImg.height = scale;
    tileImg.ondragstart = function() {return false;};
    tileImg.ondrop = function() {return false;};
    tileImg.src = src;
    tileImg.id = "gameTileImg_" + xx + "_" + yy;

    tileImg.onmouseover = function() {
        
        mx = xx; 
        my = yy;
        if (field[mx][my] == "tile" && clickDown && !editing) { 
            document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc["0-tile"]; 
        }
    }
    tileImg.onmouseout = function() {

        if (!peeking) {
            
            document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc[field[mx][my]];
        }
        mx = -1; 
        my = -1; 
    }
    tileImg.onmousedown = function(e) {
        
        if (playing && !editing) {

            if (e.which == 1 && field[mx][my] == "tile") {
    
                clickDown = true;
                document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc["0-tile"]; 
            }
            else if (e.which == 1 && field[mx][my] != "tile" && field[mx][my] != "flag" && field[mx][my] != "maybe" && grid[mx][my] > 0 && grid[mx][my] < 9) {
        
                flagCount(mx, my);

            }
            else if (e.which == 3) {
                
                rightAction(mx, my); 
                recordedGame.push("R_"+ time + "_" + mx + "_" + my);
                console.info("R_"+ time + "_" + mx + "_" + my);
            }
        }
        else if (editing && e.which == 1) {

            if (field[mx][my] != "bomb") {
                // console.log("set bomb", mx, my, grid[mx][my], field[mx][my])
                grid[mx][my] = "bomb";
                field[mx][my] = "bomb";
                minesLeft++;
            }
            else if (field[mx][my] == "bomb") {
                grid[mx][my] = 0;
                field[mx][my] = "0-tile";
                minesLeft--;
                // console.log("del bomb", mx, my, grid[mx][my], field[mx][my])
            }

            // placeNumbers();
            updateTile(mx, my);
            editorFlagNumber(mx, my);
            setMinesDisplay();
            generateLink();
        }
    }
    tileImg.onmouseup = function(e) {
        
        if (playing && !editing) {
            if (e.which == 1) {
                
                leftAction(mx, my);
                
                if (!peeking) {
                    recordedGame.push("L_"+ time + "_" + mx + "_" + my);
                    console.info("L_"+ time + "_" + mx + "_" + my);
                }
                showExportedState();
            }
        }
    }
    
    tile.appendChild(tileImg);
    return tile;
}

createBorderTile = function(xx, yy, dx, dy, src) {

    tile = document.createElement("div");
    tile.style.userSelect = "none";
    tile.oncontextmenu = function() {return false;};
    tile.style.position = "absolute";
    tile.style.left = (xx + dx) * scale;
    tile.style.top = (yy + dy) * scale;
    tile.style.width = scale;
    tile.style.height = scale;
    tile.id = "borderTile_" + xx + "_" + yy;

    tileImg = document.createElement("img");
    tileImg.style.userSelect = "none";
    tileImg.width = scale;
    tileImg.height = scale;
    tileImg.ondragstart = function() {return false;};
    tileImg.ondrop = function() {return false;};
    tileImg.src = src;
    tileImg.id = "borderTileImg_" + xx + "_" + yy;

    tile.appendChild(tileImg);
    
    return tile;
}

createCounterTile = function(xx, yy, id, counterScale) {

    counter = document.createElement("div");
    counter.id = id + "Div";
    counter.style.position = "absolute";
    counter.style.left = xx;
    counter.style.top = yy;
    counter.style.backgroundColor =  dark_mode ? "#1c0201" : "#3d0603";
    counter.style.width = 13 * counterScale; //3*3 + 4

    for (i = 0; i < 3; i++) {

        divider = document.createElement("img");
        divider.src = imgSrc["divider"];
        divider.width = counterScale;
        divider.style.userSelect = "none";
        divider.oncontextmenu = function() {return false;};
        divider.ondragstart = function() {return false;};
        divider.ondrop = function() {return false;};

        counter.appendChild(divider);

        number = document.createElement("img");
        number.src = imgSrc["blank-digit"];
        number.width = 3 * counterScale;
        number.id = id + i;
        number.style.userSelect = "none";
        number.oncontextmenu = function() {return false;};
        number.ondragstart = function() {return false;};
        number.ondrop = function() {return false;};

        counter.appendChild(number);
    }

    divider = document.createElement("img");
    divider.src = imgSrc["divider"];
    divider.width = counterScale;
    divider.style.userSelect = "none";
    divider.oncontextmenu = function() {return false;};
    divider.ondragstart = function() {return false;};
    divider.ondrop = function() {return false;};

    counter.appendChild(divider);

    return counter;
}

createRestartButton = function() {

    restartButton = document.createElement("img");
    restartButton.style.userSelect = "none";
    restartButton.oncontextmenu = function() {return false;};
    restartButton.ondragstart = function() {return false;};
    restartButton.ondrop = function() {return false;};

    restartButton.onclick = function() { restart(); }
    restartButton.id = "restartButton";
    restartButton.style.width = 2 * scale;
    restartButton.style.left = width * scale/2; //- scale;
    restartButton.style.position = "absolute";
    restartButton.style.top = scale * 3/2;
    restartButton.style.cursor = "pointer";
    restartButton.src = imgSrc[restartButton_state];
    restartButton.title = "Start a new game";

    restartButton.onmousedown = function(e) { if (e.which == 1) { restartButton.src = imgSrc[restartButton_state + "_pushed"]; restartHover = true; }}
    restartButton.onmouseup = function() { restartButton.src = imgSrc[restartButton_state]; }
    restartButton.onmouseleave = function() { restartButton.src = imgSrc[restartButton_state]; }
    restartButton.onmouseover = function() { if (restartHover) { restartButton.src = imgSrc[restartButton_state + "_pushed"]; }}

    return restartButton;
}

createRetryOverlay = function() {

    retryOverlay = document.createElement("img");
    retryOverlay.style.pointerEvents = "none";
    retryOverlay.style.display = "none";
    retryOverlay.id = "retry-overlay";
    retryOverlay.style.width = 2 * scale;
    retryOverlay.style.left = width * scale/2; //- scale;
    retryOverlay.style.position = "absolute";
    retryOverlay.style.top = scale * 3/2;
    retryOverlay.src = imgSrc["retry"];

    return retryOverlay;
}

setGameTitle = function() {

    if (editing && false) {
        
    }
    else {
        
        document.getElementById("gameTitle").style.left = parseInt(gameWindow.style.width)/2 - document.getElementById("gameTitle").offsetWidth/2;
    }
}

resizeGrid = function(onlySized = false) {

    if (document.getElementById("diffBeginner").checked) {

        width = 9; height = 9; mines = 10;
        setCookie("MS5_difficulty", "Beginner", 30);
    }
    else if (document.getElementById("diffIntermediate").checked) {
        
        width = 16; height = 16; mines = 40;
        setCookie("MS5_difficulty", "Intermediate", 30);
    }
    else if (document.getElementById("diffExpert").checked) {
        
        width = 30; height = 16; mines = 99;
        setCookie("MS5_difficulty", "Expert", 30);
    }
    else if (document.getElementById("diffCustom").checked) {
        
        setCookie("MS5_difficulty", "Custom", 30);

        cwe = document.getElementById("customWidth");
        che = document.getElementById("customHeight");
        cme = document.getElementById("customMines");

        ww =  cwe.value.length == 0 ? 9 : parseInt(cwe.value);
        hh =  che.value.length == 0 ? 9 : parseInt(che.value);
        mm =  cme.value.length == 0 ? 10 : parseInt(cme.value);

        width = ww < 9 ? 9 : ww;
        height = hh < 9 ? 9 : hh;
        mines = mm < 1 ? 1 : mm;
        mines = mines >= ww * hh ? ww * hh - 9 : mines;
        
        document.getElementById("customWidth").value = width;
        document.getElementById("customHeight").value = height;
        document.getElementById("customMines").value = mines;
    }

    
    
    if (!onlySized) {
        grid = new Array(width);
        field = new Array(width);
        for (i = 0; i < width; i++) {
            grid[i] = new Array(height);
            field[i] = new Array(height);
            for (j = 0; j < height; j++) {
                
                if (editing) {

                    grid[i][j] = 0;
                    field[i][j] = "0-tile";
                }
                else {
                    grid[i][j] = "tile";
                    field[i][j] = "tile";
                }
            }
        }
    }
    retrying = true;
    toggleRetry();
    firstClick = true;
    playing = true;
    minesLeft = editing ? 0 : mines;
    time = 0;
    clearInterval(timeCounter);
    setTimerDisplay();
    setMinesDisplay();
    updateSmiley("happy");
    reRender();
    document.getElementById("shareURL").value = "";
    document.getElementById("shareState").value = "";
    
    showExportedState();
    setGameTitle();
}

openPeek = function(px, py) {

    for (y = -1; y <= 1; y++) {
        for (x = -1; x <= 1; x++) {

            xx = px + x;
            yy = py + y;
            if ((x != 0 || y != 0) && xx >= 0 && xx < width && yy >= 0 && yy < height) {
                
                if (field[xx][yy] == "tile") {

                    setTileImg(xx, yy, imgSrc["0-tile"]);
                }
            }
        }
    }
    peek_x = px;
    peek_y = py;
    peeking = true;
}

closePeek = function(px, py) {

    peeking = false;
    for (y = -1; y <= 1; y++) {
        for (x = -1; x <= 1; x++) {

            xx = px + x;
            yy = py + y;
            if ((x != 0 || y != 0) && xx >= 0 && xx < width && yy >= 0 && yy < height) {
                
                updateTile(xx, yy);
            }
        }
    }
}

fastOpen = function(fx, fy) {

    fastOpening = true;
    for (y = -1; y <= 1; y++) {
        for (x = -1; x <= 1; x++) {

            xx = fx + x;
            yy = fy + y;
            if ((x != 0 || y != 0) && xx >= 0 && xx < width && yy >= 0 && yy < height) {
                
                leftAction(xx, yy);
            }
        }
    }
    fastOpening = false;
}

clearOpenTiles = function() {

    cl = clearList.pop();
    cx = cl[0];
    cy = cl[1];
    clearing = true;

    for (y = -1; y <= 1; y++) {
        for (x = -1; x <= 1; x++) {
            if ((x != 0 || y != 0) && (cx + x) >= 0 && (cx + x) < width && (cy + y) >= 0 && (cy + y) < height) {
                
                leftAction(cx + x, cy + y);
            }
        }
    }

    if (clearList.length > 0) {

        clearOpenTiles();
    } else {

        clearing = false;
    }
}

editorFlagNumber = function(FX, FY) {

    for (Y = -1; Y <= 1; Y++) {
        for (X = -1; X <= 1; X++) {

            XX = FX + X;
            YY = FY + Y;
            if (XX >= 0 && XX < width && YY >= 0 && YY < height) {

                
                if (field[XX][YY] != "bomb") {
                    count = 0;
                    
                    for (y = -1; y <= 1; y++) {
                        for (x = -1; x <= 1; x++) {
                            xx = XX + x;
                            yy = YY + y;
                            if ((x != 0 || y != 0) && xx >= 0 && xx < width && yy >= 0 && yy < height) {
                                if (field[xx][yy] == "bomb") {
                                    
                                    count++;
                                }
                            }
                        }
                    }
                    grid[XX][YY] = count;
                    field[XX][YY] = count + "-tile";
                    console.log(XX,YY)
                    updateTile(XX, YY);
                }
            }
        }
    }
}

flagCount = function(fx, fy, doPeek = true) {

    count = 0;
    
    for (y = -1; y <= 1; y++) {
        for (x = -1; x <= 1; x++) {
            xx = fx + x;
            yy = fy + y;
            if ((x != 0 || y != 0) && xx >= 0 && xx < width && yy >= 0 && yy < height) {
                if (field[xx][yy] == "flag") {

                    count++;
                }
            }
        }
    }

    if (count == grid[fx][fy]) {
        
        fastOpen(fx, fy);
        recordedGame.push("L_"+ time + "_" + fx + "_" + fy);
        console.info("L_"+ time + "_" + fx + "_" + fy);
    } 
    else if (doPeek) {

        openPeek(fx, fy);
        recordedGame.push("P_"+ time + "_" + fx + "_" + fy);
        console.info("P_"+ time + "_" + fx + "_" + fy);
    }
}

reRender = function() {

    gameWindow.removeChild(document.getElementById("gameDiv"))
    createGameGrid();
}

updateSmiley = function(state) {

    restartButton_state = state;
    document.getElementById("restartButton").src = imgSrc[restartButton_state];
}

updateTile = function(ux, uy) {

    document.getElementById("gameTileImg_" + ux + "_" + uy).src = imgSrc[field[ux][uy]];
}

setTileImg = function(ix, iy, img) {

    document.getElementById("gameTileImg_" + ix + "_" + iy).src = img 
}

leftAction = function(ax, ay) {

    if (firstClick && clickDown) {

        firstClick = false;
        timeCounter = setInterval(clock, 1000);

        if (!retrying) {
            shuffle(ax, ay);
        }
        generateLink();
    }

    if (field[ax][ay] == "tile" && (clickDown || fastOpening)) {
        if (grid[ax][ay] != "bomb") {

            field[ax][ay] = grid[ax][ay] + "-tile";

            if (grid[ax][ay] == 0) {

                clearList.push([ax, ay]);
                // console.log("cl len", clearList.length);
                if (clearList.length == 1 && !clearing) {

                    clearOpenTiles();
                }
            }
        } else {

            field[ax][ay] = "exploded-" + grid[ax][ay];
            gameOver();
        }
    }
    // else if (grid[ax][ay] > 0 && field[ax][ay] != "tile" && !fastOpening && !clearing) {
        
        
        // }
        
    updateTile(ax, ay);
    setMinesDisplay();
    checkWinCondition();
} 

rightAction = function(ax, ay) {
    
    // console.log("right", ax, ay);

    if (field[ax][ay] == "tile") {

        field[ax][ay] = "flag";
        minesLeft--;
    }
    else if (maybe && field[ax][ay] == "flag") {

        field[ax][ay] = "maybe";
        minesLeft++;
    } 
    else if (field[ax][ay] == "flag" || field[ax][ay] == "maybe"){
        
        if (!maybe && field[ax][ay] != "maybe") {
            minesLeft++;
        }
        field[ax][ay] = "tile";
    }
    updateTile(ax, ay);
    setMinesDisplay();
    checkWinCondition();

    if (flagWarning) {

        checkFlagWarning(ax ,ay);
    }
    showExportedState();
}

spaceAction = function(ax, ay) {

    // console.log("space", ax, ay);
    if (ax >= 0 && ax < width && ay >= 0 && ay < height) {

        if (field[ax][ay] == "tile" || field[ax][ay] == "flag" || field[ax][ay] == "maybe") {
            
            rightAction(ax, ay);
        }
        else if (grid[ax][ay] > 0 && grid[ax][ay] < 9) {
            
            flagCount(ax, ay, false);
        }
        checkWinCondition();
    }
}

checkFlagWarning = function(cx, cy) {

    for (y = -1; y <= 1; y++) {
        for (x = -1; x <= 1; x++) {
            xx = cx + x;
            yy = cy + y;
            if ((x != 0 || y != 0) && xx >= 0 && xx < width && yy >= 0 && yy < height) {
                if (field[xx][yy] != "flag" && field[xx][yy] != "tile" && field[xx][yy] != "maybe" && field[xx][yy] != "0-tile") {

                    count = 0;
                    for (i = -1; i <= 1; i++) {
                        for (j = -1; j <= 1; j++) { 
                            
                            ii = xx + i;
                            jj = yy + j;
                            if ((i != 0 || j != 0) && ii >= 0 && ii < width && jj >= 0 && jj < height) {
                                if (field[ii][jj] == "flag") {

                                    count++;
                                }
                            }
                        }
                    }
                    if (grid[xx][yy] < count) {

                        field[xx][yy] = "error-" + grid[xx][yy];
                    }
                    else {
                        
                        field[xx][yy] = grid[xx][yy] + "-tile";
                    }
                    updateTile(xx, yy);
                }
            }
        }
    }
}

gameOver = function() {

    // console.error("game over");
    playing = false;
    clearInterval(timeCounter);
    updateSmiley("dead");

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {

            if (grid[x][y] == "bomb" && field[x][y] != "exploded-bomb" && field[x][y] != "flag") {

                field[x][y] = grid[x][y];  
            }
            else if (field[x][y] == "flag" && grid[x][y] != "bomb") {

                field[x][y] = "not-bomb";
            }
            updateTile(x, y);
        }
    }
}

wonGame = function() {

    // console.warn("WIN");
    clearInterval(timeCounter);
    playing = false;

    if (Math.random()*100 < 5) {

        updateSmiley("kiss");
    } else {

        updateSmiley("cool");
    }
}

toggleDarkMode = function(modeSelect = "light", doRerender = true) {

    if (dark_mode && modeSelect == "light") {

        dark_mode = false;
 
        document.getElementById("settings").style.backgroundColor = "#ebebeb";
        document.getElementById("share").style.backgroundColor = "#ebebeb";
        document.body.style.color = "black";
    } else {
        
        dark_mode = true;
    
        document.getElementById("settings").style.backgroundColor = "#777777";
        document.getElementById("share").style.backgroundColor = "#777777";
        document.body.style.color = "#cfcfcf";
    }

    updateImgSrc();
    mode = dark_mode ? "_dark" : "";
    document.getElementById("game").className = "window" + mode;
    document.getElementById("game_bar").className = "window_bar" + mode;
    document.getElementById("settings").className = "window" + mode;
    document.getElementById("settings_bar").className = "window_bar" + mode;
    document.getElementById("settings_button_1").className = "customButton" + mode;
    document.getElementById("settings_button_2").className = "customButton" + mode;
    document.getElementById("share").className = "window" + mode;
    document.getElementById("share_bar").className = "window_bar" + mode;
    document.getElementById("share_button_1").className = "customButton" + mode;
    document.getElementById("share_button_2").className = "customButton" + mode;
    document.getElementById("scaleSlider").className = "slider" + mode;
    document.getElementById("gameTitle").className = "title" + mode;
    document.getElementById("settingsTitle").className = "title" + mode;
    document.getElementById("shareTitle").className = "title" + mode;
    document.getElementById("customWidth").className = "io" + mode;
    document.getElementById("customHeight").className = "io" + mode;
    document.getElementById("customMines").className = "io" + mode;
    document.getElementById("shareURL").className = "io" + mode;
    document.getElementById("shareState").className = "io" + mode;
    document.getElementById("cookie_disclaimer").className = "cookie" + mode;
    
    buttons = document.getElementsByTagName("button");
    for (b = 0; b < buttons.length; b++) {
        
        buttons[b].className = "toggleButton" + mode;
    }

    setCookie("MS5_dark_mode", dark_mode, 30);
    document.getElementById('toggleLightsCheck').checked = !dark_mode;
    
    if (doRerender) {
        
        reRender();
    }
}

toggleMaybe = function(start = false) {

    if (maybe && !start) {

        maybe = false;
    } else {
        maybe = true;
    }
    setCookie("MS5_maybe", maybe, 30);
    document.getElementById('toggleMaybeCheck').checked = maybe;
}

toggleFlagWarning = function(start = false) {

    if (flagWarning && !start) {

        flagWarning = false;

        for (ty = 0; ty < height; ty++) {
            for (tx = 0; tx < width; tx++) {
                
                if (field[tx][ty].split("-")[0] == "error") {

                    field[tx][ty] = grid[tx][ty] + "-tile";
                    updateTile(tx, ty);
                }
            }
        }
    } 
    else if (!start) {

        flagWarning = true;

        for (ty = 0; ty < height; ty++) {
            for (tx = 0; tx < width; tx++) {
                
                if (field[tx][ty] == "flag") {
                    checkFlagWarning(tx, ty);
                }
            }
        }
    }
    setCookie("MS5_flagWarning", flagWarning, 30);
    document.getElementById('toggleFlagWarningCheck').checked = flagWarning;
}

toggleFreeBorder = function(start = false) {

    if (freeBorder && !start) {

        freeBorder = false;
    } else {
        freeBorder = true;
    }
    setCookie("MS5_freeBorder", freeBorder, 30);
    document.getElementById('toggleFreeBorderCheck').checked = freeBorder;
}

toggleRetry = function(start = false) {

    if (retrying && !start) {
        retrying = false;
        document.getElementById("retry-overlay").style.display = "none";
        document.getElementById("restartButton").onclick = function() { restart(); }
        document.getElementById("retryButton").disabled = true;
    }
    else {
        retrying = true;
        document.getElementById("retry-overlay").style.display = "";
        document.getElementById("restartButton").onclick = function() { retry(); }
        document.getElementById("retryButton").disabled = false;
    }
}

toggleEditor = function() {

    if (editing) {

        editing = false;
        playing = true;
        document.getElementById("gameTitle").innerHTML = "Minesweeper";
        restart();
    }
    else {
        
        editing = true;
        playing = false;
        retrying = true;
        toggleRetry();
        restart();
        document.getElementById("gameTitle").innerHTML = "Minesweeper Editor";
        document.getElementById("shareState").value = "";
        
        resizeGrid();
        setMinesDisplay();

        for (Y = 0; Y < height; Y++) {
            for (X = 0; X < width; X++) {

                grid[X][Y] = 0;
                field[X][Y] = "0-tile";
            }
        }
    }

    reRender();
    document.getElementById("toggleEditor").checked = editing;
}

loadCookies = function() {

    gameWindow_x = parseInt(checkCookie("MS5_game_x", gameWindow_x));
    gameWindow_y = parseInt(checkCookie("MS5_game_y", gameWindow_y));
    settingsWindow_x = parseInt(checkCookie("MS5_settings_x", settingsWindow_x));
    settingsWindow_y = parseInt(checkCookie("MS5_settings_y", settingsWindow_y));
    settingsWindow.style.zIndex = parseInt(checkCookie("MS5_settings_z", 2));
    shareWindow_x = parseInt(checkCookie("MS5_share_x", shareWindow_x));
    shareWindow_y = parseInt(checkCookie("MS5_share_y", shareWindow_y));
    shareWindow.style.zIndex = parseInt(checkCookie("MS5_share_z", 1));
    

    dark_mode = checkCookie("MS5_dark_mode", "" + dark_mode) == "true" ? true : false;
    maybe = checkCookie("MS5_maybe", "" + maybe) == "true" ? true : false;
    flagWarning = checkCookie("MS5_flagWarning", "" + flagWarning) == "true" ? true : false;
    freeBorder = checkCookie("MS5_freeBorder", "" + freeBorder) == "true" ? true : false;
    displaySettings = checkCookie("MS5_displaySettings", "" + displaySettings) == "true" ? true : false;
    displayShare = checkCookie("MS5_displayShare", "" + displayShare) == "true" ? true : false;
    
    scaleCookie = parseInt(checkCookie("MS5_scale"));
    scale = scaleCookie > 20 ? scaleCookie : scale;
    document.getElementById("scaleValue").innerHTML = scale + "px scale";
    document.getElementById("scaleSlider").value = scale;
    
    document.getElementById("diff" + checkCookie("MS5_difficulty", "Intermediate")).checked = true;


    showedCookies = checkCookie("MS5_showedCookies", "false") == "true" ? true : false;
    if (!showedCookies) {

        cd = document.getElementById("cookie_disclaimer");
        cd.style.display = "";
        cd.style.left = (document.body.clientWidth - cd.offsetWidth)/2;
    }
}

closeCookies = function() {

    document.getElementById('cookie_disclaimer').style.display = "none";
    setCookie("MS5_showedCookies", true, 30);
}

setSettings = function() {

    if (dark_mode) {
        toggleDarkMode("dark", false);
    } 
    if (maybe) {
        toggleMaybe(true);
    }
    if (flagWarning) {
        toggleFlagWarning(true);
    }
    if (freeBorder) {
        toggleFreeBorder(true);
    }
    if (displaySettings) {
        displaySettings = false;
        settingsToggle();
    }
    if (displayShare) {
        displayShare = false;
        shareToggle();
    }


    document.getElementById('toggleLightsCheck').checked = !dark_mode;
    document.getElementById('toggleMaybeCheck').checked = maybe;
    document.getElementById('toggleFlagWarningCheck').checked = flagWarning;
    document.getElementById('toggleFreeBorderCheck').checked = freeBorder;
}

loadGameFromURL = function() {

    URLgame = window.location.href.split("?")
    cookieGame = checkCookie("MS5_lastGameState", "");

    if (URLgame.length > 1) {
        
        // console.warn("loading game from url", URLgame[1]);
        importGrid(URLgame[1]);
        generateLink();
    }
    else if (cookieGame.length != 0) {
        
        console.error(cookieGame)
        importGrid(cookieGame);
    }
}

generateLink = function() {

    document.getElementById("shareURL").value = window.location.href.split("?")[0] + "?" + exportGrid();
    showExportedState();
}

setTimerDisplay = function() {

    hundred = Math.floor(time / 100);
    ten = Math.floor((time % 100) / 10);
    one = Math.floor((time % 100) % 10);

    mode_path = dark_mode ? "dark_mode" : "light_mode";

    if (time > 999) {

        document.getElementById("timer0").src = "sprites/" + mode_path + "/digits/9-digit.png";
        document.getElementById("timer1").src = "sprites/" + mode_path + "/digits/9-digit.png";
        document.getElementById("timer2").src = "sprites/" + mode_path + "/digits/9-digit.png";
    } else {
        
        document.getElementById("timer0").src = "sprites/" + mode_path + "/digits/" + hundred + "-digit.png";
        document.getElementById("timer1").src = "sprites/" + mode_path + "/digits/" + ten + "-digit.png";
        document.getElementById("timer2").src = "sprites/" + mode_path + "/digits/" + one + "-digit.png";
    }
}

setMinesDisplay = function() {

    minesLeftDisplay = Math.abs(minesLeft);

    hundred = Math.floor(minesLeftDisplay/100);
    ten = Math.floor((minesLeftDisplay % 100) / 10);
    one = Math.floor((minesLeftDisplay % 100) % 10);

    mode_path = dark_mode ? "dark_mode" : "light_mode";

    if (minesLeft >= 0) {        

        document.getElementById("mines0").src = "sprites/" + mode_path + "/digits/" + hundred + "-digit.png";
    }
    else {

        document.getElementById("mines0").src = "sprites/" + mode_path + "/digits/digit-negative.png";
    }

    document.getElementById("mines1").src = "sprites/" + mode_path + "/digits/" + ten + "-digit.png";
    document.getElementById("mines2").src = "sprites/" + mode_path + "/digits/" + one + "-digit.png";
}

shuffle = function(xx, yy) {

    // console.warn("shuffle", xx, yy);
    placeMines = mines;
    startpos = freeBorder ? 1 : 0;
    xend = freeBorder ? width - 1 : width
    yend = freeBorder ? height - 1 : height

    while (placeMines > 0) {
        for (y = startpos; y < yend; y++) {
            for (x = startpos; x < xend; x++) {

                place = Math.floor(Math.random()*100);
                
                if (place < 5 && (Math.abs(xx - x) > 1 || Math.abs(yy - y) > 1) && placeMines > 0 && grid[x][y] != "bomb") {
                // if (place < 5 && (x != xx || y != yy) && placeMines > 0 && grid[x][y] != "bomb") {
                    grid[x][y] = "bomb";
                    placeMines--;
                }
            }
        }
    }
    document.getElementById("retryButton").disabled = false;
    placeNumbers();
}

placeNumbers = function() {

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {

            if (grid[x][y] != "bomb") {

                bombCount = 0;
                if (x - 1 >= 0)                      { if (grid[x - 1][y]     == "bomb") { bombCount++; } }
                if (x + 1 < width)                   { if (grid[x + 1][y]     == "bomb") { bombCount++; } }
                if (y - 1 >= 0)                      { if (grid[x][y - 1]     == "bomb") { bombCount++; } }
                if (y + 1 < height)                  { if (grid[x][y + 1]     == "bomb") { bombCount++; } }
                if (x - 1 >= 0    && y - 1 >= 0)     { if (grid[x - 1][y - 1] == "bomb") { bombCount++; } }
                if (x - 1 >= 0    && y + 1 < height) { if (grid[x - 1][y + 1] == "bomb") { bombCount++; } }
                if (x + 1 < width && y - 1 >= 0)     { if (grid[x + 1][y - 1] == "bomb") { bombCount++; } }
                if (x + 1 < width && y + 1 < height) { if (grid[x + 1][y + 1] == "bomb") { bombCount++; } }

                grid[x][y] = bombCount;
            }

            if (editing) {
                updateTile(x, y);
            }
        }
    }
}

restart = function() {

    if (editing) {

        for (i = 0; i < width; i++) {
            for (j = 0; j < height; j++) {
                
                grid[i][j] = 0;
                field[i][j] = "0-tile";
                updateTile(i, j);
            }
        }
        minesLeft = 0;
        setMinesDisplay();
    }
    else {
        
        // console.warn("restart");
        clearInterval(timeCounter);
    
        for (i = 0; i < width; i++) {
            for (j = 0; j < height; j++) {
    
                grid[i][j] = "tile";
                field[i][j] = "tile";
                updateTile(i, j);
            }
        }
        
        recordedGame = [];
        retrying = true;
        toggleRetry();
        document.getElementById("retryButton").disabled = true;
        firstClick = true;
        playing = true;
        time = 0;
        minesLeft = mines;
        setTimerDisplay();
        setMinesDisplay();
        updateSmiley("happy");
        document.getElementById("shareURL").value = "";
        document.getElementById("shareState").value = "";
        showExportedState();
    }
}

retry = function() {

    clearInterval(timeCounter);

    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {

            field[i][j] = "tile";
            updateTile(i, j);
        }
    }

    recordedGame = [];
    firstClick = true;
    playing = true;
    time = 0;
    minesLeft = mines;

    retrying = false;
    toggleRetry();

    setTimerDisplay();
    setMinesDisplay();
    updateSmiley("happy");
}

checkWinCondition = function() {

    if (minesLeft == 0 && playing) {
        win = true;
        for (j = 0; j < height; j++) {
            for (i = 0; i < width; i++) {
                if ((field[i][j] == "flag" && grid[i][j] != "bomb") || field[i][j] == "tile") {
                    win = false;
                    return false;
                }
            }
        }
        // WIN 
        wonGame(); 
        return true; 
    }
    return false;
}

copyGameURL = function() {

    document.getElementById("shareURL").select();
    document.execCommand("copy");
    document.getElementById("shareURLbtn").innerHTML = "Link copied!";
}

copyGameStateURL = function() {

    document.getElementById("shareState").select();
    document.execCommand("copy");
    document.getElementById("shareStateBtn").innerHTML = "Link copied!";
}

main = function() {
    
    referenceScale = parseInt(document.getElementById("scaleSlider").value);
    if (scale != referenceScale) {

        scale = referenceScale;
        document.getElementById("scaleValue").innerHTML = scale + "px scale";
        setCookie("MS5_scale", scale, 30);
        reRender();
    }
}

clock = function() {

    time++;
    setTimerDisplay();    
}

importGrid = function(importCode) {

    split = importCode.split("-");
    w = parseInt(radix.convert(split[0], 36, 10));
    // console.warn(w, split);
    for (r = 5; r > 0; r--) {
        if (w % r == 0) {
            break;
        }
    }

    code = compressor.uncompress(split[1], r, 1);
    
    mineCount = 0;
    for (i = 0; i < code.length; i++) {
        if (code[i] == "1") { mineCount++; }
    }

    document.getElementById("customWidth").value = w;
    document.getElementById("customHeight").value = code.length/w;
    document.getElementById("customMines").value = mineCount;
    document.getElementById("diffCustom").checked = true;

    resizeGrid();

    for (i = 0; i < code.length; i++) {
        
        x = i % w;
        y = Math.floor(i/w);
        
        grid[x][y] = code[i] == "1" ? "bomb" : "tile";
    }
    
    placeNumbers();
    toggleRetry(true);
    retry();
    
    if (split.length == 3) {
        importState(split[2]);
    }
    else if (split.length == 4) {
        
        importState(split[2], split[3]);
    }
    setGameTitle();
}

exportGrid = function() {

    for (r = 5; r > 0; r--) {

        if (width % r == 0) {
            break;
        }
    }
    
    toCmp = "";
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {

            toCmp += grid[x][y] == "bomb" ? 1 : 0;
        }
    }

    toExp = radix.convert(width, 10, 36) + "-" + compressor.compress(toCmp, 1, r);
    // console.warn("cmp", compressor.uncompress(toExp,1,r))
    return toExp;
}

exportState = function() {

    for (q = 2; q > 0; q--) {
        
        if (width % q == 0) {
            break;
        }
    }
    
    cmpState = "";
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            
            switch(field[x][y]) {

                case "0-tile":
                case "1-tile":
                case "2-tile":
                case "3-tile":
                case "4-tile":
                case "5-tile":
                case "6-tile":
                case "7-tile":
                case "8-tile":
                    cmpState += "0";
                break;
                case "tile":
                case "bomb":
                case "exploded-bomb":
                        cmpState += "1";
                break;
                case "flag":
                case "not-bomb":
                    cmpState += "2";
                break;
                case "maybe":
                    cmpState += "3";
                break;
            }
        }
    }
    exState = compressor.compress(cmpState, 2, 2*q)
    // console.warn(q, cmpState)
    // console.warn(cmpState, "//cmpState");
    // console.error(2, 2*q,compressor.radixCompress(cmpState,2,4))
    // console.warn(exState, "//exState");
    // console.error(compressor.radixUncompress(compressor.radixCompress(cmpState,2,2*q),2*q,2));
    toExp = document.getElementById("shareURL").value + "-" + exState + "-" + radix.convert(time, 10, 36);
    return toExp;
}

importState = function(state_str, time_str = 0) {

    for (q = 2; q > 0; q--) {
        
        if (width % q == 0) {
            break;
        }
    }
    
    impState = compressor.uncompress(state_str, 2*q, 2);
    time = radix.convert(time_str, 36, 10);
    console.warn(impState, "time", time);
    for (i = 0; i < impState.length; i++) {

        x = i % width;
        y = Math.floor(i/width);

        if (impState[i] == "0") {

            field[x][y] = grid[x][y] + "-tile";
        }
        else if (impState[i] == "2") {
            
            field[x][y] = "flag";
            minesLeft--;
        }
        else if (impState[i] == "3") {
            
            field[x][y] = "maybe";
        }
        updateTile(x,y);
    }

    setMinesDisplay();
    setTimerDisplay();

    if (firstClick && !checkWinCondition()) {

        firstClick = false;
        timeCounter = setInterval(clock, 1000);

        generateLink();
    }
}

showExportedState = function() {

    if (displayShare && document.getElementById("shareURL").value != "") {
            
        if (editing) {
            
            document.getElementById("shareState").value = "";
        }
        else {

            document.getElementById("shareState").value = exportState();
        }
    }
}

UPS = 1000/60;
setInterval(main, UPS);


