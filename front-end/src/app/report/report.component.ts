import { Component, OnInit } from '@angular/core';
import { ReportService } from "./report.service";
import {Router} from "@angular/router";
import {AuthService} from "../core/services/auth.service";
import {triggerFileDownload} from "../utils";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportData: any = {
    income: 0,
    expenses: {},
    totalExpense: 0,
    balance: 0
  };
  loading = true;
  selectedYear: number;
  years: number[] = [];
  year:any = '';

  customSearch = {}
  downloading = false;

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

  getCategoryKeys(festivalExpenses: any): string[] {
    return Object.keys(festivalExpenses || {});
  }

  getFestivalTotal(festivalExpenses: any): any {
    if (!festivalExpenses) return 0;
    return Object.values(festivalExpenses).reduce(
      (sum: number, cat: any) => sum + (cat.total || 0),
      0
    );
  }

  getIncomeGroupKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getIncomeTypeLabel(type: string): string {
    if (type.toLowerCase() === 'aarti') return 'Dharmik Falo (Aarti)';
    if (type.toLowerCase() === 'balance') return 'Previous Balance';
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  downloadReceipt() {
    this.downloading = true; // start loading state
    this.customSearch = {'year': this.year};
    this.reportService.downloadReport(this.customSearch, 'download').subscribe({
      next: (blob) => {
        triggerFileDownload(blob, `festival_income_expense_report_${this.year}.pdf`);
        this.downloading = false; // stop loading
      },
        error: () => {
        this.downloading = false; // stop loading even on error
      }
    });
  }

}
