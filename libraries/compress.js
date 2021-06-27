

cmp = function() {

    // Radix compress between bases 2^{1,2,3,4,5}
    this.radixConvert = true;
    this.radixToBase = 5; // Integers between 1 and 5 works best (2^5 = 32, radix convert only goes up to base 36)
    this.radixFromBase = 1; // 2^x
    this.maxConvert = 36;

    this.repeatShorten = true;

    this.compress = function(str, fb = this.radixFromBase, tb = this.radixToBase) {

        
        rc = fb != tb ? this.radixCompress(str, fb, tb) : str;
        rcr = this.repeats(rc);
        // console.warn("rc ", rc);
        // console.warn("rcr", rcr);
        return rcr;
    }

    this.uncompress = function(str, fb = this.radixFromBase, tb = this.radixToBase) {

        ur = this.unrepeat(str); 
        ruc = fb != tb ? this.radixUncompress(ur, fb, tb) : ur;
        // console.warn("ur ", ur);    
        // console.warn("ruc", ruc);
        return ruc;
    }

    this.radixCompress = function(str, fb = this.radixFromBase, tb = this.radixToBase) {

        loops = str.length/tb;
        cmpStr = "";
        zeros = "00000";

        for (i = 0; i < loops; i++) {
            
            subStr = str.substring(i * tb, (i + 1) * tb);
            cmpSubStr = radix.convert(subStr, Math.pow(2, fb), Math.pow(2, tb));
            fill = zeros.substring(0, fb - cmpSubStr.length);

            cmpStr += fill + cmpSubStr;
        }
        return cmpStr;
    }

    this.radixUncompress = function(str, fb = this.radixFromBase, tb = this.radixToBase) {

        ucmp = "";
        zeros = "00000";
        diff = fb / tb;
        for (i = 0; i < str.length; i++) {
            
            u = radix.convert(str[i], Math.pow(2, fb), Math.pow(2, tb));
            fill = zeros.substring(0, diff - u.length);
            // console.error(fill, u, i);
            s =  fill + u;

            ucmp += s;
        }
        return ucmp;
    }

    this.repeats = function(str) {

        char = str[0];
        rep = 1;
        newStr = "";

        for (i = 1; i <= str.length; i++) {

            if (i < str.length && str[i] == char && rep < (this.maxConvert - 1)) {

                rep++;     
            }
            else {

                if (rep > 3) {

                    newStr += radix.convert(rep, 10, this.maxConvert) + "*" + char;
                }
                else {
                    for (j = 0; j < rep; j++) {
                        newStr += char;
                    }
                }
                char = str[i];
                rep = 1;
            }
            // console.log(i,char,str[i],rep)
        }
        return newStr;
    }

    this.unrepeat = function(str) {

        repeats = [];
        for (i = 0; i < str.length; i++) {

            if (str[i] == "*") {
                repeats.push(i);
            }
        }

        if (repeats.length > 0) {

            nr = str.substring(0, repeats[0] - 1)
            for (i = 0; i < repeats.length; i++) {
                times = radix.convert(str[repeats[i] - 1], 36, 10);
                for (j = 0; j < times; j++) {

                    nr += str[repeats[i] + 1];
                }

                if (repeats[i] + 2 < str.length) {
                    if (i < repeats.length - 1) {

                        nr += str.substring(repeats[i] + 2, repeats[i + 1] - 1);
                    }
                    else {

                        nr += str.substring(repeats[i] + 2, str.length);
                    }
                }   
            }
            return nr;
        }
        return str;
    }
}
// a = new cmp();   