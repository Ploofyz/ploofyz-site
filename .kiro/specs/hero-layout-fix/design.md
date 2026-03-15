# Hero Layout Fix Bugfix Design

## Overview

The home page hero section has multiple layout issues preventing it from matching the intended design. The primary issues are: (1) missing Ploofyz logo in the hero section, (2) social media icons displaying vertically instead of horizontally in the navigation bar, and (3) CSS structure conflicts with absolute positioning. This bugfix addresses these layout inconsistencies through targeted CSS modifications and JSX structure updates to restore the intended visual hierarchy without affecting existing functionality.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the layout bugs - when the home page loads or navigation renders with incorrect CSS properties
- **Property (P)**: The desired behavior - logo displays prominently in hero, social icons display horizontally, CSS uses proper flexbox layout
- **Preservation**: All existing functionality (navigation, scrolling, mobile menu, animations, page sections) that must remain unchanged
- **hero-section**: The main landing section in `app/src/pages/Home.tsx` that displays the video and content
- **nav-socials**: The container in `app/src/components/Navigation.css` that holds social media icons
- **nav-logo**: The navigation logo element that uses absolute positioning causing layout conflicts

## Bug Details

### Fault Condition

The bugs manifest when the home page loads or the navigation bar renders. The layout issues occur due to: (1) missing logo element in the hero section JSX structure, (2) incorrect CSS flex-direction on `.nav-socials` container, and (3) conflicting absolute positioning on `.nav-logo` that interferes with the layout flow.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type PageRenderEvent
  OUTPUT: boolean
  
  RETURN (input.page == 'home' AND NOT heroLogoExists(input.dom))
         OR (input.component == 'Navigation' AND socialIconsLayout(input.dom) == 'vertical')
         OR (input.component == 'Navigation' AND navLogoPositioning(input.css) == 'absolute')
END FUNCTION
```

### Examples

- **Missing Logo**: When home page loads, the hero section displays video and content but no Ploofyz logo above or integrated with the layout (Expected: Logo displays at 200px width with drop-shadow filter)
- **Vertical Social Icons**: When viewing navigation bar, Discord, YouTube, and TikTok icons stack vertically in a column (Expected: Icons display horizontally with 0.75rem gap)
- **Absolute Positioning Conflict**: The `.nav-logo` uses `position: absolute; left: 50%; transform: translateX(-50%)` which removes it from normal flow (Expected: Proper flexbox layout without absolute positioning)
- **Responsive Behavior**: On mobile (max-width: 480px), logo should scale to 130px width and social icons should maintain horizontal layout with 0.5rem gap

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Navigation scrolled state with backdrop blur and border must continue to work
- All navigation buttons (Home, Vote, Store, Join, Ranks) must continue to navigate correctly
- Social media icon links must continue to open correct external URLs in new tabs
- Mobile menu hamburger button and slide-out menu must continue to function
- Hero section video placeholder with play button must continue to display
- Server IP box displaying "play.ploofyz.com" must continue to render correctly
- All page animations and transitions (fade-in, slide-in, scroll effects) must continue to work
- Hover states on all interactive elements (buttons, links, cards) must continue to function
- Other page sections (Team, Ranks, CTA) must continue to render without layout issues
- Responsive breakpoints at 1024px, 640px, and 480px must continue to work correctly

**Scope:**
All inputs that do NOT involve the hero section logo rendering, navigation social icons layout, or navigation logo positioning should be completely unaffected by this fix. This includes:
- Mouse clicks and keyboard navigation
- Page scrolling and scroll-triggered animations
- Mobile menu interactions
- Search modal functionality
- All other page content and sections

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Missing JSX Element**: The hero section in `Home.tsx` does not include a logo element in the JSX structure
   - The hero-container has hero-video-section and hero-content-section
   - No logo wrapper or image element exists above or within these sections
   - PageStyles.css defines `.hero-logo-centered` styles but they're not used in Home.tsx

2. **Incorrect Flex Direction**: The `.nav-socials` container may have inherited or conflicting CSS causing vertical layout
   - Navigation.css defines `.nav-socials` with `display: flex` and `gap: 0.75rem`
   - Missing explicit `flex-direction: row` may cause vertical stacking in some browsers
   - Or there may be conflicting CSS from parent elements

3. **Absolute Positioning Conflict**: The `.nav-logo` uses absolute positioning which removes it from document flow
   - Current CSS: `position: absolute; left: 50%; transform: translateX(-50%)`
   - This conflicts with flexbox layout and causes spacing issues
   - Should use flexbox properties for center alignment instead

4. **CSS File Organization**: The hero logo styles exist in PageStyles.css but are not imported or used in Home.tsx
   - Home.tsx imports Home.css but not PageStyles.css
   - The `.hero-logo-centered` class is defined but never applied to any element

## Correctness Properties

Property 1: Fault Condition - Hero Logo Display and Navigation Layout

_For any_ page render where the home page loads or navigation renders, the fixed code SHALL display the Ploofyz logo prominently in the hero section at 200px width (responsive on mobile), display social media icons horizontally with 0.75rem gap, and use proper flexbox layout without conflicting absolute positioning.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

Property 2: Preservation - Existing Functionality

_For any_ user interaction that does NOT involve the hero logo rendering or navigation layout (scrolling, clicking buttons, mobile menu, animations, other sections), the fixed code SHALL produce exactly the same behavior as the original code, preserving all navigation functionality, animations, responsive behavior, and page sections.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File 1**: `app/src/pages/Home.tsx`

**Changes**:
1. **Add Logo Element to Hero Section**: Insert logo wrapper and image element in the hero-container
   - Add logo wrapper div above or between video and content sections
   - Include img element with src="/ploofyz-logo.png" and appropriate className
   - Wrap in motion.div for consistent animations with other hero elements

2. **Import PageStyles.css**: Add import statement to access hero logo styles
   - Add `import './PageStyles.css'` or ensure styles are available

**File 2**: `app/src/components/Navigation.css`

**Function**: `.nav-socials` and `.nav-logo` styles

**Specific Changes**:
1. **Fix Social Icons Layout**: Add explicit flex-direction to ensure horizontal layout
   - Add `flex-direction: row;` to `.nav-socials` class
   - Verify no conflicting CSS from parent elements

2. **Remove Absolute Positioning from Logo**: Replace absolute positioning with flexbox
   - Remove `position: absolute; left: 50%; transform: translateX(-50%);` from `.nav-logo`
   - Use flexbox properties or adjust nav-inner layout to center logo properly
   - Consider using `flex: 1` on left and right sections with logo in center

3. **Adjust Navigation Layout**: Modify `.nav-inner` to accommodate three-column layout
   - Ensure left (socials), center (logo), right (nav-links) sections have proper spacing
   - May need to add `flex: 1` to `.nav-socials` and `.nav-links` for equal spacing

4. **Update Responsive Styles**: Ensure mobile breakpoint handles logo positioning correctly
   - At max-width: 900px, logo should remain visible without absolute positioning
   - Verify mobile menu button doesn't overlap with logo

**File 3**: `app/src/pages/Home.css` (if needed)

**Changes**:
1. **Add Hero Logo Styles**: If not using PageStyles.css, add logo-specific styles
   - Define `.hero-logo-wrapper` for positioning and layout
   - Define `.hero-logo` for image sizing, filter, and hover effects
   - Include responsive styles for mobile breakpoints

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that render the home page and navigation component, then inspect the DOM and computed styles to verify the bugs exist. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Missing Hero Logo Test**: Render home page and query for logo element in hero section (will fail on unfixed code - element not found)
2. **Vertical Social Icons Test**: Render navigation and check computed flex-direction on `.nav-socials` (will fail on unfixed code - may be column or undefined)
3. **Absolute Logo Positioning Test**: Render navigation and check computed position on `.nav-logo` (will fail on unfixed code - position is absolute)
4. **Logo Responsive Size Test**: Render home page at mobile viewport and check logo width (will fail on unfixed code - logo doesn't exist)

**Expected Counterexamples**:
- Hero section DOM does not contain logo element with class matching hero-logo patterns
- Social icons container has flex-direction: column or inherits vertical layout
- Navigation logo has position: absolute causing layout flow issues
- Possible causes: missing JSX element, missing flex-direction property, incorrect positioning strategy

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := renderPage_fixed(input)
  ASSERT heroLogoExists(result.dom) == true
  ASSERT socialIconsLayout(result.dom) == 'horizontal'
  ASSERT navLogoPositioning(result.css) != 'absolute'
  ASSERT logoWidth(result.dom, 'desktop') == 200
  ASSERT logoWidth(result.dom, 'mobile') <= 150
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT renderPage_original(input) = renderPage_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for navigation interactions, scrolling, mobile menu, and other page sections, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Navigation Functionality Preservation**: Observe that clicking nav buttons navigates correctly on unfixed code, then write test to verify this continues after fix
2. **Scroll State Preservation**: Observe that scrolling triggers backdrop blur on unfixed code, then write test to verify this continues after fix
3. **Mobile Menu Preservation**: Observe that mobile menu opens/closes correctly on unfixed code, then write test to verify this continues after fix
4. **Animation Preservation**: Observe that hero animations play correctly on unfixed code, then write test to verify this continues after fix

### Unit Tests

- Test hero section renders with logo element at correct size (200px desktop, responsive mobile)
- Test social icons render horizontally with 0.75rem gap
- Test navigation logo does not use absolute positioning
- Test logo has drop-shadow filter and hover effects
- Test responsive breakpoints adjust logo size correctly

### Property-Based Tests

- Generate random viewport sizes and verify logo scales appropriately
- Generate random scroll positions and verify navigation state remains correct
- Generate random page navigation sequences and verify all sections render correctly
- Test that all interactive elements continue to work across many scenarios

### Integration Tests

- Test full home page load with logo visible in hero section
- Test navigation bar displays with horizontal social icons
- Test scrolling from hero to other sections with all animations working
- Test mobile menu functionality with new layout structure
- Test responsive behavior at all breakpoints (1024px, 640px, 480px)
