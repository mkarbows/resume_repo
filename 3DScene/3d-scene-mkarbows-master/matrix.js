// let Vector = window.Vector;

window.Matrix = (function () {

    let matrixDefault = function (elements) {
        this.elements = elements ||
            [
                [
                    1,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    1,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    1,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    1
                ]
            ];
    };

    matrixDefault.getTranslatedMatrix = function(tx, ty, tz) {
        tx = tx || 0;
        ty = ty || 0;
        tz = tz || 0;

        return new matrixDefault([
            [
                1,
                0,
                0,
                tx
            ],
            [
                0,
                1,
                0,
                ty
            ],
            [
                0,
                0,
                1,
                tz
            ],
            [
                0,
                0,
                0,
                1
            ]
        ]);
    };

    matrixDefault.getScaledMatrix = function(sx, sy, sz) {
        sx = sx || 1;
        sy = sy || 1;
        sz = sz || 1;

        return new matrixDefault([
            [
                sx,
                0,
                0,
                0
            ],
            [
                0,
                sy,
                0,
                0
            ],
            [
                0,
                0,
                sz,
                0
            ],
            [
                0,
                0,
                0,
                1
            ]
        ]);
    };

    matrixDefault.getRotationMatrix = function(angle, x, y, z) {
        // In production code, this function should be associated
        // with a matrix object with associated functions.
        let axisLength = Math.sqrt(x * x + y * y + z * z);
        let s = Math.sin(angle * Math.PI / 180.0);
        let c = Math.cos(angle * Math.PI / 180.0);
        let oneMinusC = 1.0 - c;

        // Normalize the axis vector of rotation.
        x /= axisLength;
        y /= axisLength;
        z /= axisLength;

        // Now we can calculate the other terms.
        // "2" for "squared."
        let x2 = x * x;
        let y2 = y * y;
        let z2 = z * z;
        let xy = x * y;
        let yz = y * z;
        let xz = x * z;
        let xs = x * s;
        let ys = y * s;
        let zs = z * s;

        // GL expects its matrices in column major order.
        return new matrixDefault([
            [
                x2 * oneMinusC + c,
                xy * oneMinusC + zs,
                xz * oneMinusC - ys,
                0.0
            ],
            [
                xy * oneMinusC - zs,
                y2 * oneMinusC + c,
                yz * oneMinusC + xs,
                0.0
            ],
            [
                xz * oneMinusC + ys,
                yz * oneMinusC - xs,
                z2 * oneMinusC + c,
                0.0
            ],
            [
                0.0,
                0.0,
                0.0,
                1.0
            ]
        ]);
    };

    /*
     * This is another function that really should reside in a
     * separate library.  But, because the creation of that library
     * is part of the student course work, we leave it here for
     * later refactoring and adaptation by students.
     */
    matrixDefault.getOrthoMatrix = function(left, right, bottom, top, zNear, zFar) {
        let width = right - left;
        let height = top - bottom;
        let depth = zFar - zNear;

        return new matrixDefault([
            [
                2.0 / width,
                0.0,
                0.0,
                -(right + left) / width
            ],
            [
                0.0,
                2.0 / height,
                0.0,
                -(top + bottom) / height
            ],
            [
                0.0,
                0.0,
                -2.0 / depth,
                -(zFar + zNear) / depth
            ],
            [
                0.0,
                0.0,
                0.0,
                1.0
            ]
        ]);
    };

    matrixDefault.getPersectiveMatrix = function(left, right, bottom, top, zNear, zFar) {
        let width = right - left;
        let height = top - bottom;
        let depth = zFar - zNear;

        return new matrixDefault([
            [
                2.0 * zNear / width,
                0.0,
                (right + left) / (right - left),
                0.0
            ],
            [
                0.0,
                2.0 * zNear / height,
                (top + bottom) / height,
                0.0
            ],
            [
                0.0,
                0.0,
                -(zFar + zNear) / depth,
                -(2.0 * zNear * zFar) / depth
            ],
            [
                0.0,
                0.0,
                -1.0,
                0.0
            ]
        ]);
    };

    matrixDefault.getCameraMatrix = function(px, py, pz, qx, qy, qz, ux, uy, uz) {
        let projectionCenter = new Vector(px, py, pz);
        let eyePoint = new Vector(qx, qy, qz);
        let upVector = new Vector(ux, uy, uz);
        let zResult = projectionCenter.subtract(eyePoint).unit;
        let yResult = upVector.subtract(upVector.projection(zResult));
        let xResult = yResult.cross(zResult);

        return new matrixDefault(
            [
                [
                    xResult.x,
                    xResult.y,
                    xResult.z,
                    -projectionCenter.dot(xResult)
                ],
                [
                    yResult.x,
                    yResult.y,
                    yResult.z,
                    -projectionCenter.dot(yResult)
                ],
                [
                    zResult.x,
                    zResult.y,
                    zResult.z,
                    -projectionCenter.dot(zResult)
                ],
                [
                    0.0,
                    0.0,
                    0.0,
                    1.0
                ]
            ]
        );
    };

    matrixDefault.prototype.getMatrixMult = function(matrix) {
        let result = new matrixDefault();

        for (let i = 0; i < this.elements.length; i++) {
            let m = this.elements[i];
            for (let j = 0; j < m.length; j++) {
                let sum = 0;
                for (let k = 0; k < this.elements.length; k++) {
                    sum += matrix.elements[k][j] * this.elements[i][k];
                }
                result.elements[i][j] = sum;
            }
        }
        return result;
    };

    matrixDefault.prototype.convertToWebGl = function () {
        let result = [];
        for (let i = 0; i < this.elements.length; i++) {
            for (let j = 0; j < this.elements.length; j++) {
                result.push(this.elements[j][i]);
            }
        }
        return result;
    };

    return matrixDefault;
})();
