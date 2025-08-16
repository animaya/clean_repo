# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Next.js UI Application (my_ui/)
- **Development server**: `npm run dev` (runs with Turbopack for fast builds)
- **Production build**: `npm run build`
- **Start production server**: `npm start`
- **Linting**: `npm run lint`

All commands should be run from the `my_ui/` directory.

## Architecture Overview

This is a multi-project repository with the following structure:

### Core Projects
- **my_ui/**: Next.js 15 application implementing a Green Plants Store landing page
- **design_system.md**: Comprehensive design system specification for the plant store

### UI Application Architecture (my_ui/)
- **Framework**: Next.js 15 with App Router architecture
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Typography**: Google Fonts (Geist Sans/Mono) + design system fonts (Playfair Display, Inter, Crimson Text)
- **Components**: Single-page application with section-based layout
- **State Management**: No external state management (static landing page)

## Design System Implementation

The application implements a comprehensive design system defined in `design_system.md`:

### Color Palette
- Primary: Emerald/Forest green shades (#2F5233, #4ADE80)
- Secondary: Lime green (#84CC16, #BEF264)
- Neutrals: Stone color scale
- Semantic: Success/Warning/Error colors

### Typography System
- Primary: Playfair Display (serif, headers)
- Secondary: Inter (sans-serif, body text)
- Accent: Crimson Text (quotes, special elements)
- Responsive scale from mobile to desktop

### Component Library
Pre-built CSS classes in `globals.css`:
- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- **Forms**: `.form-input`, `.form-label`, `.form-error`
- **Cards**: `.card`, `.plant-card` (with modifiers)
- **Animations**: `.animate-scale`, `.animate-fade-in`, `.animate-slide-up`

### Layout Patterns
- Mobile-first responsive design
- CSS Grid for plant collections
- Flexbox for navigation and smaller components
- Section-based page structure with consistent spacing

## Page Structure (page.tsx)

The application follows a single-page layout with these main sections:
1. **Header**: Fixed navigation with logo and menu
2. **Hero**: Full-screen intro with gradient background
3. **Collection**: Grid layout of featured plants
4. **Experts**: Two-column layout with botanist profiles
5. **Reviews**: Three-column customer testimonials
6. **Carousel**: Horizontal scrolling plant showcase
7. **CTA**: Call-to-action with contact buttons
8. **Footer**: Multi-column layout with links and social media

## Styling Approach

### CSS Architecture
- Tailwind CSS v4 with `@import "tailwindcss"`
- CSS custom properties for design tokens
- Component-specific classes for reusable elements
- Responsive utilities with mobile-first approach

### Design Tokens
All design tokens are defined as CSS custom properties in `:root`, including:
- Color palette variables
- Typography scales and font families
- Spacing system
- Container widths and breakpoints

### Image Handling
- Next.js Image component for optimization
- Unsplash URLs for placeholder images
- Responsive image sizes with aspect ratio maintenance
- Lazy loading built-in

## Development Notes

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Next.js 15.4.6
- **Styling**: Tailwind CSS v4 + @tailwindcss/postcss
- **Language**: TypeScript 5
- **Package Manager**: npm

### File Organization
- `src/app/`: App Router pages and layouts
- `src/app/globals.css`: Global styles and component classes
- `public/`: Static assets (currently using external images)

### Design Considerations
- Target audience: Plant collectors aged 35-60
- 80% imagery, 20% text ratio
- High contrast for readability
- Premium, trustworthy aesthetic
- Fully responsive design

When working on this codebase, prioritize following the established design system patterns and maintaining the premium, nature-focused aesthetic defined in the design system documentation.