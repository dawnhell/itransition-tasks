import { Injectable }   from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { AuthService }  from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService,
              private _router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this._auth.authenticated()) {
      return true;
    } else {
      this._auth.login();
    }
  }
}