// ES2015 module mode

export class ImgContainerList {

    get isValidState() {
        const result = (
            0 < this.imgContainers.length &&
            0 <= this.currentImgIndex && this.currentImgIndex < this.imgContainers.length
        )
        return result;
    }

    get currentImgContainer() {
        return this.imgContainers[this.currentImgIndex];
    }

    constructor(imgContainers = null) {
        this.imgContainers = imgContainers != null ? imgContainers : [];
        this.currentImgIndex = 0;
    }
}