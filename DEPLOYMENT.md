# xFlo Website - Branch & Environment Strategy

## Branch Structure

### `local` - Local Development
- **Purpose**: Local development with empty/test database
- **CMS**: `http://localhost:3001` (local Payload CMS)
- **Database**: Local Supabase instance
- **Env File**: `.env.local`
- **Usage**: Feature development, testing, experimentation

### `staging` - Staging Environment
- **Purpose**: Pre-production testing with real content
- **CMS**: `https://staging.cms.xflo.ai`
- **Database**: Staging Supabase instance
- **Env File**: `.env.staging`
- **Deployment**: Vercel (auto-deploy from staging branch)
- **Usage**: Client review, QA testing, final checks

### `main` - Production (TBD)
- **Purpose**: Live production website
- **CMS**: Production CMS (to be configured)
- **Database**: Production Supabase instance
- **Env File**: `.env.production`
- **Deployment**: Vercel (auto-deploy from main branch)
- **Usage**: Live site at xflo.agency

## Environment Files

### `.env` (Shared - Git Ignored)
Contains shared variables across all environments:
- `GITHUB_PAT` - GitHub Personal Access Token for MCP

### `.env.local` (Git Ignored)
Local development CMS configuration:
```env
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3001/api
CMS_ADMIN_ORIGIN=http://localhost:3001
NEXT_PUBLIC_XFLO_API_URL=http://localhost:3001/api
```

### `.env.staging` (Git Ignored)
Staging environment CMS configuration:
```env
NEXT_PUBLIC_PAYLOAD_URL=https://staging.cms.xflo.ai/api
CMS_ADMIN_ORIGIN=https://staging.cms.xflo.ai
NEXT_PUBLIC_XFLO_API_URL=https://staging.cms.xflo.ai/api
```

### `.env.production` (Git Ignored - To Be Created)
Production environment CMS configuration (TBD)

## Development Workflow

### Local Development
1. Ensure local CMS is running on port 3001
2. Checkout `local` branch: `git checkout local`
3. Run dev server: `npm run dev` (uses `.env.local`)
4. Access at: `http://localhost:3002`

### Staging Deployment
1. Merge changes to `staging` branch
2. Push to GitHub: `git push origin staging`
3. Vercel auto-deploys from `staging` branch
4. Uses `.env.staging` configuration

### Production Deployment (Future)
1. Merge `staging` → `main` after QA approval
2. Push to GitHub: `git push origin main`
3. Vercel auto-deploys from `main` branch
4. Uses `.env.production` configuration

## CMS Architecture

### Local CMS
- **Port**: 3001
- **Database**: Local Supabase
- **Status**: Empty (accidentally deleted)
- **Needs**: Data seeding or manual content creation

### Staging CMS
- **URL**: https://staging.cms.xflo.ai
- **Database**: Staging Supabase
- **Status**: Live with content
- **Branch**: `staging` in CMS repo

### Production CMS (TBD)
- **Database**: Production Supabase
- **Branch**: `main` in CMS repo

## Important Notes

- **All `.env*` files are git-ignored** for security
- **Never commit sensitive credentials** to the repository
- **Use `.env.local` automatically loads** in Next.js local development
- **Vercel deployment** uses environment variables configured in Vercel dashboard
- **Each branch** should point to its corresponding CMS environment
