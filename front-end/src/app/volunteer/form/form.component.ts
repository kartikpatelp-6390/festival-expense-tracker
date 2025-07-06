import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {VolunteerService} from "../volunteer.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  volunteerForm: FormGroup;
  isEditMode = false;4
  volunteerId: string = '';
  showPasswordField = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private volunteerService: VolunteerService,
    private notification: NotificationService,
  ) {
    this.volunteerForm = this.fb.group({
      name: [''],
      phone: [''],
      password: [''] // only required in add mode
    })
  }

  ngOnInit(): void {
    this.volunteerId = this.route.snapshot.params['id'];

    if(this.volunteerId) {
      this.isEditMode = true;
      this.volunteerService.getVolunteerById(this.volunteerId).subscribe(volunteer => {
        const { password, ...safeData } = volunteer['data'];
        this.volunteerForm.patchValue(safeData);
      });

      this.volunteerForm.get('password')?.clearValidators();
      this.volunteerForm.get('password')?.updateValueAndValidity();
    } else {
      this.volunteerForm.get('password')?.setValidators([Validators.required]);
    }
  }

  togglePasswordField() {
    this.showPasswordField = !this.showPasswordField;
    if (this.showPasswordField) {
      this.volunteerForm.get('password')?.setValidators([Validators.required]);
    } else {
      this.volunteerForm.get('password')?.clearValidators();
    }
    this.volunteerForm.get('password')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.volunteerForm.invalid) {
      this.volunteerForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.volunteerForm.value };

    if (!payload.password) delete payload.password;

    if (this.isEditMode) {
      this.volunteerService.updateVolunteer(this.volunteerId, payload).subscribe(() => {
        this.notification.success('Volunteer updated successfully.');
        this.router.navigate(['/volunteer']);
      });
    } else {
      console.log(payload);
      this.volunteerService.createVolunteer(payload).subscribe(() => {
        this.notification.success('Volunteer created successfully.');
        this.router.navigate(['/volunteer']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/volunteer']);
  }

}
