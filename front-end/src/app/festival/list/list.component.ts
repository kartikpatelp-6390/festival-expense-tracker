import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FestivalService} from "../festival.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-festival-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  festivals: any[] = [];
  years: number[] = [];
  selectedYear: number;
  year:any = '';

  // Pagination
  total = 0;
  page = 1;
  limit = 10;
  search = '';
  customSearch: any = {};

  constructor(
    private festivalService: FestivalService,
    private router: Router,
    private notification: NotificationService,
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
    this.loadFestivals();
  }

  loadFestivals() {
    this.customSearch = {'year': this.year};

    this.festivalService.getFestivals(this.page, this.limit, this.search, '', this.customSearch).subscribe((res) => {
      this.festivals = res['data'];
      this.total = res['pagination'].totalPages;
    })
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadFestivals();
  }

  editFestival(id: string): void {
    this.router.navigate(['/festival/edit', id]);
  }

  addFestival(): void {
    this.router.navigate(['/festival/add']);
  }

  deleteFestival(id: string) {
    if(confirm('Are you sure want to delete this festival ?')) {
      this.festivalService.deleteFestival(id).subscribe({
        next: () => {
          this.notification.success('Festival deleted successfully.');
          this.loadFestivals();
        },
        error: err => {
          this.notification.error('Failed to delete this festival.');
        }
      })
    }
  }

}
