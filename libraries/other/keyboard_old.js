playerInputs = [];

function universalKeyboard() {

    this.keysDown = 0;
    this.lastKey = undefined;

    this.playerKeyboards = [];

    this.keyList = {

        // Arrowkeys
        38: "up",
        40: "down",
        37: "left",
        39: "right",
        // Special
        8: "backspace",
        9: "tab",
        32: "space",
        16: "shift",
        18: "alt",
        17: "ctrl",
        13: "enter",
        91: "command_left",
        93: "command_right", 
        // Numbers
        48: "zero",
        49: "one",
        50: "two",
        51: "three",
        52: "four",
        53: "five",
        54: "six",
        55: "seven",
        56: "eight",
        57: "nine",
        // Alphabet
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        219: "å",
        222: "ä",
        186: "ö",
        // Other    
        187: "plus",
        188: "comma",
        189: "dash",
        190: "dot"
    };

    for (code in this.keyList) {

        this[this.keyList[code]] = false;        
    }
}

function createPlayerKeyboard(playerObject) {

    keyboard.playerKeyboards.push(playerObject);   
}

function functions() {

    this.list = [];

    this.update = function() {

        for (item in this.list) {

            this.list[item]("banana");
        }
    }
}

document.onkeydown = function (event) {

    // Universal
    if (!keyboard[event.keyCode]) {

        keyboard.keysDown++;            
    }

    if (keyboard.keyList[event.keyCode] !== undefined) {

        keyboard[keyboard.keyList[event.keyCode]] = true;
    }

    keyboard[event.keyCode] = true;
    
    keyboard.lastKey = event.keyCode;

    for (player in keyboard.playerKeyboards) {
        
        for (inputKey in keyboard.playerKeyboards[player].controls) {
            
            if (keyboard.keyList[event.keyCode] == inputKey) {

                keyboard.playerKeyboards[player].controls[inputKey]();
            }
        }
    }
};

document.onkeyup = function (event) {

    if (keyboard.keyList[event.keyCode] !== undefined) {

        keyboard[keyboard.keyList[event.keyCode]] = false;
    }

    keyboard[event.keyCode] = false;

    keyboard.keysDown--;        
};

keyboard = new universalKeyboard();


// EXAMPLE PLAYER

player = function(inputs) {

    this.test = 0
    this.forward = function() {

        console.log("trip");
    }

    this.backward = function() {

        console.log("trap");
    }


    this.controls = [];
    this.functionList = [this.forward,this.backward];
    for (input in inputs) {

        this.controls[inputs[input]] = this.functionList[input];
    }

    createPlayerKeyboard(this);
}

player1 = new player(["up","down"]);

// EXAMPLE OVER