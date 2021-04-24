// ES2015 module mode

import {Global} from '../Global.js'
import {Mover} from './Mover.js'

export class LoopingBackGround extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY, moveX, moveY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.moveX = moveX;
        this.moveY = moveY;
    }

    move() {
        super.move();
        if (this.x <= -Global.CANVAS_SCREEN_WIDTH / 2) {
            this.x += Global.CANVAS_SCREEN_WIDTH * 2
        }
        if (this.x >= Global.CANVAS_SCREEN_WIDTH + Global.CANVAS_SCREEN_WIDTH / 2) {
            this.x -= Global.CANVAS_SCREEN_WIDTH * 2
        }
        if (this.y <= -Global.CANVAS_SCREEN_HEIGHT / 2) {
            this.y += Global.CANVAS_SCREEN_HEIGHT * 2
        }
        if (this.y >= Global.CANVAS_SCREEN_HEIGHT + Global.CANVAS_SCREEN_HEIGHT / 2) {
            this.y -= Global.CANVAS_SCREEN_HEIGHT * 2
        }
    }
}