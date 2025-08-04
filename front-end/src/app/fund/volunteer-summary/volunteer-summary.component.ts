import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-volunteer-summary',
  templateUrl: './volunteer-summary.component.html',
  styleUrls: ['./volunteer-summary.component.scss']
})
export class VolunteerSummaryComponent implements OnInit {
  @Input() summary: any[] = [];
  totalAmount: number = 0;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.calculateTotalAmount();
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.summary.reduce((sum, v) => sum + v.totalAmount, 0);
  }

}
