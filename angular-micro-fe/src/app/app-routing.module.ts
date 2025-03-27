import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {APP_BASE_HREF} from "@angular/common";
import {ExampleComponent} from "./example/example.component";

const routes: Routes = [
  { path: '**', component: DashboardComponent },
  { path: 'example', component: ExampleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppRoutingModule { }
