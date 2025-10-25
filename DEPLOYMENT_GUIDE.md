# 🚀 GitHub Pages Deployment Guide - Step by Step

## ❌ Current Problem
You're getting this error:
```
GET https://himanshugarg583.github.io/src/main.jsx net::ERR_ABORTED 404
```

**Why?** Because you uploaded SOURCE CODE (src folder) instead of BUILT FILES (dist folder).

---

## ✅ Solution: Upload ONLY dist folder contents

### 📋 Prerequisites
- Build is already done ✅ (you have dist folder)
- HashRouter configured ✅
- vite.config.js configured ✅

---

## 🎯 Deployment Steps (Choose ONE method)

### Method 1: Using Git Bash (If Git is installed)

1. Open **Git Bash** (NOT PowerShell)

2. Navigate to your project:
   ```bash
   cd "C:\Users\Dell\Desktop\Ecommerce-Application-main\ecommece-vegi-react"
   ```

3. Run deployment:
   ```bash
   npm run deploy
   ```

4. Done! Wait 2-3 minutes and visit:
   ```
   https://himanshugarg583.github.io/ecommerce-vegi-react/#/
   ```

---

### Method 2: Manual Upload via GitHub (No Git required)

#### Step 1: Go to Your GitHub Repository
Visit: `https://github.com/himanshugarg583/ecommerce-vegi-react`

#### Step 2: Create gh-pages branch

1. Click on **Branch dropdown** (shows "main" by default)
2. Type: `gh-pages`
3. Click "Create branch: gh-pages"

#### Step 3: Switch to gh-pages branch

1. Make sure you're on `gh-pages` branch (check dropdown)
2. **Delete ALL existing files** in this branch (if any)

#### Step 4: Upload dist folder contents

1. Click **Add file** → **Upload files**

2. From your computer, go to:
   ```
   C:\Users\Dell\Desktop\Ecommerce-Application-main\ecommece-vegi-react\dist
   ```

3. **Select ALL files and folders** inside dist:
   - index.html
   - 404.html
   - assets folder
   - images folder
   - logo.png
   - logo.webp
   - logo2.png
   - storeLogo.png
   - map-overlay.png
   - robots.txt
   - sitemap.xml
   - 22870.jpg

4. **Drag and drop** them to GitHub (or click "choose your files")

5. Scroll down, add commit message: "Deploy built files"

6. Click **Commit changes**

#### Step 5: Configure GitHub Pages

1. Go to **Settings** → **Pages** (left sidebar)

2. Under **Source**:
   - Branch: Select `gh-pages`
   - Folder: Select `/ (root)`
   - Click **Save**

3. GitHub will show:
   ```
   Your site is ready to be published at https://himanshugarg583.github.io/ecommerce-vegi-react/
   ```

#### Step 6: Wait and Visit

1. Wait **2-3 minutes** for deployment
2. Visit: `https://himanshugarg583.github.io/ecommerce-vegi-react/#/`
3. ✅ No more 404 errors!

---

### Method 3: Fix Git PATH (For future deployments)

#### Install Git (if not installed)
Download from: https://git-scm.com/download/win

#### Add Git to PATH

1. Press `Win + R`
2. Type: `sysdm.cpl` and press Enter
3. Go to **Advanced** tab → **Environment Variables**
4. Under **System variables**, find **Path**
5. Click **Edit** → **New**
6. Add: `C:\Program Files\Git\bin`
7. Click **OK** on all windows
8. **Restart PowerShell**

#### Test Git

Open NEW PowerShell and run:
```powershell
git --version
```

If it shows version, Git is ready!

#### Deploy

```powershell
npm run deploy
```

---

## 🎯 Quick Checklist

- [ ] Built project (`npm run build`)
- [ ] dist folder exists with files
- [ ] Uploaded ONLY dist folder contents (not src folder)
- [ ] Created gh-pages branch
- [ ] Configured GitHub Pages settings
- [ ] Waited 2-3 minutes
- [ ] Visited site with `#/` in URL

---

## 🔍 How to Verify Correct Upload

Visit your repository's gh-pages branch:
```
https://github.com/himanshugarg583/ecommerce-vegi-react/tree/gh-pages
```

**✅ Should see:**
- index.html
- 404.html
- assets/
- images/

**❌ Should NOT see:**
- src/
- node_modules/
- package.json
- vite.config.js

---

## 📱 Final URLs (with Hash Router)

Your site will work at:
- Home: `https://himanshugarg583.github.io/ecommerce-vegi-react/#/`
- Products: `https://himanshugarg583.github.io/ecommerce-vegi-react/#/products`
- Cart: `https://himanshugarg583.github.io/ecommerce-vegi-react/#/cart`

**Note:** The `#/` is important - it's how HashRouter works on GitHub Pages!

---

## ⚠️ Common Mistakes

1. ❌ Uploading src folder → ✅ Upload dist folder only
2. ❌ Using main branch → ✅ Use gh-pages branch
3. ❌ Uploading package.json → ✅ Upload only built files
4. ❌ Not waiting 2-3 min → ✅ GitHub needs time to deploy
5. ❌ Visiting without `#/` → ✅ Use `/#/` in URL

---

## 🆘 Still Getting Errors?

### Clear Browser Cache
Press: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Check GitHub Actions
Repository → Actions tab → Look for any errors

### Verify dist folder
Run locally:
```powershell
npm run build
npm run preview
```

Visit `http://localhost:4173/ecommerce-vegi-react/` - if it works, deployment will work!

---

## ✅ Success Indicators

1. No 404 errors in browser console
2. Page loads with content
3. Navigation works (Home, Products, Cart)
4. Images load properly

Happy Deploying! 🚀
