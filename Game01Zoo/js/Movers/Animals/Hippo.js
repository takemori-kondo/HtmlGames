// ES2015 module mode

import {Animal} from '../Animal.js'
import {Collision} from '../Collision.js'

export class Hippo extends Animal {
    constructor(x, y) {
        super(x, y, "./img/hippo.png", -12, 54, -3, 0
            , [
                new Collision(0, 28, 14)
                , new Collision(20, 18, 16)
                , new Collision(32, 16, 18)
            ]);
    }
}