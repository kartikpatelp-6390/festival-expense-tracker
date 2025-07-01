import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VolunteerRoutingModule } from './volunteer-routing.module';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [ListComponent, FormComponent],
  imports: [
    CommonModule,
    VolunteerRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class VolunteerModule { }
