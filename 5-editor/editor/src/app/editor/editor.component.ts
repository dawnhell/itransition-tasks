import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {contentHeaders} from "../common/headers";

declare function runAce(file);
declare function destroyAce();
declare function getCurrentCode();
declare function run(f);
declare function bf_stop_run();
declare function debug_toggle(f);
declare function isRunning();

export interface File {
  id: String;
  file: String;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})

export class EditorComponent implements OnInit {
  private files: File[] = [];
  private selectedFile: File = null;
  private isFull: boolean = false;
  private isRunning: boolean = false;
  
  constructor(private http: Http) {
    this.isFull = false;
  }
  
  onClick(file: File) {
    this.selectedFile = file;
    let body = JSON.stringify({ "filename": file.file });
    this.http.post('http://localhost:4201/file', body, { headers: contentHeaders })
    .subscribe(
      data => {
        var temp = JSON.stringify(data);
        var code = JSON.parse(temp)._body;
        destroyAce();
        runAce(code);
      },
      error => console.log(error)
    );
  }
  
  ngOnInit() {
    this.http.get('http://localhost:4201/files', { headers: contentHeaders })
      .subscribe(
        data => {
          this.files = data.json();
          this.onClick(this.files[0]);
        },
        error => console.log(error)
      );
  }
  
  onRename(fileName: String) {
    this.isFull = false;
    if(!fileName) {
      this.isFull = true;
    } else {
      let oldName = this.selectedFile.file;
      let body = JSON.stringify({ "old": oldName, "new": fileName });
      this.http.post('http://localhost:4201/rename', body, { headers: contentHeaders })
      .subscribe(
        data => {
          console.log("File has been renamed.");
          this.ngOnInit();
        },
        error => console.log(error)
      );
    }
  }
  
  isSelected(file: File) {
    return this.selectedFile == file;
  }
  
  onRun(form: any) {
    this.isRunning = !this.isRunning;
    let runBtn = document.getElementById('button_run');
    
    if(this.isRunning) {
      runBtn.innerHTML = '<i class="fa fa-stop" aria-hidden="true"></i> Stop';
      let textArea = document.getElementById('edit_source');
      textArea.innerText = getCurrentCode();
      run(form);
    } else {
      runBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i> Run';
      bf_stop_run();
    }
  }
  
  ngDoCheck() {
    let temp = isRunning();
    if(!temp) {
      let runBtn = document.getElementById('button_run');
      runBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i> Run';
    }
  }
  
  onDebug(form: any) {
    let textArea = document.getElementById('edit_source');
    textArea.innerText = getCurrentCode();
    debug_toggle(form);
  }
  
  onSave() {
    let code = getCurrentCode();
    let body = JSON.stringify({ "filename": this.selectedFile.file, "code": code });
    this.http.post('http://localhost:4201/save', body, { headers: contentHeaders })
    .subscribe(
      data => {
        console.log("File has been saved.");
      },
      error => console.log(error)
    );
  }
  
  onCreateFile(fileName: String) {
    this.isFull = false;
    if(!fileName) {
      this.isFull = true;
    } else {
      let body = JSON.stringify({ "filename": fileName });
      this.http.post('http://localhost:4201/create', body, { headers: contentHeaders })
        .subscribe(
          data => {
            console.log("File has been created.");
            this.ngOnInit();
          },
          error => console.log(error)
        );
    }
  }
  
  onRemoveFile() {
    let body = JSON.stringify({ "filename": this.selectedFile.file });
    this.http.post('http://localhost:4201/remove', body, { headers: contentHeaders })
    .subscribe(
      data => {
        console.log("File has been removed.");
        this.ngOnInit();
      },
      error => console.log(error)
    );
  }
}
