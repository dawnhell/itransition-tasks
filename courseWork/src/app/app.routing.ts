import { Routes, RouterModule }               from '@angular/router';
import { NgModule }                           from '@angular/core';
import { HomeComponent }                      from './home/home.component';
import { InstructionComponent }               from './instruction/instruction.component';
import { AuthGuard }                          from './auth-guard.service';
import { InstructionBuilderComponent }        from "./instruction-builder/instruction-builder.component";
import { InstructionBuilderSectionComponent } from "./instruction-builder/instruction-builder.section.component";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'instruction',
    component: InstructionBuilderSectionComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: InstructionComponent
      },
      {
        path: 'builder',
        component: InstructionBuilderComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

/*goBack() {
* window.history.back();
* }*/

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class RoutingModule {}
