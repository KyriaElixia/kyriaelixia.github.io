
importGrid = function(importCode) {

    split = importCode.split("-");
    w = parseInt(radix.convert(split[0], 36, 10));
    // console.warn(w, split);
    for (r = 5; r > 0; r--) {
        if (w % r == 0) {
            break;
        }
    }

    code = compressor.uncompress(split[1], r, 1);
    
    mineCount = 0;
    for (i = 0; i < code.length; i++) {
        if (code[i] == "1") { mineCount++; }
    }

    document.getElementById("customWidth").value = w;
    document.getElementById("customHeight").value = code.length/w;
    document.getElementById("customMines").value = mineCount;
    document.getElementById("diffCustom").checked = true;

    resizeGrid();

    for (i = 0; i < code.length; i++) {
        
        x = i % w;
        y = Math.floor(i/w);
        
        grid[x][y] = code[i] == "1" ? "bomb" : "tile";
    }
    
    placeNumbers();
    toggleRetry(true);
    retry();
    
    if (split.length == 3) {
        importState(split[2]);
    }
    else if (split.length == 4) {
        
        importState(split[2], split[3]);
    }
    setGameTitle();
}

exportGrid = function() {

    for (r = 5; r > 0; r--) {

        if (width % r == 0) {
            break;
        }
    }
    
    toCmp = "";
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {

            toCmp += grid[x][y] == "bomb" ? 1 : 0;
        }
    }

    toExp = radix.convert(width, 10, 36) + "-" + compressor.compress(toCmp, 1, r);
    // console.warn("cmp", compressor.uncompress(toExp,1,r))
    return toExp;
}

exportState = function() {

    for (q = 2; q > 0; q--) {
        
        if (width % q == 0) {
            break;
        }
    }
    
    cmpState = "";
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            
            switch(field[x][y]) {

                case "0-tile":
                case "1-tile":
                case "2-tile":
                case "3-tile":
                case "4-tile":
                case "5-tile":
                case "6-tile":
                case "7-tile":
                case "8-tile":
                    cmpState += "0";
                break;
                case "tile":
                case "bomb":
                case "exploded-bomb":
                        cmpState += "1";
                break;
                case "flag":
                case "not-bomb":
                    cmpState += "2";
                break;
                case "maybe":
                    cmpState += "3";
                break;
            }
        }
    }
    exState = compressor.compress(cmpState, 2, 2*q)
    // console.warn(q, cmpState)
    // console.warn(cmpState, "//cmpState");
    // console.error(2, 2*q,compressor.radixCompress(cmpState,2,4))
    // console.warn(exState, "//exState");
    // console.error(compressor.radixUncompress(compressor.radixCompress(cmpState,2,2*q),2*q,2));
    toExp = document.getElementById("shareURL").value + "-" + exState + "-" + radix.convert(time, 10, 36);
    return toExp;
}

importState = function(state_str, time_str = 0) {

    for (q = 2; q > 0; q--) {
        
        if (width % q == 0) {
            break;
        }
    }
    
    impState = compressor.uncompress(state_str, 2*q, 2);
    time = radix.convert(time_str, 36, 10);
    // console.warn(impState, "time", time);
    for (i = 0; i < impState.length; i++) {

        x = i % width;
        y = Math.floor(i/width);

        if (impState[i] == "0") {

            field[x][y] = grid[x][y] + "-tile";
        }
        else if (impState[i] == "2") {
            
            field[x][y] = "flag";
            minesLeft--;
        }
        else if (impState[i] == "3") {
            
            field[x][y] = "maybe";
        }
        updateTile(x,y);
    }

    setMinesDisplay();
    setTimerDisplay();

    isNotWon = !checkWinCondition(true)
    if (firstClick && isNotWon) {

        firstClick = false;
        timeCounter = setInterval(clock, 1000);
        
        generateLink();
    }
    else {

        playing = false;  
    }
}

loadCookies = function() {

    gameWindow_x = parseInt(checkCookie("MS5_game_x", gameWindow_x));
    gameWindow_y = parseInt(checkCookie("MS5_game_y", gameWindow_y));
    settingsWindow_x = parseInt(checkCookie("MS5_settings_x", settingsWindow_x));
    settingsWindow_y = parseInt(checkCookie("MS5_settings_y", settingsWindow_y));
    settingsWindow.style.zIndex = parseInt(checkCookie("MS5_settings_z", 3));
    shareWindow_x = parseInt(checkCookie("MS5_share_x", shareWindow_x));
    shareWindow_y = parseInt(checkCookie("MS5_share_y", shareWindow_y));
    shareWindow.style.zIndex = parseInt(checkCookie("MS5_share_z", 2));
    statsWindow_x = parseInt(checkCookie("MS5_stats_x", statsWindow_x));
    statsWindow_y = parseInt(checkCookie("MS5_stats_y", statsWindow_y));
    statsWindow.style.zIndex = parseInt(checkCookie("MS5_stats_z", 1));
    
    toFocus = new Array(extraWindows.length);
    toFocus[settingsWindow.style.zIndex - 1] = settingsWindow;
    toFocus[shareWindow.style.zIndex - 1] = shareWindow;
    toFocus[statsWindow.style.zIndex - 1] = statsWindow;
    // extraWindows[extraWindows.length-settingsWindow.style.zIndex] = settingsWindow;
    // extraWindows[extraWindows.length-shareWindow.style.zIndex] = shareWindow;
    // extraWindows[extraWindows.length-statsWindow.style.zIndex] = statsWindow;
    

    dark_mode = checkCookie("MS5_dark_mode", "" + dark_mode) == "true" ? true : false;
    maybe = checkCookie("MS5_maybe", "" + maybe) == "true" ? true : false;
    flagWarning = checkCookie("MS5_flagWarning", "" + flagWarning) == "true" ? true : false;
    freeBorder = checkCookie("MS5_freeBorder", "" + freeBorder) == "true" ? true : false;
    displaySettings = checkCookie("MS5_displaySettings", "" + displaySettings) == "true" ? true : false;
    displayShare = checkCookie("MS5_displayShare", "" + displayShare) == "true" ? true : false;
    displayStats = checkCookie("MS5_displayStats", "" + displayStats) == "true" ? true : false;
    
    scaleCookie = parseInt(checkCookie("MS5_scale"));
    scale = scaleCookie > 20 ? scaleCookie : scale;
    document.getElementById("scaleValue").innerHTML = scale + "px scale";
    document.getElementById("scaleSlider").value = scale;
    
    document.getElementById("diff" + checkCookie("MS5_difficulty", "Intermediate")).checked = true;


    showedCookies = checkCookie("MS5_showedCookies", "false") == "true" ? true : false;
    if (!showedCookies) {

        cd = document.getElementById("cookie_disclaimer");
        cd.style.display = "";
        cd.style.left = (document.body.clientWidth - cd.offsetWidth)/2;
    }
}

loadWindowZIndex = function() {

    for (tf = 0; tf < toFocus.length; tf++) {

        focusWindow(toFocus[tf]);
        
    }
}

setSettings = function() {

    if (dark_mode) {
        toggleDarkMode("dark", false);
    } 
    if (maybe) {
        toggleMaybe(true);
    }
    if (flagWarning) {
        toggleFlagWarning(true);
    }
    if (freeBorder) {
        toggleFreeBorder(true);
    }
    if (displaySettings) {
        displaySettings = false;
        settingsToggle();
    }
    if (displayShare) {
        displayShare = false;
        shareToggle();
    }
    if (displayStats) {
        displayStats = false;
        statsToggle();
    }


    document.getElementById('toggleLightsCheck').checked = !dark_mode;
    document.getElementById('toggleMaybeCheck').checked = maybe;
    document.getElementById('toggleFlagWarningCheck').checked = flagWarning;
    document.getElementById('toggleFreeBorderCheck').checked = freeBorder;
}

loadGameFromURL = function() {

    URLgame = window.location.href.split("?")
    cookieGame = checkCookie("MS5_lastGameState", "");

    if (URLgame.length > 1) {
        
        // console.warn("loading game from url", URLgame[1]);
        importGrid(URLgame[1]);
        generateLink();
    }
    else if (cookieGame.length != 0) {
        
        // console.error(cookieGame)
        importGrid(cookieGame);
    }
}

generateLink = function() {

    document.getElementById("shareURL").value = window.location.href.split("?")[0] + "?" + exportGrid();
    document.getElementById("shareURLbtn").disabled = false;
    showExportedState();
}

copyGameURL = function() {

    // document.getElementById("shareURL").select();
    // document.execCommand("copy");
    copyLink(document.location.href + "?" + exportGrid())
    document.getElementById("shareURLbtn").innerHTML = "Link copied!";
}

copyGameStateURL = function() {

    // document.getElementById("shareState").select();
    // document.execCommand("copy");
    copyLink(exportState());
    document.getElementById("shareStateBtn").innerHTML = "Link copied!";
}


copyLink = function(URL_to_copy) {

    share_url = URL_to_copy;//document.location.href + "?" + exportGrid(true);

    link = document.createElement('textarea');
    link.value = share_url;
    link.setAttribute('readonly', '');
    link.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(link);
    link.select();
    document.execCommand('copy');
    document.body.removeChild(link);
}

showExportedState = function() {

    if (displayShare && document.getElementById("shareURL").value != "") {
            
        if (editing) {
            
            document.getElementById("shareState").value = "";
            document.getElementById("shareStateBtn").disabled = true;
        }
        else {

            document.getElementById("shareState").value = exportState();
            document.getElementById("shareStateBtn").disabled = false;
        }
    }
}

main = function() {
    
    referenceScale = parseInt(document.getElementById("scaleSlider").value);
    if (scale != referenceScale) {

        scale = referenceScale;
        document.getElementById("scaleValue").innerHTML = scale + "px scale";
        setCookie("MS5_scale", scale, 30);
        reRender();
    }
}

statsCookieName = function(a1, a2, cDiff = currentDifficulty) {

    return "MS5_stats_" + cDiff + "_" + tracking[a1][a2].replace(" ", "_");
}

setStatisticsCookies = function(didWin) {
    
    decPlaces = 2;

    total_wins = parseInt(checkCookie(statsCookieName(0, 0), 0));
    total_losses = parseInt(checkCookie(statsCookieName(0, 1), 0));
    total_games = total_wins + total_losses;
    
    // parseFloat twice because ".toFixed()" returns a string
    avg_win_time = parseFloat(parseFloat(checkCookie(statsCookieName(1, 2), -1)).toFixed(decPlaces), decPlaces); 
    avg_win_time = avg_win_time == NaN ? -1 : avg_win_time;
    avg_loss_time = parseFloat(parseFloat(checkCookie(statsCookieName(1, 3), -1)).toFixed(decPlaces), decPlaces);
    avg_loss_time = avg_loss_time == NaN ? -1 : avg_loss_time;
    avg_game_time = parseFloat(parseFloat(checkCookie(statsCookieName(1, 1), -1)).toFixed(decPlaces), decPlaces);
    avg_game_time = avg_game_time == NaN ? -1 : avg_game_time;

    if (didWin) {
        
        // Avg. full sweep time 
        if (avg_win_time >= 0) {

            new_avg_win_time = (avg_win_time * total_wins + time) / (total_wins + 1);
            setCookie(statsCookieName(1, 2), new_avg_win_time.toFixed(decPlaces), 30);
        }
        else {
            
            setCookie(statsCookieName(1, 2), time, 30);
        }

        //Full sweep
        setCookie(statsCookieName(0, 0), total_wins + 1, 30);
    }
    else if (!didWin){

        // Avg. explosion time 
        if (avg_loss_time >= 0) {

            new_avg_loss_time = (avg_loss_time * total_losses + time) / (total_losses + 1)
            setCookie(statsCookieName(1, 3), new_avg_loss_time.toFixed(decPlaces), 30);
        }
        else {

            setCookie(statsCookieName(1, 3), time, 30);
        }

        // bombs exploded
        setCookie(statsCookieName(0, 1), total_losses + 1, 30);
    }

    if (avg_game_time >= 0) {

        new_avg_game_time = (avg_game_time * total_games + time) / (total_games + 1)
        setCookie(statsCookieName(1, 1), new_avg_game_time.toFixed(decPlaces), 30);
    }
    else {

        setCookie(statsCookieName(1, 1), time, 30);
    }

    
 
    bf = 0;
    nr_tiles = [0, 0, 0, 0, 0, 0, 0, 0];
    for (Y = 0; Y < height; Y++) {
        for (X = 0; X < width; X++) {

            if (field[X][Y] == "flag" && grid[X][Y] == "bomb") {

                bf++;
            }
            else if (field[X][Y] != "tile" && field[X][Y] != "flag" && field[X][Y] != "maybe" && grid[X][Y] > 0 && grid[X][Y] < 9) {
                nr_tiles[grid[X][Y] - 1]++
            }
        }
    }

    for (n = 0; n < nr_tiles.length; n++) {

        setCookie(statsCookieName(2, n), parseInt(checkCookie(statsCookieName(2, n), 0)) + nr_tiles[n], 30);
    }

    bombs_found = parseInt(checkCookie(statsCookieName(0, 2), 0));
    // bombs found

    setCookie(statsCookieName(0, 2), bombs_found + bf, 30);


    if (currentDifficulty != "Custom") {

        // total_games + 1 because of new win or loss
        setCookie(statsCookieName(0, 3), (((bombs_found + bf)/((total_games + 1)*mines))*100).toFixed(decPlaces), 30);
    }
    else {
        
        setCookie(statsCookieName(0, 3), "-", 30);
    }

    
    // Fastest sweep
    bestTime = parseInt(checkCookie(statsCookieName(1, 0), -1));
    if (bestTime == NaN) {
        bestTime = -1;
    }
    
    if ((bestTime < 0 || time < bestTime) && didWin) {
        setCookie(statsCookieName(1, 0), time, 30);
    }

    createStatsTable();
}

setHistoryCookie = function(didWin) {

    
    for (th = trackingHistory; th > 0; th--) {

        val = checkCookie("MS5_history_" + (th - 1), "");
        // console.warn("val", th, val)
        setCookie("MS5_history_" + th, val, 30);
    }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    hist = didWin + "&" + currentDifficulty + "&" + Math.round((bf/mines) * 100) + "&" + time + "&" + today + "&" + document.location.href + "?" + exportGrid();
    // console.warn(encodeURIComponent(hist));
    setCookie("MS5_history_0", encodeURIComponent(hist), 30);

    createHistoryTable();
}