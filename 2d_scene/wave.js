(() => {

    window.SampleSpriteLibrary = window.SampleSpriteLibrary || {};

    let drawCurve1 = (renderingContext, curve1ControlX, curve1ControlY, curve2ControlX, curve2ControlY) => {
        renderingContext.save();
        renderingContext.strokeStyle = "black";
        renderingContext.beginPath();
        renderingContext.bezierCurveTo(0, 0, curve1ControlX, curve1ControlY, 135, -55);
        // renderingContext.bezierCurveTo(0, 0, 120, -125, 135, -55);
        renderingContext.stroke();
        renderingContext.beginPath();
        renderingContext.bezierCurveTo(135, -55, curve2ControlX, curve2ControlY, 160, 0);
        renderingContext.stroke();
        renderingContext.restore();
    };

    SampleSpriteLibrary.wave = (waveSpecification) => {
        let renderingContext = waveSpecification.renderingContext;

        renderingContext.save();
        drawCurve1(renderingContext, waveSpecification.curve1ControlX || 125, 
            waveSpecification.curve1ControlY || -125,
            waveSpecification.curve2ControlX || 70, 
            waveSpecification.curve2ControlY || -45);
        renderingContext.restore();

    };
})();
