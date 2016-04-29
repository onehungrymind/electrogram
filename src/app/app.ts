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
  dialog: Electron.Dialog = window.require('remote').require('dialog');
  fs: any = window.require('fs');
  canvasBuffer: any = window.require('electron-canvas-to-buffer');
  dropzoneStylesVisible: boolean = true;
  currentFilter: string = '';
  showDropzone: boolean = true;

  constructor(
    private _cd: ChangeDetectorRef,
    private _cs: CanvasService
  ) {}

  showDropzoneStyles(e) {
    this.dropzoneStylesVisible = true;
    return false;
  }

  hideDropzoneStyles(e) {
    this.dropzoneStylesVisible = false;
    return false;
  }

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
    this.dropzoneStylesVisible = false;
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
