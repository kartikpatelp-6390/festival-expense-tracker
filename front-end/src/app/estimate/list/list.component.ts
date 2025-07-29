import { Component, OnInit } from '@angular/core';
import { EstimateService } from '../estimate.service'
import { FestivalService } from "../../festival/festival.service";
import { Router } from '@angular/router';
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-estimate-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  estimates: any[] = [];
  years: number[] = [];
  volunteers: any[] = [];
  festivals: any[] = [];
  selectedYear: number;
  year:any = '';
  amount = '';
  volunteerId = '';
  festivalId = '';
  selectedNote: string = '';

  total = 0;
  page = 1;
  limit = 10;
  search = '';
  customSearch: any = {};
  role: string | null = '';
  user: any = null;

  constructor(
    private estimateService: EstimateService,
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

    this.loadFestivals()
    this.loadEstimates();
  }

  loadEstimates() {
    this.customSearch = {
      'festivalYear': this.year,
      'festivalId': this.festivalId
    };

    (this.amount) ? this.customSearch['amount'] = this.amount : '';

    this.estimateService.getEstimates(this.page, this.limit, this.search, '', this.customSearch).subscribe((res) => {
      this.estimates = res['data'];
      this.total = res['pagination'].totalPages;
    })
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadEstimates();
  }

  editEstimate(id: string) {
    this.router.navigate(['/estimate/edit', id]);
  }

  addEstimate() {
    this.router.navigate(['/estimate/add']);
  }

  deleteExpense(id: string) {
    if(confirm('Are you sure want to delete this estimate ?')) {
      this.estimateService.deleteEstimate(id).subscribe({
        next: () => {
          this.notification.success('Estimate Deleted Successfully.');
          this.loadEstimates();
        },
        error: err => {
          this.notification.error('Failed to delete estimate');
        }
      })
    }
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
    this.loadEstimates();
  }

  onYearChange() {
    if (this.year) {
      this.festivalId = '';
    }
    this.loadEstimates();
  }

}
