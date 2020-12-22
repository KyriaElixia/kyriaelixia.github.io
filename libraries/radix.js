    // Radix converter

radixFunc = function () {

    this.clearZeros = true;

    this.list = {
        
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        10: "A",
        11: "B",
        12: "C",
        13: "D",
        14: "E",
        15: "F",
        16: "G",
        17: "H",
        18: "I",
        19: "J",
        20: "K",
        21: "L",
        22: "M",
        23: "N",
        24: "O",
        25: "P",
        26: "Q",
        27: "R",
        28: "S",
        29: "T",
        30: "U",
        31: "V",
        32: "W",
        33: "X",
        34: "Y",
        35: "Z",
        "A": 10,
        "B": 11,
        "C": 12,
        "D": 13,
        "E": 14,
        "F": 15,
        "G": 16,
        "H": 17,
        "I": 18,
        "J": 19,
        "K": 20,
        "L": 21,
        "M": 22,
        "N": 23,
        "O": 24,
        "P": 25,
        "Q": 26,
        "R": 27,
        "S": 28,
        "T": 29,
        "U": 30,
        "V": 31,
        "W": 32,
        "X": 33,
        "Y": 34,
        "Z": 35
    }

    this.toDecimalFrom = function(base,value) {

        value = "" + value;
        newValue = 0;
        exponent = value.length;

        for (l = 0; l < value.length; l++) {
            
            exponent -= 1;
            newValue += this.list[value.charAt(l)]*Math.pow(base,exponent);
        }

        return newValue;
    }

    this.fromDecimalTo = function(base,value) {

        exponent = 1;
        while (Math.pow(base,exponent) < value) {
            
            exponent++;
        }

        newValue = "";
        for (e = exponent; e >= 0; e--) {
            if (value/Math.pow(base,e) >= 1) {
     
                factor = Math.floor(value/Math.pow(base,e));

                value -= Math.pow(base,e)*factor;

                if (factor > 9) {                    
                    newValue += this.list[factor];
                }
                else {
                    newValue += factor;
                }
            }
            else {
                newValue += "0";
            }
        }

        if (this.clearZeros) {

            for (z = 0; z < newValue.length; z++) {
                
                if (newValue.charAt(z) == "0" && newValue.length > 1) {
                    
                    newValue = newValue.slice(1,newValue.length);
                    z--;
                }
                else {
                    z = newValue.length;
                }
            }
        }

        return newValue;
    }

    this.convert = function(value, fromBase, toBase) {

        return this.fromDecimalTo(toBase,this.toDecimalFrom(fromBase,value));
    }

    this.setLength = function(limit,input) {

        exntension = "";
        for (l = 0; l < limit - input.length; l++) {

            exntension += "0";
        }
        return exntension + input;
    }
}

radix = new radixFunc();