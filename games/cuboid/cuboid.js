//TODO

gridSize = 20;
tileSize = 40;
xOff = tileSize;
yOff = tileSize;

player = 0;
levelUpdated = 0;
currentLevel = 0;
moves = 0;
movesArray = new Array(levels.length);
pathArray = new Array(levels.length);
highscoreArray = new Array(levels.length);

for (l = 0; l < levels.length; l++) {

    movesArray[l] = 0;
    pathArray[l] = "";
    highscoreArray[l] = checkCookie("CB_moves_" + l,"none");
}

editing = false;
playTesting = false;
keyPress = [false, false, false, false];
linkPress = false;
gameOver = false;
help = false;

mouseX = 0;
mouseY = 0;
mouseDown = false;

createGrid = function(type) {

    tiles = new Array(gridSize);
    for (a = 0; a < tileSize; a++) {
        tiles[a] = new Array(gridSize);
    }

    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize; x++) {

            gridTile = document.createElement("img");
            gridTile.id = "tile_" + x + "_" + y;
            gridTile.style.position = "absolute";
            gridTile.style.left = xOff + tileSize * x;
            gridTile.style.top = yOff + tileSize * y;
            gridTile.style.width = tileSize;
            gridTile.style.userSelect = "none";
            gridTile.ondragstart = function(){return false};
            gridTile.onddrop = function(){return false};
            
            if (type == "game") {

                gridTile.src = "sprites/blank.png";
            }
            else {

                gridTile.src = "sprites/grid.png";
            }           

            gridTile.onmouseover = function () {

                mouseX = this.x/tileSize - 1;
                mouseY = this.y/tileSize - 1;
            };
            gridTile.onmouseout = function () {

                mouseX = -1;
                mouseY = -1;                    
            }; 
            /* gridTile.onmousedown = function (e) {

                if (e.which == 1) { //left click

                    
                }
                else if (e.which == 3 ) { //right click
    
                }
            }; */
            
            linkFlareX = document.createElement("p");
            linkFlareY = document.createElement("p");
            linkFlareZ = document.createElement("p");
            linkFlareS = document.createElement("p");

            linkFlares = [linkFlareX,linkFlareY,linkFlareZ,linkFlareS];

            for (l = 0; l < linkFlares.length; l++) {

                linkFlares[l].style.position = "absolute";
                linkFlares[l].style.width = 0;
                linkFlares[l].style.height = 0;
                linkFlares[l].style.userSelect = "none";
                linkFlares[l].style.pointerEvents = "none"; 
                linkFlares[l].style.display = "none";

                if (l == 0) { //X

                    linkFlares[l].style.left = xOff + tileSize * x + 4;
                    linkFlares[l].style.top = yOff/2 + tileSize * y + 4;
                    linkFlares[l].innerHTML = "X";
                    linkFlares[l].id = "link_X_" + x + "_" + y;
                }
                else if (l == 1) { //Y
                    
                    linkFlares[l].style.left = xOff + tileSize * x + 4 + tileSize/2;
                    linkFlares[l].style.top = yOff/2 + tileSize * y + 4;
                    linkFlares[l].innerHTML = "Y";
                    linkFlares[l].id = "link_Y_" + x + "_" + y;
                }
                else if (l == 2) { //Z

                    linkFlares[l].style.left = xOff + tileSize * x + 4;
                    linkFlares[l].style.top = yOff/2 + tileSize * y + 4 + tileSize/2;
                    linkFlares[l].innerHTML = "Z";
                    linkFlares[l].id = "link_Z_" + x + "_" + y;
                }
                else if (l == 3) { //S
                    
                    linkFlares[l].style.left = xOff + tileSize * x + 4 + tileSize/2;
                    linkFlares[l].style.top = yOff/2 + tileSize * y + 4 + tileSize/2;
                    linkFlares[l].innerHTML = "S";
                    linkFlares[l].id = "link_S_" + x + "_" + y;
                }
            }

            tiles[x][y] = new tileObject(0, 0, 0, 0, 0, 0, 0, 0, 0);

            document.body.appendChild(gridTile)
            document.body.appendChild(linkFlares[0])
            document.body.appendChild(linkFlares[1])
            document.body.appendChild(linkFlares[2])
            document.body.appendChild(linkFlares[3])

        }
    }
    document.getElementById("editorSelector").style.position = "absolute"
    document.getElementById("editorSelector").style.left = 3/2 * xOff + gridSize * tileSize;
    document.getElementById("editorSelector").style.top = yOff;
    
    document.getElementById("levelDock").style.position = "absolute";
    document.getElementById("levelDock").style.left = xOff;
    document.getElementById("levelDock").style.top = 1 * yOff + gridSize * tileSize;

    document.getElementById("help").style.position = "absolute";
    document.getElementById("help").style.left = xOff;
    document.getElementById("help").style.top = 1 * yOff + gridSize * tileSize;

}

loadMap = function(map) {    

    if (map == "textbox") { // for import button

        map = document.getElementById("levelCode").value;
    }

    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize; x++) {

            subStr = 2 * (gridSize * y + x);
            tiles[x][y].import(radix.setLength(9, radix.convert(map.slice(subStr, subStr + 2), 32, 2)))
            tiles[x][y].render(x, y);
        }
    }
}

exportMap = function(doReturn) {

    if (!doReturn) {
        
        // Level shifted wrong
        // zeros = 0;
        // for (z = 0; z < exportedMap.length; z += 2) {

        //     if (exportedMap.charAt(z) == "0" && exportedMap.charAt(z + 1) == "0") {

        //         zeros += 2;
        //     } else {

        //         z = exportedMap.length;
        //     }
        // }
        // exportedMap = exportedMap.slice(zeros,exportedMap.length);

        leftBlock = moveGrid("left",true);
        upBlock = moveGrid("up",true);
        
        for (r = 0; r < gridSize-1; r++) {
               
            if (!leftBlock) {
                
                leftBlock = moveGrid("left",true);
            }
            
            if (!upBlock) {
                
                upBlock = moveGrid("up",true);
            }
        }
    }


    exportedMap = "";

    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize; x++) {

            compressed = radix.setLength(2,radix.convert(tiles[x][y].export(),2,32));

            exportedMap += compressed;
        }
    }

    zeros = 0;
    for (z = exportedMap.length-1; z > 0; z -= 2) {

        if (exportedMap.charAt(z) == "0" && exportedMap.charAt(z - 1) == "0") {
            
            zeros += 2;
        }   
        else {
            z = 0;
        }
    }
    
    exportedMap = exportedMap.slice(0,exportedMap.length-zeros);
    

    

    if (doReturn == true) {
        return exportedMap;
    }
    else {

        document.getElementById("levelCode").value = exportedMap;
        setCookie("CB_exportedMap",exportedMap,30);
        loadMap(exportedMap);
    }
}

copyMap = function() {

    if (document.getElementById("levelCode").value.length > 0) {

        document.getElementById("levelCode").select();
        document.execCommand("copy");

        document.getElementById("copyButton").innerHTML = "Level code copied!"
    }
}

tileObject = function(x, y, z, o, t, d, b, p, s) {

    //links
    this.X = x;
    this.Y = y;
    this.Z = z;
    this.O = o; //One time use

    //type
    this.tile = t;   // Status( 0 = Stable, 1 = Unstable )
    this.door = d;   // Status( 0 = Closed, 1 = Open     )
    this.button = b; // Status( 0 = Light,  1 = Heavy    )
    this.portal = p; // Status( 0 = Start,  1 = End      ) 

    //status
    this.status = s;

    this.export = function () {

        return "" + this.X + this.Y + this.Z + this.O + this.tile + this.door + this.button + this.portal + this.status;
    }

    this.import = function (data) {

        importArray = [];

        for (d = 0; d < data.length; d++) {

            importArray.push(data.charAt(d));
        }

        this.X = importArray[0];
        this.Y = importArray[1];
        this.Z = importArray[2];
        this.O = importArray[3];
        this.tile = importArray[4];
        this.door = importArray[5];
        this.button = importArray[6];
        this.portal = importArray[7];
        this.status = importArray[8];
    }

    this.render = function(render_x, render_y) {

        document.getElementById("tile_" + render_x + "_" + render_y).src = getSprite(render_x,render_y);

        if (this.X == "1" && !playTesting && editing) { document.getElementById("link_X_"+render_x+"_"+render_y).style.display = "";  }
        else { document.getElementById("link_X_"+render_x+"_"+render_y).style.display = "none"; }

        if (this.Y == "1" && !playTesting && editing) { document.getElementById("link_Y_"+render_x+"_"+render_y).style.display = "";  }
        else { document.getElementById("link_Y_"+render_x+"_"+render_y).style.display = "none"; }

        if (this.Z == "1" && !playTesting && editing) { document.getElementById("link_Z_"+render_x+"_"+render_y).style.display = "";  }
        else { document.getElementById("link_Z_"+render_x+"_"+render_y).style.display = "none"; }

        if (this.O == "1" && !playTesting && editing) { document.getElementById("link_S_"+render_x+"_"+render_y).style.display = "";  }
        else { document.getElementById("link_S_"+render_x+"_"+render_y).style.display = "none"; }
    }
}

playerObject = function(start_x,start_y) {

    this.x1 = start_x;
    this.y1 = start_y;
    this.x2 = start_x;
    this.y2 = start_y;

    this.lastPos = [this.x1, this.y1, this.x2, this.y2];

    this.status = "standing";

    this.move = function (direction) {

        this.lastPos = [this.x1, this.y1, this.x2, this.y2];

        movesArray[currentLevel]++;
        pathArray[currentLevel] += direction + ", "
        moves++;
        
        if (!playTesting) {
            document.getElementById("moves").innerHTML = "Moves: " + moves + " | " + movesArray[currentLevel];
        } else {
            document.getElementById("moves").innerHTML = "Moves: " + moves;
        }

        switch (direction) {

            case "right":

                if (this.status == "vertical") {
                    
                    if (this.x1 < gridSize - 1) {

                        this.x1++;
                        this.x2++;

                        this.action(); 
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }                  
                }
                else if (this.status == "horisontal") {

                    if (this.x1 < gridSize - 2) {

                        this.status = "standing";
                        this.x1 += 2;
                        this.x2++;
                        
                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }                 
                }
                else {

                    if (this.x2 < gridSize - 2) {

                        this.status = "horisontal";
                        this.x1++;
                        this.x2 += 2;

                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }
                }
            break;

            case "left":

                if (this.status == "vertical") {
                    
                    if (this.x1 > 0) {

                        this.x1--;
                        this.x2--;

                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }
                }
                else if (this.status == "horisontal") {

                    if (this.x2 > 1) {

                        this.status = "standing";
                        this.x1--;
                        this.x2 -= 2;
                        
                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }
                }
                else {

                    if (this.x1 > 1) {

                        this.status = "horisontal";
                        this.x1 -= 2;
                        this.x2--;

                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }
                }
            break;

            case "up":

                if (this.status == "horisontal") {
                    
                    if (this.y1 > 0) {

                        this.y1--;
                        this.y2--;

                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }
                }
                else if (this.status == "vertical") {

                    if (this.y2 > 1) {

                        this.status = "standing";
                        this.y1--;
                        this.y2 -= 2;
                        
                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }
                }
                else {

                    if (this.y1 > 1) {

                        this.status = "vertical";
                        this.y1 -= 2;
                        this.y2--;

                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }
                }
            break;

            case "down":

                if (this.status == "horisontal") {
                    
                    if (this.y1 < gridSize - 1) {

                        this.y1++;
                        this.y2++;

                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }
                }
                else if (this.status == "vertical") {

                    if (this.y1 < gridSize - 2) {

                        this.status = "standing";
                        this.y1 += 2;
                        this.y2++;

                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }                    
                }
                else {

                    if (this.y2 < gridSize - 2) {

                        this.status = "vertical";
                        this.y1++;
                        this.y2 += 2;

                        this.action();
                    }
                    else {

                        this.fall("Fell off screen :: " + direction);
                    }
                }
            break;
        }

        if (playTesting || !editing ) {
            this.render();
        }
    }

    this.render = function() {

        tiles[this.lastPos[0]][this.lastPos[1]].render(this.lastPos[0],this.lastPos[1]);
        tiles[this.lastPos[2]][this.lastPos[3]].render(this.lastPos[2],this.lastPos[3]);

        if (this.status == "vertical") {

            document.getElementById("tile_" + this.x1 + "_" + this.y1).src = "sprites/vertical-upper.png";
            document.getElementById("tile_" + this.x2 + "_" + this.y2).src = "sprites/vertical-lower.png";
        }
        else if (this.status == "horisontal") {

            document.getElementById("tile_" + this.x1 + "_" + this.y1).src = "sprites/horisontal-left.png";
            document.getElementById("tile_" + this.x2 + "_" + this.y2).src = "sprites/horisontal-right.png";
        }
        else {

            document.getElementById("tile_" + this.x1 + "_" + this.y1).src = "sprites/standing.png";
        }
    }

    this.fall = function(reason) {

        console.log(reason)
        this.x1 = startPos[0];
        this.x2 = startPos[0];
        this.y1 = startPos[1];
        this.y2 = startPos[1];
        this.status = "standing";
        
        if (playTesting) {            

            loadMap(levelEditBackup);
        }
        else {
            loadMap(levels[currentLevel]);
        }

        setCookie("CB_totalFalls",parseInt(checkCookie("CB_totalFalls",0))+1,30)
    }

    this.action = function() {

        data1 = tiles[this.x1][this.y1].export();
        linkData1 = data1.slice(0,4);
        tileData1 = data1.slice(4,9);

        data2 = tiles[this.x2][this.y2].export();
        linkData2 = data2.slice(0,4);
        tileData2 = data2.slice(4,9);

        if (tileData1 == "00000" || tileData2 == "00000") { //blank
            
            this.fall("Fell off ledge");
        }
        else if (tileData1 == "10001" && this.status == "standing") { //unstable

            this.fall("Stood on unstable tile");
        }
        else if (tileData1 == "01001" || tileData2 == "01001") { //door open

            this.fall("Tried to stand on open trapdoor");
        }
        else if (tileData1 == "00100" || tileData2 == "00100") { //lightwight
            
            if (tileData1 == "00100") {
                pressButton(data1,this.x1,this.y1);
            }
            if (this.status != "standing" && tileData2 == "00100") {
                pressButton(data2,this.x2,this.y2);
            }
        }
        else if (tileData1 == "00101" && tileData2 == "00101") { //heavyweight

            pressButton(data1,this.x1,this.y1);            
        }
        else if (tileData1 == "00011" && tileData2 == "00011") { //end

            if (playTesting) {

                playTest();
                exportMap();                
                document.getElementById("moves").innerHTML = "Moves: " + moves + " | play-test completed! Level exported!";           
            }
            else {

                highscores();

                currentLevel++;
                if (currentLevel != levels.length) {
                        
                    levelUp();
                    document.getElementById("moves").innerHTML = "Moves: " + moves + " | " + movesArray[currentLevel];                                                     
                }
                else {

                    gameOver = true;                    
                    document.getElementById("moves").innerHTML = "Moves: " + moves + " | " + movesArray[currentLevel] + " | last level won!";
                }
            }
        }
    }
}

levelUp = function() {
    
    loadMap(levels[currentLevel]);
    document.getElementById("author").innerHTML = "Level " + (currentLevel + 1) + " - by " + authors[currentLevel];

    if (highscoreArray[currentLevel] == "none") {

        document.getElementById("highscoreHolder").innerHTML = "Highscore: " + highscoreArray[currentLevel];
    } else {
        
        document.getElementById("highscoreHolder").innerHTML = "Highscore: " + highscoreArray[currentLevel] + " Moves";
    }

    startPos = [0, 0]

    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize; x++) {

            if (tiles[x][y].export() == "000000010") {

                startPos = [x, y];
            }  
            tiles[x][y].render(x,y)                      
        }
    }
    
    last = [player.x1,player.x2];

    player = new playerObject(startPos[0],startPos[1]);

    player.render();
    setCookie("CB_currentLevel",currentLevel,30);
    
    if (currentLevel > 0) {
        document.getElementById("backwardButton").disabled = false;
    }
    else {
        document.getElementById("backwardButton").disabled = true;
    }

    if (currentLevel < highestLevel) {
        document.getElementById("forwardButton").disabled = false;
    }
    else {
        document.getElementById("forwardButton").disabled = true;
        setCookie("CB_highestLevel",currentLevel,30);
        highestLevel = currentLevel;
    }
}

pressButton = function(linkStr,x_player,y_player) {

    links = [linkStr.charAt(0),linkStr.charAt(1),linkStr.charAt(2),linkStr.charAt(3)];

    if (links[3] == "1") {

        tiles[x_player][y_player].X = "0";
        tiles[x_player][y_player].Y = "0";
        tiles[x_player][y_player].Z = "0";
        tiles[x_player][y_player].O = "0";
    }

    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize; x++) {

            data = tiles[x][y].export().slice(4,9);            
            if (data == "01001" || data == "01000") {
                
                changed = false;

                linkData = [tiles[x][y].X, tiles[x][y].Y, tiles[x][y].Z, tiles[x][y].O];
                for (l = 0; l < 3; l++) {

                    if (!changed && links[l] == "1" && linkData[l] == "1") {
                        
                        if (tiles[x][y].status == "1") {
                            tiles[x][y].status = "0"
                        }
                        else {
                            tiles[x][y].status = "1"
                        }
                        changed = true;
                    }                    
                }
                if (changed && linkData[3] == "1") {

                    tiles[x][y].X = "0";
                    tiles[x][y].Y = "0";
                    tiles[x][y].Z = "0";
                    tiles[x][y].O = "0";
                }
                tiles[x][y].render(x,y)
            }
        }
    }
}

gameLoop = function() {

    if ((playTesting || !editing) && !gameOver) {
        
        controller();
    }
    else {

        quickSelect();
    }
    
    if (mouseDown) {

        if (mouseX >= 0 && mouseY >= 0) {

            editTile(mouseX,mouseY)
        }
    }
    else {

        linkPress = false;
    }

    if (currentLevel != levelUpdated) {

        for (y = 0; y < gridSize; y++) {
            for (x = 0; x < gridSize; x++) {

                tiles[x][y].render(x,y);
            }
        }
        player.render();
        levelUpdated = currentLevel;
    }
}

getSprite = function(tile_x, tile_y) {

    tileStatus = tiles[tile_x][tile_y].status
    
    if (tiles[tile_x][tile_y].tile == 1) {

        if (tileStatus == 1) {

            return "sprites/unstable.png";
        }
        else {

            return "sprites/tile.png";
        }
    }
    else if (tiles[tile_x][tile_y].door == 1) {

        if (tileStatus == 1) {

            return "sprites/door_open.png";
        }
        else {

            return "sprites/door_closed.png";
        }
    }
    else if (tiles[tile_x][tile_y].button == 1) {

        if (tileStatus == 1) {

            return "sprites/heavy.png";
        }
        else {

            return "sprites/light.png";
        }
    }
    else if (tiles[tile_x][tile_y].portal == 1) {

        if (tileStatus == 1) {

            return "sprites/end.png";
        }
        else {

            return "sprites/start.png";
        }
    }
    else {

        //blank
        if (editing == true && playTesting == false) { //TEMP
            
            return "sprites/grid.png"; 
        }
        else {
            
            return "sprites/blank.png"; 
        }        
    }
}

controller = function() {

    if (keyboard.a || keyboard.left) { 
    
        if (!keyPress[0]) {

            player.move("left");
        }
        keyPress[0] = true;
    }
    else {
        keyPress[0] = false;
    }
     
    if (keyboard.d || keyboard.right) {
        if (!keyPress[1]) {

            player.move("right");  
        }
        keyPress[1] = true;
    }
    else {
        keyPress[1] = false;
    }
        
    if (keyboard.w || keyboard.up) { 
        
        if (!keyPress[2]) {

            player.move("up");
        }
        keyPress[2] = true;
    }
    else {
        keyPress[2] = false;
    }
    
    if (keyboard.s || keyboard.down) { 
    
        if (!keyPress[3]) {

            player.move("down");
        }
        keyPress[3] = true;
    }
    else {
        
        keyPress[3] = false;
    }
}

quickSelect = function() {

    if (keyboard.one) {
        document.getElementById("blankForm").checked = true;
    }
    else if (keyboard.two) {
        document.getElementById("tileForm").checked = true;
    }
    else if (keyboard.three) {
        document.getElementById("unstableForm").checked = true;
    }
    else if (keyboard.four) {
        document.getElementById("doorClosedForm").checked = true;
    }
    else if (keyboard.five) {
        document.getElementById("doorOpenForm").checked = true;
    }
    else if (keyboard.six) {
        document.getElementById("lightForm").checked = true;
    }
    else if (keyboard.seven) {
        document.getElementById("heavyForm").checked = true;
    }
    else if (keyboard.eight) {
        document.getElementById("startForm").checked = true;
    }
    else if (keyboard.nine) {
        document.getElementById("endForm").checked = true;
    }
    else if (keyboard.x) {
        document.getElementById("xLinkForm").checked = true;
    }
    else if (keyboard.y) {
        document.getElementById("yLinkForm").checked = true;
    }
    else if (keyboard.z) {
        document.getElementById("zLinkForm").checked = true;
    }
    else if (keyboard.s) {
        document.getElementById("sLinkForm").checked = true;
    }
}

editTile = function(tile_x, tile_y) {

    if (editing == true && playTesting == false) {

        if (document.getElementById("blankForm").checked) {

            tiles[tile_x][tile_y].import("000000000");
        }
        else if (document.getElementById("tileForm").checked) {
            
            tiles[tile_x][tile_y].import("000010000");
        }
        else if (document.getElementById("unstableForm").checked) {

            tiles[tile_x][tile_y].import("000010001");
        }
        else if (document.getElementById("doorClosedForm").checked) {

            tiles[tile_x][tile_y].import("000001000");
        }
        else if (document.getElementById("doorOpenForm").checked) {

            tiles[tile_x][tile_y].import("000001001");
        }
        else if (document.getElementById("lightForm").checked) {

            tiles[tile_x][tile_y].import("000000100");
        }
        else if (document.getElementById("heavyForm").checked) {

            tiles[tile_x][tile_y].import("000000101");
        }
        else if (document.getElementById("startForm").checked) {

            for (y = 0; y < gridSize; y++) {
                for (x = 0; x < gridSize; x++) {

                    if (tiles[x][y].export() == "000000010") {
                        
                        tiles[x][y].import("000010000")
                        tiles[x][y].render(x,y);
                    }
                }
            }
            tiles[tile_x][tile_y].import("000000010");
        }
        else if (document.getElementById("endForm").checked) {

            for (y = 0; y < gridSize; y++) {
                for (x = 0; x < gridSize; x++) {

                    if (tiles[x][y].export() == "000000011") {

                        tiles[x][y].import("000010000")
                        tiles[x][y].render(x,y);
                    }
                }
            }
            tiles[tile_x][tile_y].import("000000011");
        }


        if (linkPress) {
            
        }
        else if (document.getElementById("xLinkForm").checked) {

            if (tiles[tile_x][tile_y].X == "1") {
                tiles[tile_x][tile_y].X = "0";                
            }
            else {
                tiles[tile_x][tile_y].X = "1";                
            }
            linkPress = true;
            
        }
        else if (document.getElementById("yLinkForm").checked) {

            
            if (tiles[tile_x][tile_y].Y == "1") {
                tiles[tile_x][tile_y].Y = "0";                
            }
            else {
                tiles[tile_x][tile_y].Y = "1";                
            }
            linkPress = true;
        }
        else if (document.getElementById("zLinkForm").checked) {

            if (tiles[tile_x][tile_y].Z == "1") {
                tiles[tile_x][tile_y].Z = "0";                
            }
            else {
                tiles[tile_x][tile_y].Z = "1";                
            }
            linkPress = true;
        }
        else if (document.getElementById("sLinkForm").checked) {

            if (tiles[tile_x][tile_y].O == "1") {
                tiles[tile_x][tile_y].O = "0";                
            }
            else {
                tiles[tile_x][tile_y].O = "1";
                
            }
            linkPress = true;
        }

        tiles[tile_x][tile_y].render(tile_x,tile_y);
    }
}

start = function(option) {

    loadCookies();

    createGrid(option);

    document.getElementById("gameButton").style.display = "none";
    document.getElementById("editorButton").style.display = "none";
    document.getElementById("toggleButton").style.display = "";
    document.getElementById("moves").style.display = "";
    

    if (option == "game") {
        
        document.getElementById("forwardButton").style.display = "";
        document.getElementById("backwardButton").style.display = "";
        document.getElementById("highscoreHolder").style.display = "";
        document.getElementById("moves").innerHTML = "Moves: " + moves + " | " + movesArray[currentLevel];
        document.getElementById("helpButton").style.display = "";

        editing = false;
        levelUp();

        document.getElementById("toggleButton").innerHTML= "Go to editor";
        
        if (currentLevel > 0) {
            document.getElementById("backwardButton").disabled = false;
        }
        else {
            document.getElementById("backwardButton").disabled = true;
        }
    
        if (currentLevel < highestLevel) {
            document.getElementById("forwardButton").disabled = false;
        }
        else {
            document.getElementById("forwardButton").disabled = true;
        }
    }
    else if (option == "editor") {

        editing = true;
        document.getElementById("toggleButton").innerHTML = "Go to game";
        document.getElementById("editorForm").style.display = "";
        document.getElementById("playTestButton").style.display = "";    
        document.getElementById("moves").innerHTML = "Moves: " + moves;
        document.getElementById("helpButton").style.display = "none";
        document.getElementById("help").style.display = "none";
    }
}

levelSelect = function(direction) {

    if (direction == "forward") {
        
        currentLevel++;
        levelUp();
    }
    else if (direction == "backward") {

        currentLevel--;
        levelUp();
    }
    moves = 0;
    for (l = 0; l < levels.length; l++) {

        movesArray[l] = 0;
        pathArray[l] = "";
    }
    document.getElementById("moves").innerHTML = "Moves: " + moves + " | " + movesArray[currentLevel];
    gameOver = false;
}

toggleMode = function() {

    moves = 0;
    for (l = 0; l < levels.length; l++) {

        movesArray[l] = 0;
        pathArray[l] = "";
    }

    document.getElementById("moves").innerHTML = "Moves: " + moves + " | " + movesArray[currentLevel];
    document.getElementById("author").innerHTML = "";
    gameOver = false;

    if (editing) {

        document.getElementById("moves").innerHTML = "Moves: " + moves + " | " + movesArray[currentLevel];

        editing = false;
        playTesting = false;

        currentLevel = 0;
        levelUp();

        document.getElementById("toggleButton").innerHTML= "Go to editor";
        document.getElementById("playTestButton").style.display = "none";
        document.getElementById("editorForm").style.display = "none";
        document.getElementById("forwardButton").style.display = "";
        document.getElementById("backwardButton").style.display = "";
        document.getElementById("highscoreHolder").style.display = "";
        document.getElementById("helpButton").style.display = "";
        document.getElementById("help").style.display = "none";    
    }
    else {

        loadMap("0");
        editing = true;        

        document.getElementById("moves").innerHTML = "Moves: " + moves;

        document.getElementById("toggleButton").innerHTML = "Go to game";
        document.getElementById("editorForm").style.display = "";
        document.getElementById("playTestButton").style.display = "";
        document.getElementById("editorForm").style.display = "";
        document.getElementById("backwardButton").style.display = "none";
        document.getElementById("forwardButton").style.display = "none";
        document.getElementById("highscoreHolder").style.display = "none";
        document.getElementById("helpButton").style.display = "none";
        
        if (help) {
            document.getElementById("help").style.display = "";
        } 
    }
    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize; x++) {

            tiles[x][y].render(x,y)
        }
    }
    if (!editing) {
        player.render();
    }
}

playTest = function() {

    if (!playTesting) {

        startPos = false;
        endPos = false;

        for (y = 0; y < gridSize; y++) {
            for (x = 0; x < gridSize; x++) {

                if (tiles[x][y].export() == "000000010") {

                    startPos = [x, y];
                }
                else if (tiles[x][y].export() == "000000011") {

                    endPos = [x, y];
                }
            }
        }

        if (startPos != false && endPos != false) {

            player = new playerObject(startPos[0], startPos[1]);
            
            levelEditBackup = exportMap(true);
            playTesting = true;
            document.getElementById("playTestButton").innerHTML = "Stop play-test";

            for (y = 0; y < gridSize; y++) {
                for (x = 0; x < gridSize; x++) {

                    tiles[x][y].render(x,y);
                }
            }
            moves = 0;
            pathArray[0] = "";
            player.render();            
        }
        else {
            alert("Start and End tiles required to Play-test a level")
        }       
    }
    else {

        playTesting = false;
        loadMap(levelEditBackup);

        for (y = 0; y < gridSize; y++) {
            for (x = 0; x < gridSize; x++) {

                tiles[x][y].render(x,y);
                document.getElementById("playTestButton").innerHTML = "Play-test level";
            }
        }
    }
}

moveGrid = function(direction, returnIfHit) {
    
    safeMove = true;
    switch(direction) {

        case "up":

            for (x = 0; x < gridSize; x++) {
                if (tiles[x][0].export() != "000000000") { safeMove = false; }
            }

            if (!safeMove) { 
                console.log(direction,"move blocked");

                if (returnIfHit) {
                    return true
                }
                break; 
            } 

            for (y = 0; y < gridSize; y++) {
                for (x = 0; x < gridSize; x++) {

                    if (y != gridSize - 1) {                        
                        tiles[x][y].import(tiles[x][y + 1].export());
                    }
                    else {                        
                        tiles[x][y].import("000000000");
                    }
                }
            }
        break;

        case "down":

            for (x = 0; x < gridSize; x++) {
                if (tiles[x][gridSize - 1].export() != "000000000") { safeMove = false; }
            }

            if (!safeMove) { 
                console.log(direction,"move blocked");
                
                if (returnIfHit) {
                    return true
                }
                break; 
            } 

            for (y = gridSize - 1; y >= 0; y--) {
                for (x = 0; x <  gridSize; x++) {                    
                    
                    if (y != 0) {                        
                        tiles[x][y].import(tiles[x][y - 1].export());                        
                    }
                    else {                        
                        tiles[x][y].import("000000000");
                    }
                      
                }
            }
        break;

        case "left":

            for (y = 0; y < gridSize; y++) {
                if (tiles[0][y].export() != "000000000") { safeMove = false; }
            }

            if (!safeMove) { 
                console.log(direction,"move blocked");                 
                
                if (returnIfHit) {
                    return true
                }
                break; 
            }

            for (x = 0; x < gridSize; x++) {
                for (y = 0; y < gridSize; y++) {

                    if (x != gridSize - 1) {
                        tiles[x][y].import(tiles[x + 1][y].export());                        
                    }
                    else {
                        tiles[x][y].import("000000000");
                    }                                     
                }
            }
        break;

        case "right":

            for (y = 0; y < gridSize; y++) {
                if (tiles[gridSize - 1][y].export() != "000000000") { safeMove = false; }
            }

            if (!safeMove) { 
                console.log(direction,"move blocked"); 

                if (returnIfHit) {
                    return true
                }
                break; 
            }

            for (x = gridSize - 1; x >= 0; x--) {
                for (y = 0; y <  gridSize; y++) {                    

                    if (x != 0 ) {
                        tiles[x][y].import(tiles[x - 1][y].export());
                    }
                    else {
                        tiles[x][y].import("000000000");
                    }                     
                }
            }
        break;

    }
    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize; x++) {

            tiles[x][y].render(x,y);
        }
    }
    if (returnIfHit) {
        return false;
    }

}

rotateGrid = function(direction) {

    center = (gridSize-1)/2;

    tilesBackup = new Array(20);
    for (t = 0; t < gridSize; t++) {
        tilesBackup[t] = new Array(20);
    }

    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize; x++) {
            
            tilesBackup[x][y] = tiles[x][y].export()
        }
    }

    if (direction == "clockwise") {

        transform = [0, 1, -1, 0];
    }
    else {
        
        transform = [0, -1, 1, 0];
    }
    
    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize; x++) {
            
            transform_x = transform[0] * (x - center) + transform[1] * (y - center) + center;
            transform_y = transform[2] * (x - center) + transform[3] * (y - center) + center;
            
            tiles[x][y].import(tilesBackup[transform_x][transform_y]);
            tiles[x][y].render(x,y);
        }
    }
}

highscores = function() {

    highscore = parseInt(checkCookie("CB_moves_" + currentLevel,10000));
    if (movesArray[currentLevel] < highscore) {
        
        highscoreArray[currentLevel] = movesArray[currentLevel];
        setCookie("CB_moves_" + currentLevel,movesArray[currentLevel],30);
        setCookie("CB_path_" + currentLevel,pathArray[currentLevel],30);
        alert("New highscore! Level " + (currentLevel + 1) + " completed in " + movesArray[currentLevel] + " moves");
    }
}

toggleHelp = function() {

    if (help) {

        document.getElementById("help").style.display = "none";
        setCookie("CB_showHelp","false",30);
        help = false;
    } else {

        document.getElementById("help").style.display = "";
        setCookie("CB_showHelp","true",30);
        help = true;
    }
}

loadCookies = function() {

    visitedSite = checkCookie("CB_readCookies",false);

    if (visitedSite == false) {

        setCookie("CB_readCookies",true,30);
        alert("This site uses cookies to store the latest settings you've played with so you don't have to set them manually every time you play. No other information outside of the game will ever be saved.");
    }

    currentLevel = parseInt(checkCookie("CB_currentLevel",0));
    highestLevel = parseInt(checkCookie("CB_highestLevel",0));
    help = checkCookie("CB_showHelp","true") ;

    document.getElementById("levelCode").value = checkCookie("CB_exportedMap","");
    document.getElementById("pasteArea").value = decodeURIComponent(checkCookie("CB_savePaste",""));

    if (help == "true") { document.getElementById("help").style.display = ""; }
}

savePaste = function() {

    setCookie("CB_savePaste",encodeURIComponent(document.getElementById("pasteArea").value),30);
}

/*
window.onload = function() {

    createGrid();
    player = new playerObject();
}
*/

FPS = 60;
window.setInterval(gameLoop,1000/FPS);