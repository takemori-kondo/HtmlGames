// ES2015 module mode

import {Global} from '../../Global.js'
import {CircleCollider} from '../CircleCollider.js'
import { ImgContainer } from '../imgContainer.js';
import { ImgContainerList } from '../ImgContainerList.js';
import {Mover} from '../Mover.js'

export class PlayerBullet extends Mover {
    static get PLAYER_BULLET_SPEED_X() { return 10; }
    static get PLAYER_BULLET_SPEED_Y() { return 4; }
    static get PLAYER_BULLET_ATTACK_POWER() { return 3; }

    constructor(x, y) {
        super(x, y, new ImgContainerList([new ImgContainer("./img/bullet1.png", 16, 16,  -0, 0)]));
        this.moveX = PlayerBullet.PLAYER_BULLET_SPEED_X;
        this.moveY = PlayerBullet.PLAYER_BULLET_SPEED_Y;
        this.colliders = [new CircleCollider(-4, 0, 4), new CircleCollider(0, 0, 4), new CircleCollider(4, 0, 4)];
        this.attackPower = PlayerBullet.PLAYER_BULLET_ATTACK_POWER;
    }

    move() {
        super.move();
        if (Global.IsOutOfScreen(this.x, this.y)) {
            this.hp = 0;
        }
    }
}