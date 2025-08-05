import { Component, OnInit } from '@angular/core';
import { InventoryService } from "../inventory.service";
import { Router } from '@angular/router';
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  inventories: any[] = [];
  categories: string[] = [];

  total = 0;
  page = 1;
  limit = 10;
  search = '';
  customSearch: any = {};
  role: string | null = '';
  user: any = null;
  selectedNote:string = '';

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories() {
    this.customSearch = {};

    this.inventoryService.getInventories(this.page, this.limit, this.search, '', this.customSearch).subscribe((res) => {
      this.inventories = res['data'];
      this.total = res['pagination'].totalPages;
    });
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadInventories();
  }

  editInventory(id: string) {
    this.router.navigate(['/inventory/edit', id]);
  }

  addInventory() {
    this.router.navigate(['/inventory/add']);
  }

  deleteInventory(id: string) {
    if(confirm('Are you sure want to delete this inventory ?')) {
      this.inventoryService.deleteInventory(id).subscribe({
        next: () => {
          this.notification.success('Inventory Deleted Successfully.');
          this.loadInventories();
        },
        error: err => {
          this.notification.error('Failed to delete inventory');
        }
      })
    }
  }

  setSelectedNote(note: string) {
    this.selectedNote = note;
  }

  loadCategories() {
    this.inventoryService.getAllCategories().subscribe((res: string[]) => {
      this.categories = res['data'];
    });
  }

}
