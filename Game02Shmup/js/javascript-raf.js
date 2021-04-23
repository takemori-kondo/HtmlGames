// ES2015

"use strict";

const IS_DEBUG = true;
const FPS = 60;
const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 360;

const PLAYER_LEFT_TOUCH_OFFSET = 21;
const PLAYER_RIGHT_TOUCH_OFFSET = 21;
const PLAYER_BOTTOM_TOUCH_OFFSET = 42;
const PLAYER_TOP_TOUCH_OFFSET = 21;
const PLAYER_SPEED_X = 2;
const PLAYER_SPEED_Y = 2;
const PLAYER_SHOT_RELOAD_TIME = 10;

const PLAYER_BULLET_SPEED_X = 9;
const PLAYER_BULLET_ATTACK_POWER = 3;

const CREATE_ENEMY_INTERVAL_WIDTH = 40;
const CREATE_ENEMY_INTERVAL_MIN = 80;
const CREATE_ENEMY_INTERVAL_EVERY_REDUCE = 0.03;
const CREATE_ENEMY_POS_Y_WIDTH = 240;
const CREATE_ENEMY_POS_Y_MIN = 120;

const ENEMY_HELICOPTER_SPEED_X = -2;

const PLAYER_POS_X_OFFSET = 0;
const PLAYER_POS_Y_OFFSET = 50;
const ENEMY_BULLET_FIRE_INTERVAL_WIDTH = 30;
const ENEMY_BULLET_FIRE_INTERVAL_MIN = 140;
const ENEMY_BULLET_FIRE_INTERVAL_EVERY_REDUCE = 0.03;
const ENEMY_BULLET_SPEED = 6;

const FEET_UP = 2.0;
const FONT = '12px Consolas, monospace';
const GAME_OVER_FONT = '64px Consolas, monospace';
const GAME_OVER_SUB_FONT = '24px Consolas, monospace';

const KEY_SPACE = 32;
const KEY_Z = 90;
const KEY_X = 88;
const KEY_LEFT_ = 37;
const KEY_UP___ = 38;
const KEY_RIGHT = 39;
const KEY_DOWN_ = 40;
const KEY_ENTER = 13;

let g_highScore = 0;
let g_inputKeyBuffer = [];
let g_canvas = null;
let g_ctx = null;
document.onkeydown = (e) => g_inputKeyBuffer[e.keyCode] = true;
document.onkeyup = (e) => g_inputKeyBuffer[e.keyCode] = false;

class Collision {
    constructor(offsetX, offsetY, radius) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.radius = radius;
    }
}

class Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = imgFileName;
        this.imgOffsetX = imgOffsetX;
        this.imgOffsetY = imgOffsetY;
        this.collisions = [];
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
            g_ctx.drawImage(this.img, this.x + this.imgOffsetX, SCREEN_HEIGHT - this.y - this.imgOffsetY);
            if (IS_DEBUG) {
                const tmpAlpha = g_ctx.globalAlpha;
                const tmpStroke = g_ctx.strokeStyle;
                const tmpFill = g_ctx.fillStyle;
                g_ctx.globalAlpha = 0.5;
                g_ctx.strokeStyle = 'rgb(0, 128, 128)';
                g_ctx.fillStyle = 'rgb(0, 128, 128)';
                for (const collision of this.collisions) {
                    g_ctx.beginPath();
                    g_ctx.arc(this.x + collision.offsetX, SCREEN_HEIGHT - this.y - collision.offsetY, collision.radius, 0, Math.PI * 2, false);
                    g_ctx.fill();
                }
                g_ctx.globalAlpha = tmpAlpha;
                g_ctx.strokeStyle = tmpStroke;
                g_ctx.fillStyle = tmpFill;
            }
        } catch (e) {}
    }
}

class Player extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.collisions.push(new Collision(-24, -4, 4));
        this.collisions.push(new Collision(-16, -4, 4));
        this.collisions.push(new Collision(-8, -4, 4));
        this.collisions.push(new Collision(0, -4, 4));
        this.collisions.push(new Collision(8, -4, 4));
        this.collisions.push(new Collision(16, -4, 4));
        this.collisions.push(new Collision(24, -4, 4));
        this.isReloading = false;
        this.releadCount = 0;
    }

    move() {
        if (!this.isReloading && g_inputKeyBuffer[KEY_SPACE]) {
            this.isReloading = true;
            this.releadCount = PLAYER_SHOT_RELOAD_TIME;
            this.currentCreateds = [new PlayerBullet(this.x, this.y)];
        }
        if (g_inputKeyBuffer[KEY_LEFT_]) {
            this.x -= PLAYER_SPEED_X;
        }
        if (g_inputKeyBuffer[KEY_RIGHT]) {
            this.x += PLAYER_SPEED_X;
        }
        if (g_inputKeyBuffer[KEY_DOWN_]) {
            this.y -= PLAYER_SPEED_Y;
        }
        if (g_inputKeyBuffer[KEY_UP___]) {
            this.y += PLAYER_SPEED_Y;
        }
        this.releadCount -= 1;
        if (this.releadCount <= 0) {
            this.isReloading = false;
        }
        super.move();
        if (this.x <= 0 + PLAYER_LEFT_TOUCH_OFFSET) {
            this.x = 0 + PLAYER_LEFT_TOUCH_OFFSET;
        }
        if (this.x >= SCREEN_WIDTH - PLAYER_RIGHT_TOUCH_OFFSET) {
            this.x = SCREEN_WIDTH - PLAYER_RIGHT_TOUCH_OFFSET;
        }
        if (this.y <= 0 + PLAYER_BOTTOM_TOUCH_OFFSET) {
            this.y = 0 + PLAYER_BOTTOM_TOUCH_OFFSET;
        }
        if (this.y >= SCREEN_HEIGHT - PLAYER_TOP_TOUCH_OFFSET) {
            this.y = SCREEN_HEIGHT - PLAYER_TOP_TOUCH_OFFSET;
        }
    }
}

class PlayerBullet extends Mover {
    constructor(x, y) {
        super(x, y, "./img/bullet1.png", -0, 0);
        this.moveX = PLAYER_BULLET_SPEED_X;
        this.collisions = [new Collision(4, -8, 4), new Collision(8, -8, 4), new Collision(12, -8, 4)];
        this.attackPower = PLAYER_BULLET_ATTACK_POWER;
    }
}

class EnemyHelicopter extends Mover {
    constructor(x, y, playerRef, fireIntervalOffset) {
        super(x, y, "./img/helicopter.png", -0, 0);
        this.moveX = ENEMY_HELICOPTER_SPEED_X;
        this.collisions = [new Collision(22, -34, 20), new Collision(12, -22, 12), new Collision(34, -22, 12), new Collision(56, -20, 10)];
        this.attackPower = PLAYER_BULLET_ATTACK_POWER;
        this.hp = 10;
        this.playerRef = playerRef;
        this.fireIntervalCounter = 0;
        this.fireIntervalOffset = fireIntervalOffset;
        this.fireInterval = Math.random() * ENEMY_BULLET_FIRE_INTERVAL_WIDTH + ENEMY_BULLET_FIRE_INTERVAL_MIN - this.fireIntervalOffset;
    }

    move() {
        super.move();
        this.fireIntervalCounter++;
        if (this.fireInterval < this.fireIntervalCounter) {
            this.fireIntervalCounter = 0;
            this.fireInterval = Math.random() * ENEMY_BULLET_FIRE_INTERVAL_WIDTH + ENEMY_BULLET_FIRE_INTERVAL_MIN - this.fireIntervalOffset;

            // 距離から逆三角関数で向き角を算出
            const dx = this.playerRef.x + PLAYER_POS_X_OFFSET - this.x;
            const dy = this.playerRef.y + PLAYER_POS_Y_OFFSET - this.y;
            const theta = Math.atan2(dy, dx);
            if (-50 < this.x) {
                this.currentCreateds = [new EnemyBullet(this.x, this.y - 40, theta)];
            }
        }
    }
}

class EnemyBullet extends Mover {
    constructor(x, y, theta) {
        super(x, y, "./img/bullet2.png", -0, 0);

        // 向きと速度から、1frame当たりの移動量を決定
        // r * cos(theta) = r * x/r = x
        // r * sin(theta) = r * y/r = y        
        this.moveX = ENEMY_BULLET_SPEED * Math.cos(theta);
        this.moveY = ENEMY_BULLET_SPEED * Math.sin(theta);
        this.collisions = [new Collision(8, -8, 6)];
        this.attackPower = PLAYER_BULLET_ATTACK_POWER;
    }
}

class FrontEnd extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.feet = 0;
    }

    move() {
        super.move();
        this.feet += FEET_UP;
        if (g_highScore <= this.feet) {
            g_highScore = this.feet;
        }
    }

    draw() {
        const lpadScore = ("     " + this.feet.toFixed(0)).slice(-5);
        const lpadHighS = ("     " + g_highScore.toFixed(0)).slice(-5);
        g_ctx.fillText("score    " + lpadScore + " feet", 500, SCREEN_HEIGHT - 16);
        g_ctx.fillText("highscore" + lpadHighS + " feet", 500, SCREEN_HEIGHT - 4);
        g_ctx.fillText("space            : shot", 4, SCREEN_HEIGHT - 16);
        g_ctx.fillText("<-, ->, up, down : move", 4, SCREEN_HEIGHT - 4);
    }
}

class StageScene {
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

        this.player = new Player(100, 100 + PLAYER_BOTTOM_TOUCH_OFFSET, "./img/player.png", -32, 30);
        this.frontEnd = new FrontEnd(0, 0, "", 0, 0);
    }

    update() {
        if (this.isPlayerCollided) {
            if (g_inputKeyBuffer[KEY_ENTER]) {
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
            this.fireIntervalOffset += ENEMY_BULLET_FIRE_INTERVAL_EVERY_REDUCE;

            // Enemy Create Process
            this.nextEnemyCreateIntervalCounter++;
            this.createIntervalReduceOffset += CREATE_ENEMY_INTERVAL_EVERY_REDUCE;
            if (this.nextEnemyCreateInterval < this.nextEnemyCreateIntervalCounter) {
                this.nextEnemyCreateIntervalCounter = 0;
                this.nextEnemyCreateInterval = Math.random() * CREATE_ENEMY_INTERVAL_WIDTH + CREATE_ENEMY_INTERVAL_MIN - this.createIntervalReduceOffset;
                this.enemyList.push(new EnemyHelicopter(700, Math.random() * CREATE_ENEMY_POS_Y_WIDTH + CREATE_ENEMY_POS_Y_MIN, this.player, this.fireIntervalOffset));
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
        g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
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
            g_ctx.font = GAME_OVER_SUB_FONT;
            g_ctx.fillText("Enter : restart", 210, 230);
            g_ctx.font = GAME_OVER_FONT;
            g_ctx.fillText("GAME OVER", 150, 200);
            g_ctx.font = FONT;
        }
    }
}

function boot(canvasId) {

    g_canvas = document.getElementById(canvasId);
    g_ctx = g_canvas.getContext('2d');
    g_ctx.font = FONT;
    const raf = window.requestAnimationFrame;
    const stage = new StageScene();
    stage.restart();
    const loop = () => {
        stage.update();
        raf(loop);
    };
    raf(loop);
}