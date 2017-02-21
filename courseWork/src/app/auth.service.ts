import { Injectable } from "@angular/core";
import { tokenNotExpired } from "angular2-jwt";
import { Router } from "@angular/router";
import "rxjs/add/operator/filter";

declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  private lock = new Auth0Lock('GdCxlPRC07y0rIWB3ysONpu8ohi17ASt', 'itraauthsite.eu.auth0.com', {});
  public userProfile: Object;
  
  constructor(private _router: Router) {
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
      
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        console.log(profile);
        if(error) {
          console.log(error);
          return;
        } else {
          localStorage.setItem('profile', JSON.stringify(profile));
          this.userProfile = profile;
        }
      });
    });
    
    /*this._router.events
        .filter(event => event.constructor.name === 'NavigationStart')
        .filter(event => (/access_token|id_token|error/).test(event.url))
        .subscribe(() => {
          this.lock.resumeAuth(window.location.hash, (error, authResult) => {
            if (error) {
              console.log(error);
              return;
            }
            localStorage.setItem('id_token', authResult.idToken);
            this._router.navigate(['/home']);
          });
        });*/
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