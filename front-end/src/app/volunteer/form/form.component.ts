import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {VolunteerService} from "../volunteer.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  volunteerForm: FormGroup;
  isEditMode = false;
  volunteerId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private volunteerService: VolunteerService,
  ) {
    this.volunteerForm = this.fb.group({
      name: [''],
      phone: [''],
    })
  }

  ngOnInit(): void {
    this.volunteerId = this.route.snapshot.params['id'];
    if(this.volunteerId) {
      this.isEditMode = true;
      this.volunteerService.getVolunteerById(this.volunteerId).subscribe(volunteer => {
        console.log(volunteer.data);
        this.volunteerForm.patchValue(volunteer.data);
      });
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.volunteerService.updateVolunteer(this.volunteerId, this.volunteerForm.value).subscribe(() => {
        this.router.navigate(['/volunteer']);
      });
    } else {
      this.volunteerService.createVolunteer(this.volunteerForm.value).subscribe(() => {
        this.router.navigate(['/volunteer']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/volunteer']);
  }

}
