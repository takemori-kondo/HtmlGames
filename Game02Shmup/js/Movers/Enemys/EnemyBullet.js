// ES2015 module mode

import {Global} from '../../Global.js'
import {Collision} from '../Collision.js'
import {Mover} from '../Mover.js'

export class EnemyBullet extends Mover {
    constructor(x, y, theta) {
        super(x, y, "./img/bullet2.png", -0, 0);

        // 向きと速度から、1frame当たりの移動量を決定
        // r * cos(theta) = r * x/r = x
        // r * sin(theta) = r * y/r = y
        this.moveX = Global.ENEMY_BULLET_SPEED * Math.cos(theta);
        this.moveY = Global.ENEMY_BULLET_SPEED * Math.sin(theta);
        this.collisions = [new Collision(8, -8, 6)];
        this.attackPower = Global.PLAYER_BULLET_ATTACK_POWER;
    }

    move() {
        super.move();
        if (this.x <= -100) {
            this.hp = 0;
        }
    }
}