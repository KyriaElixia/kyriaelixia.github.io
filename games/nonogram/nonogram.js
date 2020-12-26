gridSize = 5;
tileSize = 30;

mode = "light";
mouseDown = false;
clickDown = false;
hasClicked = false;
showSettigns = true;

mx = -1;
my = -1;

createGrid = function() {
    
    grid = new Array(gridSize);
    field = new Array(gridSize);
    for (a = 0; a < gridSize; a++) {
        grid[a] = new Array(gridSize);
        field[a] = new Array(gridSize);
        for (b = 0; b < gridSize; b++) {
            grid[a][b] = 0;
            field[a][b] = 0;
        }
    }
    setupGrid();
    //shuffle();
}

setupGrid = function() {

    document.getElementById("gameHolder").removeChild(document.getElementById("game"));
    game = document.createElement("table");
    game.id = "game";
    //game.style.border = "1px solid black";

    for (y = 0; y <= gridSize; y++) {
                       
        row = document.createElement("tr");
        
        for (x = 0; x <= gridSize; x++) {

            data = document.createElement("td");
            data.style.userSelect = "none";
            data.ondragstart = function(){ return false; };
            data.onddrop = function(){ return false; };
            
            if (x == 0 || y == 0) { // IF IN HINT ROW / COLUMN
                
                data.className = mode + "_hint";                
                
                if (x == 0 && y == 0) {
                    
                    data.className = "";
                    data.style.textAlign = "center";
                    settingsButton = document.createElement("button");
                    data.appendChild(settingsButton);

                    settingsButton.innerHTML = "Settings";
                    settingsButton.style.fontSize = tileSize/4;
                    settingsButton.id = "settingsButton";
                    settingsButton.onclick = function() { toggleSettings(); };
                }
                else if (x == 0) {

                    data.style.width = 2*tileSize;
                    data.style.height = tileSize;
                    data.id = "hint_R_"+(y-1);
                } else {

                    data.style.width = tileSize;
                    data.style.height = 2*tileSize;
                    data.id = "hint_C_"+(x-1);
                }

            } else { // IF IN GAMETABLE
                
                if (field[x-1][y-1] == 0) {
                    data.className = mode + "_off";
                }
                else if (field[x-1][y-1] == 1) {

                    data.className = mode + "_on";
                } 
                else {
                    data.className = mode + "_not";
                }

                data.id = "grid_"+(x-1)+"_"+(y-1);
                data.style.width = tileSize;
                data.style.height = tileSize;
                data.style.fontSize = tileSize/3;

                data.x = x-1;
                data.y = y-1;
                
                data.onmouseover = function() {                    

                    mx = this.x;
                    my = this.y;                    
                }
                data.onmouseout = function() {

                    mx = -1;
                    my = -1;
                }
            }
            row.appendChild(data);

            if (x > 0 && x % 5 == 0) {
                spacing = document.createElement("td");
                row.appendChild(spacing);
            }
        }
        game.appendChild(row);

        if (y > 0 && y % 5 == 0) {
            spacingRow = document.createElement("tr")
            spacing = document.createElement("td");
            spacingRow.appendChild(spacing);
            game.appendChild(spacingRow);
        } 
    }
    
    document.getElementById("gameHolder").appendChild(game);

    //setHints(); // this fucked shit up by adding two sets of tables with hints where one was empty
}

gameLoop = function() {

    if (mouseDown) {
        editTile();
        checkSolve();

    } else {
        clickDown = false;
    }

    if (tileSize != document.getElementById("tileSize").value) {
        tileSize = parseInt(document.getElementById("tileSize").value);        
        setupGrid();
        setHints();
        checkSolve();
        updateHints();
        document.getElementById("tileSizeLabel").innerHTML = tileSize + "px";
    }
    if (gridSize != document.getElementById("gridSize").value) {
        gridSize = parseInt(document.getElementById("gridSize").value);
        createGrid();
        shuffle();
        document.getElementById("gridSizeLabel").innerHTML = gridSize + "x" + gridSize;
    }
}

editTile = function() {

    if (mx != -1 && my != -1) {

        if (clickDown == false) {

            if (mouseType == "left") {

                if (field[mx][my] == 0) {

                    selected = 1;
                } 
                else if (field[mx][my] == 1) {
    
                    selected = 2;
    
                } else {
                    selected = 0;
                }
            }
            else if (mouseType == "right") {
                
                if (field[mx][my] == 0) {

                    selected = 2;
                } 
                else if (field[mx][my] == 1) {
    
                    selected = 0;
    
                } else {
                    selected = 1;
                }
            }

            if (hasClicked == false) {
                hasClicked = true;
            }
        }
        clickDown = true;

        field[mx][my] = selected;
        if (field[mx][my] == 1) {
            
            document.getElementById("grid_"+mx+"_"+my).className = mode + "_on";
        }
        else if (field[mx][my] == 2) {

            document.getElementById("grid_"+mx+"_"+my).className = mode + "_not";
        } else {

            document.getElementById("grid_"+mx+"_"+my).className = mode + "_off";
        }
    }
}

toggleMode = function(input) {

    if (input == "dark") {
        mode = "light";
    }
    else if (input == "light") {
        mode = "dark";
    }

    if (mode == "light") {

        mode = "dark";
    } else {

        mode = "light";
    } 
    document.body.className = mode + "_body";
    document.getElementById("port").className = mode + "_port";
    document.getElementById("settings").className = mode + "_settings";
    document.getElementById("message").className = mode + "_settings";
    setupGrid();
    setHints();
    checkSolve();
    updateHints();
}

exportGrid = function(doReturn) {

    exported = radix.convert(gridSize,10,32);

    widths = [5,4,3,2,1];
    
    for (w = 0; w < widths.length; w++) {
        if (gridSize % widths[w] == 0) {
            group = widths[w];
            break;
        }
    }

    base = Math.pow(2,group);

    for (y = 0; y < gridSize; y++) {
        for (x = 0; x < gridSize/group; x++) {
            
            slice = "";
            for (g = 0; g < group; g++) {

                if (grid[x*group+g][y] == 1) {

                    slice += "1";
                } else {

                    slice += "0";
                } 
            }
            exported += radix.convert(slice,2,base);
        }
    }
    if (doReturn == true) {
        
        return exported;
    } else {

        document.getElementById("port").value = exported;
    }
}

importGrid = function(levelCode) {

    if (levelCode.length > 0) {

        imported = levelCode;
    } else {

        imported = document.getElementById("port").value;
    }
    
    gridSize = parseInt(radix.convert(imported[0],32,10));
    document.getElementById("gridSize").value = gridSize;
    createGrid();
    imported = imported.slice(1);

    widths = [5,4,3,2,1];
    
    for (w = 0; w < widths.length; w++) {
        if (gridSize % widths[w] == 0) {
            group = widths[w];
            break;
        }
    }

    base = Math.pow(2,group);

    for (y = 0; y < gridSize; y++) {
        for (wg = 0; wg < gridSize/group; wg++) {

            zeros = "00000";
            slice = radix.convert(imported[y*gridSize/group + wg],base,2);
            if (slice.length != group) {
               slice = zeros.slice(0,group-slice.length) + slice; 
            }
            
            for (s = 0; s < slice.length; s++) {
            
                if (slice[s] == "1") {
                    grid[wg*group+s][y] = 1;                                    
                } else {
                    grid[wg*group+s][y] = 0;                    
                }
            }
        }
    }
    setHints();
    updateHints();
}   

shuffle = function() {

    doShuffle = true;
    if (hasClicked) {
        doShuffle = confirm("Are you sure you want to shuffle? This will clear the current game.")
    }

    if (doShuffle) {

        createGrid();
        tiles = Math.ceil(gridSize*gridSize/2);

        while (tiles > 0) {
            for (y = 0; y < gridSize; y++) {
                for (x = 0; x < gridSize; x++) {
                    
                    place = Math.floor(Math.random()*100);
                    if (place < 5 && grid[x][y] != 1) {
                        grid[x][y] = 1;
                        tiles--;
                    }
                }
            }
        }
        setHints();
        updateHints();
        hasClicked = false;
    }
}

setHints = function() {

    saved_R_hints = [];
    saved_C_hints = [];
    saved_C_checks = [];
    saved_R_checks = [];

    for (y = 0; y < gridSize; y++) { //ROW HINTS
        count = 0;
        hints = []; 
        for (x = 0; x < gridSize; x++) {
            
            if (grid[x][y] == 1) {
                count++;
            }
            else if (count > 0) {

                hints.push(count);
                count = 0;
            }            
        }
        if (count > 0) {

            hints.push(count);
            count = 0;
        }
        tbl = document.createElement("table");
        tbl.id = "u_hint_R_" + y;
        tbl.className = mode + "_hint";  //////////////////////////////////////////////////////////////////////////////
        tbl.align = "center";
        tblr = document.createElement("tr");
        tbl.appendChild(tblr);
        hint = "";      
        for (l = 0; l < hints.length; l++) {
            tbld = document.createElement("td");
            tbld.innerHTML = hints[l];
            tbld.style.fontSize = tileSize/3;
            tblr.appendChild(tbld);
            hint += hints[l];
        } 
        saved_R_hints.push(hint);
        document.getElementById("hint_R_" + y).appendChild(tbl);               
    }

    for (x = 0; x < gridSize; x++) { // COLUMN HINTS
        count = 0;
        hints = []; 
        for (y = 0; y < gridSize; y++) {

            if (grid[x][y] == 1) {
                count++;
            }
            else if (count > 0) {

                hints.push(count);
                count = 0;
            }            
        }
        if (count > 0) {

            hints.push(count);
            count = 0;
        }
        tbl = document.createElement("table");
        tbl.align = "center";
        tbl.id = "u_hint_C_" + x;
        tbl.className = mode + "_hint";  //////////////////////////////////////////////////////////////////////////////
        hint = "";
        for (l = 0; l < hints.length; l++) {
            tblr = document.createElement("tr");
            tbl.appendChild(tblr);
            tbld = document.createElement("td");
            tbld.innerHTML = hints[l];
            tbld.style.fontSize = tileSize/3;
            tblr.appendChild(tbld);   
            hint += hints[l];         
        }
        saved_C_hints.push(hint);
        document.getElementById("hint_C_" + x).appendChild(tbl);        
    }
    document.getElementById("message").innerHTML = "";
}

updateHints = function() {

    //console.log("bing")
    for (u = 0; u < gridSize; u++) {

        if (saved_C_hints[u] == saved_C_checks[u]) {

            document.getElementById("u_hint_C_" + u).className = mode + "_hint_done";
        } else {

            document.getElementById("u_hint_C_" + u).className = mode + "_hint";
        }

        if (saved_R_hints[u] == saved_R_checks[u]) {
            
            document.getElementById("u_hint_R_" + u).className = mode + "_hint_done";
        } else {

            document.getElementById("u_hint_R_" + u).className = mode + "_hint";
        }
    }    
}

GTF = function() { // GRID TO FIELD CHECK   

    for (x = 0; x < gridSize; x++) {        
        for (y = 0; y < gridSize; y++) {

            if (grid[x][y] == 1) {
                document.getElementById("grid_"+x+"_"+y).className = "light_not";
            }
        }
    }
}

checkSolve = function() {

    saved_R_checks = [];
    saved_C_checks = [];

    for (y = 0; y < gridSize; y++) { //ROW CHECK
        count = 0;
        checks = []; 
        for (x = 0; x < gridSize; x++) {
            
            if (field[x][y] == 1) {
                count++;
            }
            else if (count > 0) {

                checks.push(count);
                count = 0;
            }            
        }
        if (count > 0) {

            checks.push(count);
            count = 0;
        }
        check = "";
        for (l = 0; l < checks.length; l++) {
            check += checks[l];
        }     
        saved_R_checks.push(check);                     
    }

    for (x = 0; x < gridSize; x++) { // COLUMN CHECK
        count = 0;
        checks = []; 
        for (y = 0; y < gridSize; y++) {

            if (field[x][y] == 1) {
                count++;
            }
            else if (count > 0) {

                checks.push(count);
                count = 0;
            }            
        }
        if (count > 0) {

            checks.push(count);
            count = 0;
        } 
        check = "";
        for (l = 0; l < checks.length; l++) {
            check += checks[l];
        }     
        saved_C_checks.push(check);
    }

    updateHints();
}

checkButton = function() {

    checkSolve();

    solved = true;
    for (s = 0; s < gridSize; s++) {

        if (saved_C_hints[s] != saved_C_checks[s]) {
            
            solved = false;
        }
        if (saved_R_hints[s] != saved_R_checks[s]) {
            
            solved = false;
        }
    }
    if (solved) {
        document.getElementById("message").innerHTML = "Completed!";
    } else {
        document.getElementById("message").innerHTML = "Not solved yet!";
    }
}

clearGrid = function() {

    doClear = true;
    if (hasClicked) {
        doClear = confirm("Are you sure you want to clear?")
    }

    if (doClear) {
            
        for (y = 0; y < gridSize; y++) {
            for (x = 0; x < gridSize; x++) {
    
                field[x][y] = 0;
                document.getElementById("grid_"+x+"_"+y).className = mode + "_off";
            }
        }
    }
}

getShareURL = function(doReturn) {

    share = "https://kyriaelixia.github.io/server/games/nonogram/?" + exportGrid(true);

   link = document.createElement('textarea');
   link.value = share;
   link.setAttribute('readonly', '');
   link.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(link);
   link.select();
   document.execCommand('copy');
   document.body.removeChild(link);

    if (doReturn == true) {

        return share;
    }
}

toggleSettings = function() {

    if (showSettigns){

        document.getElementById("settings").style.display = "none";
        showSettigns = false;
    } else {

        document.getElementById("settings").style.display = "";
        showSettigns = true;
    }
} 

window.onload = function() {
    

    url = window.location.href;
    params = url.split('?');
    
    if (params[1] != null) {
        FC = parseInt(radix.convert(params[1][0],32,10)); //First Character
    } else {
        FC = 3;
    }

    if (params.length > 1 && (params[1].length - 1) == (FC * FC/5)) {

        importGrid(params[1]);

        document.getElementById("gridSize").value = gridSize;
        document.getElementById("tileSize").value = tileSize;
    } else {

        document.getElementById("gridSize").value = gridSize;
        document.getElementById("tileSize").value = tileSize;

        createGrid();
        shuffle();

        if (params[1] != null && (params[1].length - 1) != (FC * FC/5)) {

            document.getElementById("message").innerHTML = "Invalid puzzle link";
        }
    }
    document.getElementById("gridSizeLabel").innerHTML = gridSize + "x" + gridSize;   
};
window.onmousedown = function (e) {

    if (e.which == 1) { //left click

        mouseDown = true;
        mouseType = "left";

    }
    else if (e.which == 3 ) { //right click

        mouseDown = true;
        mouseType = "right";
    }
};

window.onmouseup = function() {
    mouseDown = false;
};
window.oncontextmenu = function() { return false; }

FPS = 60;
window.setInterval(gameLoop,1000/FPS);