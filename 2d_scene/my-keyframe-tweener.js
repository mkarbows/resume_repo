/*
 * A simple keyframe-tweening animation module for 2D
 * canvas elements.
 */
(() => {
    // The big one: animation initialization.  The settings parameter
    // is expected to be a JavaScript object with the following
    // properties:
    //
    // - renderingContext: the 2D canvas rendering context to use
    // - width: the width of the canvas element
    // - height: the height of the canvas element
    // - scene: the array of sprites to animate
    // - frameRate: number of frames per second (default 24)
    //
    // In turn, each sprite is a JavaScript object with the following
    // properties:
    //
    // - draw: the function that draws the sprite
    // - keyframes: the array of keyframes that the sprite should follow
    //
    // Finally, each keyframe is a JavaScript object with the following
    // properties.  Unlike the other objects, defaults are provided in
    // case a property is not present:
    //
    // - frame: the global animation frame number in which this keyframe
    //          is to appear
    // - ease: the easing function to use (default is KeyframeTweener.linear)
    // - tx, ty: the location of the sprite (default is 0, 0)
    // - sx, sy: the scale factor of the sprite (default is 1, 1)
    // - rotate: the rotation angle of the sprite (default is 0)

    var tween = function(scene) {
        var allpreprocessedSprites = {};
        for (let i = 0, maxI = scene.length; i < maxI; i += 1) {
            var preprocessedSprite = {};
            for (let j = 0, maxJ = scene[i].keyframes.length; j < maxJ; j += 1) {
                var props = Object.keys(scene[i].keyframes[j]);
                props = props.filter(function (prop) { return !(prop === "frame" || prop === "ease");});

                for (var index in props) {
                    if (!preprocessedSprite[props[index]]) {
                        preprocessedSprite[props[index]] = [];
                    }
                    preprocessedSprite[props[index]].push(scene[i].keyframes[j]);
                }
            }
            allpreprocessedSprites[scene[i].sprite] = preprocessedSprite;
        }
        return allpreprocessedSprites;
    };

    
    let getMostRecentPriorKeyframe = (frameNumber, processedProperty) => {
        for (var i = 0, maxI = processedProperty.length; i < maxI; i += 1) {
            if (processedProperty[i].frame > frameNumber) {
                return processedProperty[i - 1];
            }
            if (processedProperty[i].frame === frameNumber) {
                return processedProperty[i];
            }
        }
        return processedProperty[processedProperty.length - 1];
    };


    let getClosestFutureKeyFrame = (frameNumber, processedProperty) => {
        for (var i = 0, maxI = processedProperty.length; i < maxI; i += 1) {
            if (processedProperty[i].frame > frameNumber) {
                return processedProperty[i];
            }
        }
    };

    // default properties and defualt ease constants
    const DEFAULT_PROPERTIES = {
        tx: 0,
        ty: 0,
        sx: 0.5,
        sy: 0.5,
        rotate: 0,
        pupilSize: 0.5
    };

    const EASE_DEFAULT = "linear";

    let getPropDefault = (propertyName) => {
        return DEFAULT_PROPERTIES[propertyName] || 0;
    };


    let initializeAnimation = (settings) => {
        // We need to keep track of the current frame.
        let currentFrame = 0;

        // Avoid having to go through settings to get to the
        // rendering context and sprites.
        let renderingContext = settings.renderingContext;
        let width = settings.width;
        let height = settings.height;
        let scene = settings.scene;

        var entireProcessedScene = tween(scene);

        let previousTimestamp = null;
        let nextFrame = (timestamp) => {
            // Bail-out #1: We just started.
            if (!previousTimestamp) {
                previousTimestamp = timestamp;
                window.requestAnimationFrame(nextFrame);
                return;
            }

            // Bail-out #2: Too soon.
            if (timestamp - previousTimestamp < (1000 / (settings.frameRate || 24))) {
                window.requestAnimationFrame(nextFrame);
                return;
            }

            // Clear the canvas.
            renderingContext.clearRect(0, 0, width, height);

            // For every sprite, go to the current pair of keyframes.
            // Then, draw the sprite based on the current frame.
            for (let i = 0, maxI = scene.length; i < maxI; i += 1) {
                var propAtFrame = {};
                var processedS = entireProcessedScene[scene[i].sprite];
                for (var propertyName in processedS) {
                    let startKeyframe = getMostRecentPriorKeyframe(currentFrame, processedS[propertyName]);
                    let endKeyframe = getClosestFutureKeyFrame(currentFrame, processedS[propertyName]);

                    // needed to use prop defualts
                    let propStart = startKeyframe ? startKeyframe[propertyName] : getPropDefault(propertyName);

                    if (!endKeyframe){
                        continue;
                    }

                    // new ease for ease default
                    let ease = KeyframeTweener[startKeyframe && startKeyframe.ease ? startKeyframe.ease : EASE_DEFAULT];

                    let startFrame = startKeyframe ? startKeyframe.frame : 0;
                    let propDistance = (endKeyframe[propertyName] || 0) - propStart;
                    let currentTweenFrame = currentFrame - startFrame;
                    let duration = endKeyframe.frame - startFrame + 1;

                    propAtFrame[propertyName] = ease(currentTweenFrame, propStart, propDistance, duration);
                }

                renderingContext.save();
                renderingContext.translate(propAtFrame.tx, propAtFrame.ty);
                renderingContext.rotate(propAtFrame.rotate * Math.PI / 180);
                renderingContext.scale(propAtFrame.sx, propAtFrame.sy);

                propAtFrame.renderingContext = renderingContext;
                SampleSpriteLibrary[scene[i].sprite](propAtFrame);

                renderingContext.restore();
            }
            // Move to the next frame.

            currentFrame += 1;
            if (currentFrame < 181) {
                previousTimestamp = timestamp;
                window.requestAnimationFrame(nextFrame);
            } else if (currentFrame == 185) {
                renderingContext.clearRect(0, 0, width, height);
            }
        };
        window.requestAnimationFrame(nextFrame);
    };

    window.KeyframeTweener = {
        // The module comes with a library of common easing functions.
        linear: (currentTime, start, distance, duration) => {
            let percentComplete = currentTime / duration;
            return distance * percentComplete + start;
        },

        quadEaseIn: (currentTime, start, distance, duration) => {
            let percentComplete = currentTime / duration;
            return distance * percentComplete * percentComplete + start;
        },

        quadEaseOut: (currentTime, start, distance, duration) => {
            let percentComplete = currentTime / duration;
            return -distance * percentComplete * (percentComplete - 2) + start;
        },

        quadEaseInAndOut: (currentTime, start, distance, duration) => {
            let percentComplete = currentTime / (duration / 2);
            return (percentComplete < 1) ?
                    (distance / 2) * percentComplete * percentComplete + start :
                    (-distance / 2) * ((percentComplete - 1) * (percentComplete - 3) - 1) + start;
        },

        easeOutBounce: (currentTime, start, distance, duration) => {
            let percentComplete = currentTime / duration;
            if (percentComplete < (1 / 2.75)) {
                return distance * (7.5625 * percentComplete * percentComplete) + start;
            } else if (percentComplete < (2 / 2.75)) {
                return distance * (7.5625 * (percentComplete -= (1.5 / 2.75)) * percentComplete + 0.75) + start;
            } else if (percentComplete < (2.5 / 2.75)) {
                return distance * (7.5625 * (percentComplete -= (2.25 / 2.75)) * percentComplete + 0.9375) + start;
            } else {
                return distance * (7.5625 * (percentComplete -= (2.625 / 2.75)) * percentComplete + 0.984375) + start;
            }
        },

        elastic: (currentTime, start, distance, duration) => {
            let percentComplete = currentTime / duration;
            return distance * (-1 * Math.pow(4, -8 * percentComplete) * Math.sin((percentComplete * 6 - 1) * 
                (2 * Math.PI) / 2) + 1) + start;
        },

        initialize: initializeAnimation
    };
})();