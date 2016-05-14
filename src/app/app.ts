let filters = require('./../assets/data/filters.json');

import { bootstrap } from '@angular/platform-browser-dynamic';
import { ViewChild, Input, Component, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CanvasService } from './canvasService';
// import { remote, ipcRenderer } from 'electron';

// let {dialog} = remote;

@Component({
  selector: '[thumbnail]',
  template: `<canvas #childCanvas></canvas>`,
  providers: [ CanvasService ],
  styles: [`
    img, canvas {
      width: 150px;
    }
  `]
})

class Thumbnail {
  @Input() filter: string = '';
  @Input() image: HTMLImageElement;
  @ViewChild('childCanvas') childCanvas: ElementRef;

  constructor(private _cs: CanvasService) {};

  ngAfterViewInit() {
    if (this.image && this.childCanvas) {
      this.initCanvas();
    }
  }

  ngOnChanges() {
    if (this.image && this.childCanvas) {
      this.initCanvas();
    }
  }

  initCanvas() {
    this._cs.initCanvas(this.childCanvas.nativeElement, this.image);

    let filterName = this.filter.toLowerCase();

    if (this._cs[filterName])
      this._cs[filterName]();
    else
      this._cs.resetCanvas();
  }
}

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [ require('./app.css') ],
  providers: [ CanvasService ],
  directives: [ Thumbnail ]
})

export class App {
  @ViewChild('canvas') canvas: ElementRef;

  imageElement: HTMLImageElement;
  filters: Array<Object> = filters;
  dropzoneStylesVisible: boolean = true;
  currentFilter: string = '';
  showDropzone: boolean = true;

  constructor(
    private _cd: ChangeDetectorRef,
    private _cs: CanvasService
  ) {}

  showDropzoneStyles() {
    this.dropzoneStylesVisible = true;
    return false;
  }

  hideDropzoneStyles() {
    this.dropzoneStylesVisible = false;
    return false;
  }

  handleDrop(e) {
    e.preventDefault();
    var files: File[] = e.dataTransfer.files;

    Object.keys(files).forEach((key) => {
      if(files[key].type === 'image/png' || files[key].type === 'image/jpeg') {
        let blobURL = URL.createObjectURL(files[key]);
        this.loadImage(blobURL);
      }
      else {
        alert('File must be a PNG or JPEG!');
      }
    });


    return false;
  }

  loadImage(fileName) {
    let image: HTMLImageElement = new Image();
    image.onload = this.imageLoaded.bind(this, this.canvas.nativeElement);
    image.src = fileName;
  }

  setFilter(value) {
    let filterName = value.toLowerCase();

    if (this._cs[filterName])
      this._cs[filterName]();
    else
      this._cs.resetCanvas();
  }

  imageLoaded(canvas, event) {
    this.imageElement = event.path[0];
    this._cs.initCanvas(canvas, event.path[0]);

    this.showDropzone = false;
    this.dropzoneStylesVisible = false;

    this._cd.detectChanges();
  }
}

bootstrap(App);
