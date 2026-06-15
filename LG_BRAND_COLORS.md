# LG Official Brand Colors

Reference image: `src/imports/image.png`

## Color Palette

### Primary Colors

#### LG Deep Purple
- **Pantone**: Pantone Plus 259C
- **RGB**: R112, G32, B118
- **Hex**: `#702076`
- **CSS Variable**: `--lg-deep-purple`
- **Tailwind Class**: `bg-lg-deep-purple`, `text-lg-deep-purple`
- **Usage**: Primary accent, headers, buttons

#### LG Purple (Magenta)
- **Pantone**: Pantone Plus 233C
- **RGB**: R204, G0, B122
- **Hex**: `#CC007A`
- **CSS Variable**: `--lg-purple`
- **Tailwind Class**: `bg-lg-purple`, `text-lg-purple`
- **Usage**: Secondary accent, highlights

#### LG Bright Purple (Pink)
- **Pantone**: Pantone Plus 189C
- **RGB**: R253, G163, B186
- **Hex**: `#FDA3BA`
- **CSS Variable**: `--lg-bright-purple`
- **Tailwind Class**: `bg-lg-bright-purple`, `text-lg-bright-purple`
- **Usage**: Light accents, backgrounds

### Secondary Colors

#### LG Yellow (Orange)
- **Pantone**: Pantone 144C
- **RGB**: R243, G138, B0
- **Hex**: `#F38A00`
- **CSS Variable**: `--lg-yellow`
- **Tailwind Class**: `bg-lg-yellow`, `text-lg-yellow`
- **Usage**: Alerts, warnings, highlights

#### LG Bright Green (Lime)
- **Pantone**: Pantone 382C
- **RGB**: R195, G213, B0
- **Hex**: `#C3D500`
- **CSS Variable**: `--lg-bright-green`
- **Tailwind Class**: `bg-lg-bright-green`, `text-lg-bright-green`
- **Usage**: Success states, positive actions

#### LG Green
- **Pantone**: Pantone 369C
- **RGB**: R98, G116, B10
- **Hex**: `#62740A`
- **CSS Variable**: `--lg-green`
- **Tailwind Class**: `bg-lg-green`, `text-lg-green`
- **Usage**: Dark green accents, success states

### Brand Red
- **Hex**: `#C8002C`
- **CSS Variable**: `--lg-red`
- **Tailwind Class**: `bg-lg-red`, `text-lg-red`
- **Usage**: Primary brand color, CTAs

### Neutral
- **Gray**: `#808080`
- **CSS Variable**: `--lg-gray`
- **Tailwind Class**: `bg-lg-gray`, `text-lg-gray`

## Usage in App

### Gradients
```css
bg-gradient-to-br from-lg-red via-lg-deep-purple to-lg-purple
bg-gradient-to-r from-lg-deep-purple to-lg-purple
```

### Buttons
- Primary: `bg-lg-red text-white`
- Secondary: `bg-lg-deep-purple text-white`
- Success: `bg-lg-bright-green text-gray-900`

### Status Colors
- Success: `text-lg-green` or `text-lg-bright-green`
- Warning/Alert: `text-lg-yellow`
- Error: `text-lg-red`
- Info: `text-lg-purple`

## Color Accessibility

- **LG Deep Purple (#702076)**: Use white text for readability
- **LG Purple (#CC007A)**: Use white text for readability
- **LG Yellow (#F38A00)**: Use black/gray-900 text for readability
- **LG Bright Green (#C3D500)**: Use black/gray-900 text for readability
- **LG Green (#62740A)**: Use white text for readability

## Brand Consistency

All colors have been updated to match the official LG Pantone color specifications. These colors are defined in:
- `src/styles/theme.css` (CSS variables)
- Available as Tailwind utility classes throughout the app

Last updated: June 8, 2026
