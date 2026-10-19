# InitWay email-link signup integration

This replaces the numeric OTP page with a confirmation-link flow.

## Files

- `CheckEmailPage.jsx`: page shown after the signup email is sent.
- `AuthCallbackPage.jsx`: callback opened after the user clicks the Supabase confirmation link.

## 1. Route setup

Add routes using your existing router:

```jsx
<Route path="/check-email" element={<CheckEmailPage />} />
<Route path="/auth/callback" element={<AuthCallbackPage />} />
```

Update the imports to match your project folders.

## 2. Signup submit flow

After your existing `POST /auth/userexist` succeeds and returns `pendingRegistrationID`, save it and start Supabase signup:

```js
const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Could not start signup");
}

localStorage.setItem("pendingRegistrationID", result.pendingRegistrationID);
sessionStorage.setItem("pendingRegistrationID", result.pendingRegistrationID);
sessionStorage.setItem("signupEmail", email.trim().toLowerCase());

const callbackUrl = new URL("/auth/callback", window.location.origin);
callbackUrl.searchParams.set(
  "pendingRegistrationID",
  result.pendingRegistrationID
);

const { error: supabaseError } = await supabase.auth.signUp({
  email: email.trim().toLowerCase(),
  password,
  options: {
    emailRedirectTo: callbackUrl.toString(),
    data: { name: name.trim() },
  },
});

if (supabaseError) {
  throw supabaseError;
}

navigate("/check-email");
```

Use your existing `API_URL` and existing variable names. Do not call `supabase.auth.signUp()` twice. If you already call it elsewhere, move the `emailRedirectTo` option into that existing call.

## 3. Supabase dashboard

Under Authentication → URL Configuration, add the callback paths to Redirect URLs:

- `http://localhost:5173/auth/callback`
- `https://init-way.vercel.app/auth/callback`

Use your actual local Vite port and deployed domain. Keep Site URL set to the appropriate production frontend URL.

## 4. Backend contract

The callback sends:

- `Authorization: Bearer <Supabase access token>`
- JSON body: `{ "pendingRegistrationID": "..." }`

to `POST ${VITE_BACKEND_URL}/api/auth/register`.

Your Express router must map `/api/auth/register` to the controller that:
1. verifies the Supabase access token with `supabase.auth.getUser(token)`;
2. retrieves `userPending-ID:${pendingRegistrationID}` from Redis;
3. confirms the pending email matches the verified Supabase email;
4. creates the MongoDB user and returns `{ token: "<InitWay JWT>" }`.

If the router already has `/api` as a router prefix, do not add `/api` a second time in the frontend URL.

## 5. Supabase email template caveat

This uses Supabase's signup confirmation link, not numeric OTP. `emailRedirectTo` selects the post-confirmation destination; it does not itself change the email template. The confirmation email template must contain Supabase's confirmation URL variable (typically `{{ .ConfirmationURL }}`).

## Important considerations

- The pending ID is included as a callback query parameter so the callback can find the pending Redis record even when the email opens in a new tab. The backend must still require a valid Supabase access token and verify that the verified email matches the Redis record.
- Redis pending registration currently expires after 15 minutes. The confirmation link can be clicked after that time, in which case signup must be restarted or the expiry policy adjusted.
- Supabase's built-in email service has sending limits and is intended mainly for testing. Check your project's current Supabase limits.
- This code assumes your app uses its own InitWay JWT after signup. If your app intentionally retains Supabase sessions, remove the `supabase.auth.signOut()` call from the callback.
- If `VITE_BACKEND_URL` already ends in `/api`, change the fetch URL to `${API_URL}/auth/register`.
