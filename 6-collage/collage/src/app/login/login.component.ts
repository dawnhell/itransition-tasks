import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {Http} from "@angular/http";
import {contentHeaders} from "../common/headers";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  private isMatched:  boolean = true;
  private isFull:     boolean = true;
  
  constructor(public router: Router, public http: Http) {}
  
  login(event, username, password) {
    event.preventDefault();
    this.isMatched  = true;
    this.isFull     = true;
    if (!username || !password) {
      this.isFull = false;
    } else {
      this.isFull = true;
      let body = JSON.stringify({ username, password });
      this.http.post('http://localhost:4201/login', body, { headers: contentHeaders })
      .subscribe(
        data => {
          var obj = JSON.stringify(data);
          var status = JSON.parse(obj)._body;
          if (status.toString() === 'true') {
            this.router.navigate(['collage']);
          }
          if (status.toString() === 'false') {
            this.isMatched = false;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
