import { Component, OnInit } from '@angular/core';
import { VolunteerService } from '../volunteer.service';
import { Router } from '@angular/router';
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../core/services/auth.service";
import {ExpenseService} from "../../expense/expense.service";

@Component({
  selector: 'app-volunteer-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  volunteers: any[] = [];
  total = 0;
  page = 1;
  limit = 10;
  search = '';
  role: string | null = '';
  user: any = null;
  expanded: { [id: string]: boolean } = {};
  volunteerExpenses: { [id: string]: any[] } = {};

  constructor(
    private volunteerService: VolunteerService,
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService,
    private expenseService: ExpenseService,
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.user = this.authService.getUser();
    this.loadVolunteers();
  }

  loadVolunteers(){
    this.volunteerService.getVolunteers(this.page, this.limit, this.search).subscribe((res) => {
      this.volunteers = res['data'];
      this.total = res['pagination'].totalPages;
    })
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadVolunteers();
  }

  editVolunteer(id: string): void {
    this.router.navigate(['/volunteer/edit', id]);
  }

  addVolunteer(): void {
    this.router.navigate(['/volunteer/add']);
  }

  deleteVolunteer(id: string) {
    if(confirm('Are you sure want to delete this volunteer ?')) {
      this.volunteerService.deleteVolunteer(id).subscribe({
        next: () => {
          this.notification.success('Volunteer deleted successfully.');
          this.loadVolunteers();
        },
        error: err => {
          this.notification.error('Failed to delete this volunteer.');
        }
      })
    }
  }

  toggleExpenses(volunteerId: string) {
    this.expanded[volunteerId] = !this.expanded[volunteerId];

    if (this.expanded[volunteerId] && !this.volunteerExpenses[volunteerId]) {
      this.expenseService.getExpenseByVolunteerId(volunteerId).subscribe((res) => {
        this.volunteerExpenses[volunteerId] = res.data;
      });
    }
  }

  getTotalExpense(volunteerId: string): number {
    const list = this.volunteerExpenses[volunteerId];
    return list?.reduce((total, e) => total + e.amount, 0) || 0;
  }

  getTotalByMethod(volunteerId: string, method: 'Cash' | 'GPay'): number {
    const list = this.volunteerExpenses[volunteerId];
    return list?.filter(e => e.paymentMethod === method)
      .reduce((sum, e) => sum + e.amount, 0) || 0;
  }

  protected readonly Math = Math;
}
