import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';

const styles   = require('./login.css');
const template = require('./login.html');

@Component({
    selector: 'login',
    template: template,
    styles: [ styles ]
})
export class Login {
  private isMatched:  boolean = true;
  private isFull:     boolean = true;
  private isVerified: boolean = true;
  constructor(public router: Router, public http: Http) {}

  login(event, username, password) {
    event.preventDefault();
    this.isMatched  = true;
    this.isFull     = true;
    this.isVerified = true;
    if (!username || !password) {
      this.isFull = false;
    } else {
      this.isFull = true;
      let body = JSON.stringify({ username, password });
      this.http.post('http://localhost:3001/sessions/create', body, { headers: contentHeaders })
      .subscribe(
        response => {
          var obj = JSON.stringify(response);
          var status = JSON.parse(obj)._body;
          if (status.toString() === 'true') {
            this.router.navigate(['home']);
          }
          if (status.toString() === 'false') {
            this.isMatched = false;
          }
          if (status.toString() === 'unverified') {
            this.isVerified = false;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
