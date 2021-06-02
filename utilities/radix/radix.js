fromBase = 10;
toBase = 10;
size = 15;

lFB = 0;
lTB = 0;

format = {
    "0":"0",
    "1":"1",
    "2":"2",
    "3":"3",
    "4":"4",
    "5":"5",
    "6":"6",
    "7":"7",
    "8":"8",
    "9":"9",
    "a":"A",
    "b":"B",
    "c":"C",
    "d":"D",
    "e":"E",
    "f":"F",
    "g":"G",
    "h":"H",
    "i":"I",
    "j":"J",
    "k":"K",
    "l":"L",
    "m":"M",
    "n":"N",
    "o":"O",
    "p":"P",
    "q":"Q",
    "r":"R",
    "s":"S",
    "t":"T",
    "u":"U",
    "v":"V",
    "w":"W",
    "x":"X",
    "y":"Y",
    "z":"Z",
    "A":"A",
    "B":"B",
    "C":"C",
    "D":"D",
    "E":"E",
    "F":"F",
    "G":"G",
    "H":"H",
    "I":"I",
    "J":"J",
    "K":"K",
    "L":"L",
    "M":"M",
    "N":"N",
    "O":"O",
    "P":"P",
    "Q":"Q",
    "R":"R",
    "S":"S",
    "T":"T",
    "U":"U",
    "V":"V",
    "W":"W",
    "X":"X",
    "Y":"Y",
    "Z":"Z",
    ".":"."
}

limit = {

    "0":0,
    "1":1,
    "2":2,
    "3":3,
    "4":4,
    "5":5,
    "6":6,
    "7":7,
    "8":8,
    "9":9,
    "A":10,
    "B":11,
    "C":12,
    "D":13,
    "E":14,
    "F":15,
    "G":16,
    "H":17,
    "I":18,
    "J":19,
    "K":20,
    "L":21,
    "M":22,
    "N":23,
    "O":24,
    "P":25,
    "Q":26,
    "R":27,
    "S":28,
    "T":29,
    "U":30,
    "V":31,
    "W":32,
    "X":33,
    "Y":34,
    "Z":35,
    ".":"."
}

update = function() {
    
    //BASES
    dFB = document.getElementById("fromBase").value;
    dTB = document.getElementById("toBase").value;

    if (dFB != fromBase) {
        fromBase = dFB;
        document.getElementById("fromBaseText").innerHTML = fromBase;
        convert();
    }

    if (dTB != toBase) {
        toBase = dTB;
        document.getElementById("toBaseText").innerHTML = toBase;
        convert();
    }

    if (lFB != (document.getElementById("fromValue").value).length) {

        convert();
    }

    if (document.getElementById("fromValue").value.length == 0) {
        
        document.getElementById("toValue").value = "";
    }

    if (size != parseInt(document.getElementById("size").value)) {

        document.body.style.setProperty("--fontsize", parseInt(document.getElementById("size").value))
    }
    

    lFB = (document.getElementById("fromValue").value).length;
    lTB = (document.getElementById("toValue").value).length;
}

preformat = function(input) {
    
    preformatted = "";
    
    for (i = 0; i < input.length; i++) {

        formatting = format[input[i]];

        if (limit[formatting] < parseInt(fromBase)) {
            
            preformatted += formatting;
        }
    }

    return preformatted;
}

convert = function() {

    needConverting = preformat(document.getElementById("fromValue").value)

    document.getElementById("fromValue").value = needConverting;
    document.getElementById("toValue").value = radix.convert(needConverting,parseInt(fromBase),parseInt(toBase));
}

switchBase = function() {

    tempBase = fromBase;
    fromBase = toBase;
    toBase = tempBase;
    
    document.getElementById("fromBaseText").innerHTML = fromBase;
    document.getElementById("toBaseText").innerHTML = toBase;
    document.getElementById("fromBase").value = fromBase;
    document.getElementById("toBase").value = toBase;

    tempConvert = encodeURIComponent(document.getElementById("fromValue").value);
    document.getElementById("fromValue").value = document.getElementById("toValue").value;
    document.getElementById("toValue").value = decodeURIComponent(tempConvert); 

    convert();
}

window.onload = function() {

    fromBase = 10;
    toBase = 10;

    document.getElementById("fromBaseText").innerHTML = fromBase;
    document.getElementById("toBaseText").innerHTML = toBase;
    document.getElementById("fromBase").value = fromBase;
    document.getElementById("toBase").value = toBase;
}

FPS = 60;
clock = setInterval(update,1000/FPS);