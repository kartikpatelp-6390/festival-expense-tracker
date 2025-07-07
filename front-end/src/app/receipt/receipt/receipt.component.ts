import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {FundService} from "../../fund/fund.service";

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  @Input() fundId: string = '';
  @Input() phoneNumbers: string[] = [];

  selectedPhone: string = '';
  customPhone: string = '';
  errorMessage: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fundService: FundService,
  ) { }

  ngOnInit() {
    if (this.phoneNumbers.length > 0) {
      this.selectedPhone = this.phoneNumbers[0]; // default selection
    }
  }

  getFinalPhone(): string {
    let phone = this.customPhone || this.selectedPhone;
    if (phone && !phone.startsWith('91')) {
      phone = '91' + phone.replace(/[^0-9]/g, '');
    }
    return phone;
  }

  async sendReceipt() {
    const phone = this.getFinalPhone();
    console.log('phone');
    console.log(phone);
    if (!phone) {
      this.errorMessage = 'Please add a number.';
      return;
    }

    try {
      console.log(this.fundId);
      const blob = await this.fundService.downloadReceipt(this.fundId).toPromise();

      const fileName = `Receipt_${this.fundId}.pdf`;
      const blobUrl = window.URL.createObjectURL(blob);

      // Download
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      a.click();

      // WhatsApp
      const msg = `Thank you for contribution:\n\n`;
      const encodedMsg = encodeURIComponent(msg + fileName);
      window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');

      this.activeModal.close();
    } catch (err) {
      alert('Failed to generate receipt');
    }
  }

  close() {
    this.activeModal.dismiss();
  }

}
