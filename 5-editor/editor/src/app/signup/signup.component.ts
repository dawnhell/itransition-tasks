import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {Http} from "@angular/http";
import {contentHeaders} from "../common/headers";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  private userExists:  boolean = false;
  private isFull:      boolean = true;
  
  constructor(public router: Router, public http: Http) {}
  
  signup(event, username, password) {
    event.preventDefault();
    this.isFull = true;
    this.userExists = false;
    event.preventDefault();
    if (!username || !password) {
      this.isFull = false;
    } else {
      this.isFull = true;
      let body = JSON.stringify({ username, password });
      this.http.post('http://localhost:4201/signup', body, { headers: contentHeaders })
      .subscribe(
        data => {
          var obj = JSON.stringify(data);
          var status = JSON.parse(obj)._body;
          if (status.toString() === 'username') {
            this.userExists = true;
          } else {
              this.router.navigate(['login']);
            }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
