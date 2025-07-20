import { Component, OnInit } from '@angular/core';
import { HouseService } from '../house.service';
import { Router } from '@angular/router';
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-house-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  houses: any[] = [];
  total = 0;
  page = 1;
  limit = 10;
  search = '';

  constructor(
    private houseService: HouseService,
    private router: Router,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadHouses();
  }

  loadHouses(){
    this.houseService.getHouses(this.page, this.limit, this.search).subscribe((res) => {
      this.houses = res['data'];
      this.total = res['pagination'].totalPages;
    })
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadHouses();
  }

  editHouse(id: string) {
    this.router.navigate(['/house/edit', id]);
  }

  addHouse() {
    this.router.navigate(['/house/add']);
  }

  deleteHouse(id: string) {
    if(confirm('Are you sure want to delete this house ?')) {
      this.houseService.deleteHouse(id).subscribe({
        next: () => {
          this.notification.success('House deleted successfully.');
          this.loadHouses();
        },
        error: err => {
          this.notification.error('Failed to delete this house.');
        }
      })
    }
  }

}
