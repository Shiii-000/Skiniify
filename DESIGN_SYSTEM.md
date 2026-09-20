# 🎨 Skiniify Design System

A premium visual identity for a professional CS2 skin tracking platform.

---

## 🎯 **Design Philosophy**

**Goal:** Create a visually stunning, high-end SaaS experience that feels like a premium marketplace and analytics tool—not a generic dashboard.

### **Core Principles**

1. **Premium Dark Mode:** Near-black backgrounds (#0a0a0b) with subtle depth through gradients and borders
2. **Cyan Accent:** Primary accent color (#06b6d4) used sparingly for CTAs and important elements
3. **Rarity Colors:** Used only on items, badges, and indicators—not UI elements
4. **Subtle Animations:** 150-300ms micro-interactions that feel responsive and polished
5. **Visual Hierarchy:** Clear distinction between primary content, secondary information, and metadata

---

## 🎨 **Color System**

### **Backgrounds**
```css
background-base: #0a0a0b      /* Near-black main background */
background-surface: #111113   /* Card backgrounds */
background-elevated: #1c1c1e  /* Elevated components */
border-subtle: #27272a        /* Subtle borders (primary) */
border-medium: #3f3f46        /* Medium importance borders */
```

### **Accents**
```css
primary: #06b6d4              /* Cyan - primary action color */
success: #10b981              /* Green - positive states */
warning: #f59e0b              /* Amber - warnings/alerts */
danger: #ef4444               /* Red - errors/danger */
```

### **Text**
```css
text-primary: #f4f4f5         /* Main text (near white) */
text-secondary: #a1a1aa       /* Secondary text (gray) */
text-muted: #71717a           /* Tertiary text (light gray) */
text-subtle: #52525b          /* Subtle metadata */
```

### **Rarity Colors** (item-only usage)
```css
milSpec: #9ca3af             /* Gray - Mil-Spec rarity */
restricted: #f97316          /* Orange - Restricted rarity */
classified: #eab308          /* Yellow - Classified rarity */
covert: #a855f7              /* Purple - Covert rarity */
knife: #fbbf24               /* Gold - Knife rarity */
glove: #ec4899               /* Pink - Glove rarity */
```

---

## ✍️ **Typography**

### **Font Stack**
```css
Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
Monospace for data: SF Mono, Monaco, Consolas
```

### **Hierarchy**

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Display Numbers | 2.25rem (36px) | Bold | Inventory values |
| Page Titles | 1.875rem (30px) | Semibold | Section headings |
| Hero Headings | 1.875-2.25rem | Bold | Main titles |
| Section Titles | 1.25rem (20px) | Medium | Feature sections |
| Body Text | 1rem (16px) | Normal | Content |
| Labels/Metadata | 0.875rem (14px) | Medium | Input labels, badges |

### **Line Heights**
- Tight: 1.25 (numbers, tight tables)
- Normal: 1.5 (body text)
- Relaxed: 1.625 (headings)

---

## 📐 **Spacing & Layout**

### **Grid System**
- Container max-width: 7xl (80rem = 1280px)
- Gutter: 1.5rem (24px)
- Padding: 0.5rem - 1.25rem based on context

### **Component Spacing**
```css
xs: 0.25rem (4px)      /* Tight spacing */
sm: 0.5rem (8px)       /* Standard small */
md: 0.75rem (12px)     /* Medium */
lg: 1rem (16px)        /* Large */
xl: 1.25rem (20px)     /* Extra large */
```

---

## 🎭 **Visual Effects**

### **Gradients**
```css
// Subtle background depth
linear-gradient(to-br, #111113, #161618, #111113)

// Primary gradient (CTAs)
gradient-to-r from-[#06b6d4] via-[#0eeea1] to-[#06b6d4]
```

### **Borders**
- Primary: 1px solid #27272a
- Hover: 1px solid #3f3f46
- Focus: 1px solid #06b6d4 with glow

### **Shadows (Very Subtle)**
```css
sm: 0 1px 2px rgba(0, 0, 0, 0.3)
md: 0 2px 8px rgba(0, 0, 0, 0.4)
lg: 0 4px 16px rgba(0, 0, 0, 0.5)
xl: 0 8px 32px rgba(0, 0, 0, 0.6)
```

### **Border Radius**
- sm: 0.25rem (4px) - subtle elements
- md: 0.5rem (8px) - standard inputs/buttons
- lg: 0.75rem (12px) - cards/panels
- xl: 1rem (16px) - prominent components

---

## ⚡ **Animations**

### **Timing Functions**
- Fast: 150ms ease-in-out (micro-interactions)
- Normal: 200ms ease-in-out (card hovers)
- Slow: 300ms ease-in-out (page transitions)

### **Key Animations**

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Scale In
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### **Hover Effects**
- Card hover: scale 1.02, border glow, subtle shadow increase
- Button hover: color shift, slight lift (translate-y -1px)
- Image hover: scale 1.05 with parallax effect

---

## 🧩 **Component Design**

### **Header**
```
┌─────────────────────────────────────────────┐
│ [Logo]           [Action Buttons]           │
│ 🔪 Skiniify          Trade-Up Calculator   │
└─────────────────────────────────────────────┘
- Sticky, backdrop blur
- Border bottom: 1px solid #27272a
- Logo glow on hover
```

### **Cards**
```
┌───────────────────────────────────┐
│                                   │
│  [Content with padding]           │
│                                   │
└───────────────────────────────────┘
- Background: #111113
- Border: 1px solid #27272a
- Hover: border-color #3f3f46
- Subtle gradient background
```

### **Buttons**
```
Primary: bg-gradient-to-r from-[#06b6d4] via-[#0eeea1] to-[#06b6d4]
Secondary: bg-[#1c1c1e] text-[#a1a1aa] hover:bg-[#27272a]
Disabled: bg-[#1c1c1e] text-[#52525b] cursor-not-allowed
```

### **Input Fields**
```
┌─────────────────────────────────┐
│ Placeholder text                │
└─────────────────────────────────┘
- Background: #0a0a0b
- Border: 1px solid #27272a
- Focus: border-[#06b6d4] with glow
- Font family: monospace for IDs
```

### **Badges**
```
Primary: bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20
Secondary: bg-[#1c1c1e] text-[#a1a1aa] border border-[#27272a]
```

---

## 📱 **Responsive Design**

### **Breakpoints**
- sm: 640px (tablet portrait)
- md: 768px (tablet landscape)
- lg: 1024px (small desktop)
- xl: 1280px (desktop)
- 2xl: 1536px (large desktop)

### **Mobile Adaptations**
- Cards stack vertically
- Tables convert to card layouts
- Navigation transforms to hamburger menu
- Padding reduced for compact touch targets
- Font sizes slightly increased for readability

---

## 🎯 **Page-Specific Guidelines**

### **Dashboard/Home**
- Large hero section with gradient headline
- Asymmetric layout for inventory value display
- Subtle skeleton loading states
- Empty state with illustration and clear CTA
- Feature cards with icons and brief descriptions

### **Calculator**
- Three-column layout (inputs 2/3, results 1/3)
- Drag-and-drop slot reordering
- Clear visual flow: Inputs → Calculation → Outputs
- Step-by-step progress indicators
- Results displayed in progressive card layout

### **Market Page**
- Large overview section with price summary
- Trending/rising/falling sections with skin imagery
- Charts integrated into interface (not dominating)
- Price tables with color-coded changes

---

## 🌙 **Dark Mode Best Practices**

1. **Never flat black:** Use #0a0a0b for depth
2. **Subtle gradients:** Radial lighting, very faint noise/grain
3. **Border hierarchy:** Subtle borders create depth without clutter
4. **Text contrast:** Ensure accessibility (WCAG AA minimum)
5. **Accent sparingly:** Use cyan only for actions/important info

---

## ✅ **Do's and Don'ts**

### **✅ DO**
- Use subtle gradients for background depth
- Apply 1px borders for visual separation
- Keep animations at 150-300ms
- Use skeleton loading that matches actual content layout
- Show clear empty states with helpful CTAs
- Maintain consistent border radius (use design token system)

### **❌ DON'T**
- Use completely flat black backgrounds (#000000)
- Make hover effects excessive or slow
- Use rarity colors for UI elements
- Display tiny text (minimum 14px / 0.875rem)
- Use uppercase for everything
- Show generic spinners everywhere

---

## 📊 **Charts & Data Visualization**

### **Design Principles**
- Thin lines with subtle grid
- Clean tooltips with backdrop blur
- Smooth transitions on data updates
- Minimal labels (only essential info)
- Color-coded by status (green up, red down)

### **Example Chart Design**
```css
chart-line: stroke-[#06b6d4] stroke-width-[2px]
grid-lines: stroke-[#27272a] stroke-opacity-[0.3]
tooltips: bg-[#1c1c1e] border border-[#27272a] p-3 rounded-lg
```

---

## 🎭 **Micro-interactions**

### **Button Feedback**
- Click: scale 0.98, shadow decrease
- Hover: lift (translate-y -1px), color shift
- Loading: spin animation with opacity fade

### **Card Interactions**
- Hover: scale 1.02, border glow, subtle shadow increase
- Focus: outline ring with primary color
- Enter: animate-in slide-in-from-bottom-4

### **Data Updates**
- Numbers: counter animation (300ms)
- Lists: staggered fade-in (50ms per item)
- Images: skeleton → reveal transition

---

## 🎨 **Background Treatment**

### **Subtle Depth Layers**
```css
// Layer 1: Base background
background-base: #0a0a0b

// Layer 2: Subtle radial gradient
radial-gradient(circle at center, transparent 40%, rgba(6, 182, 212, 0.02) 100%)

// Layer 3: Fine noise/grain (optional)
background-image: url("data:image/svg+xml,...noise-pattern...")
```

### **Use Cases**
- Hero sections: Subtle radial lighting behind text
- Cards: Very faint geometric/grid elements
- Panels: Gradient overlays on hover

---

## 🎯 **Accessibility Guidelines**

1. **Color Contrast:** WCAG AA minimum (4.5:1 for normal text)
2. **Focus States:** Visible focus rings on all interactive elements
3. **Keyboard Navigation:** Full keyboard support for all actions
4. **Screen Readers:** Proper ARIA labels and semantic HTML
5. **Touch Targets:** Minimum 44x44px for touch interactions

---

## 📁 **File Structure**

```
frontend/
├── src/
│   ├── design-system.ts         # Color, spacing, typography tokens
│   ├── api.ts                   # API client functions
│   ├── components/              # Reusable UI components
│   │   ├── Header.tsx           # Premium header component
│   │   ├── Card.tsx             # Base card with variants
│   │   ├── Button.tsx           # Primary/secondary buttons
│   │   └── Input.tsx            # Form inputs with states
│   └── app/
│       ├── layout.tsx           # Root layout (if implemented)
│       ├── page.tsx             # Dashboard/home
│       ├── calculator/
│       │   └── page.tsx         # Trade-up calculator
│       └── inventory/
│           └── page.tsx         # Inventory management
```

---

## 🚀 **Deployment Notes**

### **Build Command**
```bash
npm run build
```

### **Environment Variables**
Create `.env.local` in frontend folder:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **Optimization**
- Image lazy loading with elegant placeholders
- Code splitting for route optimization
- Font subsetting for web fonts
- Tree shaking for production builds

---

## 📝 **Version History**

### **v3.0 (Current)**
- Premium dark mode design system
- Complete redesign of all pages
- Drag-and-drop slot reordering
- Skeleton loading states
- Subtle micro-interactions

### **v2.0**
- TypeScript migration
- API integration
- Basic dashboard functionality

---

## 🎮 **Community**

**Discord:** https://discord.gg/anKZZ7FpwH  
Get support, report bugs, and share features!

---

**Built by Shii-000** for the CS:GO/CS2 community.  
Powered by CSFloat API & Steam Market | v3.0.0