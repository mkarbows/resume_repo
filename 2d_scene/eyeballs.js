(() => {

    window.SampleSpriteLibrary = window.SampleSpriteLibrary || {};

    // let renderingContext = specs.renderingContext;
    let xOrigin = 0;
    let yOrigin = 0;
    let pupilFill = "black";
    let irisFill = "rgba(63, 191, 142, 1.0)";

    let drawBoth = (renderingContext, eyeballsSpecification) => {
        // draw left eye
        renderingContext.save();
        drawEye(renderingContext, eyeballsSpecification);
        renderingContext.restore();
        // draw right eye
        renderingContext.save();
        renderingContext.translate(300, 0);
        renderingContext.scale(-1, 1);
        drawEye(renderingContext, eyeballsSpecification);
        renderingContext.restore();
    };

    let drawEye = (renderingContext, eyeballsSpecification) => {
        renderingContext.save();
        drawOutline(renderingContext);
        drawIris(renderingContext);
        drawPupil(renderingContext, eyeballsSpecification.pupilSize || 1.0);
        renderingContext.restore();
    };

    let drawOutline = (renderingContext) => {
        renderingContext.save();
        // outline
        renderingContext.strokeStyle = "black";
        renderingContext.beginPath();
        renderingContext.bezierCurveTo(-100, yOrigin, -10, -100, 100, 0);
        renderingContext.stroke();
        renderingContext.closePath();
        renderingContext.beginPath();
        renderingContext.bezierCurveTo(-100, yOrigin, -10, 100, 100, 0);
        renderingContext.stroke();
        renderingContext.closePath();
        renderingContext.restore();
        // eyelashes
        renderingContext.save();
        renderingContext.strokeStyle = "black";
        renderingContext.translate(-167, -4);
        renderingContext.rotate((Math.PI / 180) * (-53));
        for (let i = 0, max = 5; i < max; i += 1) {
            renderingContext.beginPath();
            renderingContext.rotate(Math.PI / 125);
            renderingContext.translate(20, 5.0);
            renderingContext.bezierCurveTo(28, 18, 5, 25, 20, 52);
            renderingContext.stroke();
        }
        renderingContext.restore();
    };

    let drawIris = (renderingContext) => {
        // iris
        renderingContext.save();
        renderingContext.fillStyle = irisFill;
        renderingContext.strokeStyle = "black";
        renderingContext.beginPath();
        renderingContext.arc(xOrigin, yOrigin, 44, 0, Math.PI * 2);
        renderingContext.fill();
        renderingContext.stroke();
        renderingContext.closePath();
        renderingContext.restore();
    };

    let drawPupil = (renderingContext, pupilSize) => {
        renderingContext.save();
        renderingContext.fillStyle = pupilFill;
        renderingContext.scale(pupilSize, pupilSize);
        renderingContext.beginPath();
        renderingContext.arc(xOrigin, yOrigin, 15, 0, Math.PI * 2);
        renderingContext.fill();
        renderingContext.closePath();
        renderingContext.restore();
    };

    SampleSpriteLibrary.eyeballs = (eyeballsSpecification) => {
        let renderingContext = eyeballsSpecification.renderingContext;
        renderingContext.save();
        drawBoth(renderingContext, eyeballsSpecification);
        renderingContext.restore();
    };

})();