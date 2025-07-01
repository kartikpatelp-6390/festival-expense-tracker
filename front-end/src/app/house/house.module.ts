import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HouseRoutingModule } from './house-routing.module';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [ListComponent, FormComponent],
  imports: [
    CommonModule,
    HouseRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ]
})
export class HouseModule { }
