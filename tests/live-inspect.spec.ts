import { test, expect } from '@playwright/test';

test('should click Inspect on worker giri on live GitHub Pages and view document cleanly', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  console.log('Navigating to live admin login...');
  await page.goto('https://santhoshpyaram.github.io/COOPNEX/admin/login');

  await page.locator('input[type="email"]').or(page.locator('input[type="text"]')).first().fill('admin@coopnex.local');
  await page.locator('input[type="password"]').first().fill('Admin@Coopnex2026!');
  await page.locator('button[type="submit"]:has-text("SIGN IN")').or(page.locator('button[type="submit"]')).first().click();

  const mfaInput = page.locator('input[placeholder="123456"]').or(page.locator('input[maxlength="6"]'));
  await expect(mfaInput).toBeVisible({ timeout: 10000 });
  await mfaInput.fill('123456');
  await page.locator('button[type="submit"]:has-text("VERIFY")').or(page.locator('button[type="submit"]')).first().click();

  await page.waitForURL('**/admin', { timeout: 15000 });

  // Switch to Verification tab
  const kycTab = page.locator('button:has-text("Verification")').or(page.locator('button:has-text("KYC")')).first();
  await expect(kycTab).toBeVisible({ timeout: 5000 });
  await kycTab.click();
  await page.waitForTimeout(1500);

  // Search or locate worker giri
  const searchInput = page.locator('input[placeholder*="Search"]').or(page.locator('input[type="search"]')).first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('giri');
    await page.waitForTimeout(1000);
  }

  // Click Inspect on giri's row
  const giriRow = page.locator('table tbody tr:has-text("giri")').first();
  await expect(giriRow).toBeVisible({ timeout: 5000 });
  const inspectBtn = giriRow.locator('button:has-text("Inspect")');
  await expect(inspectBtn).toBeVisible();
  await inspectBtn.click();
  await page.waitForTimeout(1500);

  // Verify Drawer opened
  const drawer = page.locator('text=giri').first();
  await expect(drawer).toBeVisible({ timeout: 5000 });

  // Switch to Police & KYC Dossier tab if not already selected
  const dossierTab = page.getByRole('button', { name: /Police & KYC Dossier/i });
  if (await dossierTab.isVisible()) {
    await dossierTab.click();
    await page.waitForTimeout(1000);
  }

  // Click View Document on BlueBird.jpg / Police Clearance
  const viewDocBtns = page.getByRole('button', { name: 'View Document' });
  const count = await viewDocBtns.count();
  console.log('Found View Document buttons for giri:', count);
  expect(count).toBeGreaterThan(0);
  await viewDocBtns.nth(count - 1).click();

  // Verify Document Review Modal is visible
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible({ timeout: 5000 });

  // Verify document content is rendered
  const renderedDoc = modal.locator('img').or(modal.locator('iframe')).or(modal.locator('text=RECORD VERIFIED')).or(modal.locator('text=Official Statutory Registry'));
  await expect(renderedDoc.first()).toBeVisible({ timeout: 8000 });

  await page.screenshot({ path: 'test-results/live-giri-document-verified.png' });

  // Verify zero React 310 errors
  const react310 = errors.filter(e => e.includes('310'));
  expect(react310.length).toBe(0);
});
