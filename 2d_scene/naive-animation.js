(() => {
    let canvas = $("#canvas")[0];
    let renderingContext = canvas.getContext("2d");

    let eyeballsx = 150;
    let eyeballsy = 100;
    let pupilSize = 1.0;

    let flowerX = 175;
    let flowerY = 300;
    let flowerScale = 0.74;
    let centerSize = 1.0;
    let centerRotation = 0;
    let petalRotation = 0;

    let waveX = 350;
    let waveY = 300;
    let curve1ControlX = 125;
    let curve1ControlY = -125;
    let curve2ControlX = 70;
    let curve2ControlY = -45;
    // let strokeThickness = 0.5;

    const FRAME_DURATION = 30; // In milliseconds.

    let lastTimestamp = 0;
    let drawFrame = (timestamp) => {
        lastTimestamp = lastTimestamp || timestamp;
        if (timestamp - lastTimestamp < FRAME_DURATION) {
            window.requestAnimationFrame(drawFrame);
            return;
        }
        lastTimestamp = timestamp;
        renderingContext.clearRect(0, 0, canvas.width, canvas.height);

        renderingContext.save();
        renderingContext.translate(eyeballsx, eyeballsy);
        SampleSpriteLibrary.eyeballs({
            renderingContext,
            pupilSize
        });
        renderingContext.restore();

        pupilSize = Math.abs(Math.sin(timestamp / 300));
        pupilSize += 1.5;
        if (pupilSize > 15.0) {
            pupilSize = 0.5;
        }

        // eyeballsx += 10;
        // if (eyeballsx >= canvas.width / 3) {
        //     eyeballsx = 100;
        // }

        renderingContext.save();
        renderingContext.translate(flowerX, flowerY);
        renderingContext.scale(flowerScale, flowerScale);
        SampleSpriteLibrary.flower({
            renderingContext,
            centerSize,
            centerRotation,
            petalRotation
        });
        renderingContext.restore();

        centerSize = Math.abs(Math.sin(timestamp / 150));
        centerRotation += 1;
        petalRotation += 1;

        // flowerX += 5;
        // if(flowerX > canvas.width) {
        //     flowerX =0;
        // }

        renderingContext.save();
        renderingContext.translate(waveX, waveY);
        SampleSpriteLibrary.wave({
            renderingContext,
            curve1ControlX, curve1ControlY,
            curve2ControlX, curve2ControlY
        });
        renderingContext.restore();

        curve1ControlX += 0.5;
        if (curve1ControlX >= 135) {
            curve1ControlX = 125;
        }
        curve1ControlY += -0.5;
        if (curve1ControlY >= -135) {
            curve1ControlY = -125;
        }

        curve2ControlX += 1.0;
        if (curve2ControlX >= 80) {
            curve2ControlX = 70;
        }
        curve2ControlY += -1.0;
        if (curve2ControlY <= -50) {
            curve2ControlY = -45;
        }

        window.requestAnimationFrame(drawFrame);
    };

    window.requestAnimationFrame(drawFrame);
})();
