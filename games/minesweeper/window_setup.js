

extraWindows = [];
windowShadow = "0px 2px 8px 0px #3c3c3c";
document.getElementById("cookie_disclaimer").style.boxShadow = windowShadow;
///////////////////////////////////////////////////////////////////

start_game_x = 50;
start_game_y = 50;
start_extra_x = 150;
start_extra_y = 100;

// Game window
gameWindow_x = start_game_x;
gameWindow_y = start_game_y;

gameWindow = createWindow('game', gameWindow_x, gameWindow_y, false, false); 
gameWindow.style.backgroundColor = "#bdbdbd";
gameWindow.style.boxShadow = windowShadow;
gameWindow.style.zIndex = 0;

// settingsImg = document.createElement("img");
// settingsImg.width = 30;
// settingsImg.src = "sprites/light_mode/buttons/settings.png";
// settingsImg.id = "settings_button";
// settingsImg.style.userSelect = "none";
// document.getElementById("game_bar").appendChild(settingsImg);

settingsBtns = [];

for (i = 0; i < 2; i++) {
    
    settingsBtn = document.createElement("div");
    settingsBtn.style.width = 30;
    settingsBtn.style.height = 30;
    settingsBtn.style.fontSize = 21;
    settingsBtn.innerHTML = "&#9776;";
    settingsBtn.className = "customButton";
    settingsBtn.style.verticalAlign = "text-bottom";
    settingsBtn.style.textAlign = "center";
    settingsBtn.id = "settings_button_" + (i+1);
    settingsBtn.style.userSelect = "none";
    settingsBtn.onclick = function() { settingsToggle(); }
    settingsBtn.title = "Open/close the settings window";

    settingsBtns[i] = settingsBtn;
}
document.getElementById("game_bar").appendChild(settingsBtns[0]);

shareBtns = [];
for (i = 0; i < 2; i++) {

    shareBtn = document.createElement("div");
    shareBtn.style.width = 30;
    shareBtn.style.height = 30;
    shareBtn.style.fontSize = 26;
    shareBtn.style.position = "absolute";
    shareBtn.style.left = 30 *(1-i);
    shareBtn.style.top = 0;
    shareBtn.innerHTML = "+";
    shareBtn.className = "customButton";
    shareBtn.style.verticalAlign = "text-bottom";
    shareBtn.style.textAlign = "center";
    shareBtn.id = "share_button_" + (i+1);
    shareBtn.style.userSelect = "none";
    shareBtn.onclick = function() { shareToggle(); }
    shareBtn.title = "Open/close the share/history window";
    
    shareBtns.push(shareBtn);
}
document.getElementById("game_bar").appendChild(shareBtns[0]);

statsBtns = [];
for (i = 0; i < 2; i++) {

    statsBtn = document.createElement("div");
    statsBtn.style.width = 30;
    statsBtn.style.height = 30;
    // statsBtn.style.fontSize = 25;
    statsBtn.style.fontSize = 21;
    statsBtn.style.position = "absolute";
    statsBtn.style.left = 60 *(1-i);
    statsBtn.style.top = 0;
    // statsBtn.innerHTML = "&#8904;";
    statsBtn.innerHTML = "&#9783;";
    statsBtn.className = "customButton";
    statsBtn.style.verticalAlign = "text-bottom";
    statsBtn.style.textAlign = "center";
    statsBtn.id = "stats_button_" + (i+1);
    statsBtn.style.userSelect = "none";
    statsBtn.onclick = function() { statsToggle(); }
    statsBtn.title = "Open/close the statistics window";
    
    statsBtns.push(statsBtn);
}
document.getElementById("game_bar").appendChild(statsBtns[0]);
 


gameTitle = document.createElement("div");
gameTitle.innerHTML = "Minesweeper";
gameTitle.style.position = "absolute";
gameTitle.style.top = 7;
gameTitle.className = "title";
gameTitle.id = "gameTitle";
gameTitle.style.userSelect = "none";
document.getElementById("game_bar").appendChild(gameTitle);

document.getElementById("game_bar").onclick = function() {

    gameWindow_x = parseInt(gameWindow.style.left);
    gameWindow_y = parseInt(gameWindow.style.top);
    setCookie("MS5_game_x", parseInt(gameWindow_x), 30);
    setCookie("MS5_game_y", parseInt(gameWindow_y), 30);
}

///////////////////////////////////////////////////////////////////
// Settings window

// document.getElementById("settingss1_bar").appendChild(settingsBtn);
settingsWindow_x = start_extra_x;
settingsWindow_y = start_extra_y;

settingsWindow = createWindow('settings', settingsWindow_x, settingsWindow_y, false, false);
settingsWindow.style.display = "none";
settingsWindow.style.boxShadow = windowShadow;
settingsWindow.style.zIndex = parseInt(checkCookie("MS5_settings_z", 3));
settingsWindow.style.backgroundColor = "#ebebeb";
extraWindows.push(settingsWindow);

settings_bar = document.getElementById("settings_bar");
settingsWidth = 375;
settingsWindow.style.width = settingsWidth;
settings_bar.style.width = settingsWidth;

settingsTitle = document.createElement("div");
settingsTitle.innerHTML = "Settings";
settingsTitle.style.position = "absolute";
settingsTitle.style.top = 7;
settingsTitle.style.left = (settingsWidth-77)/2;
settingsTitle.className = "title";
settingsTitle.id = "settingsTitle";
settingsTitle.style.userSelect = "none";
document.getElementById("settings_bar").appendChild(settingsTitle);

settings_bar.onclick = function() {
    
    settingsWindow_x = parseInt(settingsWindow.style.left);
    settingsWindow_y = parseInt(settingsWindow.style.top);
    setCookie("MS5_settings_x", parseInt(settingsWindow_x), 30);
    setCookie("MS5_settings_y", parseInt(settingsWindow_y), 30);
}

settingsWindowFocus = function() {

    focusWindow(settingsWindow);
}
settingsWindow.onclick = settingsWindowFocus;
settingsWindow.onmousedown = settingsWindowFocus;


settingsWindow.appendChild(document.getElementById("settings_panel"));
document.getElementById("settings_bar").appendChild(settingsBtns[1]);
document.getElementById("settings_panel").style.display = "";

///////////////////////////////////////////////////////////////////
// Share window


shareWindow_x = start_extra_x;
shareWindow_y = start_extra_y;

shareWindow = createWindow('share', shareWindow_x, shareWindow_y, false, false);
shareWindow.style.display = "none";
shareWindow.style.boxShadow = windowShadow;
shareWindow.style.zIndex = parseInt(checkCookie("MS5_share_z", 2));
shareWindow.style.backgroundColor = "#ebebeb";
extraWindows.push(shareWindow);

share_bar = document.getElementById("share_bar");
shareWidth = 450;
shareWindow.style.width = shareWidth;
share_bar.style.width = shareWidth;
shareWindow.style.height = 600;

shareTitle = document.createElement("div");
shareTitle.innerHTML = "Share / History";
shareTitle.style.position = "absolute";
shareTitle.style.top = 7;
shareTitle.style.left = (shareWidth-144)/2;
shareTitle.className = "title";
shareTitle.id = "shareTitle";
shareTitle.style.userSelect = "none";
document.getElementById("share_bar").appendChild(shareTitle);

share_bar.onclick = function() {
    
    shareWindow_x = parseInt(shareWindow.style.left);
    shareWindow_y = parseInt(shareWindow.style.top);
    setCookie("MS5_share_x", parseInt(shareWindow_x), 30);
    setCookie("MS5_share_y", parseInt(shareWindow_y), 30);
}

shareWindowFocus = function() {

    focusWindow(shareWindow);
}
shareWindow.onclick = shareWindowFocus;
shareWindow.onmousedown = shareWindowFocus;



shareWindow.appendChild(document.getElementById("share_panel"));
shareWindow.appendChild(document.getElementById("history_panel"));

document.getElementById("share_bar").appendChild(shareBtns[1]);
document.getElementById("share_panel").style.display = "";







///////////////////////////////////////////////////////////////////
// Statistics window

// document.getElementById("settingss1_bar").appendChild(settingsBtn);
statsWindow_x = start_extra_x;
statsWindow_y = start_extra_y;

statsWindow = createWindow('stats', statsWindow_x, statsWindow_y, false, false);
statsWindow.style.display = "none";
statsWindow.style.boxShadow = windowShadow;
statsWindow.style.zIndex = parseInt(checkCookie("MS5_stats_z", 1));
statsWindow.style.backgroundColor = "#ebebeb";
extraWindows.push(statsWindow);

stats_bar = document.getElementById("stats_bar");
statsWidth = 700;
statsWindow.style.width = statsWidth;
stats_bar.style.width = statsWidth;
statsWindow.style.height = 400;
document.getElementById("stats_panel").style.height = parseInt(statsWindow.style.height) - parseInt(stats_bar.style.height)-5;


statsTitle = document.createElement("div");
statsTitle.innerHTML = "Statistics";
statsTitle.style.position = "absolute";
statsTitle.style.top = 7;
statsTitle.style.left = (statsWidth-96)/2;
statsTitle.className = "title";
statsTitle.id = "statsTitle";
statsTitle.style.userSelect = "none";
document.getElementById("stats_bar").appendChild(statsTitle);

stats_bar.onclick = function() {
    
    statsWindow_x = parseInt(statsWindow.style.left);
    statsWindow_y = parseInt(statsWindow.style.top);
    setCookie("MS5_stats_x", parseInt(statsWindow_x), 30);
    setCookie("MS5_stats_y", parseInt(statsWindow_y), 30);
}

statsWindowFocus = function() {

    focusWindow(statsWindow);
}
statsWindow.onclick = statsWindowFocus;
statsWindow.onmousedown = statsWindowFocus;


statsWindow.appendChild(document.getElementById("stats_panel"));
document.getElementById("stats_bar").appendChild(statsBtns[1]);
document.getElementById("stats_panel").style.display = "";


///////////////////////////////////////////////////////////////////
// Button functions

displaySettings = false;
settingsToggle = function() {
    
    if (displaySettings) {
        
        settingsWindow.style.display = "none";
        displaySettings = false;
    }
    else {
        
        settingsWindow.style.display = "";
        displaySettings = true;
        focusWindow(settingsWindow);
    }
    setCookie("MS5_displaySettings", displaySettings, 30);
}

displayShare = false;
shareToggle = function() {
    
    if (displayShare) {
        
        shareWindow.style.display = "none";
        displayShare = false;
    }
    else {
        
        shareWindow.style.display = "";
        displayShare = true;
        focusWindow(shareWindow);   
        showExportedState(); 
    }
    setCookie("MS5_displayShare", displayShare, 30); 
}

displayStats = false;
statsToggle = function() {
    
    if (displayStats) {
        
        statsWindow.style.display = "none";
        displayStats = false;
    }
    else {
        
        statsWindow.style.display = "";
        displayStats = true;
        focusWindow(statsWindow);  
    }
    setCookie("MS5_displayStats", displayStats, 30); 
}

// settingsImg.onclick = function() { settingsToggle(); }
// settingsImg.onmousedown = function() { settingsImg.src = imgSrc["settings_pushed"]}
// settingsImg.onmouseup = function() { settingsImg.src = imgSrc["settings"]}
// settingsImg.onmouseleave = function() { settingsImg.src = imgSrc["settings"]}



focusWindow = function(focus) {

    tempFocus = 0;
    for (f = 0; f < extraWindows.length; f++) {
        if (extraWindows[f] == focus) {
            
            tempFocus = f;
        }
    }

    for (f = tempFocus; f > 0; f--) {

        extraWindows[f] = extraWindows[f - 1]; 
    }
    extraWindows[0] = focus;

    for (f = 0; f < extraWindows.length; f++) {

        extraWindows[f].style.zIndex = extraWindows.length - f; 
    }
    zIndexCookieSave();
}

zIndexCookieSave = function() {
    
    setCookie("MS5_settings_z", parseInt(settingsWindow.style.zIndex));
    setCookie("MS5_share_z", parseInt(shareWindow.style.zIndex));
    setCookie("MS5_stats_z", parseInt(statsWindow.style.zIndex));
}

resetWindows = function() {

    gameWindow_x = start_game_x;
    gameWindow_y = start_game_y;
    shareWindow_x = start_extra_x;
    shareWindow_y = start_extra_y;
    settingsWindow_x = start_extra_x;
    settingsWindow_y = start_extra_y;
    statsWindow_x = start_extra_x;
    statsWindow_y = start_extra_y;

    document.getElementById("game").style.left = start_game_x;
    document.getElementById("game").style.top = start_game_y;
    document.getElementById("settings").style.left = start_extra_x;
    document.getElementById("settings").style.top = start_extra_y;
    document.getElementById("share").style.left = start_extra_x;
    document.getElementById("share").style.top = start_extra_y;
    document.getElementById("stats").style.left = start_extra_x;
    document.getElementById("stats").style.top = start_extra_y;

    setCookie("MS5_game_x", parseInt(gameWindow_x), 30);
    setCookie("MS5_game_y", parseInt(gameWindow_y), 30);
    setCookie("MS5_settings_x", parseInt(settingsWindow_x), 30);
    setCookie("MS5_settings_y", parseInt(settingsWindow_y), 30);
    setCookie("MS5_share_x", parseInt(shareWindow_x), 30);
    setCookie("MS5_share_y", parseInt(shareWindow_y), 30);
    setCookie("MS5_stats_x", parseInt(statsWindow_x), 30);
    setCookie("MS5_stats_y", parseInt(statsWindow_y), 30);
}


window.onmouseup = function() { 
    
    if (clickDown && mx >= 0 && my >= 0) {
        
        document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc[field[mx][my]];    
    }
    clickDown = false;
    restartHover = false;
    
    if (peeking) {
        closePeek(peek_x, peek_y);
        recordedGame.push("C_"+ time + "_" + peek_x + "_" + peek_y);
        console.info("C_"+ time + "_" + peek_x + "_" + peek_y);
    }
}

window.onkeydown = function(e) { // disable scroll on spacebar
    
    if (e.keyCode == 32 && e.target == document.body) {
        
        e.preventDefault();
        
        if (!keyDown && playing && !editing) {
            
            spaceAction(mx, my);
            keyDown = true;
        }
    }
};

window.onkeyup = function(e) {
    
    if (e.keyCode == 32) {
        
        keyDown = false;
    }
    settingsWindow.onmousedown = settingsWindowFocus;
    shareWindow.onmousedown = shareWindowFocus;
}

// window.onbeforeunload = function() {

//     generateLink();
//     setCookie("MS5_lastGameState", document.getElementById("shareState").value);
//     alert("test");
//     return 'Are you sure you want to leave? BANANA';
// }

window.onunload = function() {
    
    
    if (playing && time != 0) {
        
        quitState = exportState().split("?")[1];
    }
    else {
        
        quitState = "";
    }
    
    setCookie("MS5_lastGameState", quitState);
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

        if (elmnt != gameWindow) {

            elmnt.style.zIndex = 5;
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        if ((elmnt.offsetTop - pos2) < 0) {
            elmnt.style.top = "0px";
        }

        if ((elmnt.offsetLeft - pos1) < 0) {
            elmnt.style.left = "0px";
        }
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.onmousedown = null; // Added by me to only allow dragging if bar is clicked
    }
}
