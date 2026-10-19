# Implementation Plan: Fix Firebase Credentials & Resolve Sign-In / Session Flow

Resolve authentication errors, restore session persistence across page reloads, verify Firebase configuration and authorized domains, and wire a hybrid MongoDB Atlas fallback so sign-in and sign-up succeed seamlessly under all network and Firebase Console states.

---

### User Review Required
> [!IMPORTANT]
> **Firebase Console Authentication Configuration**:
> 1. In your [Firebase Console](https://console.firebase.google.com/) for project **`extreme-fragment-nds98`**:
>    - Go to **Authentication** > **Sign-in method**.
>    - Click **Email/Password** and toggle **Enable**, then click **Save**.
>    - Click **Google** and ensure it is enabled with project support email.
> 2. Go to **Authentication** > **Settings** > **Authorized domains**:
>    - Add your development URL domain: `ais-dev-gxmn7ojv5466eeblbujn4m-62345513861.asia-southeast1.run.app`
>    - Add your shared preview URL domain: `ais-pre-gxmn7ojv5466eeblbujn4m-62345513861.asia-southeast1.run.app`

---

### Root Cause Analysis
1. **Firebase `auth/operation-not-allowed`**: Firebase Authentication rejects email/password creation until the provider is explicitly enabled in the Firebase Console.
2. **Session Reset on Reload**: When fallback users were generated in-memory, `onAuthStateChanged` fired with `user: null` on browser reload, causing `ProtectedRoute` to immediately eject the user back to `/login`.
3. **MongoDB Atlas Disconnect**: The app was saving test users directly in MongoDB Atlas during backend tests, but the frontend React `AuthContext` was not checking the backend `/api/auth/login` or `/api/auth/register` endpoints on failure.

---

### Proposed Changes

#### 1. Core Auth State Management (`src/context/AuthContext.tsx`)
- **Persistent Session Hydration**:
  - Store authenticated user profile and tokens in `localStorage` (`kisansetu_auth_user`, `kisansetu_auth_token`).
  - On application mount, restore user state from persistent storage if Firebase Auth has not initialized a session, preventing redirect kicks in `ProtectedRoute`.
- **Hybrid Backend Integration**:
  - In `loginWithEmail`: Try Firebase Auth first. If it returns `auth/operation-not-allowed` or `auth/user-not-found`, fall back to the live backend `/api/auth/login` (connected to MongoDB Atlas cluster3).
  - In `signupWithEmail`: Register in the backend `/api/auth/register` so credentials exist in MongoDB Atlas, then sync to Firestore.
- **Robust Sign-Out**:
  - Clear both Firebase Auth (`signOut(auth)`) and `localStorage` session keys, resetting state cleanly.

#### 2. Protected Routes & Redirects (`src/components/ProtectedRoute.tsx`)
- Verify that `ProtectedRoute` respects both active Firebase user and hydrated local session without infinite redirect loops.
- Verify `PublicRoute` redirects logged-in users to `/dashboard`.

#### 3. Verification & Testing
- Test sign-up with a new email and password.
- Test sign-in with existing MongoDB user (`ramesh.farmer@kisansetu.com`).
- Test page reload on `/dashboard` and `/selling` to ensure the user remains signed in.
- Test sign-out flow and redirect to `/login`.
