# Deployment Guide for "Heart's Curse" Web App

This guide explains how to deploy the application to Vercel.

## Prerequisites

1.  **Install Git**:
    *   Git was not detected on your system. Please download and install it from [git-scm.com](https://git-scm.com/downloads).
    *   During installation, ensure you select the option to add Git to your PATH.
    *   After installation, restart your terminal/VS Code and verify by running `git --version`.

2.  **GitHub Account**:
    *   Ensure you have a [GitHub](https://github.com/) account.

3.  **Vercel Account**:
    *   Ensure you have a [Vercel](https://vercel.com/signup) account (can sign up with GitHub).

## Step 1: Initialize Version Control

Once Git is installed, open a terminal in the `web-app` directory (`d:\D&D\Campaign\Heart's Curse\web-app`) and run:

```bash
# Initialize a new git repository
git init

# Stage all files
git add .

# Commit the files
git commit -m "Initial commit"
```

## Step 2: Push to GitHub

1.  Create a new repository on GitHub (do not add README/gitignore/license templates).
2.  Follow the instructions showed by GitHub to push an existing repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Import"** next to your GitHub repository.
4.  In the "Configure Project" screen:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: Ensure it is set to `web-app` if your repo root is different, or leave default if you pushed the `web-app` content as the root.
    *   **Build Command**: `next build` (default).
    *   **Output Directory**: `.next` (default).
    *   **Install Command**: `npm install` (default).
5.  Click **"Deploy"**.

## Troubleshooting

-   **Build Failures**: If the build fails on Vercel, check the "Build Logs" in the deployment details. 
-   **Local Build Issues**: The local environment had issues building the project (`npm run build` failed). Vercel uses a clean Linux environment which might resolve local pathing issues.
