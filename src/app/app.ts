let filters = require('./../assets/data/filters.json');

import {bootstrap} from 'angular2/platform/browser';
import {Input, Component, Directive, ChangeDetectorRef} from 'angular2/core';
import { CanvasService } from './canvasService';

@Directive({
  selector: '[thumbnail]',
  providers: [ CanvasService ]
})

class Thumbnail {
  currentFilter;

  @Input() filter;
  @Input() image;
  @Input() childCanvas;

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

  canvas;
  imageElement;
  filters: Array<Object> = filters;
  currentFilter: string = '';
  dialog: any = window.require('remote').require('dialog');
  fs: any = window.require('fs');
  canvasBuffer: any = window.require('electron-canvas-to-buffer');
  showDropzone: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
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
    let image = new Image();
    image.onload = this.imageLoaded.bind(this, canvas, image);
    image.src = fileName;

    this.showDropzone = false;
  }

  open(canvas) {
    let self = this;
    this.dialog.showOpenDialog( (fileNames) => {
      if (fileNames === undefined) return;
      let fileName = fileNames[0];
      this.fs.readFile(fileName, 'utf-8', (err, data) => {
        this.loadImage(canvas, fileName)
      });
    });
  }

  setFilter(value) {
    let filterName = value.toLowerCase();

    if (this._cs[filterName])
      this._cs[filterName]();
    else
      this._cs.resetCanvas();
  }

  save(canvas) {
    let self = this

    this.dialog.showSaveDialog({ filters: [
     { name: 'png', extensions: ['png'] }
   ]}, function (fileName) {
      if (fileName === undefined) return;

      let buffer = self.canvasBuffer(canvas, 'image/png');

      self.fs.writeFile(fileName, buffer, function (err) {});
    });
  }

  imageLoaded(canvas, image) {
    this.imageElement = image;
    this._cs.initCanvas(canvas, image);
    this.cd.detectChanges();
  }
}

bootstrap(App);
