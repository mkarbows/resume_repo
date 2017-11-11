describe("Matrix Library", () => {

    let Matrix = window.Matrix;
    it("should create the identity matrix", () => {
        let matrix = new Matrix();
        expect(matrix.elements).toEqual(
            [
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should be able to multiply two matrices together", () => {
        let matrix1 = new Matrix(
            [
                [ 9, 8, 7, 6 ],
                [ 5, 4, 3, 2 ],
                [ 9, 8, 7, 6 ],
                [ 5, 4, 3, 2 ]
            ]
        );
        let matrix2 = new Matrix(
            [
                [ 1, 2, 3, 4 ],
                [ 5, 6, 7, 8 ],
                [ 1, 2, 3, 4 ],
                [ 5, 6, 7, 8 ]
            ]
        );
        let answer = matrix1.getMatrixMult(matrix2);
        expect(answer.elements).toEqual(
            [
                [ 86, 116, 146, 176 ],
                [ 38, 52, 66, 80 ],
                [ 86, 116, 146, 176 ],
                [ 38, 52, 66, 80 ]
            ]
        );
    });

    it("should create the translation matrix", () => {
        let matrix = Matrix.getTranslatedMatrix(2, 4, 6);
        expect(matrix.elements).toEqual(
            [
                [ 1, 0, 0, 2 ],
                [ 0, 1, 0, 4 ],
                [ 0, 0, 1, 6 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should create the translation matrix", () => {
        let matrix = Matrix.getTranslatedMatrix(2);
        expect(matrix.elements).toEqual(
            [
                [ 1, 0, 0, 2 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should create the translation matrix", () => {
        let matrix = Matrix.getTranslatedMatrix(4, 6);
        expect(matrix.elements).toEqual(
            [
                [ 1, 0, 0, 4 ],
                [ 0, 1, 0, 6 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should return the identity matrix if no argument is provided", () => {
        let matrix = Matrix.getTranslatedMatrix();
        expect(matrix.elements).toEqual(
            [
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should create the scaled matrix", () => {
        let matrix = Matrix.getScaledMatrix(2, 4, 6);
        expect(matrix.elements).toEqual(
            [
                [ 2, 0, 0, 0 ],
                [ 0, 4, 0, 0 ],
                [ 0, 0, 6, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should create the scaled matrix", () => {
        let matrix = Matrix.getScaledMatrix(4);
        expect(matrix.elements).toEqual(
            [
                [ 4, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should create the scaled matrix", () => {
        let matrix = Matrix.getScaledMatrix(2, 6);
        expect(matrix.elements).toEqual(
            [
                [ 2, 0, 0, 0 ],
                [ 0, 6, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should return the identity matrix if no argument is provided", () => {
        let matrix = Matrix.getScaledMatrix();
        expect(matrix.elements).toEqual(
            [
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should create the ortho matrix", () => {
        let matrix = Matrix.getOrthoMatrix(1, 2, 3, 4, 5, 6);
        let width = 1;
        let height = 1;
        let depth = 1;
        expect(matrix.elements).toEqual(
            [
                [ 2.0 / width, 0.0, 0.0, -3.0 / width ],
                [ 0.0, 2.0 / height, 0.0, -7.0 / height ],
                [ 0.0, 0.0, -2.0 / depth, -11.0 / depth ],
                [ 0.0, 0.0, 0.0, 1.0 ]
            ]
        );
    });

    it("should create the perspective matrix", () => {
        let matrix = Matrix.getPersectiveMatrix(1, 2, 3, 4, 5, 6);
        let width = 1;
        let height = 1;
        let depth = 1;
        expect(matrix.elements).toEqual(
            [
                [ 10.0 / width, 0.0, 3.0, 0.0 ],
                [ 0.0, 10.0 / height, 7.0 / height, 0.0 ],
                [ 0.0, 0.0, -11.0 / depth, -60.0 / depth ],
                [ 0.0, 0.0, -1.0, 0.0 ]
            ]
        );
    });

    it("should create the rotation matrix when x = 1", () => {
        let matrix = Matrix.getRotationMatrix(0, 1, 0, 0);
        expect(matrix.elements).toEqual(
            [
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should create the rotation matrix when y = 1", () => {
        let matrix = Matrix.getRotationMatrix(0, 0, 1, 0);
        expect(matrix.elements).toEqual(
            [
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

    it("should create the rotation matrix when x = 1", () => {
        let matrix = Matrix.getRotationMatrix(0, 0, 0, 1);
        expect(matrix.elements).toEqual(
            [
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0, 0, 0, 1 ]
            ]
        );
    });

});
