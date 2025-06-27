import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/button/button.component';
import { InputComponent } from './shared/input/input.component';
import { CurrencyFormatPipe } from './shared/pipes/currency-format.pipe';
import { AutofocusDirective } from './shared/directives/autofocus.directive';
import { LayoutModule } from "./layout/layout.module";
import { HouseComponent } from './house/house.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    InputComponent,
    CurrencyFormatPipe,
    AutofocusDirective,
    HouseComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
