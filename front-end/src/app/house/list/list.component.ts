import { Component, OnInit } from '@angular/core';
import { HouseService } from '../house.service';
import { Router } from '@angular/router';

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

  constructor(private houseService: HouseService, private router: Router) { }

  ngOnInit(): void {
    this.loadHouses();
  }

  loadHouses(){
    this.houseService.getHouses(this.page, this.limit, this.search).subscribe((res) => {
      this.houses = res['data'];
      this.total = res['pagination'].total;
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

}
