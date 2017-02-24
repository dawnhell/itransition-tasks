import { BrowserModule }         from '@angular/platform-browser';
import { NgModule }              from '@angular/core';
import { FormsModule }           from '@angular/forms';
import { HttpModule }            from '@angular/http';

import { AppComponent }          from './app.component';
import { HomeComponent }         from './home/home.component';
import { RoutingModule }         from "./app.routing";
import { TRANSLATION_PROVIDERS } from "./translate/translations";
import { TranslateService }      from "./translate/translate.service";
import { TranslatePipe }         from "./translate/translate.pipe";
import { AuthService }           from "./auth.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    TranslatePipe
  ],
  providers: [
    AuthService,
    TRANSLATION_PROVIDERS,
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
