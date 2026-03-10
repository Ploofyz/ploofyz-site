/**
 * Property-Based Tests for ProfileSlide Component
 * Feature: meet-the-team-carousel
 * 
 * These tests use fast-check to verify properties hold across randomized inputs.
 * Minimum 100 iterations per property test as specified in design document.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { ProfileSlide } from './ProfileSlide';

// Test configuration: minimum 100 iterations
const TEST_ITERATIONS = 100;

/**
 * Arbitrary generators for ProfileSlide props
 */
const nameArbitrary = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);
const roleArbitrary = fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0);
const descriptionArbitrary = fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0);
const avatarSrcArbitrary = fc.webUrl();
const roleColorArbitrary = fc.hexaString({ minLength: 6, maxLength: 6 }).map(hex => `#${hex}`);

const profileSlidePropsArbitrary = fc.record({
  name: nameArbitrary,
  role: roleArbitrary,
  description: descriptionArbitrary,
  avatarSrc: avatarSrcArbitrary,
  roleColor: roleColorArbitrary,
});

describe('ProfileSlide - Property-Based Tests', () => {
  /**
   * Property 2: Profile Completeness
   * **Validates: Requirements 2.2, 2.3, 2.4, 2.5**
   * 
   * For any active profile slide (excluding the cinematic slide), 
   * the displayed content should include all required fields: 
   * team member name, role badge, description text, and avatar image.
   */
  it('Property 2: Profile Completeness - all required fields are present', () => {
    fc.assert(
      fc.property(profileSlidePropsArbitrary, (props) => {
        const { container } = render(
          <ProfileSlide
            name={props.name}
            role={props.role}
            description={props.description}
            avatarSrc={props.avatarSrc}
            roleColor={props.roleColor}
          />
        );

        // Requirement 2.2: Team member name must be present
        const nameElement = screen.getByText(props.name);
        expect(nameElement).toBeInTheDocument();
        expect(nameElement).toHaveClass('profile-slide__name');

        // Requirement 2.3: Role badge must be present
        const roleBadge = screen.getByText(props.role.toUpperCase());
        expect(roleBadge).toBeInTheDocument();
        expect(roleBadge).toHaveClass('profile-slide__badge');
        expect(roleBadge).toHaveStyle({ backgroundColor: props.roleColor });

        // Requirement 2.4: Description text must be present
        const descriptionElement = screen.getByText(props.description);
        expect(descriptionElement).toBeInTheDocument();
        expect(descriptionElement).toHaveClass('profile-slide__description');

        // Requirement 2.5: Avatar image must be present
        // The avatar can be either an img element or a fallback div
        const avatarImg = container.querySelector('.profile-slide__avatar');
        const avatarFallback = container.querySelector('.profile-slide__avatar-fallback');
        
        // At least one avatar representation must exist
        expect(avatarImg || avatarFallback).toBeTruthy();

        // If it's an image, verify it has the correct src
        if (avatarImg) {
          expect(avatarImg).toHaveAttribute('src', props.avatarSrc);
          expect(avatarImg).toHaveAttribute('alt', `${props.name}'s Minecraft avatar`);
        }

        // If it's a fallback, verify it has the initials
        if (avatarFallback) {
          const initials = props.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          expect(screen.getByText(initials)).toBeInTheDocument();
        }

        // Verify the profile card container exists
        const profileCard = container.querySelector('.profile-slide__card');
        expect(profileCard).toBeInTheDocument();

        // Verify the content container exists
        const contentContainer = container.querySelector('.profile-slide__content');
        expect(contentContainer).toBeInTheDocument();

        // Verify the avatar container exists
        const avatarContainer = container.querySelector('.profile-slide__avatar-container');
        expect(avatarContainer).toBeInTheDocument();
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Additional property test: Role badge color consistency
   * Verifies that the role badge always uses the provided roleColor
   */
  it('Property: Role badge color is always applied correctly', () => {
    fc.assert(
      fc.property(profileSlidePropsArbitrary, (props) => {
        render(
          <ProfileSlide
            name={props.name}
            role={props.role}
            description={props.description}
            avatarSrc={props.avatarSrc}
            roleColor={props.roleColor}
          />
        );

        const roleBadge = screen.getByText(props.role.toUpperCase());
        expect(roleBadge).toHaveStyle({ backgroundColor: props.roleColor });
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Additional property test: Name is always displayed in avatar alt text
   * Verifies accessibility requirement for avatar images
   */
  it('Property: Avatar alt text always includes team member name', () => {
    fc.assert(
      fc.property(profileSlidePropsArbitrary, (props) => {
        const { container } = render(
          <ProfileSlide
            name={props.name}
            role={props.role}
            description={props.description}
            avatarSrc={props.avatarSrc}
            roleColor={props.roleColor}
          />
        );

        const avatarImg = container.querySelector('.profile-slide__avatar');
        
        // If avatar image is rendered (not fallback), verify alt text
        if (avatarImg) {
          expect(avatarImg).toHaveAttribute('alt', `${props.name}'s Minecraft avatar`);
        }
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });
});
