import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-volunteer-summary',
  templateUrl: './volunteer-summary.component.html',
  styleUrls: ['./volunteer-summary.component.scss']
})
export class VolunteerSummaryComponent implements OnInit {
  @Input() summary: { volunteers: any[]; cash: any } = { volunteers: [], cash: { totalAmount: 0, count: 0 } };
  totalVolunteerAmount: number = 0;
  grandTotalAmount: number = 0;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.calculateTotalAmount();
  }

  calculateTotalAmount(): void {
    this.totalVolunteerAmount = this.summary.volunteers.reduce((sum, v) => sum + v.totalAmount, 0);
    this.grandTotalAmount = this.totalVolunteerAmount + (this.summary.cash?.totalAmount || 0);
  }

}
