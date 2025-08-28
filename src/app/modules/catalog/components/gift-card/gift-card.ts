import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';
import { Router, RouterModule } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core/components/alert';
import { FavoritesService } from '../../../../core/services/favorites';
import { Gift } from '../../../../core/interfaces/gift';
import { AuthService } from '../../../../core/services/auth';
import { take, BehaviorSubject } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-gift-item',
  standalone: true,
  imports: [CommonModule, RouterModule, TuiButton],
  templateUrl: './gift-card.html',
  styleUrl: './gift-card.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiftItem implements OnInit, OnDestroy {
  private readonly favorites = inject(FavoritesService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly alerts = inject(TuiAlertService);

  @Input() gift!: Gift;
  @Input() isClickable = true;

  protected readonly isFavorite$ = new BehaviorSubject<boolean>(false);
  protected readonly isLoading$ = new BehaviorSubject<boolean>(false);
  private isFavoriteSub?: import('rxjs').Subscription;

  public placeholderUrl =
    'https://img.freepik.com/premium-photo/a-gift-box-with-a-bow-on-it_439473-310.jpg?size=626&ext=jpg';

  public onImageError(event: Event) {
    if (event && event.target) {
      (event.target as HTMLImageElement).src = this.placeholderUrl;
    }
  }

  ngOnInit(): void {
    if (!this.gift?.id) return;

    this.isFavoriteSub = (this.favorites as FavoritesService)
      .isFavorite$(this.gift.id)
      .subscribe((v: boolean) => {
        this.isFavorite$.next(v);
      });
  }

  ngOnDestroy(): void {
    this.isFavoriteSub?.unsubscribe();
  }

  protected toggleFavorite(): void {
    if (!this.gift?.id) return;
    const giftId = this.gift.id as string;

    (this.auth as AuthService).user$.pipe(take(1)).subscribe((user: User | null) => {
      if (!user) {
        this.router.navigate(['/auth'], {
          queryParams: { returnUrl: '/', giftId },
        });
        return;
      }
      const currentState = this.isFavorite$.value;
      this.isLoading$.next(true);
      if (currentState) {
        (this.favorites as FavoritesService).removeFavorite(giftId).subscribe(() => {
          this.isFavorite$.next(false);
          this.isLoading$.next(false);
          this.alerts.open(`«${this.gift.title}» удален из избранного`).subscribe();
        });
      } else {
        (this.favorites as FavoritesService).addFavorite(giftId).subscribe(() => {
          this.isFavorite$.next(true);
          this.isLoading$.next(false);
          this.alerts.open(`«${this.gift.title}» добавлен в избранное`).subscribe();
        });
      }
    });
  }
}
