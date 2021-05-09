// ES2015 module mode

import {Global} from '../../Global.js'
import {CircleCollider} from '../CircleCollider.js'
import { ImgContainer } from '../ImgContainer.js';
import { ImgContainerList } from '../ImgContainerList.js';
import {Mover} from '../Mover.js'

export class EnemyBullet extends Mover {

    static get ENEMY_BULLET_SPEED() { return 2; }

    constructor(x, y, theta) {
        super(x, y, new ImgContainerList([new ImgContainer("./img/bullet2.png", 16, 16, 0, 0)]));

        // 向きと速度から、1frame当たりの移動量を決定
        // r * cos(theta) = r * x/r = x
        // r * sin(theta) = r * y/r = y
        this.moveX = EnemyBullet.ENEMY_BULLET_SPEED * Math.cos(theta);
        this.moveY = EnemyBullet.ENEMY_BULLET_SPEED * Math.sin(theta);
        this.colliders = [new CircleCollider(0, 0, 6)];
        this.attackPower = 3;
    }

    move() {
        super.move();
        if (Global.IsOutOfScreen(this.x, this.y)) {
            this.hp = 0;
        }
    }
}