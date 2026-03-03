# TATEIFY

A Next.js music streaming PWA powered by Firebase.

---

## Setup

### 1. Firebase

Create a Firebase project and enable **Realtime Database**. Copy `.env.local.example` to `.env.local` and fill in the Firebase values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Deploy the database rules in `firebase.rules.json` to your Firebase project.

### 2. VAPID Keys (Push Notifications)

Generate VAPID keys once and add them to `.env.local`:

```bash
node scripts/generate-vapid-keys.js
```

This outputs two lines — paste them into `.env.local`:

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-public-key>
VAPID_PRIVATE_KEY=<your-private-key>
```

> **Keep `VAPID_PRIVATE_KEY` server-side only** — do not prefix it with `NEXT_PUBLIC_`.

You can also set `VAPID_SUBJECT` (defaults to `mailto:admin@tateify.app`):

```
VAPID_SUBJECT=mailto:you@example.com
```

### 3. Admin Secret

Choose a strong secret password and add it to `.env.local`:

```
ADMIN_SECRET=your-very-secret-password
```

This is required to access the notification dashboard at `/admin`.

---

## Push Notification Flow

1. A user visits the site and **adds it to their Home Screen** (installs the PWA).
2. A prompt appears asking them to **allow notifications**.
3. If they click **Allow**, the browser's push subscription is saved to Firebase.
4. As admin, visit **`/admin`**, enter your `ADMIN_SECRET`, and send a notification.
5. All subscribed users receive the notification on their device — even when the app is closed.

---

## Admin Dashboard

Navigate to `/admin` in your browser. You will be asked for your `ADMIN_SECRET`. Once authenticated:

- Enter a **title** and **message** for the notification.
- Optionally set a **URL** that opens when the user taps the notification (defaults to `/`).
- Click **Send to All Subscribers**.

The dashboard shows how many users received the notification and automatically removes stale subscriptions (users who have revoked permission or uninstalled the PWA).

---

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```
