
width = 16;
height = 16;
mines = 40;

scale = 40;

borderWidth = 2;

dark_mode = true;
restartButton_state = "happy";
clickDown = false;



mx = -1;
my = -1;

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
imageSources = function() {

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

    imageSources();

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
            
            gameDiv.appendChild(createGameTile(w, h, xOffset, hOffset, imgSrc["tile"]));
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
    tileImg.onmousedown = function() {
        
        console.log("down", mx, my)
        clickDown = true;

        if (field[mx][my] == "tile" && clickDown) { 
            document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc["0-tile"]; 
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

    restartButton.onmousedown = function() { restartButton.src = imgSrc[restartButton_state + "_pushed"]}
    restartButton.onmouseup = function() { restartButton.src = imgSrc[restartButton_state]}
    restartButton.onmouseleave = function() { restartButton.src = imgSrc[restartButton_state]}
    
    return restartButton;
}

resizeGrid = function(ww, hh, mm) {

    width = ww;
    height = hh;
    mines = mm;

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

reRender = function() {

    gameWindow.removeChild(document.getElementById("gameDiv"))
    createGameGrid();
}

clickAction = function(action) {

    if (action == "left") {

    }
    else if (action == "right") {


    }
    else if (action == "special"){

    }
}

toggleDarkMode = function(modeSelect = "light", doRerender = true) {


    if (dark_mode && modeSelect == "light") {

        dark_mode = false;
        imageSources();
        document.getElementById("game0").className = "window";
        document.getElementById("game0_bar").className = "window_bar";
        document.getElementById("settings1").className = "window";
        document.getElementById("settings1_bar").className = "window_bar";
        document.getElementById("settings1").style.backgroundColor = "#ebebeb";
        document.getElementById("settings_button").src = imgSrc["settings"];
    } else {

        dark_mode = true;
        imageSources();
        document.getElementById("game0").className = "window_dark";
        document.getElementById("game0_bar").className = "window_bar_dark";
        document.getElementById("settings1").className = "window_dark";
        document.getElementById("settings1_bar").className = "window_bar_dark";
        document.getElementById("settings1").style.backgroundColor = "#777777";
        document.getElementById("settings_button").src = imgSrc["settings"];
    }
    
    if (doRerender) {
        
        reRender();
    }
}




restart = function() {

    console.warn("restart");
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