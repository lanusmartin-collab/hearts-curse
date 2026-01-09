# Zero-Jargon Deployment Guide

I have successfully prepared your files. You just need to get them online.

## Step 1: Restart VS Code (Crucial!)
1.  **Close this window** (Visual Studio Code).
    *   *Click the X in the top right corner.*
2.  **Open Visual Studio Code** again.
    *   *You don't need to run "npm run dev". Just open the editor.*
    *   *This makes sure VS Code sees the "git" tool I just installed.*

## Step 2: Create the Website Container (GitHub)
1.  Click this link: [https://github.com/new](https://github.com/new)
2.  **Repository name**: Type `hearts-curse`
3.  Scroll down and click the green **Create repository** button.
4.  Keep that page open!

## Step 3: Send Your Files (Push)
1.  Back in VS Code, look at the **Left Sidebar**.
2.  Click the icon that looks like a **Tree Branch** (Source Control).
3.  Click the **3 dots (...)** at the top of that sidebar pane.
4.  Select **Remote** -> **Add Remote...**
5.  Paste the URL of your new GitHub repo (it looks like `https://github.com/YOUR_USER/hearts-curse.git`).
6.  Type `origin` and press Enter.
7.  Now click the big blue **Publish Branch** (or Sync Changes) button.
    *   *If asked to sign in, say yes.*

## Step 4: Go Live (Vercel)
1.  Go to [https://vercel.com/new](https://vercel.com/new)
2.  You should see `hearts-curse` in the list. Click **Import**.
3.  Click **Deploy**.
