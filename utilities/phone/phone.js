
random_number = function(nmbr_length) {

    RNGnmbr = "";

    for (n = 0; n < 10; n++) {

        r = Math.floor(Math.random()*nmbr_length);
        RNGnmbr += r;
    }
    return RNGnmbr;
}

format_type = "USA";
format_number = function(unformated) {        

    if (format_type == "swedish") {
        formatting = unformated.slice(0,3) + "-" + unformated.slice(3,6) + " " + unformated.slice(6,8) + " " + unformated.slice(8,10);
    } 
    else if (format_type == "USA") {

        formatting = "(" + unformated.slice(0,3) + ") " + unformated.slice(3,6) + "-" + unformated.slice(6,10);

    } else {
        formatting = unformated;
    }
    
    return formatting;
}

method1 = function() {    

    this.name = "method1";
    this.number = "";

    this.no = function() {

        this.number = random_number(10);        

        document.getElementById("number1").innerHTML = this.number;
    }

    this.yes = function() {

        document.getElementById(this.name).style.display = "none";
        document.getElementById("mainNumber").style.display = "";
        document.getElementById("selectedNumber").innerHTML = format_number(this.number);
    }

    this.no();
    document.getElementById(this.name).style.display = "";
}

method2 = function() {

    this.name = "method2";
    this.number = random_number(10);
    this.numbers = [];
    for (n = 0; n < this.number.length; n++) {

        this.numbers.push(parseInt(this.number[n]));
    }
    
    this.add = function() {
        
        for (n = this.numbers.length-1; n >= 0; n--) {

            this.numbers[n]++;

            if (this.numbers[n] < 10) {

                break;
            } else {
                
                this.numbers[n] = 0;
            }
        }
        
        this.number = "";
        for (n = 0; n < this.numbers.length; n++) {

            this.number += this.numbers[n];
        }
        
        this.formatted = format_number(this.number);
        document.getElementById("number2").innerHTML = this.formatted
    }

    this.submit = function() {
        
        document.getElementById(this.name).style.display = "none";
        document.getElementById("mainNumber").style.display = "";
        document.getElementById("selectedNumber").innerHTML = format_number(this.number);
    }    

    this.reset = function() {

        this.number = "";
        this.numbers = [];

        for (n = 0; n < 10; n++) {
                
            this.number += "0";
            this.numbers.push(0);
        }        
        this.formatted = format_number(this.number);
        document.getElementById("number2").innerHTML = this.formatted
    }

    this.formatted = format_number(this.number);

    document.getElementById(this.name).style.display = "";
    document.getElementById("number2").innerHTML = this.formatted
}

method3 = function() {

    this.name = "method3";
    this.numbers= [];

    for (n = 0; n < 10; n++) {
        for (m = 0; m < 3; m++) {

            numberHolder = document.createElement("td");

            if (m == 0) {

                table = document.createElement("table");
                table.border = "0";
                table.cellSpacing = "0";                

                numberHolder.appendChild(table);
                for (y = 0; y < 7; y++) {

                    row = document.createElement("tr");
                    table.appendChild(row);

                    for (x = 0; x < 4; x++) {

                        data = document.createElement("td");
                        data.style.padding = "0";                                              
                        row.appendChild(data);

                        checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.id = "cb3_" + n + "_" + x + "_" + y;
                        checkbox.style.transform = "scale(1.2)";
                        data.appendChild(checkbox);
                    }
                }
            } else {

                numberHolder.rowspan = 7;
            }

            if (n != 10) {

                document.getElementById("draw").appendChild(numberHolder);
            }
        }
    }

    this.numberCheck = [
    [[0, 0, 1, 0],[0, 1, 1, 0],[0, 0, 1, 0],[0, 0, 1, 0],[0, 0, 1, 0],[0, 0, 1, 0],[0, 0, 1, 0]],    
    [[0, 1, 1, 0],[1, 0, 0, 1],[1, 0, 0, 1],[0, 0, 1, 0],[0, 1, 0, 0],[1, 0, 0, 0],[1, 1, 1, 1]],
    [[0, 1, 1, 0],[1, 0, 0, 1],[0, 0, 0, 1],[0, 1, 1, 0],[0, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0]],
    [[1, 0, 0, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 1, 1, 1],[0, 0, 1, 0],[0, 0, 1, 0],[0, 0, 1, 0]],
    [[1, 1, 1, 1],[1, 0, 0, 0],[1, 0, 0, 0],[1, 1, 1, 0],[0, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0]],
    [[0, 1, 1, 0],[1, 0, 0, 1],[1, 0, 0, 0],[1, 1, 1, 0],[1, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0]],
    [[1, 1, 1, 1],[1, 0, 0, 1],[0, 0, 0, 1],[0, 0, 1, 0],[0, 0, 1, 0],[0, 1, 0, 0],[0, 1, 0, 0]],
    [[0, 1, 1, 0],[1, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0],[1, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0]],
    [[0, 1, 1, 0],[1, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 1],[0, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0]],
    [[0, 1, 1, 0],[1, 0, 0, 1],[1, 0, 0, 1],[1, 0, 0, 1],[1, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0]]
    ];

    for (n = 0; n < 10; n++) {

        for (m = 0; m < 2; m++) {
            
            row = document.createElement("tr");
            document.getElementById("sidebar").appendChild(row);

            data = document.createElement("td");
            row.appendChild(data);

            if (m == 0) {

                table = document.createElement("table");
                data.appendChild(table);

                for (y = 0; y < 7; y++) {

                    tr = document.createElement("tr");
                    table.appendChild(tr);

                    for (x = 0; x < 4; x++) {
                        
                        td = document.createElement("td");
                        tr.appendChild(td);
                        showWidth = 11;
                        if (this.numberCheck[n][y][x] == 1) {
                            
                            td.style.backgroundColor = "white";
                            td.style.width = showWidth;
                            td.style.height = showWidth;
                        } else {
                            
                            td.style.backgroundColor = "gray";
                            td.style.width = showWidth;
                            td.style.height = showWidth;
                        }
                    }
                }   
            } else {

                data.colspan = 4;
                data.style.height = "15px"
            }
        }
    }

    this.click = function() {
        
        for (n = 0; n < 10; n++) {

            for (m = 0; m < 10; m++) {
                
                valid = true;                
                for (y = 0; y < 7; y++) {
                    for (x = 0; x < 4; x++) {    
                        if (this.numberCheck[m][y][x] != document.getElementById("cb3_" + n + "_" + x + "_" + y).checked) {
                            valid = false;
                        }
                    }
                }
                if (valid) {                    
                    if (m+1 < 10) {
                        this.numbers[n] = (m+1);
                    } else {
                        this.numbers[n] = 0;
                    }
                    break;
                } else {
                    this.numbers[n] = "_";
                }
            }
        }

        this.number = "";
        for (n = 0; n < 10; n++) {

            this.number += this.numbers[n];
        }

        document.getElementById("number3").innerHTML = format_number(this.number);
    }

    this.click();
    document.getElementById(this.name).style.display = "";
}

method4 = function() {

    
    this.name = "method4";
    this.numbers = [];
    this.FPS = 10;
    this.position = 0;
    this.currentNumber = 0;
    this.start = false;

    this.update = function() {
/*
        if (first) {
            this.currentNumber = 0;
            this.position = 0;
            first = false;
        }
        */
        this.currentNumber++;
        this.currentNumber %= 10;
        console.log("ra")
        document.getElementById("box4_"+this.position).value = this.currentNumber;
    }

    this.restart = function() {
        
        this.position = 0;
        this.currentNumber = 0;
        for (n = 0; n < 10; n++) {
            document.getElementById("box4_"+n).value = "";
        }

        if (this.start) {
            stopClock();
        }
        startClock(toClock,method.FPS);
        this.start = true;
    }

    this.set = function() {

        this.position++;
        this.currentNumber = 0;
        if (this.position > 9) {

            stopClock();
        }
        
    }
          
    document.getElementById(this.name).style.display = "";
}

methodN = function() {

    this.name = "methodN";


    document.getElementById(this.name).style.display = "";
}

methods = [method1, method2, method3, method4];

random_method = Math.floor(Math.random()*methods.length);

startClock = function(func,inFPS) {

    clock = setInterval(toClock,1000/inFPS);
}
stopClock = function() {

    clearInterval(clock);
}

toClock = function() {

    method.update();
}


window.onload = function() {

    method = new methods[random_method];
    if (random_method == 3) {
        method.restart();
    }
}