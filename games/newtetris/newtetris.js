theWidth = 0;
theHeight = 0;
realWidth = window.innerWidth;
realHeight = window.innerHeight;

playWidth = 10;
playHeight = 20;
playHidden = 4;

players = [];
checkTotalPlayers = 1;

doDebug = false;
doSetup = false;
lineClearTimeDiv = 3;

paused = true;
first = true;
canUnpause = true;

changeControlsCheck = false;
whatOption = 0;

defaultControls = [
    { "rL": "q", "rR": "w", "mL": "a", "mR": "d", "hP": "f", "fD": "s", "hD": "space" },
    { "rL": "dash", "rR": "up", "mL": "left", "mR": "right", "hP": "shift", "fD": "down", "hD": "enter" }
];

controlTranslate = { "rL": "rotateL", "rR": "rotateR", "mL": "moveL", "mR": "moveR", "hP": "hold", "fD": "fastDrop", "hD": "hardDrop" }

wallKicks = {
    "right": [[[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]],
    "left": [[[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]]
};
wallKicksSpecI = {
    "right": [[[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]], [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]], [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]], [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]],
    "left": [[[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]], [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]], [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]], [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]]]
};

Ioffset = {
    "right": [[0,0],[0,0],[0,0],[0,0]],
    "left": [[0,0],[0,0],[0,0],[0,0]]
};

options = {
    "samePieces": true,
    "canHold": true,
    "previewPieces": 4,
    "ghosts": true,
    "combos": false,
    "increaseDifficulty": false,
    "startingLevel": 1,
    "totalPlayers": 2
};

criticalOptions = ["samePieces", "combos", "increaseDifficulty", "startingLevel", "totalplayers"];

updatesPerSecond = 300;
clock = setInterval(update, 1000 / updatesPerSecond);

function start() {

    realWidth = window.innerWidth;
    realHeight = window.innerHeight;

    if (realWidth / realHeight != 16 / 9) {

        if (realWidth < 16 * (realHeight / 9)) {

            theHeight = 9 * (realWidth / 16);
            theWidth = realWidth;
        }
        else {

            theWidth = 16 * (realHeight / 9);
            theHeight = realHeight;
        }
    }
    else {

        theWidth = realWidth;
        theHeight = realHeight;
    }

    scaler = 3;
    size = Math.round(Math.round(theWidth / 16) / scaler);
    //size = (theWidth / 16)/scaler;
}

function update() {

    if (realWidth != window.innerWidth || realHeight != window.innerHeight) {

        start()
        console.log("ding")
    }

    if (!paused) {

        if (doSetup) {

            setupRender();
            createPieceOrder(options["samePieces"]);
            doSetup = false;
        }

        for (p = 0; p < players.length; p++) {

            players[p].update();
        }
    }
    else if (changeControlsCheck) {

        changeControls("enter");
    }
    else {

        optionCompatibility();

        if (checkTotalPlayers != document.getElementById("totalPlayers").value) {

            checkTotalPlayers = document.getElementById("totalPlayers").value;
            setupControls();
        }
    }

    if (doDebug) {

    }
}

unpause = function () {

    if (first) {

        restart();
        first = false;
    }

    if (paused) {

        if (canUnpause) {

            paused = false;
            document.getElementById("game-holder").style.display = "";
            document.getElementById("options").style.display = "none";
            document.getElementById("pause").innerHTML = "Pause";
            document.getElementById("restart").style.display = "none";
            document.getElementById("pause").blur();
            updateOptions();
        }
    }
    else {

        paused = true;
        document.getElementById("game-holder").style.display = "none";
        document.getElementById("options").style.display = "";
        document.getElementById("pause").innerHTML = "Unpause";
        document.getElementById("restart").style.display = "";
    }
}

optionCompatibility = function () {

    document.getElementById("text_previewPieces").innerHTML = document.getElementById("previewPieces").value + " | Preview pieces"
    document.getElementById("text_startingLevel").innerHTML = document.getElementById("startingLevel").value + " | Starting level"
    document.getElementById("text_totalPlayers").innerHTML = document.getElementById("totalPlayers").value + " | Players"

    compatible = true;

    if (options["samePieces"] != document.getElementById("samePieces").checked) { compatible = false; }
    if (options["combos"] != document.getElementById("combos").checked) { compatible = false; }
    if (options["increaseDifficulty"] != document.getElementById("increaseDifficulty").checked) { compatible = false; }
    if (options["startingLevel"] != document.getElementById("startingLevel").value) { compatible = false; }
    if (options["totalPlayers"] != document.getElementById("totalPlayers").value) { compatible = false; }

    if (compatible) {

        canUnpause = true;
    }
    else {

        canUnpause = false;
    }

    if (!first) {

        document.getElementById("pause").disabled = !canUnpause;

        if (!canUnpause) {

            document.getElementById("optionError").innerHTML = "Some changed options require a restart";
            document.getElementById("revert").style.display = "";
            document.getElementById("restart").innerHTML = "Play with new options";
        }
        else {

            document.getElementById("optionError").innerHTML = "";
            document.getElementById("revert").style.display = "none";
            document.getElementById("restart").innerHTML = "Restart";
        }
    }    
}

restart = function () {

    players = [];

    canUnpause = true;
    updateOptions();
    if (!first) {
        unpause();
    }

    start();
    //players.push(new player(2, 2, 1, players.length))
    for (tp = 0; tp < options["totalPlayers"]; tp++) {
        addPlayer(2 + 22 * tp, 2);
    }

    setupRender();
    doSetup = true;

    createPieceOrder(options["samePieces"]);
    for (tp = 0; tp < options["totalPlayers"]; tp++) {
        players[tp].pieces.push(new piece(players[tp].pieceList[0], 4, -1));
        players[tp].pieceList.splice(0,1);
    }

}

updateOptions = function () {

    options["samePieces"] = document.getElementById("samePieces").checked;
    options["canHold"] = document.getElementById("canHold").checked;
    options["previewPieces"] = document.getElementById("previewPieces").value;
    options["ghosts"] = document.getElementById("ghosts").checked;
    options["combos"] = document.getElementById("combos").checked;
    options["increaseDifficulty"] = document.getElementById("increaseDifficulty").checked;
    options["startingLevel"] = document.getElementById("startingLevel").value;
    options["totalPlayers"] = document.getElementById("totalPlayers").value;

    optionCompatibility();
}

revertOptions = function () {

    document.getElementById("samePieces").checked = options["samePieces"];
    document.getElementById("combos").checked = options["combos"];
    document.getElementById("increaseDifficulty").checked = options["increaseDifficulty"];
    document.getElementById("startingLevel").value = options["startingLevel"];
    document.getElementById("totalPlayers").value = options["totalPlayers"];
}

setupRender = function () {

    document.getElementById("game-holder").removeChild(document.getElementById("game"))
    theGame = document.createElement("div");
    theGame.id = "game"
    document.getElementById("game-holder").appendChild(theGame);

    // playfield
    for (s = 0; s < players.length; s++) {
        for (w = 0; w < playWidth; w++) {
            for (h = 0; h < playHeight; h++) {

                pxImg = document.createElement("img");
                pxImg.src = "http://elixia.spelar.se/games/minesweeper/sprites/tiles/open-tile.png";
                pxImg.width = players[s].zoom;
                pxImg.height = players[s].zoom;
                pxImg.style.left = players[s].x + w * players[s].zoom;
                pxImg.style.top = players[s].y + h * players[s].zoom;
                pxImg.style.position = "absolute";
                pxImg.id = "game_" + s + "_" + w + "_" + h;
                pxImg.draggable = false;
                pxImg.ondrop = false;

                theGame.appendChild(pxImg);

                if (doDebug) {
                    textBox = document.createElement("span");
                    textBox.style.left = players[s].x + w * players[s].zoom;
                    textBox.style.top = players[s].y + h * players[s].zoom;
                    textBox.innerHTML = w+"."+h;
                    textBox.style.position = "absolute";
                    textBox.style.fontSize = players[s].zoom/4;
                    textBox.style.color = "black";
                    textBox.style.width = playWidth * players[s].zoom
                    textBox.className = "menlo";

                    theGame.appendChild(textBox);
                }
            }
        }
    }
    //border
    for (s = 0; s < players.length; s++) {
        for (n = 0; n < 2; n++) {
            for (w = -1; w < playWidth + 1; w++) {

                pxImg = document.createElement("img");
                pxImg.width = players[s].zoom;
                pxImg.height = players[s].zoom;
                pxImg.style.left = players[s].x + w * players[s].zoom;
                pxImg.style.top = players[s].y + (n * (playHeight + 1) - 1) * players[s].zoom;
                pxImg.style.position = "absolute";
                //pxImg.id = "border_"+s+"_"+w+"_"+(n*playWidth);
                pxImg.draggable = false;
                pxImg.ondrop = false;

                if (w == -1) {

                    if (n == 0) {

                        pxImg.src = "http://elixia.spelar.se/games/minesweeper/sprites/frame/corner-es";
                    }
                    else {

                        pxImg.src = "http://elixia.spelar.se/games/minesweeper/sprites/frame/corner-ne";
                    }
                }
                else if (w == playWidth) {

                    if (n == 0) {

                        pxImg.src = "http://elixia.spelar.se/games/minesweeper/sprites/frame/corner-sw";
                    }
                    else {

                        pxImg.src = "http://elixia.spelar.se/games/minesweeper/sprites/frame/corner-nw";
                    }
                }
                else {
                    pxImg.src = "http://elixia.spelar.se/games/minesweeper/sprites/frame/line-h";
                }

                theGame.appendChild(pxImg);
            }
            for (h = 0; h < playHeight; h++) {

                pxImg = document.createElement("img");
                pxImg.src = "http://elixia.spelar.se/games/minesweeper/sprites/frame/line-v";
                pxImg.width = players[s].zoom;
                pxImg.height = players[s].zoom;
                pxImg.style.left = players[s].x + (n * (playWidth + 1) - 1) * players[s].zoom;
                pxImg.style.top = players[s].y + h * players[s].zoom;
                pxImg.style.position = "absolute";
                //pxImg.id = "border_"+s+"_"+w+"_"+h;
                pxImg.draggable = false;
                pxImg.ondrop = false;

                theGame.appendChild(pxImg);
            }
        }
    }

    deScale = 1;
    offset = 2;
    // piece preview
    for (s = 0; s < players.length; s++) {
        for (w = 0; w < 4; w++) {
            for (h = 0; h < 11; h++) {

                ppImg = document.createElement("img");
                ppImg.src = "http://elixia.spelar.se/games/newtetris/sprites/transparent.png";
                ppImg.width = players[s].zoom / deScale;
                ppImg.height = players[s].zoom / deScale;
                ppImg.style.left = players[s].x + (playWidth + offset) * players[s].zoom + w * players[s].zoom / deScale;
                ppImg.style.top = players[s].y + playHeight * players[s].zoom - 12 * players[s].zoom / deScale + h * players[s].zoom / deScale;
                ppImg.style.position = "absolute";
                ppImg.id = "preview_" + s + "_" + w + "_" + h;
                ppImg.draggable = false;
                ppImg.ondrop = false;

                theGame.appendChild(ppImg);
            }
        }
        textBox = document.createElement("span");
        textBox.style.left = players[s].x + (playWidth + offset) * players[s].zoom;
        textBox.style.top = players[s].y + (playHeight) * players[s].zoom;
        textBox.innerHTML = "Preview";
        textBox.style.position = "absolute";
        textBox.style.fontSize = players[s].zoom/(3/2);
        textBox.style.color = "white";
        textBox.style.width = playWidth * players[s].zoom
        textBox.className = "menlo";

        theGame.appendChild(textBox);
    }


    // hold preview
    for (s = 0; s < players.length; s++) {
        for (w = 0; w < 4; w++) {
            for (h = 0; h < 2; h++) {

                hpImg = document.createElement("img");
                hpImg.src = "http://elixia.spelar.se/games/newtetris/sprites/transparent.png";
                hpImg.width = players[s].zoom / deScale;
                hpImg.height = players[s].zoom / deScale;
                hpImg.style.left = players[s].x + (playWidth + offset) * players[s].zoom + w * players[s].zoom / deScale;
                hpImg.style.top = players[s].y + players[s].zoom + h * players[s].zoom / deScale;
                hpImg.style.position = "absolute";
                hpImg.id = "holding_" + s + "_" + w + "_" + h;
                hpImg.draggable = false;
                hpImg.ondrop = false;

                theGame.appendChild(hpImg);
            }
        }
        textBox = document.createElement("span");
        textBox.style.left = players[s].x + (playWidth + offset) * players[s].zoom;
        textBox.style.top = players[s].y + (4) * players[s].zoom;
        textBox.innerHTML = "Hold";
        textBox.style.position = "absolute";
        textBox.style.fontSize = players[s].zoom/(3/2);
        textBox.style.color = "white";
        textBox.style.width = playWidth * players[s].zoom
        textBox.className = "menlo";

        theGame.appendChild(textBox);
    }

    textBoxes = ["lines", "score", "level"];
    textMsg = ["Lines: 0", "Score: 0", "Level: " + options["startingLevel"]];
    for (b = 0; b < textBoxes.length; b++) {
        for (s = 0; s < players.length; s++) {

            textBox = document.createElement("span");
            textBox.style.left = players[s].x;
            textBox.style.top = players[s].y + (playHeight + 1 + b) * players[s].zoom;
            textBox.innerHTML = textMsg[b];
            textBox.style.position = "absolute";
            textBox.style.fontSize = players[s].zoom
            textBox.style.color = "white";
            textBox.id = textBoxes[b] + "_" + s
            textBox.style.width = playWidth * players[s].zoom
            textBox.className = "menlo";

            theGame.appendChild(textBox);
        }
    }
}

setupControls = function () {

    document.getElementById("controls-holder").removeChild(document.getElementById("controls"));

    cTable = document.createElement("table");
    cTable.id = "controls";
    cTable.cellPadding = "20";
    cRow = document.createElement("tr");

    document.getElementById("controls-holder").appendChild(cTable);
    cPanel = document.createElement("td");
    cPanel.style = "font-family:menlo; color:white;";
    cPanel.innerHTML = "Controls<br><br>Rotate clockwise<br>Rotate counterclockwise<br>Move left<br>Move right<br>Hold piece<br>Faster drop<br>Hard drop";
    cRow.appendChild(cPanel);

    for (cc = 0; cc < document.getElementById("totalPlayers").value; cc++) {

        cPanel = document.createElement("td");
        cPanel.id = "controls_" + cc;
        cPanel.innerHTML = "Player " + (cc + 1) + "<br>";
        cPanel.style = "font-family:menlo; color:white;";
        cPanel.appendChild(document.createElement("br"));

        cRotateR = document.createElement("button");
        cRotateR.id = "rR_" + cc;
        cRotateR.onclick = function () { changeControls(cRotateR.id) }
        cPanel.appendChild(cRotateR);
        cPanel.appendChild(document.createElement("br"));

        cRotateL = document.createElement("button");
        cRotateL.id = "rL_" + cc;
        cRotateL.onclick = function () { changeControls(cRotateL.id) }
        cPanel.appendChild(cRotateL);
        cPanel.appendChild(document.createElement("br"));

        cMoveL = document.createElement("button");
        cMoveL.id = "mL_" + cc;
        cMoveL.onclick = function () { changeControls(cMoveL.id) }
        cPanel.appendChild(cMoveL);
        cPanel.appendChild(document.createElement("br"));

        cMoveR = document.createElement("button");
        cMoveR.id = "mR_" + cc;
        cMoveR.onclick = function () { changeControls(cMoveR.id) }
        cPanel.appendChild(cMoveR)
        cPanel.appendChild(document.createElement("br"));

        cCanHold = document.createElement("button");
        cCanHold.id = "hP_" + cc;
        cCanHold.onclick = function () { changeControls(cCanHold.id) }
        cPanel.appendChild(cCanHold);
        cPanel.appendChild(document.createElement("br"));
        
        cFastDrop = document.createElement("button");
        cFastDrop.id = "fD_" + cc;
        cFastDrop.onclick = function () { changeControls(cFastDrop.id) }
        cPanel.appendChild(cFastDrop);
        cPanel.appendChild(document.createElement("br"));

        cHardDrop = document.createElement("button");
        cHardDrop.id = "hD_" + cc;
        cHardDrop.onclick = function () { changeControls(cHardDrop.id) }
        cPanel.appendChild(cHardDrop);
        cPanel.appendChild(document.createElement("br"));

        if (first || (cc == 1 && parseInt(options["totalPlayers"]) != 2)) {

            cRotateR.innerHTML = defaultControls[cc]["rR"];
            cRotateL.innerHTML = defaultControls[cc]["rL"];
            cMoveL.innerHTML = defaultControls[cc]["mL"];
            cMoveR.innerHTML = defaultControls[cc]["mR"];
            cCanHold.innerHTML = defaultControls[cc]["hP"];
            cFastDrop.innerHTML = defaultControls[cc]["fD"];
            cHardDrop.innerHTML = defaultControls[cc]["hD"];
        }
        else {

            cRotateL.innerHTML = players[cc].rotateL;
            cRotateR.innerHTML = players[cc].rotateR;
            cMoveL.innerHTML = players[cc].moveL;
            cMoveR.innerHTML = players[cc].moveR;
            cCanHold.innerHTML = players[cc].hold;
            cFastDrop.innerHTML = players[cc].fastDrop;
            cHardDrop.innerHTML = players[cc].hardDrop;
        }

        cRow.appendChild(cPanel);
    }
    cTable.appendChild(cRow);
}

player = function (px, py, zoom, id) {

    this.id = id;
    this.zoom = size / zoom;
    this.x = px * size;
    this.y = py * size;

    this.pieces = [];
    this.pieceList = [];

    this.level = 1;
    this.updateSpeed = 1 / this.level;
    this.pieceTimer = updatesPerSecond * this.updateSpeed;
    this.clearTimer = 0;
    this.lineQueue = [];
    this.loss = false;

    this.holding = 0;
    this.holdSwitch = false;
    this.holdPreview = 0;

    //controlls
    this.rotateL = 0;
    this.rotateR = 0;
    this.moveL = 0;
    this.moveR = 0;
    this.hold = 0;
    this.fastDrop = 0;
    this.hardDrop = 0;

    if (this.id < 2) {
        this.rotateL = defaultControls[this.id]["rL"];
        this.rotateR = defaultControls[this.id]["rR"];
        this.moveL = defaultControls[this.id]["mL"];
        this.moveR = defaultControls[this.id]["mR"];
        this.hold = defaultControls[this.id]["hP"];
        this.fastDrop = defaultControls[this.id]["fD"];
        this.hardDrop = defaultControls[this.id]["hD"];
    }

    this.score = 0;
    this.lines = 0;

    this.grid = new Array(playWidth);
    for (i = 0; i < playWidth; i++) {
        this.grid[i] = new Array(playHeight + playHidden);
        for (j = 0; j < playHeight + playHidden; j++) {
            this.grid[i][j] = 0;
        }
    }

    this.update = function () {

        if (!this.loss) {

            if (this.clearTimer == 0) {

                if (this.pieceTimer > 0) {

                    this.pieceTimer--;
                }
                else {

                    this.pieceTimer = this.updateSpeed * updatesPerSecond;

                    for (pt = 0; pt < this.pieces.length; pt++) {

                        this.pieces[pt].update(this.id);

                        if (keyboard[this.fastDrop] || this.updateSpeed == 0) {

                            this.score++
                            this.renderScore();
                        }
                    }

                    if (this.updateSpeed != 0) {

                        this.render();
                    }
                }
            }
            else if (this.clearTimer == 1) {

                this.clearTimer--;
                this.lineClear();
                this.render();
            }
            else {

                this.clearTimer--;
                this.animateLineClear();
            }

            if (!keyboard[this.fastDrop] && this.updateSpeed != 0) {

                this.updateSpeed = 1 / this.level;
            }
        }
        //console.log(this.clearTimer,this.pieceTimer)
    }

    this.render = function () {

        for (y = 0; y < playHeight; y++) {
            for (x = 0; x < playWidth; x++) {

                switch (this.grid[x][y + playHidden]) {

                    case 0:

                        document.getElementById("game_" + this.id + "_" + x + "_" + y).src = "http://elixia.spelar.se/games/minesweeper/sprites/tiles/open-tile.png";
                        break;

                    case "I":
                    case "J":
                    case "L":
                    case "O":
                    case "T":
                    case "S":
                    case "Z":

                        document.getElementById("game_" + this.id + "_" + x + "_" + y).src = "http://elixia.spelar.se/games/newtetris/sprites/" + this.grid[x][y + playHidden] + ".png";
                        break;
                }
            }
        }

        if (options["ghosts"]) {

            this.renderGhost();
        }

        for (k = 0; k < this.pieces.length; k++) {
            for (j = 0; j < 4; j++) {

                if (this.pieces[k].ox[j] >= 0 && this.pieces[k].oy[j] >= 0) {

                    document.getElementById("game_" + this.id + "_" + this.pieces[k].ox[j] + "_" + this.pieces[k].oy[j]).src = "http://elixia.spelar.se/games/newtetris/sprites/" + this.pieces[k].shape + ".png";
                }
            }
        }
    }

    this.checkLines = function () {

        doClear = false;

        for (hl = 0; hl < playHeight; hl++) {

            fullLine = true;
            for (wl = 0; wl < playWidth; wl++) {

                if (this.grid[wl][hl + playHidden] == 0) {

                    fullLine = false;
                }
            }
            if (fullLine) {

                this.lineQueue.push(hl);
                this.clearTimer = updatesPerSecond / lineClearTimeDiv + 1;
            }
        }
    }

    this.lineClear = function () {

        for (q = 0; q < this.lineQueue.length; q++) {

            for (sl = this.lineQueue[q]; sl > 0; sl--) {

                for (rl = 0; rl < playWidth; rl++) {
                    this.grid[rl][sl + playHidden] = this.grid[rl][sl + playHidden - 1];
                }
            }
            this.updateScore();
        }
        this.lineQueue.splice(0, this.lineQueue.length);
    }

    this.lossCheck = function () {

        for (yh = 0; yh < playHidden; yh++) {
            for (xh = 0; xh < playWidth; xh++) {

                if (this.grid[xh][yh] != 0) {

                    this.loss = true;
                }
            }
        }
    }

    this.animateLineClear = function () {

        if (this.clearTimer == updatesPerSecond / lineClearTimeDiv || this.clearTimer == Math.floor(updatesPerSecond / lineClearTimeDiv / 3) || this.clearTimer == Math.floor(updatesPerSecond / lineClearTimeDiv * 2 / 3)) {

            for (qu = 0; qu < this.lineQueue.length; qu++) {

                for (xu = 0; xu < playWidth; xu++) {

                    if (this.clearTimer < updatesPerSecond / lineClearTimeDiv / 3 || this.clearTimer > updatesPerSecond / lineClearTimeDiv * 2 / 3) {

                        document.getElementById("game_" + this.id + "_" + xu + "_" + this.lineQueue[qu]).src = "http://elixia.spelar.se/games/newtetris/sprites/clear.png";
                    }
                    else {

                        document.getElementById("game_" + this.id + "_" + xu + "_" + this.lineQueue[qu]).src = "http://elixia.spelar.se/games/newtetris/sprites/" + this.grid[xu][this.lineQueue[qu] + playHidden] + ".png";
                    }
                }
            }
        }
    }

    this.speedFall = function (type) {

        if (type == "fast") {

            this.updateSpeed = updatesPerSecond / 1000;
            this.pieceTimer = 0;
        }
        else if (type == "hard") {

            this.updateSpeed = 0;
            this.pieceTimer = 0;
        }
    }

    this.holdPiece = function () {

        if (this.holdSwitch == false) {

            if (this.holding == 0) {

                this.holding = this.pieces[0].shape;
                this.removePushPiece();
                this.updatePiecePreview();
            }
            else {

                this.pieces.push(new piece(this.holding, 4, -1));
                this.holding = this.pieces[0].shape;
                this.pieces.splice(0, 1);

            }
            this.holdSwitch = true;

            this.updateHoldPreview();
        }
        else {

            console.error(this.id, "Can't hold again")
        }
        this.render();
    }

    this.removePushPiece = function () {

        this.pieces.splice(0, 1);
        this.pieces.push(new piece(this.pieceList[0], 4, -1));
        this.pieceList.splice(0, 1);
    }

    this.setPiece = function () {

        this.removePushPiece();

        this.updateSpeed = 1 / this.level;
        this.render();

        this.holdSwitch = false;

        this.checkLines();
        this.lossCheck();
        this.updatePiecePreview();
    }

    this.updateHoldPreview = function () {

        this.holdPreview = new piece(this.holding, 1, 1)

        for (hy = 0; hy < 2; hy++) {
            for (hx = 0; hx < 4; hx++) {

                document.getElementById("holding_" + this.id + "_" + hx + "_" + hy).src = "http://elixia.spelar.se/games/newtetris/sprites/transparent.png";
            }
        }

        for (pc = 0; pc < 4; pc++) {

            document.getElementById("holding_" + this.id + "_" + this.holdPreview.ox[pc] + "_" + this.holdPreview.oy[pc]).src = "http://elixia.spelar.se/games/newtetris/sprites/" + this.holding + ".png";
        }
    }

    this.updatePiecePreview = function () {

        startP = 1 + 3 * (4 - options["previewPieces"]);

        for (hy = 0; hy < 11; hy++) {
            for (hx = 0; hx < 4; hx++) {

                document.getElementById("preview_" + this.id + "_" + hx + "_" + hy).src = "http://elixia.spelar.se/games/newtetris/sprites/transparent.png";
            }
        }

        for (opp = 0; opp < options["previewPieces"]; opp++) {

            upp = new piece(this.pieceList[opp], 1, startP + 3 * opp)

            for (pc = 0; pc < 4; pc++) {

                document.getElementById("preview_" + this.id + "_" + upp.ox[pc] + "_" + upp.oy[pc]).src = "http://elixia.spelar.se/games/newtetris/sprites/" + this.pieceList[opp] + ".png";
            }
        }
    }

    this.updateScore = function () {

        this.lines++
        this.score += 100 * this.level;

        this.renderScore();
    }

    this.renderScore = function () {

        document.getElementById("lines_" + this.id).innerHTML = "Lines: " + this.lines;
        document.getElementById("score_" + this.id).innerHTML = "Score: " + this.score;
        document.getElementById("level_" + this.id).innerHTML = "Level: " + this.level;
    }

    this.renderGhost = function () {

        startY = playHeight - 1;
        highest = this.pieces[0].oy[0];

        for (hi = 1; hi < 4; hi++) {

            if (this.pieces[0].oy[hi] < highest) {

                highest = this.pieces[0].oy[hi];                
            }
        }
        
        for (sy = this.pieces[0].oy[0]; sy < playHeight; sy++) {

            for (gp = 0; gp < 4; gp++) {

                if (this.grid[this.pieces[0].ox[gp]][sy + playHidden]) {

                    startY = sy;
                    break;
                }
            }
            if (startY == sy) {
                break;
            }
        }
        for (gy = startY; gy >= 0; gy--) {

            canPlace = true;
            for (gp = 0; gp < 4; gp++) {

                if (this.grid[this.pieces[0].ox[gp]][gy - (this.pieces[0].oy[0] - this.pieces[0].oy[gp]) + playHidden] != 0) {

                    canPlace = false;
                }
            }

            if (canPlace) {

                for (gp = 0; gp < 4; gp++) {

                    document.getElementById("game_" + this.id + "_" + this.pieces[0].ox[gp] + "_" + [gy - (this.pieces[0].oy[0] - this.pieces[0].oy[gp])]).src = "http://elixia.spelar.se/games/newtetris/sprites/ghost.png";
                }
                break;
            }
        }
    }
}

piece = function (shape, x, y) {

    this.shape = shape;
    this.ox = [x, 0, 0, 0];
    this.oy = [y, 0, 0, 0];
    this.rotationIndex = 0;

    switch (this.shape) {

        case "I":
            this.ox = [x, x - 1, x + 1, x + 2];
            this.oy = [y, y, y, y];
            break;

        case "J":
            this.ox = [x, x + 1, x - 1, x - 1];
            this.oy = [y, y, y, y - 1];
            break;

        case "L":
            this.ox = [x, x - 1, x + 1, x + 1];
            this.oy = [y, y, y, y - 1];
            break;

        case "O":
            this.ox = [x, x + 1, x, x + 1];
            this.oy = [y, y - 1, y - 1, y];
            break;

        case "T":
            this.ox = [x, x, x + 1, x - 1];
            this.oy = [y, y - 1, y, y];
            break;

        case "S":
            this.ox = [x, x - 1, x, x + 1];
            this.oy = [y, y, y - 1, y - 1];
            break;

        case "Z":
            this.ox = [x, x + 1, x, x - 1];
            this.oy = [y, y, y - 1, y - 1];
            break;
    }

    this.update = function (id) {

        validity = true;

        for (r = 0; r < 4; r++) {

            if (this.oy[r] + 1 == playHeight) {

                validity = false;
            }
            else if (players[id].grid[this.ox[r]][this.oy[r] + 1 + playHidden] != 0) {

                validity = false;
            }
        }
        if (validity) {

            for (r = 0; r < 4; r++) {

                this.oy[r] += 1;
            }
        }
        else {

            for (r = 0; r < 4; r++) {

                players[id].grid[this.ox[r]][this.oy[r] + playHidden] = this.shape;
            }

            players[id].setPiece();
        }
    }

    this.move = function (direction, id) {

        validity = true;
        dx = 0;

        if (direction == "left") {

            dx = -1;
        }
        else {

            dx = 1;
        }

        for (r = 0; r < 4; r++) {

            if (this.ox[r] + dx < 0 || this.ox[r] + dx >= playWidth) {

                validity = false;
            }
            else if (players[id].grid[this.ox[r] + dx][this.oy[r] + playHidden] != 0) {

                validity = false;
            }
        }
        if (validity) {

            for (r = 0; r < 4; r++) {

                this.ox[r] += dx;
            }
        }
        players[id].render();
    }

    this.rotate = function (direction, id) {

        transformMatrix = 0;
        validity = true;

        if (direction == "left") {

            transformMatrix = [[0, 1], [-1, 0]];
        }
        else {

            transformMatrix = [[0, -1], [1, 0]];
        }

        if (this.shape == "O") {
            
            transformMatrix = [[1, 0], [0, 1]];
        }
        

        rotated = [0, 0, 0];
        for (r = 1; r < 4; r++) {

            rotated[r - 1] = LAmath.matrixMulti(transformMatrix, [[this.ox[r] - this.ox[0]], [this.oy[r] - this.oy[0]]]);
        }
        for (t = 0; t < 5; t++) {

            validity = true;

            for (r = 0; r < 4; r++) {

                tx = 0;
                ty = 0;

                if (r != 4-1) {
                    
                    if (this.shape != "I") {

                        tx = parseInt(rotated[r][0]) + parseInt(this.ox[0]) + parseInt(wallKicks[direction][this.rotationIndex][t][0]);
                        ty = parseInt(rotated[r][1]) + parseInt(this.oy[0]) - parseInt(wallKicks[direction][this.rotationIndex][t][1]);
                    }
                    else {
                        
                        tx = parseInt(rotated[r][0]) + parseInt(this.ox[0]) + parseInt(wallKicksSpecI[direction][this.rotationIndex][t][0] + Ioffset[direction][this.rotationIndex][0]);
                        ty = parseInt(rotated[r][1]) + parseInt(this.oy[0]) - parseInt(wallKicksSpecI[direction][this.rotationIndex][t][1] + Ioffset[direction][this.rotationIndex][1]);
                    }
                }
                else {
                    
                    if (this.shape != "I") {

                        tx = parseInt(this.ox[0]) + wallKicks[direction][this.rotationIndex][t][0];
                        ty = parseInt(this.oy[0]) + wallKicks[direction][this.rotationIndex][t][1];
                    }
                    else {

                        tx = parseInt(this.ox[0]) + wallKicksSpecI[direction][this.rotationIndex][t][0] + Ioffset[direction][this.rotationIndex][0];
                        ty = parseInt(this.oy[0]) + wallKicksSpecI[direction][this.rotationIndex][t][1] + Ioffset[direction][this.rotationIndex][1];                        
                    }
                }
                
                if (tx < 0 || tx >= playWidth || ty >= playHeight+playHidden) {

                    validity = false;
                    console.warn("out of bounds",t,r);
                }
                else if (players[id].grid[tx][ty+playHidden] != 0) {
                    
                    validity = false;
                    console.warn("pieces in the way",t,r);
                }
            }
            if (validity) {
                //console.log("Broke flip",t,validity);
                break;                
            }
        }
        //console.log(rotated)
        if (validity) {

            for (r = 1; r < 4; r++) {

                if (this.shape != "I") {

                    this.ox[r] = parseInt(rotated[r - 1][0]) + parseInt(this.ox[0]) + parseInt(wallKicks[direction][this.rotationIndex][t][0]);
                    this.oy[r] = parseInt(rotated[r - 1][1]) + parseInt(this.oy[0]) - parseInt(wallKicks[direction][this.rotationIndex][t][1]);
                }
                else {

                    this.ox[r] = parseInt(rotated[r - 1][0]) + parseInt(this.ox[0]) + parseInt(wallKicksSpecI[direction][this.rotationIndex][t][0] + Ioffset[direction][this.rotationIndex][0]);
                    this.oy[r] = parseInt(rotated[r - 1][1]) + parseInt(this.oy[0]) + parseInt(wallKicksSpecI[direction][this.rotationIndex][t][1] - Ioffset[direction][this.rotationIndex][1]);
                }
            }
            if (this.shape != "I") {

                this.ox[0] += parseInt(wallKicks[direction][this.rotationIndex][t][0]);
                this.oy[0] -= parseInt(wallKicks[direction][this.rotationIndex][t][1]);
            }
            else {

                this.ox[0] += parseInt(wallKicksSpecI[direction][this.rotationIndex][t][0] + Ioffset[direction][this.rotationIndex][0]);
                this.oy[0] -= parseInt(wallKicksSpecI[direction][this.rotationIndex][t][1] + Ioffset[direction][this.rotationIndex][1]);
            }

            if (direction == "right") {
                
                this.rotationIndex++; 
                this.rotationIndex %= 4;
            }
            else if (direction == "left") {

                if (this.rotationIndex == 0) { this.rotationIndex = 4; }
                this.rotationIndex--; 
                this.rotationIndex %= 4;
            }            
        }
        players[id].render();
    }
}

createPieceOrder = function (same) {

    many = 0;

    if (same) {

        many = 1;
    }
    else {

        many = players.length;
    }

    for (m = 0; m < many; m++) {

        randShape = 0;
        for (o = 0; o < 1000; o++) {

            rand = Math.floor(Math.random() * (7))

            switch (rand) {

                case 0:
                    randShape = "I";
                    break;

                case 1:
                    randShape = "J";
                    break;

                case 2:
                    randShape = "L";
                    break;

                case 3:
                    randShape = "O";
                    break;

                case 4:
                    randShape = "T";
                    break;

                case 5:
                    randShape = "S";
                    break;

                case 6:
                    randShape = "Z";
                    break;

            }

            if (same) {

                for (u = 0; u < players.length; u++) {

                    players[u].pieceList.push(randShape);
                }
            }
            else {

                players[m].pieceList.push(randShape);
            }
        }
    }
    for (m = 0; m < players.length; m++) {

        players[m].updatePiecePreview();
    }
}

inputListener = function () {

    if (!paused) {

        for (v = 0; v < players.length; v++) {

            if (players[v].clearTimer == 0) {

                if (keyboard[players[v].rotateR]) {

                    for (c = 0; c < players[v].pieces.length; c++) {

                        players[v].pieces[c].rotate("right", v);
                    }
                }
                else if (keyboard[players[v].rotateL]) {

                    for (c = 0; c < players[v].pieces.length; c++) {

                        players[v].pieces[c].rotate("left", v);
                    }
                }
                else if (keyboard[players[v].moveR]) {

                    for (c = 0; c < players[v].pieces.length; c++) {

                        players[v].pieces[c].move("right", v);
                    }
                }
                else if (keyboard[players[v].moveL]) {

                    for (c = 0; c < players[v].pieces.length; c++) {

                        players[v].pieces[c].move("left", v)
                    }
                }
                else if (keyboard[players[v].hold]) {

                    if (options["canHold"]) {

                        for (c = 0; c < players[v].pieces.length; c++) {

                            players[v].holdPiece();
                        }
                    }
                }
                else if (keyboard[players[v].fastDrop]) {

                    players[v].speedFall("fast");
                }
                else if (keyboard[players[v].hardDrop]) {

                    players[v].speedFall("hard");
                }
            }
        }
    }

    if (keyboard.p) {
        console.warn("Temp pause method")
        if (paused) {

            paused = false;
        }
        else {

            paused = true;
        }
    }
}

addPlayer = function (x, y) {

    players.push(new player(x, y, 1, players.length))
    doSetup = true;
}

changeControls = function (option) {

    if (option == "enter") {

        pId = parseInt(whatOption.charAt(3));
        pCi = whatOption.substring(0,2);

        for (key in keyboard.keyList) {

            if (keyboard[keyboard.keyList[key]]) {

                changeControlsCheck = false;

                if (first || (pId == 1 && parseInt(options["totalPlayers"]) != 2)) {
                    
                    defaultControls[parseInt(pId)][pCi] = keyboard.keyList[key];
                }
                else {

                    switch(pCi) {

                        case "rR":
                        players[pId].rotateR = keyboard.keyList[key];
                        break;
                        case "rL":
                        players[pId].rotateR = keyboard.keyList[key];
                        break;
                        case "mR":
                        players[pId].moveR = keyboard.keyList[key];
                        break;
                        case "mL":
                        players[pId].moveL = keyboard.keyList[key];
                        break;
                        case "hP":
                        players[pId].hold = keyboard.keyList[key];
                        break;
                        case "fD":
                        players[pId].fastDrop = keyboard.keyList[key];
                        break;
                        case "hD":
                        players[pId].hardDrop = keyboard.keyList[key];
                        break;
                    }
                }
                document.getElementById(whatOption).innerHTML = keyboard.keyList[key];
                document.getElementById("selectControl").style.display = "none";
                document.getElementById("controls").style.display = "";
                
                break;
            }
        }
        document.getElementById(whatOption).blur();
    }
    else {
        
        whatOption = option;
        changeControlsCheck = true;
        document.getElementById("selectControl").style.display = "";
        document.getElementById("controls").style.display = "none";
    }
}

window.onload = function () {

    setupControls();
}