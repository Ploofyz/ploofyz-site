# Bugfix Requirements Document

## Introduction

The home page hero section has multiple layout issues that prevent it from matching the intended design. The Ploofyz logo is missing from the hero section, social media icons are displayed vertically instead of horizontally in the navigation bar, navigation buttons are visible but the layout doesn't match the reference design, and the overall CSS structure needs cleanup. This bugfix addresses these layout inconsistencies to restore the intended visual hierarchy and user experience.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the home page loads THEN the Ploofyz logo is not displayed in the hero section (it only appears in the navigation bar when scrolled)

1.2 WHEN viewing the navigation bar THEN the social media icons (Discord, YouTube, TikTok) are displayed vertically in a flex column layout instead of horizontally

1.3 WHEN the home page loads THEN the hero section uses a video-left, content-right layout but lacks the logo element that should be prominently displayed

1.4 WHEN viewing the hero section THEN the background placeholder is implemented but the logo sizing and positioning don't match the reference design

1.5 WHEN the navigation bar is rendered THEN the CSS uses absolute positioning for the logo which conflicts with the intended layout structure

### Expected Behavior (Correct)

2.1 WHEN the home page loads THEN the Ploofyz logo SHALL be displayed prominently in the hero section at a reasonable size (200px width on desktop, responsive on mobile)

2.2 WHEN viewing the navigation bar THEN the social media icons SHALL be displayed horizontally in the top-left with proper spacing (gap: 0.75rem)

2.3 WHEN the home page loads THEN the hero section SHALL include the logo element positioned above or integrated with the video-content layout

2.4 WHEN viewing the hero section THEN the logo SHALL have appropriate styling with drop-shadow filter and hover effects

2.5 WHEN the navigation bar is rendered THEN the CSS SHALL use proper flexbox layout without conflicting absolute positioning

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the user scrolls the page THEN the navigation bar SHALL CONTINUE TO show the scrolled state with backdrop blur and border

3.2 WHEN clicking navigation buttons (Home, Vote, Store, Join, Ranks) THEN the navigation SHALL CONTINUE TO work correctly and navigate to the appropriate pages

3.3 WHEN clicking social media icons THEN they SHALL CONTINUE TO open the correct external links in new tabs

3.4 WHEN viewing on mobile devices THEN the mobile menu SHALL CONTINUE TO function with the hamburger button and slide-out menu

3.5 WHEN the hero section video placeholder is displayed THEN it SHALL CONTINUE TO show the play button and "Video Coming Soon" text

3.6 WHEN viewing the server IP box THEN it SHALL CONTINUE TO display "play.ploofyz.com" with proper styling

3.7 WHEN the page loads THEN all animations and transitions SHALL CONTINUE TO work smoothly (fade-in, slide-in effects)

3.8 WHEN hovering over interactive elements THEN they SHALL CONTINUE TO show hover states (buttons, links, cards)

3.9 WHEN viewing other page sections (Team, Ranks, CTA) THEN they SHALL CONTINUE TO render correctly without layout issues

3.10 WHEN resizing the browser window THEN the responsive breakpoints SHALL CONTINUE TO work correctly at 1024px, 640px, and 480px
