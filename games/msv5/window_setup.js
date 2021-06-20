gameWindow = createWindow('game' + totalWindows, 50, 50, false, false); 
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

// document.getElementById("settingss1_bar").appendChild(settingsBtn);

settingsWindow = createWindow('settings' + totalWindows, 150, 100, false, false);
settingsWindow.style.display = "none";

settings_bar = document.getElementById("settings1_bar");
settingsWindow.style.width = 300;
settings_bar.style.width = 300;


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
}
