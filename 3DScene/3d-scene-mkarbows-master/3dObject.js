/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
((canvas) => {
    let $ = window.$;
    let Matrix = window.Matrix;
    let ThreeD = window.ThreeD;

    // Grab the WebGL rendering context.
    let GLSLUtilities = window.GLSLUtilities;
    let gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Build the objects to display.
    let Mesh = window.Mesh;
    let modeTriangles = gl.TRIANGLES;

    let sphereMesh = new Mesh.sphere();
    let sphereVertices = sphereMesh.toRawTriangleArray();
    let sphereColor = { r: 0.9, g: 0.8, b: 0.8 };
    let sphereNormal = sphereMesh.toVertexNormalArray();
    let sphereObject = new ThreeD(sphereVertices, sphereColor, modeTriangles, sphereNormal);

    sphereObject.velocity = new Vector(0, 0, 0);
    sphereObject.acceleration = new Vector(0, -0.00009, 0);

    let triPyramidMesh = new Mesh.triPyramid();
    let pyramidVertices = triPyramidMesh.toRawTriangleArray();
    let pyramidColor = { r: 0.9, g: 0.5, b: 0.5 };
    let triPyramidNormal = triPyramidMesh.toVertexNormalArray();
    let triPyramidObject = new ThreeD(pyramidVertices, pyramidColor, modeTriangles, triPyramidNormal);

    // triPyramidObject.rotate({angle: -30, x: 0.5, y: 0.0, z: 0.0});
    triPyramidObject.scale({sx: 0.2, sy: 3.0, sz: 0.0});
    triPyramidObject.translate({tx: 0.0, ty: 5.1, tz: 0.3});

    let triPyramidObject2 = new ThreeD(pyramidVertices, pyramidColor, modeTriangles, triPyramidNormal);
    let triPyramidObject3 = new ThreeD(pyramidVertices, pyramidColor, modeTriangles, triPyramidNormal);

    triPyramidObject2.rotate({angle: -30, x: 0.0, y: 0.0, z: 3.0});
    triPyramidObject2.scale({sx: 0.3, sy: 0.5, sz: 0.0});
    triPyramidObject2.translate({tx: -1.6, ty: 2.3, tz: 0.0});

    triPyramidObject3.rotate({angle: 30, x: 0.0, y: 0.0, z: 3.0});
    triPyramidObject3.scale({sx: 0.3, sy: 0.5, sz: 0.0});
    triPyramidObject3.translate({tx: 1.6, ty: 2.3, tz: 0.0});

    let sphereColor2 = { r: 0.4, g: 0.4, b: 0.4 };
    let sphereObject2 = new ThreeD(sphereVertices, sphereColor2, modeTriangles, sphereNormal);
    sphereObject2.scale({sx: 0.09, sy: 0.09, sz: 0.09});
    sphereObject2.translate({tx: -0.3, ty: 0.09, tz: -8.5});

    let sphereObject3 = new ThreeD(sphereVertices, sphereColor2, modeTriangles, sphereNormal);
    sphereObject3.scale({sx: 0.09, sy: 0.09, sz: 0.09});
    sphereObject3.translate({tx: 0.3, ty: 0.09, tz: -8.5});


    let cubeMesh = new Mesh.cube();
    let cubeVertices = cubeMesh.toRawTriangleArray();
    let cubeColor = { r: 0.0, g: 0.6, b: 0.7 };
    let cubeNormal = cubeMesh.toVertexNormalArray();
    let cubeObject = new ThreeD(cubeVertices, cubeColor, modeTriangles, cubeNormal);

    cubeObject.translate({tx: 0.0, ty: -0.6, tz: 0.5});
    cubeObject.scale({sx: 1.0, sy: 0.2, sz: 0.0});

    sphereObject.addChild(triPyramidObject);
    sphereObject.addChild(sphereObject2);
    sphereObject.addChild(sphereObject3);
    sphereObject.addChild(cubeObject);
    sphereObject.addChild(triPyramidObject2);
    sphereObject.addChild(triPyramidObject3);

    let objectsToDraw = [sphereObject];

    // Pass the vertices to WebGL.
    let draw = (objectsToDraw) => {
        for (var i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            objectsToDraw[i].buffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].vertices);

            if (!objectsToDraw[i].colors) {
                objectsToDraw[i].colors = [];
                for (var j = 0, maxj = objectsToDraw[i].vertices.length / 3; j < maxj; j += 1) {
                    objectsToDraw[i].colors = objectsToDraw[i].colors.concat(
                        objectsToDraw[i].color.r,
                        objectsToDraw[i].color.g,
                        objectsToDraw[i].color.b
                    );
                }
            }
            objectsToDraw[i].colorBuffer = GLSLUtilities.initVertexBuffer(gl, objectsToDraw[i].colors);
            objectsToDraw[i].normalBuffer = GLSLUtilities.initVertexBuffer(gl, objectsToDraw[i].normal);
            if (objectsToDraw[i].children.length > 0) {
                draw(objectsToDraw[i].children);
            }
        }
    };

    // Initialize the shaders.
    let abort = false;
    let shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        (shader) => {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        () => {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    let vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    let vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);

    let normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    let modelViewMatrix = gl. getUniformLocation(shaderProgram, "modelViewMatrix");
    let projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    let transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    let cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");

    let lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    let lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");

    let projection = new Float32Array(Matrix.getPersectiveMatrix(
        -2,
        2,
        -2,
        2,
        2,
        10000
    ).convertToWebGl());
    gl.uniformMatrix4fv(projectionMatrix, gl.FALSE, projection);

    gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, new Float32Array(
        Matrix.getCameraMatrix(
            0,
            0,
            10,
            0,
            0,
            0,
            0,
            5,
            0
    ).convertToWebGl()));

    /*
     * Displays an individual object.
     */
    let drawObject = (object, parent) => {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(
            Matrix.getRotationMatrix(rotationAroundX, 1.0, 0.0, 0.0).convertToWebGl()
        ));
        gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(
            Matrix.getRotationMatrix(rotationAroundY, 0.0, 1.0, 0.0).convertToWebGl()
        ));

        object.transform();
        let objectMatrix = object.transformMatrix;
        if (parent) {
            objectMatrix = parent.transformMatrix.getMatrixMult(objectMatrix);
        }
        gl.uniformMatrix4fv(transformMatrix, gl.FALSE, new Float32Array(
            objectMatrix.convertToWebGl()));

        // Set the varying normal vectors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(object.mode, 0, object.vertices.length / 3);

        let children = object.children;
        for (let i = 0; i < children.length; i++) {
            drawObject(children[i], object);
        }
    };

    /*
     * Displays the scene.
     */
    let drawScene = () => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Display the objects.
        for (let i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            drawObject(objectsToDraw[i]);
        }

        // All done.
        gl.flush();
    };

    gl.uniform3fv(lightPosition, [0.0, 0.0, 5.0]);
    gl.uniform3fv(lightDiffuse, [5.0, 5.0, 5.0]);

    draw(objectsToDraw);
    /*
     * Animates the scene.
     */
    let animationActive = false;
    let currentRotation = 0.0;
    let previousTimestamp = null;

    const FRAMES_PER_SECOND = 60;
    const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND;

    const DEGREES_PER_MILLISECOND = 0.033;
    const FULL_CIRCLE = 360.0;

    let advanceScene = (timestamp) => {
        // Check if the user has turned things off.
        if (!animationActive) {
            return;
        }

        // Initialize the timestamp.
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // Check if it's time to advance.
        let progress = timestamp - previousTimestamp;
        if (progress < MILLISECONDS_PER_FRAME) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // All clear.
        currentRotation += DEGREES_PER_MILLISECOND * progress;

        let distanceTraveled = sphereObject.velocity.multiply(progress);
        sphereObject.translate({tx: distanceTraveled.x, ty: distanceTraveled.y, tz: distanceTraveled.z});
        sphereObject.velocity = sphereObject.velocity.add(sphereObject.acceleration.multiply(progress));
        if(sphereObject.translateMatrix.elements[1][3] < -3) {
            sphereObject.translate({tx: 0, ty: -3 - sphereObject.translateMatrix.elements[1][3], tz: 0});
            sphereObject.velocity = new Vector(sphereObject.velocity.x, -sphereObject.velocity.y, sphereObject.velocity.z);
        }

        drawScene();
        if (currentRotation >= FULL_CIRCLE) {
            currentRotation -= FULL_CIRCLE;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    let rotationAroundX = 0.0;
    let rotationAroundY = -90.0;
    let xDragStart;
    let yDragStart;
    let xRotationStart;
    let yRotationStart;

    let cameraRotate = (event) => {
        rotationAroundX = xRotationStart + yDragStart - event.clientY;
        rotationAroundY = yRotationStart + xDragStart - event.clientX;
        drawScene();
    };

    canvas.onmousedown = (event) => {
        xDragStart = event.clientX;
        yDragStart = event.clientY;
        xRotationStart = rotationAroundX;
        yRotationStart = rotationAroundY;
        canvas.onmousemove = cameraRotate;
    };

    canvas.onmouseup = () => {
        canvas.onmousemove = null;
    };

    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(() => {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

})(document.getElementById("hello-webgl"));
