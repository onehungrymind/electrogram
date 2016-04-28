let filters = require('./../assets/data/filters.json');

import {bootstrap} from 'angular2/platform/browser';
import {Input, Component, Directive, ChangeDetectorRef} from 'angular2/core';
import { CanvasService } from './canvasService';

@Directive({
  selector: '[thumbnail]',
  providers: [ CanvasService ]
})

class Thumbnail {
  currentFilter: string = '';

  @Input() filter: string = '';
  @Input() image: HTMLImageElement;
  @Input() childCanvas: HTMLCanvasElement;

  constructor(private _cs: CanvasService) {};

  ngOnChanges() {
    if (this.image) {
      this._cs.initCanvas(this.childCanvas, this.image);

      let filterName = this.filter.toLowerCase();

      if (this._cs[filterName])
        this._cs[filterName]();
      else
        this._cs.resetCanvas();
    }
  }
}

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.css')],
  providers: [CanvasService],
  directives: [Thumbnail]
})

export class App {

  imageElement: HTMLImageElement;
  filters: Array<Object> = filters;
  currentFilter: string = '';
  showDropzone: boolean = true;

  constructor(
    private _cd: ChangeDetectorRef,
    private _cs: CanvasService
  ) {}

  handleDrop(e, canvas) {
    e.preventDefault();
    var files: File = e.dataTransfer.files;

    Object.keys(files).forEach((key) => {
      if(files[key].type === 'image/png' || files[key].type === 'image/jpeg') {
        this.loadImage(canvas, files[key].path);
      }
      else {
        alert('File must be a PNG or JPEG!');
      }
    });


    return false;
  }

  loadImage(canvas, fileName) {
    let image: HTMLImageElement = new Image();
    image.onload = this.imageLoaded.bind(this, canvas, image);
    image.src = fileName;

    this.showDropzone = false;
  }

  setFilter(value) {
    let filterName = value.toLowerCase();

    if (this._cs[filterName])
      this._cs[filterName]();
    else
      this._cs.resetCanvas();
  }

  imageLoaded(canvas, image) {
    this.imageElement = image;
    this._cs.initCanvas(canvas, image);
    this._cd.detectChanges();
  }
}

bootstrap(App);
