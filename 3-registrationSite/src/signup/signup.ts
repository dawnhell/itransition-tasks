import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';

const styles   = require('./signup.css');
const template = require('./signup.html');

@Component({
  selector: 'signup',
  template: template,
  styles: [ styles ]
})
export class Signup {
  private userExists:  boolean = false;
  private emailExists: boolean = false;
  private isFull:      boolean = true;
  constructor(public router: Router, public http: Http) {}
  signup(event, username, password, email) {
    this.isFull = true;
    this.userExists = false;
    this.emailExists = false;
    event.preventDefault();
    if (!username || !email || !password) {
      this.isFull = false;
    } else {
      this.isFull = true;
      let body = JSON.stringify({ username, password, email });
      this.http.post('http://localhost:3001/users', body, { headers: contentHeaders })
      .subscribe(
        data => {
          var obj = JSON.stringify(data);
          var status = JSON.parse(obj)._body;
          if (status === 'username') {
            this.userExists = true;
          } else {
            if (status === 'email') {
              this.emailExists = true;
            } else {
              this.router.navigate(['check']);
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
