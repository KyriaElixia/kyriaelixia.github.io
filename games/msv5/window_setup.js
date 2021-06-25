gameWindow_x = 50;
gameWindow_y = 50;


gameWindow = createWindow('game' + totalWindows, gameWindow_x, gameWindow_y, false, false); 
gameWindow.style.backgroundColor = "#bdbdbd";

// settingsImg = document.createElement("img");
// settingsImg.width = 30;
// settingsImg.src = "sprites/light_mode/buttons/settings.png";
// settingsImg.id = "settings_button";
// settingsImg.style.userSelect = "none";
// document.getElementById("game0_bar").appendChild(settingsImg);

btns = [];

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

    btns[i] = settingsBtn;
}

document.getElementById("game0_bar").appendChild(btns[0]);

gameTitle = document.createElement("div");
gameTitle.innerHTML = "Minesweeper";
gameTitle.style.position = "absolute";
gameTitle.style.top = 7;
gameTitle.className = "title";
gameTitle.id = "gameTitle";
gameTitle.style.userSelect = "none";
document.getElementById("game0_bar").appendChild(gameTitle);

document.getElementById("game0_bar").onclick = function() {

    gameWindow_x = parseInt(gameWindow.style.left);
    gameWindow_y = parseInt(gameWindow.style.top);
    setCookie("MS5_game_x", parseInt(gameWindow_x), 30);
    setCookie("MS5_game_y", parseInt(gameWindow_y), 30);
}


// document.getElementById("settingss1_bar").appendChild(settingsBtn);
settingsWindow_x = 150;
settingsWindow_y = 100;

settingsWindow = createWindow('settings' + totalWindows, settingsWindow_x, settingsWindow_y, false, false);
settingsWindow.style.display = "none";

settings_bar = document.getElementById("settings1_bar");
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
document.getElementById("settings1_bar").appendChild(settingsTitle);

settings_bar.onclick = function() {
    
    settingsWindow_x = parseInt(settingsWindow.style.left);
    settingsWindow_y = parseInt(settingsWindow.style.top);
    setCookie("MS5_settings_x", parseInt(settingsWindow_x), 30);
    setCookie("MS5_settings_y", parseInt(settingsWindow_y), 30);
}


settingsWindow.appendChild(document.getElementById("settings_panel"));
document.getElementById("settings1_bar").appendChild(btns[1]);

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
