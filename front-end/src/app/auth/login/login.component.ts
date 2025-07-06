import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../core/services/auth.service";
import { Router } from '@angular/router';
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        const user = this.auth.getUser();
        this.notification.success(`Welcome <b>${user.name}</b>`);

        this.router.navigate(['/dashboard'])
      },
      error: err => this.error = err.error.message || 'Login failed'
    });
  }

  ngOnInit(): void {
    document.body.className = 'hold-transition login-page';
  }

  ngOnDestroy(): void {
    document.body.className = '';
  }

}
