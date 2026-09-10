import { test, expect } from '@playwright/test';

// Verhoeff Multiplication and Permutation tables
const dTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];
const pTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];
const invTable = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

function generateValidAadhaar(): string {
  const first = Math.floor(2 + Math.random() * 8).toString();
  let remaining = '';
  for (let i = 0; i < 10; i++) {
    remaining += Math.floor(Math.random() * 10).toString();
  }
  const partial = first + remaining;
  const digits = partial.split('').map(Number).reverse();
  let c = 0;
  for (let i = 0; i < digits.length; i++) {
    c = dTable[c][pTable[(i + 1) % 8][digits[i]]];
  }
  const checkDigit = invTable[c];
  return partial + checkDigit.toString();
}

function generateValidPan(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = 'ABC';
  const entity = 'P';
  const surnameChar = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(1000 + Math.random() * 9000).toString();
  const lastChar = letters[Math.floor(Math.random() * letters.length)];
  return `${prefix}${entity}${surnameChar}${num}${lastChar}`;
}

test.describe('3. Worker Registration Flow & Worker Dashboard Login', () => {
  test('should register worker, persist in DB, and login via Employee ID', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `artisan.test.${timestamp}@coopnex.local`;
    const testPhone = `97${Math.floor(10000000 + Math.random() * 90000000)}`;
    const testAadhaar = generateValidAadhaar();
    const testPan = generateValidPan();
    const password = 'WorkerTest@2026!';

    // Dummy base64 PDF string (valid header)
    const dummyPdfBase64 = 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjEgMCBvYmoKPDwKL1RpdGxlIChUZXN0IERvY3VtZW50KQovQXV0aG9yIChDT09QTkVYKQo+PgplbmRvYmoK';

    // 1. Register Worker via full-stack API
    const regResponse = await page.request.post('http://localhost:5000/api/auth/register', {
      data: {
        name: 'Gopal Reddy',
        firstName: 'Gopal',
        lastName: 'Reddy',
        gender: 'Male',
        age: 32,
        email: testEmail,
        phone: testPhone,
        password: password,
        role: 'WORKER',
        emailVerified: true,
        trade: 'Electrician',
        primarySkill: 'Electrician',
        skills: ['Electrician', 'MCB Wiring'],
        experienceYears: 4,
        aadhaarNumber: testAadhaar,
        panNumber: testPan,
        aadhaarFileBase64: dummyPdfBase64,
        panFileBase64: dummyPdfBase64,
        pincode: '520001',
        district: 'Vijayawada'
      }
    });

    expect(regResponse.ok()).toBeTruthy();
    const regJson = await regResponse.json();
    expect(regJson.success).toBe(true);
    expect(regJson.token).toBeDefined();

    const employeeId = regJson.user.employeeId;
    expect(employeeId).toBeDefined();
    expect(employeeId).toContain('COOP-');

    // 2. Verify worker persistence in MongoDB
    const meResponse = await page.request.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${regJson.token}`
      }
    });

    expect(meResponse.ok()).toBeTruthy();
    const meJson = await meResponse.json();
    expect(meJson.success).toBe(true);
    expect(meJson.user.employeeId).toBe(employeeId);
    expect(meJson.user.role).toBe('WORKER');
    expect(meJson.user.email).toBe(testEmail.toLowerCase());

    // 3. Worker Login UI flow using Employee ID and Password
    await page.goto('/worker/login');
    await expect(page.locator('#worker-employee-id')).toBeVisible();

    await page.locator('#worker-employee-id').fill(employeeId);
    await page.locator('#worker-password').fill(password);

    await page.locator('button[type="submit"]:has-text("Sign In")').or(page.locator('button[type="submit"]')).first().click();

    // 4. Verify successful redirection to /worker dashboard
    await page.waitForURL((url) => url.pathname === '/worker', { timeout: 15000 });
    await expect(page).toHaveURL(/.*worker$/);

    // Verify localStorage has worker session
    const storedWorker = await page.evaluate(() => localStorage.getItem('sahakari_user'));
    expect(storedWorker).toBeTruthy();
    expect(storedWorker).toContain(employeeId);
  });
});
