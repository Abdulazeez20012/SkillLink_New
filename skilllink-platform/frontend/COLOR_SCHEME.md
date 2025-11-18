# SkillLink Color Scheme

## Brand Colors
The entire SkillLink platform uses a **White & Red** color scheme.

### Primary Colors (Red)
All `primary-*` Tailwind classes now use red shades:

- `primary-50`: #fef2f2 (Lightest red)
- `primary-100`: #fee2e2
- `primary-200`: #fecaca
- `primary-300`: #fca5a5
- `primary-400`: #f87171
- `primary-500`: #ef4444
- `primary-600`: #dc2626 (Main brand red)
- `primary-700`: #b91c1c
- `primary-800`: #991b1b
- `primary-900`: #7f1d1d (Darkest red)

### Brand Aliases
- `brand-red`: #dc2626
- `brand-white`: #ffffff

## Usage Examples

### Buttons
```tsx
<button className="btn btn-primary">Primary Button</button>
// Results in: Red background with white text

<button className="btn btn-secondary">Secondary Button</button>
// Results in: Gray background
```

### Text
```tsx
<span className="text-primary-600">Red Text</span>
<span className="text-brand-red">Red Text (Alternative)</span>
```

### Backgrounds
```tsx
<div className="bg-primary-50">Light red background</div>
<div className="bg-primary-600">Main red background</div>
```

### Badges
```tsx
<span className="badge badge-primary">Badge</span>
// Results in: Light red background with dark red text
```

## Component Styling

All existing components automatically use the red theme:
- ✅ Landing Page
- ✅ Navigation
- ✅ Buttons
- ✅ Forms
- ✅ Badges
- ✅ Links
- ✅ Loading Spinners
- ✅ Dashboard Components

## Neutral Colors
Gray shades are used for backgrounds, borders, and secondary elements:
- White backgrounds: `bg-white`
- Light gray: `bg-gray-50`, `bg-gray-100`
- Borders: `border-gray-200`, `border-gray-300`
- Text: `text-gray-600`, `text-gray-700`, `text-gray-900`

## Status Colors
- Success: Green (`bg-green-100`, `text-green-800`)
- Warning: Yellow (`bg-yellow-100`, `text-yellow-800`)
- Danger: Red (`bg-red-100`, `text-red-800`)
