import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').innerText()).toContain('Welcome');
});

test('Фильтрация подарков по бюджету', async ({ page }) => {
  await page.goto('/catalog');
  await page.selectOption('select.gifts__select', { label: 'до 1000 ₽' });
  await expect(page.locator('.card')).toHaveCount(1); // ожидаем 1 подарок
  await expect(page.locator('.card__meta')).toContainText('до 1000 ₽');
});

test('Поиск подарка по названию', async ({ page }) => {
  await page.goto('/catalog');
  await page.fill('input.gifts__input', 'Книга');
  await expect(page.locator('.card__title')).toContainText('Книга');
});

test('Переход к деталям подарка', async ({ page }) => {
  await page.goto('/catalog');
  await page.click('.card__body');
  await expect(page).toHaveURL(/catalog\/\d+/);
  await expect(page.locator('.gift__title')).toBeVisible();
});
