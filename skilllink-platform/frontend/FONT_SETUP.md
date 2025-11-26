# Aeonik Font Setup Guide

## Current Setup
The project is configured to use the **Aeonik** font for the SkillLink brand name, with **Inter** as a fallback from Google Fonts.

## Using the Actual Aeonik Font

If you have access to the Aeonik font files, follow these steps:

### 1. Add Font Files
Create a `public/fonts` directory and add your Aeonik font files:

```
skilllink-platform/frontend/public/fonts/
├── Aeonik-Regular.woff2
├── Aeonik-Medium.woff2
├── Aeonik-Bold.woff2
└── Aeonik-Black.woff2
```

### 2. Update index.css
Uncomment and update the `@font-face` declarations in `src/index.css`:

```css
@font-face {
  font-family: 'Aeonik';
  src: url('/fonts/Aeonik-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Aeonik';
  src: url('/fonts/Aeonik-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Aeonik';
  src: url('/fonts/Aeonik-Bold.woff2') format('woff2