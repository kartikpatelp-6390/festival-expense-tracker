import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TodoComponent } from './todo.component';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [TodoComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [TodoComponent]
})
export class TodoModule { }
