import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftItem } from '../../catalog/components/gift-card/gift-card';
import { GiftService } from '../../../core/services/gift';
import { FavoritesService } from '../../../core/services/favorites';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { Gift } from '../../../core/interfaces/gift';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPage implements OnInit, OnDestroy {
  private readonly gifts = inject(GiftService);
  private readonly favorites = inject(FavoritesService);

  @ViewChild('favVc', { read: ViewContainerRef, static: true })
  private favVc!: ViewContainerRef;

  private sub?: Subscription;
  protected isEmpty = true;

  ngOnInit(): void {
    const favoriteGifts$: Observable<Gift[]> = combineLatest([
      this.gifts.getGifts(),
      this.favorites.getFavoriteIds(),
    ]).pipe(
      map(([all, ids]) => all.filter((g) => g.id && ids.includes(g.id)))
    );

    this.sub = favoriteGifts$.subscribe((items) => this.render(items));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private render(items: Gift[]): void {
    this.favVc.clear();
    this.isEmpty = items.length === 0;
    items.forEach((gift) => {
      const ref = this.favVc.createComponent(GiftItem);
      ref.setInput('gift', gift);
    });
  }
}
