import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FestivalService} from "../festival.service";

@Component({
  selector: 'app-festival-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  festivals: any[] = [];
  years: number[] = [];
  selectedYear: number;

  // Pagination
  total = 0;
  page = 1;
  limit = 10;
  search = '';
  customSearch: any = {};

  constructor(private festivalService: FestivalService, private router: Router) {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }

    this.selectedYear = currentYear;
  }

  ngOnInit(): void {
    this.loadFestivals(this.selectedYear);
  }

  loadFestivals(year) {
    this.customSearch = {'year': year};

    this.festivalService.getFestivals(this.page, this.limit, this.search, '', this.customSearch).subscribe((res) => {
      this.festivals = res['data'];
      this.total = res['pagination'].total;
    })
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadFestivals(this.selectedYear);
  }

  editFestival(id: string): void {
    this.router.navigate(['/festival/edit', id]);
  }

  addFestival(): void {
    this.router.navigate(['/festival/add']);
  }

}
