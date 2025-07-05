import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  success (message: string = 'Success!', title: string = 'Success') {
    this.toastr.success(message, title);
  }

  error (message: string = 'Something went wrong', title: string = 'Error') {
    this.toastr.error(message, title);
  }

  warning (message: string = 'Warning!', title: string = 'Warning') {
    this.toastr.warning(message, title);
  }

  info (message: string = 'Note', title: string = 'Info') {
    this.toastr.info(message, title);
  }
}
