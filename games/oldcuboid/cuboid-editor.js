game = new RoboroCanvas('cuboid');
keyDown = false;

window.addEventListener('keydown', function (e) {
    keyDown = e.keyCode;
});
window.addEventListener('keyup', function (e) {
    keyDown = false;
});

size = 30;
width = 20;
height = 20;

p1x = 0;
p1y = 0;
p2x = 0;
p2y = 0;
startX = 0;
startY = 0;
endX = 0;
endY = 0;
status = 0;
moves = 0;

playTest = false;
startTile = false;
endTile = false;
selected = "v";

keyPress = false;
mousePress = false;
game.updatesPerSecond = 30;
time = 0;
timer = 0;

grid = new Array(height);
saved = new Array(height);

for (i = 0; i < height; i++) {
    grid[i] = new Array(width);
    saved[i] = new Array(width);

    for (j = 0; j < width; j++) {
        grid[i][j] = "v";
        saved[i][j] = grid[i][j];
    }
}

game.update = function() {

    game.keyboardInput(); 

    if (playTest == true) {

        game.timeCounter();
    }
    else {

        selected = document.getElementById("selector").selectedTile.value;
        game.mouseInput();
    }

   document.getElementById("moves").innerHTML = moves + " Moves";
};

game.check = function() {

    moves++;
    game.gameRules();
    game.clearScreen();
    game.render();    
};

game.mouseInput = function() {
    
    if (game.mouse.left == true) {

        mouseX = (game.mouse.x/size)-(game.mouse.x/size)%1;
        mouseY = (game.mouse.y/size)-(game.mouse.y/size)%1;
            
        if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
            
            if (selected != "x" && selected != "y" && selected != "z" && selected != "p" && selected != "s" && selected != "e") {
                
                if (grid[mouseY][mouseX] == "s") {
                    startTile = false;
                }
                else if (grid[mouseY][mouseX] == "e") {
                    endTile = false;
                }
                grid[mouseY][mouseX] = selected;
            }
            else {

                if (mousePress == false) {
                    
                    if (selected == "s" && startTile == false) {

                        startTile = true;
                        grid[mouseY][mouseX] = selected;
                    }
                    else if (selected == "e" && endTile == false) {

                        endTile = true;
                        grid[mouseY][mouseX] = selected;
                    }
                    else {

                        if (grid[mouseY][mouseX].length > 1) {

                            foundAttribute = false;
                            for (i = 2; i < grid[mouseY][mouseX].length; i++) {
                                
                                if (grid[mouseY][mouseX].charAt(i) == selected) {

                                    foundAttribute = true;
                                }
                                
                            }
                            if (foundAttribute == true) {
                                newString = "";
                                for (i = 0; i < grid[mouseY][mouseX].length; i++) {

                                    if (grid[mouseY][mouseX].charAt(i) != selected) {

                                        newString += grid[mouseY][mouseX].charAt(i);
                                    }
                                }
                                grid[mouseY][mouseX] = newString;
                            }
                            else {
                                grid[mouseY][mouseX] += selected;
                            }
                        }
                    }
                }
                mousePress = true;
            }
            game.render();
        }
    }
    else {
        mousePress = false;
    }
};

game.keyboardInput = function() {

    if ((keyDown == 83 || keyDown == 40) && playTest == true) { //S
        
        if (keyPress == false) {
            
            if (status == 0) {
                p1y += 1;
                p2y += 2;
                status = 1;
            }
            else if (status == 1) {
                p1y += 2;
                p2y += 1;
                status = 0;
            }
            else {
                p1y += 1;
                p2y += 1;
            }
            game.check();
        }
        keyPress = true;
    }
    else if ((keyDown == 65 || keyDown == 37) && playTest == true) { //A

        if (keyPress == false) {
            
            if (status == 0) {
                p1x -= 2;
                p2x -= 1;
                status = 2;
            }
            else if (status == 1) {
                p1x -= 1;
                p2x -= 1;
            }
            else {
                p1x -= 1;
                p2x -= 2;
                status = 0;
            }
            game.check();
        }
        keyPress = true;
    }
    else if ((keyDown == 68 || keyDown == 39) && playTest == true) { //D

        if (keyPress == false) {
            
            if (status == 0) {
                p1x += 1;
                p2x += 2;
                status = 2;
            }
            else if (status == 1) {
                p1x += 1;
                p2x += 1;
            }
            else {
                p1x += 2;
                p2x += 1;
                status = 0;
            }
            game.check();
        }
        keyPress = true;
    }
    else if ((keyDown == 87 || keyDown == 38) && playTest == true) { //W

        if (keyPress == false) {
            
            if (status == 0) {
                p1y -= 2;
                p2y -= 1;
                status = 1;
            }
            else if (status == 1) {
                p1y -= 1;
                p2y -= 2;
                status = 0;
            }
            else {
                p1y -= 1;
                p2y -= 1;
            }
            game.check();
        }
        keyPress = true;
    }
    else if (keyDown == 84) { //T

        if (keyPress == false) {

            if (playTest == false) {

                for (x = 0; x < width; x++) {
                    for (y = 0; y < height; y++) {

                        if (grid[y][x] == "s") {
                            startX = x;
                            startY = y;
                        }
                        saved[y][x] = grid[y][x];
                    }
                }

                playTest = true;
                time = 0;
                timer = 0;
                moves = 0;
                status = 0;

                p1x = startX;
                p2x = startX;
                p1y = startY;
                p2y = startY;

                document.getElementById("time").innerHTML = game.timeConverter(time);
                document.getElementById("level").innerHTML = "Playtesting mode";

                game.render()
            }
            else {

                for (x = 0; x < width; x++) {
                    for (y = 0; y < height; y++) {

                        if (grid[y][x] == "s") {
                            startX = x;
                            startY = y;
                        }
                        grid[y][x] = saved[y][x];
                    }
                }

                playTest = false;
                document.getElementById("level").innerHTML = "Editing mode";
                game.render();
            }
        }
        keyPress = true;
    }
    else {

        keyPress = false;
    }
};

game.gameRules = function() {

    if (p1x < 0 || p1x >= width || p2x < 0 || p2x >= width || p1y < 0 || p1y >= height || p2y < 0 || p2y >= height) {

        p1x = startX;
        p2x = startX;
        p1y = startY;
        p2y = startY;
        status = 0;

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                grid[y][x] = saved[y][x];
            }
        }
    }
    else if (grid[p1y][p1x] == "v" || grid[p2y][p2x] == "v" || grid[p1y][p1x].substring(0,2) == "do" || grid[p2y][p2x].substring(0,2) == "do" || (p1x == p2x && p1y == p2y && grid[p1y][p1x] == "w")) {

        p1x = startX;
        p2x = startX;
        p1y = startY;
        p2y = startY;
        status = 0;

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                grid[y][x] = saved[y][x];
            }
        }
    }
    else if (grid[p1y][p1x] == "e" && grid[p2y][p2x] == "e") {

        game.writeLevelCode();
    }
    else if (grid[p1y][p1x].substring(0,2) == "bg" && grid[p2y][p2x].substring(0,2) == "bg") {

        game.buttonPress(p1x,p1y);
    }
    else if (grid[p1y][p1x].substring(0,2) == "bb" || grid[p2y][p2x].substring(0,2) == "bb") {

        if (grid[p1y][p1x].substring(0,2) == "bb") {

            game.buttonPress(p1x,p1y);
        }
        if (grid[p2y][p2x].substring(0,2) == "bb") {
    
            game.buttonPress(p2x,p2y);
        }
    }
};

game.buttonPress = function(x,y) {

    buttonAttributes = new Array(grid[y][x].substring(2,grid[y][x].length).length);
    
    singleUse = false;
    for (i = 2; i < grid[y][x].length; i++) {
        
        if (grid[y][x].charAt(i) == "p") {
            singleUse = true;
        }
        else {
            buttonAttributes[i-2] = grid[y][x].charAt(i);
        }
    }
    if (singleUse == true) {
        grid[y][x] = grid[y][x].substring(0,2);
    }
    for (i = 0; i < buttonAttributes.length; i++) {

        for (xx = 0; xx < width; xx++) {
            for (yy = 0; yy < height; yy++) {
                
                if (grid[yy][xx].substring(0,2) == "do") {

                    doorStatusChange = false;
                    singleUse = false;
                    for (j = 2; j < grid[yy][xx].length; j++) {

                        if (grid[yy][xx].charAt(j) == buttonAttributes[i]) {
                                                        
                            grid[yy][xx] = "dc" + grid[yy][xx].substring(2,grid[yy][xx].length);
                            doorStatusChange = true;                                                        
                        }
                        else if (grid[yy][xx].charAt(j) == "p") {
                            singleUse = true;
                        }
                        if (doorStatusChange == true && singleUse == true) {
                            grid[yy][xx] = "dc";
                        }
                    }
                }
                else if (grid[yy][xx].substring(0,2) == "dc") {

                    doorStatusChange = false;
                    singleUse = false;
                    for (j = 2; j < grid[yy][xx].length; j++) {

                        if (grid[yy][xx].charAt(j) == buttonAttributes[i]) {
                                                        
                            grid[yy][xx] = "do" + grid[yy][xx].substring(2,grid[yy][xx].length);
                            doorStatusChange = true;                                                        
                        }
                        else if (grid[yy][xx].charAt(j) == "p") {
                            singleUse = true;
                        }
                        if (doorStatusChange == true && singleUse == true) {
                            grid[yy][xx] = "do";
                        }
                    }
                }
            }
        }
    }
};

game.writeLevelCode = function() {

    startingX = 0;
    startingY = 0;
    endingX = width;
    endingY = height;

    for (h = 0; h < height; h++) {

        count = 0;
        for (b = 0; b < width; b++) {

            if (saved[h][b] == "v") {
                count++;
            }
        }
        if (count == width) {
            
        }
    }

    print = document.getElementById("levelCode");
    print.innerHTML = "";

    for(yyy = startingY; yyy < endingY; yyy++) {

        print.innerHTML += "grid["+yyy+"] = [";
        for (xxx = startingX; xxx < endingX; xxx++) {
            
            print.innerHTML += "\""+saved[yyy][xxx]+"\"";
            if (xxx != endingX-1) {
                print.innerHTML += ",";
            }
        }
        print.innerHTML += "];";
        print.innerHTML += "<br>";
    }
};

game.render = function() {

    game.clearScreen();

    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            
            if (grid[y][x] == "t" || grid[y][x] == "s") {
                game.picture(x*size,y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/tile.png",size,size);

                if (grid[y][x] == "s" && playTest == false) {
                    game.picture(x*size,y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/player-top.png",size,size);
                }
            }
            else if (grid[y][x] == "e") {
                game.picture(x*size,y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/end-tile.png",size,size);
            }
            else if (grid[y][x] == "w") {
                game.picture(x*size,y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/weak-tile.png",size,size);
            }
            else if (grid[y][x].substring(0,2) == "do") {
                game.picture(x*size,y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/open-door.png",size,size);
            }
            else if (grid[y][x].substring(0,2) == "dc") {
                game.picture(x*size,y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/closed-door.png",size,size);
            }
            else if (grid[y][x].substring(0,2) == "bb") {
                game.picture(x*size,y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/blue-button.png",size,size);
            }
            else if (grid[y][x].substring(0,2) == "bg") {
                game.picture(x*size,y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/green-button.png",size,size);
            }
            else {
                //just here for aesthetics
            }

            if (playTest == false) {

                if (grid[y][x].length > 2) {
                    
                    game.text((x+0.1)*size,(y+0.4)*size,12,grid[y][x].charAt(2),"black");
                }
                if (grid[y][x].length > 3) {
                    
                    game.text((x+0.6)*size,(y+0.4)*size,12,grid[y][x].charAt(3),"black");
                }
                if (grid[y][x].length > 4) {
                    
                    game.text((x+0.1)*size,(y+0.8)*size,12,grid[y][x].charAt(4),"black");
                }
                if (grid[y][x].length > 5) {
                    
                    game.text((x+0.6)*size,(y+0.8)*size,12,grid[y][x].charAt(5),"black");
                }

            }
        }
    }

    if (playTest == true) {

        if (status == 0) {

            game.picture(p1x*size,p1y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/player-top.png",size,size);
        }
        else if (status == 1) {

            game.picture(p1x*size,p1y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/player-up.png",size,size);
            game.picture(p2x*size,p2y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/player-down.png",size,size);
        }
        else {

            game.picture(p1x*size,p1y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/player-left.png",size,size);
            game.picture(p2x*size,p2y*size,"https://kyriaelixia.github.io/server/spel/sprites/cuboid/player-right.png",size,size);
        }
    }
};

game.timeConverter = function(convert) {

    min = Math.floor(convert / 60);
    sec = convert % 60;

    if (min >= 10) {
        //only necessary to stop else(if)
    }
    else if (min > 0) {
        min = "0" + min;
    }
    else {
        min = "00";
    }

    if (sec >= 10) {
        //only necessary to stop else(if)
    }
    else if (sec > 0) {
        sec = "0" + sec;
    }
    else {
        sec = "00";
    }

    return (min + ":" + sec);
};

game.timeCounter = function() {

    if (timer == game.updatesPerSecond) {

        timer = -1;
        time++;
        document.getElementById("time").innerHTML = game.timeConverter(time);
    }
    timer++;
};

game.render();