import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import {FormsModule} from "@angular/forms";
import { TodoModule } from "../todo/todo.module";


@NgModule({
  declarations: [DashboardComponent, HomeComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    TodoModule
  ]
})
export class DashboardModule { }
