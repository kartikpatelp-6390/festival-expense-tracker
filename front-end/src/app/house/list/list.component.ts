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

  constructor(private houseService: HouseService, private router: Router) { }

  ngOnInit(): void {
    this.houseService.getHouses().subscribe((data) => {
      this.houses = data;
    });
  }

  editHouse(id: string) {
    this.router.navigate(['/house/edit', id]);
  }

  addHouse() {
    this.router.navigate(['/house/add']);
  }

}
