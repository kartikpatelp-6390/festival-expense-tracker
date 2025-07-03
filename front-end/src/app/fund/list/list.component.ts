import { Component, OnInit } from '@angular/core';
import { FundService} from "../fund.service";
import { Router } from '@angular/router';
import { triggerFileDownload } from "../../utils";

@Component({
  selector: 'app-fund-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  funds: any[] = [];
  years: number[] = [];
  selectedYear: number;
  year:any = '';
  amount = '';

  total = 0;
  page = 1;
  limit = 10;
  search = '';
  customSearch: any = {};

  constructor(private fundService: FundService, private router: Router) {
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
    this.loadFunds();
  }

  loadFunds(){
    this.customSearch = {'festivalYear': this.year};

    (this.amount) ? this.customSearch['amount'] = this.amount : '';

    this.fundService.getFunds(this.page, this.limit, this.search, '', this.customSearch).subscribe((res) => {
      this.funds = res['data'];
      this.total = res['pagination'].total;
    })
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadFunds();
  }

  editFund(id: string) {
    this.router.navigate(['/fund/edit', id]);
  }

  addFund() {
    this.router.navigate(['/fund/add']);
  }

  deleteFund(id: string) {
    if(confirm('Are you sure want to delete this fund ?')) {
      this.fundService.deleteFund(id).subscribe({
        next: () => {
          this.loadFunds();
        },
        error: err => {
          alert('Failed to delete fund');
        }
      })
    }
  }

  downloadReceipt(id: string) {
    this.fundService.downloadReceipt(id).subscribe((blob)=>{
      triggerFileDownload(blob, `receipt_${id}.pdf`);
    });
  }

}
