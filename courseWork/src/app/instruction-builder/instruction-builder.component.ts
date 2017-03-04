import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {contentHeaders} from "../common/headers";

@Component({
  selector: 'app-instruction-builder',
  templateUrl: './instruction-builder.component.html',
  styleUrls: ['./instruction-builder.component.css']
})
export class InstructionBuilderComponent implements OnInit {

  private simpleProducts = [
    "tag1",
    "tag2",
    "tag3"
  ];
  private steps = [];
  
  constructor(private _http: Http) {
    // this._http.get('user/get/photo', { headers: contentHeaders })
    //   .subscribe(
    //     data => { console.log(data); console.log('hood'); },
    //     error => console.log(error)
    //   );
  }

  ngOnInit() {
  }

}
