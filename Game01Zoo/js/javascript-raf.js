// ES2015

"use strict";

// debug mode?
const IS_DEBUG = false;

// key constants
const KEY_SPACE = 32;
// const KEY_Z = 90;
// const KEY_X = 88;
const KEY_LEFT_ = 37;
// const KEY_UP___ = 38;
const KEY_RIGHT = 39;
// const KEY_DOWN_ = 40;
const KEY_ENTER = 13;

// canvas settings
const CANVAS_SCREEN_WIDTH = 640;
const CANVAS_SCREEN_HEIGHT = 360;
const CANVAS_CONTEXT_TYPE = '2d';
const DEFAULT_FONT = '12px Consolas, monospace';

// game settings
const GROUND = 50;
const PLAYER_GROUND_TOUCH_OFFSET = 21;
const PLAYER_SPEED_X = 2;
const PLAYER_SPEED_Y = 9;
const GRAVITY = -0.3;
const ZOO_LOOP = 11000;
const FEET_UP = 0.6;
const GAME_OVER_FONT = '64px Consolas, monospace';
const GAME_OVER_SUB_FONT = '24px Consolas, monospace';

// system & input parameters
let g_ctx = null;
let g_inputKeyBuffer = [];
document.onkeydown = (e) => g_inputKeyBuffer[e.keyCode] = true;
document.onkeyup = (e) => g_inputKeyBuffer[e.keyCode] = false;
let drawingErrorOccurred = false;

// game parameters
let g_highScore = 0;

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
    }

    move() {
        this.x += this.moveX;
        this.y += this.moveY;
    }

    draw() {
        try {
            g_ctx.drawImage(this.img, this.x + this.imgOffsetX, CANVAS_SCREEN_HEIGHT - this.y - this.imgOffsetY);
            if (IS_DEBUG) {
                const tmpAlpha = g_ctx.globalAlpha;
                const tmpStroke = g_ctx.strokeStyle;
                const tmpFill = g_ctx.fillStyle;
                g_ctx.globalAlpha = 0.5;
                g_ctx.strokeStyle = 'rgb(0, 128, 128)';
                g_ctx.fillStyle = 'rgb(0, 128, 128)';
                for (const collision of this.collisions) {
                    g_ctx.beginPath();
                    g_ctx.arc(this.x + collision.offsetX, CANVAS_SCREEN_HEIGHT - this.y - collision.offsetY, collision.radius, 0, Math.PI*2, false);
                    g_ctx.fill();
                }
                g_ctx.globalAlpha = tmpAlpha;
                g_ctx.strokeStyle = tmpStroke;
                g_ctx.fillStyle = tmpFill;
            }
        } catch (e) {
            if (!drawingErrorOccurred) {
                drawingErrorOccurred = true;
                console.error(e);
                console.log(JSON.stringify(this));
            }
        }
    }
}

class Player extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.collisions.push(new Collision(-10, 0, 16));
        this.collisions.push(new Collision(+16, 0, 16));
        this.isJumping = false;
    }

    move() {
        if (!this.isJumping && g_inputKeyBuffer[KEY_SPACE]) {
            this.isJumping = true;
            this.moveY = PLAYER_SPEED_Y;
        }
        if (g_inputKeyBuffer[KEY_LEFT_]) {
            this.x -= PLAYER_SPEED_X;
        }
        if (g_inputKeyBuffer[KEY_RIGHT]) {
            this.x += PLAYER_SPEED_X;
        }
        this.moveY += GRAVITY;
        super.move();
        if (this.y <= GROUND + PLAYER_GROUND_TOUCH_OFFSET) {
            this.moveY = 0;
            this.y = GROUND + PLAYER_GROUND_TOUCH_OFFSET;
            this.isJumping = false;
        }
    }
}

class Ground extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
    }

    draw() {
        g_ctx.beginPath();
        g_ctx.moveTo(this.x, CANVAS_SCREEN_HEIGHT - this.y);
        g_ctx.lineTo(this.x + CANVAS_SCREEN_WIDTH, CANVAS_SCREEN_HEIGHT - this.y);
        g_ctx.closePath();
        g_ctx.stroke();
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
        g_ctx.fillText("score    " + lpadScore + " feet", 500, CANVAS_SCREEN_HEIGHT - 16);
        g_ctx.fillText("highscore" + lpadHighS + " feet", 500, CANVAS_SCREEN_HEIGHT - 4);
        g_ctx.fillText("space  : jump", 4, CANVAS_SCREEN_HEIGHT - 16);
        g_ctx.fillText("<-, -> : move", 4, CANVAS_SCREEN_HEIGHT - 4);
    }
}

class LoopingBackGround extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY, moveX, moveY) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.moveX = moveX;
        this.moveY = moveY;
    }

    move() {
        super.move();
        if (this.x <= -CANVAS_SCREEN_WIDTH / 2) {
            this.x += CANVAS_SCREEN_WIDTH * 2
        }
        if (this.x >= CANVAS_SCREEN_WIDTH + CANVAS_SCREEN_WIDTH / 2) {
            this.x -= CANVAS_SCREEN_WIDTH * 2
        }
        if (this.y <= -CANVAS_SCREEN_HEIGHT / 2) {
            this.y += CANVAS_SCREEN_HEIGHT * 2
        }
        if (this.y >= CANVAS_SCREEN_HEIGHT + CANVAS_SCREEN_HEIGHT / 2) {
            this.y -= CANVAS_SCREEN_HEIGHT * 2
        }
    }
}

class Animal extends Mover {
    constructor(x, y, imgFileName, imgOffsetX, imgOffsetY, moveX, moveY, collisions) {
        super(x, y, imgFileName, imgOffsetX, imgOffsetY);
        this.moveX = moveX;
        this.moveY = moveY;
        this.collisions = collisions;
    }

    move() {
        super.move();
        if (this.x <= -CANVAS_SCREEN_WIDTH / 2) {
            this.x += ZOO_LOOP
        }
    }
}

class Lion extends Animal {
    constructor(x, y) {
        super(x, y, "./img/lion.png", -20, 54, -3, 0,
            [new Collision(0, 28, 14), new Collision(16, 8, 8), new Collision(32, 8, 8)]);
    }
}

class Ox extends Animal {
    constructor(x, y) {
        super(x, y, "./img/ox.png", -8, 54, -3, 0,
            [new Collision(0, 20, 6), new Collision(20, 18, 16), new Collision(35, 18, 14)]);
    }
}

class Elephant extends Animal {
    constructor(x, y) {
        super(x, y, "./img/elephant.png", -4, 90, -3, 0,
            [new Collision(0, 10, 2), new Collision(6, 12, 4), new Collision(44, 14, 36), new Collision(54, 50, 12), new Collision(80, 40, 20)
                , new Collision(106, 46, 16), new Collision(104, 66, 4)]);
    }
}

class Giraffe extends Animal {
    constructor(x, y) {
        super(x, y, "./img/giraffe.png", -24, 116, -3, 0,
            [new Collision(0, 96, 4), new Collision(8, 102, 6)
                , new Collision(14, 94, 4), new Collision(18, 86, 5), new Collision(24, 78, 6), new Collision(32, 66, 8)
                , new Collision(46, 54, 12), new Collision(60, 38, 20), new Collision(58, 12, 24)]);
    }
}

class Hippo extends Animal {
    constructor(x, y) {
        super(x, y, "./img/hippo.png", -12, 54, -3, 0,
            [new Collision(0, 28, 14), new Collision(20, 18, 16), new Collision(32, 16, 18)]);
    }
}

class StageScene {
    constructor() {
        this.player = null;
        this.ground = null;
        this.frontEnd = null;
        this.bgList = [];
        this.animalList = [];
        this.isCollided = false;
    }

    restart() {
        this.player = null;
        this.ground = null;
        this.frontEnd = null;
        this.bgList = [];
        this.animalList = [];
        this.isCollided = false;
        this.player = new Player(100, GROUND + PLAYER_GROUND_TOUCH_OFFSET, "./img/4wd.png", -32, 30);
        this.ground = new Ground(0, GROUND, "", 0, 0);
        this.frontEnd = new FrontEnd(0, 0, "", 0, 0);
        this.bgList.push(new LoopingBackGround(80, 350, "./img/cloud.png", 0, 0, -2, 0));
        this.bgList.push(new LoopingBackGround(350, 340, "./img/cloud.png", 0, 0, -2, 0));
        this.bgList.push(new LoopingBackGround(420, 350, "./img/cloud.png", 0, 0, -2, 0));
        this.bgList.push(new LoopingBackGround(720, 350, "./img/cloud.png", 0, 0, -2, 0));
        this.bgList.push(new LoopingBackGround(960, 360, "./img/cloud.png", 0, 0, -2, 0));
        this.bgList.push(new LoopingBackGround(100, 260, "./img/mini-cloud.png", 0, 0, -1, 0));
        this.bgList.push(new LoopingBackGround(280, 250, "./img/mini-cloud.png", 0, 0, -1, 0));
        this.bgList.push(new LoopingBackGround(350, 260, "./img/mini-cloud.png", 0, 0, -1, 0));
        this.bgList.push(new LoopingBackGround(400, 260, "./img/mini-cloud.png", 0, 0, -1, 0));
        this.bgList.push(new LoopingBackGround(520, 260, "./img/mini-cloud.png", 0, 0, -1, 0));
        this.bgList.push(new LoopingBackGround(700, 250, "./img/mini-cloud.png", 0, 0, -1, 0));
        this.bgList.push(new LoopingBackGround(750, 250, "./img/mini-cloud.png", 0, 0, -1, 0));
        this.bgList.push(new LoopingBackGround(880, 250, "./img/mini-cloud.png", 0, 0, -1, 0));
        this.bgList.push(new LoopingBackGround(1020, 250, "./img/mini-cloud.png", 0, 0, -1, 0));
        this.animalList.push(new Lion(1000, GROUND));
        this.animalList.push(new Lion(1080, GROUND - 18));
        this.animalList.push(new Ox(2000, GROUND));
        this.animalList.push(new Ox(2060, GROUND - 24));
        this.animalList.push(new Ox(2600, GROUND));
        this.animalList.push(new Ox(2800, GROUND - 24));
        this.animalList.push(new Elephant(4000, GROUND));
        this.animalList.push(new Ox(5000, GROUND));
        this.animalList.push(new Ox(5300, GROUND));
        this.animalList.push(new Ox(5500, GROUND - 20));
        this.animalList.push(new Elephant(6000, GROUND));
        this.animalList.push(new Elephant(6400, GROUND + 20));
        this.animalList.push(new Giraffe(8000, GROUND));
        this.animalList.push(new Ox(8500, GROUND));
        this.animalList.push(new Ox(8900, GROUND));
        this.animalList.push(new Hippo(10000, GROUND));
    }

    update() {
        if (this.isCollided) {
            if (g_inputKeyBuffer[KEY_ENTER]) {
                this.restart();
            }
        }
        else {
            // Move Process
            this.player.move();
            this.player.x -= 0.5;
            this.ground.move();
            this.frontEnd.move();
            for (const mover of this.bgList) { mover.move(); }
            for (const mover of this.animalList) { mover.move(); }

            // Collision Process
            let currentCollided = false;
            for (const animal of this.animalList) {
                for (const animalCol of animal.collisions) {
                    for (const playerCol of this.player.collisions) {
                        const dx = (this.player.x + playerCol.offsetX) - (animal.x + animalCol.offsetX);
                        const dy = (this.player.y + playerCol.offsetY) - (animal.y + animalCol.offsetY);
                        const distanceSquare = dx * dx + dy * dy;
                        const radiusSquare = (playerCol.radius + animalCol.radius) * (playerCol.radius + animalCol.radius);
                        if (distanceSquare <= radiusSquare) {
                            currentCollided = true;
                        }
                    }
                }
            }
            this.isCollided = currentCollided;
        }

        // Draw Process
        g_ctx.clearRect(0, 0, CANVAS_SCREEN_WIDTH, CANVAS_SCREEN_HEIGHT);
        this.player.draw();
        this.ground.draw();
        this.frontEnd.draw();
        for (const bg of this.bgList) { bg.draw(); }
        for (const animal of this.animalList) { animal.draw(); }
        if (this.isCollided) {
            g_ctx.font = GAME_OVER_SUB_FONT;
            g_ctx.fillText("Enter : restart", 210, 230);
            g_ctx.font = GAME_OVER_FONT;
            g_ctx.fillText("GAME OVER", 150, 200);
            g_ctx.font = DEFAULT_FONT;
        }
    }
}

/* exported boot */
function boot(canvasId) {

    // initialize canvas
    let canvas = document.getElementById(canvasId);
    canvas.width = CANVAS_SCREEN_WIDTH;
    canvas.height = CANVAS_SCREEN_HEIGHT;
    g_ctx = canvas.getContext(CANVAS_CONTEXT_TYPE);
    g_ctx.font = DEFAULT_FONT;

    // initialize stage
    const stage = new StageScene();
    stage.restart();

    // requestAnimationFrame loop
    const loop = () => {
        stage.update();
        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
}