# Hero Section Design Specification - Pixel Perfect Implementation Guide

## Overview
This document provides ultra-detailed specifications for recreating the hero section of the Vanya Zamesin product training landing page. Every measurement, color, and styling detail is documented for pixel-perfect implementation.

## Layout Structure

### Container Layout
- **Layout Type**: Two-column grid layout
- **Max Width**: 1200px (estimated based on content proportions)
- **Horizontal Alignment**: Center-aligned container
- **Vertical Spacing**: 80px top padding, 60px bottom padding

### Grid System
- **Left Column**: 60% width (720px at max container width)
- **Right Column**: 40% width (480px at max container width)
- **Column Gap**: 60px between columns
- **Vertical Alignment**: Top-aligned content

## Typography Specifications

### 1. Subtitle (Top Small Text)
- **Text**: "Авторский тренинг Вани Замесина по Advanced Jobs To Be Done «Как делать продукт» v.1.3"
- **Font Family**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Font Size**: 14px
- **Font Weight**: 400 (Regular)
- **Line Height**: 1.4 (19.6px)
- **Color**: #6B7280 (Gray-500)
- **Letter Spacing**: 0.25px
- **Margin Bottom**: 24px

### 2. Main Heading
- **Text**: "Научись делать продукт, который покупают"
- **Font Family**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Font Size**: 48px
- **Font Weight**: 700 (Bold)
- **Line Height**: 1.1 (52.8px)
- **Color**: #111827 (Gray-900)
- **Letter Spacing**: -0.5px
- **Margin Bottom**: 32px
- **Max Width**: 580px (for optimal line breaks)

### 3. Body Text
- **Text**: "Ближайший поток стартует 16 сентября 2025 года. Обновлённая методология и новый формат обучения. Количество мест ограничено."
- **Font Family**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Font Size**: 18px
- **Font Weight**: 400 (Regular)
- **Line Height**: 1.6 (28.8px)
- **Color**: #4B5563 (Gray-600)
- **Letter Spacing**: 0px
- **Margin Bottom**: 40px
- **Max Width**: 520px

## Color Palette

### Primary Colors
- **Background**: #FFFFFF (White)
- **Primary Text**: #111827 (Gray-900)
- **Secondary Text**: #4B5563 (Gray-600)
- **Muted Text**: #6B7280 (Gray-500)

### Button Colors
- **Background**: #000000 (Black)
- **Text**: #FFFFFF (White)
- **Hover Background**: #1F2937 (Gray-800)

### Section Backgrounds
- **Left Card Background**: #ECFEFF (Cyan-50)
- **Right Video Background**: #FEF3E2 (Orange-50)

## Interactive Elements

### Primary Button
- **Text**: "Забронировать место"
- **Width**: 240px
- **Height**: 56px
- **Background**: #000000
- **Color**: #FFFFFF
- **Font Size**: 16px
- **Font Weight**: 600 (SemiBold)
- **Border Radius**: 8px
- **Border**: none
- **Padding**: 16px 32px
- **Cursor**: pointer
- **Transition**: background-color 0.2s ease-in-out

### Button Hover State
- **Background**: #1F2937
- **Transform**: translateY(-1px)
- **Box Shadow**: 0 4px 12px rgba(0, 0, 0, 0.15)

## Bottom Content Cards

### Left Card (Light Blue Background)
- **Background**: #ECFEFF
- **Border Radius**: 12px
- **Padding**: 32px
- **Width**: 340px
- **Margin Top**: 48px

#### Card Typography
- **Heading**: "Научись важному"
  - Font Size: 24px
  - Font Weight: 700
  - Color: #111827
  - Margin Bottom: 16px
  - Font Style: italic

- **Body Text**: "Проводить продуктовые исследования [кастдевить], валидировать гипотезы ценности, идей и фич"
  - Font Size: 16px
  - Font Weight: 400
  - Line Height: 1.5
  - Color: #374151

### Right Card (Gray Background)
- **Background**: #F9FAFB
- **Border Radius**: 12px
- **Padding**: 32px
- **Width**: 340px
- **Margin Top**: 48px

#### Card Typography
- **Heading**: "Получи алгоритм"
  - Font Size: 24px
  - Font Weight: 700
  - Color: #111827
  - Margin Bottom: 16px
  - Font Style: italic

- **Body Text**: "Систематизируй знания и получи алгоритм, как решать различные продуктовые задачи"
  - Font Size: 16px
  - Font Weight: 400
  - Line Height: 1.5
  - Color: #374151

## Right Column Video Section

### Container
- **Background**: #FEF3E2 (Warm beige)
- **Border Radius**: 16px
- **Padding**: 40px
- **Position**: Relative
- **Height**: 520px (estimated)

### Video Player
- **Position**: Center of container
- **Width**: 300px
- **Height**: 200px
- **Border Radius**: 8px
- **Background**: Linear gradient overlay
- **Play Button**: Circular, 60px diameter, white background, gray play icon

### Video Tags
- **Position**: Absolute, overlaid on video
- **Styles**: Small rounded pills
  - "Без сложных IT-терминов": Top right
  - "Доступ сразу": Bottom left
  - "Видео на 65 минут": Bottom right

### Tag Styling
- **Background**: rgba(255, 255, 255, 0.9)
- **Padding**: 8px 12px
- **Border Radius**: 20px
- **Font Size**: 12px
- **Font Weight**: 500
- **Color**: #374151

### Section Header
- **Text**: "Смотри бесплатную лекцию"
- **Font Size**: 24px
- **Font Weight**: 700
- **Color**: #111827
- **Margin Bottom**: 20px
- **Font Style**: italic for "бесплатную"

### Bullet Points List
- **Text**: "Из лекции ты узнаешь:"
- **Font Size**: 16px
- **Color**: #4B5563
- **Margin Bottom**: 16px

#### List Items
- Font Size: 14px
- Line Height: 1.5
- Color: #374151
- Bullet Style: Custom bullet points
- Spacing: 8px between items

## Spacing & Measurements

### Vertical Spacing
- **Section Top Padding**: 80px
- **Section Bottom Padding**: 60px
- **Heading to Body**: 32px
- **Body to Button**: 40px
- **Main Content to Cards**: 48px

### Horizontal Spacing
- **Container Side Padding**: 24px (mobile), 40px (tablet), 80px (desktop)
- **Column Gap**: 60px
- **Card Internal Padding**: 32px

## Responsive Breakpoints

### Desktop (1024px+)
- Use specifications as documented above

### Tablet (768px - 1023px)
- Stack columns vertically
- Reduce font sizes by 10%
- Adjust padding to 32px horizontally

### Mobile (< 768px)
- Single column layout
- Heading font size: 36px
- Body font size: 16px
- Button full width
- Horizontal padding: 20px

## Implementation Notes

1. **Font Loading**: Ensure system fonts load first for optimal performance
2. **Image Optimization**: Use WebP format for video thumbnail with PNG fallback
3. **Accessibility**: Include proper alt text, focus states, and keyboard navigation
4. **Performance**: Lazy load video content, optimize images
5. **Micro-interactions**: Add subtle hover animations for enhanced UX

## CSS Custom Properties

```css
:root {
  --primary-black: #000000;
  --text-primary: #111827;
  --text-secondary: #4B5563;
  --text-muted: #6B7280;
  --bg-primary: #FFFFFF;
  --bg-accent-blue: #ECFEFF;
  --bg-accent-warm: #FEF3E2;
  --bg-neutral: #F9FAFB;
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 40px;
  --spacing-2xl: 48px;
}
```

This specification provides all necessary details for pixel-perfect implementation of the hero section.