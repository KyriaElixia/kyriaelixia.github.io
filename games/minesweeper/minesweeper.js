
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
        togglePlayback(false);
    
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
        playbacking = false;
        time = 0;
        minesLeft = mines;
        setTimerDisplay();
        setMinesDisplay();
        updateSmiley("happy");
        document.getElementById("shareURL").value = "";
        document.getElementById("shareState").value = "";
        document.getElementById("shareURLbtn").disabled = true;
        document.getElementById("shareStateBtn").disabled = true;
        showExportedState();
        document.getElementById("playback_cursor").style.display = "none";
        disablePlaybackPanel(!playbacking);
    }
}

retry = function(clickOn = false) {

    clearInterval(timeCounter);
    togglePlayback(false);

    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {

            field[i][j] = "tile";
            updateTile(i, j);
        }
    }

    recordedGame = [];
    firstClick = true;
    playing = true;
    playbacking = false;
    time = 0;
    minesLeft = mines;

    retrying = false;
    toggleRetry();

    setTimerDisplay();
    setMinesDisplay();
    updateSmiley("happy");
    document.getElementById("playback_cursor").style.display = "none";
}

leftAction = function(ax, ay) {

    if (firstClick) {

        firstClick = false;
        if (!playbacking) {

            timeCounter = setInterval(clock, 1000);
            document.getElementById("shareStateBtn").disabled = false;
        }

        if (!retrying) {
            shuffle(ax, ay);
        }
        generateLink();
    }

    if (field[ax][ay] == "tile") {

        if (!clearing && !fastOpening && !playbacking) {
            recordedGame.push([time, "L", ax, ay]);
            // console.info([time, "L", ax, ay]);
        }

        if (grid[ax][ay] != "bomb") {

            field[ax][ay] = grid[ax][ay] + "-tile";

            if (grid[ax][ay] == 0) {

                clearList.push([ax, ay]);
                // console.log("cl len", clearList.length);
                if (clearList.length == 1 && !clearing) {

                    clearOpenTiles();
                }
            }
        } 
        else {

            field[ax][ay] = "exploded-" + grid[ax][ay];
            gameOver();
        }
        
    }
    else if ((ax == peek_x && ay == peek_y || playbacking) && isRevealed(ax, ay) && !fastOpening && !clearing) {
        if (flagCount(ax, ay)) {
         
            if (!playbacking) {
                recordedGame.push([time, "L", ax, ay]);
                // console.info([time, "L", ax, ay]);
            }
            fastOpen(ax, ay);
        }
    }
    
    updateTile(ax, ay);
    setMinesDisplay();
    checkWinCondition();
}

rightAction = function(ax, ay, spaceAction = false) {
    
    dolog = true;
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
    else {

        dolog = false;
    }

    if (dolog && !spaceAction && !playbacking) {
        recordedGame.push([time, "R", ax, ay]);
        // console.info([time, "R", ax, ay]);
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

        if (!isRevealed(ax, ay)) {
            
            if (!playbacking) {
                recordedGame.push([time, "S", ax, ay]);
                // console.info([time, "S", ax, ay]);
            }
            rightAction(ax, ay, true);
        }
        else if (grid[ax][ay] > 0 && grid[ax][ay] < 9) {
            
            if (flagCount(ax, ay)) {

                if (!playbacking) {
                    recordedGame.push([time, "S", ax, ay]);
                    // console.info([time, "S", ax, ay]);
                }
                fastOpen(ax, ay);
            }
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
    for (yf = -1; yf <= 1; yf++) {
        for (xf = -1; xf <= 1; xf++) {

            xxf = fx + xf;
            yyf = fy + yf;
            if ((xf != 0 || yf != 0) && xxf >= 0 && xxf < width && yyf >= 0 && yyf < height) {
                
                leftAction(xxf, yyf);
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
                    
                    updateTile(XX, YY);
                }
            }
        }
    }
}

flagCount = function(fx, fy) {

    count = 0;
    for (cy = -1; cy <= 1; cy++) {
        for (cx = -1; cx <= 1; cx++) {
            cxx = fx + cx;
            cyy = fy + cy;
            if ((cx != 0 || cy != 0) && cxx >= 0 && cxx < width && cyy >= 0 && cyy < height) {
                if (field[cxx][cyy] == "flag") {

                    count++;
                }
            }
        }
    }

    if (count == grid[fx][fy]) {
        
        return true
    }
    else {
        return false;
    }
}

isRevealed = function(rx, ry) {

    switch(field[rx][ry]) {

        case "tile":
        case "flag":
        case "maybe":
            return false;
    }
    return true;
}

isNumber = function(rx, ry) {

    switch(field[rx][ry]) {

        case "1-tile":
        case "2-tile":
        case "3-tile":
        case "4-tile":
        case "5-tile":
        case "6-tile":
        case "7-tile":
        case "8-tile":
            return true;
    }
    return false;
}

checkFlagWarning = function(cx, cy) {

    for (y = -1; y <= 1; y++) {
        for (x = -1; x <= 1; x++) {
            xx = cx + x;
            yy = cy + y;
            if ((x != 0 || y != 0) && xx >= 0 && xx < width && yy >= 0 && yy < height) {
                if (isRevealed(xx, yy) && field[xx][yy] != "0-tile") {

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
    if (!playbacking) {
        setStatisticsCookies(false);
        setHistoryCookie(false);

        loadedPlayback = exportPlayback();
        disablePlaybackPanel(false);
        loadReplay(loadedPlayback);
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
    if (!playbacking) {
        setStatisticsCookies(true);
        setHistoryCookie(true);

        loadedPlayback = exportPlayback();
        disablePlaybackPanel(false);
        loadReplay(loadedPlayback);
    }
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

    if (minesLeft == 0 && (playing || playbacking)) {
        
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
            // console.warn("BLOCKED")
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


