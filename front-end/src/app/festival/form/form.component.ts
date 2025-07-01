import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FestivalService} from "../festival.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  festivalForm: FormGroup;
  isEditMode = false;
  festivalId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private festivalService: FestivalService,
  ) {
    this.festivalForm = this.fb.group({
      name: [''],
      date: [''],
      year: [''],
      notes: ['']
    })
  }

  ngOnInit(): void {
    this.festivalId = this.route.snapshot.params['id'];
    if(this.festivalId) {
      this.isEditMode = true;
      this.festivalService.getFestivalById(this.festivalId).subscribe(festival => {
        const rawDate = new Date(festival.data.date);
        const ngbDate = {
            year: rawDate.getFullYear(),
            month: rawDate.getMonth() + 1,
            day: rawDate.getDate()
        };
        this.festivalForm.patchValue({
          ...festival.data,
          date: formatDateToInput(festival.data.date)
        });
      });
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.festivalService.updateFestival(this.festivalId, this.festivalForm.value).subscribe(() => {
        this.router.navigate(['/festival']);
      });
    } else {
      this.festivalService.createFestival(this.festivalForm.value).subscribe(() => {
        this.router.navigate(['/festival']);
      });
    }
  }
}

function formatDateToInput(iso: string): string {
  return iso.split('T')[0]; // Returns "2024-01-26"
}
