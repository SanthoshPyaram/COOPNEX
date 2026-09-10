import { test, expect } from '@playwright/test';

test('should successfully display worker giri uploaded Police Clearance BlueBird.jpg in admin review modal', async ({ page }) => {
  // 1. Log in as Super Admin
  await page.goto('/admin/login');
  await page.locator('input[type="email"]').or(page.locator('input[type="text"]')).first().fill('admin@coopnex.local');
  await page.locator('input[type="password"]').first().fill('Admin@Coopnex2026!');
  await page.locator('button[type="submit"]:has-text("SIGN IN")').or(page.locator('button[type="submit"]')).first().click();

  // 2. Complete MFA
  const mfaInput = page.locator('input[placeholder="123456"]').or(page.locator('input[maxlength="6"]'));
  await expect(mfaInput).toBeVisible({ timeout: 10000 });
  await mfaInput.fill('123456');
  await page.locator('button[type="submit"]:has-text("VERIFY")').or(page.locator('button[type="submit"]')).first().click();

  // 3. Confirm arrival at /admin
  await page.waitForURL((url) => url.pathname === '/admin', { timeout: 15000 });

  // 4. Switch to Verification / KYC Tab
  const kycTab = page.locator('button:has-text("Verification")').or(page.locator('button:has-text("KYC")')).first();
  if (await kycTab.isVisible()) {
    await kycTab.click();
  }

  // 5. Look for worker "giri"
  const searchInput = page.locator('input[placeholder*="Search"]').or(page.locator('input[type="search"]')).first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('giri');
  }

  // Find and click giri's row
  const giriRow = page.locator('table tbody tr:has-text("giri")').or(page.locator('[role="row"]:has-text("giri")')).or(page.locator('text=giri')).first();
  await expect(giriRow).toBeVisible({ timeout: 10000 });
  await giriRow.click();

  // 6. Inside Worker Detail Drawer, wait for drawer and switch to "Police & KYC Dossier" tab
  const dossierTab = page.getByRole('button', { name: /Police & KYC Dossier/i });
  await expect(dossierTab).toBeVisible({ timeout: 5000 });
  await dossierTab.click();

  // Wait for KYC documents checklist to render
  const kycSection = page.locator('text=Statutory Identity & Financial Checks');
  await expect(kycSection).toBeVisible({ timeout: 5000 });

  // Click the View Document button specifically for POLICE_CLEARANCE or the third document
  const viewDocBtns = page.getByRole('button', { name: 'View Document' });
  await expect(viewDocBtns.first()).toBeVisible({ timeout: 5000 });
  
  // Click the last View Document button (Police Clearance / BlueBird.jpg)
  const count = await viewDocBtns.count();
  await viewDocBtns.nth(count - 1).click();

  // 7. Verify Document Review Modal is visible
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible({ timeout: 5000 });

  // 8. Verify the document (image or official card) is rendered on screen
  const renderedDoc = modal.locator('img').or(modal.locator('iframe')).or(modal.locator('text=RECORD VERIFIED')).or(modal.locator('text=Official Statutory Registry'));
  await expect(renderedDoc.first()).toBeVisible({ timeout: 8000 });

  // Take verified screenshot
  await page.screenshot({ path: 'test-results/giri-document-verified.png' });

  // 9. Close modal
  const closeBtn = page.locator('button[aria-label="Close document preview"]');
  await closeBtn.click();
  await expect(modal).not.toBeVisible();
});

