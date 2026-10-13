import { test, expect } from '@playwright/test';

test('cautarea filtreaza lista de produse', async ({ page }) => {
  await page.goto('http://localhost:5173/products');

  await page.getByPlaceholder('Caută produs...').fill('Warlock');
  await page.getByRole('button', { name: 'Aplică filtre' }).click();

  const cards = page.getByRole('article');

  // asteapta (cu retry) pana apare cel putin un rezultat cu "Warlock"
  await expect(cards.first()).toContainText('Warlock');

  // nu mai ramane niciun produs fara "Warlock"
  await expect(cards.filter({ hasNotText: 'Warlock' })).toHaveCount(0);

  // produsul din alta familie a disparut
  await expect(cards.filter({ hasText: 'Mockingbird' })).toHaveCount(0);
});