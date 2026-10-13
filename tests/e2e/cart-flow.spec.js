import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage.js';

test.describe('Flux cos', () => {
  test('doua produse adaugate actualizeaza contorul', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.goto();

    await products.addToCart('Warlock Bass');
    await expect(products.cartLink).toContainText('(1)');

    await products.addToCart('Dimebag ML');
    await expect(products.cartLink).toContainText('(2)');
  });

  test('produsul adaugat apare in pagina cosului', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.goto();

    await products.addToCart('Warlock Bass');
    await products.cartLink.click();
    await expect(page.getByText('Warlock Bass').first()).toBeVisible();
  });
});