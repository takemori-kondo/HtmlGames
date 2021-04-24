// ES2015 module mode

import {Animal} from '../Animal.js'
import {Collision} from '../Collision.js'

export class Giraffe extends Animal {
    constructor(x, y) {
        super(x, y, "./img/giraffe.png", -24, 116, -3, 0
            , [
                new Collision(0, 96, 4)
                , new Collision(8, 102, 6)
                , new Collision(14, 94, 4)
                , new Collision(18, 86, 5)
                , new Collision(24, 78, 6)
                , new Collision(32, 66, 8)
                , new Collision(46, 54, 12)
                , new Collision(60, 38, 20)
                , new Collision(58, 12, 24)
            ]);
    }
}
