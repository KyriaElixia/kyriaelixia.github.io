
toggleDarkMode = function(modeSelect = "light", doRerender = true) {

    if (dark_mode && modeSelect == "light") {

        dark_mode = false;
 
        document.getElementById("settings").style.backgroundColor = "#ebebeb";
        document.getElementById("share").style.backgroundColor = "#ebebeb";
        document.getElementById("stats").style.backgroundColor = "#ebebeb";
        document.body.style.color = "black";
    } else {
        
        dark_mode = true;
    
        document.getElementById("settings").style.backgroundColor = "#777777";
        document.getElementById("share").style.backgroundColor = "#777777";
        document.getElementById("stats").style.backgroundColor = "#777777";
        document.body.style.color = "#cfcfcf";
    }

    updateImgSrc();
    mode = dark_mode ? "_dark" : "";
    document.getElementById("game").className = "window" + mode;
    document.getElementById("game_bar").className = "window_bar" + mode;
    document.getElementById("settings").className = "window" + mode;
    document.getElementById("settings_bar").className = "window_bar" + mode;
    document.getElementById("settings_button_1").className = "customButton" + mode;
    document.getElementById("settings_button_2").className = "customButton" + mode;
    document.getElementById("share").className = "window" + mode;
    document.getElementById("share_bar").className = "window_bar" + mode;
    document.getElementById("share_button_1").className = "customButton" + mode;
    document.getElementById("share_button_2").className = "customButton" + mode;
    document.getElementById("stats").className = "window" + mode;
    document.getElementById("stats_bar").className = "window_bar" + mode;
    document.getElementById("stats_button_1").className = "customButton" + mode;
    document.getElementById("stats_button_2").className = "customButton" + mode;
    document.getElementById("scaleSlider").className = "slider" + mode;
    document.getElementById("gameTitle").className = "title" + mode;
    document.getElementById("settingsTitle").className = "title" + mode;
    document.getElementById("shareTitle").className = "title" + mode;
    document.getElementById("statsTitle").className = "title" + mode;
    document.getElementById("customWidth").className = "io" + mode;
    document.getElementById("customHeight").className = "io" + mode;
    document.getElementById("customMines").className = "io" + mode;
    document.getElementById("shareURL").className = "io" + mode;
    document.getElementById("shareState").className = "io" + mode;
    document.getElementById("cookie_disclaimer").className = "cookie" + mode;
    
    buttons = document.getElementsByTagName("button");
    for (b = 0; b < buttons.length; b++) {
        
        buttons[b].className = "toggleButton" + mode;
    }

    setCookie("MS5_dark_mode", dark_mode, 30);
    document.getElementById('toggleLightsCheck').checked = !dark_mode;
    
    if (doRerender) {
        
        reRender();
    }
}

toggleMaybe = function(start = false) {

    if (maybe && !start) {

        maybe = false;
    } else {
        maybe = true;
    }
    setCookie("MS5_maybe", maybe, 30);
    document.getElementById('toggleMaybeCheck').checked = maybe;
}

toggleFlagWarning = function(start = false) {

    if (flagWarning && !start) {

        flagWarning = false;

        for (ty = 0; ty < height; ty++) {
            for (tx = 0; tx < width; tx++) {
                
                if (field[tx][ty].split("-")[0] == "error") {

                    field[tx][ty] = grid[tx][ty] + "-tile";
                    updateTile(tx, ty);
                }
            }
        }
    } 
    else if (!start) {

        flagWarning = true;

        for (ty = 0; ty < height; ty++) {
            for (tx = 0; tx < width; tx++) {
                
                if (field[tx][ty] == "flag") {
                    checkFlagWarning(tx, ty);
                }
            }
        }
    }
    setCookie("MS5_flagWarning", flagWarning, 30);
    document.getElementById('toggleFlagWarningCheck').checked = flagWarning;
}

toggleFreeBorder = function(start = false) {

    if (freeBorder && !start) {

        freeBorder = false;
    } else {
        freeBorder = true;
    }
    setCookie("MS5_freeBorder", freeBorder, 30);
    document.getElementById('toggleFreeBorderCheck').checked = freeBorder;
}

toggleRetry = function(start = false) {

    if (retrying && !start) {
        retrying = false;
        document.getElementById("retry-overlay").style.display = "none";
        document.getElementById("restartButton").onclick = function() { restart(); }
        document.getElementById("retryButton").disabled = true;
    }
    else {
        retrying = true;
        document.getElementById("retry-overlay").style.display = "";
        document.getElementById("restartButton").onclick = function() { retry(); }
        document.getElementById("retryButton").disabled = false;
    }
}

toggleEditor = function() {

    if (editing) {

        editing = false;
        playing = true;
        retrying = true;
        toggleRetry();
        // document.getElementById("gameTitle").innerHTML = "Minesweeper";
        restart();
    }
    else {
        
        editing = true;
        playing = false;
        retrying = true;
        toggleRetry();
        restart();
        // document.getElementById("gameTitle").innerHTML = "Minesweeper - Editor";
        document.getElementById("shareState").value = "";
        document.getElementById("shareStateBtn").disabled = true;
        
        resizeGrid();
        setMinesDisplay();

        for (Y = 0; Y < height; Y++) {
            for (X = 0; X < width; X++) {

                grid[X][Y] = 0;
                field[X][Y] = "0-tile";
            }
        }
    }

    reRender();
    document.getElementById("toggleEditor").checked = editing;
}

closeCookies = function() {

    document.getElementById('cookie_disclaimer').style.display = "none";
    setCookie("MS5_showedCookies", true, 30);
}

