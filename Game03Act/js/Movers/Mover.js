// ES2015 module mode

import {Global} from '../Global.js'

export class Mover {
    constructor(x, y, imgContainerList = null) {
        this.x = x;
        this.y = y;
        this.imgContainerList = imgContainerList; 
        this.colliders = [];
        this.fieldColliders = [];
        this.moveX = 0;
        this.moveY = 0;
        this.hp = 1;
        this.attackPower = 0;
        this.currentCreateds = [];
    }

    move() {
        this.x += this.moveX;
        this.y += this.moveY;
    }

    getCurrentCreateds() {
        return this.currentCreateds;
    }

    clearCurrentCreateds() {
        this.currentCreateds = [];
    }

    exists() {
        return 0 < this.hp;
    }

    draw() {
        try {
            if (this.imgContainerList != null && this.imgContainerList.isValidState) {
                let ic = this.imgContainerList.currentImgContainer;
                Global.g_ctx_drawImage(ic.img, this.x, this.y, ic.imgWidth, ic.imgHeight, ic.imgOffsetX, ic.imgOffsetY);
            }
            if (Global.IS_DEBUG) {
                Global.g_ctx_drawCircleColliders(this.x, this.y, this.colliders);
                Global.g_ctx_drawAabbColliders(this.x, this.y, this.fieldColliders);
            }
        } catch (e) {
            if (!Global.g_drawingErrorOccurred) {
                Global.g_drawingErrorOccurred = true;
                console.error(e);
                console.log(JSON.stringify(this));
            }
        }
    }
}