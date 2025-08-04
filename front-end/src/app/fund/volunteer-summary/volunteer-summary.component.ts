import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-volunteer-summary',
  templateUrl: './volunteer-summary.component.html',
  styleUrls: ['./volunteer-summary.component.scss']
})
export class VolunteerSummaryComponent {
  @Input() summary: any[] = [];

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
