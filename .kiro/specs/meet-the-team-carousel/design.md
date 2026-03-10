# Design Document: Meet the Team Carousel

## Overview

The Meet the Team carousel is a React component that replaces the existing "Why Choose Ploofyz?" features section on the home page. It displays team member profiles through an interactive carousel interface with a cinematic group photo as the first slide, followed by 8 individual profile slides.

The carousel uses CSS transitions for smooth fade effects between slides and Framer Motion for Minecraft avatar slide-in animations. The component integrates seamlessly with the existing Home page design system, maintaining the beige/tan background aesthetic while introducing dark profile cards with Minecraft character avatars.

### Key Design Goals

- Replace the features section without disrupting the home page flow
- Provide an engaging, auto-rotating showcase of team members
- Support manual navigation via arrows, thumbnails, and keyboard
- Maintain accessibility for screen readers and keyboard users
- Ensure responsive behavior across mobile, tablet, and desktop viewports

## Architecture

### Component Structure

```
TeamCarousel (Container Component)
├── CarouselViewport (fade transition wrapper)
│   └── CarouselContainer (slides container)
│       ├── CinematicSlide (first slide - group photo with fade)
│       └── ProfileSlide[] (8 individual profile slides with fade + avatar slide)
├── NavigationArrows
│   ├── PreviousButton
│   └── NextButton
└── ThumbnailIndicators
    └── ThumbnailButton[] (9 thumbnails total)
```

### State Management

The component uses React hooks for local state management:

- `selectedIndex`: Currently active slide index (0-8)
- `isTransitioning`: Boolean indicating if fade transition is in progress
- `autoplayTimer`: Timer reference for 4-second auto-rotation
- `direction`: Navigation direction for avatar animation ('next' or 'prev')

### Integration Point

The TeamCarousel component will be inserted into `Home.tsx` replacing the existing `features-section`. The component will be wrapped in a `ScrollScaleSection` to maintain consistency with other home page sections.

```tsx
// In Home.tsx, replace:
<ScrollScaleSection>
  <section className="features-section">
    {/* existing features content */}
  </section>
</ScrollScaleSection>

// With:
<ScrollScaleSection>
  <section className="team-section">
    <TeamCarousel />
  </section>
</ScrollScaleSection>
```

## Components and Interfaces

### TeamCarousel Component

**File**: `app/src/components/TeamCarousel.tsx`

**Props**: None (self-contained component)

**Responsibilities**:
- Manage slide state and fade transitions
- Manage auto-rotation timer (4-second intervals)
- Handle navigation events (arrows, thumbnails, keyboard)
- Reset timer on manual interaction
- Trigger avatar slide-in animations on slide change
- Provide accessibility attributes

**Key Methods**:
- `onSelect()`: Update selected index when slide changes
- `scrollPrev()`: Navigate to previous slide with wrap-around and fade transition
- `scrollNext()`: Navigate to next slide with wrap-around and fade transition
- `scrollTo(index)`: Jump to specific slide with fade transition
- `resetAutoplay()`: Reset the 4-second timer after manual interaction
- `triggerFadeTransition()`: Initiate fade out/in effect between slides

### CinematicSlide Component

**File**: `app/src/components/TeamCarousel/CinematicSlide.tsx`

**Props**:
```tsx
interface CinematicSlideProps {
  imageSrc: string;
  alt: string;
}
```

**Responsibilities**:
- Display full-width cinematic group photo
- Maintain aspect ratio across viewports
- Apply fade transition when slide becomes active
- Apply subtle overlay for text readability (if text is added)

### ProfileSlide Component

**File**: `app/src/components/TeamCarousel/ProfileSlide.tsx`

**Props**:
```tsx
interface ProfileSlideProps {
  name: string;
  role: string;
  description: string;
  avatarSrc: string;
  roleColor: string; // Badge background color
}
```

**Responsibilities**:
- Display team member information in a card layout
- Position avatar on the right side with smooth slide-in animation
- Style role badge with provided color
- Maintain readability on dark background
- Apply fade transition when slide becomes active

### NavigationArrow Component

**File**: `app/src/components/TeamCarousel/NavigationArrow.tsx`

**Props**:
```tsx
interface NavigationArrowProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}
```

**Responsibilities**:
- Render chevron icon (left or right)
- Handle click events
- Provide hover feedback
- Include ARIA labels for accessibility

### ThumbnailIndicator Component

**File**: `app/src/components/TeamCarousel/ThumbnailIndicator.tsx`

**Props**:
```tsx
interface ThumbnailIndicatorProps {
  imageSrc: string;
  alt: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}
```

**Responsibilities**:
- Display small avatar thumbnail
- Highlight active slide with border/scale effect
- Handle click to navigate to slide
- Provide alt text for accessibility

## Data Models

### TeamMember Interface

```tsx
interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarSrc: string;
  roleColor: string;
}
```

### CarouselSlide Union Type

```tsx
type CarouselSlide = CinematicSlide | ProfileSlide;

interface CinematicSlide {
  type: 'cinematic';
  imageSrc: string;
  alt: string;
}

interface ProfileSlide {
  type: 'profile';
  member: TeamMember;
}
```

### Team Data Structure

The team data will be defined as a constant array in the TeamCarousel component:

```tsx
const TEAM_SLIDES: CarouselSlide[] = [
  {
    type: 'cinematic',
    imageSrc: '/images/team/group-photo.png',
    alt: 'Ploofyz team members together in a scenic Minecraft setting'
  },
  {
    type: 'profile',
    member: {
      id: 'yuki',
      name: 'Yuki',
      role: 'Web Developer',
      description: 'Crafts beautiful web experiences...',
      avatarSrc: '/images/team/yuki-avatar.png',
      roleColor: '#ec4899' // pink
    }
  },
  // ... 7 more profile slides
];
```

### Animation Configuration

**Slide Fade Transition**:
```tsx
const FADE_TRANSITION = {
  duration: 600, // milliseconds
  timingFunction: 'ease-in-out',
};
```

**Avatar Slide Animation** (Framer Motion):
```tsx
const AVATAR_SLIDE_VARIANTS = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};
```

## Error Handling

### Image Loading Failures

**Strategy**: Graceful degradation with fallback placeholders

- If avatar image fails to load, display a colored circle with initials
- If cinematic image fails to load, display a gradient background with team name
- Use `onError` handler on `<img>` elements to detect failures

```tsx
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/images/team/fallback-avatar.png';
};
```

### Embla Initialization Failures

**Strategy**: Fallback to CSS-only transitions

- The carousel uses CSS transitions for fade effects (no embla dependency)
- Avatar animations use Framer Motion (already a project dependency)
- If Framer Motion fails, avatars render without animation
- Log error to console for debugging

```tsx
try {
  // Framer Motion animations
  <motion.img variants={AVATAR_SLIDE_VARIANTS} />
} catch (error) {
  console.error('Animation library error:', error);
  // Fallback to static image
  <img src={avatarSrc} alt={name} />
}
```

### Timer Memory Leaks

**Strategy**: Cleanup in useEffect

- Clear autoplay timer in useEffect cleanup function
- Clear timer when component unmounts
- Clear timer before setting new timer

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    scrollNext(); // Uses fade transition
  }, 4000);
  
  return () => clearInterval(timer);
}, [selectedIndex]);
```

### Invalid Navigation Indices

**Strategy**: Bounds checking and validation

- Validate index before updating selectedIndex state
- Clamp index to valid range [0, slideCount - 1]
- Handle edge cases for empty slide arrays
- Prevent navigation during fade transition

```tsx
const scrollToSafe = (index: number) => {
  if (isTransitioning) return; // Prevent navigation during transition
  const clampedIndex = Math.max(0, Math.min(index, slideCount - 1));
  setSelectedIndex(clampedIndex);
};
```

## Testing Strategy

### Unit Testing Approach

The testing strategy uses Vitest for unit tests and focuses on specific examples, edge cases, and integration points. Unit tests verify concrete behaviors and error conditions.

**Test Files**:
- `TeamCarousel.test.tsx`: Component rendering and interaction
- `NavigationArrow.test.tsx`: Arrow button behavior
- `ThumbnailIndicator.test.tsx`: Thumbnail selection
- `ProfileSlide.test.tsx`: Profile card rendering
- `CinematicSlide.test.tsx`: Cinematic slide rendering

**Key Unit Test Cases**:

1. **Rendering Tests**
   - Carousel renders with 9 slides (1 cinematic + 8 profiles)
   - Navigation arrows are present and visible
   - Thumbnail indicators match slide count
   - First slide (cinematic) is active on mount

2. **Navigation Tests**
   - Clicking next arrow advances to next slide
   - Clicking previous arrow goes to previous slide
   - Clicking last slide's next arrow wraps to first slide
   - Clicking first slide's previous arrow wraps to last slide
   - Clicking thumbnail navigates to corresponding slide

3. **Keyboard Navigation Tests**
   - Arrow keys navigate between slides
   - Tab key focuses navigation elements
   - Enter/Space on thumbnail selects that slide

4. **Accessibility Tests**
   - Navigation arrows have ARIA labels
   - Thumbnails have alt text
   - Active slide is announced to screen readers
   - Focus management works correctly

5. **Edge Cases**
   - Image load failures show fallback
   - Empty team data array handles gracefully
   - Rapid clicking doesn't break navigation
   - Timer cleanup prevents memory leaks

6. **Responsive Behavior**
   - Component renders on mobile viewport
   - Touch events work on thumbnails
   - Layout adjusts for tablet and desktop

### Property-Based Testing Approach

Property-based tests will be implemented using **fast-check** library for TypeScript/JavaScript. Each test will run a minimum of 100 iterations to ensure comprehensive coverage across randomized inputs.

**Property Test Configuration**:
```tsx
import fc from 'fast-check';

// Minimum 100 iterations per property test
const TEST_ITERATIONS = 100;

fc.assert(
  fc.property(/* generators */, /* test function */),
  { numRuns: TEST_ITERATIONS }
);
```

**Test Tagging Convention**:
Each property test will include a comment tag referencing the design document property:
```tsx
// Feature: meet-the-team-carousel, Property 1: Navigation wrapping
```

The Correctness Properties section will define the specific properties to be tested, and each will be implemented as a property-based test following this configuration.



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Single Active Profile

*For any* carousel state, exactly one profile slide should be marked as active at any given time.

**Validates: Requirements 2.1**

### Property 2: Profile Completeness

*For any* active profile slide (excluding the cinematic slide), the displayed content should include all required fields: team member name, role badge, description text, and avatar image.

**Validates: Requirements 2.2, 2.3, 2.4, 2.5**

### Property 3: Navigation Direction Consistency

*For any* current slide index, clicking the next arrow should advance to the next sequential slide (with wrapping), and clicking the previous arrow should move to the previous sequential slide (with wrapping).

**Validates: Requirements 3.3, 3.4**

### Property 4: Auto-Rotation Advancement

*For any* carousel state, if no manual interaction occurs for 4 seconds, the carousel should automatically advance to the next slide.

**Validates: Requirements 4.1**

### Property 5: Manual Interaction Timer Reset

*For any* manual interaction (arrow click or thumbnail click), the auto-rotation timer should reset and continue counting from zero.

**Validates: Requirements 4.2, 4.3, 4.4**

### Property 6: Thumbnail Count Matches Slides

*For any* carousel configuration, the number of thumbnail indicators displayed should equal the total number of slides (9 slides = 9 thumbnails).

**Validates: Requirements 5.1**

### Property 7: Active Thumbnail Visual Distinction

*For any* active slide, the corresponding thumbnail indicator should have a visual distinction (different class, style, or attribute) from inactive thumbnails.

**Validates: Requirements 5.2**

### Property 8: Thumbnail Navigation Accuracy

*For any* thumbnail indicator, clicking it should navigate the carousel to the corresponding slide index.

**Validates: Requirements 5.3**

### Property 9: Thumbnail Avatar Presence

*For any* thumbnail indicator, it should display an avatar image with a valid src attribute.

**Validates: Requirements 5.4**

### Property 10: Touch Event Navigation

*For any* interactive element (navigation arrows or thumbnail indicators), touch events should trigger the same navigation behavior as click events.

**Validates: Requirements 6.4, 6.5**

### Property 11: Transition Timing Constraint

*For any* slide transition, the animation should complete within 600 milliseconds.

**Validates: Requirements 7.1**

### Property 12: Navigation Arrow ARIA Labels

*For any* navigation arrow element, it should include an aria-label attribute that describes its function ("Previous slide" or "Next slide").

**Validates: Requirements 8.1**

### Property 13: Thumbnail Alt Text Presence

*For any* thumbnail indicator, the image element should include alt text containing the team member's name.

**Validates: Requirements 8.2**

### Property 14: Keyboard Navigation Support

*For any* carousel state, pressing the left arrow key should navigate to the previous slide, and pressing the right arrow key should navigate to the next slide.

**Validates: Requirements 8.3**

### Property 15: Focus Management

*For any* tab key press sequence, the focus should move through all interactive elements (navigation arrows and thumbnail indicators) in a logical order.

**Validates: Requirements 8.4**

### Property 16: Screen Reader Announcements

*For any* slide change, the new active profile should be announced to screen readers via ARIA live region or role attribute.

**Validates: Requirements 8.5**

