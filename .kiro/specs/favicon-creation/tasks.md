# Implementation Plan: Favicon Creation

## Overview

This implementation adds favicon support to the Ploofyz GitHub Pages site by generating multiple favicon formats from the provided gradient design and integrating them into all HTML entry points. The approach leverages Vite's public directory feature for automatic asset copying during builds, ensuring favicons are accessible in both development and production environments.

## Tasks

- [x] 1. Generate favicon files from source image
  - Use an online favicon generator (e.g., favicon.io, realfavicongenerator.net) or CLI tool to convert the provided gradient image
  - Generate the following files:
    - `favicon.ico` (multi-resolution: 16x16 and 32x32)
    - `favicon-16x16.png`
    - `favicon-32x32.png`
    - `favicon-192x192.png`
    - `apple-touch-icon.png` (180x180)
    - `favicon.svg` (optional, if source supports it)
  - Verify that the blue-to-purple gradient and geometric pattern are preserved at each size
  - Ensure `favicon.ico` is less than 50KB
  - Place all generated files in `app/public/` directory
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.3, 5.4_

- [ ]* 1.1 Write unit tests for favicon file existence and properties
  - Test that all required favicon files exist in `app/public/`
  - Test that PNG files have correct dimensions using `image-size` package
  - Test that `favicon.ico` is less than 50KB
  - Test that PNG files are reasonably compressed
  - _Requirements: 1.1, 1.2, 1.3, 5.1, 5.3, 5.4, 5.5_

- [x] 2. Add favicon link tags to root index.html
  - Open `index.html` at repository root
  - Add the following link tags in the `<head>` section:
    ```html
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    ```
  - Use root-relative paths (starting with `/`) for all href attributes
  - _Requirements: 2.1, 2.5, 3.4_

- [x] 3. Add favicon link tags to app/index.html
  - Open `app/index.html`
  - Add the same favicon link tags as in task 2 to the `<head>` section
  - Ensure paths are root-relative (starting with `/`)
  - _Requirements: 2.2, 2.5, 3.4_

- [ ]* 3.1 Write unit tests for HTML favicon references
  - Test that `index.html` contains all required favicon link tags with correct attributes
  - Test that `app/index.html` contains all required favicon link tags with correct attributes
  - Use `cheerio` or `jsdom` to parse HTML and verify link tag presence and attributes
  - Verify `rel`, `type`, `sizes`, and `href` attributes are correct
  - _Requirements: 2.1, 2.2, 2.5, 3.4, 3.5_

- [x] 4. Verify build process copies favicon files
  - Run `npm run build` in the `app/` directory
  - Verify that all favicon files are copied from `app/public/` to `app/dist/`
  - Verify that `app/dist/index.html` contains the favicon link tags
  - Check that build completes without errors or warnings
  - _Requirements: 4.1, 4.2, 4.5_

- [ ]* 4.1 Write unit tests for build process
  - Test that `npm run build` completes successfully (exit code 0)
  - Test that all favicon files exist in `app/dist/` after build
  - Test that `app/dist/index.html` contains all favicon link tags
  - Test that build output contains no errors or warnings related to favicons
  - _Requirements: 4.1, 4.2, 4.5_

- [x] 5. Checkpoint - Verify implementation and run tests
  - Ensure all favicon files exist in `app/public/` and `app/dist/`
  - Ensure all HTML files contain correct favicon link tags
  - Run all unit tests and verify they pass
  - Manually verify visual quality of favicon files at different sizes
  - Ask the user if questions arise

- [x] 6. Manual browser testing (user verification)
  - Test favicon display in Chrome, Firefox, Safari, and Edge
  - Test favicon display on mobile browsers
  - Test Apple touch icon on iOS home screen
  - Verify no 404 errors in browser console
  - Clear browser cache before testing to ensure fresh favicon load
  - _Requirements: 3.1, 3.2, 3.3, 3.5, 2.4_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster implementation
- Task 1 (favicon generation) is a one-time manual process using external tools
- Vite automatically copies files from `app/public/` to `app/dist/` during builds - no configuration needed
- Root-relative paths (`/favicon.ico`) ensure consistent resolution across all HTML entry points
- Manual browser testing (task 6) requires user verification as it cannot be automated
- The build process should work without any modifications to Vite configuration
