import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormControl, FormGroup } from '@angular/forms';
import { TuiNativeSelect, TuiCheckbox } from '@taiga-ui/kit';
import { TuiTextfield } from '@taiga-ui/core/components/textfield';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Observable, map, startWith, debounceTime, distinctUntilChanged, combineLatest } from 'rxjs';
import { GiftService } from '../../../../core/services/gift';
import { Gift } from '../../../../core/interfaces/gift';
import { GiftItem } from '../gift-card/gift-card';
import { matchBudget } from '../../utils/budget-filter.util';

@Component({
  selector: 'app-gifts-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TuiNativeSelect, TuiTextfield, TuiCheckbox, GiftItem],
  templateUrl: './gift-list.html',
  styleUrl: './gift-list.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiftsPage implements OnInit {
  private readonly giftService = inject(GiftService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly gifts$: Observable<Gift[]> = this.giftService.getGifts();

  protected filterForm = new FormGroup({
    budget: new FormControl<string>(''),
    interests: new FormArray<FormControl<boolean | null>>([]),
    search: new FormControl<string>(''),
  });

  protected readonly filteredGifts$: Observable<Gift[]> = combineLatest([
    this.gifts$,
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue())),
  ]).pipe(
    map(([gifts, formValues]) => {
      const filters = {
        budget: formValues.budget || undefined,
        interests: this.getSelectedInterests().join(',') || undefined,
        search: formValues.search || undefined,
      };
      return this.applyFilters(gifts, filters);
    })
  );

  protected readonly occasions = ['День рождения', 'Новый год', 'Свадьба'];
  protected readonly interests = [
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
  protected readonly budgetsLabels: string[] = ['', 'до 1000 ₽', 'до 5000 ₽', 'больше 5000 ₽'];
  protected readonly budgetsOptions: string[] = ['Любой бюджет', 'до 1000 ₽', 'до 5000 ₽', 'больше 5000 ₽'];

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    const initSearch = qp.get('search') ?? '';
    const initBudget = qp.get('budget') ?? '';
    const initInterests = (qp.get('interests') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const interestsArray = new FormArray<FormControl<boolean | null>>(
      this.interests.map((cat) => new FormControl<boolean | null>(initInterests.includes(cat)))
    );

    this.filterForm.patchValue({
      budget: initBudget,
      search: initSearch,
    });
    this.filterForm.setControl('interests', interestsArray);

    this.filterForm.valueChanges
      .pipe(
        debounceTime(200),
        map((v) => {
          const selectedCats = this.getSelectedInterests();
          return {
            search: v.search?.trim() || undefined,
            interests: selectedCats.length ? selectedCats.join(',') : undefined,
            budget: v.budget || undefined,
          } as Record<string, string | undefined>;
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((filters) => {
        const queryParams: Record<string, string> = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            queryParams[key] = value;
          }
        });
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'merge',
        });
      });
  }

  protected applyFilters(gifts: Gift[], filters: { budget?: string; interests?: string; search?: string }): Gift[] {
    return gifts.filter((gift) => {
      // Фильтрация по бюджету
      const budgetMatch = filters.budget ? matchBudget(gift.priceRange, filters.budget) : true;

      // Фильтрация по интересам
      const interestsMatch = filters.interests
        ? filters.interests.split(',').some(cat => gift.category === cat.trim())
        : true;

      // Фильтрация по поиску
      const searchTerm = filters.search?.toLowerCase() || '';
      const searchMatch = searchTerm
        ? gift.title.toLowerCase().includes(searchTerm) ||
          gift.description?.toLowerCase().includes(searchTerm) ||
          gift.category?.toLowerCase().includes(searchTerm)
        : true;

      return budgetMatch && interestsMatch && searchMatch;
    });
  }

  private getSelectedInterests(): string[] {
    return this.filterForm.get('interests')?.value
      .map((selected: boolean | null, index: number) => (selected ? this.interests[index] : null))
      .filter(Boolean) as string[];
  }

  resetFilters(): void {
    this.filterForm.reset({
      budget: '',
      interests: this.interests.map(() => false),
      search: '',
    });
  }
}