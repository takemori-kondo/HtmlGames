// ES2015 module mode

import {Global} from '../../Global.js'
import {AabbCollider} from '../AabbCollider.js'
import {Mover} from '../Mover.js'

export class Block extends Mover {
    constructor(x, y, r=75, g=75, b=75, width=32, height=32) {
        super(x, y);
        this.fieldColliders.push(new AabbCollider(0, 0, width, height));
        this.rgbString = 'rgb(' + r + ',' + g + ',' + b + ')'
    }

    move() {
        super.move();
        if (Global.IsOutOfScreen(this.x, this.y)) {
            this.hp = 0;
        }
    }
    
    draw() {
        const tmpAlpha = Global.g_ctx.globalAlpha;
        const tmpStroke = Global.g_ctx.strokeStyle;
        const tmpFill = Global.g_ctx.fillStyle;
        Global.g_ctx.globalAlpha = 1.0;
        Global.g_ctx.strokeStyle = this.rgbString;
        Global.g_ctx.fillStyle = this.rgbString;
        for (const collider of this.fieldColliders) {
            Global.g_ctx_beginPath_rect_fill(
                this.x + collider.offsetX - collider.halfW,
                this.y + collider.offsetY - collider.halfH,
                collider.width,
                collider.height);
        }
        Global.g_ctx.globalAlpha = tmpAlpha;
        Global.g_ctx.strokeStyle = tmpStroke;
        Global.g_ctx.fillStyle = tmpFill;
        super.draw();
    }
}