(() => {

    window.SampleSpriteLibrary = window.SampleSpriteLibrary || {};

    // SampleSpriteLibrary.flower = () => {
        // let renderingContext = specs.renderingContext;
    let xOrigin = 0;
    let yOrigin = 0;

    let petalFill = "rgba(63, 191, 142, 1.0)";
    let centerFill = "yellow";

    let drawFlower = (renderingContext) => {
        renderingContext.save();
        drawStem(renderingContext);
        renderingContext.restore();             
    };

    let drawStem = (renderingContext) => {
        // stem
        renderingContext.save();
        renderingContext.strokeStyle = "green";
        renderingContext.lineWidth = 3;
        renderingContext.beginPath();
        renderingContext.bezierCurveTo(xOrigin, 30, 20, 20, 10, 300);
        renderingContext.stroke();
        renderingContext.restore();
    };

    let drawPetals = (renderingContext, petalFill, petalRotation) => {
        // petals
        renderingContext.save();
        renderingContext.translate(xOrigin, yOrigin);
        renderingContext.rotate(petalRotation * Math.PI / -80);
        for (let i = 0, max = 6; i < max; i += 1) {
            renderingContext.fillStyle = petalFill;
            renderingContext.strokeStyle = "rgba(63, 180, 170, 1.0)";
            renderingContext.rotate(Math.PI / 3);
            renderingContext.beginPath();
            renderingContext.bezierCurveTo(xOrigin, yOrigin, 90, -100, 200, 0);
            renderingContext.fill();
            renderingContext.stroke();
            renderingContext.beginPath();
            renderingContext.bezierCurveTo(xOrigin, yOrigin, 90, 100, 200, 0);
            renderingContext.fill(); 
            renderingContext.stroke();
            // renderingContext.rotate(petalRotation * Math.PI / 180);
            renderingContext.closePath(); 
        }
        renderingContext.restore();
    };

    let drawCenter = (renderingContext, centerFill, centerSize, centerRotation) => {
        // center
        renderingContext.save();
        renderingContext.fillStyle = centerFill;
        renderingContext.translate(xOrigin, yOrigin);
        renderingContext.rotate(centerRotation * Math.PI / 180);
        renderingContext.scale(1.0, centerSize);
        renderingContext.beginPath();
        renderingContext.arc(xOrigin, yOrigin, 26, 0, Math.PI * 2);
        renderingContext.closePath();
        renderingContext.fill();

        renderingContext.beginPath();
        renderingContext.strokeStyle = "orange";
        renderingContext.moveTo(-26, 0);
        renderingContext.lineTo(26, 0);
        renderingContext.moveTo(0, -26);
        renderingContext.lineTo(0, 26);
        renderingContext.stroke();
        renderingContext.restore();
    };

    SampleSpriteLibrary.flower = (flowerSpecification) => {
        let renderingContext = flowerSpecification.renderingContext;
        renderingContext.save();
        drawFlower(renderingContext);
        drawPetals(renderingContext, petalFill, flowerSpecification.petalRotation || 1.0);
        drawCenter(renderingContext, centerFill, flowerSpecification.centerSize || 1.0, 
            flowerSpecification.centerRotation || 1.0);
        renderingContext.restore();
    };
        
    // };

})();