import { test, expect } from '@playwright/test';

test('adaugarea unui produs in cos actualizeaza contorul', async ({ page }) => {
  await page.goto('http://localhost:5173/products');

  await page
    .getByRole('article')
    .filter({ hasText: 'Warlock Bass' })
    .getByRole('button', { name: 'Adaugă' })
    .click();

  await expect(page.getByText(/Coș \(1\)/)).toBeVisible();
});

test('produsul epuizat nu poate fi adaugat in cos', async ({ page }) => {
  await page.goto('http://localhost:5173/products');
  const card = page.getByRole('article').filter({ hasText: 'Mockingbird Extreme' });
  await expect(card.getByText('Epuizat')).toBeVisible();
  await expect(card.getByRole('button', { name: 'Adaugă' })).toHaveCount(0);
});