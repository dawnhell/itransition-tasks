import { BrowserModule }                      from '@angular/platform-browser';
import { NgModule }                           from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpModule }                         from '@angular/http';
import { CommonModule }                       from '@angular/common';

import { AppComponent }                       from './app.component';
import { HomeComponent }                      from './home/home.component';
import { RoutingModule }                      from './app.routing';
import { TRANSLATION_PROVIDERS }              from './translate/translations';
import { TranslateService }                   from './translate/translate.service';
import { TranslatePipe }                      from './translate/translate.pipe';
import { AuthService }                        from './auth.service';
import { InstructionComponent }               from './instruction/instruction.component';
import { AuthGuard }                          from './auth-guard.service';
import { InstructionBuilderComponent }        from './instruction-builder/instruction-builder.component';
import { InstructionBuilderSectionComponent } from './instruction-builder/instruction-builder.section.component';
// import { TagInputModule }                     from 'ng2-tag-input';
import { DxTemplateModule, DxTagBoxModule }   from 'devextreme-angular';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RoutingModule,
    DxTemplateModule,
    DxTagBoxModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    TranslatePipe,
    InstructionComponent,
    InstructionBuilderComponent,
    InstructionBuilderSectionComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    TRANSLATION_PROVIDERS,
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
