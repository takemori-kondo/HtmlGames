// ES2015 module mode

export class AabbCollider {

    static collides(aPosX, aPosY, aCollider, bPosX, bPosY, bCollider){
        const aMinX = aPosX - aCollider.halfW + aCollider.offsetX;
        const aMaxX = aPosX + aCollider.halfW + aCollider.offsetX;
        const aMinY = aPosY - aCollider.halfH + aCollider.offsetY;
        const aMaxY = aPosY + aCollider.halfH + aCollider.offsetY;
        const bMinX = bPosX - bCollider.halfW + bCollider.offsetX;
        const bMaxX = bPosX + bCollider.halfW + bCollider.offsetX;
        const bMinY = bPosY - bCollider.halfH + bCollider.offsetY;
        const bMaxY = bPosY + bCollider.halfH + bCollider.offsetY;
        return (aMinX <= bMaxX && bMinX <= aMaxX) && (aMinY <= bMaxY && bMinY <= aMaxY);
    }

    static calculateXAdjustment(charaX, charaCollider, fieldX, fieldCollider) {
        const charaMinX = charaX - charaCollider.halfW + charaCollider.offsetX;
        const charaMaxX = charaX + charaCollider.halfW + charaCollider.offsetX;
        const fieldMinX = fieldX - fieldCollider.halfW + fieldCollider.offsetX;
        const fieldMaxX = fieldX + fieldCollider.halfW + fieldCollider.offsetX;
        if (charaX <= fieldX) {
            return -(charaMaxX - fieldMinX);
        }
        else {
            return +(fieldMaxX - charaMinX)
        }
    }

    static calculateYAdjustment(charaY, charaCollider, fieldY, fieldCollider) {
        const charaMinY = charaY - charaCollider.halfH + charaCollider.offsetY;
        const charaMaxY = charaY + charaCollider.halfH + charaCollider.offsetY;
        const fieldMinY = fieldY - fieldCollider.halfH + fieldCollider.offsetY;
        const fieldMaxY = fieldY + fieldCollider.halfH + fieldCollider.offsetY;
        if (charaY <= fieldY) {
            return -(charaMaxY - fieldMinY);
        }
        else {
            return +(fieldMaxY - charaMinY)
        }
    }

    get halfW() {
        return this.width / 2.0;
    }

    get halfH() {
        return this.height / 2.0;
    }

    constructor(offsetX, offsetY, width, height) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
    }
}