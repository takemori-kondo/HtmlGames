// ES2015 module mode

import {Global} from '../Global.js'
import {Mover} from './Mover.js'

export class FrontEnd extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.feet = 0;
    }

    move() {
        super.move();
        this.feet += Global.FEET_UP;
        if (Global.g_highScore <= this.feet) {
            Global.g_highScore = this.feet;
        }
    }

    draw() {
        const lpadScore = ("     " + this.feet.toFixed(0)).slice(-5);
        const lpadHighS = ("     " + Global.g_highScore.toFixed(0)).slice(-5);
        Global.g_ctx.fillText("score    " + lpadScore + " feet", 500, Global.CANVAS_SCREEN_HEIGHT - 16);
        Global.g_ctx.fillText("highscore" + lpadHighS + " feet", 500, Global.CANVAS_SCREEN_HEIGHT - 4);
        Global.g_ctx.fillText("space  : jump", 4, Global.CANVAS_SCREEN_HEIGHT - 16);
        Global.g_ctx.fillText("<-, -> : move", 4, Global.CANVAS_SCREEN_HEIGHT - 4);
    }
}