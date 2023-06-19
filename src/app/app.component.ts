import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { KEYS } from './configs/keys';
import { Cat } from './models/cat';
import { PaginationData } from './models/pagination';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public paginationData: PaginationData = {
    startFromIndex: 0,
    catsPerPage: 10,
    pageIndex: 0
  }
  public allCatLength: number = 0;
  public cats$: Observable<Cat[]> | null = null;
  private catsSubscription?: Subscription;
  private filteredCats$: Cat[] | null = null;

  constructor(private httpService: HttpService) { }

  public ngOnInit(): void {
    this.cats$ = this.httpService.getAllCats();

    this.catsSubscription = this.httpService.getAllCats({ page: 0, limit: KEYS.UNLIMITED }).subscribe((cats: Cat[]) => {
      this.allCatLength = cats.length;
    })
  }

  public paginationParamsUpdate(event: PaginationData) {
    this.paginationData.startFromIndex = event.startFromIndex;
    this.paginationData.catsPerPage = event.catsPerPage;
    this.paginationData.pageIndex = event.pageIndex;

    if (!this.filteredCats$) {
      this.cats$ = this.httpService.getAllCats({ page: this.paginationData.pageIndex, limit: this.paginationData.catsPerPage });
    } else {
      this.cats$ = of(this.filteredCats$).pipe(map((cats: Cat[]) => {
        const start = this.paginationData.startFromIndex;
        const end = this.paginationData.catsPerPage * (this.paginationData.pageIndex + 1);
        return cats.slice(start, end);
      }));
    }
  }

  public updateCatsFilter(newCats$: Observable<Cat[]>): void {
    this.cats$ = newCats$.pipe(
      map((cats: Cat[]) => {
        return cats.slice(this.paginationData.startFromIndex, this.paginationData.catsPerPage)
      })
    );

    this.catsSubscription?.unsubscribe();
    this.catsSubscription = newCats$.subscribe((cats: Cat[]) => {
      this.filteredCats$ = cats;
      this.allCatLength = cats.length;
    });
  }

  public ngOnDestroy(): void {
    this.catsSubscription?.unsubscribe();
  }
}
