# Implementation Plan: Carousel Avatar Display

## Overview

Enhance the TeamCarousel with circular avatar thumbnails and full-body character images on profile slides. Changes are additive: new data fields, updated component props, CSS adjustments, and a Framer Motion animation.

## Tasks

- [ ] 1. Update TeamMember type and TEAM_SLIDES data
  - [ ] 1.1 Add `fullBodySrc: string` field to the `TeamMember` interface in `types.ts`
    - Place after `avatarSrc` field
    - _Requirements: 3.1_

  - [ ] 1.2 Update `TEAM_SLIDES` constant in `constants.ts` with correct `fullBodySrc` paths and fix `avatarSrc` for members without avatar images
    - Add `fullBodySrc` to every profile entry using the paths from the design doc
    - Set `avatarSrc: ""` for alex, jordan, sam, taylor, morgan, casey, riley (no avatar files exist)
    - Add `fullBodySrc` to the real team members (ploof, bim, kio, kyoto, mochi, naze, ryzz, yuki) using `/images/team/{id}-fullbody.png`
    - Note: current `constants.ts` has placeholder avatar paths for members without avatars — replace those with `""`
    - _Requirements: 3.2, 3.3_

  - [ ]* 1.3 Write property test for TEAM_SLIDES data integrity (Property 9)
    - Add to `constants.property.test.ts` (create if it doesn't exist)
    - Iterate `TEAM_SLIDES` deterministically — no fast-check arbitraries needed
    - Assert every profile entry with a known fullbody file has non-empty `fullBodySrc`
    - Assert every profile entry without an avatar file has empty `avatarSrc`
    - `// Feature: carousel-avatar-display, Property 9: TEAM_SLIDES data integrity`
    - **Property 9: TEAM_SLIDES data integrity**
    - **Validates: Requirements 3.2, 3.3**

- [ ] 2. Update ThumbnailIndicator component and styles
  - [ ] 2.1 Update `ThumbnailIndicator.tsx` to accept and render circular avatar or initials placeholder
    - Replace `imageSrc` prop with `avatarSrc`, `initials`, and `roleColor` props
    - If `avatarSrc` is non-empty: render `<img src={avatarSrc} className="thumbnail-indicator__avatar" />`
    - If `avatarSrc` is empty: render `<div className="thumbnail-indicator__initials-placeholder" style={{ backgroundColor: roleColor }}><span>{initials}</span></div>`
    - When `isActive`, apply `style={{ borderColor: roleColor }}` to the button element
    - Keep `alt`, `isActive`, `onClick`, `index` props unchanged
    - _Requirements: 1.1, 1.2, 1.3, 1.8, 5.6_

  - [ ] 2.2 Update `ThumbnailIndicator.css` for circular styling
    - Change `border-radius` on `.thumbnail-indicator` from `4px` to `50%`
    - Replace `.thumbnail-indicator__image` with `.thumbnail-indicator__avatar`: `border-radius: 50%`, `object-fit: cover`, `image-rendering: pixelated`, `width: 100%`, `height: 100%`
    - Add `.thumbnail-indicator__initials-placeholder`: `border-radius: 50%`, `width: 100%`, `height: 100%`, `display: flex`, `align-items: center`, `justify-content: center`
    - Add `span` inside placeholder: `color: white`, `font-weight: 700`, font-size proportional to container
    - Remove static `border-color: #ec4899` from `.thumbnail-indicator--active` (color now comes from inline style); keep `transform: scale(1.15)`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 2.3 Write property tests for ThumbnailIndicator (Properties 1, 2, 3, 5)
    - Update `ThumbnailIndicator.property.test.tsx`
    - **Property 1:** `fc.webUrl()` for avatarSrc — assert `<img>` rendered with correct `src`
      - `// Feature: carousel-avatar-display, Property 1: Avatar image rendered when avatarSrc is present`
      - **Validates: Requirements 1.1**
    - **Property 2:** `fc.string({ minLength: 1 })` for name, `fc.hexaString()` for roleColor — assert initials placeholder rendered with correct initials and background color
      - `// Feature: carousel-avatar-display, Property 2: Initials placeholder rendered when avatarSrc is absent`
      - **Validates: Requirements 1.2, 5.6**
    - **Property 3:** `fc.hexaString()` for roleColor, `isActive=true` — assert button border color equals roleColor
      - `// Feature: carousel-avatar-display, Property 3: Active thumbnail border uses roleColor`
      - **Validates: Requirements 1.3**
    - **Property 5:** `fc.string()` for name, `fc.nat()` for index — assert aria-label contains name and `index + 1`
      - `// Feature: carousel-avatar-display, Property 5: Aria-label contains member name and slide position`
      - **Validates: Requirements 1.8**
    - Use `numRuns: 100` for all assertions

- [ ] 3. Checkpoint — ensure all tests pass so far
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Update ProfileSlide component and styles
  - [ ] 4.1 Add `FULLBODY_SLIDE_VARIANTS` constant to `constants.ts`
    - `hidden: { x: 60, opacity: 0 }`
    - `visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }`
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 4.2 Update `ProfileSlide.tsx` to accept `fullBodySrc` prop and render full-body image with fallback chain and animation
    - Add `fullBodySrc: string` to `ProfileSlideProps`
    - Add two state flags: `fullBodyError` and `avatarError`
    - Import `useReducedMotion` from `framer-motion`
    - Import `FULLBODY_SLIDE_VARIANTS` from `./constants`
    - Fallback chain: if `!fullBodyError && fullBodySrc`: render `<motion.img src={fullBodySrc} className="profile-slide__fullbody" alt="{name}'s full body character" onError={() => setFullBodyError(true)} />`; else if `!avatarError && avatarSrc`: render `<motion.img src={avatarSrc} ...>`; else render `InitialsPlaceholder` div
    - Wrap image container in `motion.div` with `FULLBODY_SLIDE_VARIANTS`; when `useReducedMotion()` is true, pass `transition={{ duration: 0 }}`
    - Rename container class to `profile-slide__image-container`
    - _Requirements: 2.1, 2.4, 2.5, 2.6, 2.7, 3.4, 4.1, 4.4_

  - [ ] 4.3 Update `ProfileSlide.css` for full-body image layout
    - Rename `.profile-slide__avatar-container` to `.profile-slide__image-container`
    - Desktop: `width: 320px; height: 480px`
    - Tablet (768–1024px): `width: 260px; height: 390px`
    - Mobile (<768px): `width: 100%; max-width: 240px; height: 360px; margin: 0 auto`
    - Mobile (<480px): `max-width: 200px; height: 300px`
    - Add `.profile-slide__fullbody`: `object-fit: contain`, `height: 100%`, `width: 100%`, `filter: drop-shadow(0 4px 16px rgba(0,0,0,0.4))`
    - Retain `.profile-slide__avatar` and `.profile-slide__avatar-fallback` for fallback states
    - _Requirements: 2.2, 2.3, 2.6_

  - [ ]* 2.4 Write property tests for ProfileSlide (Properties 6, 7, 8, 10)
    - Update `ProfileSlide.property.test.tsx`
    - **Property 6:** `fc.webUrl()` for fullBodySrc — assert `<img>` rendered with correct `src`
      - `// Feature: carousel-avatar-display, Property 6: Full-body image rendered when fullBodySrc is present`
      - **Validates: Requirements 2.1**
    - **Property 7:** simulate `onError` on fullbody img → assert avatar shown; simulate `onError` on avatar → assert initials placeholder shown with `roleColor` background
      - `// Feature: carousel-avatar-display, Property 7: Fallback chain on image load failure`
      - **Validates: Requirements 2.4, 2.5**
    - **Property 8:** `fc.string({ minLength: 1 })` for name — assert fullbody `<img>` alt equals `"{name}'s full body character"`
      - `// Feature: carousel-avatar-display, Property 8: Full-body image alt text format`
      - **Validates: Requirements 2.7**
    - **Property 10:** mock `useReducedMotion` returning `true` — assert image element has no transform offset (transition duration 0)
      - `// Feature: carousel-avatar-display, Property 10: Reduced-motion disables animation`
      - **Validates: Requirements 4.4**
    - Use `numRuns: 100` for all assertions

- [ ] 5. Update TeamCarousel to pass new props
  - [ ] 5.1 Update `TeamCarousel.tsx` to pass `avatarSrc`, `initials`, `roleColor`, and `fullBodySrc` to child components
    - Remove `getThumbnailSrc` helper
    - For each `ThumbnailIndicator`: pass `avatarSrc` (member avatar or group photo for cinematic), `initials` (computed from member name, or `""` for cinematic), `roleColor` (member color or a neutral fallback like `"#888"` for cinematic)
    - For `ProfileSlide`: add `fullBodySrc={slide.member.fullBodySrc}` prop
    - Add a `getInitials` helper (or import from a shared util) to compute initials from name
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1_

  - [ ]* 5.2 Write property test for thumbnail click navigation (Property 4)
    - Update `TeamCarousel.property.test.tsx`
    - `fc.integer({ min: 0, max: slideCount - 1 })` for index — click thumbnail at index `i`, assert carousel displays slide `i`
    - `// Feature: carousel-avatar-display, Property 4: Thumbnail click navigates to correct slide`
    - **Property 4: Thumbnail click navigates to correct slide**
    - **Validates: Requirements 1.4**
    - Use `numRuns: 100`

- [ ] 6. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use fast-check with `numRuns: 100` minimum
- The `getInitials` logic: split name on spaces, take first char of each word, uppercase, slice to 2 chars
- The cinematic slide thumbnail uses the group photo as `avatarSrc` with `initials=""` and a neutral `roleColor`
- `FULLBODY_SLIDE_VARIANTS` replaces the role of `AVATAR_SLIDE_VARIANTS` for the new image container
