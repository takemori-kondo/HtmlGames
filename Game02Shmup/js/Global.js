// ES2015 module mode

class GlobalInner {
    // debug mode?
    get IS_DEBUG(){ return true };

    // key constants
    get KEY_SPACE() { return 32 };
    get KEY_Z() { return 90 };
    get KEY_X() { return 88 };
    get KEY_LEFT_() { return 37 };
    get KEY_UP___() { return 38 };
    get KEY_RIGHT() { return 39 };
    get KEY_DOWN_() { return 40 };
    get KEY_ENTER() { return 13 };

    // canvas settings
    get CANVAS_SCREEN_WIDTH() { return 640 };
    get CANVAS_SCREEN_HEIGHT() { return 360 };
    get CANVAS_CONTEXT_TYPE() { return '2d' };
    get DEFAULT_FONT() { return '12px Consolas, monospace' };

    // game settings
    get PLAYER_SPEED_X() { return 2 };
    get PLAYER_SPEED_Y() { return 2 };
    get FEET_UP() { return 2.0 };
    get GAME_OVER_FONT() { return '64px Consolas, monospace' };
    get GAME_OVER_SUB_FONT() { return '24px Consolas, monospace' };
    // get GROUND() { return 50 };
    // get PLAYER_GROUND_TOUCH_OFFSET() { return 21 };
    // get GRAVITY() { return -0.3 };
    // get ZOO_LOOP() { return 11000 };
    get PLAYER_LEFT_TOUCH_OFFSET() { return 21; }
    get PLAYER_RIGHT_TOUCH_OFFSET() { return  21; }
    get PLAYER_BOTTOM_TOUCH_OFFSET() { return 42; }
    get PLAYER_TOP_TOUCH_OFFSET() { return 21; }

    get PLAYER_SHOT_RELOAD_TIME() { return 10; }

    get PLAYER_BULLET_SPEED_X() { return 9; }
    get PLAYER_BULLET_ATTACK_POWER() { return 3; }

    get CREATE_ENEMY_INTERVAL_WIDTH() { return 40; }
    get CREATE_ENEMY_INTERVAL_MIN() { return 80; }
    get CREATE_ENEMY_INTERVAL_EVERY_REDUCE() { return 0.03; }
    get CREATE_ENEMY_POS_Y_WIDTH() { return 240; }
    get CREATE_ENEMY_POS_Y_MIN() { return 120; }

    get ENEMY_HELICOPTER_SPEED_X() { return -2; }

    get PLAYER_POS_X_OFFSET() { return 0; }
    get PLAYER_POS_Y_OFFSET() { return 50; }
    get ENEMY_BULLET_FIRE_INTERVAL_WIDTH() { return 30; }
    get ENEMY_BULLET_FIRE_INTERVAL_MIN() { return 140; }
    get ENEMY_BULLET_FIRE_INTERVAL_EVERY_REDUCE() { return 0.03; }
    get ENEMY_BULLET_SPEED() { return 6; }

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