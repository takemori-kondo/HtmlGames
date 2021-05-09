// ES2015 module mode

class GlobalInner {
    // debug mode?
    get IS_DEBUG(){ return false }

    // key constants
    get KEY_SPACE() { return 32 }
    get KEY_Z() { return 90 }
    get KEY_X() { return 88 }
    get KEY_LEFT_() { return 37 }
    get KEY_UP___() { return 38 }
    get KEY_RIGHT() { return 39 }
    get KEY_DOWN_() { return 40 }
    get KEY_ENTER() { return 13 }

    // canvas settings
    get CANVAS_SCREEN_WIDTH() { return 640 }
    get CANVAS_SCREEN_HEIGHT() { return 360 }
    get CANVAS_CONTEXT_TYPE() { return '2d' }
    get DEFAULT_FONT() { return '12px Consolas, monospace' }

    // game settings
    get FEET_UP() { return 0.14 }
    get GAME_OVER_FONT() { return '64px Consolas, monospace' }
    get GAME_OVER_SUB_FONT() { return '24px Consolas, monospace' }
    get GRAVITY() {
        const result = 0.3;
        return this.g_reversesY ? -result : result;
    }

    get CREATE_BLOCK_INTERVAL_WIDTH() { return 60; }
    get CREATE_BLOCK_INTERVAL_MIN() { return 16; }
    get CREATE_BLOCK_POS_Y_WIDTH() { return 50; }
    get CREATE_BLOCK_POS_Y_MIN() { return 60; }

    get CREATE_ENEMY_INTERVAL_WIDTH() { return 60; }
    get CREATE_ENEMY_INTERVAL_MIN() { return 80; }
    get CREATE_ENEMY_INTERVAL_EVERY_REDUCE() { return 0.03; }
    get CREATE_ENEMY_POS_Y_WIDTH() { return 180; }
    get CREATE_ENEMY_POS_Y_MIN() { return 160; }
    get ENEMY_BULLET_FIRE_INTERVAL_EVERY_REDUCE() { return 0.03; }

    constructor() {
        // system & input parameters
        this.g_ctx = null;
        this.g_inputKeyBuffer = [];

        // game parameters
        this.g_highScore = 0;
        this.g_drawingErrorOccurred = false;

        // camera status
        this.g_cameraPosX = 0;
        this.g_cameraPosY = 0;
        this.g_reversesY = true;
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

    g_ctx_drawCircleColliders(x, y, circleColliders, globalAlpha = 0.50, fillStyle = 'rgb(0, 128, 128)') {
        const tmpAlpha = this.g_ctx.globalAlpha;
        const tmpStroke = this.g_ctx.strokeStyle;
        const tmpFill = this.g_ctx.fillStyle;
        this.g_ctx.globalAlpha = globalAlpha;
        this.g_ctx.fillStyle = fillStyle;
        for (const collider of circleColliders) {
            this.g_ctx_beginPath_arc_fill(x + collider.offsetX, y + collider.offsetY, collider.radius);
        }
        this.g_ctx.globalAlpha = tmpAlpha;
        this.g_ctx.strokeStyle = tmpStroke;
        this.g_ctx.fillStyle = tmpFill;
    }

    g_ctx_drawAabbColliders(x, y, aabbColliders, globalAlpha = 0.50, strokeStyle = 'rgb(255, 128, 128)') {
        const tmpAlpha = this.g_ctx.globalAlpha;
        const tmpStroke = this.g_ctx.strokeStyle;
        const tmpFill = this.g_ctx.fillStyle;
        this.g_ctx.globalAlpha = globalAlpha;
        this.g_ctx.strokeStyle = strokeStyle;
        for (const collider of aabbColliders) {
            this.g_ctx_beginPath_rect_stroke(
                x - collider.halfW + collider.offsetX,
                y - collider.halfH + collider.offsetY,
                collider.width,
                collider.height);
        }
        this.g_ctx.globalAlpha = tmpAlpha;
        this.g_ctx.strokeStyle = tmpStroke;
        this.g_ctx.fillStyle = tmpFill;
    }

    g_ctx_drawImage(image, dx, dy, imgWidth, imgHeight, imgOffsetX, imgOffsetY){
        // canvasは左上が原点なので、g_reversesY=trueの時は、y位置は反転して描画する（画像の向きは反転しない）
        if (this.g_reversesY) {
            this.g_ctx.drawImage(image, dx - imgWidth / 2.0 + imgOffsetX - this.g_cameraPosX, - imgHeight / 2.0 + this.CANVAS_SCREEN_HEIGHT - (dy + imgOffsetY - this.g_cameraPosY));
        } else {
            this.g_ctx.drawImage(image, dx - imgWidth / 2.0 + imgOffsetX - this.g_cameraPosX, - imgHeight / 2.0 + (dy + imgOffsetY - this.g_cameraPosY));
        }
    }
    
    g_ctx_beginPath_arc_fill(x, y, radius) {
        // canvasは左上が原点なので、g_reversesY=trueの時は、y位置は反転して描画する（画像の向きは反転しない）
        if (this.g_reversesY) {
            this.g_ctx.beginPath();
            this.g_ctx.arc(x - this.g_cameraPosX, this.CANVAS_SCREEN_HEIGHT - (y - this.g_cameraPosY), radius, 0, Math.PI*2, false);
            this.g_ctx.fill();
        } else {
            this.g_ctx.beginPath();
            this.g_ctx.arc(x - this.g_cameraPosX, y - this.g_cameraPosY, radius, 0, Math.PI*2, false);
            this.g_ctx.fill();
        }
    }

    g_ctx_beginPath_rect_stroke(x, y, w, h) {
        // canvasは左上が原点なので、g_reversesY=trueの時は、y位置は反転して描画する（画像の向きは反転しない）
        if (this.g_reversesY) {
            Global.g_ctx.beginPath();
            Global.g_ctx.rect(x - this.g_cameraPosX, this.CANVAS_SCREEN_HEIGHT - (y - this.g_cameraPosY), w, -h);
            Global.g_ctx.stroke();
        } else {
            Global.g_ctx.beginPath();
            Global.g_ctx.rect(x - this.g_cameraPosX, y - this.g_cameraPosY, w, h);
            Global.g_ctx.stroke();
        }
    }

    g_ctx_beginPath_rect_fill(x, y, w, h) {
        // canvasは左上が原点なので、g_reversesY=trueの時は、y位置は反転して描画する（画像の向きは反転しない）
        if (this.g_reversesY) {
            Global.g_ctx.beginPath();
            Global.g_ctx.rect(x - this.g_cameraPosX, this.CANVAS_SCREEN_HEIGHT - (y - this.g_cameraPosY), w, -h);
            Global.g_ctx.fill();
        } else {
            Global.g_ctx.beginPath();
            Global.g_ctx.rect(x - this.g_cameraPosX, y - this.g_cameraPosY, w, h);
            Global.g_ctx.fill();
        }
    }

    IsOutOfScreen(x, y) {
        const margin = 1.0;
        return (Global.g_cameraPosX - Global.CANVAS_SCREEN_WIDTH * (margin) >= x ||
            Global.g_cameraPosX + Global.CANVAS_SCREEN_WIDTH * (1.0 + margin) <= x ||
            Global.g_cameraPosY - Global.CANVAS_SCREEN_HEIGHT * (margin) >= y ||
            Global.g_cameraPosY + Global.CANVAS_SCREEN_HEIGHT * (1.0 + margin) <= y);
    }
}
export const Global = new GlobalInner();