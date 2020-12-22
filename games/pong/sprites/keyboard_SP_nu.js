function keyboard_2() {

    var env = this;

    this.verbose = false;

    this.keysDown = 0;

    this.names =
        {
            38: "up",
            40: "down",
            37: "left",
            39: "right",
            32: "space",
            16: "shift",
            18: "alt",
            17: "ctrl",
            13: "enter",
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
            90: "z"
        };

    for (var code in this.names)
        this[this.names[code]] = false;

    document.onkeydown = function (event) {

        if (!env[event.keyCode])
            env.keysDown++;

        if (env.names[event.keyCode] !== undefined)
            env[env.names[event.keyCode]] = true;
        env[event.keyCode] = true;

        if (env.verbose)
            alert(event.keyCode);
    };

    document.onkeyup = function (event) {
        if (env.names[event.keyCode] !== undefined)
            env[env.names[event.keyCode]] = false;
        env[event.keyCode] = false;

        env.keysDown--;
    };
}