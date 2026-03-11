# AIPulse Deployment Guide

## Recommended Stack: Vercel + Supabase

Both services offer generous free tiers to get you started.

---

## 1. Supabase Setup (Backend/Auth/Database)

Already done! Your Supabase project is configured with:
- Authentication (Email + Google OAuth)
- `profiles` table with RLS policies
- Automatic profile creation trigger

### Required: Configure Redirect URLs

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project → Authentication → URL Configuration
3. Add your production domain to **Redirect URLs**:
   ```
   https://your-app.vercel.app/**
   ```
4. Set **Site URL** to:
   ```
   https://your-app.vercel.app
   ```

### Required: Enable Google OAuth (if not done)

1. Authentication → Providers → Google → Enable
2. Add your Google OAuth credentials
3. Add redirect URL:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

---

## 2. Vercel Setup (Frontend)

### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts - link to existing project or create new
```

### Option B: Deploy via GitHub (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your repository
4. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add environment variables (see below)
6. Deploy!

---

## 3. Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important:** Must be added to **Production**, **Preview**, and **Development** environments.

---

## 4. Custom Domain (Optional)

1. Vercel Dashboard → Domains
2. Add your domain (e.g., `aipulse.app`)
3. Follow DNS configuration instructions
4. Update Supabase redirect URLs with your custom domain

---

## 5. Post-Deployment Checklist

- [ ] Test sign-up flow
- [ ] Test sign-in flow  
- [ ] Test Google OAuth
- [ ] Verify profiles are created in Supabase
- [ ] Test dark mode toggle
- [ ] Verify all API calls work
- [ ] Check console for errors

---

## Troubleshooting

### "Authentication failed" errors
- Check environment variables are set correctly in Vercel
- Verify redirect URLs in Supabase match your domain

### "Profile not created" after signup
- Check Supabase SQL Editor → run `SELECT * FROM profiles;`
- Verify trigger function exists: `handle_new_user()`

### Build fails
```bash
# Test build locally
npm run build
npm run preview
```

### CORS errors
- Supabase → Settings → API → Check CORS origins include your domain

---

## Architecture

```
┌─────────────────┐      ┌──────────────────┐
│   Vercel        │      │   Supabase       │
│   (Frontend)    │─────▶│   • Auth         │
│   React + Vite  │      │   • Database     │
│   Static Build  │◀─────│   • RLS Policies │
└─────────────────┘      └──────────────────┘
```

Both scale automatically. Vercel handles CDN + edge distribution. Supabase handles auth + Postgres.
