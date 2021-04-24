// ES2015 module mode

import {Global} from '../../Global.js'
import {Collision} from '../Collision.js'
import {Mover} from '../Mover.js'
import {EnemyBullet} from './EnemyBullet.js'

export class EnemyHelicopter extends Mover {
    constructor(x, y, playerRef, fireIntervalOffset) {
        super(x, y, "./img/helicopter.png", -0, 0);
        this.moveX = Global.ENEMY_HELICOPTER_SPEED_X;
        this.collisions = [new Collision(22, -34, 20), new Collision(12, -22, 12), new Collision(34, -22, 12), new Collision(56, -20, 10)];
        this.attackPower = Global.PLAYER_BULLET_ATTACK_POWER;
        this.hp = 10;
        this.playerRef = playerRef;
        this.fireIntervalCounter = 0;
        this.fireIntervalOffset = fireIntervalOffset;
        this.fireInterval = Math.random() * Global.ENEMY_BULLET_FIRE_INTERVAL_WIDTH + Global.ENEMY_BULLET_FIRE_INTERVAL_MIN - this.fireIntervalOffset;
    }

    move() {
        super.move();
        this.fireIntervalCounter++;
        if (this.fireInterval < this.fireIntervalCounter) {
            this.fireIntervalCounter = 0;
            this.fireInterval = Math.random() * Global.ENEMY_BULLET_FIRE_INTERVAL_WIDTH + Global.ENEMY_BULLET_FIRE_INTERVAL_MIN - this.fireIntervalOffset;

            // 距離から逆三角関数で向き角を算出
            const dx = this.playerRef.x + Global.PLAYER_POS_X_OFFSET - this.x;
            const dy = this.playerRef.y + Global.PLAYER_POS_Y_OFFSET - this.y;
            const theta = Math.atan2(dy, dx);
            if (-50 < this.x) {
                this.currentCreateds = [new EnemyBullet(this.x, this.y - 40, theta)];
            }
        }
    }
}