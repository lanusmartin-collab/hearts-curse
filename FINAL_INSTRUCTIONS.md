# Final Deployment Instructions

Great news! I found Git on your computer and **I have already initialized your project** for you.
You don't need to type any complex commands.

## Step 1: Create Repository on GitHub
1.  Go to [github.com/new](https://github.com/new).
2.  Repository name: `hearts-curse` (or similar).
3.  **Do not** check "Initialize with README", .gitignore, or license.
4.  Click **Create repository**.

## Step 2: Push your code
1.  Copy the commands GitHub shows you under **"…or push an existing repository from the command line"**.
2.  Open your VS Code terminal (Terminal -> New Terminal).
3.  Paste them and hit Enter. They look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/hearts-curse.git
git branch -M main
git push -u origin main
```

*(If `git` command still fails, **then** restart VS Code and try Step 2 again)*.

## Step 3: Put it online (Vercel)
1.  Go to [vercel.com/new](https://vercel.com/new).
2.  Click **Import** next to your new `hearts-curse` project.
3.  Click **Deploy**.
