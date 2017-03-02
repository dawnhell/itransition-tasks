import { Component, OnInit } from '@angular/core';
import { AuthService }       from '../auth.service';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class InstructionComponent implements OnInit {
  constructor(private _auth: AuthService) { }

  ngOnInit() {
  }
}
