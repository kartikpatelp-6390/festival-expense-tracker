import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportComponent } from "./report.component";
import { ReportRoutingModule } from './report-routing.module';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class ReportModule { }
