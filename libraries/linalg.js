linearAlgebra = function() {

    this.sameHeightCheck = function(matrix,widthMatch) {

        sameWidth = true;

        for (l = 1; l < matrix.length; l++) {

            if (widthMatch != matrix[l].length) {
                sameWidth = false;
                console.error("matrix rows have different lengths");
            }
        }

        return sameWidth;
    }

    this.dot = function(v1,v2) {

        if (v1.length == v2.length) {

            dotSum = 0;

            for (i = 0; i < v1.length; i++) {

                dotSum += v1[i] * v2[i];
            }
            return dotSum;
        }
        else {

            console.error("Vectors must be the same length; ",v1.length+" != "+v2.length);
        }
    }

    this.cross = function(v1,v2) {

        crossProduct = [0,0,0];

        if (v1.length == 3 && v2.length == 3) {

            crossProduct[0] = v1[1]*v2[2]-v1[2]*v2[1];
            crossProduct[1] = v1[2]*v2[0]-v1[0]*v2[2];
            crossProduct[2] = v1[0]*v2[1]-v1[1]*v2[0];

            return crossProduct;
        }
        else {

            console.error("Vectors must be in R^3; ",v1.length+" || "+v2.length+" != 3");
        }
    }

    this.transpose = function(m) {

        mHeight = m.length;
        mWidth = m[0].length;
        
        mNew = 0;

        if (this.sameHeightCheck(m,mWidth)) {

            mNew = new Array(mWidth);
            for (c = 0; c < mWidth; c++) {

                mNew[c] = new Array(mHeight);
            }

            for (r = 0; r < mHeight; r++) {

                for (c = 0; c < mWidth; c++) {
                    
                    mNew[c][r] = m[r][c];
                }
            }
            return mNew;
        }
        else {

            return "error";
        }
    }

    this.matrixMulti = function(m1,m2) {

        m1Height = m1.length;
        m2Height = m2.length;

        m1Width = m1[0].length;
        m2Width = m2[0].length;

        m3 = 0;

        if (this.sameHeightCheck(m1,m1Width) && this.sameHeightCheck(m2,m2Width) && m1Width == m2Height) {
            
            m3 = new Array(m1Height);
            
            for (r1 = 0; r1 < m1Height; r1++) {

                m3[r1] = new Array(m2Width);

                for (c2 = 0; c2 < m2Width; c2++) {

                    slotSum = 0;

                    for (p = 0; p < m1Width; p++) {

                        slotSum += m1[r1][p]*m2[p][c2];
                    }    

                    m3[r1][c2] = slotSum;
                }
            }
            return m3;
        }
        else {
           
            if (m1Width != m2Height) {
                
                console.error("Matrix sizes incompatible");
            }
            return "error";
        }
    }

}

LAmath = new linearAlgebra();