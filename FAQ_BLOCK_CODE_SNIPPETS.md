# FAQ Block - Code Snippets for CMS Integration

This file contains exact code snippets to add to your existing files.

---

## 1. Add to `/src/lib/payload.ts`

Add this interface with your other block interfaces:

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

---

## 2. Add to `/src/components/layouts/dynamic-page.tsx`

### Import statement (add with other imports at top of file):

```typescript
import { FAQSection } from '@/components/blocks/faq-section';
```

### Case statement (add in your renderBlock switch/case):

```typescript
case 'faqSection':
  const { topClass: faqTopClass, bottomClass: faqBottomClass } = getSpacingClasses(
    block.spacingTop,
    block.spacingBottom
  );

  // Map background colors to design system classes
  const faqBgClass = block.backgroundColor === 'primary'
    ? 'bg-surface-primary'
    : block.backgroundColor === 'light-gray'
      ? 'bg-surface-tertiary'
      : 'bg-surface-light';

  // Determine nav theme based on background
  const faqNavTheme = block.backgroundColor === 'primary' ? 'dark' : 'light';

  return (
    <div
      key={key}
      className={`${faqTopClass} ${faqBottomClass} ${faqBgClass}`}
      data-nav-theme={faqNavTheme}
    >
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

## 3. Payload CMS Collection Schema

Add this to your Pages collection's flexible blocks:

```javascript
{
  slug: 'faqSection',
  labels: {
    singular: 'FAQ Section',
    plural: 'FAQ Sections'
  },
  fields: [
    // Title
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Frequently Asked Questions',
      admin: {
        description: 'Main heading for the FAQ section'
      }
    },

    // Subtitle
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
      required: true,
      options: [
        {
          label: 'White Background',
          value: 'white'
        },
        {
          label: 'Light Gray Background',
          value: 'light-gray'
        },
        {
          label: 'Dark Background (Primary)',
          value: 'primary'
        }
      ],
      admin: {
        description: 'Background color - text automatically adapts (black on white, white on dark)'
      }
    },

    // Categories array
    {
      name: 'categories',
      type: 'array',
      label: 'FAQ Categories',
      minRows: 1,
      required: true,
      admin: {
        description: 'Add categories of questions. First category will be expanded by default.',
        initCollapsed: false
      },
      fields: [
        // Category name
        {
          name: 'category',
          type: 'text',
          label: 'Category Name',
          required: true,
          admin: {
            description: 'Category heading (e.g., "Platform & Technology", "Pricing & Investment")',
            placeholder: 'Enter category name'
          }
        },

        // Questions array
        {
          name: 'items',
          type: 'array',
          label: 'Questions & Answers',
          minRows: 1,
          required: true,
          admin: {
            description: 'Add questions and answers for this category',
            initCollapsed: true
          },
          fields: [
            {
              name: 'question',
              type: 'text',
              label: 'Question',
              required: true,
              admin: {
                description: 'The question text',
                placeholder: 'What is...'
              }
            },
            {
              name: 'answer',
              type: 'textarea',
              label: 'Answer',
              required: true,
              admin: {
                description: 'The answer text (line breaks are preserved)',
                placeholder: 'Enter your answer here...',
                rows: 4
              }
            }
          ]
        }
      ]
    },

    // Spacing Top
    {
      name: 'spacingTop',
      type: 'select',
      label: 'Spacing Above Block',
      defaultValue: 'section',
      options: [
        { label: 'None (0px)', value: 'none' },
        { label: 'Tight (8px)', value: 'tight' },
        { label: 'Compact (16px)', value: 'compact' },
        { label: 'Element (24px)', value: 'element' },
        { label: 'Component (48px)', value: 'component' },
        { label: 'Section (96px)', value: 'section' }
      ],
      admin: {
        description: 'Vertical spacing above this block'
      }
    },

    // Spacing Bottom
    {
      name: 'spacingBottom',
      type: 'select',
      label: 'Spacing Below Block',
      defaultValue: 'section',
      options: [
        { label: 'None (0px)', value: 'none' },
        { label: 'Tight (8px)', value: 'tight' },
        { label: 'Compact (16px)', value: 'compact' },
        { label: 'Element (24px)', value: 'element' },
        { label: 'Component (48px)', value: 'component' },
        { label: 'Section (96px)', value: 'section' }
      ],
      admin: {
        description: 'Vertical spacing below this block'
      }
    }
  ]
}
```

---

## 4. Example Test Data

Use this JSON to test the block in your CMS:

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
      "category": "Platform & Technology",
      "items": [
        {
          "question": "What exactly is xFlo.ai?",
          "answer": "xFlo.ai is an AI software platform that combines advanced data processing (RAG), intelligent automation (Agents), and seamless integrations (MCP) with hands-on partnership to transform how SMBs operate. We provide both the technology infrastructure and the expertise to ensure successful AI implementation."
        },
        {
          "question": "How is xFlo different from ChatGPT or Claude for business?",
          "answer": "While ChatGPT and Claude provide raw AI capabilities, xFlo delivers a complete business solution with enterprise-grade security, compliance controls, cost optimization, custom integrations to your existing tools, and dedicated support. We handle the complex implementation so you can focus on results."
        },
        {
          "question": "Do I need technical expertise to use xFlo?",
          "answer": "No. While xFlo is built on sophisticated technology, we handle all technical complexity. Your team interacts with simple, intuitive interfaces. We provide full training and ongoing support to ensure everyone can leverage the platform effectively."
        }
      ]
    },
    {
      "category": "Pricing & Investment",
      "items": [
        {
          "question": "How much does xFlo cost?",
          "answer": "Platform access starts at £500/month, with implementation packages from £25,000-250,000 depending on scope. Most SMBs start with a £50,000 pilot that delivers clear ROI, then expand based on success. All pricing is transparent with no hidden fees."
        },
        {
          "question": "What's included in the platform fee?",
          "answer": "Platform fees include core infrastructure, pre-built agents and templates, standard integrations, regular updates, and basic support. Implementation packages include customization, training, and success management. Usage-based costs for AI processing are additional but typically £500-2,000/month."
        }
      ]
    }
  ]
}
```

---

## 5. Quick Integration Checklist

- [ ] Add `FAQSectionBlock` interface to `/src/lib/payload.ts`
- [ ] Import `FAQSection` component in `/src/components/layouts/dynamic-page.tsx`
- [ ] Add `case 'faqSection':` to dynamic page renderer
- [ ] Add FAQ block schema to Payload CMS Pages collection
- [ ] Deploy CMS changes
- [ ] Test creating FAQ block in CMS admin
- [ ] Test FAQ block displays on a page
- [ ] Verify first category opens by default
- [ ] Test background color changes (white/dark/light-gray)
- [ ] Verify text colors adapt automatically
- [ ] Test on mobile devices
- [ ] Delete demo files once confirmed working

---

## 6. Existing Demo Files (Can Delete After Integration)

Once the CMS integration is working, you can safely delete:

```bash
# Demo data (hardcoded FAQs)
/src/data/faq-data.ts

# Demo page (standalone FAQ page)
/src/app/faq-demo/page.tsx
```

The FAQ component itself stays:
```bash
# Keep this file - it's the actual component
/src/components/blocks/faq-section.tsx
```

---

Generated: 2025-01-12
