
width = 9;
height = 9;

scale = 50;

borderWidth = 2;

dark_mode = false;


lightSrc = {
    "tile":         "sprites/light_mode/tiles/tile.png",
    "line-v":       "sprites/light_mode/frame/line-v.png",
    "line-h":       "sprites/light_mode/frame/line-h.png",
    "cross-nes":    "sprites/light_mode/frame/cross-nes.png",
    "cross-nsw":    "sprites/light_mode/frame/cross-nsw.png",
    "corner-ne":    "sprites/light_mode/frame/corner-ne.png",
    "corner-nw":    "sprites/light_mode/frame/corner-nw.png",
    "corner-es":    "sprites/light_mode/frame/corner-es.png",
    "corner-sw":    "sprites/light_mode/frame/corner-sw.png",
    "divider":      "sprites/light_mode/digits/digit-divider.png",
    "blank-digit":  "sprites/light_mode/digits/blank-digit.png",
    "happy":        "sprites/light_mode/buttons/happy.png"
}

darkSrc = {
    "tile":         "sprites/dark_mode/tiles/tile.png",
    "line-v":       "sprites/dark_mode/frame/line-v.png",
    "line-h":       "sprites/dark_mode/frame/line-h.png",
    "cross-nes":    "sprites/dark_mode/frame/cross-nes.png",
    "cross-nsw":    "sprites/dark_mode/frame/cross-nsw.png",
    "corner-ne":    "sprites/dark_mode/frame/corner-ne.png",
    "corner-nw":    "sprites/dark_mode/frame/corner-nw.png",
    "corner-es":    "sprites/dark_mode/frame/corner-es.png",
    "corner-sw":    "sprites/dark_mode/frame/corner-sw.png",
    "divider":      "sprites/dark_mode/digits/digit-divider.png",
    "blank-digit":  "sprites/dark_mode/digits/blank-digit.png",
    "happy":        "sprites/dark_mode/buttons/happy.png"
}

boop = 2/9

imgSrc = lightSrc;

gameWindow = document.getElementById("game0");
gameWindowBar = document.getElementById("game0_bar");

createGameGrid = function() {

    if (dark_mode) {
        imgSrc = darkSrc;
    } else {
        imgSrc = lightSrc;
    }

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
    counter.style.backgroundColor = "#3d0603";
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
    restartButton.src = imgSrc["happy"];

    return restartButton;
}

reRender = function() {

    gameWindow.removeChild(document.getElementById("gameDiv"))
    createGameGrid();
}






toggleDarkMode = function() {

    if (dark_mode) {

        dark_mode = false;
    } else {

        dark_mode = true;
    }
    reRender();
}

restart = function() {

    console.warn("restart");
}

main = function() {
    
    referenceScale = parseInt(document.getElementById("sizeSlider").value);
    if (scale != referenceScale) {

        scale = referenceScale;
        reRender();
    }
}

FPS = 1000/60;
setInterval(main, FPS);