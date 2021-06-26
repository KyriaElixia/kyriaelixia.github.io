
///////////////////////////////////////////////////////////////////
// Game window
gameWindow_x = 50;
gameWindow_y = 50;

gameWindow = createWindow('game', gameWindow_x, gameWindow_y, false, false); 
gameWindow.style.backgroundColor = "#bdbdbd";

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
    settingsBtn.title = "Open/close settings";

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
    shareBtn.title = "Open/close share window";
    
    shareBtns.push(shareBtn);
}
document.getElementById("game_bar").appendChild(shareBtns[0]);

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
// Share window


shareWindow_x = 150;
shareWindow_y = 100;

shareWindow = createWindow('share', shareWindow_x, shareWindow_y, false, false);
shareWindow.style.display = "none";

share_bar = document.getElementById("share_bar");
shareWidth = 700;
shareWindow.style.width = shareWidth;
share_bar.style.width = shareWidth;

shareTitle = document.createElement("div");
shareTitle.innerHTML = "Share";
shareTitle.style.position = "absolute";
shareTitle.style.top = 7;
shareTitle.style.left = (shareWidth-48)/2;
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


shareWindow.appendChild(document.getElementById("share_panel"));
document.getElementById("share_bar").appendChild(shareBtns[1]);
document.getElementById("share_panel").style.display = "";





///////////////////////////////////////////////////////////////////
// Settings window

// document.getElementById("settingss1_bar").appendChild(settingsBtn);
settingsWindow_x = 150;
settingsWindow_y = 100;

settingsWindow = createWindow('settings', settingsWindow_x, settingsWindow_y, false, false);
settingsWindow.style.display = "none";

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


settingsWindow.appendChild(document.getElementById("settings_panel"));
document.getElementById("settings_bar").appendChild(settingsBtns[1]);
document.getElementById("settings_panel").style.display = "";



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
    }
    setCookie("MS5_displayShare", displayShare, 30);
}

// settingsImg.onclick = function() { settingsToggle(); }
// settingsImg.onmousedown = function() { settingsImg.src = imgSrc["settings_pushed"]}
// settingsImg.onmouseup = function() { settingsImg.src = imgSrc["settings"]}
// settingsImg.onmouseleave = function() { settingsImg.src = imgSrc["settings"]}

window.onmouseup = function() { 
    
    if (clickDown && mx >= 0 && my >= 0) {
        
        document.getElementById("gameTileImg_" + mx + "_" + my).src = imgSrc[field[mx][my]];    
    }
    clickDown = false;
    restartHover = false;
    closePeek(peek_x, peek_y);
}

window.onkeydown = function(e) { // disable scroll on spacebar

    if (e.keyCode == 32 && e.target == document.body) {
        
        e.preventDefault();
        
        if (!keyDown && playing) {

            spaceAction(mx, my);
            keyDown = true;
        }
    }
};

window.onkeyup = function(e) {

    if (e.keyCode == 32) {

        keyDown = false;
    }
}