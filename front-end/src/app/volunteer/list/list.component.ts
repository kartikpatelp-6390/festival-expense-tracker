import { Component, OnInit } from '@angular/core';
import { VolunteerService } from '../volunteer.service';
import { Router } from '@angular/router';
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../core/services/auth.service";

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

  constructor(
    private volunteerService: VolunteerService,
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.user = this.authService.getUser();
    this.loadVolunteers();
  }

  loadVolunteers(){
    this.volunteerService.getVolunteers(this.page, this.limit, this.search).subscribe((res) => {
      this.volunteers = res['data'];
      this.total = res['pagination'].total;
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

  protected readonly Math = Math;
}
