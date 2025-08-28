import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Gift } from '../interfaces/gift';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GiftService {
  private readonly firestore = inject(Firestore);
  private readonly giftsRef = () => collection(this.firestore, 'gifts');

  private readonly storageKey = 'gifts';

  getGifts(): Observable<Gift[]> {
    const cached = localStorage.getItem(this.storageKey);
    const localData: Gift[] = cached ? JSON.parse(cached) : [];
    return of(localData).pipe(
      switchMap((local) =>
        collectionData(this.giftsRef(), { idField: 'id' }).pipe(
          tap((apiData) => {
            if (JSON.stringify(local) !== JSON.stringify(apiData)) {
              localStorage.setItem(this.storageKey, JSON.stringify(apiData));
            }
          }),
          switchMap((apiData) => {
            if (JSON.stringify(local) !== JSON.stringify(apiData)) {
              return of(apiData as Gift[]);
            }
            return of(local);
          })
        )
      )
    );
  }

  getGift(id: string): Observable<Gift | undefined> {
    return docData(doc(this.firestore, `gifts/${id}`), { idField: 'id' }) as Observable<Gift | undefined>;
  }

  addGift(gift: Gift) {
    return addDoc(this.giftsRef(), gift);
  }

  updateGift(id: string, data: Partial<Gift>) {
    return updateDoc(doc(this.firestore, `gifts/${id}`), data);
  }

  deleteGift(id: string) {
    return deleteDoc(doc(this.firestore, `gifts/${id}`));
  }
}
