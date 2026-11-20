# MetriSolution Inventory ERP SaaS — Design System Specification

**Author:** Senior UI/UX Designer & Accessibility Engineer  
**Product:** MetriSolution Inventory ERP SaaS  
**Company:** MetriSolution Pvt Ltd  
**Version:** 1.0.0  

---

## 1. Visual Design Direction

MetriSolution's visual identity reflects a modern, authoritative, and clean B2B SaaS experience. It balances consumer-grade accessibility for first-time retail shopkeepers with the data density and speed demanded by high-volume multi-branch distributors.

### Design Principles
1. **Calm, Readable & High-Contrast:** Neutral backgrounds (`#F8FAFC`, `#FFFFFF`) ensure dense data tables remain legible during long cashier shifts.
2. **Tabular Numerals:** All financial figures (PKR), stock counts, and barcode digits employ `font-variant-numeric: tabular-nums` to guarantee aligned decimal columns.
3. **Restrained Enterprise Motion:** Micro-interactions (hover, drawer slide, modal scale) strictly adhere to 150ms–250ms curves and respect `prefers-reduced-motion`.
4. **No Cartoon Imagery or Dead Buttons:** Functional Lucide SVG vector icons, real components, and actionable demo interactions.

---

## 2. Color Palette & Semantic Tokens

```css
/* Official MetriSolution Palette */
--color-primary: #6941C6;        /* Deep Royal Purple Interaction Accent */
--color-primary-hover: #5531A7;  /* High-contrast Hover */
--color-primary-soft: #F4F0FF;   /* Soft Purple Surface */
--color-navy: #101828;           /* Primary Typography & Top Accent */
--color-blue: #2878F0;           /* Secondary Information Accent */
--color-orange: #F79009;         /* Warning / Attention Accent */

/* Neutral Surfaces */
--color-canvas: #F8FAFC;         /* Application Canvas */
--color-surface: #FFFFFF;        /* Elevated Card & Modal Surface */
--color-surface-alt: #F2F4F7;    /* Secondary Controls & Headers */
--color-border: #E4E7EC;         /* Card & Table Borders */

/* Text Hierarchy */
--color-text-primary: #101828;   /* 100% Contrast Body Copy */
--color-text-secondary: #475467; /* Supportive Description Copy */
--color-text-muted: #98A2B3;     /* Placeholder & Metadata Captions */

/* Semantic Status */
--color-success: #027A48;        /* In Stock, Paid, Verified */
--color-warning: #B54708;        /* Reorder Level, In Transit */
--color-danger: #B42318;         /* Out of Stock, Overdue */
--color-info: #175CD3;           /* Informational Alerts */
```

---

## 3. Typography Hierarchy

* **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Scale:**
  - `Hero Heading`: 44px–64px (`font-weight: 800`, letter-spacing `-0.035em`)
  - `Title 1`: 36px–44px (`font-weight: 700`, letter-spacing `-0.03em`)
  - `Title 2`: 30px (`font-weight: 700`, letter-spacing `-0.025em`)
  - `Title 3`: 24px (`font-weight: 600`, letter-spacing `-0.02em`)
  - `Heading`: 18px (`font-weight: 600`)
  - `Body Copy`: 15px (`line-height: 1.55`)
  - `Small Body`: 13px (`line-height: 1.5`)
  - `Caption / Microcopy`: 12px (`line-height: 1.4`)

---

## 4. Component Standards

### Border Radii
* Inputs & Selects: `8px` (`--radius-input`)
* Buttons: `8px–10px` (`--radius-btn`)
* Cards & Panels: `14px` (`--radius-card`)
* Modals: `16px` (`--radius-modal`)
* Badges & Pills: `9999px` (`--radius-pill`)

### Elevations & Shadows
* Subtle elevation avoids visual noise on large multi-column screens:
  - `--shadow-xs`: 0 1px 2px rgba(16, 24, 40, 0.05)
  - `--shadow-sm`: 0 1px 3px rgba(16, 24, 40, 0.1)
  - `--shadow-md`: 0 4px 8px -2px rgba(16, 24, 40, 0.1)
  - `--shadow-xl`: 0 20px 24px -4px rgba(16, 24, 40, 0.08)

---

## 5. Accessibility (WCAG 2.2 AA)

1. **Color Contrast:** All body text meets or exceeds a 4.5:1 contrast ratio against `#FFFFFF` and `#F8FAFC`.
2. **Keyboard Focus:** Visible focus rings (`outline: 2px solid #6941C6; outline-offset: 2px`) on all interactive buttons, inputs, links, and modal traps.
3. **Screen Readers:** ARIA landmarks (`role="region"`, `role="dialog"`, `aria-modal="true"`, `aria-live="polite"` on toasts).
4. **Motion Safety:** Automatic disabling of CSS transitions when `prefers-reduced-motion` is detected in system preferences.
