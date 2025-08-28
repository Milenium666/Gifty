export function matchBudget(priceRange: string, selected: string): boolean {
  if (!selected || selected === 'Любой бюджет') return true;
  const giftRange = extractPriceRange(priceRange);
  const filterRange = extractPriceRange(selected);

  // Фильтр "до N"
  if (/^до\s*\d+/.test(selected)) {
    return giftRange.max <= filterRange.max;
  }
  // Фильтр "больше N"
  if (/^больше\s*\d+/.test(selected)) {
    return giftRange.min >= filterRange.min;
  }
  // Фильтр диапазон "от N до M" или "N до M"
  if (/от\s*\d+\s*до\s*\d+/.test(selected) || /\d+\s*до\s*\d+/.test(selected)) {
    // Пересечение диапазонов: gift.min <= filter.max && gift.max >= filter.min
    return giftRange.min <= filterRange.max && giftRange.max >= filterRange.min;
  }
  // Если не распознано — любой бюджет
  return true;
}

export function extractPriceRange(priceRange: string): { min: number; max: number } {
  if (!priceRange) return { min: 0, max: Number.MAX_SAFE_INTEGER };
  // "до 1000 ₽"
  if (/до\s*\d+/.test(priceRange) && !/от\s*\d+/.test(priceRange)) {
    const maxMatch = priceRange.match(/до\s*(\d+)/);
    const max = maxMatch ? parseInt(maxMatch[1], 10) : Number.MAX_SAFE_INTEGER;
    return { min: 0, max: isFinite(max) ? max : Number.MAX_SAFE_INTEGER };
  }
  // "больше 5000 ₽"
  if (/больше\s*\d+/.test(priceRange)) {
    const minMatch = priceRange.match(/больше\s*(\d+)/);
    const min = minMatch ? parseInt(minMatch[1], 10) : 0;
    return { min: isFinite(min) ? min : 0, max: Number.MAX_SAFE_INTEGER };
  }
  // "от 1000 до 5000 ₽"
  let rangeMatch = priceRange.match(/от\s*(\d+)\s*до\s*(\d+)/);
  // "1000 до 5000"
  if (!rangeMatch) {
    rangeMatch = priceRange.match(/(\d+)\s*до\s*(\d+)/);
  }
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    return { min: isFinite(min) ? min : 0, max: isFinite(max) ? max : Number.MAX_SAFE_INTEGER };
  }
  // Если не распознано — любой бюджет
  return { min: 0, max: Number.MAX_SAFE_INTEGER };
}
