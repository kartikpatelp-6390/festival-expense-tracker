import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [MainLayoutComponent, SidebarComponent, HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class LayoutModule { }
