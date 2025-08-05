import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from "../inventory.service";
import { NotificationService } from "../../services/notification.service";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  inventoryForm: FormGroup;
  categories: string[] = [];

  isEditMode = false;
  inventoryId: string = ''
  role: string | null = '';
  user: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private notification: NotificationService,
    private authService: AuthService,
  ) {
    this.inventoryForm = this.fb.group({
      item: ['', Validators.required],
      category: ['', Validators.required],
      count: ['', Validators.required],
      place: ['', Validators.required],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.user = this.authService.getUser();

    this.loadCategories();

    this.inventoryId = this.route.snapshot.params['id'];

    if (this.inventoryId) {
      this.isEditMode = true;
      this.inventoryService.getInventoryById(this.inventoryId).subscribe(res => {
        const inventory = res['data'];

        this.inventoryForm.patchValue({
          ...inventory,
        });
      });
    }
  }

  loadCategories() {
    this.inventoryService.getAllCategories().subscribe((res: string[]) => {
      this.categories = res['data'];
    });
  }

  onSubmit() {
    if (!this.inventoryForm.valid) {
      this.inventoryForm.markAllAsTouched(); // 🔍 Triggers validation messages
      return;
    };

    const formData = { ...this.inventoryForm.value };

    if (this.isEditMode) {
      this.inventoryService.updateInventory(this.inventoryId, formData).subscribe(() => {
        this.notification.success('Inventory Updated Successfully.');
        this.router.navigate(['/inventory']);
      });
    } else {
      this.inventoryService.createInventory(formData).subscribe(() => {
        this.notification.success('Inventory Added Successfully.');
        this.router.navigate(['/inventory']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/inventory']);
  }

}
