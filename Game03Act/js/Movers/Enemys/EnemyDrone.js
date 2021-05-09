// ES2015 module mode

import {CircleCollider} from '../CircleCollider.js'
import {Mover} from '../Mover.js'
import {EnemyBullet} from './EnemyBullet.js'
import {Player} from '../Players/Player.js'
import { ImgContainerList } from '../ImgContainerList.js';
import { ImgContainer } from '../imgContainer.js';
import { Global } from '../../Global.js';

export class EnemyDrone extends Mover {

    static get ENEMY_BULLET_FIRE_INTERVAL_WIDTH() { return 30; }
    static get ENEMY_BULLET_FIRE_INTERVAL_MIN() { return 140; }
    static get ENEMY_MOVE_SPEED() { return -1.2; }

    constructor(x, y, playerRef, fireIntervalReduceOffset) {
        super(x, y, new ImgContainerList([new ImgContainer("./img/drone.png", 64, 64, 0, 0)]));
        this.moveX = EnemyDrone.ENEMY_MOVE_SPEED;
        this.colliders = [new CircleCollider(0, -16, 6), new CircleCollider(0, -8, 4), new CircleCollider(0, -2, 4), new CircleCollider(0, 8, 10), new CircleCollider(-16, 8, 8), new CircleCollider(+16, 8, 8), new CircleCollider(-28, 19, 3), new CircleCollider(+28, 19, 3), new CircleCollider(-22, 19, 4), new CircleCollider(+22, 19, 4)];
        this.attackPower = 3;
        this.hp = 5;
        this.playerRef = playerRef;
        this.fireIntervalCounter = 0;
        this.fireIntervalReduceOffset = fireIntervalReduceOffset;
        this.fireInterval = Math.random() * EnemyDrone.ENEMY_BULLET_FIRE_INTERVAL_WIDTH + EnemyDrone.ENEMY_BULLET_FIRE_INTERVAL_MIN - this.fireIntervalReduceOffset;
    }

    move() {
        super.move();
        this.fireIntervalCounter++;
        if (this.fireInterval < this.fireIntervalCounter) {
            this.fireIntervalCounter = 0;
            this.fireInterval = Math.random() * EnemyDrone.ENEMY_BULLET_FIRE_INTERVAL_WIDTH + EnemyDrone.ENEMY_BULLET_FIRE_INTERVAL_MIN - this.fireIntervalReduceOffset;

            // 距離から逆三角関数で向き角を算出
            const dx = this.playerRef.x + Player.OFFSET_X_FOR_AIMING_TO_PLAYER - this.x;
            const dy = this.playerRef.y + Player.OFFSET_Y_FOR_AIMING_TO_PLAYER - this.y;
            const theta = Math.atan2(dy, dx);
            if (Global.g_cameraPosX + 64 < this.x) {
                this.currentCreateds = [new EnemyBullet(this.x, this.y, theta)];
            }
        }
        if (Global.IsOutOfScreen(this.x, this.y)) {
            this.hp = 0;
        }
    }
}