import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  closeSidebar() {
    if ($ && $('[data-widget="pushmenu"]').length) {
      $('[data-widget="pushmenu"]').PushMenu('collapse');
    }
  };

}
