# 🚨 CLAUDE - XFLO WEBSITE - READ THIS FIRST - EVERY SINGLE TIME

## CRITICAL PROJECT CONTEXT:
- **PROJECT**: xFlo Website (migrated from R3_website)
- **THEME SYSTEM**: HSL-based semantic design tokens with Tailwind v4
- **CMS**: Payload CMS at xflocms.vercel.app
- **DEPLOYMENT**: Vercel (needs new deployment for xflo.agency)
- **TECH STACK**: Next.js 15, React 19, TypeScript, shadcn/ui

## BEFORE TOUCHING ANY CODE:
1. **STOP** - Am I about to violate the xFlo design system?
2. **CHECK** - Does the class I want to use already exist in `@theme` directive?
3. **USE EXISTING** - Only use classes that are already defined
4. **NO NEW CLASSES** - Never create new CSS classes
5. **NO INLINE STYLES** - Never use `style={{}}`
6. **NO !IMPORTANT** - Never add !important overrides

## IF STYLING ISN'T WORKING:
- Find out WHY the existing class isn't working
- Fix the root cause, don't add workarounds
- Ask the user before making any changes

## EXISTING SEMANTIC CLASSES TO USE:
- Typography: `text-navigation`, `text-quote`, `text-intro`, `title-4xl`
- Colors: `bg-surface-primary`, `text-content-inverse`
- Layout: Standard Tailwind like `py-24`, `gap-6`

# xFlo Website Development Guidelines for Claude

## 🎯 PROJECT MISSION
**Creating the ultimate digital experience for xFlo Agency**
- Modern, performant Next.js website
- Sophisticated HSL-based design system
- Seamless CMS integration with Payload
- AI-powered interactions and animations

## 🚨 CRITICAL XFLO DESIGN SYSTEM RULES - NO EXCEPTIONS

### **MANDATORY CHECKS BEFORE ANY CODE CHANGE:**
1. **STOP** - Check if semantic tokens exist for what you're trying to do
2. **NEVER hardcode** - Use semantic classes from our design system  
3. **VERIFY** - Is this class registered in `@theme` directive in `theme.css`?
4. **CONFORM** - Does this follow our HSL-based design system architecture?

### **BANNED HARDCODED CLASSES - DO NOT USE:**
❌ `text-[16px]`, `text-[arbitrary]` (Use semantic typography or Tailwind equivalents)
❌ `text-white`, `text-black`, `bg-white` (Use `text-content-inverse`, `bg-surface-light`)
❌ `border-white`, `border-black` (Use `border-stroke-primary`, `border-stroke-inverse`)
❌ `#171717`, `#ffffff`, `#ef4444` (Use HSL semantic tokens)
❌ `gap-[24px]`, `p-[16px]` (Use semantic or standard Tailwind classes)

### **SEMANTIC + TAILWIND APPROACH (BOTH ACCEPTABLE):**
✅ **Colors (Semantic First)**: `bg-surface-primary`, `text-content-inverse`, `text-content-secondary`
✅ **Typography (Semantic Preferred)**: `text-navigation`, `text-button`, `title-4xl`, `font-featured`
✅ **Layout (Either Approach)**: `container-outer` OR standard Tailwind containers
✅ **Spacing (Either Approach)**: `py-spacing-section` OR `py-24` (96px equivalent)
✅ **Borders (Either Approach)**: `rounded-card` OR `rounded-lg` (8px equivalent)
✅ **Gaps (Either Approach)**: `gap-spacing-element` OR `gap-6` (24px equivalent)

### **CLASS SELECTION PRIORITY:**
1. **Semantic tokens**: `bg-surface-primary`, `text-content-secondary` (for colors)
2. **Tailwind utilities**: `p-4`, `gap-6`, `rounded-lg`, `md:flex` (for spacing/layout)
3. **Component variants**: `Button variant="outline"`
4. **Last resort**: CSS custom properties in `@theme` directive

### **New HSL Design System Architecture**
- **HSL color format** for better compatibility and performance
- **Primary colors**: `primary-dark` (#171717), `primary-light` (#ffffff)
- **Secondary color**: `secondary` (#e32b35 - brand red)
- **Tertiary colors**: `tertiary-amber`, `tertiary-green`, `tertiary-blue`, `tertiary-neutral`
- **Neutral scale**: `neutral-50` to `neutral-950` (full Tailwind palette)

### **Available Semantic Color Classes:**
- **Surface**: `bg-surface-primary`, `bg-surface-secondary`, `bg-surface-tertiary`, `bg-surface-light`, `bg-surface-dark`
- **Content**: `text-content-primary`, `text-content-inverse`, `text-content-secondary`, `text-content-muted`, `text-content-brand`
- **Stroke**: `border-stroke-primary`, `border-stroke-inverse`, `border-stroke-secondary`, `border-stroke-muted`
- **Interactive**: `bg-interactive-primary`, `bg-interactive-primary-hover`, `bg-interactive-secondary`, `bg-interactive-secondary-hover`

### **Typography System:**
- **Navigation**: `text-navigation` (16px) + `font-navigation` (700 weight)
- **Button**: `text-button` (14px) + `font-button` (700 weight)
- **Body**: `text-base` (14px) + `font-standard` (400 weight)
- **Titles**: `title-2xl` to `title-9xl` with responsive scaling
- **Base body text**: 14px with 26px line-height

### **Container System:**
- **Outer container**: `container-outer` (1500px + content gutters: 24px/64px)
- **Inner container**: `container-inner` (1180px + content gutters: 24px/64px)
- **Navigation container**: `container-nav` (1500px + nav gutters: 16px/32px)
- **Text width**: `w-text` (784px for readable content)
- **Gallery scroll**: `gallery-scroll-container` (asymmetric: aligns left, extends right)

### **Spacing Scale (Semantic OR Tailwind):**
| Semantic | Tailwind Equivalent | Value | Usage |
|----------|-------------------|-------|-------|
| `spacing-section` | `24` (py-24) | 96px | Major page sections |
| `spacing-component` | `12` (gap-12) | 48px | Between components |
| `spacing-card` | `8` (p-8) | 32px | Card padding |
| `spacing-element` | `6` (gap-6) | 24px | Between related elements |
| `spacing-compact` | `4` (gap-4) | 16px | Compact layouts |
| `spacing-tight` | `2` (gap-2) | 8px | Inline elements |

### **Border Radius (Semantic OR Tailwind):**
| Semantic | Tailwind Equivalent | Value | Usage |
|----------|-------------------|-------|-------|
| `rounded-button` | `rounded-md` | 6px | Buttons, interactive |
| `rounded-card` | `rounded-lg` | 8px | Cards, panels |
| `rounded-field` | `rounded` | 4px | Form fields |

### **Component Development Rules**
- **Check @theme directive first** in `/src/styles/theme.css`
- **Use HSL semantic tokens** not hardcoded colors
- **Follow container system** for layouts
- **Use semantic typography** classes
- **Test responsive behavior** (single breakpoint at 768px)

### **Files to Reference**
- **Design tokens (source of truth)**: `/src/styles/theme.css` (@theme directive)
- **Global styles**: `/src/app/globals.css` (navigation utilities, base styles)
- **Tailwind config**: `/tailwind.config.ts` (minimal Tailwind v4 config)

### **COMPONENT OVERRIDE RULES:**
❌ **NEVER override Button component styling** - Use variants instead
❌ **NEVER add typography classes to Button** - It has semantic typography built-in  
❌ **NEVER add border-radius to Button** - It uses `rounded-button` semantic token
❌ **NEVER use arbitrary values** - Always use semantic tokens from @theme

### **XFLO SYSTEM STATUS:**
✅ **Colors**: Complete HSL semantic token system (`bg-surface-primary`, `text-content-inverse`)
✅ **Typography**: xFlo typography scale with Figtree font (`text-navigation: 16px`, `font-button: 700`)
✅ **Layout**: xFlo container system (`container-outer: 1500px`, `container-inner: 1180px`)
✅ **Borders**: xFlo radius system (`rounded-button: 6px`, `rounded-card: 8px`)
✅ **Spacing**: xFlo spacing scale (`spacing-section: 96px`, `spacing-element: 24px`)
✅ **Navigation**: xFlo navigation themes (`.nav-light`, `.nav-dark`) with smooth transitions
✅ **CMS Integration**: Complete Payload CMS integration with TypeScript interfaces
✅ **AI Features**: Built-in xFlo AI chat functionality

### **BEFORE EVERY COMPONENT UPDATE:**
1. **Read the component** - Understand what it currently does
2. **Check existing styling** - What tokens/classes does it use?
3. **Choose approach** - Semantic colors + Tailwind layout OR full semantic
4. **Plan replacements** - Use semantic equivalents or Tailwind standards
5. **Verify tokens exist** - Check `@theme` directive in `theme.css`
6. **Test incrementally** - Change one thing at a time
7. **Verify responsive behavior** - Test mobile/desktop breakpoint (768px)

### **EXAMPLES OF CORRECT USAGE:**
```tsx
// ✅ Semantic + Tailwind (Recommended)
<div className="bg-surface-primary py-24 gap-12 rounded-lg">

// ✅ Full Semantic (Alternative)
<div className="bg-surface-primary py-spacing-section gap-spacing-component rounded-card">

// ✅ Mixed Approach (Acceptable)
<div className="bg-surface-tertiary p-8 rounded-lg md:gap-6">

// ❌ Arbitrary Values (Banned)
<div className="bg-[#f5f5f5] py-[96px] gap-[48px]">
```

## xFlo Development Commands

### Testing & Linting
- Run linting: `npm run lint` (ESLint with Next.js rules)
- Type checking: TypeScript strict mode enabled
- Bundle analysis: `npm run build:analyze`

### Build & Development
- Development server: `npm run dev` (runs on port 3002)
- Production build: `npm run build`
- Start production: `npm start`

## Architecture Notes

### xFlo Tech Stack
- **Framework**: Next.js 15.3.3 with React 19 and TypeScript
- **Styling**: Tailwind CSS v4 with CSS-first @theme directive
- **Design System**: HSL colors with xFlo semantic tokens
- **Components**: shadcn/ui components with xFlo theme integration
- **CMS**: Payload CMS (xflocms.vercel.app)
- **AI**: xFlo AI chat integration
- **Deployment**: Vercel (needs new deployment for xflo.agency)
- **Fonts**: Figtree (Google Fonts integration)

### xFlo HSL Design System Architecture

**1. xFlo Foundation Layer** (`/src/styles/theme.css` - @theme directive):
- xFlo HSL color tokens (primary-dark: #171717, primary-light: #ffffff, secondary: red)
- Full neutral scale matching xFlo brand guidelines
- xFlo typography foundation with Figtree font
- xFlo spacing, container, border, shadow, z-index scales

**2. xFlo Semantic Layer** (`/src/styles/theme.css` - @theme directive):
- xFlo semantic color mappings (surface, content, stroke, interactive)
- xFlo component tokens (navigation: 16px/700, button: 16px/600)
- xFlo container system (outer: 1500px, inner: 1180px)
- xFlo responsive spacing with mobile/desktop gutters

**3. xFlo Application Layer** (`/src/app/globals.css`):
- shadcn/ui variable mapping to xFlo semantic tokens
- xFlo navigation theme utilities (.nav-light, .nav-dark)
- xFlo base styles (body: 18px/28px desktop, 16px/24px mobile)
- xFlo responsive title classes with mobile scaling

### xFlo Design Principles
- **HSL color format** optimized for xFlo brand colors
- **Single breakpoint system** (768px mobile/desktop divide)
- **xFlo semantic token architecture** (surface, content, stroke, interactive)
- **xFlo container-based layouts** with responsive gutters
- **xFlo component-specific typography** with Figtree font
- **shadcn/ui integration** through xFlo CSS variable mapping
- **Performance-first** approach for xFlo's high-traffic site
- **CMS-driven** content with flexible block system

### xFlo File Responsibilities
- **theme.css**: Complete xFlo design system (@theme + :root + utilities)
- **globals.css**: shadcn mapping + xFlo navigation utilities + base styles
- **tailwind.config.ts**: Minimal Tailwind v4 configuration for xFlo
- **Components**: Use xFlo semantic classes only (bg-surface-primary, text-navigation)
- **payload.ts**: Complete CMS integration with xFlo types
- **constants.ts**: xFlo-specific API and configuration constants

## Typography Reference

### Semantic Typography Classes

| Class | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-navigation` | 16px | 700 | Navigation items |
| `text-button` | 14px | 700 | Button text |
| `text-field` | 14px | 400 | Form fields |
| `text-breadcrumb` | 12px | 400 | Breadcrumbs |
| `font-standard` | - | 400 | Standard text |
| `font-featured` | - | 700 | Featured text |

### Title Classes (Responsive)

| Class | Mobile | Desktop | Weight |
|-------|--------|---------|---------|
| `title-2xl` | 22px | 24px | 700 |
| `title-3xl` | 28px | 30px | 700 |
| `title-4xl` | 32px | 36px | 700 |
| `title-5xl` | 40px | 48px | 700 |
| `title-6xl` | 44px | 60px | 700 |
| `title-7xl` | 44px | 72px | 800 |

### Base Text System
- **Body text**: 14px with 26px line-height (mobile: tighter line-height)
- **Single breakpoint**: 768px (no complex responsive prefixes needed)
- **Auto-scaling**: Title classes automatically scale mobile to desktop

## Container System

### Available Containers

| Class | Max Width | Mobile Gutter | Desktop Gutter | Purpose |
|-------|-----------|---------------|----------------|---------|
| `container-outer` | 1500px | 24px | 64px | Full-width sections |
| `container-inner` | 1180px | 24px | 64px | Main content areas |
| `container-fluid` | 100% | 24px | 64px | Fluid width with gutters |
| `container-outer-no-pad` | 1500px | 0 | 0 | Nested use (centered) |
| `container-inner-no-pad` | 1180px | 0 | 0 | Nested use (centered) |
| `container-nav` | 1500px | 16px | 32px | Navigation (smaller gutters) |
| `gallery-scroll-container` | Viewport edge | Asymmetric | Asymmetric | Scrolling galleries |

## Navigation System

### Theme Utilities
- **Light navigation**: `.nav-light` (white text/borders)
- **Dark navigation**: `.nav-dark` (dark text/borders)
- **Blend mode**: `.nav-blend-mode` (mix-blend-mode: difference)
- **Auto transitions**: All nav elements have smooth transitions

### Navigation Classes
- Use `text-navigation` (16px) and `font-navigation` (700 weight)
- Combine with theme utilities: `.nav-light` or `.nav-dark`
- Button styling: `.nav-cta` with proper hover states

## xFlo CMS Integration Guidelines

### Payload CMS Architecture
- **Production CMS**: `https://xflocms.vercel.app/api`
- **Admin Panel**: `https://xflocms.vercel.app/admin`
- **API Client**: Use `/src/lib/payload.ts` for all CMS interactions
- **TypeScript Types**: Complete interface definitions for all CMS content

### Content Block System
- **Flexible Blocks**: 20+ reusable content blocks for dynamic layouts
- **Type Safety**: All blocks use TypeScript interfaces
- **Responsive**: All blocks follow xFlo responsive guidelines
- **Performance**: Blocks support caching and ISR

### CMS Development Rules
1. **Always use payload.ts functions** for CMS data
2. **Handle loading states** gracefully with fallbacks
3. **Use TypeScript interfaces** for all CMS content
4. **Follow block patterns** when creating new content blocks
5. **Test with real CMS data** during development

## xFlo AI Integration Guidelines

### AI Chat Features
- **xFlo API**: Integration with xFlo's AI platform
- **Custom UI**: Purpose-built chat interface
- **Context Aware**: Industry-specific responses
- **Performance**: Optimized for real-time interactions

## xFlo Performance Guidelines

### Critical Performance Rules
1. **ISR Implementation**: Use Next.js ISR for content caching
2. **Image Optimization**: Always use Next.js Image component
3. **Bundle Optimization**: Monitor bundle size with analyzer
4. **Font Loading**: Optimize Figtree font loading
5. **API Caching**: Implement smart caching strategies

## xFlo Deployment Guidelines

### Vercel Configuration
- **Current Status**: Needs new Vercel deployment for xflo.agency domain
- **Node Version**: 22.19.0 (managed by Volta)
- **Environment Variables**: All xFlo-specific env vars configured
- **Build Process**: Optimized for xFlo's performance requirements

### Migration Status
- ✅ **Codebase**: Migrated from R3_website
- ✅ **CMS**: Already configured for xflocms.vercel.app
- ✅ **Design System**: Complete HSL implementation
- ⚠️ **Branding**: Need to update R3 references to xFlo
- ⚠️ **Deployment**: New Vercel deployment needed

## Important xFlo Reminders

1. **Always use xFlo semantic tokens** from @theme directive
2. **Use HSL color system** optimized for xFlo brand
3. **Follow xFlo container system** for consistent layouts
4. **Test single breakpoint** (768px) for responsive behavior
5. **Use xFlo navigation theme utilities** for different contexts
6. **Maintain xFlo semantic naming** across all components
7. **Check theme.css first** before writing any custom styles
8. **Use Payload CMS functions** for all content operations
9. **Test with real CMS data** during development
10. **Monitor performance** with built-in tools