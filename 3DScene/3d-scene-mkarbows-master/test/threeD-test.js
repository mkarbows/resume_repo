// threeD-test
describe("ThreeD object implementation", () => {
    fixture.setBase("test");
    fixture.load("fixture.html");

    // let canvas = document.getElementById("3dObject");
    let canvas = document.getElementById("hello-webgl");

    let ThreeD = window.ThreeD;
    let Mesh = window.Mesh;
    let GLSLUtilities = window.GLSLUtilities;

    describe("the triPyramid", () => {
        let triPyramid = new Mesh.triPyramid();
        let triPyramidVertices = triPyramid.toRawLineArray();
        let tripyramidColor = { r: 0.1, g: 0.4, b: 0.2 };
        let triPyramidMode = GLSLUtilities.getGL(canvas).LINES;
        let triPyramidObject = new ThreeD(triPyramidVertices, tripyramidColor, triPyramidMode);

        it("should create a pyramid correctly", () => {
            expect(triPyramidObject).toEqual(
                new ThreeD(
                    triPyramid.toRawLineArray(), {r: 0.1, g: 0.4, b: 0.2 }, GLSLUtilities.getGL(canvas).LINES
                )
            );
            let X = 0.4;
            let Y = 0.2;

            expect(triPyramid.vertices).toEqual([
                [ X, -Y, 0.0 ], // 0
                [ 0.0, -Y, -X ], // 1
                [ -X, -Y, 0.0 ], // 2
                [ 0.0, Y, -Y ] // 3
            ]);

            expect(triPyramid.indices).toEqual([
                [ 0, 1, 2 ],
                [ 0, 1, 3 ],
                [ 0, 3, 2 ],
                [ 2, 1, 3 ]
            ]);
        });
    });

    describe("the cube", () => {
        let cube = new Mesh.cube();
        let cubeVertices = cube.toRawLineArray();
        let cubeColor = { r: 0.0, g: 0.6, b: 0.4 };
        let cubeMode = GLSLUtilities.getGL(canvas).LINES;
        let cubeObject = new ThreeD(cubeVertices, cubeColor, cubeMode);

        it("should create a cube correctly", () => {
            expect(cubeObject).toEqual(
                new ThreeD(
                    cube.toRawLineArray(), {r: 0.0, g: 0.6, b: 0.4 }, GLSLUtilities.getGL(canvas).LINES
                )
            );
            let X = 0.2;
            let Y = 0.2;
            let Z = 0.2;

            expect(cube.vertices).toEqual([
                [ X, Y, Z ], // 0
                [ X, Y, -Z ], // 1
                [ -X, Y, Z ], // 2
                [ -X, Y, -Z ], // 3
                [ X, -Y, Z ], // 4
                [ X, -Y, -Z ], // 5
                [ -X, -Y, Z ], // 6
                [ -X, -Y, -Z ]// 7
            ]);

            expect(cube.indices).toEqual([
                [ 3, 7, 5 ],
                [ 5, 1, 3 ],
                [ 3, 1, 2 ],
                [ 2, 1, 0 ],
                [ 3, 7, 6 ],
                [ 6, 2, 3 ],
                [ 2, 6, 4 ],
                [ 4, 0, 2 ],
                [ 0, 1, 4 ],
                [ 4, 1, 5 ],
                [ 6, 7, 5 ],
                [ 5, 4, 6 ]
            ]);
        });
    });

    describe("making an object", () => {
        let triPyramid = new Mesh.triPyramid();
        let triPyramidVertices = triPyramid.toRawLineArray();
        let tripyramidColor = { r: 0.5, g: 0.5, b: 0.5 };

        it("should create a 3D Object correctly", () => {
            expect(triPyramidVertices.length).toBe(72);
            expect(tripyramidColor.g).toBe(0.1);
        });
    });

    describe("inheritance", () => {
        let triPyramid = new Mesh.triPyramid();
        let triPyramidVertices = triPyramid.toRawLineArray();
        let tripyramidColor = { r: 0.5, g: 0.5, b: 0.5 };
        let triPyramidMode = GLSLUtilities.getGL(canvas).LINES;
        let triPyramidObject = new ThreeD(triPyramidVertices, tripyramidColor, triPyramidMode);

        triPyramidObject.translate({tx: -0.1, ty: 0.1, tz: 0.1 });
        triPyramidObject.scale({sx: 1.5, sy: 1.5, sz: 1.5 });
        triPyramidObject.rotate({angle: 1, x: 0.5, y: 0.5, z: 1.0 });

        let sphereMesh = new Mesh.sphere();
        let sphereVertices = sphereMesh.toRawLineArray();
        let sphereMode = GLSLUtilities.getGL(canvas).LINES;
        let sphereColor = {r: 0.2, g: 0.2, b: 0.8};
        let sphereObject = new ThreeD(sphereVertices, sphereColor, sphereMode);

        sphereObject.addChild(triPyramidObject);

        it("should know it's child", () => {
            expect(sphereObject.children[0]).toBe(triPyramidObject);
        });
    });
});
