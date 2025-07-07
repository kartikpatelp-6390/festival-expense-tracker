import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FundService } from "../fund.service";
import { HouseService } from "../../house/house.service";
import {triggerFileDownload} from "../../utils";
import {NotificationService} from "../../services/notification.service";
import {formatDate} from "@angular/common";

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
  isDownload = false;
  isAddNew : boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fundService: FundService,
    private houseService: HouseService,
    private notification: NotificationService,
  ) {
    this.fundForm = this.fb.group({
      type: ['', Validators.required],
      houseId: [''],
      name: ['', Validators.required],
      amount: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      reference: [''],
      date: [new Date().toISOString().split('T')[0]],
      festivalYear: [new Date().getFullYear()],
      alternativePhone: [''],
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
    this.houseService.getHouses(1,300).subscribe((res) => {
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

        this.onTypeChange(this.fundForm.value.type);

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

    const formData = { ...this.fundForm.value };

    // If type is house and name is blank, assign selectedHouseOwner to name
    if (this.fundForm.get('type')?.value === 'house' && !this.fundForm.get('name')?.value && this.selectedHouseOwner) {
      this.fundForm.patchValue({
        name: this.selectedHouseOwner
      });
    }

    // If house type is not selected then delete houseId from parameter
    if(this.fundForm.get('type')?.value !== 'house') {
      // If houseId is blank, remove it from the form data
      if (!formData.houseId || formData.houseId.trim() === '') {
        delete formData.houseId;
      }
      delete formData.alternativePhone;
    }

    // Trigger validation manually
    this.fundForm.markAllAsTouched();

    // Prevent submit if form invalid
    if (this.fundForm.invalid) return;

    if (this.isEditMode) {
      this.fundService.updateFund(this.fundId, formData).subscribe((res) => {
        this.notification.success("Fund updated successfully.");
        this.redirect(res);
      });
    } else {
      this.fundService.createFund(formData).subscribe((res) => {
        this.notification.success("Fund created successfully.");
        this.redirect(res);
      });
    }
  }

  redirect(res) {
    this.fundId = res.data._id;
    if (this.isDownload) {
      this.downloadReceipt(this.fundId);
      if (!this.isEditMode) {
        this.router.navigate(['/fund/edit', this.fundId]);
      }
    } if (this.isAddNew) {
      this.router.navigate(['/fund/add']);
    } else {
      this.onCancel();
    }
  }

  downloadReceipt(id: string) {
    this.fundService.downloadReceipt(id).subscribe((blob)=>{
      triggerFileDownload(blob, `receipt_${id}.pdf`);
    });
  }

  saveAndDownload() {
    this.isDownload = true;
    this.onSubmit();
  }

  saveAndNew() {
    this.isAddNew = true;
    this.onSubmit();
    this.router.navigate(['/fund/add']);
  }

  onCancel() {
    this.router.navigate(['/fund']);
  }

  onTypeChange(type: string) {
    if (type === 'aarti') {
      this.fundForm.get('name')?.disable();
      this.fundForm.get('houseId')?.disable();
      this.fundForm.patchValue({ name: '', houseId: '' });
    } else {
      this.fundForm.get('name')?.enable();
      this.fundForm.get('houseId')?.enable();
    }
  }

  onHouseChange(houseId: string) {
    const selectedHouse = this.houses.find(h => h._id === houseId);
    if (selectedHouse && selectedHouse.phone) {
      this.fundForm.patchValue({ alternativePhone: selectedHouse.phone });
    }
  }
}
