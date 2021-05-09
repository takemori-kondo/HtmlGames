// ES2015 module mode

export class CircleCollider {
    
    static collides(aPosX, pPosY, aCollider, bPosX, bPosY, bCollider){
        const dx = (aPosX + aCollider.offsetX) - (bPosX + bCollider.offsetX);
        const dy = (pPosY + aCollider.offsetY) - (bPosY + bCollider.offsetY);
        const distanceSquare = dx * dx + dy * dy;
        const radiusSquare = (aCollider.radius + bCollider.radius) * (aCollider.radius + bCollider.radius);
        return distanceSquare <= radiusSquare;
    }

    constructor(offsetX, offsetY, radius) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.radius = radius;
    }
}