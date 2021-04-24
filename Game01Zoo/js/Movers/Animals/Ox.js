// ES2015 module mode

import {Animal} from '../Animal.js'
import {Collision} from '../Collision.js'

export class Ox extends Animal {
    constructor(x, y) {
        super(x, y, "./img/ox.png", -8, 54, -3, 0
            , [
                new Collision(0, 20, 6)
                , new Collision(20, 18, 16)
                , new Collision(35, 18, 14)
            ]);
    }
}