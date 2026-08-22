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
