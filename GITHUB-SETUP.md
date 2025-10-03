# 🔧 GitHub Storage Setup Guide

Your blog now uses **GitHub as a database** - completely free and serverless-friendly! Here's how to set it up:

## 📋 Prerequisites

- Your blog repository on GitHub
- A GitHub Personal Access Token

## 🔑 Step 1: Create GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name: `Blog CMS Token`
4. Set expiration: **No expiration** (or 1 year if you prefer)
5. Select these scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `public_repo` (Access public repositories) - if your repo is public

6. Click **"Generate token"**
7. **COPY THE TOKEN** - you won't see it again!

## 🌍 Step 2: Set Environment Variables

### For Local Development (.env.local)

Create or update your `.env.local` file:

```bash
# Existing variables
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret

# New GitHub variables
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=blog
```

### For Production (Vercel/Netlify)

Add these environment variables in your hosting platform:

**Vercel:**
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add each variable:
   - `GITHUB_TOKEN` = `ghp_your_token_here`
   - `GITHUB_REPO_OWNER` = `your-github-username`
   - `GITHUB_REPO_NAME` = `blog`

**Netlify:**
1. Go to Site settings → Environment variables
2. Add the same variables as above

## 📁 Step 3: Commit Your Data

Your posts have been migrated to `data/posts/` directory. Commit this to GitHub:

```bash
git add data/
git commit -m "Add migrated posts data for GitHub storage"
git push origin main
```

## 🚀 Step 4: Deploy

After setting environment variables, redeploy your site:

- **Vercel**: Automatic deployment on push
- **Netlify**: Automatic deployment on push

## ✅ Step 5: Test

1. Visit your blog - existing posts should still work
2. Go to `/admin` and try creating a new post
3. Check your GitHub repository - you should see new JSON files in `data/posts/`

## 🧹 Step 6: Cleanup (Optional)

Once everything works, you can delete the old `src/posts/` directory:

```bash
rm -rf src/posts/
git add -A
git commit -m "Remove old MDX posts directory"
git push origin main
```

## 🔒 Security Notes

- ✅ Your GitHub token has access only to your repositories
- ✅ Posts are stored as JSON in your own GitHub repo
- ✅ No external database or third-party service required
- ✅ Completely free forever

## 🆘 Troubleshooting

**Error: "GitHub API error: 401"**
- Check your `GITHUB_TOKEN` is correct
- Ensure token has `repo` permissions
- Verify token hasn't expired

**Error: "GitHub API error: 404"**
- Check `GITHUB_REPO_OWNER` and `GITHUB_REPO_NAME` are correct
- Ensure the repository exists and token has access

**Posts not showing up:**
- Check the `data/posts/` directory exists in your GitHub repo
- Verify JSON files are properly formatted
- Check browser console for errors

## 🎉 You're Done!

Your blog now uses GitHub as a free, serverless database. Every time you create a post, it's automatically saved to your GitHub repository!
