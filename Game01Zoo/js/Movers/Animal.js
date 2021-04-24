// ES2015 module mode

import {Global} from '../Global.js'
import {Mover} from './Mover.js'

export class Animal extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY, moveX, moveY, collisions) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.moveX = moveX;
        this.moveY = moveY;
        this.collisions = collisions;
    }

    move() {
        super.move();
        if (this.x <= -Global.CANVAS_SCREEN_WIDTH / 2) {
            this.x += Global.ZOO_LOOP;
        }
    }
}