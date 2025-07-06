import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../core/services/auth.service";

declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  role: string | null = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
  }

  closeSidebar() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && $ && $('[data-widget="pushmenu"]').length) {
      $('[data-widget="pushmenu"]').PushMenu('collapse');
    }
  };

}
