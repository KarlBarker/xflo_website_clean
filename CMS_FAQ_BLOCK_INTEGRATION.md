# FAQ Accordion Block - CMS Integration Guide

## Overview
This guide provides complete instructions for integrating the FAQ (Frequently Asked Questions) accordion block into the Payload CMS. This block features:
- Two-level nested accordions (Categories → Questions)
- Background color control (white or dark)
- Adaptive text colors (black on white, white on dark)
- Optional title and subtitle
- Spacing controls

---

## 1. Collection Schema (Payload CMS)

Create a new block type called `faqSection` with the following schema:

### Block Name: `faqSection`

### Fields Structure:

```typescript
{
  // Block identification
  blockType: 'faqSection',
  blockName: 'FAQ Section',

  // Content fields
  fields: [
    // Title (optional)
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Frequently Asked Questions',
      admin: {
        description: 'Main heading for the FAQ section'
      }
    },

    // Subtitle (optional)
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      admin: {
        description: 'Optional subtitle or description'
      }
    },

    // Background color
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'white',
      options: [
        {
          label: 'White',
          value: 'white'
        },
        {
          label: 'Dark (Primary Dark)',
          value: 'primary'
        },
        {
          label: 'Light Gray',
          value: 'light-gray'
        }
      ],
      admin: {
        description: 'Background color - text will automatically adapt (black on white, white on dark)'
      }
    },

    // FAQ Categories (array)
    {
      name: 'categories',
      type: 'array',
      label: 'FAQ Categories',
      minRows: 1,
      admin: {
        description: 'Add categories of questions. First category will be expanded by default.'
      },
      fields: [
        // Category name
        {
          name: 'category',
          type: 'text',
          label: 'Category Name',
          required: true,
          admin: {
            description: 'e.g., "Platform & Technology", "Pricing & Investment"'
          }
        },

        // Questions array
        {
          name: 'items',
          type: 'array',
          label: 'Questions & Answers',
          minRows: 1,
          admin: {
            description: 'Add questions and answers for this category'
          },
          fields: [
            {
              name: 'question',
              type: 'text',
              label: 'Question',
              required: true,
              admin: {
                description: 'The question text'
              }
            },
            {
              name: 'answer',
              type: 'textarea',
              label: 'Answer',
              required: true,
              admin: {
                description: 'The answer text (supports plain text, line breaks preserved)'
              }
            }
          ]
        }
      ]
    },

    // Spacing controls
    {
      name: 'spacingTop',
      type: 'select',
      label: 'Spacing Top',
      defaultValue: 'section',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Tight (8px)', value: 'tight' },
        { label: 'Compact (16px)', value: 'compact' },
        { label: 'Element (24px)', value: 'element' },
        { label: 'Component (48px)', value: 'component' },
        { label: 'Section (96px)', value: 'section' }
      ]
    },

    {
      name: 'spacingBottom',
      type: 'select',
      label: 'Spacing Bottom',
      defaultValue: 'section',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Tight (8px)', value: 'tight' },
        { label: 'Compact (16px)', value: 'compact' },
        { label: 'Element (24px)', value: 'element' },
        { label: 'Component (48px)', value: 'component' },
        { label: 'Section (96px)', value: 'section' }
      ]
    }
  ]
}
```

---

## 2. TypeScript Interface (Frontend)

The frontend already has the interface defined in `/src/components/blocks/faq-section.tsx`. For reference, here's the structure:

```typescript
interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id?: string;
  category: string;
  items: FAQItem[];
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  categories: FAQCategory[];
  backgroundColor?: string;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}
```

---

## 3. Integration with Dynamic Page Renderer

Add the FAQ block to your dynamic page renderer at `/src/components/layouts/dynamic-page.tsx`:

### Step 1: Import the component

```typescript
import { FAQSection } from '@/components/blocks/faq-section';
```

### Step 2: Add TypeScript interface for the block

```typescript
export interface FAQSectionBlock extends CaseStudyBlock {
  blockType: 'faqSection';
  title?: string;
  subtitle?: string;
  categories: Array<{
    id?: string;
    category: string;
    items: Array<{
      id?: string;
      question: string;
      answer: string;
    }>;
  }>;
  backgroundColor?: string;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}
```

### Step 3: Add the case statement to render the block

In your `renderBlock` function or switch statement, add:

```typescript
case 'faqSection':
  const { topClass: faqTopClass, bottomClass: faqBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
  const faqBgClass = block.backgroundColor === 'primary' ? 'bg-surface-primary' : block.backgroundColor === 'light-gray' ? 'bg-surface-tertiary' : 'bg-surface-light';

  return (
    <div key={key} className={`${faqTopClass} ${faqBottomClass} ${faqBgClass}`} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
      <FAQSection
        title={block.title}
        subtitle={block.subtitle}
        categories={block.categories}
        backgroundColor={block.backgroundColor}
        layout="categories"
        spacingTop={block.spacingTop}
        spacingBottom={block.spacingBottom}
      />
    </div>
  );
```

---

## 4. Example CMS Data Structure

Here's an example of how the data should look in the CMS:

```json
{
  "blockType": "faqSection",
  "title": "Frequently Asked Questions",
  "subtitle": "Everything you need to know about xFlo.ai",
  "backgroundColor": "white",
  "spacingTop": "section",
  "spacingBottom": "section",
  "categories": [
    {
      "id": "platform-technology",
      "category": "Platform & Technology",
      "items": [
        {
          "id": "what-is-xflo",
          "question": "What exactly is xFlo.ai?",
          "answer": "xFlo.ai is an AI software platform that combines advanced data processing (RAG), intelligent automation (Agents), and seamless integrations (MCP) with hands-on partnership to transform how SMBs operate."
        },
        {
          "id": "difference-from-chatgpt",
          "question": "How is xFlo different from ChatGPT or Claude for business?",
          "answer": "While ChatGPT and Claude provide raw AI capabilities, xFlo delivers a complete business solution with enterprise-grade security, compliance controls, cost optimization, custom integrations to your existing tools, and dedicated support."
        }
      ]
    },
    {
      "id": "pricing",
      "category": "Pricing & Investment",
      "items": [
        {
          "id": "cost",
          "question": "How much does xFlo cost?",
          "answer": "Platform access starts at £500/month, with implementation packages from £25,000-250,000 depending on scope."
        }
      ]
    }
  ]
}
```

---

## 5. How to Use in CMS (Editor Instructions)

### Adding FAQ Block to a Page:

1. **Navigate to your page in the CMS**
2. **Add a new block** and select "FAQ Section"
3. **Fill in the fields:**
   - **Title**: Main heading (e.g., "Frequently Asked Questions")
   - **Subtitle**: Optional description (e.g., "Everything you need to know about xFlo.ai")
   - **Background Color**: Choose white, dark, or light gray
   - **Spacing Top/Bottom**: Control vertical spacing around the block

4. **Add Categories:**
   - Click "Add Category"
   - Enter category name (e.g., "Platform & Technology")
   - Add questions and answers for that category
   - Repeat for each category

5. **Tips:**
   - First category will be expanded by default
   - Categories appear in the order you add them
   - Each category can have unlimited questions
   - Line breaks in answers are preserved

---

## 6. Background Color Behavior

The block automatically adjusts text colors based on background:

| Background | Text Color | Chevron | Borders |
|------------|-----------|---------|---------|
| White (`white`) | Black | Black (60% opacity) | Gray |
| Light Gray (`light-gray`) | Black | Black (60% opacity) | Gray |
| Dark (`primary`) | White | White (60% opacity) | Light gray |

**Note**: You don't need to set text colors - they adapt automatically!

---

## 7. Component Features

### Two-Level Accordion:
- **Level 1**: Category headers (collapsible)
- **Level 2**: Questions within each category (collapsible)

### Default Behavior:
- First category opens automatically on page load
- All other categories collapsed by default
- Users can expand/collapse as needed

### Styling:
- Categories: Larger text (text-2xl), more padding
- Questions: Regular text (text-lg), standard padding
- Hover states on questions (subtle background change)
- Smooth animations on expand/collapse

---

## 8. File Locations

### Frontend Files:
- **Component**: `/src/components/blocks/faq-section.tsx`
- **Demo Data**: `/src/data/faq-data.ts` (can be deleted after CMS integration)
- **Demo Page**: `/src/app/faq-demo/page.tsx` (can be deleted after CMS integration)
- **Page Renderer**: `/src/components/layouts/dynamic-page.tsx` (needs update - see Step 3)

### Files to Update:
1. `/src/components/layouts/dynamic-page.tsx` - Add case statement for 'faqSection'
2. `/src/lib/payload.ts` - Add `FAQSectionBlock` interface to block types union

---

## 9. Testing Checklist

After CMS integration, test:

- [ ] FAQ block appears in CMS block selector
- [ ] Can add/edit/delete categories
- [ ] Can add/edit/delete questions within categories
- [ ] Title and subtitle display correctly
- [ ] Background color changes work (white, dark, light-gray)
- [ ] Text colors adapt automatically to background
- [ ] First category opens by default
- [ ] Categories collapse/expand correctly
- [ ] Questions collapse/expand correctly
- [ ] Spacing controls work (top and bottom)
- [ ] Block renders on actual pages (not just demo)
- [ ] Responsive behavior works on mobile

---

## 10. Migration Steps

Once CMS integration is complete:

1. **Verify FAQ block works in CMS**
2. **Create a test page with FAQ block**
3. **Confirm all features work**
4. **Delete demo files:**
   - `/src/data/faq-data.ts`
   - `/src/app/faq-demo/page.tsx`
5. **Update documentation** to reference CMS instead of demo

---

## 11. Support & Questions

### Common Issues:

**Q: First category not opening by default?**
A: Check that `defaultValue="category-0"` is set on the outer Accordion component

**Q: Text colors not adapting?**
A: Verify background color values match: 'white', 'primary', or 'light-gray'

**Q: Categories not collapsing?**
A: Ensure nested Accordions have unique value props (category-X vs question-X-Y)

---

## 12. Design System Compliance

This block follows xFlo design system:
- ✅ Uses semantic color tokens
- ✅ Follows spacing scale
- ✅ Responsive typography
- ✅ Theme-aware (light/dark)
- ✅ Accessible (keyboard navigation)
- ✅ Smooth animations

---

## Summary for CMS Team

**What to do:**
1. Add 'faqSection' block type to Pages collection schema (see Section 1)
2. Add the case statement to dynamic-page.tsx (see Section 3)
3. Test in CMS admin panel
4. Deploy and verify on staging

**What you get:**
- Two-level accordion FAQ system
- Automatic text color adaptation
- Category and question management
- Background color control
- Spacing controls
- Mobile responsive
- Accessible and keyboard friendly

---

Generated: 2025-01-12
Component Version: 1.0
Design System: xFlo v4
