import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundRoutingModule } from './fund-routing.module';
import { FundComponent } from './fund.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import { UnpaidListComponent } from './unpaid-list/unpaid-list.component';
import { VolunteerSummaryComponent } from './volunteer-summary/volunteer-summary.component';


@NgModule({
  declarations: [FundComponent, ListComponent, FormComponent, UnpaidListComponent, VolunteerSummaryComponent],
  imports: [
    CommonModule,
    FundRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class FundModule { }
