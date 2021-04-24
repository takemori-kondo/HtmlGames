// ES2015 module mode

import {Global} from '../Global.js'

export class Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = imgFileName;
        this.imgOffsetX = imgOffsetX;
        this.imgOffsetY = imgOffsetY;
        this.collisions = [];
        this.moveX = 0;
        this.moveY = 0;
    }

    move() {
        this.x += this.moveX;
        this.y += this.moveY;
    }

    draw() {
        try {
            Global.g_ctx.drawImage(this.img, this.x + this.imgOffsetX, Global.CANVAS_SCREEN_HEIGHT - this.y - this.imgOffsetY);
            if (Global.IS_DEBUG) {
                const tmpAlpha = Global.g_ctx.globalAlpha;
                const tmpStroke = Global.g_ctx.strokeStyle;
                const tmpFill = Global.g_ctx.fillStyle;
                Global.g_ctx.globalAlpha = 0.5;
                Global.g_ctx.strokeStyle = 'rgb(0, 128, 128)';
                Global.g_ctx.fillStyle = 'rgb(0, 128, 128)';
                for (const collision of this.collisions) {
                    Global.g_ctx.beginPath();
                    Global.g_ctx.arc(this.x + collision.offsetX, Global.CANVAS_SCREEN_HEIGHT - this.y - collision.offsetY, collision.radius, 0, Math.PI*2, false);
                    Global.g_ctx.fill();
                }
                Global.g_ctx.globalAlpha = tmpAlpha;
                Global.g_ctx.strokeStyle = tmpStroke;
                Global.g_ctx.fillStyle = tmpFill;
            }
        } catch (e) {
            if (!Global.g_drawingErrorOccurred) {
                Global.g_drawingErrorOccurred = true;
                console.error(e);
                console.log(JSON.stringify(this));
            }
        }
    }
}