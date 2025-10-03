# 🚀 Deployment Guide

## Security First! 🔐

Your blog is designed to be secure by default. **Never commit passwords to GitHub!**

## Local Development

Your password is stored in `.env.local` which is:
- ✅ Safe (not in Git)
- ✅ Local only
- ✅ Never shared

## Deploying to Production

### Option 1: Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add secure blog with authentication"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-deploy

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     ADMIN_PASSWORD=your-secure-password-here
     JWT_SECRET=your-jwt-secret-here
     GITHUB_TOKEN=your-github-token-here
     GITHUB_REPO_OWNER=your-github-username
     GITHUB_REPO_NAME=blog
     ```
   - Redeploy your site

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`

3. **Set Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add the same variables as above:
     ```
     ADMIN_PASSWORD=your-secure-password-here
     JWT_SECRET=your-jwt-secret-here
     GITHUB_TOKEN=your-github-token-here
     GITHUB_REPO_OWNER=your-github-username
     GITHUB_REPO_NAME=blog
     ```

## 🔒 Security Checklist

- ✅ `.env.local` is in `.gitignore`
- ✅ No passwords in your code
- ✅ Environment variables for production
- ✅ HTTPS enabled (automatic on Vercel/Netlify)

## 🎯 Your Credentials

**Local Development:**
- Username: `admin`
- Password: `admin123` (change this in `.env.local`)

**Production:**
- Username: `admin`
- Password: Whatever you set in environment variables

## 🚨 Important Notes

1. **Change Default Password**: Update `ADMIN_PASSWORD` in `.env.local`
2. **Generate JWT Secret**: Use `openssl rand -base64 32` for production
3. **Never Share**: Keep your `.env.local` file private
4. **Production Secrets**: Use strong, unique passwords for production

## 🔧 GitHub Storage Setup

Your blog now uses GitHub as a free database! See `GITHUB-SETUP.md` for detailed instructions on:
- Creating a GitHub Personal Access Token
- Setting up environment variables
- Migrating existing posts

## 🎉 You're Secure!

Your blog is now:
- ✅ Password protected
- ✅ Safe for GitHub
- ✅ Ready for deployment
- ✅ Production ready
- ✅ Uses free GitHub storage (no database costs!)
