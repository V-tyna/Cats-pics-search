import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { KEYS } from 'src/app/configs/keys';
import { Cat } from 'src/app/models/cat';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {
  public breedTypes = ['all breeds', 'long-haired', 'british', 'domestic'];

  private breedFilterChanged = new Subject<string>();
  private catsOnSelect$: Observable<Cat[]> | null = null;

  @Output() catsChanged = new EventEmitter<Observable<Cat[]>>();

  constructor(private httpService: HttpService) { }

  public ngOnInit(): void {
    this.breedFilterChanged.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((filterValue: string) => {
        return this.httpService.getAllCats({ page: 0, limit: KEYS.UNLIMITED }).pipe(
          map((data: Cat[]) => data.filter((cat: Cat) => {
            return cat.breed_ids && cat.breed_ids.includes(filterValue)
          }))
        );
      })
    ).subscribe((cats: Cat[]) => {
      this.catsChanged.emit(of(cats));
    });
  }

  public onBreedFilterChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.breedFilterChanged.next(value);
  }

  public onSelectionChange(event: MatSelectChange): void {
    const value = event.value;

    if (value === 'all breeds') {
      this.catsOnSelect$ = this.httpService.getAllCats({ page: 0, limit: KEYS.UNLIMITED });
    } else {
      this.catsOnSelect$ = this.httpService.getAllCats({ page: 0, limit: KEYS.UNLIMITED }).pipe(
        map((data: Cat[]) => data.filter((cat: Cat) => {
          return cat.breed_ids && cat.breed_ids.includes(value)
        }))
      );
    }

    this.catsChanged.emit(this.catsOnSelect$);
  }
}
