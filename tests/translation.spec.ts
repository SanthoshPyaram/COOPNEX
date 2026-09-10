import { test, expect } from '@playwright/test';

test.describe('1. Language Translation & Global Persistence', () => {
  test('should switch English -> Hindi -> Telugu -> English and persist across navigation & reload', async ({ page }) => {
    // 1. Open Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/COOPNEX/i);

    // Initial check: Default language is English
    const htmlLangInitial = await page.locator('html').getAttribute('lang');
    expect(htmlLangInitial).toBe('en');

    // 2. Switch to Hindi (hi)
    const langBtn = page.locator('button[title*="Select Language"]').first();
    await expect(langBtn).toBeVisible();
    await langBtn.click();

    // Click Hindi option
    const hindiOption = page.locator('button:has-text("हिन्दी")').first();
    await expect(hindiOption).toBeVisible();
    await hindiOption.click();

    // Verify document lang is now 'hi'
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi');

    // Verify localStorage persistence for Hindi
    const storedLangHi = await page.evaluate(() => localStorage.getItem('sahakari_lang'));
    expect(storedLangHi).toBe('hi');

    // Verify Hindi text is present on the page
    const pageTextHi = await page.content();
    expect(pageTextHi).toMatch(/[\u0900-\u097F]/); // Devnagari characters present

    // 3. Switch to Telugu (te)
    await langBtn.click();
    const teluguOption = page.locator('button:has-text("తెలుగు")').first();
    await expect(teluguOption).toBeVisible();
    await teluguOption.click();

    // Verify document lang is now 'te'
    await expect(page.locator('html')).toHaveAttribute('lang', 'te');

    // Verify localStorage persistence for Telugu
    const storedLangTe = await page.evaluate(() => localStorage.getItem('sahakari_lang'));
    expect(storedLangTe).toBe('te');

    // Verify Telugu text is present on the page
    const pageTextTe = await page.content();
    expect(pageTextTe).toMatch(/[\u0C00-\u0C7F]/); // Telugu characters present

    // 4. Persistence Test: Reload page and verify it remains Telugu
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'te');
    const storedLangAfterReload = await page.evaluate(() => localStorage.getItem('sahakari_lang'));
    expect(storedLangAfterReload).toBe('te');

    // 5. Persistence Test: Navigate to /services and verify it remains Telugu
    await page.goto('/services');
    await expect(page.locator('html')).toHaveAttribute('lang', 'te');
    const servicesTextTe = await page.content();
    expect(servicesTextTe).toMatch(/[\u0C00-\u0C7F]/);

    // 6. Switch back to English (en)
    const langBtnServices = page.locator('button[title*="Select Language"]').first();
    await langBtnServices.click();
    const englishOption = page.locator('button:has-text("English")').first();
    await expect(englishOption).toBeVisible();
    await englishOption.click();

    // Verify document lang is back to 'en'
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const storedLangEn = await page.evaluate(() => localStorage.getItem('sahakari_lang'));
    expect(storedLangEn).toBe('en');
  });

  test('should render translated cards on Services and How It Works pages', async ({ page }) => {
    // Go to Services in Hindi
    await page.goto('/services');
    const langBtn = page.locator('button[title*="Select Language"]').first();
    await langBtn.click();
    await page.locator('button:has-text("हिन्दी")').first().click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi');

    // Verify cards / buttons contain translated strings
    const bodyContent = await page.locator('body').innerText();
    expect(bodyContent).toMatch(/[\u0900-\u097F]/);

    // Switch to Telugu
    await langBtn.click();
    await page.locator('button:has-text("తెలుగు")').first().click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'te');

    const bodyContentTe = await page.locator('body').innerText();
    expect(bodyContentTe).toMatch(/[\u0C00-\u0C7F]/);

    // Clean up to English
    await langBtn.click();
    await page.locator('button:has-text("English")').first().click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
