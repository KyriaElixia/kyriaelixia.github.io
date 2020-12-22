game = new RoboroCanvas('sweeper');

size = 25;
height = 16;
width = 16;
mines = 40;
minesLeft = mines;

firstClick = true;
clickDown = false;
gameEnd = false;
toggleErrors = false;




keyDown = false;
keyPress = false;

game.updatesPerSecond = 30;

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

window.addEventListener('keydown', function (e) {
    keyDown = e.keyCode;
});
window.addEventListener('keyup', function (e) {
    keyDown = false;
});

game.update = function () {

    if (gameEnd == false) {
        
        game.clickCheck();
    }

    if (document.getElementById("tileSettings").tileSize.value != size) {
        
        size = document.getElementById("tileSettings").tileSize.value;
        document.getElementById("sweeper").width = width * size;
        document.getElementById("sweeper").height = height * size;
        game.render();
    }
    if (document.getElementById("extraSettings").showErrors.checked != toggleErrors) {

        toggleErrors = document.getElementById("extraSettings").showErrors.checked;
        game.render();
    }
};

game.newGame = function () {

    console.log("new game")
    width = document.getElementById("fieldSettings").fieldWidth.value;
    height = document.getElementById("fieldSettings").fieldHeight.value;
    mines = document.getElementById("fieldSettings").fieldMines.value;
    size = document.getElementById("tileSettings").tileSize.value;
    document.getElementById("sweeper").width = width * size;    
    document.getElementById("sweeper").height = height * size;
    
    game.restart();
};

game.restart = function () {

    console.log("restart")
    firstClick = true;
    minesLeft = mines;
    gameEnd = false;

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

    keyDown = false;
    game.mouse.left = false;
    game.mouse.right = false;
    document.getElementById("sweeper").focus();
};

game.settings = function () {

    if (document.getElementById("settingsWindow").style.display == "none") {
        
        document.getElementById("settingsWindow").style.display = "";
        document.getElementById("toggleSettings").innerHTML = "Hide settings";
    }
    else {
        
        document.getElementById("settingsWindow").style.display = "none";
        document.getElementById("toggleSettings").innerHTML = "Show settings";
    }

    document.getElementById("sweeper").focus();
};

game.clickCheck = function () {

    if (firstClick == true) {
        game.render();
    }

    if (game.mouse.left == true) {

        if (clickDown == false) {
            clickDown = true;
            if (firstClick == false) {

                game.clickAction("left", game.mouse.x, game.mouse.y);
            }
            else {

                game.clickAction("first", game.mouse.x, game.mouse.y);
            }
            game.render();
        }
    }
    else if (game.mouse.right == true) {

        if (clickDown == false) {
            clickDown = true;
            game.clickAction("right", game.mouse.x, game.mouse.y);
            game.render();
        }
    }
    else if (keyDown == 32 /*space*/) {

        if (keyPress == false) {
            keyPress = true;
            game.clickAction("space", game.mouse.x, game.mouse.y);
            game.render();
        }
    }
    else if (keyDown == "8" /*backspace*/) {

        if (keyPress == false) {
            keyPress = true;
            game.clickAction("value", game.mouse.x, game.mouse.y);
        }
    }
    else {
        clickDown = false;
        keyPress = false;
    }
};

game.clickAction = function (button, mouseX, mouseY) {

    x = (mouseX / size) - (mouseX / size) % 1;
    y = (mouseY / size) - (mouseY / size) % 1;
    
    if (x >= 0 && y >= 0 && x < width && y < height) {

        if (button == "space") {

            if (field[x][y] == "hidden") {
                field[x][y] = "flag";
                minesLeft--;
            }
            else if (field[x][y] == "flag" || field[x][y] == "maybe") {
                
                if (document.getElementById("extraSettings").questionmarks.checked == true && field[x][y] == "flag") {
                    
                    field[x][y] = "maybe";
                    minesLeft++;                    
                }
                else {

                    if (document.getElementById("extraSettings").questionmarks.checked == false && field[x][y] != "maybe") {
                        minesLeft++;
                    }
                    field[x][y] = "hidden";
                }
            }
            else if (field[x][y] != "hidden" && field[x][y] != "flag" && field[x][y] != 0) {

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

                    if (hasLost == true) {
        
                        game.conditions("loss");
                    }
                    else {
                        game.clearOpenTiles();
                    }
                }

            }
        }
        else if (button == "right") {

            if (field[x][y] == "hidden") {
                field[x][y] = "flag";
                minesLeft--;
            }
            else if (field[x][y] == "flag" || field[x][y] == "maybe") {
                
                if (document.getElementById("extraSettings").questionmarks.checked == true && field[x][y] == "flag") {
                    
                    field[x][y] = "maybe";
                    minesLeft++;                    
                }
                else {                    
                    
                    if (document.getElementById("extraSettings").questionmarks.checked == false && field[x][y] != "maybe") {
                        minesLeft++;
                    }
                    field[x][y] = "hidden";
                }
            }            
        }
        else if (button == "value") {

            console.log("field value: ", field[x][y])
        }
        else {

            if (button == "first") {
                game.shuffle(x, y);
                firstClick = false;
            }
            
            if (field[x][y] == "hidden") {
                field[x][y] = grid[x][y];

                if (field[x][y] == "bomb") {
                    field[x][y] = "exploded";
                    
                    game.conditions("loss");
                }
                else if (field[x][y] == 0) {
                    
                    game.clearOpenTiles();                    
                }
            }
        }
    }
};

game.shuffle = function (posX, posY) {

    placeMines = mines;
    while (placeMines > 0) {
        for (yy = 0; yy < height; yy++) {
            for (xx = 0; xx < width; xx++) {

                place = game.random(100);

                if (place < 5 && xx != posX && yy != posY && placeMines > 0 && grid[xx][yy] != "bomb") {
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
};

game.clearOpenTiles = function () {

    doOver = 1;
    while (doOver > 0) {
        doOver--;
        for (yy = 0; yy < height; yy++) {
            for (xx = 0; xx < width; xx++) {

                if (field[xx][yy] == 0) {

                    if (xx - 1 >= 0) { if (grid[xx - 1][yy] != "bomb" && field[xx - 1][yy] == "hidden") { field[xx - 1][yy] = grid[xx - 1][yy]; doOver = 1; } }
                    if (xx + 1 < width) { if (grid[xx + 1][yy] != "bomb" && field[xx + 1][yy] == "hidden") { field[xx + 1][yy] = grid[xx + 1][yy]; doOver = 1; } }
                    if (yy - 1 >= 0) { if (grid[xx][yy - 1] != "bomb" && field[xx][yy - 1] == "hidden") { field[xx][yy - 1] = grid[xx][yy - 1]; doOver = 1; } }
                    if (yy + 1 < height) { if (grid[xx][yy + 1] != "bomb" && field[xx][yy + 1] == "hidden") { field[xx][yy + 1] = grid[xx][yy + 1]; doOver = 1; } }
                    if (xx - 1 >= 0 && yy - 1 >= 0) { if (grid[xx - 1][yy - 1] != "bomb" && field[xx - 1][yy - 1] == "hidden") { field[xx - 1][yy - 1] = grid[xx - 1][yy - 1]; doOver = 1; } }
                    if (xx - 1 >= 0 && yy + 1 < height) { if (grid[xx - 1][yy + 1] != "bomb" && field[xx - 1][yy + 1] == "hidden") { field[xx - 1][yy + 1] = grid[xx - 1][yy + 1]; doOver = 1; } }
                    if (xx + 1 < width && yy - 1 >= 0) { if (grid[xx + 1][yy - 1] != "bomb" && field[xx + 1][yy - 1] == "hidden") { field[xx + 1][yy - 1] = grid[xx + 1][yy - 1]; doOver = 1; } }
                    if (xx + 1 < width && yy + 1 < height) { if (grid[xx + 1][yy + 1] != "bomb" && field[xx + 1][yy + 1] == "hidden") { field[xx + 1][yy + 1] = grid[xx + 1][yy + 1]; doOver = 1; } }
                }
            }
        }
    }
};

game.conditions = function (status) {

    if (status == "loss") {

        gameEnd = true;
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

        if (mineCheck == mines && allCleared == true) {
            
            gameEnd = true;
            game.render();

            document.getElementById("score").innerHTML = "All mines cleared";
            minesLeft = mines;
            alert("All mines swept!");
            
            allCleared = false;
            
        }
    }
};

game.render = function () {

    game.clearScreen();

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {

            if (field[x][y] == "hidden") {

                game.picture(x * size, y * size, "https://kyriaelixia.github.com/server/games/oldminesweeper/sprites/tile.png", size, size);
            }
            else if (field[x][y] == 0) {

                game.picture(x * size, y * size, "https://kyriaelixia.github.com/server/games/oldminesweeper/sprites/open-tile.png", size, size);
            }
            else if (field[x][y] >= 1 && field[x][y] <= 8) {

                game.picture(x * size, y * size, "https://kyriaelixia.github.com/server/games/oldminesweeper/sprites/" + field[x][y] + "-tile.png", size, size);
            }
            else if (field[x][y] == "flag") {

                game.picture(x * size, y * size, "https://kyriaelixia.github.com/server/games/oldminesweeper/sprites/flag.png", size, size);
            }
            else if (field[x][y] == "bomb") {

                game.picture(x * size, y * size, "https://kyriaelixia.github.com/server/games/oldminesweeper/sprites/bomb.png", size, size);
            }
            else if (field[x][y] == "exploded" || field[x][y] == "not") {

                game.picture(x * size, y * size, "https://kyriaelixia.github.com/server/games/oldminesweeper/sprites/" + field[x][y] + "-bomb.png", size, size);
            }
            else if (field[x][y] == "maybe") {

                game.picture(x * size, y * size, "https://kyriaelixia.github.com/server/games/oldminesweeper/sprites/maybe.png", size, size);
            }


            if (document.getElementById("extraSettings").showErrors.checked == true) {

                if (field[x][y] >= 1 && field[x][y] <= 8) {

                    tileCount = 0;

                    if (x - 1 >= 0)                       { if (field[x - 1][y]     == "flag") { tileCount++; } }
                    if (x + 1 < width)                    { if (field[x + 1][y]     == "flag") { tileCount++; } }
                    if (y - 1 >= 0)                       { if (field[x][y - 1]     == "flag") { tileCount++; } }
                    if (y + 1 < height)                   { if (field[x][y + 1]     == "flag") { tileCount++; } }
                    if (x - 1 >= 0    && y - 1 >= 0)      { if (field[x - 1][y - 1] == "flag") { tileCount++; } }
                    if (x - 1 >= 0    && y + 1 < height)  { if (field[x - 1][y + 1] == "flag") { tileCount++; } }
                    if (x + 1 < width && y - 1 >= 0)      { if (field[x + 1][y - 1] == "flag") { tileCount++; } }
                    if (x + 1 < width && y + 1 < height)  { if (field[x + 1][y + 1] == "flag") { tileCount++; } }
    
                    if (tileCount > field[x][y]) {

                        game.picture(x * size, y * size, "https://kyriaelixia.github.com/server/games/oldminesweeper/sprites/error-" + field[x][y] + ".png", size, size);
                    }
                }
            }
        }
    }
    if (gameEnd == false) {

        document.getElementById("score").innerHTML = minesLeft + " Mines";
    }

    if (minesLeft == 0 && gameEnd == false) {
        
        game.conditions("win");
    }
};