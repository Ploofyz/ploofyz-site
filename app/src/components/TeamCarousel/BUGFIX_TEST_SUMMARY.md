# Bug Condition Exploration Test Summary

## Test File
`ProfileSlide.bugfix.property.test.tsx`

## Purpose
This test is designed to **FAIL on unfixed code** to confirm the bug exists. It encodes the expected behavior and will validate the fix when it passes after implementation.

## Bug Condition Being Tested
The test verifies that the ProfileSlide component's image container uses responsive CSS constraints (calc(), min(), vw, vh) instead of fixed pixel values at mobile and tablet viewports (≤1024px).

## Current Unfixed CSS Values (ProfileSlide.css)

### Mobile (≤767px)
- `max-width: 320px` - Fixed pixel value
- `height: 480px` - Fixed pixel value

### Small Mobile (≤480px)
- `max-width: 280px` - Fixed pixel value
- `height: 400px` - Fixed pixel value

### Tablet (768px-1024px)
- `width: 360px` - Fixed pixel value
- `height: 520px` - Fixed pixel value

## Test Strategy

The test checks for the presence of responsive CSS units in the computed styles:
- **Responsive width indicators**: `calc`, `min`, `max`, `vw`, `%`
- **Responsive height indicators**: `calc`, `min`, `max`, `vh`

## Expected Test Behavior

### On UNFIXED Code (Current State)
**EXPECTED OUTCOME**: ❌ **TEST FAILS**

The test will fail with assertions like:
```
expect(hasResponsiveWidth).toBe(true)
Expected: true
Received: false
```

This failure is **CORRECT** - it confirms the bug exists by detecting fixed pixel values without responsive constraints.

### On FIXED Code (After Implementation)
**EXPECTED OUTCOME**: ✅ **TEST PASSES**

After implementing the CSS fixes from the design document, the test will pass because:
- Mobile: Uses `min(320px, calc(100vw - 4rem))` for max-width
- Small Mobile: Uses `min(280px, calc(100vw - 3rem))` for max-width
- Tablet: Uses `min(360px, 40vw)` for width
- All viewports: Use `min()` with `vh` units for height

## Test Cases

### Property-Based Test
- Generates 100 test cases across viewport widths: 375px, 360px, 480px, 768px, 1024px
- Validates responsive constraints are present at all mobile/tablet viewports

### Specific Test Cases
1. **375px Mobile**: Most common mobile viewport (iPhone SE, etc.)
2. **360px Small Mobile**: Smallest common mobile viewport
3. **768px Tablet**: iPad portrait and similar tablets

## Counterexamples (Documented on Unfixed Code)

When run on unfixed code, the test will document counterexamples showing:
- Viewport: 375px → max-width: "320px" (fixed), height: "480px" (fixed)
- Viewport: 360px → max-width: "280px" (fixed), height: "400px" (fixed)
- Viewport: 768px → width: "360px" (fixed), height: "520px" (fixed)

These counterexamples prove the bug exists and guide the fix implementation.

## Requirements Validated
- **Requirement 1.1**: Mobile viewport (≤767px) image container overflow
- **Requirement 1.2**: Small mobile viewport (≤480px) image container overflow
- **Requirement 1.3**: Tablet viewport (768px-1024px) suboptimal space utilization

## Next Steps
1. ✅ Test written and ready
2. ⏭️ Run test on unfixed code to confirm failure (Task 1 complete)
3. ⏭️ Implement CSS fixes (Task 3)
4. ⏭️ Re-run test to confirm it passes (Task 3.4)

## Running the Test

To run this specific test:
```bash
npm test -- ProfileSlide.bugfix.property.test.tsx --run
```

Or with vitest directly:
```bash
npx vitest run src/components/TeamCarousel/ProfileSlide.bugfix.property.test.tsx
```

## Notes
- This is a **bug condition exploration test** following the bugfix workflow methodology
- The test MUST fail on unfixed code - this is the expected and correct behavior
- Do NOT attempt to fix the test when it fails - the failure confirms the bug exists
- The test encodes the expected behavior and will validate the fix after implementation
