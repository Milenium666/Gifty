import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';
import { TuiCheckbox, TuiNativeSelect } from '@taiga-ui/kit';
import { TuiTextfield } from '@taiga-ui/core/components/textfield';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subscription, of, delay, switchMap } from 'rxjs';
import { Gift } from '../../../core/interfaces/gift';
import { GiftService } from '../../../core/services/gift';
import { GiftItem } from '../../catalog/components/gift-card/gift-card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, GiftItem, TuiButton, TuiCheckbox, TuiNativeSelect, TuiTextfield],
  templateUrl: './home.html',
  styleUrls: ['./home.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly gifts = inject(GiftService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly occasions: string[] = [
    'День рождения',
    'Новый год',
    'Свадьба',
    'Годовщина',
    '8 Марта',
    '23 Февраля',
    'Выпускной',
    'Новоселье',
    'Профессиональный праздник',
  ];

  private readonly occasionToCategories: Record<string, string[]> = {
    'День рождения': ['техника', 'книги', 'настольные игры', 'музыка'],
    'Новый год': ['настольные игры', 'кофе/чай', 'техника'],
    'Свадьба': ['косметика', 'хобби/DIY', 'путешествия'],
    'Годовщина': ['косметика', 'кофе/чай', 'музыка'],
    '8 Марта': ['косметика', 'книги', 'кофе/чай'],
    '23 Февраля': ['спорт', 'техника', 'кофе/чай'],
    'Выпускной': ['техника', 'книги', 'музыка'],
    'Новоселье': ['кофе/чай', 'хобби/DIY', 'настольные игры'],
    'Профессиональный праздник': ['книги', 'кофе/чай', 'техника']
  };

  readonly budgets: string[] = ['до 1000 ₽', 'до 5000 ₽', 'больше 5000 ₽'];

  readonly interestsList: string[] = [
    'спорт',
    'книги',
    'техника',
    'музыка',
    'косметика',
    'путешествия',
    'настольные игры',
    'кофе/чай',
    'хобби/DIY',
  ];

  form: FormGroup = this.fb.group({
    occasion: [this.occasions[0] ?? '', Validators.required],
    budget: [this.budgets[0] ?? '', Validators.required],
    interests: this.fb.array(this.interestsList.map(() => this.fb.control(false)))
  });

  stage: 'form' | 'loading' | 'result' = 'form';
  selectedGift: Gift | null = null;


  private subs = new Subscription();

  get interestsArray(): FormArray {
    return this.form.get('interests') as FormArray;
  }

  ngOnInit(): void {

    const sub = this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          const giftId = params.get('giftId');
          if (!giftId) {
            return of(null);
          }
          this.stage = 'loading';
          return this.gifts.getGift(giftId).pipe(delay(300));
        })
      )
      .subscribe((gift) => {
        if (gift) {
          this.selectedGift = gift;
          this.stage = 'result';
          this.cdr.markForCheck();
        } else {
          // Очистка состояния при переходе на главную без giftId
          this.selectedGift = null;
          this.stage = 'form';
          this.cdr.markForCheck();
        }
      });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.stage = 'loading';

    const selectedInterests = this.interestsList.filter((_, i) => this.interestsArray.at(i).value === true);
    const selectedBudget = this.form.get('budget')?.value as string;
    const selectedOccasion = this.form.get('occasion')?.value as string;
    const occasionCats = this.occasionToCategories[selectedOccasion] || [];

    const sub = this.gifts.getGifts()
      .pipe(delay(600))
      .subscribe((all) => {
        // 1) Точное совпадение по интересам и бюджету
        let candidates = all.filter((g) => selectedInterests.includes(g.category) && g.priceRange === selectedBudget);
        // 2) Если пусто — по интересам
        if (candidates.length === 0) {
          candidates = all.filter((g) => selectedInterests.includes(g.category));
        }
        // 2.5) Если пусто — по поводу (категории, связанные с поводом)
        if (candidates.length === 0 && occasionCats.length > 0) {
          candidates = all.filter((g) => occasionCats.includes(g.category));
        }
        // 3) Если пусто — по бюджету
        if (candidates.length === 0) {
          candidates = all.filter((g) => g.priceRange === selectedBudget);
        }
        // 4) Фолбэк — любые
        if (candidates.length === 0) {
          candidates = all;
        }

        if (candidates.length > 0) {
          const idx = Math.floor(Math.random() * Math.max(1, candidates.length));
          this.selectedGift = candidates[idx] ?? null;
        } else {
          this.selectedGift = null;
        }
        this.stage = 'result';
        this.cdr.markForCheck();
      });
    this.subs.add(sub);
  }

  viewCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}


