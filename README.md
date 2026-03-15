# Ploofyz Website Improvements

This folder contains all the improved files for your Ploofyz website. Here's a summary of the changes made:

## Changes Made

### 1. Team Carousel Improvements

**Files Modified:**
- `app/src/components/TeamCarousel/TeamCarousel.tsx`
- `app/src/components/TeamCarousel/NavigationArrow.tsx`
- `app/src/components/TeamCarousel/NavigationArrow.css`
- `app/src/components/TeamCarousel/ThumbnailIndicator.css`
- `app/src/components/TeamCarousel/TeamCarousel.css`

**Improvements:**
- **Avatar Bounce Animation**: When you click the arrow, the avatar now bounces up slightly before changing the slide (like in your reference image)
- **Bigger Icons**: Navigation arrows are now larger (36px-40px depending on screen size)
- **Fixed Overlapping Avatars**: Thumbnails now scroll horizontally on small screens instead of overlapping
- **Responsive Design**: Better handling of different screen sizes

### 2. Navigation Changes (About → Vote)

**Files Modified:**
- `app/src/components/Navigation.tsx`
- `app/src/App.tsx`

**Changes:**
- Changed "About" to "Vote" in the navigation menu
- Updated the Page type to include 'vote' instead of 'about'
- Updated search content for the Vote page

### 3. New Vote Page

**New Files:**
- `app/src/pages/Vote.tsx`
- `app/src/pages/Vote.css`

**Features:**
- Centered Ploofyz logo at the top
- 6 Apple-style vote buttons with gradient backgrounds
- Each button opens in a new tab when clicked
- Smooth hover animations and shine effects
- Voting rewards section
- Fully responsive design

**To customize the vote links:**
Edit the `voteLinks` array in `app/src/pages/Vote.tsx`:
```typescript
const voteLinks = [
  { 
    id: 1, 
    label: 'Vote #1', 
    url: 'https://your-vote-link-1.com',
    icon: <Star size={24} />,
    color: 'from-violet-500 to-purple-600'
  },
  // ... add your other vote links
];
```

### 4. Centered Logo on All Pages

**Files Modified:**
- `app/src/pages/Home.tsx`
- `app/src/pages/Store.tsx`
- `app/src/pages/Join.tsx`
- `app/src/pages/ServerRanks.tsx`

**Changes:**
- Added centered Ploofyz logo at the top of each page's hero section
- Logo has smooth fade-in animation
- Responsive sizing for different screen sizes

## How to Apply These Changes

### Option 1: Copy Files to Your Repository

1. Copy all files from `app/src/components/TeamCarousel/` to your repository
2. Copy `app/src/components/Navigation.tsx` to your repository
3. Copy `app/src/App.tsx` to your repository
4. Copy `app/src/pages/Vote.tsx` and `app/src/pages/Vote.css` to your repository
5. Copy `app/src/pages/Home.tsx`, `Store.tsx`, `Join.tsx`, `ServerRanks.tsx` to your repository

### Option 2: Manual Changes

If you prefer to make changes manually, here are the key modifications:

#### TeamCarousel.tsx
- Added `isBouncing` state to track arrow click animation
- Added `bounceDirection` state ('prev' | 'next' | null)
- Modified `handlePrevClick` and `handleNextClick` to trigger bounce animation before changing slide
- Wrapped slides in `AnimatePresence` for smoother transitions

#### NavigationArrow.tsx
- Added `isBouncing` prop
- Added Framer Motion animations for bounce effect
- Arrow icon now bounces up when clicked

#### NavigationArrow.css
- Increased icon sizes (36px mobile, 40px desktop)
- Added circular background with blur effect
- Better hover states

#### ThumbnailIndicator.css
- Increased thumbnail sizes (52px-64px)
- Better active state with glow effect
- Added CSS variables for responsive sizing

#### TeamCarousel.css
- Fixed thumbnail container to scroll horizontally on small screens
- Added `overflow-x: auto` and hid scrollbar
- Better responsive breakpoints

#### Navigation.tsx
- Changed navItems array: `{ label: 'Vote', page: 'vote' }`
- Added searchable content for vote page

#### App.tsx
- Changed Page type: `export type Page = 'home' | 'vote' | 'store' | 'join' | 'ranks';`
- Updated page rendering to use Vote component

## Testing

After applying the changes:

1. Run `npm install` to ensure all dependencies are installed
2. Run `npm run dev` to start the development server
3. Test the Team Carousel:
   - Click arrows to see avatar bounce animation
   - Resize browser to test responsive thumbnails
   - Check that thumbnails don't overlap on small screens
4. Test the Vote page:
   - Navigate to Vote from the menu
   - Click vote buttons to ensure they open in new tabs
   - Check responsive design on mobile
5. Test other pages to ensure logos are centered

## Browser Compatibility

These changes are compatible with:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- The Vote page buttons currently have placeholder URLs. Update them with your actual vote links.
- The Team Carousel maintains all existing accessibility features.
- All animations use hardware acceleration for smooth performance.
