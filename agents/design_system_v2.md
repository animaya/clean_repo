# Modern Minimalist Plant Store Design System

## Overview
A sophisticated, contemporary design system for a premium e-commerce landing page specializing in rare plants. Designed for discerning plant collectors aged 35-60, emphasizing modern minimalism, precision, and contemporary wellness aesthetics.

## Brand Principles
- **Modern Sophistication**: Clean, contemporary design language
- **Precision & Quality**: Attention to detail and craftsmanship
- **Wellness-Focused**: Promoting mindful living and urban sanctuary
- **Digital-First**: Tech-savvy approach to plant collecting
- **Visual Clarity**: 80% imagery, 20% text balance with stark contrast

---

## Color Palette

### Primary Colors
```css
/* Cool Steel Blue - Primary brand color */
--color-primary: #1E3A8A;           /* bg-blue-800 */
--color-primary-light: #3B82F6;     /* bg-blue-500 */
--color-primary-dark: #1E1B4B;      /* bg-indigo-900 */

/* Slate Blue - Secondary */
--color-secondary: #475569;         /* bg-slate-600 */
--color-secondary-light: #64748B;   /* bg-slate-500 */
--color-secondary-dark: #334155;    /* bg-slate-700 */
```

### Neutral Colors
```css
/* Cool Grays */
--color-neutral-50: #F8FAFC;        /* bg-slate-50 */
--color-neutral-100: #F1F5F9;       /* bg-slate-100 */
--color-neutral-200: #E2E8F0;       /* bg-slate-200 */
--color-neutral-300: #CBD5E1;       /* bg-slate-300 */
--color-neutral-400: #94A3B8;       /* bg-slate-400 */
--color-neutral-500: #64748B;       /* bg-slate-500 */
--color-neutral-600: #475569;       /* bg-slate-600 */
--color-neutral-700: #334155;       /* bg-slate-700 */
--color-neutral-800: #1E293B;       /* bg-slate-800 */
--color-neutral-900: #0F172A;       /* bg-slate-900 */
```

### Accent Colors
```css
/* Electric Cyan - Modern accent */
--color-accent: #06B6D4;            /* bg-cyan-500 */
--color-accent-light: #22D3EE;      /* bg-cyan-400 */
--color-accent-dark: #0891B2;       /* bg-cyan-600 */

/* Pure White - Clean contrast */
--color-pure-white: #FFFFFF;
--color-pure-black: #000000;
```

### Semantic Colors
```css
/* Success - Modern Green */
--color-success: #059669;           /* bg-emerald-600 */
--color-success-light: #10B981;     /* bg-emerald-500 */
--color-success-bg: #ECFDF5;        /* bg-emerald-50 */

/* Warning - Amber */
--color-warning: #D97706;           /* bg-amber-600 */
--color-warning-light: #F59E0B;     /* bg-amber-500 */
--color-warning-bg: #FFFBEB;        /* bg-amber-50 */

/* Error - Modern Red */
--color-error: #DC2626;             /* bg-red-600 */
--color-error-light: #EF4444;       /* bg-red-500 */
--color-error-bg: #FEF2F2;          /* bg-red-50 */
```

---

## Typography

### Font Families
```css
/* Primary - Ultra-modern geometric sans-serif */
--font-primary: 'Inter Tight', sans-serif;

/* Secondary - Clean, minimal sans-serif for body */
--font-secondary: 'Inter', sans-serif;

/* Monospace - Technical precision for data/specs */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Typography Scale
```css
/* Display - Hero headlines */
--text-display: 4.5rem;             /* text-7xl, leading-none */
--text-display-mobile: 3rem;        /* text-5xl */

/* Headlines */
--text-h1: 3.5rem;                  /* text-6xl, leading-tight */
--text-h1-mobile: 2.25rem;          /* text-4xl */

--text-h2: 2.5rem;                  /* text-4xl, leading-tight */
--text-h2-mobile: 1.875rem;         /* text-3xl */

--text-h3: 2rem;                    /* text-3xl, leading-snug */
--text-h3-mobile: 1.5rem;           /* text-2xl */

--text-h4: 1.5rem;                  /* text-2xl, leading-snug */
--text-h4-mobile: 1.25rem;          /* text-xl */

/* Body Text */
--text-lg: 1.125rem;                /* text-lg, leading-relaxed */
--text-base: 1rem;                  /* text-base, leading-relaxed */
--text-sm: 0.875rem;                /* text-sm, leading-normal */
--text-xs: 0.75rem;                 /* text-xs, leading-normal */
```

### Font Weights
```css
--font-thin: 100;
--font-extralight: 200;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

---

## Spacing System

### Base Spacing Scale
```css
--space-0: 0;           /* 0px */
--space-px: 1px;        /* 1px */
--space-0-5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1-5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-2-5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-3-5: 0.875rem;  /* 14px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-7: 1.75rem;     /* 28px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-32: 8rem;       /* 128px */
--space-40: 10rem;      /* 160px */
```

### Section Spacing
```css
/* Large sections - More generous spacing */
--section-padding-y: 6rem;          /* py-24 */
--section-padding-y-mobile: 4rem;   /* py-16 */

/* Medium sections */
--section-padding-md: 4rem;         /* py-16 */
--section-padding-md-mobile: 3rem;  /* py-12 */

/* Small sections */
--section-padding-sm: 3rem;         /* py-12 */
--section-padding-sm-mobile: 2rem;  /* py-8 */
```

---

## Layout System

### Container Widths
```css
--container-sm: 640px;      /* max-w-sm */
--container-md: 768px;      /* max-w-md */
--container-lg: 1024px;     /* max-w-lg */
--container-xl: 1280px;     /* max-w-xl */
--container-2xl: 1536px;    /* max-w-2xl */
--container-full: 1440px;   /* Custom max width for modern screens */
```

### Grid System
```css
/* Precise grid layouts */
.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
.grid-5 { grid-template-columns: repeat(5, 1fr); }
.grid-6 { grid-template-columns: repeat(6, 1fr); }

/* Asymmetric layouts for modern feel */
.grid-featured { 
  grid-template-columns: 2fr 1fr 1fr;
}

.grid-hero-split {
  grid-template-columns: 1.2fr 0.8fr;
}
```

### Breakpoints
```css
/* Modern responsive approach */
--breakpoint-xs: 475px;     /* xs: for small phones */
--breakpoint-sm: 640px;     /* sm: */
--breakpoint-md: 768px;     /* md: */
--breakpoint-lg: 1024px;    /* lg: */
--breakpoint-xl: 1280px;    /* xl: */
--breakpoint-2xl: 1536px;   /* 2xl: */
```

---

## Component Specifications

### 1. Header Component
```typescript
interface HeaderProps {
  logo: string;
  menuItems: Array<{
    label: string;
    href: string;
    isActive?: boolean;
  }>;
}
```

**Styling:**
- Background: `bg-white/95 backdrop-blur-md border-b border-slate-200/50`
- Height: `h-14 lg:h-16`
- Logo: `h-6 w-auto lg:h-8 font-black text-slate-900`
- Menu items: `text-slate-600 hover:text-blue-800 font-medium tracking-tight`
- Mobile: Minimal slide-down menu with blur backdrop

### 2. Hero Section
```typescript
interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  backgroundImage: string;
  overlay?: boolean;
}
```

**Styling:**
- Height: `min-h-screen`
- Background: `bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50`
- Title: `text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter`
- Subtitle: `text-lg lg:text-xl text-slate-600 font-light tracking-wide`
- CTA Button: Primary button with enhanced modern styling

### 3. Plant Collection Grid
```typescript
interface PlantGridProps {
  plants: Array<{
    id: string;
    title: string;
    image: string;
    price?: string;
    rarity?: 'common' | 'rare' | 'ultra-rare';
  }>;
  columns?: 2 | 3 | 4 | 5;
}
```

**Styling:**
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6`
- Card: `bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-slate-100 transition-all duration-300`
- Image: `aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-500`
- Title: `text-base font-semibold text-slate-900 p-4 tracking-tight`

### 4. Plant Experts Section
```typescript
interface ExpertProps {
  experts: Array<{
    id: string;
    name: string;
    title: string;
    quote: string;
    image: string;
    credentials?: string;
  }>;
}
```

**Styling:**
- Layout: `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16`
- Card: `bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-8 lg:p-12 border border-slate-100`
- Quote: `text-xl lg:text-2xl text-slate-700 font-light leading-relaxed`
- Name: `text-lg font-bold text-blue-800 tracking-tight`

### 5. Customer Reviews
```typescript
interface ReviewProps {
  reviews: Array<{
    id: string;
    customerName: string;
    customerPhoto: string;
    rating: number;
    review: string;
    plantPurchased?: string;
  }>;
}
```

**Styling:**
- Layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`
- Card: `bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100`
- Photo: `w-10 h-10 rounded-full object-cover ring-2 ring-slate-100`
- Rating: Star icons in `text-cyan-400`
- Text: `text-slate-600 leading-relaxed font-light`

### 6. Plants Carousel
```typescript
interface CarouselProps {
  plants: PlantGridProps['plants'];
  autoPlay?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
}
```

**Styling:**
- Container: `relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-50 to-blue-50`
- Slide: `min-w-full md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/4 px-3`
- Navigation: `absolute inset-y-0 flex items-center z-10`
- Dots: `absolute bottom-6 left-1/2 transform -translate-x-1/2`

### 7. Call-to-Action Section
```typescript
interface CTAProps {
  title: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  backgroundType?: 'solid' | 'gradient' | 'image';
}
```

**Styling:**
- Background: `bg-gradient-to-r from-blue-800 via-indigo-800 to-slate-800`
- Padding: `py-20 lg:py-32`
- Title: `text-4xl lg:text-6xl font-black text-white text-center tracking-tighter`
- Description: `text-lg lg:text-xl text-blue-100 text-center max-w-3xl mx-auto font-light`

### 8. Footer
```typescript
interface FooterProps {
  logo: string;
  description: string;
  socialLinks: Array<{
    platform: string;
    href: string;
    icon: string;
  }>;
  legalLinks: Array<{
    label: string;
    href: string;
  }>;
  newsletter?: {
    placeholder: string;
    ctaText: string;
  };
}
```

**Styling:**
- Background: `bg-slate-900 text-slate-300`
- Padding: `py-16 lg:py-24`
- Layout: `grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12`
- Social icons: `w-5 h-5 text-slate-400 hover:text-cyan-400 transition-colors`

---

## Button Components

### Primary Button
```css
.btn-primary {
  @apply bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold 
         hover:bg-blue-700 active:bg-blue-900 
         focus:ring-4 focus:ring-blue-300 
         transition-all duration-300 
         text-base lg:text-lg tracking-tight
         shadow-lg hover:shadow-xl;
}
```

### Secondary Button
```css
.btn-secondary {
  @apply bg-transparent text-blue-800 px-8 py-4 rounded-xl font-semibold 
         border-2 border-blue-800 
         hover:bg-blue-800 hover:text-white 
         focus:ring-4 focus:ring-blue-300 
         transition-all duration-300 
         text-base lg:text-lg tracking-tight;
}
```

### Ghost Button
```css
.btn-ghost {
  @apply bg-transparent text-slate-600 px-6 py-3 rounded-xl font-medium 
         hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 
         focus:ring-4 focus:ring-slate-200 
         transition-all duration-300 tracking-tight;
}
```

### Accent Button
```css
.btn-accent {
  @apply bg-cyan-500 text-white px-8 py-4 rounded-xl font-semibold 
         hover:bg-cyan-400 active:bg-cyan-600 
         focus:ring-4 focus:ring-cyan-300 
         transition-all duration-300 
         text-base lg:text-lg tracking-tight
         shadow-lg hover:shadow-xl;
}
```

---

## Form Components

### Input Field
```css
.form-input {
  @apply w-full px-4 py-3 border border-slate-200 rounded-xl 
         text-slate-900 placeholder-slate-400 
         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
         transition-all duration-300 
         text-base bg-white font-light
         shadow-sm focus:shadow-md;
}

.form-input:invalid {
  @apply border-red-300 focus:border-red-500 focus:ring-red-200;
}
```

### Label
```css
.form-label {
  @apply block text-sm font-medium text-slate-700 mb-3 tracking-wide;
}
```

### Error Message
```css
.form-error {
  @apply text-sm text-red-600 mt-2 font-light;
}
```

---

## Card Components

### Basic Card
```css
.card {
  @apply bg-white rounded-2xl shadow-sm overflow-hidden 
         hover:shadow-lg transition-all duration-300
         border border-slate-100;
}

.card-header {
  @apply p-6 lg:p-8 pb-4;
}

.card-body {
  @apply p-6 lg:p-8 pt-0;
}

.card-footer {
  @apply p-6 lg:p-8 pt-4 border-t border-slate-100;
}
```

### Plant Card
```css
.plant-card {
  @apply bg-white rounded-2xl shadow-sm overflow-hidden 
         hover:shadow-xl hover:scale-[1.02] 
         transition-all duration-500 cursor-pointer
         border border-slate-100;
}

.plant-card-image {
  @apply aspect-square w-full object-cover 
         grayscale hover:grayscale-0 
         transition-all duration-500;
}

.plant-card-content {
  @apply p-4 lg:p-6;
}

.plant-card-title {
  @apply text-base lg:text-lg font-semibold text-slate-900 mb-2 tracking-tight;
}

.plant-card-price {
  @apply text-blue-600 font-bold text-lg font-mono;
}
```

### Feature Card
```css
.feature-card {
  @apply bg-gradient-to-br from-slate-50 to-blue-50/50 
         rounded-3xl p-6 lg:p-8 
         border border-slate-100
         hover:shadow-lg transition-all duration-300;
}
```

---

## Accessibility Guidelines

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum contrast ratio)
- Interactive elements meet AAA standards (7:1 contrast ratio)
- High contrast mode support with increased contrast ratios
- Color is never the only way to convey information

### Typography
- Minimum font size: 16px (1rem) for body text
- Line height: 1.6 minimum for body text (improved from 1.5)
- Maximum line length: 65 characters for optimal readability
- Letter spacing optimized for screen reading

### Interactive Elements
- All interactive elements have focus states with clear visual indicators
- Touch targets minimum 44px × 44px
- Keyboard navigation support for all functionality
- Focus indicators use high-contrast outline styles

### Images
- All images have descriptive alt text
- Decorative images use empty alt attributes
- Complex images have detailed descriptions
- Reduced motion support for animations

---

## Animation Guidelines

### Micro-interactions
```css
/* Subtle, smooth animations */
.animate-fade-in {
  @apply transition-opacity duration-700 ease-out;
}

.animate-slide-up {
  @apply transition-transform duration-500 ease-out;
}

.animate-scale {
  @apply transition-transform duration-300 ease-out 
         hover:scale-[1.02] active:scale-[0.98];
}

.animate-blur {
  @apply transition-all duration-500 ease-out
         hover:backdrop-blur-md;
}
```

### Modern Loading States
```css
.loading-skeleton {
  @apply bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 
         bg-[length:200%_100%] animate-pulse;
}

.loading-shimmer {
  @apply bg-gradient-to-r from-transparent via-white/60 to-transparent
         animate-pulse;
}
```

---

## Implementation Notes

### TypeScript Interfaces
```typescript
// Enhanced color system
interface ModernColorPalette {
  primary: {
    50: string;
    100: string;
    // ... through 950
  };
  neutral: {
    50: string;
    100: string;
    // ... through 950
  };
  accent: {
    cyan: string;
    blue: string;
    indigo: string;
  };
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// Modern typography system
interface ModernTypographyScale {
  fontFamily: {
    primary: string;    // Inter Tight
    secondary: string;  // Inter
    mono: string;      // JetBrains Mono
  };
  fontSize: {
    display: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    lg: string;
    base: string;
    sm: string;
    xs: string;
  };
  fontWeight: {
    thin: number;
    extralight: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  tracking: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

// Enhanced component props
interface ModernComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  intent?: 'default' | 'success' | 'warning' | 'error';
}
```

### CSS Custom Properties Setup
```css
:root {
  /* Color Palette */
  --color-primary: #1E3A8A;
  --color-primary-light: #3B82F6;
  --color-primary-dark: #1E1B4B;
  
  --color-secondary: #475569;
  --color-secondary-light: #64748B;
  --color-secondary-dark: #334155;
  
  --color-accent: #06B6D4;
  --color-accent-light: #22D3EE;
  --color-accent-dark: #0891B2;
  
  /* Typography */
  --font-primary: 'Inter Tight', sans-serif;
  --font-secondary: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-unit: 0.25rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* Border radius */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;
  --radius-3xl: 3rem;
}
```

---

## Usage Guidelines

### Do's
- Embrace generous white space for clean, modern feel
- Use high-contrast photography with selective color
- Apply consistent geometric shapes and clean lines
- Leverage typography hierarchy for visual clarity
- Implement subtle animations for enhanced UX
- Maintain the 80/20 imagery to text ratio

### Don'ts
- Don't use warm, organic shapes or textures
- Don't compromise on the clean, minimal aesthetic
- Don't use busy patterns or decorative elements
- Don't neglect proper spacing and alignment
- Don't use overly saturated colors outside the accent palette
- Don't implement complex or distracting animations

### Modern Plant Photography Guidelines
- Use clean, minimalist backgrounds (white/light gray)
- Apply selective color processing (plants in color, background desaturated)
- Maintain consistent lighting and shadows
- Focus on geometric compositions and clean lines
- Use high-resolution, crisp imagery
- Consider black and white treatments with color accents

### Performance Considerations
- Optimize images for modern screen densities
- Use WebP format with AVIF fallbacks
- Implement progressive image loading
- Leverage CSS containment for better performance
- Use transform-based animations over layout changes
- Consider reducing motion for accessibility

---

## File Structure Recommendation

```
/modern-design-system
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   └── animation.ts
├── components/
│   ├── buttons/
│   │   ├── Button.tsx
│   │   ├── ButtonGroup.tsx
│   │   └── IconButton.tsx
│   ├── cards/
│   │   ├── Card.tsx
│   │   ├── PlantCard.tsx
│   │   └── FeatureCard.tsx
│   ├── forms/
│   │   ├── Input.tsx
│   │   ├── Label.tsx
│   │   └── FormField.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Hero.tsx
│       ├── Grid.tsx
│       └── Footer.tsx
├── styles/
│   ├── globals.css
│   ├── components.css
│   ├── utilities.css
│   └── animations.css
├── hooks/
│   ├── useTheme.ts
│   ├── useMediaQuery.ts
│   └── useReducedMotion.ts
└── docs/
    ├── color-system.md
    ├── typography-guide.md
    ├── component-library.md
    └── accessibility.md
```

This modern minimalist design system transforms the plant store into a sophisticated, contemporary platform that appeals to tech-savvy plant collectors who value precision, quality, and modern aesthetics. The cool blue and gray palette creates a calming, professional atmosphere while maintaining the premium positioning and accessibility standards required for the target demographic.