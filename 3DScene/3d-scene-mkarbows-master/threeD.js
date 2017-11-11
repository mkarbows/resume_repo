(() => {
    class ThreeD {
        constructor (vertices, color, mode, normal) {
            this.vertices = vertices;
            this.color = color;
            this.mode = mode;
            this.children = [];
            this.normal = normal;

            this.scalingMatrix = new window.Matrix();
            this.translateMatrix = new window.Matrix();
            this.rotationMatrix = new window.Matrix();
            this.transformMatrix = new window.Matrix();
        }
        addChild(child) {
            this.children.push(child);
        }

        scale(specs) {
            let sx = specs.sx || 1.0;
            let sy = specs.sy || 1.0;
            let sz = specs.sz || 1.0;
            let scalingMatrix = window.Matrix.getScaledMatrix(sx, sy, sz);
            this.scalingMatrix = this.scalingMatrix.getMatrixMult(scalingMatrix);
        }

        translate(specs) {
            let tx = specs.tx || 0.0;
            let ty = specs.ty || 0.0;
            let tz = specs.tz || 0.0;
            let translateMatrix = window.Matrix.getTranslatedMatrix(tx, ty, tz);
            this.translateMatrix = this.translateMatrix.getMatrixMult(translateMatrix);
        }

        rotate(specs) {
            let angle = specs.angle || 0.0;
            let x = specs.x || 0.0;
            let y = specs.y || 0.0;
            let z = specs.z || 0.0;
            let rotationMatrix = window.Matrix.getRotationMatrix(angle, x, y, z);
            this.rotationMatrix = this.rotationMatrix.getMatrixMult(rotationMatrix);
        }

        transform() {
            this.transformMatrix = this.translateMatrix.getMatrixMult(this.rotationMatrix).getMatrixMult(this.scalingMatrix);
        }
    }
    window.ThreeD = ThreeD;
})();
