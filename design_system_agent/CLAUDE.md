# Design System Agent - Modern Product Landing Page Clone

## Project Overview
Modern responsive landing page clone built with focus on pixel-perfect design implementation.

## Tech Stack
- **Framework**: Next.js 15.4.6 with React 19.1.0
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: TypeScript 5
- **Development**: Turbopack for fast development
- **Linting**: ESLint with Next.js config
- **Deployment**: Optimized for production builds

## Project Structure
```
design_system_agent/
├── zamesin/                 # Main Next.js application
│   ├── src/app/            # App Router pages and layouts
│   ├── public/             # Static assets
│   └── package.json        # Dependencies and scripts
├── context/                # Design documentation
│   ├── design-principles.md
│   └── style-guide.md
└── CLAUDE.md              # Project instructions
```

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Pixel-Perfect Cloning Process

### Required Information for Accurate Implementation
1. **Developer Tools Data** (Critical for precision):
   - Computed CSS values from browser inspector
   - Exact font properties: `font-family`, `font-size`, `font-weight`, `line-height`
   - Spacing: `margin`, `padding` values for all sides
   - Colors: `color`, `background-color` (hex/rgb values)
   - Effects: `box-shadow`, `border-radius`, `opacity`
   - Dimensions: `width`, `height`, `max-width`, `min-height`

2. **Multi-Viewport Screenshots**:
   - Desktop (1440px width)
   - Tablet (768px width)  
   - Mobile (375px width)

3. **Interactive States**:
   - Hover effects on interactive elements
   - Active/focus states for accessibility
   - Transition animations and timing

4. **Source Access** (Preferred):
   - Live URL for direct CSS extraction via Playwright
   - Automatic measurement and style capture

### Implementation Workflow
1. **Specification Phase**: Extract and document exact measurements
2. **Component-by-Component Build**: Implement one section at a time
3. **Visual Validation**: Screenshot comparison after each component
4. **Iterative Refinement**: Adjust until pixel-perfect match
5. **Design Review**: Comprehensive testing via design-review agent

## Visual Development

### Design Principles
- Comprehensive design checklist in `/context/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** — Review the modified components/pages
2. **Navigate to affected pages** — Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** — Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** — Ensure the change fulfills the user’s specific request
5. **Check acceptance criteria** — Review any provided context files or requirements
6. **Capture evidence** — Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** — Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing

- do not start dev server, it is always running on http://localhost:3000/