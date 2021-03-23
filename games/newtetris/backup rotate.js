    this.rotate = function (direction, id) {

        transformMatrix = 0;
        validity = true;

        if (direction == "left") {

            transformMatrix = [[0, 1], [-1, 0]];
        }
        else {

            transformMatrix = [[0, -1], [1, 0]];
        }

        rotated = [0, 0, 0];
        for (r = 1; r < 4; r++) {

            rotated[r - 1] = LAmath.matrixMulti(transformMatrix, [[this.ox[r] - this.ox[0]], [this.oy[r] - this.oy[0]]]);

            if (players[id].grid[parseInt(rotated[r - 1][0]) + parseInt(this.ox[0])][parseInt(rotated[r - 1][1]) + parseInt(this.oy[0]) + playHidden] != 0) {

                validity = false;
            }
        }
        //console.log(rotated)

        if (validity) {

            for (r = 1; r < 4; r++) {

                this.ox[r] = parseInt(rotated[r - 1][0]) + parseInt(this.ox[0]);
                this.oy[r] = parseInt(rotated[r - 1][1]) + parseInt(this.oy[0]);
            }

            if (direction == "right") {
                
                this.rotationIndex++; 
                this.rotationIndex %= 4;
            }
            else if (direction == "left") {

                if (this.rotationIndex == 0) { this.rotationIndex = 4; }
                this.rotationIndex--; 
                this.rotationIndex %= 4;
            }
            console.log(this.rotationIndex)
        }
        players[id].render();
    }