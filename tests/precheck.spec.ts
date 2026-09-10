import { test, expect } from '@playwright/test';

test.describe('Registration Pre-Check Functionality', () => {
  test('Customer registration: Phone number pre-check shows live availability status', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');

    const phoneInput = page.locator('input[type="tel"]');
    await expect(phoneInput).toBeVisible();

    const randomSuffix = Math.floor(10000000 + Math.random() * 90000000).toString();
    const testPhone = '91' + randomSuffix;
    await phoneInput.fill(testPhone);

    await phoneInput.blur();
    await page.waitForTimeout(1000);

    const availableBadge = page.locator('text=Available').or(page.locator('text=Checking availability...'));
    await expect(availableBadge.first()).toBeVisible({ timeout: 5000 });
  });

  test('Worker onboarding Step 3: Run Pre-Check validates checksum, documents, and enables progression', async ({ page }) => {
    await page.goto('/join-worker?name=Suresh+Kumar&email=suresh.test@example.com&emailVerified=true');
    await page.waitForLoadState('domcontentloaded');

    const pw = page.locator('input[type="password"]');
    await pw.nth(0).fill('Password@1234');
    await pw.nth(1).fill('Password@1234');
    await page.locator('textarea').fill('Benz Circle, Vijayawada');

    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('text=Step 2:')).toBeVisible();

    await page.locator('select').first().selectOption({ index: 1 });
    await page.locator('select').nth(1).selectOption({ index: 2 });
    await page.locator('button:has-text("Continue")').click();

    await expect(page.locator('text=Step 3: Identity & KYC Documents')).toBeVisible();

    const preCheckButton = page.locator('button:has-text("Run Pre-Check")');
    await expect(preCheckButton).toBeVisible();

    await preCheckButton.click();
    await expect(page.locator('text=Scanning Documents...')).toBeVisible();
    await expect(page.locator('text=Credential Structural Check Failed')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Aadhaar number is missing')).toBeVisible();

    const fillTestKycButton = page.locator('button:has-text("Fill Test KYC")');
    await expect(fillTestKycButton).toBeVisible();
    await fillTestKycButton.click();

    const aadhaarInput = page.locator('input[placeholder*="548291038476"]');
    await expect(aadhaarInput).toHaveValue('548291038476');

    await expect(page.locator('text=Preliminary Structural Check Passed')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Valid D5 Parity')).toBeVisible();
    await expect(page.locator('text=Valid (5A-4N-1A)')).toBeVisible();

    const continueBtn = page.locator('button:has-text("Continue")');
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    await expect(page.locator('text=Step 4: Primary Cooperative Society Affiliation')).toBeVisible({ timeout: 5000 });
  });
});
