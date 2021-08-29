
createGameGrid = function() {

    updateImgSrc();

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
            
            gameDiv.appendChild(createGameTile(w, h, xOffset, hOffset, imgSrc[field[w][h]]));
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

    timeCounterDiv = createCounterTile(scale + x_diff, 5/2*scale-7/2*timerScale, "timer", timerScale);
    timeCounterDiv.title = "Timer";

    mineCounterDiv = createCounterTile((width-2) * scale + (3*scale-13*timerScale) - x_diff, 5/2*scale-7/2*timerScale, "mines", timerScale);
    mineCounterDiv.title = "Mines left";

    gameDiv.appendChild(timeCounterDiv);
    gameDiv.appendChild(mineCounterDiv);


    //
    gameDiv.appendChild(createRestartButton());
    gameDiv.appendChild(createRetryOverlay());

    
    // RESIZING THE WINDOW
    gameWindow.style.width = (width + 2*xOffset) * scale;
    gameWindow.style.height = (height + 2*yOffset + hOffset-1) * scale + parseInt(gameWindowBar.style.height) + 2*borderWidth; // 30 = window bar height
    gameWindowBar.style.width = (width + 2*xOffset) * scale;
    setGameTitle();
    
    if (dark_mode) {
        gameWindow.style.backgroundColor = "#636363";
        document.body.style.backgroundColor = "#777777";
    } else {
        gameWindow.style.backgroundColor = "#bdbdbd";
        document.body.style.backgroundColor = "#ebebeb";
    }
    
    gameWindow.appendChild(gameDiv);

    cursor_x_offset = scale;
    cursor_y_offset = 5 * scale;
    gameDiv.appendChild(createCursor(cursor_x, cursor_y));
    
    setTimerDisplay();
    setMinesDisplay();
    gameWindow.style.left = gameWindow_x;
    gameWindow.style.top =  gameWindow_y;
    shareWindow.style.left = shareWindow_x;
    shareWindow.style.top =  shareWindow_y;
    settingsWindow.style.left = settingsWindow_x;
    settingsWindow.style.top =  settingsWindow_y;
    historyWindow.style.left = historyWindow_x;
    historyWindow.style.top =  historyWindow_y;
    statsWindow.style.left = statsWindow_x;
    statsWindow.style.top =  statsWindow_y;
    
    
    if (retrying) {
        toggleRetry(true);
    }

    createStatsTable();
    createHistoryTable();
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
        if (field[mx][my] == "tile" && clickDown && !editing) { 
            document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc["0-tile"]; 
        }
    }
    tileImg.onmouseout = function() {

        if (!peeking) {
            
            document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc[field[mx][my]];
        }
        mx = -1; 
        my = -1; 
    }
    tileImg.onmousedown = function(e) {
        
        if (playing && !editing) {

            if (e.which == 1 && field[mx][my] == "tile") {
    
                clickDown = true;
                document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc["0-tile"]; 
            }
            else if (e.which == 1 && isRevealed(mx, my) && grid[mx][my] > 0 && grid[mx][my] < 9) {
        
                if (!flagCount(mx, my)) {
                    // recordedGame.push("P_"+ time + "_" + mx + "_" + my);
                    if (!playbacking) {
                        recordedGame.push([time, "P", mx, my]);
                        // console.info([time, "P", mx, my]);
                    }
                    peek_log = true;
                }
                openPeek(mx, my);
            }
            else if (e.which == 3) {
                
                rightAction(mx, my);      
            }
        }
        else if (editing && e.which == 1) {

            if (field[mx][my] != "bomb") {
               
                grid[mx][my] = "bomb";
                field[mx][my] = "bomb";
                minesLeft++;
            }
            else if (field[mx][my] == "bomb") {

                grid[mx][my] = 0;
                field[mx][my] = "0-tile";
                minesLeft--;
            }

            // placeNumbers();
            updateTile(mx, my);
            editorFlagNumber(mx, my);
            setMinesDisplay();
            generateLink();
        }
    }
    tileImg.onmouseup = function(e) {
        
        if (playing && !editing) {
            if (e.which == 1) {
                
                // if ((isNumber(mx, my) && flagCount(mx, my)) || field[mx][my] == "tile") {
                //     recordedGame.push("L_"+ time + "_" + mx + "_" + my);
                //     console.info("L_"+ time + "_" + mx + "_" + my);
                // }
                leftAction(mx, my);

                showExportedState();
            }
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
    restartButton.style.cursor = "pointer";
    restartButton.src = imgSrc[restartButton_state];
    restartButton.title = "Start a new game";

    restartButton.onmousedown = function(e) { if (e.which == 1) { restartButton.src = imgSrc[restartButton_state + "_pushed"]; restartHover = true; }}
    restartButton.onmouseup = function() { restartButton.src = imgSrc[restartButton_state]; }
    restartButton.onmouseleave = function() { restartButton.src = imgSrc[restartButton_state]; }
    restartButton.onmouseover = function() { if (restartHover) { restartButton.src = imgSrc[restartButton_state + "_pushed"]; }}

    return restartButton;
}

createRetryOverlay = function() {

    retryOverlay = document.createElement("img");
    retryOverlay.style.pointerEvents = "none";
    retryOverlay.style.display = "none";
    retryOverlay.id = "retry-overlay";
    retryOverlay.style.width = 2 * scale;
    retryOverlay.style.left = width * scale/2; //- scale;
    retryOverlay.style.position = "absolute";
    retryOverlay.style.top = scale * 3/2;
    retryOverlay.src = imgSrc["retry"];

    return retryOverlay;
}

createStatsTable = function() {

    document.getElementById("stats_table").remove();
    diffs = ["Beginner", "Intermediate", "Expert", "Custom", "All"];
    tracking = [["Full sweeps", "Mines exploded", "Mines swept", "Avg. sweep percent"], 
                ["Fastest sweep", "Avg. game time", "Avg. full sweep time", "Avg. explosion time"],
                ["1-tiles seen", "2-tiles seen", "3-tiles seen", "4-tiles seen", "5-tiles seen", "6-tiles seen", "7-tiles seen", "8-tiles seen"]];

    all_calc = [["s", "s", "s", "a"], ["l", "a", "a", "a"], ["s", "s", "s", "s", "s", "s", "s", "s"]];

    timingA = 4;
    timingB = 7;

    tbl = document.createElement("table");
    tbl.id = "stats_table";
    tbl.border = 1;
    tbl.style.borderCollapse = "collapse";
    tbl.cellPadding = 5;
    cellBorder = dark_mode ? "3px solid #777777" : "3px solid #ebebeb";
    tbl.style.overflow = "scroll";
    tbl.style.height = 500;
    tbl.style.width = 730;//675;
    cellColor = dark_mode ? "#3c3c3c" : "#bdbdbd";
    cellColor2 = dark_mode ? "#646464" : "#dadada";

    for (c = 0; c < tracking.length; c++) {    
        for (t = 0; t <= tracking[c].length; t++) {

            tr = document.createElement("tr");
            for (d = 0; d <= diffs.length; d++) {
                
                if (t == 0 && d == 0) {

                    td = document.createElement("td");
                    td.style.border = cellBorder;
                   
                    // td.id = "stats_" + diffs[d - 1] + "_" + tracking[t - 1];
                    tr.appendChild(td);
                }
                else if (t == 0 && d != 0) {
                    th = document.createElement("th");
                    th.style.border = cellBorder;
   
                    if (c == 0) {
                        th.innerHTML = diffs[d - 1];
                        // th.style.backgroundColor = cellColor;
                    }
                    else {
                        th.innerHTML = "<br>";
                    }
                    tr.appendChild(th);
                }
                else if (d == 0 && t != 0) {

                    th = document.createElement("th");
                    th.style.border = cellBorder;
                    
                    th.innerHTML = tracking[c][t - 1];
                    tr.appendChild(th);
                }
                else {

                    td = document.createElement("td");
                    td.style.textAlign = "center";
                    td.style.border = cellBorder;
                    
                    if (d == 5) {

                        all_type = all_calc[c][t - 1];
                        all_val = 0;
                        avg_count = 0;


                        if (all_type == "s") {
                            for (r = 0; r < diffs.length; r++) {
                                all_val += parseInt(checkCookie(statsCookieName(c, t - 1, diffs[r]), c != 1 ? 0 : "N/A"));
                            }
                        }
                        else if (all_type == "a") {
                            for (r = 0; r < diffs.length; r++) {
                                
                                val = parseFloat(checkCookie(statsCookieName(c, t - 1, diffs[r]), c != 1 ? 0 : "N/A"));
                                if (val > 0) {
                                   
                                    all_val += val;
                                    avg_count++;
                                }
                            }
                            all_val = avg_count == 0 ? "N/A" : (all_val / avg_count).toFixed(2);
                        }
                        else if (all_type == "l") {

                            all_val = -1;
                            for (r = 0; r < diffs.length; r++) {                        
                                
                                val = parseInt(checkCookie(statsCookieName(c, t - 1, diffs[r]), c != 1 ? 0 : "N/A"));
                                if (val >= 0 && (val < all_val || all_val == -1)) {
                                    all_val = val;
                                }
                            }
                            all_val = all_val == -1 ? "N/A" : all_val;
                        }                        
                        
                        td.innerHTML = all_val;
                    }
                    else {

                        td.innerHTML = checkCookie(statsCookieName(c, t - 1, diffs[d - 1]), c != 1 && !(c == 0 && t == 4) ? 0 : "N/A"); //t < timingA || t > timingB
                    }
                    td.id = ("stats_" + diffs[d - 1] + "_" + tracking[c][t - 1]).replace(" ", "_");
                        
                    tr.appendChild(td);
                }
            }
            if ((t % 2 == 0 && c == 0) || (c != 0 && t % 2 == 1)) {
                tr.style.backgroundColor = cellColor;
            }
            else if ((t % 2 == 1 && c == 0) || (c != 0 && t % 2 == 0 && t != 0)) {
                tr.style.backgroundColor = cellColor2;
            }

            tbl.appendChild(tr);
        }
    }
    document.getElementById("stats_panel").appendChild(tbl);
    
}

createHistoryTable = function() {   

    document.getElementById("history_table").remove(); 
    hist_tbl = document.createElement("table");
    hist_tbl.id = "history_table";
    hist_tbl.style.width = "100%";
    // hist_tbl.style.height = "360px";


    for (h = trackingHistory; h > 0; h--) {

        hist_cookie = checkCookie("MS5_history_" + h, "ERROR");

        if (hist_cookie != "ERROR") {

            hist_cookie = hist_cookie.split("&");

            outcome_bg = "";
            outcome = "";
            if (hist_cookie[0] == "true") {
                //win
                outcome_bg = dark_mode ? "#658B65" : "#C8EEC8";
                outcome = "Full sweep";
            }
            else {
                //loss
                outcome_bg = dark_mode ? "#8B6565" : "#EEC8C8";
                outcome = "Explosion";
            }

            difficultyCriteria = false;
            outcomeCriteria = false;

            filterDifficulty = document.getElementById("filterDifficulty").value;
            filterOutcome = document.getElementById("filterOutcome").value;

            if (filterDifficulty == hist_cookie[1] || filterDifficulty == "All difficulties") {
                difficultyCriteria = true;
            }
            if (filterOutcome == outcome + "s" || filterOutcome == "All outcomes") {
                outcomeCriteria = true;
            }

            if (difficultyCriteria && outcomeCriteria) {
                tr = document.createElement("tr");
                tr.style.width = "100%";
                // tr.backgroundColor = "lightgray";
                td = document.createElement("td");
                td.style.verticalAlign = "top";
                td.style.height = "0px";
                hist_tbl.appendChild(tr);
                tr.appendChild(td);

                saved_tbl = document.createElement("table");
                saved_tbl.style.width = "100%";

                

                saved_tbl.style.backgroundColor = outcome_bg;
                info_tr = document.createElement("tr");
                diff_td = document.createElement("td");
                time_td = document.createElement("td");
                info_tr.appendChild(diff_td);
                info_tr.appendChild(time_td);
                
                diff_td.width = "300px";
                

                diff_td.innerHTML = h + ". " + hist_cookie[1] + " - " + outcome;
                time_td.innerHTML = hist_cookie[2] + "% " + hist_cookie[3] + "s";
                
                share_tr = document.createElement("tr");
                game_td = document.createElement("td");
                date_td = document.createElement("td");
                share_tr.appendChild(game_td);
                share_tr.appendChild(date_td);

                if ((trackingHistory - h) < totalSavedGames) {

                    game_link = document.createElement("a");
                    if (hist_cookie.length <= 5) {
                        hist_cookie[5] = "";
                    }
                    game_link.href = hist_cookie[5];
                    game_link.innerHTML = "Game link";
                    game_link.style.fontSize = 12;
                    game_link.style.color = dark_mode ? "#004386" : "#0080ff";
                    game_td.appendChild(game_link);
                }
                else {
                    
                    game_link = document.createElement("span");
                    game_link.innerHTML = "No game or playback link"
                    game_link.style.fontSize = 12;
                    game_td.appendChild(game_link);
                }

                divspan = document.createElement("span");
                divspan.innerHTML = "  ";
                game_td.appendChild(divspan);

                if ((trackingHistory - h) < totalSavedPlaybacks) {

                    replay_link = document.createElement("a");
                    if (hist_cookie.length <= 6) {
                        hist_cookie[6] = "";
                    }
                    replay_link.href = (hist_cookie[5] + hist_cookie[6]);
                    replay_link.innerHTML = "Playback link";
                    replay_link.style.fontSize = 12;
                    replay_link.style.color = dark_mode ? "#004386" : "#0080ff";
                    game_td.appendChild(replay_link);
                }
                else {

                    replay_link = document.createElement("span");
                    replay_link.innerHTML = "";
                    replay_link.style.fontSize = 12;
                    game_td.appendChild(replay_link);
                }
                
                date_td.innerHTML = hist_cookie[4];
                date_td.style.fontSize = 12;

                saved_tbl.appendChild(info_tr);
                saved_tbl.appendChild(share_tr);
                td.appendChild(saved_tbl);
            }
        }
    }
    document.getElementById("history_table_holder").appendChild(hist_tbl);   
}

createCursor = function(cx = cursor_x, cy = cursor_y) {

    cursorImg = document.createElement("img");
    cursorImg.style.userSelect = "none";
    cursorImg.style.display = playbacking ? "" : "none";
    cursorImg.oncontextmenu = function() {return false;};
    cursorImg.ondragstart = function() {return false;};
    cursorImg.ondrop = function() {return false;};
    
    cursorImg.style.position = "absolute";
    cursorImg.style.width = scale; 
    cursorImg.style.height = scale;
    cursorImg.style.top = cx; 
    cursorImg.style.left = cy;
    cursorImg.id = "playback_cursor";
    cursorImg.src = "sprites/cursor.png";

    return cursorImg;
}

setGameTitle = function() {

    if (editing) {

        document.getElementById("gameTitle").innerHTML = "Minesweeper - Editor";
    }
    else {
        
        document.getElementById("gameTitle").innerHTML = "Minesweeper - " + currentDifficulty;
    }
    document.getElementById("gameTitle").style.left = parseInt(gameWindow.style.width)/2 - document.getElementById("gameTitle").offsetWidth/2;
}

resizeGrid = function(onlySized = false) {

    if (document.getElementById("diffBeginner").checked) {

        width = 9; height = 9; mines = 10;
        setCookie("MS5_difficulty", "Beginner", 30);
        currentDifficulty = "Beginner";
    }
    else if (document.getElementById("diffIntermediate").checked) {
        
        width = 16; height = 16; mines = 40;
        setCookie("MS5_difficulty", "Intermediate", 30);
        currentDifficulty = "Intermediate";
    }
    else if (document.getElementById("diffExpert").checked) {
        
        width = 30; height = 16; mines = 99;
        setCookie("MS5_difficulty", "Expert", 30);
        currentDifficulty = "Expert";
    }
    else if (document.getElementById("diffCustom").checked) {
        
        setCookie("MS5_difficulty", "Custom", 30);
        currentDifficulty = "Custom";

        cwe = document.getElementById("customWidth");
        che = document.getElementById("customHeight");
        cme = document.getElementById("customMines");

        ww =  cwe.value.length == 0 ? 9 : parseInt(cwe.value);
        hh =  che.value.length == 0 ? 9 : parseInt(che.value);
        mm =  cme.value.length == 0 ? 10 : parseInt(cme.value);

        width = ww < 9 ? 9 : ww;
        height = hh < 9 ? 9 : hh;
        mines = mm < 1 ? 1 : mm;
        mines = mines >= ww * hh ? ww * hh - 9 : mines;
        
        document.getElementById("customWidth").value = width;
        document.getElementById("customHeight").value = height;
        document.getElementById("customMines").value = mines;
    }
    document.getElementById("current_difficulty").innerHTML = currentDifficulty;
    
    
    if (!onlySized) {
        grid = new Array(width);
        field = new Array(width);
        for (i = 0; i < width; i++) {
            grid[i] = new Array(height);
            field[i] = new Array(height);
            for (j = 0; j < height; j++) {
                
                if (editing) {

                    grid[i][j] = 0;
                    field[i][j] = "0-tile";
                }
                else {
                    grid[i][j] = "tile";
                    field[i][j] = "tile";
                }
            }
        }
    }
    retrying = true;
    toggleRetry();
    firstClick = true;
    playing = true;
    playbacking = false;
    minesLeft = editing ? 0 : mines;
    time = 0;
    clearInterval(timeCounter);
    setTimerDisplay();
    setMinesDisplay();
    updateSmiley("happy");
    reRender();
    document.getElementById("shareURL").value = "";
    document.getElementById("shareState").value = "";
    document.getElementById("shareURLbtn").disabled = true;
    document.getElementById("shareStateBtn").disabled = true;
    document.getElementById("playback_cursor").style.display = "none";
    disablePlaybackPanel(!playbacking);
    togglePlayback(false);
    
    showExportedState();
    setGameTitle();
}

reRender = function() {

    gameWindow.removeChild(document.getElementById("gameDiv"))
    createGameGrid();
}

updateTile = function(ux, uy) {

    document.getElementById("gameTileImg_" + ux + "_" + uy).src = imgSrc[field[ux][uy]];
}

setTileImg = function(ix, iy, img) {

    document.getElementById("gameTileImg_" + ix + "_" + iy).src = img 
}

updateSmiley = function(state) {

    restartButton_state = state;
    document.getElementById("restartButton").src = imgSrc[restartButton_state];
}

setTimerDisplay = function() {

    hundred = Math.floor(time / 100);
    ten = Math.floor((time % 100) / 10);
    one = Math.floor((time % 100) % 10);

    mode_path = dark_mode ? "dark_mode" : "light_mode";

    if (time > 999) {

        document.getElementById("timer0").src = "sprites/" + mode_path + "/digits/9-digit.png";
        document.getElementById("timer1").src = "sprites/" + mode_path + "/digits/9-digit.png";
        document.getElementById("timer2").src = "sprites/" + mode_path + "/digits/9-digit.png";
    } else {
        
        document.getElementById("timer0").src = "sprites/" + mode_path + "/digits/" + hundred + "-digit.png";
        document.getElementById("timer1").src = "sprites/" + mode_path + "/digits/" + ten + "-digit.png";
        document.getElementById("timer2").src = "sprites/" + mode_path + "/digits/" + one + "-digit.png";
    }
}

setMinesDisplay = function() {

    minesLeftDisplay = Math.abs(minesLeft);

    hundred = Math.floor(minesLeftDisplay/100);
    ten = Math.floor((minesLeftDisplay % 100) / 10);
    one = Math.floor((minesLeftDisplay % 100) % 10);

    mode_path = dark_mode ? "dark_mode" : "light_mode";

    if (minesLeft >= 0) {        

        document.getElementById("mines0").src = "sprites/" + mode_path + "/digits/" + hundred + "-digit.png";
    }
    else {

        document.getElementById("mines0").src = "sprites/" + mode_path + "/digits/digit-negative.png";
    }

    document.getElementById("mines1").src = "sprites/" + mode_path + "/digits/" + ten + "-digit.png";
    document.getElementById("mines2").src = "sprites/" + mode_path + "/digits/" + one + "-digit.png";
}