// ES2015 module mode

import {Global} from './Global.js'
import {StageScene} from './StageScene.js'

window.onload = () => {
    // initialize g_inputKeyBuffer
    Global.initialize_g_inputKeyBuffer(document);

    // initialize g_ctx
    let canvas = document.getElementById('js-screen');
    Global.initialize_g_ctx(canvas);

    // initialize stage
    const stage = new StageScene();
    stage.restart();

    // requestAnimationFrame loop
    const loop = () => {
        stage.update();
        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
};