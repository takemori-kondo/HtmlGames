// ES2015 module mode

import {Global} from '../../Global.js'
import {Collision} from '../Collision.js'
import {Mover} from '../Mover.js'
import {PlayerBullet} from './PlayerBullet.js'

export class Player extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.collisions.push(new Collision(-24, -4, 4));
        this.collisions.push(new Collision(-16, -4, 4));
        this.collisions.push(new Collision(-8, -4, 4));
        this.collisions.push(new Collision(0, -4, 4));
        this.collisions.push(new Collision(8, -4, 4));
        this.collisions.push(new Collision(16, -4, 4));
        this.collisions.push(new Collision(24, -4, 4));
        this.isReloading = false;
        this.releadCount = 0;
    }

    move() {
        if (!this.isReloading && Global.g_inputKeyBuffer[Global.KEY_SPACE]) {
            this.isReloading = true;
            this.releadCount = Global.PLAYER_SHOT_RELOAD_TIME;
            this.currentCreateds = [new PlayerBullet(this.x, this.y)];
        }
        if (Global.g_inputKeyBuffer[Global.KEY_LEFT_]) {
            this.x -= Global.PLAYER_SPEED_X;
        }
        if (Global.g_inputKeyBuffer[Global.KEY_RIGHT]) {
            this.x += Global.PLAYER_SPEED_X;
        }
        if (Global.g_inputKeyBuffer[Global.KEY_DOWN_]) {
            this.y -= Global.PLAYER_SPEED_Y;
        }
        if (Global.g_inputKeyBuffer[Global.KEY_UP___]) {
            this.y += Global.PLAYER_SPEED_Y;
        }
        this.releadCount -= 1;
        if (this.releadCount <= 0) {
            this.isReloading = false;
        }
        super.move();
        if (this.x <= 0 + Global.PLAYER_LEFT_TOUCH_OFFSET) {
            this.x = 0 + Global.PLAYER_LEFT_TOUCH_OFFSET;
        }
        if (this.x >= Global.CANVAS_SCREEN_WIDTH - Global.PLAYER_RIGHT_TOUCH_OFFSET) {
            this.x = Global.CANVAS_SCREEN_WIDTH - Global.PLAYER_RIGHT_TOUCH_OFFSET;
        }
        if (this.y <= 0 + Global.PLAYER_BOTTOM_TOUCH_OFFSET) {
            this.y = 0 + Global.PLAYER_BOTTOM_TOUCH_OFFSET;
        }
        if (this.y >= Global.CANVAS_SCREEN_HEIGHT - Global.PLAYER_TOP_TOUCH_OFFSET) {
            this.y = Global.CANVAS_SCREEN_HEIGHT - Global.PLAYER_TOP_TOUCH_OFFSET;
        }
    }
}