// ES2015 module mode

import {Global} from './Global.js'
import {Player} from './Movers/Players/Player.js'
import {FrontEnd} from './Movers/FrontEnd.js'
import {CircleCollider} from './Movers/CircleCollider.js'
import {AabbCollider} from './Movers/AabbCollider.js'
import {Block} from './Movers/Blocks/Block.js'
import { EnemyDrone } from './Movers/Enemys/EnemyDrone.js'
// import {EnemyHelicopter} from './Movers/Enemys/EnemyHelicopter.js'


export class StageScene {

    initialize() {
        this.player = null;
        this.playerBulletList = [];
        this.enemyList = [];
        this.enemyBulletList = [];
        this.blockList = [];
        this.frontEnd = null;

        this.playerIsDead = false;

        this.nextBlockCreateInterval = 0;
        this.nextBlockCreateIntervalCounter = 0;

        this.nextEnemyCreateInterval = 0;
        this.nextEnemyCreateIntervalCounter = 0;
        this.createIntervalReduceOffset = 0;
        this.fireIntervalReduceOffset = 0;

        Global.g_cameraPosX = 0;
        Global.g_cameraPosY = 0;
    }

    constructor() {
        this.initialize();
    }

    restart() {
        this.initialize();
        this.player = new Player(180, 180);
        this.frontEnd = new FrontEnd(0, 0);
        this.blockList.push(new Block(320, Global.CREATE_BLOCK_POS_Y_MIN, 75, 75, 75, 640, 32));
    }

    update() {
        if (this.playerIsDead) {
            if (Global.g_inputKeyBuffer[Global.KEY_ENTER]) {
                this.restart();
            }
        } else {
            // Move Process
            this.player.move();
            for (const mover of this.playerBulletList) { mover.move(); }
            for (const mover of this.enemyList) { mover.move(); }
            for (const mover of this.enemyBulletList) { mover.move(); }
            for (const mover of this.blockList) { mover.move(); }
            this.frontEnd.move();
            Global.g_cameraPosX += 1.4;

            // Create Block
            this.nextBlockCreateIntervalCounter++;
            if (this.nextBlockCreateInterval < this.nextBlockCreateIntervalCounter) {
                this.nextBlockCreateIntervalCounter = 0;
                this.nextBlockCreateInterval = Math.random() * Global.CREATE_BLOCK_INTERVAL_WIDTH + Global.CREATE_BLOCK_INTERVAL_MIN;
                this.blockList.push(new Block(Global.CANVAS_SCREEN_WIDTH + Global.g_cameraPosX + 32, Math.random() * Global.CREATE_BLOCK_POS_Y_WIDTH + Global.CREATE_BLOCK_POS_Y_MIN));
            }

            // Create Enemy
            this.createIntervalReduceOffset += Global.CREATE_ENEMY_INTERVAL_EVERY_REDUCE;
            this.fireIntervalReduceOffset += Global.ENEMY_BULLET_FIRE_INTERVAL_EVERY_REDUCE;
            this.nextEnemyCreateIntervalCounter++;
            if (this.nextEnemyCreateInterval < this.nextEnemyCreateIntervalCounter) {
                this.nextEnemyCreateIntervalCounter = 0;
                this.nextEnemyCreateInterval = Math.random() * Global.CREATE_ENEMY_INTERVAL_WIDTH + Global.CREATE_ENEMY_INTERVAL_MIN - this.createIntervalReduceOffset;
                this.enemyList.push(new EnemyDrone(Global.CANVAS_SCREEN_WIDTH + Global.g_cameraPosX + 64, Math.random() * Global.CREATE_ENEMY_POS_Y_WIDTH + Global.CREATE_ENEMY_POS_Y_MIN, this.player, this.fireIntervalReduceOffset));
            }

            // Out of screen
            if (this.player.y <= 0 || this.player.x < Global.g_cameraPosX - 32) {
                this.playerIsDead = true;
            }
            

            // Add Createds Process
            {
                let createds = this.player.getCurrentCreateds();
                this.player.clearCurrentCreateds();
                if (createds != null) {
                    for (let i = 0; i < createds.length; i++) {
                        this.playerBulletList.push(createds[i]);
                    }
                }
            }
            for (const enemy of this.enemyList) {
                let createds = enemy.getCurrentCreateds();
                enemy.clearCurrentCreateds();
                if (createds != null) {
                    for (let i = 0; i < createds.length; i++) {
                        this.enemyBulletList.push(createds[i]);
                    }
                }
            }

            // Field Collision Process
            if (this.player.fieldColliders) {
                for (const block of this.blockList) {
                    for (const blockFieldCol of block.fieldColliders) {
                        for (const playerFieldCol of this.player.fieldColliders) {
                            if (AabbCollider.collides(this.player.x, this.player.y, playerFieldCol, block.x, block.y, blockFieldCol)) {
                                const adjustX = AabbCollider.calculateXAdjustment(this.player.x, playerFieldCol, block.x, blockFieldCol);
                                const adjustY = AabbCollider.calculateYAdjustment(this.player.y, playerFieldCol, block.y, blockFieldCol);
                                if (Math.abs(adjustX) < Math.abs(adjustY) - Global.GRAVITY) {
                                    this.player.x += adjustX;
                                }
                                else {
                                    const beforeAdjustPosY = this.player.y;
                                    this.player.y += adjustY;
                                    if (Math.sign(this.player.moveY) != Math.sign(adjustY)) {
                                        this.player.moveY = 0;
                                    }
                                    if (beforeAdjustPosY <= this.player.y) {
                                        this.player.isAerial = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Hit Collision Process
            let currentCollided = false;
            for (const enemy of this.enemyList) {
                for (const enemyCol of enemy.colliders) {
                    for (const playerCol of this.player.colliders) {
                        if (CircleCollider.collides(this.player.x, this.player.y, playerCol, enemy.x, enemy.y, enemyCol)) {
                            currentCollided = true;
                        }
                    }
                }
            }
            
            for (const enemyBullet of this.enemyBulletList) {
                for (const enemyBulletCol of enemyBullet.colliders) {
                    for (const playerCol of this.player.colliders) {
                        if (CircleCollider.collides(this.player.x, this.player.y, playerCol, enemyBullet.x, enemyBullet.y, enemyBulletCol)) {
                            currentCollided = true;
                        }
                    }
                }
            }

            if (currentCollided) {
                this.playerIsDead = true;
            }

            for (const enemy of this.enemyList) {
                for (const playerBullet of this.playerBulletList) {
                    let colllidedForTwoObject = false;
                    for (const enemyCol of enemy.colliders) {
                        for (const playerBulletCol of playerBullet.colliders) {
                            const dx = (playerBullet.x + playerBulletCol.offsetX) - (enemy.x + enemyCol.offsetX);
                            const dy = (playerBullet.y + playerBulletCol.offsetY) - (enemy.y + enemyCol.offsetY);
                            const distanceSquare = dx * dx + dy * dy;
                            const radiusSquare = (playerBulletCol.radius + enemyCol.radius) * (playerBulletCol.radius + enemyCol.radius);
                            if (distanceSquare <= radiusSquare) {
                                colllidedForTwoObject = true;
                            }
                            if (colllidedForTwoObject) {
                                break;
                            }
                        }
                        if (colllidedForTwoObject) {
                            break;
                        }
                    }
                    if (colllidedForTwoObject) {
                        enemy.hp -= playerBullet.attackPower;
                        playerBullet.hp = 0;
                    }
                }
            }

            // Remove Process
            for (var i = 0; i < this.playerBulletList.length; i++) {
                if (!this.playerBulletList[i].exists()) {
                    this.playerBulletList.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < this.enemyList.length; i++) {
                if (!this.enemyList[i].exists()) {
                    this.enemyList.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < this.enemyBulletList.length; i++) {
                if (!this.enemyBulletList[i].exists()) {
                    this.enemyBulletList.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < this.blockList.length; i++) {
                if (!this.blockList[i].exists()) {
                    this.blockList.splice(i, 1);
                    i--;
                }
            }
        }

        // Draw Process
        Global.g_ctx.clearRect(0, 0, Global.CANVAS_SCREEN_WIDTH, Global.CANVAS_SCREEN_HEIGHT);
        this.player.draw();
        for (const mover of this.playerBulletList) { mover.draw(); }
        for (const mover of this.enemyList) { mover.draw(); }
        for (const mover of this.enemyBulletList) { mover.draw(); }
        for (const mover of this.blockList) { mover.draw(); }
        this.frontEnd.draw();
        if (this.playerIsDead) {
            Global.g_ctx.font = Global.GAME_OVER_SUB_FONT;
            Global.g_ctx.fillText("Enter : restart", 210, 230);
            Global.g_ctx.font = Global.GAME_OVER_FONT;
            Global.g_ctx.fillText("GAME OVER", 150, 200);
            Global.g_ctx.font = Global.DEFAULT_FONT;
        }
    }
}