let filters = require('./../assets/data/filters.json');

import {bootstrap} from 'angular2/platform/browser';
import {ViewChild, Input, Component, Directive, ChangeDetectorRef} from 'angular2/core';
import { CanvasService } from './canvasService';
import menuTemplate from './menuTemplate.ts';

let remote = window.require('remote')
let {dialog, Menu, MenuItem, MenuItemOptions} = remote;


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
  @ViewChild('canvas') canvas;

  imageElement: HTMLImageElement;
  filters: Array<Object> = filters;
  fs: any = require('fs');
  canvasBuffer: any = window.require('electron-canvas-to-buffer');
  dropzoneStylesVisible: boolean = true;
  currentFilter: string = '';
  showDropzone: boolean = true;

  constructor(
    private _cd: ChangeDetectorRef,
    private _cs: CanvasService
  ) {
    this.setAppMenu();
  }

  setAppMenu() {
    menuTemplate.splice(1, 0, {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+o',
          click: (item, focusedWindow) => {
            this.open();
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+s',
          click: (item, focusedWindow) => {
            this.save();
          }
        }
      ]
    })
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  }

  showDropzoneStyles() {
    this.dropzoneStylesVisible = true;
    return false;
  }

  hideDropzoneStyles() {
    this.dropzoneStylesVisible = false;
    return false;
  }

  handleDrop(e, canvas) {
    e.preventDefault();
    var files: File = e.dataTransfer.files;

    Object.keys(files).forEach((key) => {
      if(files[key].type === 'image/png' || files[key].type === 'image/jpeg') {
        this.loadImage(files[key].path);
      }
      else {
        alert('File must be a PNG or JPEG!');
      }
    });


    return false;
  }

  loadImage(fileName) {
    let image: HTMLImageElement = new Image();
    image.onload = this.imageLoaded.bind(this, this.canvas.nativeElement, image);
    image.src = fileName;
  }

  open() {
    let self = this;
    dialog.showOpenDialog( (fileNames) => {
      if (fileNames === undefined) return;
      let fileName = fileNames[0];
      this.loadImage(fileName)
    });
  }

  save() {
    let self = this

    dialog.showSaveDialog({ filters: [
      { name: 'png', extensions: ['png'] }
    ]}, (fileName) => {
      if (fileName === undefined) return;

      let buffer = self.canvasBuffer(this.canvas.nativeElement, 'image/png');

      self.fs.writeFile(fileName, buffer, (err) => {
        if (err) {
          console.log(err);
          var myNotification = new Notification('Error', {
            body: 'There was an error; please try again'
          });
        } else {
          var myNotification = new Notification('Image Saved', {
            body: fileName
          });
        }
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

  imageLoaded(canvas, image) {
    this.imageElement = image;
    this._cs.initCanvas(canvas, image);

    this.showDropzone = false;
    this.dropzoneStylesVisible = false;

    this._cd.detectChanges();
  }
}

bootstrap(App);
