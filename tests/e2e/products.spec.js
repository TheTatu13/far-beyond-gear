import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage.js';

test.describe('Catalog produse', () => {
  let products;

  test.beforeEach(async ({ page }) => {
    products = new ProductsPage(page);
    await products.goto();
  });

  test('filtrul de pret returneaza doar produse din interval', async () => {
    await products.filterByPrice(1000, 2000);
    await expect
      .poll(async () => {
        const prices = await products.prices();
        return prices.length > 0 && prices.every((p) => p >= 1000 && p <= 2000);
      })
      .toBe(true);
  });

  test('cautarea fara rezultate nu afiseaza produse', async () => {
    await products.search('zzzzzzzz');
    await expect(products.cards).toHaveCount(0);
  });

  test('resetarea filtrelor readuce catalogul complet', async () => {
    await products.search('Warlock');
    await expect(products.cards.filter({ hasNotText: 'Warlock' })).toHaveCount(0);
    const filtered = await products.cards.count();

    await products.resetButton.click();
    await expect
      .poll(async () => products.cards.count())
      .toBeGreaterThan(filtered);
  });
});