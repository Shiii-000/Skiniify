# Skiniify - Modern Gaming UI Design Reference 🎨

## Design Goals
- **Minimal & Clean**: Less clutter, more focus on data
- **Professional Gaming Aesthetic**: Dark mode but not too dark
- **Better Visual Hierarchy**: Clear information hierarchy
- **Smooth Animations**: Subtle, not overwhelming
- **Accessibility**: Good contrast, readable fonts

---

## Design Inspirations

### 1. Steam Community Market
**URL:** https://steamcommunity.com/market/browse  
**What we learn:**
- Clean dark backgrounds (#1b2838 primary)
- White text with subtle gray accents (#cccccc)
- Rounded corners (8px) on cards
- Green/Red color coding for prices
- Minimal borders, focus on content

### 2. Discord Server Discovery
**URL:** https://discord.com  
**What we learn:**
- Dark mode: #36393f background, #2f3136 components
- Accent colors: #5865F2 (blurple), #ed4245 (red)
- Clean typography with proper spacing
- Rounded avatars and icons

### 3. CS:GO/CS2 Store UI
**URL:** https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/  
**What we learn:**
- Orange accent (#eeb81c) for CTAs
- Clean product cards with images
- Hover effects on items
- Minimal but elegant

### 4. Modern Trading Apps (CoinGecko, etc.)
**URL:** https://www.coingecko.com/  
**What we learn:**
- Clean data tables with proper spacing
- Color-coded value indicators
- Smooth transitions between states
- Mobile-first responsive design

---

## Key Design Principles

### Color Palette (Modern Dark Gaming)
```css
/* Primary Colors */
background: #121212;      /* Very dark, almost black */
surface: #1e1e1e;         /* Card backgrounds */
border: #333333;          /* Subtle borders */

/* Accent Colors */
primary: #f97316;         /* Orange (CTAs) */
secondary: #3b82f6;       /* Blue (links, info) */
success: #22c55e;         /* Green (values up) */
warning: #fbbf24;         /* Yellow (warnings) */
danger: #ef4444;          /* Red (errors, low value) */

/* Text Colors */
primary-text: #ffffff;    /* Main text */
secondary-text: #a3a3a3;  /* Secondary/labels */
muted-text: #737373;      /* Tertiary info */
```

### Typography (Clean & Readable)
```css
/* Font Stack */
font-family: 
  -apple-system,              /* Mac system font */
  BlinkMacSystemFont,         /* More Mac fonts */
  "Segoe UI",                 /* Windows 10/11 */
  Roboto,                     /* Android/Fallback */
  Oxygen,                     /* Linux */
  Cantarell,                  /* Ubuntu */
  sans-serif;

/* Sizing */
h1: 2.25rem (36px)          /* Hero section */
h2: 1.75rem (28px)          /* Section headers */
h3: 1.25rem (20px)          /* Subsections */
body: 1rem (16px)           /* Main text */

/* Line Heights */
h1: 1.2                    /* Tight for headlines */
body: 1.6                  /* Comfortable reading */
```

### Spacing System
```css
xs: 0.25rem (4px)   /* Tight spacing */
sm: 0.5rem (8px)    /* Small gaps */
md: 1rem (16px)     /* Default padding */
lg: 1.5rem (24px)   /* Section spacing */
xl: 2rem (32px)     /* Major sections */

/* Grid System */
container max-width: 100%;
padding-x: md (16px on mobile) / lg (32px desktop);
grid-cols-1 → grid-cols-2 → grid-cols-3 responsive
```

---

## UI Component Guidelines

### Cards
```css
.card {
  background: #1e1e1e;
  border-radius: 12px;     /* Smooth rounded corners */
  border: 1px solid #333333; /* Subtle border */
  padding: 1.5rem;         /* Generous padding */
  transition: all 0.3s ease; /* Smooth hover */
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-color: #444444;
}
```

### Buttons
```css
/* Primary CTA */
.btn-primary {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

/* Secondary */
.btn-secondary {
  background: #2d2d2d;
  border: 1px solid #333333;
  color: #a3a3a3;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #3d3d3d;
  color: white;
}
```

### Input Fields
```css
.input {
  background: #2a2a2a;
  border: 1px solid #444444;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: #f97316;
  outline: none;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.input::placeholder {
  color: #666666;
}
```

### Badges & Labels
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px; /* Pill shape */
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-fn { background: #22c55e; }   /* Factory New */
.badge-mw { background: #3b82f6; }   /* Minimal Wear */
.badge-ft { background: #f97316; }   /* Field-Tested */
.badge-wt { background: #eab308; }   /* Well-Worn */
.badge-bs { background: #ef4444; }   /* Battle-Scarred */
```

---

## Layout Structure

### Header/Nav
```css
header {
  background: #1e1e1e;
  border-bottom: 1px solid #333333;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px); /* Glass effect */
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: #a3a3a3;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: white;
  background: #2d2d2d;
}
```

### Hero Section
```css
.hero {
  text-align: center;
  padding: 4rem 1.5rem 3rem;
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.75rem;
  font-weight: 700;
  line-height: 1.2;
  color: white;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.125rem;
  color: #a3a3a3;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-cta a {
  text-decoration: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}
```

### Calculator Section
```css
.calculator {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.calc-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.calc-header span {
  font-size: 1rem;
  font-weight: 400;
  color: #a3a3a3;
}

.calc-form {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #a3a3a3;
  margin-bottom: 0.5rem;
}

.form-inputs {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 0.75rem;
}

.form-inputs input {
  background: #2a2a2a;
  border: 1px solid #444444;
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.9375rem;
}

.calc-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calc-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}
```

### Results Section
```css
.results {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.result-card {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 4px solid;
  transition: transform 0.3s ease;
}

.result-card:hover {
  transform: translateX(5px);
}

.result-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #a3a3a3;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.result-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

/* Color variants */
.result-card.success { border-left-color: #22c55e; }
.result-card.info { border-left-color: #3b82f6; }
.result-card.warning { border-left-color: #fbbf24; }
.result-card.danger { border-left-color: #ef4444; }
```

### Inventory Table
```css
.inventory-section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.inv-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.inv-header span {
  font-size: 1rem;
  font-weight: 400;
  color: #a3a3a3;
}

.total-value-card {
  background: linear-gradient(135deg, #1e2a1e, #1e3d1e);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #2d4a2d;
  margin-bottom: 1.5rem;
}

.total-value-label {
  font-size: 0.875rem;
  color: #a3a3a3;
  margin-bottom: 0.5rem;
}

.total-value-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: #22c55e;
}

.inventory-table {
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333333;
}

.table-header {
  background: #2a2a2a;
  padding: 1rem;
  font-weight: 600;
  color: #a3a3a3;
  border-bottom: 1px solid #333333;
}

.table-row {
  padding: 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  align-items: center;
  border-bottom: 1px solid #333333;
  transition: background 0.2s ease;
}

.table-row:hover {
  background: #242424;
}

.table-row:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.wear-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.item-value {
  font-weight: 600;
  color: #22c55e;
  text-align: right;
}
```

---

## Animation Guidelines

### Subtle & Smooth
- Use `ease-in-out` for most transitions
- Duration: 300ms - 500ms (not instant!)
- Avoid excessive parallax or complex effects

```css
/* Common transition */
transition: all 0.3s ease;

/* Hover scale effect */
.hover-scale:hover {
  transform: scale(1.02);
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */
/* Default styles target mobile (<640px) */

@media (min-width: 640px) {
  /* Tablet breakpoints */
}

@media (min-width: 768px) {
  /* Larger tablet / small desktop */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large desktop */
}
```

---

## Accessibility Checklist

- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Focus visible on all interactive elements
- [ ] Alt text for images/icons
- [ ] Keyboard navigation works
- [ ] Touch targets ≥ 44x44px (mobile)
- [ ] No flashing content (>3Hz for seizures)
- [ ] Screen reader friendly structure

---

## Final Notes

**Do:**
- Keep it clean and minimal
- Use whitespace effectively
- Maintain consistent spacing
- Test on mobile devices
- Check color contrast

**Don't:**
- Overload with animations
- Use too many colors
- Make text hard to read
- Forget accessibility
- Ignore mobile experience

---

*This guide ensures Skiniify has a modern, professional gaming aesthetic while maintaining usability and accessibility.*