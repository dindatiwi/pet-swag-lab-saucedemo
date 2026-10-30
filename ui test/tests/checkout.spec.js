import { randomInt, randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { OrderCompletePage } from '../pages/OrderCompletePage.js';

test('complete a purchase of the Sauce Labs Backpack', async ({ page }) => {
  const productId = 'sauce-labs-backpack';
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const orderCompletePage = new OrderCompletePage(page);

  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(inventoryPage.openMenuButton).toBeVisible();

  const expectedItem = await inventoryPage.getProductDetails(productId);
  await inventoryPage.addToCart(productId);
  await expect(inventoryPage.removeButton(productId)).toBeVisible();
  await expect(inventoryPage.cartBadge).toHaveText('1');
  await inventoryPage.openCart();

  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  expect(await cartPage.getProductDetails()).toEqual(expectedItem);
  await expect(cartPage.checkoutButton).toBeVisible();
  await cartPage.checkout();
  await expect(checkoutPage.title).toHaveText('Checkout: Your Information');

  const suffix = randomUUID().replaceAll('-', '').slice(0, 8);
  const customer = {
    firstName: `Casey${suffix}`,
    lastName: `Taylor${suffix}`,
    postalCode: String(randomInt(10000, 100000)),
  };
  await checkoutPage.fillCustomerInformation(customer);
  await expect(checkoutPage.firstNameInput).toHaveValue(customer.firstName);
  await expect(checkoutPage.lastNameInput).toHaveValue(customer.lastName);
  await expect(checkoutPage.postalCodeInput).toHaveValue(customer.postalCode);

  await expect(checkoutPage.continueButton).toBeVisible();
  await checkoutPage.continueToOverview();
  await expect(checkoutPage.title).toHaveText('Checkout: Overview');
  expect(await checkoutPage.getProductDetails()).toEqual(expectedItem);

  await expect(checkoutPage.paymentInfoLabel).toHaveText('Payment Information:');
  await expect(checkoutPage.paymentInfoValue).toHaveText('SauceCard #31337');
  await expect(checkoutPage.shippingInfoLabel).toHaveText('Shipping Information:');
  await expect(checkoutPage.shippingInfoValue).toHaveText('Free Pony Express Delivery!');

  const priceSummary = await checkoutPage.getPriceSummary();
  expect(priceSummary.subtotal).toContain(expectedItem.price);
  expect(priceSummary.tax).toContain('Tax: $');
  expect(priceSummary.total).toContain('Total: $');
  const amount = (text) => Number(text.match(/\$([0-9]+\.[0-9]{2})/)?.[1]);
  expect(amount(priceSummary.subtotal) + amount(priceSummary.tax))
    .toBeCloseTo(amount(priceSummary.total), 2);

  await expect(checkoutPage.finishButton).toBeVisible();
  await checkoutPage.finish();
  await expect(orderCompletePage.completeHeader).toHaveText('Thank you for your order!');
});
