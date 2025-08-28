import { matchBudget } from './budget-filter.util';

describe('matchBudget', () => {
  it('should match "до 1000 ₽"', () => {
    expect(matchBudget('до 900 ₽', 'до 1000 ₽')).toBe(true);
    expect(matchBudget('до 1500 ₽', 'до 1000 ₽')).toBe(false);
  });

  it('should match "больше 5000 ₽"', () => {
    expect(matchBudget('больше 6000 ₽', 'больше 5000 ₽')).toBe(true);
    expect(matchBudget('до 4000 ₽', 'больше 5000 ₽')).toBe(false);
  });

  it('should match range "от 1000 до 5000 ₽"', () => {
    expect(matchBudget('от 2000 до 4000 ₽', 'от 1000 до 5000 ₽')).toBe(true);
    expect(matchBudget('от 6000 до 7000 ₽', 'от 1000 до 5000 ₽')).toBe(false);
  });

  it('should match range "1000 до 5000"', () => {
    // debug
    const util = require('./budget-filter.util');
    const gift1 = util.extractPriceRange('от 2000 до 4000 ₽');
    const filter = util.extractPriceRange('1000 до 5000');
    const gift2 = util.extractPriceRange('от 6000 до 7000 ₽');
    console.log('gift1:', gift1, 'filter:', filter, 'gift2:', gift2);
    expect(matchBudget('от 2000 до 4000 ₽', '1000 до 5000')).toBe(true);
    expect(matchBudget('от 6000 до 7000 ₽', '1000 до 5000')).toBe(false);
  });

  it('should match any budget if selected is empty or "Любой бюджет"', () => {
    expect(matchBudget('до 1000 ₽', '')).toBe(true);
    expect(matchBudget('до 1000 ₽', 'Любой бюджет')).toBe(true);
  });
});
