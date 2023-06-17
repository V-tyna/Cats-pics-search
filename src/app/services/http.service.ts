import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { KEYS } from '../configs/keys';
import { Cat } from '../models/cat';
import { PaginationParams } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  public getAllCats(paramsObj: PaginationParams = { page: 0, limit: 10 }): Observable<Cat[]> {
    return this.http.get<Cat[]>(KEYS.BASIC_URL + '/images', {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEYS.CATS_API
      },
      params: new HttpParams({
        fromObject: paramsObj
      })
    });
  }
}
