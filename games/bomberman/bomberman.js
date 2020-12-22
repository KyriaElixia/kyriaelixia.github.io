
    size = 50;

    width = 6*2+3;
    height = 5*2+3;

    xZero = 0;
    yZero = 0;
    
    players = [];
    powerups = [];

    player1 = 0; // number means which player is controlled by player 1
    press = false;

    gameGrid = new Array(width);
    for (g = 0; g < width; g++) {
        gameGrid[g] = new Array(height);

        for (gg = 0; gg < height; gg++) {

            gameGrid[g][gg] = 0;
        }
    }
    
    function start() {
 
        // 16:9 scaling
        if (totalWidth/totalHeight != 16/9) {
            
            //if (totalWidth < 16*(totalHeight/9)) {

                totalHeight = 9*(totalWidth/16);
                size = totalHeight/(height+2);
            //}
            /*
            else {

                totalWidth = 16*(totalHeight/9);
                size = totalWidth/(width);
            } 
            */                     
        }
        
        xZero = (totalWidth-(width)*size)/2;
        yZero = (totalHeight-(height)*size)/2;
        
        loadLevel(1);
        
        players.push(new player(players.length+1,players.length));
        players.push(new player(players.length+1,players.length));
        players.push(new player(players.length+1,players.length));
        players.push(new player(players.length+1,players.length));
    }

    function update() {

        inputs();
        render();

        for (p = 0; p < powerups.length; p++) {

            powerups[p].renderPowerup();
        }
        
        for (p = 0; p < players.length; p++) {
            for(b = 0; b < players[p].bombs.length; b++) {
                
                tempLenght = players[p].bombs.length;

                players[p].bombs[b].countdown(b);

                if (tempLenght > players[p].bombs.length) {

                    b -= tempLenght - players[p].bombs.length;
                }
           }
           players[p].updatePlayer();
        }
    }

    render = function() {

        clearScreen();
        //rectangle(0,0,totalWidth,totalHeight,"lightgray");

        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {

                if (gameGrid[x][y] == 0 || gameGrid[x][y] == 2 || gameGrid[x][y] == "b") {
                    
                    picture(xZero+x*size,yZero+y*size,"http://elixia.spelar.se/games/minesweeper/sprites/tiles/open-tile.png",size,size);

                    if (gameGrid[x][y] == 2) {
                        
                        picture(xZero+x*size,yZero+y*size,"sprites/barrel.png",size,size);
                    }
                }
                else if (gameGrid[x][y] == 1) {
                    
                    picture(xZero+x*size,yZero+y*size,"http://elixia.spelar.se/games/minesweeper/sprites/tiles/tile.png",size,size);
                }                
                else {
                    
                }
            }
        }
    }

    player = function(corner,id) {

        this.x = 1;
        this.y = 1;
        this.xOffset = 0;
        this.yOffset = 0;
        this.speed = 0.1;

        this.id = id;                

        this.bombs = [];
        this.bombPress = false;
    
        this.bombAmount = 3;
        this.bombRange = 2;

        this.lives = 3;
        this.respawning = false;
        this.respawnTimer = 0;

        
        this.color1 = 0;
        this.color2 = 0;
        this.facing = 0;
        
        if (corner == 1) {
            
            this.color1 = "red";
            this.color2 = "red";
            this.facing = "right";
        }
        else if (corner == 2) {

            this.x = width-2;              
            this.color1 = "green";        
            this.color2 = "limegreen";
            this.facing = "left";  
        }
        else if (corner == 3) {

            this.x = width-2;
            this.y = height-2;            
            this.color1 = "blue";
            this.color2 = "dodgerblue";
            this.facing = "left";
        }
        else if (corner == 4) {
            
            this.y = height-2;            
            this.color1 = "purple";
            this.color2 = "blueviolet";
            this.facing = "right";
        }

        this.xCoord = this.x;
        this.yCoord = this.y;

        this.updatePlayer = function(gx,gy) {
    
            if (this.respawnTimer % 2 == 0 && this.lives != 0) {
                
                //circle(xZero+this.x*size+size/2, yZero+this.y*size+size/2, size/3, this.color2);                
                picture(xZero+this.x*size,yZero+this.y*size,"sprites/"+this.color1+"_"+this.facing+".png",size,size)
            }
            
            if (this.respawnTimer >= 0) {

                if (this.respawnTimer == 0) {
                    
                    this.respawning = false;
                }
                else {
                    
                    this.respawnTimer--;
                }
            }

            for (a = 0; a < powerups.length; a++) {

                if (Math.round(this.x) == powerups[a].x && Math.round(this.y) == powerups[a].y) {

                    this.updateStats(powerups[a].power);

                    powerups.splice(a,1);
                }
            }
        };
        
        this.placeBomb = function() {

            if (this.bombAmount > 0 && gameGrid[Math.round(this.x)][Math.round(this.y)] == 0 && this.bombPress == false && this.lives != 0) {
                
                gameGrid[Math.round(this.x)][Math.round(this.y)] = "b";
                
                this.bombs.push(new bomb(Math.round(this.x),Math.round(this.y),this.id,3,1,this.bombRange));               
                this.bombAmount--;               
            }
            this.bombPress = true;
        };

        this.inputMove = function(dir) {

            if (this.lives != 0) {
                switch(dir) {

                    case "up":

                        if ((gameGrid[this.xCoord][this.yCoord - 1] == 0 || this.yOffset != 0) && this.xOffset % (1/this.speed) == 0) {

                            this.movePlayer("y",-this.speed);
                        }
                    break;

                    case "down":
                        
                        if ((gameGrid[this.xCoord][this.yCoord + 1] == 0 || this.yOffset != 0) && this.xOffset % (1/this.speed) == 0) {

                            this.movePlayer("y",this.speed);
                        }
                    break;

                    case "left":

                        if ((gameGrid[this.xCoord - 1][this.yCoord] == 0 || this.xOffset != 0) && this.yOffset % (1/this.speed) == 0) {

                            this.movePlayer("x",-this.speed);
                        }
                        this.facing = dir;
                    break;

                    case "right":
                        
                        if ((gameGrid[this.xCoord + 1][this.yCoord] == 0  || this.xOffset != 0) && this.yOffset % (1/this.speed) == 0) {

                            this.movePlayer("x",this.speed);
                        }
                        this.facing = dir;
                    break;                
                }
            }
        };

        this.movePlayer = function(dim,speed) {

            if (dim == "x") {

                this.x += speed;
                this.xOffset += 10*(speed);
                this.xOffset %= 10;

                if (this.xOffset == 0) {

                    this.xCoord = Math.round(this.x);
                }               
            }
            else if (dim == "y") {

                this.y += (speed);                
                this.yOffset += 10*(speed);
                this.yOffset %= 10;  

                if (this.yOffset == 0) {

                    this.yCoord = Math.round(this.y);
                }                       
            }
        };

        this.hit = function() {

            if (this.respawning == false && this.lives != 0) {
                
                this.lives--;                
                
                this.respawnTimer = 2*updatesPerSecond;
                this.respawning = true;            
            }
        };

        this.updateStats = function(power) {

            if (power == "range") {
                
                this.bombRange++;
            }            
            else if (power == "speed") {

                if (this.speed == 10) {
                    this.speed = 2*10/3;
                }
                else if (this.speed == 5) {
                    this.speed = 4;
                }
                else if (this.speed == 4) {
                    this.speed = 2;
                }
            }
        };
    }

    bomb = function(bx,by,id,timer,fallout,range) {
        
        this.x = bx;
        this.y = by;
        this.id = id;
        this.timer = timer*updatesPerSecond;
        this.fallout = fallout*updatesPerSecond;
        this.range = range+1;
        this.xExplosion = [];
        this.yExplosion = [];
        
        this.countdown = function(bombIndex) {

            this.timer--;
            
            if (this.timer <= 0) {

                if (this.timer == 0) {

                    this.explode();                   
                }
            
                this.bombRender();                                
            }

            if (this.timer == -1*this.fallout) {

                this.exploded();
            }  

            if (this.timer > 0) {

                circle(xZero+this.x*size+size/2,yZero+this.y*size+size/2,size/6,"black")
            }          
        };

        this.bombRender = function() {

            for (rl = 0; rl < this.yExplosion.length; rl++) {
                
                rectangle(xZero+this.xExplosion[rl]*size,yZero+this.yExplosion[rl]*size,size,size,players[this.id].color2);

                for (a = 0; a < players.length; a++) {

                    if (this.xExplosion[rl] == Math.round(players[a].x) && this.yExplosion[rl] == Math.round(players[a].y)) {

                        
                        players[a].hit();
                    }                    
                }
            }          
        };

        this.explode = function() {                        

            this.xExplosion.push(this.x);
            this.yExplosion.push(this.y);

            for (d = this.x; d < this.x+this.range; d++) {
                
                if (d < width) {
                    if (gameGrid[d][this.y] != 1) {

                        this.xExplosion.push(d);
                        this.yExplosion.push(this.y);

                        if (gameGrid[d][this.y] == 2) {

                            gameGrid[d][this.y] = 0;
                            this.createPowerup(d,this.y);                            
                            d = this.x+this.range;
                        }
                    }
                    else {

                        d = this.x+this.range;                
                    }
                }
            }
            for (d = this.x; d > this.x-this.range; d--) {
                
                if (d > 0) {
                    if (gameGrid[d][this.y] != 1) {

                        this.xExplosion.push(d);
                        this.yExplosion.push(this.y);

                        if (gameGrid[d][this.y] == 2) {

                            gameGrid[d][this.y] = 0;                            
                            this.createPowerup(d,this.y);  
                            d = this.x-this.range;  
                        }
                    }
                    else {

                        d = this.x-this.range;                
                    }
                }
            }
            for (d = this.y; d < this.y+this.range; d++) {
                
                if (d < height) {
                    if (gameGrid[this.x][d] != 1) {
                        
                        this.xExplosion.push(this.x);
                        this.yExplosion.push(d);

                        if (gameGrid[this.x][d] == 2) {

                            gameGrid[this.x][d] = 0;                            
                            this.createPowerup(this.x,d);
                            d = this.y+this.range; 
                        }
                    }
                    else {
                        d = this.y+this.range;                
                    }
                }
            }
            for (d = this.y; d > this.y-this.range; d--) {
                
                if (d > 0) {
                    if (gameGrid[this.x][d] != 1) {
                        
                        this.xExplosion.push(this.x);
                        this.yExplosion.push(d);

                        if (gameGrid[this.x][d] == 2) {
                            
                            gameGrid[this.x][d] = 0;
                            this.createPowerup(this.x,d);
                            d = this.y-this.range;
                             
                        }
                    }
                    else {
                        d = this.y-this.range;                
                    }
                }
            }
        };

        this.exploded = function(bombIndex) {            

            gameGrid[this.x][this.y] = 0;
            players[this.id].bombs.splice(bombIndex,1);
            players[this.id].bombAmount++;
        };

        this.createPowerup = function(cx,cy) {

            // chance = Math.floor(Math.random()*2);
            
            if (Math.floor(Math.random()*3) == 1) {

                powerups.push(new powerup(cx,cy));
                console.log("new")
            }
        };
    }

    powerup = function(px,py) {

        this.x = px;
        this.y = py;

        this.picks = ["range","range","range","speed","kick"];

        this.power = this.picks[Math.floor(Math.random()*this.picks.length)];
        
        this.renderPowerup = function() {

            // rectangle(xZero+this.x*size,yZero+this.y*size,size,size,"lightblue");
            // text(xZero+this.x*size,yZero+(this.y+1)*size,size,"X","black");
            picture(xZero+this.x*size,yZero+this.y*size,"sprites/"+this.power+".png",size,size);
        };
            
    }

    inputs = function() {

        if (keyboard.p) {

            if (press == false) {

                player1++;
                player1 %= players.length;
            }
            press = true;
        }
        else {
            press = false;
        }
        
        if (keyboard.w) {

            players[player1].inputMove("up");
        }
        if (keyboard.s) {

            players[player1].inputMove("down");
        }
        if (keyboard.a) {
        
            players[player1].inputMove("left");
        }
        if (keyboard.d) {
           
            players[player1].inputMove("right");
        }

        if (keyboard.space) {

            players[player1].placeBomb();
        }
        else {

            players[player1].bombPress = false;
        }        
    }

    loadLevel = function(level) {

        gameGrid = new Array(width);
        for (g = 0; g < width; g++) {
            
            gameGrid[g] = new Array(height);
            
            for (gg = 0; gg < height; gg++) {

                gameGrid[g][gg] = 0;
            }
        }
        for (t = 0; t < 2; t++) {
            for (ly = 0; ly < height; ly++) {

                gameGrid[t * (width - 1)][ly] = 1;
            }
            for (lx = 0; lx < width; lx++) {

                gameGrid[lx][t * (height - 1)] = 1;
            }
        }

        if (level == 1) {

            for (ly = 2; ly < height; ly += 2) {
                for (lx = 2; lx < width; lx += 2) {

                    gameGrid[lx][ly] = 1;
                }
            }
            for (ly = 1; ly < height-1; ly++) {            
                for (lx = 3; lx < 12; lx ++) {

                    if (gameGrid[lx][ly] == 0) {

                        gameGrid[lx][ly] = 2;
                    }
                }
            }
            for (lx = 1; lx < width-1; lx++) {            
                for (ly = 3; ly < 10; ly ++) {

                    if (gameGrid[lx][ly] == 0) {

                        gameGrid[lx][ly] = 2;
                    }
                }
            }
        }
    }