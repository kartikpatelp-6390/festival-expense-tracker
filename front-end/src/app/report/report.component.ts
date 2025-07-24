import { Component, OnInit } from '@angular/core';
import { ReportService } from "./report.service";
import {Router} from "@angular/router";
import {AuthService} from "../core/services/auth.service";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportData: any;
  loading = true;
  selectedYear: number;
  years: number[] = [];
  year:any = '';

  customSearch = {}

  constructor(
    private reportService: ReportService,
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
    this.loadReport();
  }

  loadReport() {
    this.customSearch = {'year': this.year};

    this.reportService.getYearlyReport(this.customSearch).subscribe({
      next: (res: any) => {
        this.reportData = res.data;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load report', err);
        this.loading = false;
      }
    });
  }

  getFestivalKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
