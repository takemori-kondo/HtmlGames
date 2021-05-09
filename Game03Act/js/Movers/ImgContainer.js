// ES2015 module mode

export class ImgContainer {
    constructor(imgFileName, imgWidth, imgHeight, imgOffsetX, imgOffsetY) {
        if (imgFileName != null) {
            this.img = new Image();
            this.img.src = imgFileName;
        }
        this.imgWidth = imgWidth;
        this.imgHeight = imgHeight;
        this.imgOffsetX = imgOffsetX;
        this.imgOffsetY = imgOffsetY;
    }
}