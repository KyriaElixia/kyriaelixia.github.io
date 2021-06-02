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
        value = value.split(".");


        integer = value[0];
        fraction = value[1];

        newInteger = 0;
        exponent = integer.length;

        // Integer conversion
        for (l = 0; l < integer.length; l++) {
            
            exponent -= 1;
            newInteger += this.list[integer.charAt(l)]*Math.pow(base,exponent);
        }

        newFraction = 0;
        exponent = -1;

        // Fraction conversion
        for (l = 0; l < fraction.length; l++) {

            newFraction += this.list[fraction.charAt(l)]*Math.pow(base,exponent);
            exponent -= 1;
        }

        
        newValue = newInteger + newFraction;
        return newValue;
    }

    this.fromDecimalTo = function(base,value) {

        exponent = 1;
        fraction = value % 1;
        integer = value - fraction;

        while (Math.pow(base,exponent) < integer) {
            
            exponent++;
        }

        newInteger = "";
        for (e = exponent; e >= 0; e--) {
            if (integer/Math.pow(base,e) >= 1) {
     
                factor = Math.floor(integer/Math.pow(base,e));

                integer -= Math.pow(base,e)*factor;

                if (factor > 9) {                    
                    newInteger += this.list[factor];
                }
                else {
                    newInteger += factor;
                }
            }
            else {
                newInteger += "0";
            }
        }

        exponent = -1;
        newFraction = "";
        while (fraction > Math.pow(10,-16)) {

            if (fraction/Math.pow(base,exponent) >= 1) {
                
                factor = Math.floor(fraction/Math.pow(base,exponent));

                fraction -= Math.pow(base,exponent)*factor;

                if (factor > 9) {                    
                    newFraction += this.list[factor];
                }
                else {
                    newFraction += factor;
                }
            }
            else {
                newFraction += "0";
            }
            exponent--;
            // console.log(fraction, factor, newFraction)
        }
        
        newValue = newInteger + "." + newFraction.toFixed(4);
        // console.log("val",newInteger,newFraction,newValue);

        if (this.clearZeros) {

            for (z = 0; z < newValue.length-1; z++) {
                
                
                if (newValue.charAt(z) == "0" && newValue.charAt(z + 1) != "." && newValue.length > 1) {
                    
                    newValue = newValue.slice(1,newValue.length);
                    z--;
                }
                else {
                   break;
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