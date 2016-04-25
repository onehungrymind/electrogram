let filters = require('./../assets/data/filters.json');

import {bootstrap} from 'angular2/platform/browser';
import {Input, Component, Directive, ChangeDetectorRef} from 'angular2/core';

@Directive({
  selector: '[thumbnail]'
})

class Thumbnail {
  currentFilter;

  @Input() filter;
  @Input() path;

  constructor(private cd: ChangeDetectorRef) {};

  ngOnChanges() {
    let self = this,
        filterName = this.filter.className;

    Caman('#' + filterName, function() {
      this.reset();
      if (this[filterName]) this[filterName]();
      this.render();
      self.cd.detectChanges();
    });
  }
}

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.css')],
  directives: [Thumbnail]
})

export class App {

  image: { path: string } = {path: ''};
  filters: Array<Object> = filters;
  currentFilter: string = '';
  dialog: any = window.require('remote').require('dialog');
  fs: any = window.require('fs');
  canvasBuffer: any = window.require('electron-canvas-to-buffer');
  showDropzone: boolean = true;

  constructor(private cd: ChangeDetectorRef) {}

  handleDrop(e) {
    var files: File = e.dataTransfer.files;
    var self = this;
    Object.keys(files).forEach((key) => {
      if(files[key].type === 'image/png' || files[key].type === 'image/jpeg') {
        self.setImage(files[key].path);
      }
      else {
        alert('File must be a PNG or JPEG!');
      }
    });

    return false;
  }

  setImage(path) {
    this.image.path = path;
    this.setFilter(this.currentFilter);
    this.showDropzone = false;
    this.cd.detectChanges();
  }

  open() {
    let self = this;
    this.dialog.showOpenDialog( (fileNames) => {
      if (fileNames === undefined) return;
      let fileName = fileNames[0];
      this.fs.readFile(fileName, 'utf-8', (err, data) => {
        self.setImage(fileName);
      });
    });
  }

  setFilter(value) {
    let self = this;

    self.currentFilter = value;

    Caman('#photo', function() {
      self.showDropzone = false;
      this.revert(false);
      if (this[value]) this[value]();
      this.render();
      self.cd.detectChanges();
    });
  }

  save(canvasWrapper) {
    let self = this,
        canvas = canvasWrapper.children[0];

    this.dialog.showSaveDialog(function (fileName) {
      if (fileName === undefined) return;

      let buffer = self.canvasBuffer(canvas, 'image/png');

      self.fs.writeFile(fileName, buffer, function (err) {});
    });
  }
}

bootstrap(App);
