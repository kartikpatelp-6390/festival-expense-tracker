import { Component } from '@angular/core';
import {AuthService} from "./core/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService, private router: Router) {
    document.body.classList.add('hold-transaction', 'sidebar-mini', 'layout-fixed');
  }

  ngOnInit() {
    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/login']);
    }
  }

  title = 'front-end';
}
