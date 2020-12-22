//F1 sprite
//https://www.deviantart.com/igorsandman/art/275-365-pixel-art-Formula-1-631669206?ga_submit_new=10%253A1472649493

carObj = function(x, y, s) {
    
    this.x = x;
    this.y = y;
    this.rot = 0;
    this.v_max_f = 15;
    this.v_max_b = this.v_max_f/4;
    this.v = 0;
    this.a_max_f = 0.1;
    this.a_max_b = 0.075;
    this.break = 2;
    this.f = 0.05;
    this.turnSpeed = 3;
    this.size = s;
    this.color = "red";
    this.scaleLength = 1;

    this.carElement = document.createElement("img");
    this.carElement.src = "F1_" + this.color + ".png";
    this.carElement.style.position = "absolute";
    this.carElement.style.left = this.x;
    this.carElement.style.top = this.y;
    this.carElement.style.width = this.size;
    this.carElement.style.height = this.size;
    this.carElement.ondragstart = function() { return false; }
    document.body.appendChild(this.carElement);

    this.turn = function(dir) {

        if (dir == "right") {

            this.rot += this.turnSpeed * Math.abs(this.v/this.v_max_f);
        }
        else if (dir == "left") {

            this.rot -= this.turnSpeed * Math.abs(this.v/this.v_max_f);
        } 
    };

    this.move = function() {

        this.x += Math.cos(this.rot * Math.PI/180) * this.v * this.scaleLength;
        this.y += Math.sin(this.rot * Math.PI/180) * this.v * this.scaleLength;
    }

    this.accelerate = function(dir) {

        if (dir == "forward") {

            this.v += this.a_max_f;
            if (this.v > this.v_max_f) {
                this.v = this.v_max_f;
            }
        }
        else if (dir == "backward") {

            if (this.v > 0) {
                
                this.v -= this.break * this.a_max_f;

            } else {

                this.v -= this.a_max_b;
                if (this.v < -this.v_max_b) {
                    this.v = -this.v_max_b;
                }
            }
        }        
    };

    this.friction = function() {
        
        if (this.v > 0) {

            this.v -= this.f;
            if (this.v < 0) {
                this.v = 0;
            }
        }
        else if (this.v < 0) {

            this.v += this.f;
            if (this.v > 0) {
                this.v = 0;
            }
        }
    };

    this.render = function() {

        this.carElement.style.left = this.x;
        this.carElement.style.top = this.y;
        this.carElement.style.transform = "rotate(" + this.rot + "deg)";
    };

    this.toggleColor = function() {

        if (this.color == "red") {
            this.color = "blue";
        } else {
            this.color = "red";
        }    
        this.carElement.src = "F1_" + this.color + ".png";
    }
}

gameplay = function() {

    if (keyboard.w || keyboard.up) {

        car.accelerate("forward");
    }
    else if (keyboard.s || keyboard.down) {
        
        car.accelerate("backward");
    } else {
        car.friction();
    }
    car.move();

    if (keyboard.d || keyboard.right) {

        car.turn("right");
    }
    else if (keyboard.a || keyboard.left) {

        car.turn("left");
    }

    car.render();
}

toggleCar = function() {

    car.toggleColor();
}

window.onload = function() {

    //createField();
    car = new carObj(50,50,100);
    
}


FPS = 60;
window.setInterval(gameplay,1000/FPS);