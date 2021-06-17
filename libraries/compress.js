

cmp = function() {

    // Radix compress between bases 2^{1,2,3,4,5}
    this.radixConvert = true;
    this.radixToBase = 5; // Integers between 1 and 5 works best (2^5 = 32, radix convert only goes up to base 36)
    this.radixFromBase = 1; // 2^x

    this.repeatShorten = true;

    this.compress = function(str) {

        
    }

    this.uncompress = function(str) {

    }

    this.radixCompress = function(str) {

        loops = str.length/this.radixToBase;
        cmpStr = "";

        for (l = 0; l < loops; l++) {

            subStr = str.substring(l * this.radixToBase, (l + 1) * this.radixToBase);
            cmpSubStr = radix.convert(subStr, Math.pow(2, this.radixFromBase), Math.pow(2, this.radixToBase));
            cmpStr += cmpSubStr;

            // console.log(subStr, cmpSubStr, loops, l);
            console.log(l, loops);
        }


        // return cmpStr;
    }

    this.radixUncompress = function(str) {


    }
}