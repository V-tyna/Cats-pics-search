import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { PaginationData } from 'src/app/models/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})

export class PaginationComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;

  @Input() allCatLength!: number;

  @Output() paginationDataChanged = new EventEmitter<PaginationData>();

  constructor() { }

  public ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = "Cats per page";
  }

  public handlePageEvent(e: PageEvent): void {
    const newPaginationData: PaginationData = {
      catsPerPage: e.pageSize,
      startFromIndex: e.pageIndex * e.pageSize,
      pageIndex: e.pageIndex
    }

    this.paginationDataChanged.emit(newPaginationData);
  }
}
