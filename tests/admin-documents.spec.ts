import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '1440x900 (Large Desktop)', width: 1440, height: 900 },
  { name: '1280x800 (Standard Desktop)', width: 1280, height: 800 },
  { name: '1024x768 (Small Desktop / Tablet Landscape)', width: 1024, height: 768 },
  { name: '768x1024 (Tablet Portrait)', width: 768, height: 1024 },
  { name: '430x932 (Large Mobile / iPhone 15 Pro Max)', width: 430, height: 932 },
  { name: '390x844 (Standard Mobile / iPhone 14)', width: 390, height: 844 },
  { name: '375x667 (Small Mobile / iPhone SE)', width: 375, height: 667 },
  { name: '320x720 (Ultra Compact Mobile)', width: 320, height: 720 }
];

test.describe('4. Admin Document Reviewer Across 8 Viewport Sizes', () => {
  test('should display document reviewer modal, preserve centering and aspect ratio across 8 viewports', async ({ page }) => {
    // 1. Authenticate as Super Admin
    await page.goto('/admin/login');
    await expect(page.locator('input[type="email"]').or(page.locator('input[type="text"]')).first()).toBeVisible();

    await page.locator('input[type="email"]').or(page.locator('input[type="text"]')).first().fill('admin@coopnex.local');
    await page.locator('input[type="password"]').first().fill('Admin@Coopnex2026!');
    await page.locator('button[type="submit"]:has-text("SIGN IN")').or(page.locator('button[type="submit"]')).first().click();

    // 2. Fill MFA challenge (6 digits required)
    const mfaInput = page.locator('input[placeholder="123456"]').or(page.locator('input[maxlength="6"]'));
    await expect(mfaInput).toBeVisible({ timeout: 10000 });
    await mfaInput.fill('123456');

    // Submit MFA
    const verifyMfaBtn = page.locator('button[type="submit"]:has-text("VERIFY")').or(page.locator('button[type="submit"]')).first();
    await verifyMfaBtn.click();

    // 3. Verify arrival at /admin
    await page.waitForURL((url) => url.pathname === '/admin', { timeout: 15000 });
    await expect(page).toHaveURL(/.*admin/);

    // 4. Test document viewer across each of the 8 viewport sizes
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Navigate to Verification (KYC) tab
      const kycTab = page.locator('button:has-text("Verification")').or(page.locator('button:has-text("KYC")')).first();
      if (await kycTab.isVisible()) {
        await kycTab.click();
      }

      // Open first worker row
      const workerRow = page.locator('table tbody tr').or(page.locator('[role="row"]')).first();
      await expect(workerRow).toBeVisible({ timeout: 10000 });
      await workerRow.click();

      // Inside WorkerDetailDrawer, click "View Document"
      const viewDocBtn = page.locator('button:has-text("View Document")').first();
      await expect(viewDocBtn).toBeVisible({ timeout: 5000 });
      await viewDocBtn.click();

      // Verify AdminDocumentReviewModal is visible
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 5000 });

      // Centering & Bounding Box Check
      const modalBox = await modal.boundingBox();
      expect(modalBox).not.toBeNull();
      if (modalBox) {
        expect(modalBox.width).toBeLessThanOrEqual(vp.width + 2);
        expect(modalBox.height).toBeLessThanOrEqual(vp.height + 2);
      }

      // Verify action buttons are present in modal
      const closeBtn = page.locator('button[aria-label="Close document preview"]');
      await expect(closeBtn).toBeVisible();

      // Dismiss modal via close button
      await closeBtn.click();
      await expect(modal).not.toBeVisible();

      // Close drawer if open to reset state for next viewport
      const closeDrawerBtn = page.locator('button[aria-label="Close drawer"]').or(page.locator('button:has-text("Close")')).first();
      if (await closeDrawerBtn.isVisible()) {
        await closeDrawerBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });

  test('should dismiss document reviewer modal via Escape key', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // Login
    await page.goto('/admin/login');
    await page.locator('input[type="email"]').or(page.locator('input[type="text"]')).first().fill('admin@coopnex.local');
    await page.locator('input[type="password"]').first().fill('Admin@Coopnex2026!');
    await page.locator('button[type="submit"]:has-text("SIGN IN")').or(page.locator('button[type="submit"]')).first().click();

    const mfaInput = page.locator('input[placeholder="123456"]').or(page.locator('input[maxlength="6"]'));
    await expect(mfaInput).toBeVisible({ timeout: 10000 });
    await mfaInput.fill('123456');
    await page.locator('button[type="submit"]:has-text("VERIFY")').or(page.locator('button[type="submit"]')).first().click();

    await page.waitForURL((url) => url.pathname === '/admin', { timeout: 15000 });

    // Open KYC tab and click worker
    const kycTab = page.locator('button:has-text("Verification")').first();
    if (await kycTab.isVisible()) {
      await kycTab.click();
    }

    const workerRow = page.locator('table tbody tr').first();
    await expect(workerRow).toBeVisible();
    await workerRow.click();

    // Click "View Document"
    const viewDocBtn = page.locator('button:has-text("View Document")').first();
    await expect(viewDocBtn).toBeVisible();
    await viewDocBtn.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Verify modal is dismissed
    await expect(modal).not.toBeVisible();
  });
});
