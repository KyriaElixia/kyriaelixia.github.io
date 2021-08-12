
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
    setStatisticsCookies(false);
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
    setStatisticsCookies(true);
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

checkWinCondition = function(blockStats = false) {

    if (minesLeft == 0 && playing) {
        
        for (j = 0; j < height; j++) {
            for (i = 0; i < width; i++) {
                if ((field[i][j] == "flag" && grid[i][j] != "bomb") || field[i][j] == "tile") {
                    
                    return false;
                }
            }
        }
        // WIN 
        if (!blockStats) {
            wonGame(); 
            console.warn("BLOCKED")
        }
        return true; 
    }
    return false;
}

clock = function() {

    time++;
    setTimerDisplay();    
}

UPS = 1000/60;
setInterval(main, UPS);


