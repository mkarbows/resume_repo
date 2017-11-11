/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */

 /* global Vector */
(() => {
    // let Vector = window.Vector;

    class Mesh {
        constructor (choices = {vertices: [], indices: []}) {
            this.vertices = choices.vertices;
            this.indices = choices.indices;
        }

        toRawLineArray() {
            let result = [];

            for (let i = 0, maxi = this.indices.length; i < maxi; i += 1) {
                for (let j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                    result = result.concat(
                        this.vertices[
                            this.indices[i][j]
                        ],
                        this.vertices[
                            this.indices[i][(j + 1) % maxj]
                        ]
                    );
                }
            }
            return result;
        }

        toRawTriangleArray() {
            let result = [];

            for (let i = 0, maxi = this.indices.length; i < maxi; i += 1) {
                for (let j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                    result = result.concat(
                        this.vertices[
                            this.indices[i][j]
                        ]
                    );
                }
            }
            return result;
        }

        toNormalArray() {
            let result = [];

            // For each face...
            for (let i = 0, maxi = this.indices.length; i < maxi; i += 1) {
                // We form vectors from the first and second then second and third vertices.
                let p0 = this.vertices[this.indices[i][0]];
                let p1 = this.vertices[this.indices[i][1]];
                let p2 = this.vertices[this.indices[i][2]];

                // Technically, the first value is not a vector, but v can stand for vertex
                // anyway, so...
                let v0 = new Vector(p0[0], p0[1], p0[2]);
                let v1 = new Vector(p1[0], p1[1], p1[2]).subtract(v0);
                let v2 = new Vector(p2[0], p2[1], p2[2]).subtract(v0);
                let normal = v1.cross(v2).unit;

                // We then use this same normal for every vertex in this face.
                for (let j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                    result = result.concat(
                        [ normal.x, normal.y, normal.z ]
                    );
                }
            }
            return result;
        }

        toVertexNormalArray() {
            let result = [];

            // For each face...
            for (let i = 0, maxi = this.indices.length; i < maxi; i += 1) {
                // For each vertex in that face...
                for (let j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                    let p = this.vertices[this.indices[i][j]];
                    let normal = new Vector(p[0], p[1], p[2]).unit;
                    result = result.concat(
                        [ normal.x, normal.y, normal.z ]
                    );
                }
            }
            return result;
        }
    }

    class sphere extends Mesh {
        constructor () {
            super({});
            let latitude = 20;
            let longitude = 20;
            let radius = 0.5;
            this.vertices = [];
            this.indices = [];

            for (let currentLong = 0; currentLong <= longitude; currentLong++) {
                let phi = currentLong * 2 * Math.PI / longitude;
                let phiSin = Math.sin(phi);
                let phiCos = Math.cos(phi);

                for (let currentLat = 0; currentLat <= latitude; currentLat++) {
                    let theta = currentLat * Math.PI / latitude;
                    let thetaSin = Math.sin(theta);
                    let thetaCos = Math.cos(theta);

                    let x = phiCos * thetaSin;
                    let y = thetaCos;
                    let z = phiSin * thetaSin;

                    this.vertices.push([ x * radius, y * radius, z * radius ]);

                    let top = currentLat * (longitude + 1) + currentLong;
                    let bottom = top + longitude + 1;

                    if (currentLat !== latitude && currentLong !== longitude) {
                        this.indices.push([ top + 1, bottom + 1, bottom ]);
                        this.indices.push([ top + 1, bottom, top ]);
                    }
                }
            }
        }
    }
    Mesh.sphere = sphere;

    class triPyramid extends Mesh {
        constructor() {
            super({});
            const X = 0.4;
            const Y = 0.2;

            this.vertices = [
                [ X, -Y, 0.0 ], // 0
                [ 0.0, -Y, -X ], // 1
                [ -X, -Y, 0.0 ], // 2
                [ 0.0, Y, -Y ] // 3
            ],
            this.indices = [
                [ 0, 1, 2 ],
                [ 0, 1, 3 ],
                [ 0, 3, 2 ],
                [ 2, 1, 3 ]
            ];
        }
    }
    Mesh.triPyramid = triPyramid;

    class cube extends Mesh {
        constructor() {
            super({});
            const X = 0.2;
            const Y = 0.2;
            const Z = 0.2;

            this.vertices = [
                [ X, Y, Z ], // 0
                [ X, Y, -Z ], // 1
                [ -X, Y, Z ], // 2
                [ -X, Y, -Z ], // 3
                [ X, -Y, Z ], // 4
                [ X, -Y, -Z ], // 5
                [ -X, -Y, Z ], // 6
                [ -X, -Y, -Z ]// 7
            ],
            this.indices = [
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
            ];
        }
    }
    Mesh.cube = cube;

    class icosahedron extends Mesh {
        constructor() {
            super({});
            // The core icosahedron coordinates.
            const X = 0.525731112119133606;
            const Z = 0.850650808352039932;

            this.vertices = [
                [ -X, 0.0, Z ],
                [ X, 0.0, Z ],
                [ -X, 0.0, -Z ],
                [ X, 0.0, -Z ],
                [ 0.0, Z, X ],
                [ 0.0, Z, -X ],
                [ 0.0, -Z, X ],
                [ 0.0, -Z, -X ],
                [ Z, X, 0.0 ],
                [ -Z, X, 0.0 ],
                [ Z, -X, 0.0 ],
                [ -Z, -X, 0.0 ]
            ],
            this.indices = [
                [ 1, 4, 0 ],
                [ 4, 9, 0 ],
                [ 4, 5, 9 ],
                [ 8, 5, 4 ],
                [ 1, 8, 4 ],
                [ 1, 10, 8 ],
                [ 10, 3, 8 ],
                [ 8, 3, 5 ],
                [ 3, 2, 5 ],
                [ 3, 7, 2 ],
                [ 3, 10, 7 ],
                [ 10, 6, 7 ],
                [ 6, 11, 7 ],
                [ 6, 0, 11 ],
                [ 6, 1, 0 ],
                [ 10, 1, 6 ],
                [ 11, 0, 9 ],
                [ 2, 11, 9 ],
                [ 5, 2, 9 ],
                [ 11, 2, 7 ]
            ];
        }
    }
    Mesh.icosahedron = icosahedron;

    window.Mesh = Mesh;
})();
