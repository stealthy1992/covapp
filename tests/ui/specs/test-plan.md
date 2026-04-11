# COVID-19 Statistics Web App Test Plan

## Application Overview

Comprehensive test plan for the COVID-19 statistics web application at https://covapp-gamma.vercel.app/. The application allows users to sign up and sign in using Firebase authentication. After authentication, users can select a country to view COVID-19 reports by province, including active cases, confirmed cases, deaths, and fatality rate. Users can further drill down to view detailed statistics for a specific province on a selected date, displaying charts and comparisons with previous day data. The app integrates with the COVID-19 Statistics API from RapidAPI.

## Test Scenarios

### 1. Authentication Suite

**Seed:** `tests/covid-app/seed.spec.ts`

#### 1.1. User Signup - Happy Path

**File:** `tests/covid-app/auth-signup.spec.ts`

**Steps:**
  1. Navigate to https://covapp-gamma.vercel.app/
    - expect: Signup form is displayed with fields: First Name, Last Name, Email, Password, Confirm Password, and Register button
  2. Fill First Name with 'John', Last Name with 'Doe', Email with 'john.doe@example.com', Password with 'Password123', Confirm Password with 'Password123'
    - expect: Form accepts input without errors
  3. Click Register button
    - expect: User is redirected to dashboard, account created successfully

#### 1.2. User Signup - Edge Cases and Validations

**File:** `tests/covid-app/auth-signup.spec.ts`

**Steps:**
  1. Attempt to submit signup form with all fields empty
    - expect: Error message for missing required fields
  2. Fill email with 'invalid-email', submit
    - expect: Error message for invalid email format
  3. Fill password 'pass123', confirm 'pass456', submit
    - expect: Error message for password mismatch
  4. Fill password '123', submit
    - expect: Error message for weak password (if enforced)
  5. Use an already registered email, submit
    - expect: Error message for existing email

#### 1.3. User Signin - Happy Path

**File:** `tests/covid-app/auth-signin.spec.ts`

**Steps:**
  1. Navigate to /signin or click Sign In link from signup
    - expect: Signin form is displayed with Email and Password fields
  2. Fill Email with registered email, Password with correct password
    - expect: Form accepts input
  3. Click Sign In button
    - expect: User is redirected to dashboard

#### 1.4. User Signin - Edge Cases and Validations

**File:** `tests/covid-app/auth-signin.spec.ts`

**Steps:**
  1. Fill unregistered email, any password, submit
    - expect: Error message 'user-not-found' or similar
  2. Fill registered email, wrong password, submit
    - expect: Error message 'wrong-password' or similar
  3. Submit with empty email and password
    - expect: Error for empty fields

#### 1.5. JavaScript Validation Checks

**File:** `tests/covid-app/auth-validation.spec.ts`

**Steps:**
  1. Type invalid email, attempt submit, check no network call
    - expect: Client-side validation prevents submission for invalid email
  2. Interact with password fields
    - expect: Password fields show/hide or strength indicator if present
  3. Fill mismatched passwords, check error before submit
    - expect: Real-time validation messages appear

### 2. Functional Testing - Country Selection and Reports

**Seed:** `tests/covid-app/seed.spec.ts`

#### 2.1. Fetch Reports by Country

**File:** `tests/covid-app/country-reports.spec.ts`

**Steps:**
  1. Login to dashboard
    - expect: Dashboard loads with country selector disabled initially
  2. Verify country selector is clickable
    - expect: Country dropdown is enabled after login
  3. Click country selector
    - expect: Dropdown shows list of countries
  4. Check table state
    - expect: Table shows 'No rows' initially
  5. Select a country (e.g., US), click Submit
    - expect: API call to /reports?iso=<country_code> succeeds
  6. Wait for data load, verify table content
    - expect: Table populates with rows for provinces/states, columns: Date, Province, Active Cases, Confirmed Cases, Deaths, Fatality Rate, Action
  7. Check sample row data
    - expect: Data matches expected format (numbers, dates)

#### 2.2. Edge Cases for Country Reports

**File:** `tests/covid-app/country-reports.spec.ts`

**Steps:**
  1. Select a country with minimal data, verify no crash
    - expect: Handles countries with no data gracefully
  2. Check pagination buttons
    - expect: Table pagination works if many rows
  3. Click column headers to sort
    - expect: Sorting on columns works

#### 2.3. View Province Statistics

**File:** `tests/covid-app/province-stats.spec.ts`

**Steps:**
  1. From country reports table, click 'View Stats' for a province
    - expect: Navigates to /provincestats with province name
  2. Verify page elements
    - expect: Page shows date selector and heading 'Showing stats for <Province>'
  3. Check initial state
    - expect: Chart or stats display placeholder or error for no date
  4. Select a valid date (e.g., 03/09/2023), verify data loads
    - expect: API call to /reports?region_province=<province>&date=<date> succeeds
  5. Check displayed stats and chart
    - expect: Displays active cases, confirmed cases, deaths, recovered, with previous vs today comparison

#### 2.4. Province Stats Edge Cases

**File:** `tests/covid-app/province-stats.spec.ts`

**Steps:**
  1. Enter invalid date format, check error
    - expect: Error handling for invalid date
  2. Select date with no data, verify handling
    - expect: No data for date shows appropriate message
  3. Test date picker if interactive
    - expect: Date picker functionality

#### 2.5. API Endpoint Testing via UI

**File:** `tests/covid-app/api-integration.spec.ts`

**Steps:**
  1. Verify dropdown populated from /regions
    - expect: Regions endpoint used for country list
  2. Check network for /reports?iso=...
    - expect: Reports endpoint for country data
  3. Check network for /reports?region_province=...&date=...
    - expect: Reports endpoint for province data
  4. Verify stats show differences where applicable
    - expect: Difference calculations (previous day) displayed correctly

#### 2.6. Navigation and UI Elements

**File:** `tests/covid-app/navigation.spec.ts`

**Steps:**
  1. Click all visible links/buttons, verify no broken links
    - expect: All links and buttons are functional
  2. Click account settings, test Profile, My account, etc.
    - expect: Account menu options work
  3. Click Logout, verify redirection
    - expect: Logout redirects to signin
