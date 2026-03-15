# Requirements Document

## Introduction

This feature enhances the existing TeamCarousel component with two new visual elements:
1. Small circular avatar head thumbnails at the bottom of the carousel, replacing the current square thumbnail indicators, to serve as navigation controls.
2. A full-body character image displayed on each profile slide alongside the existing text content.

The goal is to make the carousel more visually engaging and consistent with the team's Minecraft-style aesthetic by using avatar heads for navigation and full-body character art on each slide.

## Glossary

- **TeamCarousel**: The React component that displays team member profiles in a slideshow format.
- **ProfileSlide**: A carousel slide that displays a single team member's name, role, description, and imagery.
- **CinematicSlide**: The first carousel slide that displays the group photo.
- **ThumbnailIndicator**: The clickable navigation button at the bottom of the carousel used to jump to a specific slide.
- **AvatarThumbnail**: A small circular element used as a ThumbnailIndicator, displaying either a team member's Minecraft avatar head image or an initials placeholder when no avatar image is available.
- **InitialsPlaceholder**: A circular fallback element displaying a team member's initials on a solid background using their roleColor, shown when no Avatar_Image is available.
- **FullBodyImage**: A full-body character illustration for a team member (e.g. `bim-fullbody.png`).
- **Avatar_Image**: The existing square head/face crop of a team member's Minecraft skin (e.g. `bim-avatar.png`).
- **TeamMember**: A data record containing a team member's id, name, role, description, avatarSrc, fullBodySrc, and roleColor.
- **Carousel**: The overall carousel system including the viewport, slides, navigation arrows, and thumbnail indicators.

## Requirements

### Requirement 1: Avatar Head Thumbnails as Navigation Indicators

**User Story:** As a site visitor, I want to see small avatar head thumbnails at the bottom of the carousel, so that I can visually identify and navigate to any team member's slide.

#### Acceptance Criteria

1. WHEN a team member has an Avatar_Image available, THE ThumbnailIndicator SHALL display that Avatar_Image as a circular cropped thumbnail.
2. WHEN a team member does not have an Avatar_Image available, THE ThumbnailIndicator SHALL display an InitialsPlaceholder — the team member's initials centered on a solid background using their roleColor — until an avatar image is provided.
3. WHEN a ThumbnailIndicator is active (its corresponding slide is selected), THE ThumbnailIndicator SHALL display a visible highlight border using the team member's roleColor.
4. WHEN a ThumbnailIndicator is clicked, THE Carousel SHALL navigate to the corresponding slide.
5. THE ThumbnailIndicator for the CinematicSlide SHALL display the group photo cropped to a circular thumbnail.
6. THE ThumbnailIndicator SHALL maintain a minimum touch target size of 44x44 pixels on touch devices.
7. WHEN a ThumbnailIndicator receives keyboard focus, THE ThumbnailIndicator SHALL display a visible focus ring.
8. THE ThumbnailIndicator SHALL include an aria-label identifying the team member's name and slide position.

### Requirement 2: Full-Body Image on Profile Slides

**User Story:** As a site visitor, I want to see a full-body character image on each team member's slide, so that I get a richer visual representation of each team member.

#### Acceptance Criteria

1. WHEN a ProfileSlide is displayed, THE ProfileSlide SHALL render the team member's FullBodyImage alongside the text content.
2. THE ProfileSlide SHALL display the FullBodyImage on the right side of the slide on desktop viewports (768px and above).
3. THE ProfileSlide SHALL display the FullBodyImage below the text content on mobile viewports (below 768px).
4. IF a FullBodyImage fails to load, THEN THE ProfileSlide SHALL fall back to displaying the Avatar_Image.
5. IF both the FullBodyImage and Avatar_Image fail to load, THEN THE ProfileSlide SHALL display the member's initials on a colored background using roleColor.
6. THE FullBodyImage SHALL be rendered with `object-fit: contain` to preserve the full character without cropping.
7. THE FullBodyImage SHALL include a descriptive alt text in the format `"[name]'s full body character"`.

### Requirement 3: Team Member Data Includes Full-Body Image Source

**User Story:** As a developer, I want the team member data to include a fullBodySrc field, so that the ProfileSlide and ThumbnailIndicator components can reference the correct images.

#### Acceptance Criteria

1. THE TeamMember data type SHALL include a `fullBodySrc` field of type string containing the path to the FullBodyImage.
2. THE TEAM_SLIDES constant SHALL include a `fullBodySrc` value for each profile slide entry that has a corresponding fullbody image in `/images/team/`.
3. WHERE a team member does not have a fullbody image, THE TEAM_SLIDES constant SHALL set `fullBodySrc` to an empty string.
4. THE ProfileSlide component SHALL accept `fullBodySrc` as a required prop.

### Requirement 4: Animated Full-Body Image Entry

**User Story:** As a site visitor, I want the full-body image to animate into view when a slide becomes active, so that the transition feels polished and cinematic.

#### Acceptance Criteria

1. WHEN a ProfileSlide becomes the active slide, THE FullBodyImage SHALL animate from an offset position into its final position using a slide-in transition.
2. THE FullBodyImage animation SHALL complete within 700ms.
3. THE FullBodyImage animation SHALL use an ease-out timing curve.
4. WHEN a user has `prefers-reduced-motion` enabled, THE FullBodyImage SHALL appear without animation.

### Requirement 5: Circular Avatar Thumbnail Styling

**User Story:** As a site visitor, I want the avatar thumbnails to appear as clean circular images, so that the navigation row looks polished and consistent.

#### Acceptance Criteria

1. THE AvatarThumbnail SHALL be rendered as a circle using `border-radius: 50%`.
2. THE AvatarThumbnail SHALL have a uniform size of 48x48 pixels on desktop and 40x40 pixels on mobile.
3. WHEN an AvatarThumbnail is active, THE AvatarThumbnail SHALL scale to 1.15x its base size.
4. WHEN an AvatarThumbnail is hovered, THE AvatarThumbnail SHALL scale to 1.1x its base size.
5. THE AvatarThumbnail image SHALL use `image-rendering: pixelated` to preserve the pixel-art style of Minecraft skins.
6. WHEN an InitialsPlaceholder is displayed, THE InitialsPlaceholder SHALL render the initials in white text centered within the circle, using a font size proportional to the thumbnail size.
7. WHEN an Avatar_Image becomes available for a team member, THE ThumbnailIndicator SHALL display the Avatar_Image in place of the InitialsPlaceholder without requiring other code changes.
