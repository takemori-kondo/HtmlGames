// ES2015 module mode

import {Global} from '../Global.js'
import {Collision} from './Collision.js'
import {Mover} from './Mover.js'

export class Player extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.collisions.push(new Collision(-10, 0, 16));
        this.collisions.push(new Collision(+16, 0, 16));
        this.isJumping = false;
    }

    move() {
        if (!this.isJumping && Global.g_inputKeyBuffer[Global.KEY_SPACE]) {
            this.isJumping = true;
            this.moveY = Global.PLAYER_SPEED_Y;
        }
        if (Global.g_inputKeyBuffer[Global.KEY_LEFT_]) {
            this.x -= Global.PLAYER_SPEED_X;
        }
        if (Global.g_inputKeyBuffer[Global.KEY_RIGHT]) {
            this.x += Global.PLAYER_SPEED_X;
        }
        this.moveY += Global.GRAVITY;
        super.move();
        if (this.y <= Global.GROUND + Global.PLAYER_GROUND_TOUCH_OFFSET) {
            this.moveY = 0;
            this.y = Global.GROUND + Global.PLAYER_GROUND_TOUCH_OFFSET;
            this.isJumping = false;
        }
    }
}