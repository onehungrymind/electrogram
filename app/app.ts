let filters = require('./filters.json');

import {bootstrap} from 'angular2/platform/browser';
import {Component, ChangeDetectorRef} from 'angular2/core';
import {NgFor} from 'angular2/common';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.css')]
})

export class App {

  image: { path: string } = {path: ''};
  filters: Array<Object> = filters;
  currentFilter: string = '';
  dialog: Electron.Dialog = window.require('remote').require('dialog');
  fs: any = window.require('fs');
  canvasBuffer: any = window.require('electron-canvas-to-buffer');

  constructor(private cd: ChangeDetectorRef) {}

  handleDrop(e) {
    var files: File = e.dataTransfer.files;
    var self = this;
    Object.keys(files).forEach((key) => {
      if(files[key].type === "image/png" || files[key].type === "image/jpeg") {
        self.image.path = files[key].path;
        self.setFilter(self.currentFilter);
      }
      else {
        alert("File must be a PNG or JPEG!");
      }
    });

    return false;
  }

  open() {
    let self = this;
    this.dialog.showOpenDialog( (fileNames) => {
      if (fileNames === undefined) return;
      let fileName = fileNames[0];
      this.fs.readFile(fileName, 'utf-8', (err, data) => {
        self.image.path = fileName;
        self.setFilter(self.currentFilter);
      });
    });
  }

  setFilter(value) {
    let self = this;

    self.currentFilter = value;

    Caman('#photo', function() {
      this.revert();
      if (this[value]) this[value]();
      this.render();

      self.cd.detectChanges();
    });
  }

  save() {
    let self = this,
        canvas = document.getElementsByTagName('canvas')[0];

    this.dialog.showSaveDialog(function (fileName) {
      if (fileName === undefined) return;

      let buffer = self.canvasBuffer(canvas, 'image/png');

      self.fs.writeFile(fileName, buffer, function (err) {});
    });
  }
}

bootstrap(App);
