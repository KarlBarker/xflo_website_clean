# Blog/Insights CMS Setup Instructions

## Overview
The frontend blog functionality is ready at `/insights` route. The backend team needs to create two collections in Payload CMS to enable blog functionality.

## CMS Location
- **Admin Panel**: https://xflocms.vercel.app/admin
- **API Endpoint**: https://xflocms.vercel.app/api

## Required Collections

### 1. Blog Categories Collection (`blog-categories`)

**Collection Name**: `blog-categories`

**Fields**:
```typescript
{
  name: string;          // Required - Category display name (e.g., "AI Transformation")
  slug: string;          // Required - URL-friendly slug (e.g., "ai-transformation")
  description?: string;  // Optional - Category description
}
```

**Example Categories to Create**:
- AI Transformation (slug: `ai-transformation`)
- Business Automation (slug: `business-automation`)
- Case Studies (slug: `case-studies`)
- Industry Insights (slug: `industry-insights`)
- Technology (slug: `technology`)

---

### 2. Blog Posts Collection (`blog-posts`)

**Collection Name**: `blog-posts`

**Fields**:
```typescript
{
  title: string;                    // Required - Post title
  slug: string;                     // Required - URL-friendly slug
  excerpt: string;                  // Required - Short description (150-200 chars)
  description?: string;             // Optional - Longer description for SEO
  content: RichText (Lexical);      // Required - Main blog content (Lexical editor)
  featuredImage: Media;             // Required - Featured image (relationship to media collection)
  category: Relationship;           // Required - Relationship to blog-categories
  author: {                         // Required - Author information
    id: string;
    name: string;
    avatar?: Media;                 // Optional - Author avatar image
  };
  publishedAt: Date;                // Required - Publication date
  status: 'draft' | 'published';   // Required - Publication status
  readTime?: number;                // Optional - Reading time in minutes (can be auto-calculated)
  tags?: string[];                  // Optional - Array of tag strings
}
```

**Field Configuration Details**:

1. **title** (Text field)
   - Required: Yes
   - Label: "Title"

2. **slug** (Text field)
   - Required: Yes
   - Label: "Slug"
   - Format hook: Auto-generate from title (kebab-case)
   - Index: Yes (for searching)

3. **excerpt** (Textarea)
   - Required: Yes
   - Label: "Excerpt"
   - Max length: 250 characters

4. **description** (Textarea)
   - Required: No
   - Label: "SEO Description"
   - Max length: 160 characters

5. **content** (Rich Text - Lexical)
   - Required: Yes
   - Label: "Content"
   - Editor: Lexical (supports paragraphs, headings, lists, links, images, etc.)

6. **featuredImage** (Upload/Relationship)
   - Required: Yes
   - Label: "Featured Image"
   - Relationship: media collection
   - Recommended size: 1600x900px

7. **category** (Relationship)
   - Required: Yes
   - Label: "Category"
   - Relationship: blog-categories collection
   - Has Many: false (single category)

8. **author** (Group)
   - Required: Yes
   - Label: "Author"
   - Fields:
     - name (Text, required)
     - avatar (Upload/Relationship to media, optional)

9. **publishedAt** (Date)
   - Required: Yes
   - Label: "Published Date"
   - Default: Current date/time

10. **status** (Select)
    - Required: Yes
    - Label: "Status"
    - Options:
      - `draft` (Default)
      - `published`

11. **readTime** (Number)
    - Required: No
    - Label: "Read Time (minutes)"
    - Default: Auto-calculate from content

12. **tags** (Array of Text)
    - Required: No
    - Label: "Tags"

---

## Frontend API Calls

The frontend makes these API calls:

### Get All Blog Posts
```
GET https://xflocms.vercel.app/api/blog-posts?where[status][equals]=published&limit=50&sort=-published_at
```

### Get Single Blog Post by Slug
```
GET https://xflocms.vercel.app/api/blog-posts?where[slug][equals]={slug}&where[status][equals]=published&limit=1
```

### Get All Categories
```
GET https://xflocms.vercel.app/api/blog-categories?sort=name&limit=100
```

---

## Testing Steps

Once collections are created:

1. **Create Test Categories**:
   - Go to Admin Panel → Blog Categories
   - Create 3-5 categories (see example categories above)

2. **Create Test Blog Posts**:
   - Go to Admin Panel → Blog Posts
   - Create 3-5 test posts with:
     - Title and slug
     - Excerpt (short description)
     - Featured image
     - Category assignment
     - Author name
     - Published status
     - Rich content with headings, paragraphs, images

3. **Verify Frontend**:
   - Visit: https://xflo.agency/insights
   - Should see blog posts in a grid layout
   - Click on a post to view: https://xflo.agency/insights/{slug}
   - Verify all fields display correctly

---

## Current Frontend Status

✅ **Ready**:
- Blog listing page at `/insights`
- Individual blog post pages at `/insights/[slug]`
- Responsive design with xFlo branding
- Category filtering
- Search functionality
- Mock data fallback (for development)

⚠️ **Waiting on Backend**:
- `blog-categories` collection
- `blog-posts` collection
- Test content to display

---

## Example Test Blog Post

**Title**: "How AI is Transforming Business Operations in 2025"

**Slug**: `ai-transforming-business-2025`

**Excerpt**: "Discover how artificial intelligence is revolutionizing the way businesses operate, from automation to predictive analytics and beyond."

**Category**: AI Transformation

**Author**:
- Name: "xFlo Team"
- Avatar: [Upload company logo or team photo]

**Published Date**: Today's date

**Status**: Published

**Content**: [Write 3-4 paragraphs about AI transformation with headings]

---

## Questions?

Contact the frontend team if:
- Field configurations need adjustment
- API endpoints need modification
- Additional features are needed

---

## Frontend Configuration

The frontend expects:
- CMS API at: `https://xflocms.vercel.app/api`
- Collections: `blog-posts` and `blog-categories`
- All fields as specified above
- Media collection for images
