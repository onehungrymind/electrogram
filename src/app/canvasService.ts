class CanvasService {
  context: CanvasRenderingContext2D;
  original: ImageData;
  image: HTMLImageElement;

  initCanvas(canvas, image) {
    let context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height);

    this.setImage(image);
    this.setContext(context);
    this.setOriginalData(this.getData());
  }

  setImage(image) {
    this.image = image;
  }

  setContext(context) {
    this.context = context;
  }

  setOriginalData(original) {
    this.original = original;
  }

  getData() {
    return this.context.getImageData(0, 0, this.image.width, this.image.height);
  }

  setData(data) {
    return this.context.putImageData(data, 0, 0);
  }

  resetCanvas() {
    return this.context.putImageData(this.original, 0, 0);
  }

  transform(cb, factor) {
    let olddata = this.original;
    let oldpx = olddata.data;
    let newdata = this.context.createImageData(olddata);
    let newpx = newdata.data
    let res = [];
    let len = newpx.length;
    for (var i = 0; i < len; i += 4) {
     res = cb.call(this, oldpx[i], oldpx[i+1], oldpx[i+2], oldpx[i+3], factor, i);
     newpx[i]   = res[0]; // r
     newpx[i+1] = res[1]; // g
     newpx[i+2] = res[2]; // b
     newpx[i+3] = res[3]; // a
    }

    this.setData(newdata);
  }

  // Filter functions
  brighten() {
    let callback = (r, g, b, a, factor) => {
      return [r + factor, g + factor, b + factor, 255];
    }

    this.transform(callback, 100);
  }

  grayscale() {
    let callback = (r, g, b) => {
      let avg = 0.3  * r + 0.59 * g + 0.11 * b;
      return [avg, avg, avg, 255];
    }

    this.transform(callback, 1);
  }

  sepia() {
    let callback = (r, g, b) => {
      var avg = 0.3  * r + 0.59 * g + 0.11 * b;
      return [avg + 100, avg + 50, avg, 255];
    }

    this.transform(callback, 1);
  }

  negative() {
    let callback = (r, g, b) => {
      return [255 - r, 255 - g, 255 - b, 255];
    }

    this.transform(callback, 1);
  }

  noise() {
    let callback = (r, g, b, a, factor) => {
      var rand =  (0.5 - Math.random()) * factor;
      return [r + rand, g + rand, b + rand, 255];
    }

    this.transform(callback, 100);
  }
}

export { CanvasService }
