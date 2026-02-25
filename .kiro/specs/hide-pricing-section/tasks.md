# Implementation Plan: Hide Pricing Section

## Overview

This implementation adds a simple feature flag to conditionally hide the pricing section on the home page while preserving all code for future re-enablement. The approach uses a boolean constant and conditional rendering, requiring minimal changes to Home.tsx and adding comprehensive tests using Vitest and React Testing Library.

## Tasks

- [ ] 1. Set up testing infrastructure
  - Install Vitest, React Testing Library, and related dependencies
  - Configure Vitest in vite.config.ts or vitest.config.ts
  - Add test scripts to package.json
  - Create test setup file if needed for jsdom environment
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

- [ ] 2. Implement visibility control in Home.tsx
  - [ ] 2.1 Add SHOW_PRICING_SECTION feature flag constant
    - Add `const SHOW_PRICING_SECTION = false;` after data arrays and before component definition
    - Use explicit boolean type annotation
    - _Requirements: 1.1, 2.3_
  
  - [ ] 2.2 Wrap pricing section in conditional render
    - Wrap the pricing section ScrollScaleSection (lines ~380-420) with `{SHOW_PRICING_SECTION && (...)}` 
    - Ensure the entire ScrollScaleSection component is wrapped, not just the inner section
    - Verify no syntax errors and proper JSX formatting
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.4_

- [ ] 3. Checkpoint - Verify implementation
  - Run the application and verify pricing section is hidden
  - Check that other sections render correctly without gaps
  - Ensure no console errors or warnings
  - Verify scroll animations work for remaining sections
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 4. Create test file and test utilities
  - [ ]* 4.1 Create Home.test.tsx in app/src/pages/
    - Set up test file structure with imports
    - Create mock functions for framer-motion hooks (useScroll, useTransform, useAnimation, useInView)
    - Create mock onNavigate callback
    - Set up beforeEach to reset mocks
    - _Requirements: 1.1, 1.3, 1.4, 3.1, 3.2, 3.3_

- [ ]* 5. Write unit tests for hidden state
  - [ ]* 5.1 Test: Pricing section hidden when flag is false
    - Render Home component with SHOW_PRICING_SECTION = false
    - Query for pricing section by id="pricing" or className="pricing-section"
    - Assert element is not in the document
    - **Example 1: Pricing section hidden when flag is false**
    - **Validates: Requirements 1.1**
  
  - [ ]* 5.2 Test: Other sections render when pricing is hidden
    - Render Home component with pricing hidden
    - Query for hero-section, features-section, ranks-section, cta-section, footer
    - Assert all sections exist in the document
    - **Example 2: Other sections render when pricing is hidden**
    - **Validates: Requirements 3.1**
  
  - [ ]* 5.3 Test: Animation wrappers present for visible sections
    - Render Home component
    - Verify features-section, ranks-section, and cta-section are present
    - Check that sections have expected structure indicating ScrollScaleSection wrapper
    - **Example 3: Animation wrappers present for visible sections**
    - **Validates: Requirements 1.4, 3.2**

- [ ]* 6. Write unit tests for navigation and visibility toggle
  - [ ]* 6.1 Test: Navigation buttons function correctly
    - Render Home component with mock onNavigate callback
    - Query for "Shop Now" and "Learn More" buttons
    - Simulate click events using fireEvent or userEvent
    - Assert onNavigate called with 'store' for Shop Now
    - Assert onNavigate called with 'about' for Learn More
    - **Example 4: Navigation buttons function correctly**
    - **Validates: Requirements 3.3**
  
  - [ ]* 6.2 Test: Pricing section visible when flag is true
    - Temporarily modify SHOW_PRICING_SECTION to true in test
    - Render Home component
    - Query for pricing section element
    - Assert element exists in the document
    - Query for all pricing plan cards (should be 5)
    - Assert 5 pricing cards are rendered
    - **Example 5: Pricing section visible when flag is true**
    - **Validates: Requirements 1.1 (inverse case), 2.1, 2.2**

- [ ]* 7. Final checkpoint - Run all tests
  - Execute `npm test` to run all unit tests
  - Verify all tests pass
  - Check test coverage for Home.tsx
  - Ensure no console errors or warnings during test execution
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The implementation requires only 2 lines of code changes in Home.tsx
- All existing code (pricingPlans array, JSX markup) remains intact
- Tests use Vitest and React Testing Library as specified in the design
- Feature can be easily re-enabled by changing the flag to true
- Manual testing should verify visual layout and scroll animations
