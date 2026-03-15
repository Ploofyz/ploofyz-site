# Implementation Plan: Meet the Team Carousel

## Overview

This implementation plan converts the meet-the-team-carousel design into a series of incremental coding tasks. The carousel will replace the "Why Choose Ploofyz" section in Home.tsx with a new team showcase featuring a cinematic group photo slide followed by 8 individual profile slides. The implementation uses React with TypeScript, CSS transitions for fade effects, and Framer Motion for avatar slide-in animations.

## Tasks

- [x] 1. Set up component structure and TypeScript interfaces
  - Create `app/src/components/TeamCarousel/` directory
  - Define TypeScript interfaces: `TeamMember`, `CarouselSlide`, `CinematicSlide`, `ProfileSlide`
  - Define animation configuration constants: `FADE_TRANSITION`, `AVATAR_SLIDE_VARIANTS`
  - Create team data constant `TEAM_SLIDES` with 9 slides (1 cinematic + 8 profiles)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Implement CinematicSlide component
  - [x] 2.1 Create CinematicSlide.tsx with props interface
    - Accept `imageSrc` and `alt` props
    - Render full-width image with aspect ratio preservation
    - Apply fade transition CSS classes
    - Handle image load errors with fallback gradient background
    - _Requirements: 2.1, 7.1, 7.2_
  
  - [x] 2.2 Write unit tests for CinematicSlide
    - Test component renders with provided image
    - Test fallback displays on image load error
    - Test alt text is present
    - _Requirements: 2.1_

- [x] 3. Implement ProfileSlide component
  - [x] 3.1 Create ProfileSlide.tsx with props interface
    - Accept `name`, `role`, `description`, `avatarSrc`, `roleColor` props
    - Render dark card layout with text content on left
    - Implement Framer Motion avatar slide-in animation on right
    - Style role badge with provided color
    - Handle avatar image load errors with initials fallback
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 7.1, 7.2_
  
  - [x] 3.2 Write property test for ProfileSlide
    - **Property 2: Profile Completeness**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**
  
  - [x] 3.3 Write unit tests for ProfileSlide
    - Test all profile fields render correctly
    - Test avatar animation triggers
    - Test fallback avatar with initials
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 4. Implement NavigationArrow component
  - [x] 4.1 Create NavigationArrow.tsx with props interface
    - Accept `direction`, `onClick`, `disabled`, `ariaLabel` props
    - Render chevron icon (left or right based on direction)
    - Apply hover feedback styles (within 150ms)
    - Include ARIA label for accessibility
    - _Requirements: 3.1, 3.2, 7.3, 8.1_
  
  - [x] 4.2 Write property test for NavigationArrow
    - **Property 12: Navigation Arrow ARIA Labels**
    - **Validates: Requirements 8.1**
  
  - [x] 4.3 Write unit tests for NavigationArrow
    - Test click handler is called
    - Test hover feedback appears
    - Test disabled state prevents clicks
    - _Requirements: 3.1, 3.2_

- [x] 5. Implement ThumbnailIndicator component
  - [x] 5.1 Create ThumbnailIndicator.tsx with props interface
    - Accept `imageSrc`, `alt`, `isActive`, `onClick`, `index` props
    - Render small avatar thumbnail image
    - Apply active state styling (border/scale effect)
    - Include alt text with team member name
    - Handle touch events for mobile devices
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.5, 8.2_
  
  - [x] 5.2 Write property test for ThumbnailIndicator
    - **Property 7: Active Thumbnail Visual Distinction**
    - **Validates: Requirements 5.2**
  
  - [x] 5.3 Write property test for ThumbnailIndicator
    - **Property 9: Thumbnail Avatar Presence**
    - **Validates: Requirements 5.4**
  
  - [x] 5.4 Write property test for ThumbnailIndicator
    - **Property 13: Thumbnail Alt Text Presence**
    - **Validates: Requirements 8.2**
  
  - [x] 5.5 Write unit tests for ThumbnailIndicator
    - Test active styling is applied correctly
    - Test click navigation works
    - Test touch events trigger navigation
    - _Requirements: 5.2, 5.3, 6.5_

- [x] 6. Checkpoint - Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement TeamCarousel main component
  - [x] 7.1 Create TeamCarousel.tsx with state management
    - Initialize state: `selectedIndex`, `isTransitioning`, `direction`
    - Implement `scrollNext()` with wrap-around logic and fade transition
    - Implement `scrollPrev()` with wrap-around logic and fade transition
    - Implement `scrollTo(index)` for direct navigation with fade transition
    - Implement bounds checking and validation for navigation
    - Prevent navigation during fade transitions
    - _Requirements: 2.1, 3.3, 3.4, 3.5, 3.6, 7.1, 7.2_
  
  - [x] 7.2 Add auto-rotation timer logic
    - Create `autoplayTimer` ref with 4-second interval
    - Implement `resetAutoplay()` to reset timer on manual interaction
    - Call `scrollNext()` on timer expiration
    - Clean up timer in useEffect cleanup function
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 7.3 Add keyboard navigation support
    - Listen for left/right arrow key events
    - Call `scrollPrev()` on left arrow key
    - Call `scrollNext()` on right arrow key
    - Ensure keyboard events reset auto-rotation timer
    - _Requirements: 8.3_
  
  - [x] 7.4 Render carousel structure
    - Render CarouselViewport with fade transition wrapper
    - Render CarouselContainer with slides
    - Conditionally render CinematicSlide or ProfileSlide based on slide type
    - Render NavigationArrows (previous and next)
    - Render ThumbnailIndicators for all 9 slides
    - Apply ARIA live region for screen reader announcements
    - _Requirements: 2.1, 3.1, 3.2, 5.1, 8.5_
  
  - [x] 7.5 Write property test for TeamCarousel
    - **Property 1: Single Active Profile**
    - **Validates: Requirements 2.1**
  
  - [x] 7.6 Write property test for TeamCarousel
    - **Property 3: Navigation Direction Consistency**
    - **Validates: Requirements 3.3, 3.4**
  
  - [ ] 7.7 Write property test for TeamCarousel
    - **Property 4: Auto-Rotation Advancement**
    - **Validates: Requirements 4.1**
  
  - [ ] 7.8 Write property test for TeamCarousel
    - **Property 5: Manual Interaction Timer Reset**
    - **Validates: Requirements 4.2, 4.3, 4.4**
  
  - [ ] 7.9 Write property test for TeamCarousel
    - **Property 6: Thumbnail Count Matches Slides**
    - **Validates: Requirements 5.1**
  
  - [ ] 7.10 Write property test for TeamCarousel
    - **Property 8: Thumbnail Navigation Accuracy**
    - **Validates: Requirements 5.3**
  
  - [ ] 7.11 Write property test for TeamCarousel
    - **Property 10: Touch Event Navigation**
    - **Validates: Requirements 6.4, 6.5**
  
  - [ ] 7.12 Write property test for TeamCarousel
    - **Property 11: Transition Timing Constraint**
    - **Validates: Requirements 7.1**
  
  - [ ] 7.13 Write property test for TeamCarousel
    - **Property 14: Keyboard Navigation Support**
    - **Validates: Requirements 8.3**
  
  - [ ] 7.14 Write property test for TeamCarousel
    - **Property 15: Focus Management**
    - **Validates: Requirements 8.4**
  
  - [ ] 7.15 Write property test for TeamCarousel
    - **Property 16: Screen Reader Announcements**
    - **Validates: Requirements 8.5**
  
  - [ ] 7.16 Write unit tests for TeamCarousel
    - Test carousel renders with 9 slides
    - Test first slide is active on mount
    - Test navigation arrows are present
    - Test thumbnail count matches slide count
    - Test rapid clicking doesn't break navigation
    - Test timer cleanup prevents memory leaks
    - _Requirements: 2.1, 3.1, 3.2, 5.1_

- [x] 8. Create CSS styles for carousel components
  - [x] 8.1 Create TeamCarousel.css with fade transition styles
    - Define fade-in and fade-out keyframes
    - Style CarouselViewport and CarouselContainer
    - Apply 600ms transition duration with ease-in-out timing
    - Style dark profile cards with beige/tan section background
    - Ensure proper z-index layering for transitions
    - _Requirements: 1.2, 7.1, 7.2_
  
  - [x] 8.2 Add responsive styles for mobile, tablet, and desktop
    - Mobile (< 768px): Stack layout, smaller thumbnails
    - Tablet (768px - 1024px): Adjusted spacing and font sizes
    - Desktop (> 1024px): Full layout with optimal spacing
    - Ensure navigation arrows remain accessible on touch devices
    - Ensure thumbnails remain accessible on touch devices
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 8.3 Add hover feedback styles
    - Navigation arrow hover effects (within 150ms)
    - Thumbnail hover effects (within 150ms)
    - Smooth transitions for all interactive elements
    - _Requirements: 7.3, 7.4_

- [x] 9. Checkpoint - Ensure styling is complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Integrate TeamCarousel into Home.tsx
  - [x] 10.1 Replace features section with team section
    - Import TeamCarousel component
    - Remove existing "Why Choose Ploofyz" features section
    - Add new team section wrapped in ScrollScaleSection
    - Maintain beige/tan background color scheme
    - Preserve all other existing sections and their order
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 10.2 Write integration tests for Home.tsx
    - Test team section renders in correct position
    - Test features section is removed
    - Test other sections remain unchanged
    - _Requirements: 1.1, 1.3_

- [x] 11. Add team member images and assets
  - [x] 11.1 Create placeholder images or add actual team images
    - Add cinematic group photo to `/app/public/images/team/group-photo.png`
    - Add 8 individual avatar images to `/app/public/images/team/`
    - Add fallback avatar image to `/app/public/images/team/fallback-avatar.png`
    - Ensure all images are optimized for web (appropriate file sizes)
    - _Requirements: 2.5, 5.4_

- [x] 12. Final checkpoint and accessibility verification
  - [x] 12.1 Verify all accessibility requirements
    - Test with keyboard navigation (Tab, Arrow keys)
    - Verify ARIA labels on navigation arrows
    - Verify alt text on all images
    - Test screen reader announcements on slide changes
    - Verify focus management works correctly
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 12.2 Test responsive behavior across viewports
    - Test on mobile viewport (< 768px)
    - Test on tablet viewport (768px - 1024px)
    - Test on desktop viewport (> 1024px)
    - Verify touch events work on mobile/tablet
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 12.3 Final checkpoint
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests use fast-check library with minimum 100 iterations
- Checkpoints ensure incremental validation throughout implementation
- The carousel uses CSS transitions for fade effects (no embla dependency)
- Avatar animations use Framer Motion (already a project dependency)
- All images should have fallback handling for graceful degradation
