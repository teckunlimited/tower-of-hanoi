# Styling Guide

This project uses **100% inline styles** (CSS-in-JS) with no CSS frameworks or external stylesheets (except minimal global styles).

## Why Inline Styles?

1. **Zero CSS conflicts**: No specificity wars or cascade issues
2. **Type safety**: TypeScript validates all style properties
3. **Co-location**: Styles live with components
4. **No build overhead**: No CSS processing or bundle splitting
5. **Predictable**: What you write is exactly what renders

## Color Palette

### Primary Colors
```typescript
const COLORS = {
  // Cyber theme
  cyan: '#00f2ff',           // Primary accent
  charcoalDark: '#1a1a1a',   // Darkest background
  charcoalMid: '#2a2a2a',    // Mid-tone background
  charcoalLight: '#3a3a3a',  // Lightest charcoal
  
  // UI states
  success: '#22c55e',        // Green for success/healthy
  error: '#ef4444',          // Red for errors/down
  neutral: '#9ca3af',        // Gray for loading/neutral
  
  // Text
  textPrimary: '#ffffff',    // White text
  textSecondary: '#d1d5db',  // Light gray text
};
```

### Disk Gradient (17 colors)
```typescript
const DISK_COLORS = [
  '#00f2ff', // Cyan
  '#00d4ff',
  '#00b8ff',
  '#009cff',
  '#0080ff', // Blue
  '#0066ff',
  '#0050ff',
  '#3d00ff', // Violet
  '#5500ff',
  '#6b00ff',
  '#8000ff',
  '#9500ff', // Purple
  '#aa00ff',
  '#bf00ff',
  '#d400ff', // Magenta
  '#e900ff',
  '#ff00ea'  // Pink-magenta
];
```

## Typography

### Font Sizes
```typescript
const FONT_SIZES = {
  heading: '2.25rem',      // 36px - main title
  subheading: '1.5rem',    // 24px - section headers
  label: '0.75rem',        // 12px - input labels, small headers
  body: '0.875rem',        // 14px - body text
  button: '0.625rem',      // 10px - compact buttons
  rodLabel: '2.25rem',     // 36px - tower rod labels
};
```

### Font Weights
```typescript
const FONT_WEIGHTS = {
  normal: 'normal',
  medium: '500',
  semibold: '600',
  bold: 'bold',
};
```

## Spacing

### Padding/Margin Scale
```typescript
const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
};
```

### Layout Constraints
```typescript
const LAYOUT = {
  maxWidth: '960px',       // All sections
  headerPadding: '0.5rem', // Compact design
  borderRadius: '0.375rem', // Rounded corners
  compactGap: '0.5rem',    // Tight spacing
};
```

## Common Patterns

### Container
```tsx
<div style={{
  width: '100%',
  maxWidth: '960px',
  margin: '0 auto',
  padding: '0.5rem',
  backgroundColor: 'rgba(42, 42, 42, 0.8)',
  borderRadius: '0.375rem',
  backdropFilter: 'blur(10px)'
}}>
```

### Header Section
```tsx
<div style={{
  padding: '0.375rem 0.5rem',
  background: 'linear-gradient(to right, rgba(0, 242, 255, 0.1), rgba(0, 242, 255, 0.05))',
  borderBottom: '1px solid rgba(0, 242, 255, 0.2)',
  marginBottom: '0.5rem',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#00f2ff',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}}>
  Section Title
</div>
```

### Button (Primary)
```tsx
<button
  style={{
    padding: '0.5rem 0.75rem',
    fontSize: '0.625rem',
    fontWeight: '600',
    backgroundColor: '#00f2ff',
    color: '#000000',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#00d4ff';
    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 242, 255, 0.4)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#00f2ff';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
  Click Me
</button>
```

### Button (Secondary)
```tsx
<button
  style={{
    padding: '0.5rem 0.75rem',
    fontSize: '0.625rem',
    fontWeight: '500',
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    color: '#ffffff',
    border: '1px solid rgba(0, 242, 255, 0.3)',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }}
>
  Secondary
</button>
```

### Input Field
```tsx
<input
  type="number"
  style={{
    width: '100%',
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'rgba(42, 42, 42, 0.6)',
    color: '#ffffff',
    border: '1px solid rgba(0, 242, 255, 0.3)',
    borderRadius: '0.375rem',
    outline: 'none'
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = '#00f2ff';
    e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 242, 255, 0.3)';
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = 'rgba(0, 242, 255, 0.3)';
    e.currentTarget.style.boxShadow = 'none';
  }}
/>
```

### Glow Effect
```tsx
<div style={{
  color: '#00f2ff',
  filter: 'drop-shadow(0 0 10px rgba(0, 242, 255, 0.5))',
  textShadow: '0 0 10px rgba(0, 242, 255, 0.3)'
}}>
  Glowing Text
</div>
```

### Gradient Background
```tsx
<div style={{
  background: 'linear-gradient(180deg, #1a1a1a 0%, #3a3a3a 100%)',
  border: '2px solid rgba(0, 242, 255, 0.3)',
  boxShadow: '0 0 20px rgba(0, 242, 255, 0.1)'
}}>
```

## Animation Patterns

### Hover States
Use `onMouseEnter` and `onMouseLeave` for hover effects:

```tsx
const [isHovered, setIsHovered] = useState(false);

<div
  style={{
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.2s ease'
  }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
```

### With Framer Motion
For complex animations, use Framer Motion:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
  style={{
    // ... inline styles
  }}
/>
```

## Responsive Design

### Mobile-First Approach
```tsx
const isMobile = window.innerWidth < 768;

<div style={{
  padding: isMobile ? '0.5rem' : '1rem',
  fontSize: isMobile ? '0.75rem' : '0.875rem',
  flexDirection: isMobile ? 'column' : 'row'
}}>
```

### Container Queries (future)
Currently using fixed 960px max-width. Could be enhanced with:
```tsx
<div style={{
  width: '100%',
  maxWidth: '960px',
  padding: 'clamp(0.5rem, 2vw, 2rem)'
}}>
```

## Best Practices

### 1. **Extract Common Styles**
```tsx
const buttonBaseStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  fontSize: '0.625rem',
  fontWeight: '600',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s'
};
```

### 2. **Use Type Safety**
```tsx
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};
```

### 3. **Conditional Styles**
```tsx
<div style={{
  ...baseStyle,
  backgroundColor: isActive ? '#00f2ff' : '#2a2a2a',
  color: isActive ? '#000000' : '#ffffff'
}}>
```

### 4. **Dynamic Styles**
```tsx
const getDiskColor = (size: number) => DISK_COLORS[(size - 1) % 17];

<div style={{
  backgroundColor: getDiskColor(diskSize),
  width: `${diskSize * 30}px`
}}>
```

### 5. **Avoid Inline Functions**
❌ Bad:
```tsx
<div style={{ backgroundColor: isActive ? '#00f2ff' : '#2a2a2a' }}>
```

✅ Good:
```tsx
const style = useMemo(() => ({
  backgroundColor: isActive ? '#00f2ff' : '#2a2a2a'
}), [isActive]);

<div style={style}>
```

## Migration from Tailwind

If converting from Tailwind:

```tsx
// Before (Tailwind)
<div className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg">

// After (Inline)
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '1rem',
  backgroundColor: '#2a2a2a',
  borderRadius: '0.5rem'
}}>
```

## Performance Considerations

1. **Memoize complex style objects**:
   ```tsx
   const complexStyle = useMemo(() => ({
     // ... many properties
   }), [dependencies]);
   ```

2. **Extract static styles outside component**:
   ```tsx
   const STATIC_STYLE = { /* ... */ };
   
   function Component() {
     return <div style={STATIC_STYLE}>;
   }
   ```

3. **Use CSS variables for theme changes** (if needed):
   ```tsx
   <div style={{
     backgroundColor: 'var(--bg-primary, #1a1a1a)'
   }}>
   ```

## Tools

### TypeScript Support
All styles get full TypeScript validation:
- Autocomplete for CSS properties
- Type checking for values
- Intellisense for units

### VS Code Extensions
- **CSS Peek**: Jump to style definitions
- **Color Highlight**: Preview colors inline
- **IntelliSense for CSS**: Autocomplete

## Debugging

### Inspect Element
Inline styles appear directly in DevTools:
```html
<div style="display: flex; gap: 0.5rem; ...">
```

### Style Conflicts
No conflicts possible - inline styles have highest specificity.

### Performance
Use React DevTools Profiler to check re-renders caused by style changes.

## Summary

- ✅ Use inline style objects
- ✅ Extract common patterns
- ✅ Leverage TypeScript
- ✅ Use Framer Motion for complex animations
- ✅ Memoize dynamic styles
- ❌ No external CSS files
- ❌ No CSS frameworks
- ❌ No className props
