import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage.js';

test('pagina produsului afiseaza numele din catalog', async ({ page }) => {
  const products = new ProductsPage(page);
  await products.goto();

  await products
    .card('Warlock Bass')
    .getByRole('link', { name: /Warlock Bass/ })
    .first()
    .click();

  await expect(page).toHaveURL(/\/product\/\d+/);
  await expect(page.getByRole('heading', { name: /Warlock Bass/ })).toBeVisible();
});
