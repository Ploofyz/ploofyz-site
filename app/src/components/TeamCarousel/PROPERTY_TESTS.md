# Property-Based Tests for TeamCarousel

## Overview

This document describes the property-based tests implemented for the TeamCarousel feature using the fast-check library.

## Setup

### Install Dependencies

Before running the property tests, ensure all dependencies are installed:

```bash
cd app
npm install
```

This will install:
- `fast-check` - Property-based testing library
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - DOM matchers for testing
- `vitest` - Test runner
- `jsdom` - DOM environment for tests

### Run Tests

To run all tests including property-based tests:

```bash
npm test
```

To run only the ProfileSlide property tests:

```bash
npm test -- ProfileSlide.property.test.tsx --run
```

To run with verbose output:

```bash
npm test -- ProfileSlide.property.test.tsx --run --reporter=verbose
```

## Property Tests Implemented

### Task 3.2: ProfileSlide Property Tests

**File**: `app/src/components/TeamCarousel/ProfileSlide.property.test.tsx`

#### Property 2: Profile Completeness

**Validates**: Requirements 2.2, 2.3, 2.4, 2.5

**Description**: For any active profile slide (excluding the cinematic slide), the displayed content should include all required fields: team member name, role badge, description text, and avatar image.

**Test Configuration**:
- Minimum iterations: 100
- Generators:
  - `name`: Non-empty string (1-50 characters)
  - `role`: Non-empty string (1-30 characters)
  - `description`: Non-empty string (1-500 characters)
  - `avatarSrc`: Valid web URL
  - `roleColor`: Hex color code (#XXXXXX)

**Assertions**:
1. Team member name is present with correct CSS class
2. Role badge is present with correct CSS class and background color
3. Description text is present with correct CSS class
4. Avatar image or fallback is present
5. Avatar has correct src attribute and alt text
6. All container elements exist (card, content, avatar-container)

#### Additional Properties

**Role Badge Color Consistency**:
- Verifies that the role badge always uses the provided roleColor
- 100 iterations with randomized inputs

**Avatar Alt Text Presence**:
- Verifies accessibility requirement for avatar images
- Ensures alt text always includes team member name
- 100 iterations with randomized inputs

## Test Execution Notes

### Property-Based Testing with fast-check

Property-based tests generate random inputs to verify that properties hold across a wide range of scenarios. Each test runs 100 iterations with different randomized inputs.

### Expected Behavior

All property tests should pass, confirming that:
1. ProfileSlide always renders all required fields
2. Role badge color is consistently applied
3. Avatar alt text is always present for accessibility

### Troubleshooting

If tests fail:

1. **Check the counterexample**: fast-check will provide the specific input that caused the failure
2. **Verify component implementation**: Ensure ProfileSlide correctly handles all prop combinations
3. **Check CSS classes**: Ensure all expected CSS classes are present in ProfileSlide.css
4. **Review error messages**: The test assertions provide detailed error messages

### Example Test Output

```
✓ app/src/components/TeamCarousel/ProfileSlide.property.test.tsx (3)
  ✓ ProfileSlide - Property-Based Tests (3)
    ✓ Property 2: Profile Completeness - all required fields are present
    ✓ Property: Role badge color is always applied correctly
    ✓ Property: Avatar alt text always includes team member name

Test Files  1 passed (1)
     Tests  3 passed (3)
```

## Integration with Spec Workflow

This property test is part of the meet-the-team-carousel spec implementation:

- **Spec Path**: `.kiro/specs/meet-the-team-carousel`
- **Task**: 3.2 Write property test for ProfileSlide
- **Design Document**: `.kiro/specs/meet-the-team-carousel/design.md`
- **Requirements**: `.kiro/specs/meet-the-team-carousel/requirements.md`

## Next Steps

After this test passes:
1. Continue with task 3.3: Write unit tests for ProfileSlide
2. Proceed with remaining property tests for other components
3. Ensure all tests pass before integration

## References

- [fast-check Documentation](https://fast-check.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
