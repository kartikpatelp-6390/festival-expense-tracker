import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstimateRoutingModule } from './estimate-routing.module';
import { EstimateComponent } from './estimate.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [EstimateComponent, ListComponent, FormComponent],
  imports: [
    CommonModule,
    EstimateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class EstimateModule { }
