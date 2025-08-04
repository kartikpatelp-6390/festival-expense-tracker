import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-unpaid-list',
  templateUrl: './unpaid-list.component.html',
  styleUrls: ['./unpaid-list.component.scss']
})
export class UnpaidListComponent {
  @Input() houses: any[] = [];

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
