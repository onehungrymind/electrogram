let filters = require('./filters.json');

import {bootstrap} from 'angular2/platform/browser';
import {Component, ChangeDetectorRef} from 'angular2/core';
import {NgFor} from 'angular2/common';

@Component({
  selector: 'app',
  template: `
    <div
      (dragover)="false"
      (dragend)="false"
      (drop)="handleDrop($event)"
      class="dropzone">
      <p>
        <strong>Drop Your Images Here</strong>
      </p>
    </div>

    <div class="control">
      <label>Filter:</label>
      <select [ngModel]="currentFilter" (ngModelChange)="setFilter($event)">
        <option value="">Select...</option>
        <option value="">#noFilter</option>
        <option *ngFor="#filter of filters" value="{{filter.className}}">{{filter.label}}</option>
      </select>
    </div>
    <div class="control">
      <button (click)="open()">Open...</button>
    </div>
    <div class="control">
      <button>Save</button>
    </div>

    <div class="photowrapper">
      <img id="photo" src="{{image.path}}">
    </div>
  `,
  styles: [`
    * {
      font-family: "Arial", "sans-serif";
    }

    .dropzone {
      height: 300px;
      border: 5px dotted #ccc;
    }

    .dropzone p {
      margin: 10px;
      text-align: center;
    }

    select {
      -webkit-appearance: menulist-button;
      margin-top: 15px;
      margin-bottom: 15px;
      font-size: 16px;
    }

    button {
      font-size: 16px;
    }

    img {
      box-shadow: 0px 1px 6px 0px rgba(0,0,0,0.5);
      border-radius: 3px;
    }

    .control {
      display: inline-block;
      margin-right: 15px;
    }
  `]
})

export class App {

  image: Object = {};
  filters: Array<Object> = filters;
  currentFilter: String = '';
  dialog: Object = window.require('remote').require('dialog');
  fs: Object = require('fs');

  constructor(private cd: ChangeDetectorRef) {  }

  handleDrop(e) {
    var files:File = e.dataTransfer.files;
    var self = this;
    Object.keys(files).forEach((key) => {
      if(files[key].type === "image/png" || files[key].type === "image/jpeg") {
        self.image = files[key];
      }
      else {
        alert("File must be a PNG or JPEG!");
      }
    });

    return false;
  }

  open() {
    this.dialog.showOpenDialog( (fileNames) => {
      if (fileNames === undefined) return;
      let fileName = fileNames[0];
      this.fs.readFile(fileName, 'utf-8', (err, data) => {
        this.image.path = fileName;
        this.cd.detectChanges();
      });
    });
  }

  setFilter(value) {
    let self = this;

    Caman('#photo', function() {
      this[value]();
      this.render();
      self.cd.detectChanges();
    });
  }

  save() {}
}

bootstrap(App);
