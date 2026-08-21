# Complete UI Overhaul: Custom CSS Login & Global Styling

Based on the [FreeFrontend CSS Login Forms](https://freefrontend.com/css-login-forms/#examples) reference, I propose upgrading the default AWS Amplify Authenticator UI to a fully custom **Glassmorphism / Neon Sliding Panel** design. We will also ripple this premium visual identity across the entire Dashboard and Test Suite to ensure a cohesive, state-of-the-art student experience.

## Open Questions
> [!IMPORTANT]  
> Please confirm the following design decisions before I begin execution:
> 1. **Style Selection**: I highly recommend the **Glassmorphism Login Form** (frosted glass over animated gradient orbs) or the **Sliding Dual Panel Toggle** (smooth sliding animation between Sign In and Sign Up). Do you have a preference between the two, or should I combine the best elements of both (a glassmorphic sliding panel)?
> 2. **Color Palette**: I propose a modern "Dark Mode" palette with deep space backgrounds (`#09090b`), vibrant neon purple/blue accent orbs, and frosted glass overlays. Does this fit SarabiLabs' brand?
> 3. **Global Styling**: I will apply the glassmorphism and soft shadows to the Dashboard cards and Practice Suite layout so the entire app matches the new login page. Does this sound good?

## Proposed Changes

### 1. Custom AWS Auth Integration
Currently, we rely on the pre-built `<Authenticator>` UI component from `@aws-amplify/ui-react`. To achieve a custom CSS login form, we must remove the pre-built UI and interact directly with the Amplify Auth APIs.

#### [DELETE] `@aws-amplify/ui-react` Authenticator Wrapper
- Remove the `<Authenticator>` wrapper from `src/main.jsx`.
- Clean up the default Amplify CSS imports.

#### [NEW] `src/components/LoginScreen.jsx`
- Build a custom React component for the Login, Sign Up, and OTP Confirmation flows.
- Wire up the UI buttons directly to `@aws-amplify/auth` methods (`signIn`, `signUp`, `confirmSignUp`).
- Implement the sliding panel/glassmorphism CSS logic directly in this component.

### 2. Global UI Overhaul
#### [MODIFY] `src/index.css`
- Inject the new CSS Variables (dark backgrounds, glassmorphism filters, neon accent colors, modern typography like 'Inter' or 'Outfit').
- Add `@keyframes` for the dynamic background orb animations and sliding panel transitions.
- Restyle the Dashboard `results-card`, `test-card`, and `review-card` to use `backdrop-filter: blur(10px)` and semi-transparent backgrounds to match the new Glassmorphism theme.

#### [MODIFY] `src/App.jsx`
- Replace the `user` prop passed by the Amplify Authenticator with a local authentication state manager. 
- Render the new `LoginScreen` if the user is unauthenticated, otherwise render the Dashboard.

## Verification Plan

### Manual Verification
1. Open the local Vite development server.
2. Verify the Login screen renders with the new Glassmorphism/Sliding CSS design.
3. Test a full Sign Up -> OTP Code Confirmation -> Login flow using the custom UI to ensure AWS Cognito integration remains functional.
4. Verify the Dashboard and Test Suite correctly inherit the new premium glassmorphism styling.
