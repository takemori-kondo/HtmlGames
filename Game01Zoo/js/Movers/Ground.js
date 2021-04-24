// ES2015 module mode

import {Global} from '../Global.js'
import {Mover} from './Mover.js'

export class Ground extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
    }

    draw() {
        Global.g_ctx.beginPath();
        Global.g_ctx.moveTo(this.x, Global.CANVAS_SCREEN_HEIGHT - this.y);
        Global.g_ctx.lineTo(this.x + Global.CANVAS_SCREEN_WIDTH, Global.CANVAS_SCREEN_HEIGHT - this.y);
        Global.g_ctx.closePath();
        Global.g_ctx.stroke();
    }
}