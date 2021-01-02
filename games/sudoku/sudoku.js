size = 120;
ratio = 50;
solves = 0;

smallSpacer = size / ratio //- size % ratio;
bigSpaceer = smallSpacer;

fucks = 0;
tile = function() {

    this.value = 0;
    this.element = 0;
}

boop = function () {
    fucks++;
    console.log(fucks," fuckers");
    boop();
}


grid = new Array(9);
for (i = 0; i < 9; i++) {
    grid[i] = new Array(9);
    for (j = 0; j < 9; j++) {

        grid[i][j] = new tile();
    }
}

/*
load = [[6, 3, 0, 0, 4, 0, 0, 0, 0],
        [0, 5, 0, 0, 7, 3, 4, 0, 0],
        [0, 0, 9, 0, 0, 0, 0, 0, 8],
        [0, 0, 1, 0, 0, 0, 0, 6, 0],
        [0, 0, 4, 0, 5, 0, 3, 0, 0],
        [0, 7, 0, 0, 0, 0, 2, 0, 0],
        [2, 0, 0, 0, 0, 0, 7, 0, 0],
        [0, 0, 3, 8, 6, 0, 0, 9, 0],
        [0, 0, 0, 0, 9, 0, 0, 0, 1]];
*/

load = [[5,3,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],
        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],
        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9]]

for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
        
        grid[i][j].value = load[j][i];
    }
}


createGrid = function() {

    h_offset = 1/2 * (size * 9 + 2 * bigSpaceer + 8 * smallSpacer)
    background = document.createElement("div");
    background.style.backgroundColor = "black";
    background.style.width = 2 * h_offset + 2 * smallSpacer;
    background.style.height = 2 * h_offset + 2 * smallSpacer;
    background.style.left = -h_offset - smallSpacer;
    background.style.position = "absolute";
    document.getElementById("game").appendChild(background);

    for (y = 0; y < 9; y++) {
        for (x = 0; x < 9; x++) {

            grid[x][y].element = document.createElement("div");
            grid[x][y].element.className = "tile";
            grid[x][y].element.style.width = size;
            grid[x][y].element.style.height = size;
            grid[x][y].element.style.left = size * x + bigSpaceer * (x -  x % 3) / 3 + smallSpacer * x - h_offset;
            grid[x][y].element.style.top  = size * y + bigSpaceer * (y -  y % 3) / 3 + smallSpacer * y + smallSpacer;
            grid[x][y].element.style.backgroundColor = "white";
            
            document.getElementById("game").appendChild(grid[x][y].element);
        }
    }
}

canPlace = function(x, y, v) {

    for (p = 0; p < 9; p++) {
        if (grid[x][p].value == v) {
            
            return false;
        }
    }
    for (p = 0; p < 9; p++) {
        if (grid[p][y].value == v) {
            
            return false;
        }
    }

    X0 = x - x % 3;
    Y0 = y - y % 3;
    for (Y = Y0; Y < Y0 + 3; Y++) {
        for (X = X0; X < X0 + 3; X++) {
            if (grid[X][Y].value == v) {
                
                return false;
            }
        }
    }
    return true;
}

solve = function() {

    for (y = 0; y < 9; y++) {
        for (x = 0; x < 9; x++) {
            if (grid[x][y].value == 0) {
                console.log("at: x=" + x + ", y=" + y); //PRINTOUT
                for (v = 1; v < 10; v++) {
                    if (canPlace(x,y,v)) {

                        console.log("placed", x, y, v, solves);

                        grid[x][y].value = v;
                        solves++;
                        solve();
                        
                        grid[x][y].value = 0;
                    }
                }
                return 1;
            }
        } 
    }
    printf();
    alert(solves);
    return 2;
}

printf = function() {

    line = "";
    for (YY = 0; YY < 9; YY++) {
        for (XX = 0; XX < 9; XX++) {

            line += grid[XX][YY].value + " ";
            if (XX % 3 - 2== 0) {
                line += "  ";
            }
        }

        line += "\n";
        if (YY % 3 - 2 == 0) {
            line += "\n";
        }
    }
    console.log(line)
}

test = function() {

    printf();
    solve();
}  



window.onload = function() {

    createGrid();
}