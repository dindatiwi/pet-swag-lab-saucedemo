export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.inventoryItem = page.locator('[data-test="inventory-item"]');
    this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]');
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]');
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async fillCustomerInformation(customer) {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async getProductDetails() {
    return {
      name: await this.inventoryItem.locator('[data-test="inventory-item-name"]').innerText(),
      description: await this.inventoryItem.locator('[data-test="inventory-item-desc"]').innerText(),
      price: await this.inventoryItem.locator('[data-test="inventory-item-price"]').innerText(),
    };
  }

  async getPriceSummary() {
    return {
      subtotal: await this.subtotalLabel.innerText(),
      tax: await this.taxLabel.innerText(),
      total: await this.totalLabel.innerText(),
    };
  }

  async finish() {
    await this.finishButton.click();
  }
}
