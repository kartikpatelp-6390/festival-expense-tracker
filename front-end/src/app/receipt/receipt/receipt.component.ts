import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
      this.fundService.downloadReceipt(this.fundId, 'send').subscribe((res: any) => {
        const url = res.url;

        const message = `🙏 Thank you for your contribution!

📄 Get your collection receipt from the link below:
${url}

🚩 Jay Shree Ram 🚩`;

        // const encodedMessage = encodeURIComponent(`Thank you for contribution :) %0a Get you collection receipt from following link: \n${url}\n Jay Shree Ram`);
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
      });
      this.activeModal.close();
    } catch (err) {
      alert('Failed to generate receipt');
    }
  }

  close() {
    this.activeModal.dismiss();
  }

}
