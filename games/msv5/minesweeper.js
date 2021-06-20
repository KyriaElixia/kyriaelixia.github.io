
width = 16;
height = 16;
mines = 40;
minesLeft = mines;

scale = 40;

borderWidth = 2;

dark_mode = true;
restartButton_state = "happy";
clickDown = false;
firstClick = true;
maybe = false;
playing = true;
clearing = false;
fastOpening = false;
restartHover = false;


mx = -1;
my = -1;

clearList = [];

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
        "happy_pushed":     "sprites/" + mode + "/buttons/happy_pushed.png",
        "dead_pushed":      "sprites/" + mode + "/buttons/dead_pushed.png",
        "cool_pushed":      "sprites/" + mode + "/buttons/cool_pushed.png",
        "kiss_pushed":      "sprites/" + mode + "/buttons/kiss_pushed.png",
        "settings_pushed":  "sprites/" + mode + "/buttons/settings_pushed.png"     
    }
}

gameWindow = document.getElementById("game0");
gameWindowBar = document.getElementById("game0_bar");

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


    // RESIZING THE WINDOW
    gameWindow.style.width = (width + 2*xOffset) * scale;
    gameWindow.style.height = (height + 2*yOffset + hOffset-1) * scale + parseInt(gameWindowBar.style.height) + 2*borderWidth; // 30 = window bar height
    gameWindowBar.style.width = (width + 2*xOffset) * scale;

    if (dark_mode) {
        gameWindow.style.backgroundColor = "#636363";
        document.body.style.backgroundColor = "#777777";
    } else {
        gameWindow.style.backgroundColor = "#bdbdbd";
        document.body.style.backgroundColor = "#ebebeb";
    }

    gameWindow.appendChild(gameDiv);

    if (dark_mode) {

        toggleDarkMode("dark", false);
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
        if (field[mx][my] == "tile" && clickDown) { 
            document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc["0-tile"]; 
        }
    }
    tileImg.onmouseout = function() {

        document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc[field[mx][my]];
        mx = -1; 
        my = -1; 
    }
    tileImg.onmousedown = function(e) {
        
        if (playing) {

            if (e.which == 1 && field[mx][my] == "tile") {
    
                clickDown = true;
                document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc["0-tile"]; 
            }
            else if (e.which == 3) {
    
                rightAction(mx, my); 
            }
        }
    }
    tileImg.onmouseup = function(e) {

        if (playing) {
            if (e.which == 1) {
    
                leftAction(mx, my);
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
    restartButton.src = imgSrc[restartButton_state];

    restartButton.onmousedown = function() { restartButton.src = imgSrc[restartButton_state + "_pushed"]; restartHover = true;}
    restartButton.onmouseup = function() { restartButton.src = imgSrc[restartButton_state]; }
    restartButton.onmouseleave = function() { restartButton.src = imgSrc[restartButton_state]; }
    restartButton.onmouseover = function() { if (restartHover) { restartButton.src = imgSrc[restartButton_state + "_pushed"]; }}

    return restartButton;
}

resizeGrid = function(ww, hh, mm) {

    width = ww;
    height = hh;
    mines = mm;

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

    firstClick = true;
    playing = true;

    reRender();
}

resizeGridCustom = function() {

    ww = parseInt(document.getElementById("customWidth").value);
    hh = parseInt(document.getElementById("customHeight").value);
    mm = parseInt(document.getElementById("customMines").value);

    ww = ww < 9 ? 9 : ww;
    hh = hh < 9 ? 9 : hh;
    mm = mm < 1 ? 1 : mm;
    
    document.getElementById("customWidth").value = ww;
    document.getElementById("customHeight").value = hh;
    document.getElementById("customMines").value = mm;

    resizeGrid(ww,hh,mm);
}

openPeek = function(xx, yy) {

}

closePeek = function() {

}

openTile = function() {


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

fastOpen = function(fx, fy) {

    fastOpening = true;
    flagCount = 0;
    
    for (y = -1; y <= 1; y++) {
        for (x = -1; x <= 1; x++) {
            if ((x != 0 || y != 0) && (fx + x) >= 0 && (fx + x) < width && (fy + y) >= 0 && (fy + y) < height) {
                if (field[fx + x][fy + y] == "flag") {

                    flagCount++;
                }
            }
        }
    }

    if (flagCount == grid[fx][fy]) {
        for (y = -1; y <= 1; y++) {
            for (x = -1; x <= 1; x++) {
                if ((x != 0 || y != 0) && (fx + x) >= 0 && (fx + x) < width && (fy + y) >= 0 && (fy + y) < height) {
                    
                    leftAction(fx + x, fy + y);
                }
            }
        }
    }
    fastOpening = false;
}

reRender = function() {

    gameWindow.removeChild(document.getElementById("gameDiv"))
    createGameGrid();
}

updateTile = function(ux, uy) {

    document.getElementById("gameTileImg_" + ux + "_" + uy).src = imgSrc[field[ux][uy]];
}


leftAction = function(ax, ay) {

    if (firstClick && clickDown) {

        firstClick = false;
        shuffle(ax, ay);
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
        updateTile(ax, ay);
    }
    else if (grid[ax][ay] > 0 && field[ax][ay] != "tile" && !fastOpening && !clearing) {
        
        fastOpen(ax, ay);
    }
} 

rightAction = function(ax, ay) {
    
    // console.log("right", ax, ay);

    if (field[ax][ay] == "tile") {

        field[ax][ay] = "flag";
    }
    else if (maybe && field[ax][ay] == "flag") {

        field[ax][ay] = "maybe";
    } 
    else if (field[ax][ay] == "flag" || field[ax][ay] == "maybe"){
        
        field[ax][ay] = "tile";
    }
    updateTile(ax, ay);
}

gameOver = function() {

    console.error("game over");
    playing = false;
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

spaceAction = function(ax ,ay) {

}

toggleDarkMode = function(modeSelect = "light", doRerender = true) {


    if (dark_mode && modeSelect == "light") {

        dark_mode = false;
        updateImgSrc();
        document.getElementById("game0").className = "window";
        document.getElementById("game0_bar").className = "window_bar";
        document.getElementById("settings1").className = "window";
        document.getElementById("settings1_bar").className = "window_bar";
        document.getElementById("settings1").style.backgroundColor = "#ebebeb";
        // document.getElementById("settings_button").src = imgSrc["settings"];
        document.getElementById("settings_button_1").className = "customButton";
        document.getElementById("settings_button_2").className = "customButton";
    } else {

        dark_mode = true;
        updateImgSrc();
        document.getElementById("game0").className = "window_dark";
        document.getElementById("game0_bar").className = "window_bar_dark";
        document.getElementById("settings1").className = "window_dark";
        document.getElementById("settings1_bar").className = "window_bar_dark";
        document.getElementById("settings1").style.backgroundColor = "#777777";
        // document.getElementById("settings_button").src = imgSrc["settings"];
        document.getElementById("settings_button_1").className = "customButton_dark";
        document.getElementById("settings_button_2").className = "customButton_dark";
    }
    
    if (doRerender) {
        
        reRender();
    }
}

setTimerDisplay = function() {

    // hundred = Math.floor(time / 100);
    // ten = Math.floor((time % 100) / 10);
    // one = Math.floor((time % 100) % 10);
}

shuffle = function(xx, yy) {

    console.warn("shuffle", xx, yy);

    placeMines = mines;
    while (placeMines > 0) {
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {

                place = Math.floor(Math.random()*100);
                
                if (place < 5 && (x != xx || y != yy) && placeMines > 0 && grid[x][y] != "bomb") {
                    grid[x][y] = "bomb";
                    placeMines--;
                }
            }
        }
    }
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
        }
    }
}



restart = function() {

    console.warn("restart");
    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {

            grid[i][j] = "tile";
            field[i][j] = "tile";
            updateTile(i, j);
        }
    }
    
    firstClick = true;
    playing = true;
}

main = function() {
    
    referenceScale = parseInt(document.getElementById("sizeSlider").value);
    if (scale != referenceScale) {

        scale = referenceScale;
        document.getElementById("sizeValue").innerHTML = scale;
        reRender();
    }
}


FPS = 1000/60;
setInterval(main, FPS);