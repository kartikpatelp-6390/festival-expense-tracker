import { Component, OnInit } from '@angular/core';
import { VolunteerService } from '../volunteer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-volunteer-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  volunteers: any[] = [];
  total = 0;
  page = 1;
  limit = 10;
  search = '';

  constructor(private volunteerService: VolunteerService, private router: Router) { }

  ngOnInit(): void {
    this.loadVolunteers();
  }

  loadVolunteers(){
    this.volunteerService.getVolunteers(this.page, this.limit, this.search).subscribe((res) => {
      this.volunteers = res['data'];
      this.total = res['pagination'].total;
    })
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadVolunteers();
  }

  editVolunteer(id: string): void {
    this.router.navigate(['/volunteer/edit', id]);
  }

  addVolunteer(): void {
    this.router.navigate(['/volunteer/add']);
  }

  protected readonly Math = Math;
}
