# Compliance Pages & Age Gate Implementation

We need to add essential legal pages and compliance features to the application to ensure it safely handles data and protects minors.

## User Review Required

> [!IMPORTANT]
> The age gate for users under 13 will be a **hard block** on registration on the frontend. Since we aren't integrated with a third-party parental consent service (like PRIVO), it's legally safest to simply reject signups from users under 13.
> 
> The Privacy Policy and Terms of Use provided will be standard templates tailored to educational usage. I recommend having them reviewed by a legal professional before launching.

## Proposed Changes

### Frontend Components

#### [NEW] src/components/PrivacyPolicy.jsx
- A static page detailing data collection, processing (Bedrock/AWS), security, and data deletion requests.

#### [NEW] src/components/TermsOfUse.jsx
- A static page outlining educational-only service, no score guarantees, user responsibilities, and IP rules.

#### [NEW] src/components/CookieNotice.jsx
- A floating banner at the bottom of the screen that informs the user about cookies/local storage.
- Includes an "Accept" button.
- State is saved to `localStorage` so it only appears once per device.

### Routing and Layout

#### [MODIFY] src/App.jsx
- Add `privacy` and `terms` to the `currentView` state rendering logic.
- Add footer links to navigate to these pages from the dashboard.
- Mount the `<CookieNotice />` component globally.

### Signup Flow & Age Gate

#### [MODIFY] src/components/LoginScreen.jsx
- Add a Date of Birth (DOB) field to the `SIGN_UP` form.
- Add frontend validation logic to calculate age.
- **Block Registration:** If the user is under 13, display an error message explaining they must have a parent or teacher create an account, and disable the signup submission.
- Add links to the Privacy Policy and Terms of Use near the signup button.

## Verification Plan

### Manual Verification
- Attempt to sign up with a DOB that makes the user 12 years old (should be blocked).
- Attempt to sign up with a DOB that makes the user 14 years old (should succeed).
- Verify the Cookie Notice banner appears on a fresh browser load and disappears permanently when accepted.
- Verify the Privacy Policy and Terms of Use pages load correctly from the Login Screen and the Dashboard.
