# COOPNEX Production-Grade Authentication Setup Guide

This document provides step-by-step instructions for configuring **Real Production-Style Authentication** for the COOPNEX cooperative services platform.

---

## 1. Authentication Architecture

COOPNEX uses an enterprise multi-tier authentication flow designed for high trust, security, and spam prevention:

```
[ Step 1: Personal Details & Strong Password ]
                     │
                     ▼
[ Step 2: Real Email OTP (COOPNEX Backend + EmailJS) ]
                     │
                     ▼
[ Step 3: Real Cellular SMS OTP (Firebase Auth + reCAPTCHA) ]
                     │
                     ▼
[ Step 4: Secure MongoDB Account Persistence & Session ]
```

### Security Principles
- **No Fake OTPs / No Bypass**: No hardcoded codes (e.g., `123456`) or client-side length bypasses. All codes are verified against SHA-256 salted hashes on the backend.
- **Strict Role Isolation**: The only administrative role is `SUPER_ADMIN`. Public registration exclusively creates `CUSTOMER` or `WORKER` accounts. Any attempt to elevate privileges is rejected with `403 Forbidden`.
- **Pre-Storage Verification**: MongoDB only stores profiles when both `emailVerified: true` and `phoneVerified: true` are confirmed.

---

## 2. EmailJS Email OTP Configuration (Two Universal Templates)

EmailJS delivers authentic 6-digit numeric OTP codes directly to user email inboxes for both Customer and Worker personas.

### Step 2.1: EmailJS Service & Templates Setup
1. Visit [emailjs.com](https://www.emailjs.com/) and sign in.
2. Add an Email Service (e.g. Gmail / Outlook / SMTP) &rarr; Note your **Service ID**.
3. Configure **Template 1: Universal Verification OTP**:
   - Variables: `{{name}}`, `{{email}}`, `{{otp}}`, `{{expiry}}`, `{{app_name}}`
   - Purpose: Customer registration, worker registration, email re-verification, email OTP login.
4. Configure **Template 2: Universal Password Reset OTP**:
   - Variables: `{{name}}`, `{{email}}`, `{{otp}}`, `{{expiry}}`, `{{app_name}}`
   - Purpose: Customer forgot password, worker forgot password.
5. In Account Settings &rarr; Note your **Public Key**.

### Step 2.2: Add Keys to Frontend & Backend `.env`
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_VERIFICATION_TEMPLATE_ID=your_verification_template_id
VITE_EMAILJS_RESET_TEMPLATE_ID=your_reset_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 3. Firebase Phone Authentication Configuration (Real SMS OTP)

Firebase Phone Auth sends real cellular SMS messages to Indian mobile numbers (`+91XXXXXXXXXX`) with client-side invisible reCAPTCHA bot protection.

### Step 3.1: Create Firebase Project
1. Visit the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Name the project (e.g., `coopnex-sms`).

### Step 3.2: Enable Phone Authentication
1. Go to **Build** -> **Authentication** in the sidebar.
2. Click **Get Started**, then click the **Sign-in method** tab.
3. Select **Phone**, toggle **Enable**, and click **Save**.

### Step 3.3: Authorize Domains
1. In **Authentication** -> **Settings** tab -> **Authorized domains**.
2. Ensure `localhost` and `127.0.0.1` are listed (they are usually added by default).
3. When deploying to production, add your live custom domain here.

### Step 3.4: Register Web App & Retrieve Keys
1. In **Project Settings** (gear icon) -> **General**, scroll to **Your apps**.
2. Click the Web icon (`</>`) to register a web application (e.g. `coopnex-web`).
3. Copy the `firebaseConfig` properties:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Step 3.5: Add Keys to Frontend `.env`
Add the keys to `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Step 3.6: (Optional) Testing Phone Numbers in Firebase
To test without consuming cellular SMS credits during local development:
1. In Firebase Console -> **Authentication** -> **Sign-in method** -> **Phone**.
2. Scroll to **Phone numbers for testing**.
3. Add a test number (e.g. `+91 9999999999`) and a test verification code (e.g. `654321`).
4. Firebase will verify this number instantly without sending a physical cellular SMS or incurring quota charges.

---

## 4. Backend Environment Configuration

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sahakari_seva
JWT_SECRET=your_super_secure_coopnex_production_jwt_key_2026
```

---

## 5. Verification Checklist

Run both the backend and frontend builds to confirm TypeScript types and bundling:

```bash
# Verify Backend
cd backend
npm run build

# Verify Frontend
cd frontend
npm run build
```

### Registration Flow Testing:
1. Navigate to `http://localhost:5173/register`.
2. **Step 1**: Enter personal details, select role, enter mobile and email. Type a password to watch the `CartoonPasswordMascot` react dynamically to password strength. Click **Continue to Email Verification**.
3. **Step 2**: Receive the real 6-digit code in your email inbox via EmailJS. Enter the code to verify.
4. **Step 3**: Receive the real cellular SMS on your mobile phone via Firebase. Enter the code to verify.
5. **Step 4**: The account is created in MongoDB with `emailVerified: true` and `phoneVerified: true`, and you are redirected to the dashboard.

### Login Flow Testing:
1. Navigate to `http://localhost:5173/login`.
2. Test **Password Login** with your email/phone and password.
3. Test **Sign in with Email OTP** by receiving a one-time login code to your email.

