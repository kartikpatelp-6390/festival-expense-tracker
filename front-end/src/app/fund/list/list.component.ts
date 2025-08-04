import { Component, OnInit } from '@angular/core';
import { FundService} from "../fund.service";
import { Router } from '@angular/router';
import { triggerFileDownload } from "../../utils";
import {NotificationService} from "../../services/notification.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceiptComponent } from "../../receipt/receipt/receipt.component";
import {HouseService} from "../../house/house.service";
import {VolunteerService} from "../../volunteer/volunteer.service";
import { UnpaidListComponent } from "../unpaid-list/unpaid-list.component";
import { VolunteerSummaryComponent } from "../volunteer-summary/volunteer-summary.component";

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

  sortBy: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  volunteers: any[] = [];
  volunteerId = '';
  startDate: string = '';
  endDate: string = '';

  volunteerSummary: any[] = [];

  constructor(
    private fundService: FundService,
    private router: Router,
    private notification: NotificationService,
    private modalService: NgbModal,
    private houseService: HouseService,
    private volunteerService: VolunteerService,
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
    this.loadFunds();
    this.loadVolunteers();
  }

  loadFunds(){
    this.customSearch = {
      'festivalYear': this.year,
      'volunteerId': this.volunteerId,
    };

    (this.amount) ? this.customSearch['amount'] = this.amount : '';

    const sortParam = this.sortOrder === 'asc' ? this.sortBy : `-${this.sortBy}`;

    if (this.startDate) {
      this.customSearch['startDate'] = this.startDate;
    }

    if (this.endDate) {
      this.customSearch['endDate'] = this.endDate;
    }

    this.fundService.getFunds(this.page, this.limit, this.search, sortParam, this.customSearch).subscribe((res) => {
      this.funds = res['data'];
      this.total = res['pagination'].totalPages;
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
          this.notification.success('Fund deleted successfully.');
          this.loadFunds();
        },
        error: err => {
          this.notification.error('Failed to delete this fund.');
        }
      })
    }
  }

  downloadReceipt(id: string) {
    this.fundService.downloadReceipt(id, 'download').subscribe((blob)=>{
      triggerFileDownload(blob, `receipt_${id}.pdf`);
    });
  }

  openReceiptModal(fund: any) {

    let phoneNumbers: string[] = [];
    if (fund.type === 'house') {
      const house = fund.houseId;
      const phone = house.phone?.trim();
      const alternative = fund.alternativePhone?.trim();

      if (phone && alternative && phone !== alternative) {
        phoneNumbers = [phone, alternative];
      } else if (phone || alternative) {
        phoneNumbers = [phone || alternative].filter(Boolean);
      }
    } else {
      const alternative = fund.alternativePhone?.trim();
      phoneNumbers = [alternative].filter(Boolean);
    }

    const modalRef = this.modalService.open(ReceiptComponent, { size: 'md' });
    modalRef.componentInstance.fundId = fund._id;
    modalRef.componentInstance.phoneNumbers = phoneNumbers;
  }

  toggleSort(column: string) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc'; // new column, start with ascending
    }
    this.loadFunds();
  }

  resetSort() {
    this.sortBy = 'createdAt';
    this.sortOrder = 'desc';
    this.loadFunds();
  }

  loadVolunteers() {
    this.volunteerService.getAllVolunteers().subscribe((res) => {
      this.volunteers = res['data'];
    })
  }

  onStartDateChange() {
    // Reset end date if it becomes invalid
    if (this.endDate && this.endDate < this.startDate) {
      this.endDate = '';
    }

    this.loadFunds();
  }

  clearDates() {
    this.startDate = '';
    this.endDate = '';
    this.loadFunds();
  }

  unPaidList() {
    const params = {
      festivalYear: this.year
    };

    this.fundService.getUnpaidHouse(params).subscribe((res) => {
      const modalRef = this.modalService.open(UnpaidListComponent, { size: 'xl' });
      modalRef.componentInstance.houses = res['sortedHouses'];
    }, err => {
      this.notification.error("Failed to fetch unpaid houses.");
    });
  }

  openVolunteerSummary() {
    const params = {
      festivalYear: this.year
    };

    this.fundService.getVolunteerSummary(params).subscribe((res) => {
      const modalRef = this.modalService.open(VolunteerSummaryComponent, { size: 'md' });
      modalRef.componentInstance.summary = res;
    }, err => {
      this.notification.error("Failed to fetch volunteer summary.");
    });
  }

}
