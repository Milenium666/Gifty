import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { Gift } from '../interfaces/gift';

@Injectable({ providedIn: 'root' })
export class LocalCacheGiftService {
  private readonly storageKey = 'gifts';
  private readonly apiUrl = '/api/gifts'; 

  private http = inject(HttpClient);

  getGifts(): Observable<Gift[]> {
    const cached = localStorage.getItem(this.storageKey);
    const localData: Gift[] = cached ? JSON.parse(cached) : [];
    return of(localData).pipe(
      switchMap((local) =>
        this.http.get<Gift[]>(this.apiUrl).pipe(
          tap((apiData) => {
            if (JSON.stringify(local) !== JSON.stringify(apiData)) {
              localStorage.setItem(this.storageKey, JSON.stringify(apiData));
            }
          }),
          switchMap((apiData) => {
            if (JSON.stringify(local) !== JSON.stringify(apiData)) {
              return of(apiData);
            }
            return of(local);
          })
        )
      )
    );
  }
}
