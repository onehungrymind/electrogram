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

  image: {path: String} = { path: '' };
  filters: any = filters;
  currentFilter: String = '';
  dialog: Electron.Dialog = window.require('remote').require('dialog');
  fs: any = window.require('fs');
  canvasBuffer = window.require('electron-canvas-to-buffer');

  constructor(private cd: ChangeDetectorRef) {}

  handleDrop(e) {
    var files:File = e.dataTransfer.files;
    var self = this;
    Object.keys(files).forEach((key) => {
      if(files[key].type === "image/png" || files[key].type === "image/jpeg") {
        self.image = files[key];
        this.putImageInCanvas();
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
        this.putImageInCanvas();
      });
    });
  }

  putImageInCanvas() {
    let self = this;

    Caman('#photo', this.image.path, function() {
      this.render();
      self.cd.detectChanges();
    });
  }

  setFilter(value) {
    let self = this;

    Caman('#photo', this.image.path, function() {
      this.revert();
      if (this[value]) this[value]();
      this.render();
      self.cd.detectChanges();
    });
  }

  save(canvas) {
    let self = this;
    this.dialog.showSaveDialog(function (fileName) {
      if (fileName === undefined) return;

      let buffer = self.canvasBuffer(canvas, 'image/png');

      self.fs.writeFile(fileName, buffer, function (err) {});
    });
  }
}

bootstrap(App);
