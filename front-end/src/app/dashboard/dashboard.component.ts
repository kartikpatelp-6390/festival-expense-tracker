import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DashboardService} from "./dashboard.service";
import {Observable, forkJoin} from "rxjs";
import {AuthService} from "../core/services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  infoBoxes = [
    { label: 'Total Fund', type: 'fund', value: '0' },
    { label: 'Total Expense', type: 'expense', value: '0' },
    { label: 'Balance', type: 'balance', value: '0' },
    { label: 'Houses', type: 'house', value: '0' },
    { label: 'Volunteers', type: 'volunteer', value: '0' }
  ];

  years: number[] = [];
  selectedYear: any = '';

  recentFunds: any[] = [];
  recentExpenses: any[] = [];
  customSearch = {}

  fundChartData: any;
  expenseChartData: any;

  fundBifurcateData: Record<string, number>;
  expenseBifurcateData: Record<string, number>;

  role: string | null = '';

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    for (let year = startYear; year <= currentYear + 5; year++) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.loadDashboardSummary();
    this.loadBifurcation();
  }

  loadDashboardSummary() {
    let totalFunds: any = 0;
    let totalExpenses: any = 0;
    let totalBalances: any = 0;

    this.customSearch = {'festivalYear': this.selectedYear};

    const funds$ = this.dashboardService.getFunds(this.customSearch);
    const expenses$ = this.dashboardService.getExpense(this.customSearch);
    const volunteers$ = this.dashboardService.getVolunteer(this.customSearch);

    forkJoin([funds$, expenses$, volunteers$]).subscribe(([fundsRes, expenseRes, volunteerRes]) => {
      const fundsData = fundsRes['data'];
      const expensesData = expenseRes['data'];
      const volunteersData = volunteerRes['data'];

      totalFunds = fundsData.reduce((sum, item) => sum + item.amount, 0);
      totalExpenses = expensesData.reduce((sum, item) => sum + item.amount, 0);
      totalBalances = totalFunds - totalExpenses;

      // get unit house number who funded
      const uniqueHouseIds = new Set<String>();
      fundsData.forEach(item => {
        if (item.type === 'house' && item.houseId?._id) {
          uniqueHouseIds.add(item.houseId._id);
        }
      });

      // get volunteers number who contributed expenses
      const uniqueVolunteerIds = new Set<String>();
      volunteersData.forEach(item => {
        if (item?._id) {
          uniqueVolunteerIds.add(item._id);
        }
      });

      this.infoBoxes.forEach((info) => {
        if (info['type'] === 'fund') {
          info['value'] = totalFunds;
        } else if (info['type'] === 'expense') {
          info['value'] = totalExpenses;
        } else if (info['type'] === 'balance') {
          info['value'] = totalBalances;
        } else if (info['type'] === 'house') {
          info['value'] = String(uniqueHouseIds.size);
        } else if (info['type'] === 'volunteer') {
          info['value'] = String(uniqueVolunteerIds.size);
        }
      });

      // prepare recent fund data
      this.recentFunds = [...fundsData].splice(0, 10);

      // prepare recent expense data
      this.recentExpenses = [...expensesData].splice(0, 10);

      // create object of unique category and its total and pass to renderExpensePieChart
      console.log(expensesData);

    });
  }

  loadBifurcation() {
    this.customSearch = {'festivalYear': this.selectedYear};

    this.dashboardService.getPaymentMethodBifurcation(this.customSearch).subscribe(res => {
        const fundData = this.mapToDonut(res.fund);
        const expenseData = this.mapToDonut(res.expense);

        this.fundBifurcateData  = this.mapToObject(res.fund);
        this.expenseBifurcateData = this.mapToObject(res.expense);
        console.log(this.fundBifurcateData);
    });
  }

  mapToObject(data: any[]): { [key: string]: number } {
    return data.reduce((acc, curr) => {
      acc[curr._id] = curr.total;
      return acc;
    }, {});
  }

  mapToDonut(data: any[]): { labels: string[], values: number[] } {
    const labels = data.map(d => d._id);
    const values = data.map(d => d.total);
    return { labels, values };
  }

}
