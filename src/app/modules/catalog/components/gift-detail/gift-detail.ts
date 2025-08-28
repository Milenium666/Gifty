import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GiftService } from '../../../../core/services/gift';
import { Gift } from '../../../../core/interfaces/gift';
import { Observable, Subscription, map } from 'rxjs';
import { GiftItem } from '../gift-card/gift-card';

@Component({
  selector: 'app-gift-page',
  standalone: true,
  imports: [CommonModule, RouterModule, GiftItem],
  templateUrl: './gift-detail.html',
  styleUrl: './gift-detail.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiftPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly gifts = inject(GiftService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected gift?: Gift;
  protected relatedGifts$?: Observable<Gift[]>;

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      if (!id) return;
      this.gifts.getGift(id).subscribe((g) => {
        this.gift = g;
        if (g) {
          this.relatedGifts$ = this.gifts
            .getGifts()
            .pipe(map((all) => all.filter((x) => x.id !== g.id && x.category === g.category).slice(0, 6)));
        } else {
          this.relatedGifts$ = undefined;
        }
        this.cdr.markForCheck();
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
