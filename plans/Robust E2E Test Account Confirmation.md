# Robust E2E Test Account Confirmation

The current `pre_sign_up` lambda uses a simple `.startsWith('e2e_')` check. This is not very robust for two reasons:
1. **Null Safety:** If `event.request.userAttributes.email` is missing, it could throw an error and break the sign-up flow for everyone.
2. **Security / Abuse:** Anyone who figures out the pattern could sign up with an email like `e2e_myrealemail@gmail.com` and bypass the OTP verification entirely, allowing them to create an account without verifying their email.

## Proposed Changes

We will modify the `pre_sign_up` Lambda to be much stricter and safer.

### [MODIFY] `backend/lambdas/pre_sign_up/index.mjs`
- **Null Safety:** Ensure we safely default to an empty string if the email attribute is missing.
- **Strict Regex Matching:** Instead of `startsWith`, use a strict regular expression: `/^e2e_[a-f0-9]{8}@example\.com$/`. 
- **Domain Restriction:** By enforcing the `@example.com` domain, even if a malicious user discovers the pattern, they cannot use it to bypass verification for a *real* email address they own. 

```javascript
export const handler = async (event) => {
    // 1. Safely extract email
    const email = event.request?.userAttributes?.email || '';

    // 2. Strict validation for E2E pattern: e2e_ + 8 hex chars + @example.com
    const isE2ETest = /^e2e_[a-f0-9]{8}@example\.com$/.test(email);
    const isStaticInvalidTest = email === 'invalid_student@example.com';

    // 3. Auto-confirm only if it strictly matches our test accounts
    if (isE2ETest || isStaticInvalidTest) {
        console.log(`[E2E Testing] Auto-confirming test account: ${email}`);
        event.response.autoConfirmUser = true;
        event.response.autoVerifyEmail = true;
    }

    return event;
};
```

## Open Questions

> [!IMPORTANT]
> Is this regex-based domain restriction robust enough for your needs? 
> 
> *Alternative (More Secure but more complex):* We could inject a secret token in the Playwright tests as a `clientMetadata` attribute during sign-up, and the Lambda would only auto-confirm if `event.request.clientMetadata.E2E_SECRET` matches an environment variable. However, this requires changing the frontend to pass the secret during tests. The Regex method above is the simplest robust solution.
