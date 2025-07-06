import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service'
import { VolunteerService } from "../../volunteer/volunteer.service";
import { FestivalService } from "../../festival/festival.service";
import { Router } from '@angular/router';
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-expense-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  expenses: any[] = [];
  years: number[] = [];
  volunteers: any[] = [];
  festivals: any[] = [];
  selectedYear: number;
  year:any = '';
  amount = '';
  volunteerId = '';
  festivalId = '';

  total = 0;
  page = 1;
  limit = 10;
  search = '';
  customSearch: any = {};
  role: string | null = '';
  user: any = null;

  constructor(
    private expenseService: ExpenseService,
    private volunteerService: VolunteerService,
    private festivalService: FestivalService,
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService,
  ) {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }

    this.selectedYear = currentYear;
    this.year = currentYear;
  }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.user = this.authService.getUser();

    this.loadVolunteers();
    this.loadFestivals()
    this.loadExpenses();
  }

  loadExpenses() {
    this.customSearch = {
      'festivalYear': this.year,
      'volunteerId': this.volunteerId,
      'festivalId': this.festivalId
    };

    (this.amount) ? this.customSearch['amount'] = this.amount : '';

    console.log(this.customSearch);
    this.expenseService.getExpenses(this.page, this.limit, this.search, '', this.customSearch).subscribe((res) => {
      this.expenses = res['data'];
      this.total = res['pagination'].total;
    })
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadExpenses();
  }

  editExpense(id: string) {
    this.router.navigate(['/expense/edit', id]);
  }

  addExpense() {
    this.router.navigate(['/expense/add']);
  }

  deleteExpense(id: string) {
    if(confirm('Are you sure want to delete this expense ?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.notification.success('Expense Deleted Successfully.');
          this.loadExpenses();
        },
        error: err => {
          this.notification.error('Failed to delete expense');
        }
      })
    }
  }

  loadVolunteers() {
    this.volunteerService.getVolunteers().subscribe((res) => {
      this.volunteers = res['data'];
    })
  }

  loadFestivals() {
    this.festivalService.getFestivals().subscribe((res) => {
      this.festivals = res['data'];
    })
  }

  onFestivalChange() {
    if (this.festivalId) {
      this.year = '';
    }
    this.loadExpenses();
  }

  onYearChange() {
    if (this.year) {
      this.festivalId = '';
    }
    this.loadExpenses();
  }

  toggleSettled(id, isSettled: boolean) {
    let settle = (isSettled) ? 'unsettle' : 'settle';
    if(confirm(`Are you sure want to ${settle} this expense ?`)) {
      const payload = {
        expenseId: id,
        isSettled: !isSettled
      };

      this.expenseService.updateExpenseSettled(payload).subscribe({
        next: (res) => {
          // Update local row state without reloading entire list
          this.notification.success(`Expense <b>${settle}</b> successfully.`);
          this.loadExpenses();
        },
        error: (err) => {
          this.notification.error('Failed to update settlement status');
        }
      });
    }
  }

}
