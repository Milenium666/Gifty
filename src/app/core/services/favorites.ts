import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, docSnapshots, collection, collectionData, query } from '@angular/fire/firestore';
import { Observable, map, switchMap, catchError, of, throwError, from } from 'rxjs';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
	private readonly firestore = inject(Firestore);
	private readonly auth = inject(AuthService);

	private favDoc(userId: string, giftId: string) {
		return doc(this.firestore, `users/${userId}/favorites/${giftId}`);
	}

	private getUserId(): Observable<string | null> {
		return this.auth.user$.pipe(map((u) => u?.uid ?? null));
	}

	addFavorite(giftId: string) {
		return this.getUserId().pipe(
			switchMap((uid) => {
				if (!uid) return throwError(() => new Error('AUTH_REQUIRED'));
				return from(setDoc(this.favDoc(uid, giftId), { createdAt: Date.now() }));
			})
		);
	}

	removeFavorite(giftId: string) {
		return this.getUserId().pipe(
			switchMap((uid) => {
				if (!uid) return throwError(() => new Error('AUTH_REQUIRED'));
				return from(deleteDoc(this.favDoc(uid, giftId)));
			})
		);
	}

	isFavorite$(giftId: string): Observable<boolean> {
		return this.getUserId().pipe(
			switchMap((uid) => {
				if (!uid) return of(false);
				const ref = this.favDoc(uid, giftId);
				return docSnapshots(ref).pipe(
					map((snap) => snap.exists()),
					catchError(() => of(false))
				);
			})
		);
	}

	getFavoriteIds(): Observable<string[]> {
		return this.getUserId().pipe(
			switchMap((uid) => {
				if (!uid) return of<string[]>([]);
				const ref = collection(this.firestore, `users/${uid}/favorites`);
				return collectionData(query(ref), { idField: 'id' }).pipe(
					map((docs) => (docs as { id: string }[]).map((d) => d.id))
				);
			})
		);
	}
}

 