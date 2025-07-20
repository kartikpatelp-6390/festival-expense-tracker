import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() limit: number = 1;

  @Output() pageChanged = new EventEmitter<number>();

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChanged.emit(page);
    }
  }

  getVisiblePages(): number[] {
    const maxVisible = 10;
    const pages: number[] = [];

    console.log(this.totalPages);
    if (this.totalPages <= maxVisible) {
      // Show all pages if total pages are fewer than or equal to maxVisible
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end for sliding window
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;

      // Adjust start if end goes beyond totalPages
      if (end > this.totalPages) {
        end = this.totalPages;
        start = end - maxVisible + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  protected readonly Math = Math;
}
