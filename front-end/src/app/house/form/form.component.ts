import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../house.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  houseForm: FormGroup;
  isEditMode = false;
  houseId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private houseService: HouseService,
  ) {
    this.houseForm = this.fb.group({
      houseNumber: [''],
      ownerName: [''],
      phone: ['']
    })
  }

  ngOnInit(): void {
    this.houseId = this.route.snapshot.params['id'];
    if(this.houseId) {
      this.isEditMode = true;
      this.houseService.getHouseById(this.houseId).subscribe(house => {
        console.log(house.data);
        this.houseForm.patchValue(house.data);
      });
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.houseService.updateHouse(this.houseId, this.houseForm.value).subscribe(() => {
        this.router.navigate(['/house']);
      });
    } else {
      this.houseService.createHouse(this.houseForm.value).subscribe(() => {
        this.router.navigate(['/house']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/house']);
  }

}
