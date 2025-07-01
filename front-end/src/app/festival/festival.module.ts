import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../shared/shared.module";

import { FestivalRoutingModule } from './festival-routing.module';
import {ListComponent} from "./list/list.component";
import {FormComponent} from "./form/form.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [ ListComponent, FormComponent],
  imports: [
    CommonModule,
    FestivalRoutingModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    SharedModule,
  ]
})
export class FestivalModule { }
