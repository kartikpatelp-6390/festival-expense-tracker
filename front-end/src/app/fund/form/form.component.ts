import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FundService } from "../fund.service";
import { HouseService } from "../../house/house.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  fundForm: FormGroup;
  houses: any[] = [];
  years: number[] = [];
  isEditMode = false;
  fundId: string = '';
  selectedHouseOwner: string = '';
  selectedYear:any = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fundService: FundService,
    private houseService: HouseService
  ) {
    this.fundForm = this.fb.group({
      type: ['', Validators.required],
      houseId: [''],
      name: [''],
      amount: ['', Validators.required],
      paymentMethod: [''],
      reference: [''],
      date: [new Date().toISOString().split('T')[0]],
      festivalYear: [new Date().getFullYear()],
    })

    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }

    this.selectedYear = currentYear;
    // this.year = currentYear;
  }

  ngOnInit(): void {
    this.houseService.getHouses().subscribe((res) => {
      this.houses = res['data'];
    });

    this.fundForm.get('type')?.valueChanges.subscribe((value) => {
      this.updateValidators(value);
    })

    this.fundForm.get('houseId')?.valueChanges.subscribe(houseId => {
      const selected = this.houses.find(h => h._id === houseId);
      this.selectedHouseOwner = selected?.ownerName || '';
    });

    this.fundId = this.route.snapshot.params['id'];
    if(this.fundId) {
      this.isEditMode = true;
      this.fundService.getFundById(this.fundId).subscribe(fund => {
        const fundData = fund.data;

        // Format ISO date to yyyy-MM-dd
        const formattedDate = fundData.date ? fundData.date.split('T')[0] : '';

        this.fundForm.patchValue({
          ...fundData,
          houseId: fundData.houseId?._id || '', // extract _id for dropdown
          date: formattedDate,
        });

        // Show owner name from populated object
        this.selectedHouseOwner = fundData.houseId?.ownerName || '';

        // Trigger validators again if needed
        this.updateValidators(fundData.type);
      });
    }
  }

  updateValidators(type: string) {
    if (type === 'house') {
      this.fundForm.get('houseId')?.setValidators(Validators.required);
      this.fundForm.get('name')?.clearValidators();
    } else {
      this.fundForm.get('houseId')?.clearValidators();
      this.fundForm.get('name')?.setValidators(Validators.required);
    }
    this.fundForm.get('houseId')?.updateValueAndValidity();
    this.fundForm.get('name')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.isEditMode) {
      this.fundService.updateFund(this.fundId, this.fundForm.value).subscribe(() => {
        this.router.navigate(['/fund']);
      });
    } else {
      this.fundService.createFund(this.fundForm.value).subscribe(() => {
        this.router.navigate(['/fund']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/fund']);
  }
}
