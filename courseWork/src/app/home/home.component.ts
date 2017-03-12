import { Component, OnInit }       from '@angular/core';
import { Http }                    from '@angular/http';
import { contentHeaders }          from '../common/headers';
import { CloudOptions, CloudData } from 'angular-tag-cloud-module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private instructionsList: Array<Object> = [];
  private randomInstructionsList: Array<Object> = [];
  
  private options: CloudOptions = {
    width : 300,
    height : 400,
    overflow: false,
  };
  
  private data: Array<CloudData> = [
    {text: 'Weight-10-link-color', weight: 10, link: 'https://google.com', color: '#ffaaee'},
    {text: 'Weight-10-link', weight: 10, link: 'https://google.com'}
  ];

  constructor(private _http: Http) { }

  ngOnInit() {
    this._http.get('http://localhost:3131/user/get/instructions', { headers: contentHeaders })
    .subscribe(
      data => {
        this.instructionsList = JSON.parse(data.text()).instructions;
        
        for(let i = 0; i < 3; ++i) {
          this.randomInstructionsList.push(this.instructionsList[Math.floor(Math.random() * (this.instructionsList.length))]);
        }
      },
      error => console.log(error)
    );
  }

}
