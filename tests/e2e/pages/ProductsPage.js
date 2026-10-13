export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.cards = page.getByRole('article');
    this.searchInput = page.getByPlaceholder('Caută produs...');
    this.minInput = page.getByPlaceholder('Min');
    this.maxInput = page.getByPlaceholder('Max');
    this.applyButton = page.getByRole('button', { name: 'Aplică filtre' });
    this.resetButton = page.getByRole('button', { name: 'Resetare' });
    this.cartLink = page.getByRole('link', { name: /Coș \(\d+\)/ });
  }

  async goto() {
    await this.page.goto('/products');
    await this.cards.first().waitFor();
  }

  card(name) {
    return this.cards.filter({ hasText: name });
  }

  async addToCart(name) {
    await this.card(name).getByRole('button', { name: 'Adaugă' }).click();
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.applyButton.click();
  }

  async filterByPrice(min, max) {
    await this.minInput.fill(String(min));
    await this.maxInput.fill(String(max));
    await this.applyButton.click();
  }

  async prices() {
    const texts = await this.cards.allInnerTexts();
    return texts
      .map((t) => t.match(/(\d+(?:\.\d+)?)\s*€/))
      .filter(Boolean)
      .map((m) => parseFloat(m[1]));
  }
}