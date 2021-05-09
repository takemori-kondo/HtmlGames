// ES2015 module mode

import {Global} from '../../Global.js'
import {AabbCollider} from '../AabbCollider.js'
import { ImgContainerList } from '../ImgContainerList.js'
import {CircleCollider} from '../CircleCollider.js'
import { ImgContainer } from '../ImgContainer.js'
import {Mover} from '../Mover.js'
import {PlayerBullet} from './PlayerBullet.js'

export class Player extends Mover {

    static get PLAYER_SPEED_X() { return 3 };
    static get PLAYER_SPEED_Y() { return 8 };
    static get PLAYER_SHOT_RELOAD_TIME() { return 10; }
    static get PLAYER_IS_STANDING() {return 0; }
    static get PLAYER_IS_WALKING() {return 1; }
    static get PLAYER_IS_JUMPING() {return 2; }
    static get PLAYER_IS_FALLING() {return 3; }
    static get PLAYER_WALKING_ANIMATION_INTERVAL() {return 12; }
    static get PLAYER_STANDING_IMG_INDEX() { return 0; }
    static get PLAYER_JUMPING_IMG_INDEX() { return 1; }

    static get OFFSET_X_FOR_AIMING_TO_PLAYER() { return -2; }
    static get OFFSET_Y_FOR_AIMING_TO_PLAYER() { return 0; }

    constructor(x, y) {
        super(x, y, new ImgContainerList(
            [
                new ImgContainer("./img/player1.png", 64, 64, 0, 4),
                new ImgContainer("./img/player2.png", 64, 64, 0, 4)
            ]));
        this.colliders.push(new CircleCollider(-13, +11, 10));
        this.colliders.push(new CircleCollider(-7, +7, 10));
        this.colliders.push(new CircleCollider(+4, +9, 4));
        this.colliders.push(new CircleCollider(+10, +11, 3));
        this.colliders.push(new CircleCollider(+14, +10, 2));
        this.fieldColliders.push(new AabbCollider(-4, 0, 40, 32));
        this.isReloading = false;
        this.releadCounter = 0;
        this.isAerial = false;

        this.animationStatus = 0;
        this.walkingAnimationCounter = 0;
    }

    move() {
        // shooting move
        if (!this.isReloading && Global.g_inputKeyBuffer[Global.KEY_X]) {
            this.isReloading = true;
            this.releadCounter = Player.PLAYER_SHOT_RELOAD_TIME;
            this.currentCreateds = [new PlayerBullet(this.x, this.y)];
        }
        this.releadCounter--;
        if (this.releadCounter <= 0) {
            this.isReloading = false;
        }

        // walk & jump move
        if (Global.g_inputKeyBuffer[Global.KEY_LEFT_]) {
            this.moveX = -Player.PLAYER_SPEED_X;
        }
        if (Global.g_inputKeyBuffer[Global.KEY_RIGHT]) {
            this.moveX = +Player.PLAYER_SPEED_X;
        }
        if (!Global.g_inputKeyBuffer[Global.KEY_LEFT_] && !Global.g_inputKeyBuffer[Global.KEY_RIGHT]) {
            this.moveX = 0;
        }
        if (!this.isAerial && Global.g_inputKeyBuffer[Global.KEY_Z]) {
            this.moveY = Player.PLAYER_SPEED_Y;
        }
        this.moveY += Global.GRAVITY;
        
        // animation setting
        if (this.isAerial) {
            this.animationStatus = (this.animationStatus == Player.PLAYER_IS_JUMPING || 0 < this.moveY) ? Player.PLAYER_IS_JUMPING : Player.PLAYER_IS_FALLING;
        } else {
            this.animationStatus = this.moveX != 0 ? Player.PLAYER_IS_WALKING : Player.PLAYER_IS_STANDING;
        }
        if (this.animationStatus == Player.PLAYER_IS_WALKING) {
            this.walkingAnimationCounter--;
            if (this.walkingAnimationCounter <= 0) {
                this.walkingAnimationCounter = Player.PLAYER_WALKING_ANIMATION_INTERVAL;
                this.imgContainerList.currentImgIndex = this.imgContainerList.currentImgIndex == Player.PLAYER_STANDING_IMG_INDEX ?
                    Player.PLAYER_JUMPING_IMG_INDEX :
                    Player.PLAYER_STANDING_IMG_INDEX;
            }
        }
        else {
            this.walkingAnimationCounter = 0;
            switch (this.animationStatus) {
                case Player.PLAYER_IS_JUMPING:
                    this.imgContainerList.currentImgIndex = Player.PLAYER_JUMPING_IMG_INDEX;
                    break;
                case Player.PLAYER_IS_STANDING:
                case Player.PLAYER_IS_FALLING:
                default:
                    this.imgContainerList.currentImgIndex = Player.PLAYER_STANDING_IMG_INDEX;
                    break;
            }
        }
        super.move();

        // other setting after super.move()
        this.isAerial = true;
    }
}