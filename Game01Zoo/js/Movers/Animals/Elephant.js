// ES2015 module mode

import {Animal} from '../Animal.js'
import {Collision} from '../Collision.js'

export class Elephant extends Animal {
    constructor(x, y) {
        super(x, y, "./img/elephant.png", -4, 90, -3, 0
            , [
                new Collision(0, 10, 2)
                , new Collision(6, 12, 4)
                , new Collision(44, 14, 36)
                , new Collision(54, 50, 12)
                , new Collision(80, 40, 20)
                , new Collision(106, 46, 16)
                , new Collision(104, 66, 4)
            ]);
    }
}