import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstimateService } from "../estimate.service";
import { FestivalService } from "../../festival/festival.service";
import { NotificationService } from "../../services/notification.service";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  estimateForm: FormGroup;
  festivals: any[] = [];
  volunteers: any[] = [];
  categories: string[] = [];

  isEditMode = false;
  expenseId: string = ''
  role: string | null = '';
  user: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private estimateService: EstimateService,
    private festivalService: FestivalService,
    private notification: NotificationService,
    private authService: AuthService,
  ) {
    this.estimateForm = this.fb.group({
      festivalId: ['', Validators.required],
      category: ['', Validators.required],
      estimatedAmount: ['', Validators.required],
      description: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0]] // default today
    });
  }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.user = this.authService.getUser();

    this.loadFestivals();
    this.loadCategories();

    this.expenseId = this.route.snapshot.params['id'];

    if (this.expenseId) {
      this.isEditMode = true;
      this.estimateService.getEstimateById(this.expenseId).subscribe(res => {
        const expense = res['data'];

        this.estimateForm.patchValue({
          ...expense,
          festivalId: expense.festivalId?._id || expense.festivalId,
          date: expense.date ? expense.date.split('T')[0] : '',
        });
      });
    }
  }

  loadFestivals() {
    this.festivalService.getAllFestivals().subscribe(res => {
      this.festivals = res['data'];
    });
  }

  loadCategories() {
    this.estimateService.getAllCategories().subscribe((res: string[]) => {
      this.categories = res['data'];
    });
  }

  onSubmit() {
    if (!this.estimateForm.valid) {
      this.estimateForm.markAllAsTouched(); // 🔍 Triggers validation messages
      return;
    };

    const formData = { ...this.estimateForm.value };

    // Add festivalYear from selected festival
    const selectedFestival = this.festivals.find(f => f._id === formData.festivalId);
    formData.festivalYear = selectedFestival?.year || new Date().getFullYear();

    if (this.isEditMode) {
      this.estimateService.updateEstimate(this.expenseId, formData).subscribe(() => {
        this.notification.success('Estimate Updated Successfully.');
        this.router.navigate(['/estimate']);
      });
    } else {
      this.estimateService.createEstimate(formData).subscribe(() => {
        this.notification.success('Estimate Added Successfully.');
        this.router.navigate(['/estimate']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/estimate']);
  }

}
