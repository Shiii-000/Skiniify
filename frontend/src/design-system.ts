// Skiniify Design System - Premium Dark Mode CS2 Platform
// A carefully crafted visual identity for a professional SaaS experience

export const designTokens = {
  // Colors
  colors: {
    background: {
      base: '#0a0a0b',        // Near-black main background
      surface: '#111113',     // Card backgrounds
      surfaceHover: '#161618',
      elevated: '#1c1c1e',    // Elevated components
    },
    border: {
      subtle: '#27272a',      // Subtle borders (1px)
      medium: '#3f3f46',      // Medium importance borders
      strong: '#52525b',      // Strong borders for separation
    },
    primary: {
      base: '#06b6d4',        // Cyan primary
      hover: '#0eeea1',       // Lighter cyan on hover
      muted: '#2dd4bf',       // Muted cyan for accents
    },
    secondary: {
      base: '#6366f1',        // Indigo secondary
      subtle: '#8b8cf9',
    },
    success: {
      base: '#10b981',        // Green for positive states
      muted: '#34d399',
    },
    warning: {
      base: '#f59e0b',        // Amber for warnings
      muted: '#fcd34d',
    },
    danger: {
      base: '#ef4444',        // Red for errors/danger
      muted: '#f87171',
    },
    rarity: {
      milSpec: '#9ca3af',     // Gray (Mil-Spec)
      restricted: '#f97316',  // Orange (Restricted)
      classified: '#eab308',  // Yellow (Classified)
      covert: '#a855f7',      // Purple (Covert)
      knife: '#fbbf24',       // Gold (Knife)
      glove: '#ec4899',       // Pink (Glove)
    },
    text: {
      primary: '#f4f4f5',     // Main text (near white)
      secondary: '#a1a1aa',   // Secondary text (gray)
      muted: '#71717a',       // Tertiary text (light gray)
      subtle: '#52525b',      // Subtle metadata
    },
  },

  // Typography
  typography: {
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',          // 12px - metadata
      sm: '0.875rem',         // 14px - labels
      base: '1rem',           // 16px - body text
      lg: '1.125rem',         // 18px - headings
      xl: '1.25rem',          // 20px - section titles
      '2xl': '1.5rem',        // 24px - page titles
      '3xl': '1.875rem',      // 30px - hero headings
      '4xl': '2.25rem',       // 36px - display numbers
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',          // Tight for numbers
      normal: '1.5',          // Normal for body
      relaxed: '1.625',       // Relaxed for headings
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',            // 4px
    sm: '0.5rem',             // 8px
    md: '0.75rem',            // 12px
    lg: '1rem',               // 16px
    xl: '1.25rem',            // 20px
    '2xl': '1.5rem',          // 24px
    '3xl': '1.875rem',        // 30px
    '4xl': '2.25rem',         // 36px
  },

  // Border Radius
  radius: {
    sm: '0.25rem',            // 4px - subtle
    md: '0.5rem',             // 8px - standard
    lg: '0.75rem',            // 12px - elevated
    xl: '1rem',               // 16px - prominent
    full: '9999px',          // Circle/rounded corners
  },

  // Shadows (very subtle for premium feel)
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 2px 8px rgba(0, 0, 0, 0.4)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.5)',
    xl: '0 8px 32px rgba(0, 0, 0, 0.6)',
  },

  // Transitions (micro-interactions)
  transition: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // Z-index scale
  zIndex: {
    dropdown: '100',
    modal: '200',
    popover: '300',
    sticky: '400',
    overlay: '500',
  },
};

// Utility class builder for Tailwind-like syntax
export const utilityClasses = {
  // Background utilities
  bgBase: 'bg-[#0a0a0b]',
  bgSurface: 'bg-[#111113]',
  bgElevated: 'bg-[#1c1c1e]',
  
  // Border utilities
  borderSubtle: 'border-[#27272a]',
  borderMedium: 'border-[#3f3f46]',
  borderStrong: 'border-[#52525b]',
  
  // Text utilities
  textPrimary: 'text-[#f4f4f5]',
  textSecondary: 'text-[#a1a1aa]',
  textMuted: 'text-[#71717a]',
  textSubtle: 'text-[#52525b]',
  
  // Primary utilities
  primaryBase: 'text-[#06b6d4]',
  primaryHover: 'hover:text-[#0eeea1]',
  primaryBg: 'bg-[#06b6d4]',
  primaryBgHover: 'hover:bg-[#0eeea1]',
  
  // Rarity utilities
  rarityMilSpec: 'text-[#9ca3af]',
  rarityRestricted: 'text-[#f97316]',
  rarityClassified: 'text-[#eab308]',
  rarityCovert: 'text-[#a855f7]',
  rarityKnife: 'text-[#fbbf24]',
  
  // Size utilities (using design tokens)
  fontSizeXs: 'text-[0.75rem]',
  fontSizeSm: 'text-[0.875rem]',
  fontSizeBase: 'text-base',
  fontSizeLg: 'text-[1.125rem]',
  fontSizeXl: 'text-[1.25rem]',
  fontSize2Xl: 'text-[1.5rem]',
  fontSize3Xl: 'text-[1.875rem]',
  fontSize4Xl: 'text-[2.25rem]',
  
  fontWeightNormal: 'font-normal',
  fontWeightMedium: 'font-medium',
  fontWeightSemibold: 'font-semibold',
  fontWeightBold: 'font-bold',
  
  // Spacing utilities (using design tokens)
  spacingXs: 'gap-[0.25rem]',
  spacingSm: 'gap-[0.5rem]',
  spacingMd: 'gap-[0.75rem]',
  spacingLg: 'gap-[1rem]',
  spacingXl: 'gap-[1.25rem]',
  
  // Border radius utilities
  radiusSm: 'rounded-sm',      // rounded-[0.25rem]
  radiusMd: 'rounded-md',      // rounded-[0.5rem]
  radiusLg: 'rounded-lg',      // rounded-[0.75rem]
  radiusXl: 'rounded-xl',      // rounded-[1rem]
  
  // Shadow utilities
  shadowSm: 'shadow-[0_1px_2px_rgba(0,0,0,0.3)]',
  shadowMd: 'shadow-[0_2px_8px_rgba(0,0,0,0.4)]',
  shadowLg: 'shadow-[0_4px_16px_rgba(0,0,0,0.5)]',
  
  // Transition utilities
  transitionNormal: 'transition-all duration-200 ease-in-out',
  transitionSlow: 'transition-all duration-300 ease-in-out',
};