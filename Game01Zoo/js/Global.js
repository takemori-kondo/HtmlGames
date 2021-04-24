// ES2015 module mode

class GlobalInner {
    // debug mode?
    get IS_DEBUG(){ return false };

    // key constants
    get KEY_SPACE() { return 32 };
    // get KEY_Z() { return 90 };
    // get KEY_X() { return 88 };
    get KEY_LEFT_() { return 37 };
    // get KEY_UP___() { return 38 };
    get KEY_RIGHT() { return 39 };
    // get KEY_DOWN_() { return 40 };
    get KEY_ENTER() { return 13 };

    // canvas settings
    get CANVAS_SCREEN_WIDTH() { return 640 };
    get CANVAS_SCREEN_HEIGHT() { return 360 };
    get CANVAS_CONTEXT_TYPE() { return '2d' };
    get DEFAULT_FONT() { return '12px Consolas, monospace' };

    // game settings
    get PLAYER_SPEED_X() { return 2 };
    get PLAYER_SPEED_Y() { return 9 };
    get FEET_UP() { return 0.6 };
    get GAME_OVER_FONT() { return '64px Consolas, monospace' };
    get GAME_OVER_SUB_FONT() { return '24px Consolas, monospace' };
    get GROUND() { return 50 };
    get PLAYER_GROUND_TOUCH_OFFSET() { return 21 };
    get GRAVITY() { return -0.3 };
    get ZOO_LOOP() { return 11000 };

    constructor() {
        // system & input parameters
        this.g_ctx = null;
        this.g_inputKeyBuffer = [];

        // game parameters
        this.g_highScore = 0;
        this.g_drawingErrorOccurred = false;
    }

    initialize_g_inputKeyBuffer(doc) {
        doc.onkeydown = (e) => this.g_inputKeyBuffer[e.keyCode] = true;
        doc.onkeyup = (e) => this.g_inputKeyBuffer[e.keyCode] = false;
    }

    initialize_g_ctx(canvas) {
        canvas.width = this.CANVAS_SCREEN_WIDTH;
        canvas.height = this.CANVAS_SCREEN_HEIGHT;
        this.g_ctx = canvas.getContext(this.CANVAS_CONTEXT_TYPE);
        this.g_ctx.font = Global.DEFAULT_FONT;
    }
}
export const Global = new GlobalInner();