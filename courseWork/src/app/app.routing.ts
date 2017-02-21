import { Routes, RouterModule }  from "@angular/router";
import { NgModule }              from "@angular/core";
import { HomeComponent }         from "./home/home.component";
import { UnauthorizedComponent } from "./unauthorized/unauthorized.component";

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
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class RoutingModule {}
