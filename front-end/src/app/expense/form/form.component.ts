import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from "../expense.service";
import { FestivalService } from "../../festival/festival.service";
import { VolunteerService } from "../../volunteer/volunteer.service";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: 'app-expense-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  expenseForm: FormGroup;
  festivals: any[] = [];
  volunteers: any[] = [];
  categories: string[] = [];

  isEditMode = false;
  expenseId: string = ''

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private festivalService: FestivalService,
    private volunteerService: VolunteerService,
    private notification: NotificationService,
  ) {
    this.expenseForm = this.fb.group({
      festivalId: ['', Validators.required],
      volunteerId: ['', Validators.required],
      category: ['', Validators.required],
      amount: ['', Validators.required],
      paymentMethod: ['Cash', Validators.required],
      description: ['', Validators.required],
      isSettled: [false],
      date: [new Date().toISOString().split('T')[0]] // default today
    });
  }

  ngOnInit(): void {
    this.loadFestivals();
    this.loadVolunteers();
    this.loadCategories();

    this.expenseId = this.route.snapshot.params['id'];
    if (this.expenseId) {
      this.isEditMode = true;
      this.expenseService.getExpenseById(this.expenseId).subscribe(res => {
        const expense = res['data'];
        this.expenseForm.patchValue({
          ...expense,
          festivalId: expense.festivalId?._id || expense.festivalId,
          volunteerId: expense.volunteerId?._id || expense.volunteerId,
          date: expense.date ? expense.date.split('T')[0] : '',
        });
      });
    }
  }

  loadFestivals() {
    this.festivalService.getFestivals().subscribe(res => {
      this.festivals = res['data'];
    });
  }

  loadVolunteers() {
    this.volunteerService.getVolunteers().subscribe(res => {
      this.volunteers = res['data'];
    });
  }

  loadCategories() {
    this.expenseService.getAllCategories().subscribe((res: string[]) => {
      this.categories = res['data'];
    });
  }

  onSubmit() {
    if (!this.expenseForm.valid) {
      this.expenseForm.markAllAsTouched(); // 🔍 Triggers validation messages
      return;
    };

    const formData = { ...this.expenseForm.value };
    delete formData.isSettled;

    // Add festivalYear from selected festival
    const selectedFestival = this.festivals.find(f => f._id === formData.festivalId);
    formData.festivalYear = selectedFestival?.year || new Date().getFullYear();

    if (this.isEditMode) {
      this.expenseService.updateExpense(this.expenseId, formData).subscribe(() => {
        this.notification.success('Expense Updated Successfully.');
        this.router.navigate(['/expense']);
      });
    } else {
      this.expenseService.createExpense(formData).subscribe(() => {
        this.notification.success('Expense Added Successfully.');
        this.router.navigate(['/expense']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/expense']);
  }

}
