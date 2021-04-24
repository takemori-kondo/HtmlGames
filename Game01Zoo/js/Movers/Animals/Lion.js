// ES2015 module mode

import {Animal} from '../Animal.js'
import {Collision} from '../Collision.js'

export class Lion extends Animal {
    constructor(x, y) {
        super(x, y, "./img/lion.png", -20, 54, -3, 0
            , [
                new Collision(0, 28, 14)
                , new Collision(16, 8, 8)
                , new Collision(32, 8, 8)
            ]);
    }
}