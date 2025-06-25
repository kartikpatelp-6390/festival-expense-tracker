import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    document.body.classList.add('hold-transaction', 'sidebar-mini', 'layout-fixed');
  }

  title = 'front-end';
}
