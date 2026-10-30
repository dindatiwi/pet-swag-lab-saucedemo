export class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItem = page.locator('[data-test="inventory-item"]');
  }

  async getProductDetails() {
    return {
      name: await this.cartItem.locator('[data-test="inventory-item-name"]').innerText(),
      description: await this.cartItem.locator('[data-test="inventory-item-desc"]').innerText(),
      price: await this.cartItem.locator('[data-test="inventory-item-price"]').innerText(),
    };
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
