# Team Carousel Image Requirements

## Overview

The TeamCarousel component now supports two different types of images for each team member:

1. **Full Body Images** - Used in the main profile slides (yellow circle in your screenshot)
2. **Head-Only Images** - Used in the thumbnail indicators (pink circle in your screenshot)

## Image Types

### Full Body Images (`*-fullbody.png`)
- **Usage**: Main profile slides where users see the full team member presentation
- **Recommended Size**: 280px × 280px (desktop), responsive down to 160px on mobile
- **Content**: Full Minecraft character body/skin
- **Format**: PNG with transparency
- **Location**: `/images/team/{name}-fullbody.png`

### Head-Only Images (`*-avatar.png`)
- **Usage**: Thumbnail indicators at the bottom of the carousel
- **Recommended Size**: 48px × 48px (desktop), responsive down to 40px on mobile
- **Content**: Just the head/face of the Minecraft character
- **Format**: PNG with transparency
- **Location**: `/images/team/{name}-avatar.png`

## Current Team Members

| Name | Full Body Image | Head-Only Image |
|------|----------------|-----------------|
| Ploofnix | `ploof-fullbody.png` | `ploof-avatar.png` |
| Alex | `alex-fullbody.png` | `alex-avatar.png` |
| Jordan | `jordan-fullbody.png` | `jordan-avatar.png` |
| Sam | `sam-fullbody.png` | `sam-avatar.png` |
| Taylor | `taylor-fullbody.png` | `taylor-avatar.png` |
| Morgan | `morgan-fullbody.png` | `morgan-avatar.png` |
| Casey | `casey-fullbody.png` | `casey-avatar.png` |
| Riley | `riley-fullbody.png` | `riley-avatar.png` |

## Current Status

✅ **Code Implementation**: Complete - carousel now uses separate images
⚠️ **Placeholder Images**: Currently using head images as placeholders for full body
🎨 **Action Required**: Replace `*-fullbody.png` files with actual full body Minecraft character images

## Image Guidelines

### Full Body Images
- Show the complete Minecraft character skin
- Maintain consistent lighting and style
- Use transparent background
- Consider the character's pose and personality
- Ensure good contrast against dark carousel background

### Head-Only Images
- Crop to show just the head/face area
- Maintain pixelated Minecraft aesthetic
- Use transparent background
- Ensure recognizability at small sizes (40px)
- Keep consistent with the full body version

## Technical Notes

- Images are loaded with fallback handling (initials if image fails)
- CSS uses `image-rendering: pixelated` for Minecraft aesthetic
- Responsive sizing handled automatically by CSS
- Both image types support error states with graceful fallbacks

## Implementation Details

The carousel automatically:
1. Uses `avatarSrc` (full body) for main profile slides
2. Uses `thumbnailSrc` (head-only) for thumbnail indicators
3. Provides fallback initials if images fail to load
4. Maintains accessibility with proper alt text

Replace the placeholder full body images with your actual character designs to complete the implementation.