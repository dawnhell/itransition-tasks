import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';

const styles = require('./home.css');
const template = require('./home.html');

@Component({
    selector: 'home',
    template: template,
    styles: [ styles ]
})

export class Home {
  constructor(private router: Router,
              private http: Http) {}
  logout () {
    this.http.get('/logout')
      .subscribe(
        data => this.router.navigate(['login']),
        error => console.log(error)
      );
  }
}
