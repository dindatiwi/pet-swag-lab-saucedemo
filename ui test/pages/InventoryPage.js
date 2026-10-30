export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.openMenuButton = page.locator('[data-test="open-menu"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  product(productId) {
    return this.page
      .locator('[data-test="inventory-item"]')
      .filter({ has: this.page.locator(`#add-to-cart-${productId}`) });
  }

  async getProductDetails(productId) {
    const product = this.product(productId);
    return {
      name: await product.locator('[data-test="inventory-item-name"]').innerText(),
      description: await product.locator('[data-test="inventory-item-desc"]').innerText(),
      price: await product.locator('[data-test="inventory-item-price"]').innerText(),
    };
  }

  async addToCart(productId) {
    await this.page.locator(`#add-to-cart-${productId}`).click();
  }

  removeButton(productId) {
    return this.page.locator(`#remove-${productId}`);
  }

  async openCart() {
    await this.cartLink.click();
  }
}
