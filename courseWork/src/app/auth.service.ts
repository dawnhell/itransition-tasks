import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router }          from '@angular/router';
import { Http, Headers }   from '@angular/http';
import 'rxjs/add/operator/filter';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  private lock = new Auth0Lock('GdCxlPRC07y0rIWB3ysONpu8ohi17ASt', 'itraauthsite.eu.auth0.com', {});
  public userProfile: Object = {};
  
  constructor(private _router: Router,
              private _http: Http) {
    this.userProfile = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : {};
    
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
      
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if(error) {
          console.log(error);
          return;
        } else {
          localStorage.setItem('profile', JSON.stringify(profile));
          this.userProfile = profile;
  
          const contentHeaders = new Headers();
          contentHeaders.append('Content-Type', 'application/json');
          
          this._http.post('http://localhost:3131/user/add', profile, contentHeaders)
            .subscribe(
              data => console.log(data.statusText),
              error => console.log(error)
            );
        }
      });
    });
  }
  
  public login() {
    this.lock.show();
  }
  
  public authenticated() {
    return tokenNotExpired();
  }
  
  public logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = undefined;
  }
}