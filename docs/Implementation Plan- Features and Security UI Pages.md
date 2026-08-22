# Implementation Plan: Features and Security UI Pages

We need to create two new dedicated UI pages to showcase the student-centric features and the robust security architecture of the platform.

## Proposed Changes

### Component 1: `src/components/Features.jsx`
- **Purpose**: Present the Student-Centric Features (Passwordless OTP Login, Ask AI Tutor, Mistake Journal, Exam Popularity, Interactive Dashboard).
- **Design**: We will use a grid layout with glassmorphism cards (reusing existing CSS variables and patterns in `index.css`) to make the page visually stunning and consistent with the dark theme. Each feature will have an icon/badge and a description.

### Component 2: `src/components/Security.jsx`
- **Purpose**: Present "How Safe Are They? (The Architecture)" covering Prompt Injection Defense, Microservice Least Privilege, and Hardened CI/CD Deployments.
- **Design**: Similar aesthetic to the features page but utilizing alert/shield iconography and perhaps a deeper dark tone or glowing borders to emphasize security. The Mermaid flowchart for the AI Sandbox can be conceptually represented or detailed in text.

### Routing Updates: `src/App.jsx`
- Add two new views to the `currentView` state logic: `features` and `security`.
- Update the `useEffect` that initializes the view based on the URL path (`/features`, `/security`) and query parameters (`?view=features`).
- Render the new components conditionally in the `<main className="main-content">` block.
- Add footer links for "Features" and "Security Architecture".

#### [NEW] src/components/Features.jsx
Create the React component for the features page.

#### [NEW] src/components/Security.jsx
Create the React component for the security page.

#### [MODIFY] src/App.jsx
Import the new components, add the state handling logic for `features` and `security`, and add navigation links to the footer.

## Open Questions

> [!IMPORTANT]
> The current application does not use `react-router-dom`. It uses a custom state-based router (`currentView`) in `App.jsx`. I will continue using this existing custom routing pattern to seamlessly integrate the new pages. Please confirm if this is acceptable or if you'd prefer to migrate the entire app to `react-router-dom`.

## Verification Plan

### Manual Verification
- Launch the dev server.
- Verify the "Features" and "Security Architecture" links appear in the footer.
- Click the links and verify the new pages load correctly with rich aesthetics.
- Verify that URL parameters (`?view=features`) load the pages on direct navigation.
