import { Component, OnInit } from '@angular/core';

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
  
  constructor() { }

  ngOnInit() {
  }

}
