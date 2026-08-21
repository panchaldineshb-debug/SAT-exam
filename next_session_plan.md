# SAT Prep Action Plan: Path to 1400+ (Updated August 6, 2026)

## 📊 Current Status
*   **Math:** 100% Mastery achieved (Desmos one-line entry, Margin of Error calculations, and negative sign precision).
*   **Grammar & Mechanics:** 100% Mastery across all rules (Appositives, Modifiers, Semicolons/Colons, Transitions, Rhetorical Synthesis).
*   **Reading:** 100% Mastery (10/10 on the 30-Minute Poison Word & Nuanced Claim Sprint). The extreme language habit is officially broken!

---

## 🗓️ Phase 1: Completed Milestones
*   ✅ **Math Execution Protocol:** 100% precision on Grid-Ins and Desmos workflows.
*   ✅ **Poison Word Breakthrough:** 10/10 flawless execution on Reading Cross-Text and Scientific Inferences.

---

## 🗓️ Phase 2: Full 40-Minute Advanced Sprint (Tomorrow)
*   **Time:** 40 Minutes Total (20 min Math, 20 min R&W).
*   **Goal:** Full stamina and precision simulation combining all mastered domains at Module 2 Hard difficulty. Zero unforced errors.

---

## 🗓️ Phase 3: Official Bluebook Full-Length Practice Test (Weekend)
*   **Format:** Timed, full-length official Digital SAT in the Bluebook app.
*   **Objective:** Confirm real-world stamina, pacing, and lock in the official 1400+ score.

---

## 🚨 Active Execution Rules
1. **The Poison Word Scan:** Scan reading choices for *never, always, entirely, completely, impossible*. Strike them out immediately.
2. **The Boring Answer Rule:** The moderate, cautious answer (*may, contributes to, does not fully account for*) is almost always right.
3. **The 2-Second Sanity Check:** Check that every math grid-in makes logical sense before writing it down.
4. **Desmos One-Line Rule:** Never round intermediate decimals—type the full expression in Desmos at once.

---

## 🛠️ Developer / Architecture Tasks (Next Offline Session)

**1. AWS Cognito "Forgot Password" Flow Implementation:**
*   **Step 1:** Add a "Forgot Password?" link to the `LoginScreen.jsx` UI (under the password input).
*   **Step 2:** Create a new React state (`authState === 'FORGOT_PASSWORD'`) to render an email input form.
*   **Step 3:** Use Amplify's `resetPassword({ username })` API to trigger Cognito to send a 6-digit recovery code to the user's email.
*   **Step 4:** Create a `CONFIRM_RESET` UI state asking for the 6-digit code and a new password.
*   **Step 5:** Use Amplify's `confirmResetPassword({ username, confirmationCode, newPassword })` to finalize the reset and seamlessly transition them back to the Sign-In screen.

**2. Security & Compliance (COPPA & GDPR/CCPA):**
*   Add an "I agree to Terms & Privacy Policy" and "I am over 13" checkbox requirement during account creation.
*   Implement a "Delete My Data" Lambda trigger in user settings.

**3. Cost Optimization & Rate Limiting:**
*   Deploy AWS WAF in front of API Gateway to rate limit traffic and prevent brute-force login attempts (to keep the Serverless bill strictly Free Tier).
