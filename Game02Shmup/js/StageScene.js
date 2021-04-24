// ES2015 module mode

import {Global} from './Global.js'
import {Player} from './Movers/Players/Player.js'
import {FrontEnd} from './Movers/FrontEnd.js'
import {EnemyHelicopter} from './Movers/Enemys/EnemyHelicopter.js'

export class StageScene {
    constructor() {
        this.player = null;
        this.playerBulletList = [];
        this.enemyList = [];
        this.enemyBulletList = [];
        this.frontEnd = null;
        this.isPlayerCollided = false;
        this.nextInterval = 0;
        this.nextEnemyCreateIntervalCounter = 0;
        
        this.createIntervalReduceOffset = 0;
        this.fireIntervalOffset = 0;
    }

    restart() {
        this.player = null;
        this.playerBulletList = [];
        this.enemyList = [];
        this.enemyBulletList = [];
        this.frontEnd = null;
        this.isPlayerCollided = false;
        this.nextEnemyCreateInterval = 0;
        this.nextEnemyCreateIntervalCounter = 0;
        this.createIntervalReduceOffset = 0;
        this.fireIntervalOffset = 0;

        this.player = new Player(100, 100 + Global.PLAYER_BOTTOM_TOUCH_OFFSET, "./img/player.png", -32, 30);
        this.frontEnd = new FrontEnd(0, 0, "", 0, 0);
    }

    update() {
        if (this.isPlayerCollided) {
            if (Global.g_inputKeyBuffer[Global.KEY_ENTER]) {
                this.restart();
            }
        } else {
            // Move Process
            this.player.move();
            this.frontEnd.move();
            for (const mover of this.playerBulletList) {
                mover.move();
            }
            for (const mover of this.enemyList) {
                mover.move();
            }
            for (const mover of this.enemyBulletList) {
                mover.move();
            }
            this.fireIntervalOffset += Global.ENEMY_BULLET_FIRE_INTERVAL_EVERY_REDUCE;

            // Enemy Create Process
            this.nextEnemyCreateIntervalCounter++;
            this.createIntervalReduceOffset += Global.CREATE_ENEMY_INTERVAL_EVERY_REDUCE;
            if (this.nextEnemyCreateInterval < this.nextEnemyCreateIntervalCounter) {
                this.nextEnemyCreateIntervalCounter = 0;
                this.nextEnemyCreateInterval = Math.random() * Global.CREATE_ENEMY_INTERVAL_WIDTH + Global.CREATE_ENEMY_INTERVAL_MIN - this.createIntervalReduceOffset;
                this.enemyList.push(new EnemyHelicopter(700, Math.random() * Global.CREATE_ENEMY_POS_Y_WIDTH + Global.CREATE_ENEMY_POS_Y_MIN, this.player, this.fireIntervalOffset));
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

            // Collision Process
            let currentCollided = false;
            for (const enemy of this.enemyList) {
                for (const enemyCol of enemy.collisions) {
                    for (const playerCol of this.player.collisions) {
                        const dx = (this.player.x + playerCol.offsetX) - (enemy.x + enemyCol.offsetX);
                        const dy = (this.player.y + playerCol.offsetY) - (enemy.y + enemyCol.offsetY);
                        const distanceSquare = dx * dx + dy * dy;
                        const radiusSquare = (playerCol.radius + enemyCol.radius) * (playerCol.radius + enemyCol.radius);
                        if (distanceSquare <= radiusSquare) {
                            currentCollided = true;
                        }
                    }
                }
            }
            
            for (const enemyBullet of this.enemyBulletList) {
                for (const enemyBulletCol of enemyBullet.collisions) {
                    for (const playerCol of this.player.collisions) {
                        const dx = (this.player.x + playerCol.offsetX) - (enemyBullet.x + enemyBulletCol.offsetX);
                        const dy = (this.player.y + playerCol.offsetY) - (enemyBullet.y + enemyBulletCol.offsetY);
                        const distanceSquare = dx * dx + dy * dy;
                        const radiusSquare = (playerCol.radius + enemyBulletCol.radius) * (playerCol.radius + enemyBulletCol.radius);
                        if (distanceSquare <= radiusSquare) {
                            currentCollided = true;
                        }
                    }
                }
            }
            
            this.isPlayerCollided = currentCollided;

            for (const enemy of this.enemyList) {
                for (const playerBullet of this.playerBulletList) {
                    let colllidedForTwoObject = false;
                    for (const enemyCol of enemy.collisions) {
                        for (const playerBulletCol of playerBullet.collisions) {
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
                if (this.playerBulletList[i].hp <= 0) {
                    this.playerBulletList.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < this.enemyList.length; i++) {
                if (this.enemyList[i].hp <= 0) {
                    this.enemyList.splice(i, 1);
                    i--;
                }
            }
            
            for (let i = 0; i < this.enemyBulletList.length; i++) {
                if (this.enemyBulletList[i].hp <= 0) {
                    this.enemyBulletList.splice(i, 1);
                    i--;
                }
            }
        }

        // Draw Process
        Global.g_ctx.clearRect(0, 0, Global.CANVAS_SCREEN_WIDTH, Global.CANVAS_SCREEN_HEIGHT);
        this.player.draw();
        this.frontEnd.draw();
        for (const mover of this.playerBulletList) {
            mover.draw();
        }
        for (const mover of this.enemyList) {
            mover.draw();
        }
        console.log(this.enemyBulletList.length)
        for (const mover of this.enemyBulletList) {
            mover.draw();
        }
        if (this.isPlayerCollided) {
            Global.g_ctx.font = Global.GAME_OVER_SUB_FONT;
            Global.g_ctx.fillText("Enter : restart", 210, 230);
            Global.g_ctx.font = Global.GAME_OVER_FONT;
            Global.g_ctx.fillText("GAME OVER", 150, 200);
            Global.g_ctx.font = Global.DEFAULT_FONT;
        }
    }
}