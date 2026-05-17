const { test, expect } = require('@playwright/test');

test.describe('Far Beyond Gear - Smoke / E2E Tests', () => {

    test('Homepage încarcă corect și afișează produsele', async ({ page }) => {
        // Navigam către pagina index
        await page.goto('/index.html');

        // Verificăm titlul
        await expect(page).toHaveTitle(/Far Beyond Gear|Index/i);

        // Navigăm la produse
        await page.goto('/products.html');

        // Așteptăm să se încarce containerul de produse
        const productsGrid = page.locator('#productList');
        await productsGrid.waitFor();

        // Verificăm dacă sunt produse afișate
        const productCards = page.locator('.product-card');
        await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    });

    test('Căutarea unui produs funcționează', async ({ page }) => {
        await page.goto('/products.html');

        // Căutăm "marshall"
        await page.fill('#searchInput', 'marshall');
        await page.click('#applyFilters');

        // Așteptăm stabilizarea DOM-ului
        await page.waitForTimeout(1000);

        // Verificăm că a apărut cel puțin un produs cu "marshall" în nume
        const productTitle = page.locator('.product-card-name').first();
        await expect(productTitle).toBeVisible();
        const titleText = await productTitle.textContent();
        expect(titleText.toLowerCase()).toContain('marshall');
    });

    test('Adăugarea în coș și verificarea coșului', async ({ page }) => {
        // Folosim localStorage magic conform README_TESTING.md sau simulăm click pe coș
        await page.goto('/products.html');

        // Așteptăm să se încarce produsele
        await page.waitForTimeout(1000);

        // Așteptăm un produs
        const firstProductAddToCartBtn = page.locator('.btn-add-cart').first();
        await firstProductAddToCartBtn.waitFor();
        await firstProductAddToCartBtn.click();

        // Navigăm la coș
        await page.goto('/cart.html');

        // Verificăm elementele coșului
        const cartItems = page.locator('#cartContainer table tbody tr');
        await expect(cartItems.first()).toBeVisible();

        // Mergem spre checkout
        const checkoutBtn = page.getByRole('link', { name: /mergi la checkout/i });
        await checkoutBtn.click();

        // Așteptăm pagina de checkout
        await expect(page).toHaveURL(/checkout.html/);
        await expect(page.locator('form#checkoutForm')).toBeVisible();
    });
});
