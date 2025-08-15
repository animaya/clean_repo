# Visual Style Guidelines

## Brand Colors

### Primary Colors
<!-- CUSTOMIZE: Add your brand's primary color palette -->
- **Primary:** [Hex code] - [Color name/description]
- **Secondary:** [Hex code] - [Color name/description]
- **Accent:** [Hex code] - [Color name/description]

### Supporting Colors
- **Neutral 1:** [Hex code] - [Usage description]
- **Neutral 2:** [Hex code] - [Usage description]
- **Background:** [Hex code] - [Usage description]

### Color Usage Guidelines
- **Primary:** Use for headlines, CTAs, brand elements
- **Secondary:** Use for subheadings, highlights
- **Accent:** Use sparingly for emphasis
- **Neutrals:** Use for body text, backgrounds

## Typography

### Font Families
<!-- CUSTOMIZE: Define your typography hierarchy -->
**Primary Font:** [Font name]
- Usage: Headlines, titles, important text
- Fallback: [Fallback font]

**Secondary Font:** [Font name]
- Usage: Body text, descriptions
- Fallback: [Fallback font]

**Accent Font:** [Font name] (if applicable)
- Usage: Special emphasis, quotes
- Fallback: [Fallback font]

### Font Sizing Guidelines
- **Large Headlines:** [Size/style guidance]
- **Medium Headlines:** [Size/style guidance]
- **Body Text:** [Size/style guidance]
- **Caption Text:** [Size/style guidance]

## Logo Usage

### Logo Variations
<!-- CUSTOMIZE: Describe your logo variations -->
- **Primary Logo:** [Description and usage]
- **Secondary/Icon:** [Description and usage]
- **Monochrome:** [Description and usage]

### Logo Guidelines
- **Minimum Size:** [Specifications]
- **Clear Space:** [Spacing requirements]
- **Backgrounds:** [Acceptable background colors/types]
- **Don'ts:** [What not to do with logo]

## Image Style Guidelines

### Photography Style
<!-- CUSTOMIZE: Define your visual content style -->
- **Mood:** [Professional/Casual/Bright/Modern/etc.]
- **Color Tone:** [Warm/Cool/Vibrant/Muted/etc.]
- **Composition:** [Clean/Busy/Minimal/Dynamic/etc.]
- **Subject Matter:** [People/Products/Lifestyle/Abstract/etc.]

### Image Types to Use
- [Type 1: Description of when to use]
- [Type 2: Description of when to use]
- [Type 3: Description of when to use]

### Image Types to Avoid
- [Type to avoid: Reason]
- [Type to avoid: Reason]

## Platform-Specific Visual Guidelines

### LinkedIn
<!-- CUSTOMIZE: Platform-specific visual requirements -->
- **Image Dimensions:** [Recommended sizes]
- **Style Notes:** [Professional, clean, etc.]
- **Brand Elements:** [Logo placement, etc.]

### Instagram
- **Image Dimensions:** [Recommended sizes]
- **Style Notes:** [Visual style preferences]
- **Brand Elements:** [Consistent visual elements]

### Twitter/X
- **Image Dimensions:** [Recommended sizes]
- **Style Notes:** [Style preferences]
- **Brand Elements:** [Branding approach]

### Facebook
- **Image Dimensions:** [Recommended sizes]
- **Style Notes:** [Style preferences]
- **Brand Elements:** [Branding approach]

### TikTok
- **Video Style:** [Style preferences]
- **Branding:** [How to include branding]
- **Visual Elements:** [Consistent elements]

## Graphic Design Elements

### Icons & Illustrations
<!-- CUSTOMIZE: Define your design element style -->
- **Style:** [Line/Filled/Gradient/Flat/etc.]
- **Usage:** [When to use different types]
- **Color Application:** [How to apply brand colors]

### Patterns & Textures
- **Acceptable Patterns:** [Description]
- **Usage Guidelines:** [When and how to use]

## Content Creation Guidelines

### Template Layouts
<!-- CUSTOMIZE: Define your content layout preferences -->
- **Quote Posts:** [Layout style preferences]
- **Tip Posts:** [Layout style preferences]
- **Announcement Posts:** [Layout style preferences]
- **Educational Posts:** [Layout style preferences]

### Text Overlay Guidelines
- **Font Choices:** [Preferred fonts for overlays]
- **Text Placement:** [Where to place text]
- **Contrast Requirements:** [Readability guidelines]
- **Brand Element Placement:** [Logo/branding placement]

## Tools & Resources

### Recommended Tools
<!-- CUSTOMIZE: List your preferred design tools -->
- **Design:** [Tool name] - [Usage notes]
- **Photo Editing:** [Tool name] - [Usage notes]
- **Templates:** [Tool name] - [Usage notes]

### Brand Asset Locations
- **Logo Files:** [Location/link to brand assets]
- **Color Swatches:** [Location of color files]
- **Font Files:** [Location of typography assets]
- **Template Files:** [Location of design templates]

## Visual Prompt Examples

### Professional/Business Content Visual Prompts
<!-- CUSTOMIZE: Add examples based on your successful visual content -->
**Example JSON Structure for Business Content:**
```json
{
  "task": "text-to-image",
  "safety": "adult (18+), SFW",
  "style": "professional cinematic realism",
  "aspect_ratio": "1.91:1",
  "description": "Professional business person in modern office environment, confident expression, working with laptop and digital tools, clean contemporary workspace with natural lighting",
  "camera": {
    "framing": "medium shot (waist up)",
    "angle": "eye-level, slight angle",
    "distance": "1.5 meters",
    "lens_look": "50mm equivalent, minimal distortion",
    "depth_of_field": "shallow focus on subject, soft background"
  },
  "lighting": {
    "setup": "natural office lighting with window light",
    "key": "soft window light from side",
    "fill": "ambient office lighting",
    "rim": "subtle edge light",
    "white_balance": "neutral daylight (5600K)"
  },
  "color_grading": {
    "look": "clean, professional tones",
    "skin": "natural, professional appearance"
  },
  "visual_rules": [
    "professional business attire",
    "modern, clean workspace",
    "confident, competent expression",
    "brand colors subtly incorporated in environment"
  ],
  "negative_prompt": [
    "casual or inappropriate attire",
    "cluttered or unprofessional background",
    "overly posed or artificial expressions"
  ],
  "output": {
    "resolution": "high"
  }
}
```

### Educational/Tutorial Content Visual Prompts
**Example JSON Structure for Educational Content:**
```json
{
  "task": "text-to-image",
  "safety": "adult (18+), SFW", 
  "style": "clean educational realism",
  "aspect_ratio": "1:1",
  "description": "Person in teaching position, explaining concept with visual aids, organized learning environment, approachable and knowledgeable expression",
  "camera": {
    "framing": "medium to wide shot showing context",
    "angle": "slightly elevated for clarity",
    "distance": "2 meters",
    "lens_look": "35mm equivalent for context",
    "depth_of_field": "balanced focus on subject and materials"
  },
  "lighting": {
    "setup": "bright, even lighting for clarity",
    "key": "diffused overhead lighting",
    "fill": "balanced ambient light",
    "white_balance": "neutral daylight (5600K)"
  },
  "color_grading": {
    "look": "bright, clear, educational tone",
    "skin": "natural, approachable"
  },
  "visual_rules": [
    "clear visibility of educational materials",
    "organized, uncluttered composition",
    "teaching gestures and materials visible",
    "brand elements subtly integrated"
  ],
  "negative_prompt": [
    "cluttered or distracting background",
    "unclear or hidden educational elements",
    "overly formal or intimidating presentation"
  ],
  "output": {
    "resolution": "high"
  }
}
```

### Brand Visual Style Integration
<!-- CUSTOMIZE: Examples showing how your brand colors and style appear in visual prompts -->
**Brand Color Integration Examples:**
- Primary brand color: Include in clothing, accessories, or environmental elements
- Secondary colors: Use for background accents, props, or supporting visual elements  
- Brand fonts: Reference in any text overlay or signage within the image
- Brand personality: Reflect through lighting mood, composition style, and subject demeanor

**Visual Consistency Rules:**
- All generated images should feel like they belong to the same brand family
- Color palette should subtly reference brand colors without being overpowering
- Visual tone should match brand personality (professional, casual, innovative, etc.)
- Environmental settings should align with brand positioning and audience

## Usage Notes
- Creative agents use these guidelines for visual consistency
- Platform agents reference platform-specific sections
- Visual Prompt Agent uses these examples as templates for content-specific generation
- Update this file when brand guidelines change
- Include examples of successful visual content in `successful-templates.md`