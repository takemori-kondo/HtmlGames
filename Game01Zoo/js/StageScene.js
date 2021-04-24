// ES2015 module mode

import {Global} from './Global.js'
import {Player} from './Movers/Player.js'
import {Ground} from './Movers/Ground.js'
import {FrontEnd} from './Movers/FrontEnd.js'
import {LoopingBackGround} from './Movers/LoopingBackGround.js'
import {Lion} from './Movers/Animals/Lion.js'
import {Ox} from './Movers/Animals/Ox.js'
import {Elephant} from './Movers/Animals/Elephant.js'
import {Giraffe} from './Movers/Animals/Giraffe.js'
import {Hippo} from './Movers/Animals/Hippo.js'

export class StageScene {
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
        this.player = new Player(100, Global.GROUND + Global.PLAYER_GROUND_TOUCH_OFFSET, "./img/4wd.png", -32, 30);
        this.ground = new Ground(0, Global.GROUND, "", 0, 0);
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
        this.animalList.push(new Lion(1000, Global.GROUND));
        this.animalList.push(new Lion(1080, Global.GROUND - 18));
        this.animalList.push(new Ox(2000, Global.GROUND));
        this.animalList.push(new Ox(2060, Global.GROUND - 24));
        this.animalList.push(new Ox(2600, Global.GROUND));
        this.animalList.push(new Ox(2800, Global.GROUND - 24));
        this.animalList.push(new Elephant(4000, Global.GROUND));
        this.animalList.push(new Ox(5000, Global.GROUND));
        this.animalList.push(new Ox(5300, Global.GROUND));
        this.animalList.push(new Ox(5500, Global.GROUND - 20));
        this.animalList.push(new Elephant(6000, Global.GROUND));
        this.animalList.push(new Elephant(6400, Global.GROUND + 20));
        this.animalList.push(new Giraffe(8000, Global.GROUND));
        this.animalList.push(new Ox(8500, Global.GROUND));
        this.animalList.push(new Ox(8900, Global.GROUND));
        this.animalList.push(new Hippo(10000, Global.GROUND));
    }

    update() {
        if (this.isCollided) {
            if (Global.g_inputKeyBuffer[Global.KEY_ENTER]) {
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
        Global.g_ctx.clearRect(0, 0, Global.CANVAS_SCREEN_WIDTH, Global.CANVAS_SCREEN_HEIGHT);
        this.player.draw();
        this.ground.draw();
        this.frontEnd.draw();
        for (const bg of this.bgList) { bg.draw(); }
        for (const animal of this.animalList) { animal.draw(); }
        if (this.isCollided) {
            Global.g_ctx.font = Global.GAME_OVER_SUB_FONT;
            Global.g_ctx.fillText("Enter : restart", 210, 230);
            Global.g_ctx.font = Global.GAME_OVER_FONT;
            Global.g_ctx.fillText("GAME OVER", 150, 200);
            Global.g_ctx.font = Global.DEFAULT_FONT;
        }
    }
}