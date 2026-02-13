# Deployment Guide - Web Technology Lab Works

This guide will help you deploy the Web Technology Lab Works application to Render.com so students can access it online.

## Prerequisites

- GitHub account (free at github.com)
- Render.com account (free at render.com)
- Web browser (that's it! No installations needed)

## Step 1: Push Your Project to GitHub

### 1.1 Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (create account if needed)
2. Click the **+** icon (top right) → **New repository**
3. Name it: `web-technology-lab-works`
4. Add description: `File upload/download system for students`
5. Click **Create repository**

### 1.2 Upload Project to GitHub (Using Web Browser - No Installation Required)

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Name it: `web-technology-lab-works`
4. Click **Create repository**
5. On the new repository page, click **uploading an existing file**
6. You'll see a file upload area - drag and drop all files from your project folder:
   - `server.js`
   - `package.json`
   - `Procfile`
   - `render.yaml`
   - `README.md`
   - `public/` folder (upload the entire folder)
   - `uploads/` folder (upload the entire folder)
7. Add commit message: `Initial commit: Web Technology Lab Works`
8. Click **Commit changes**

Your project is now on GitHub! No installations needed.

## Step 2: Deploy to Render.com

### 2.1 Connect Your GitHub to Render

1. Go to [render.com](https://render.com) and sign up (free)
2. Click **New +** → **Web Service**
3. Click **Connect a repository**
4. Search for `web-technology-lab-works`
5. Click **Connect** next to your repository

### 2.2 Configure Deployment

You have two options:

#### Option A: Use render.yaml (Recommended)
Since your project already has a `render.yaml` file, Render will automatically detect and use it. Just click **Connect** and skip to Step 2.3. The configuration is already set.

#### Option B: Manual Configuration via Web Interface
Fill in the deployment settings:

- **Name**: `web-technology-lab-works`
- **Runtime**: Select **Node**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Select **Free**

Under **Environment Variables**, add:
- **KEY**: `NODE_ENV`
- **VALUE**: `production`

**Important**: If using Option B, make sure to **delete the `render.yaml` file** from your GitHub repository to avoid conflicts.

### 2.3 Deploy

1. Click **Create Web Service**
2. Wait for deployment (2-3 minutes)
3. Once deployed, you'll see your app URL like: `https://web-technology-lab-works.onrender.com`

## Step 3: Share with Students

Copy the URL provided by Render and share it with students. They can now:

1. Create lab folders
2. Upload files via drag-and-drop
3. Download files and folders as ZIP
4. Manage their lab work

Example URL: `https://web-technology-lab-works.onrender.com`

## Important Notes

### File Storage on Render

**Free tier limitation**: Render.com uses ephemeral storage, which means files are deleted when the service restarts (approximately every 15 minutes of inactivity).

**For persistent storage**, you have options:

1. **Use Render Disk** (paid feature)
2. **Use Cloud Storage** (AWS S3, Google Cloud Storage, Azure Blob)
3. **Use a Database** (MongoDB, PostgreSQL)

### For Production/Class Use

If you need files to persist, I recommend:

- **Option A**: Upgrade to a paid Render instance with persistent disk
- **Option B**: Deploy to a different platform like Railway.app (has better free tier limits)
- **Option C**: Use a VPS like DigitalOcean ($4-5/month)

## Updating Your Deployment

After making code changes:

```bash
git add .
git commit -m "Your changes description"
git push origin main
```

Render automatically redeploys on every push to GitHub!

## Troubleshooting

### Files disappearing after a while
This is normal on Render's free tier. Upgrade to persistent storage or switch platforms.

### Build fails
- Check that package.json is correct
- Ensure all dependencies are listed
- Check the build logs on Render's dashboard

### App won't start
- Check the console logs in Render dashboard
- Verify NODE_ENV is not preventing startup
- Ensure the PORT environment variable is being used

### Build fails with "command not found" error
- Make sure you're using **either** `render.yaml` **or** manual web configuration, not both
- If `render.yaml` exists in your repository, Render will use it automatically
- Delete `render.yaml` if you want to configure manually via Render's web interface

## Alternative Platforms

If Render doesn't work for you, try:

- **Railway.app** - Free credits, similar setup
- **Replit** - Easiest, integrated IDE
- **Heroku** - Eco plan ($5+/month, but free tier ended)
- **Fly.io** - Free tier with persistent storage options
- **Azure** - Free $200 credit for students

## Support

For more help on Render deployment, visit their documentation:
https://docs.render.com

---

**Welcome to cloud deployment!** 🚀 Your students can now access the lab works system from anywhere!
