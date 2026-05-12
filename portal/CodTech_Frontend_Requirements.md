# CodTech Internship Portal - Frontend Specification

## 1. Project Objective
To provide a high-end, professional internship tracking platform for students. The UI must be modern, responsive, and visually stunning (Blue theme).

## 2. Target Audience
- Interns (Students looking for project-based learning).
- Mentors (Admins who review submissions).

## 3. Core Functional Requirements
### 3.1 User Authentication
- **Login**: Secure access via email and password. Redirects to `/dashboard`.
- **Registration**: User selects an internship domain (e.g., Python, React, Java) during sign-up.
- **Session Management**: Persistent sessions with auto-logout capability.

### 3.2 Intern Dashboard
- **Personalized Greeting**: Displays the user's name and assigned course.
- **Project Catalog**: Displays a list of 30+ domain-specific projects.
- **Progress Tracking**: Users can select up to 4 active projects and track completion.
- **XP & Badges**: Gamified system where users earn XP for progress.

## 4. Technical Specifications
- **Framework**: Next.js 14 (App Router).
- **Styling**: Tailwind CSS with custom inline branding fallbacks.
- **Database**: MySQL (hosted on Hostinger).
- **Architecture**: Standard Hostinger Next.js deployment (Standard build/start).

## 5. UI/UX Standards (Critical)
- **Color Palette**: Primary Blue (#1d4ed8), Secondary Emerald, Slate Backgrounds.
- **Animations**: Framer Motion for smooth transitions.
- **Stability**: Must handle network lag without crashing (Null-safe properties).

## 6. Test Cases for Automated Verification
- **TC-01**: Verify Login UI renders correctly with blue branding.
- **TC-02**: Verify Dashboard loads user data without client-side exceptions.
- **TC-03**: Verify course selection in registration correctly filters dashboard projects.
- **TC-04**: Verify CSS/JS assets load without 404 errors on production.
