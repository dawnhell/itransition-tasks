import { Component, OnInit } from '@angular/core';
import { Http }              from '@angular/http';
import { AuthService }       from '../auth.service';
import { contentHeaders }    from '../common/headers';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class InstructionComponent implements OnInit {
  private preloadSettings: any = {
    lang: 'en',
    isLightTheme: true
  };
  
  private personalInstructions: Array<Object> = [];
  private categories: Array<string> = [];
  
  constructor(private _auth: AuthService,
              private _http: Http) { }

  ngOnInit() {
    this._http.get('http://localhost:3131/user/get/settings',  { headers: contentHeaders })
    .subscribe(
      data => {
        this.preloadSettings = data.json();
      },
      error => console.log(error)
    );
    
    let currentUser = this._auth.userProfile;
    
    this._http.get('http://localhost:3131/user/get/categories', { headers: contentHeaders })
    .subscribe(
      data => this.categories = data.json(),
      error => console.log(error)
    );
    
    this._http.post('http://localhost:3131/user/get/instructions', currentUser, { headers: contentHeaders })
      .subscribe(
        data => {
          this.personalInstructions = JSON.parse(data.text()).instructions;
        },
        error => console.log(error)
      );
  }
}
