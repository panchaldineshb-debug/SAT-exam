export const handler = async (event) => {
    // 1. Safely extract email
    const email = event.request?.userAttributes?.email || '';
    const birthMonthYear = event.request?.userAttributes?.['custom:birth_month_year'];

    // 2. Strict validation for E2E pattern: e2e_ + 8 hex chars + @example.com
    const isE2ETest = /^e2e_[a-f0-9]{8}@example\.com$/.test(email);
    const isStaticInvalidTest = email === 'invalid_student@example.com';

    // 3. Auto-confirm only if it strictly matches our test accounts
    if (isE2ETest || isStaticInvalidTest) {
        console.log(`[E2E Testing] Auto-confirming test account: ${email}`);
        event.response.autoConfirmUser = true;
        event.response.autoVerifyEmail = true;
    } else {
        // Enforce Age Gate for real users
        if (!birthMonthYear) {
            throw new Error("Age requirement not met: Missing birth date");
        }
        
        // Format: YYYY-MM
        const [yearStr, monthStr] = birthMonthYear.split('-');
        if (!yearStr || !monthStr) {
            throw new Error("Age requirement not met: Invalid format");
        }

        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // 1-indexed

        let age = currentYear - year;
        if (currentMonth < month) {
            age--;
        }

        if (age < 13) {
            console.log(`[Compliance] Blocked registration for under-13 user. Age calculated: ${age}`);
            throw new Error("Age requirement not met. COPPA compliance prohibits registration for users under 13.");
        }
    }

    return event;
};
