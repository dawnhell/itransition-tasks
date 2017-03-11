import { Component }        from '@angular/core';
import { Http }             from '@angular/http';
import { Router }           from '@angular/router';
import { AuthService }      from './auth.service';
import { TranslateService } from './translate/translate.service';
import { contentHeaders }   from './common/headers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private preloadSettings: any = {
    lang: 'en',
    isLightTheme: true
  };
  
  constructor(private _translate: TranslateService,
              private _auth: AuthService,
              private _http: Http,
              private _router: Router) {}
  
  ngOnInit() {
    this._http.get('http://localhost:3131/user/get/settings',  { headers: contentHeaders })
      .subscribe(
        data => {
          this.preloadSettings = data.json();
          this.selectLang(this.preloadSettings.lang);
        },
        error => console.log(error)
      );
  }
  
  changeOnLightTheme(): void {
    if (this.preloadSettings.isLightTheme === false) {
      this.preloadSettings.isLightTheme = true;
  
      this._http.post('http://localhost:3131/user/set/settings', this.preloadSettings,  { headers: contentHeaders })
      .subscribe(
        data => console.log(data.statusText + ' Settings were saved.'),
        error => console.log(error)
      );
    }
  }
  
  changeOnDarkTheme(): void {
    if (this.preloadSettings.isLightTheme === true) {
      this.preloadSettings.isLightTheme = false;
  
      this._http.post('http://localhost:3131/user/set/settings', this.preloadSettings,  { headers: contentHeaders })
      .subscribe(
        data => console.log(data.statusText + ' Settings were saved.'),
        error => console.log(error)
      );
    }
  }
  
  selectLang(lang: string): void {
    this.preloadSettings.lang = lang;
    this._translate.use(lang);
  
    this._http.post('http://localhost:3131/user/set/settings', this.preloadSettings,  { headers: contentHeaders })
    .subscribe(
      data => console.log(data.statusText + ' Settings were saved.'),
      error => console.log(error)
    );
  }
  
  onLogin(): void {
    this._auth.login();
  }
}
