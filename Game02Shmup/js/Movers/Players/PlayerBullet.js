// ES2015 module mode

import {Global} from '../../Global.js'
import {Collision} from '../Collision.js'
import {Mover} from '../Mover.js'

export class PlayerBullet extends Mover {
    constructor(x, y) {
        super(x, y, "./img/bullet1.png", -0, 0);
        this.moveX = Global.PLAYER_BULLET_SPEED_X;
        this.collisions = [new Collision(4, -8, 4), new Collision(8, -8, 4), new Collision(12, -8, 4)];
        this.attackPower = Global.PLAYER_BULLET_ATTACK_POWER;
    }

    move() {
        super.move();
        if (Global.CANVAS_SCREEN_WIDTH * 2 <= this.x) {
            this.hp = 0;
        }
    }
}