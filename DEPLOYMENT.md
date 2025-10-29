# Deployment Guide: Git + Vercel

## Step 1: Initialize Git Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   ```

2. **Add all files to staging**:
   ```bash
   git add .
   ```

3. **Create your first commit**:
   ```bash
   git commit -m "Initial commit"
   ```

4. **Create a GitHub repository**:
   - Go to [GitHub](https://github.com) and create a new repository
   - Do NOT initialize it with README, .gitignore, or license
   - Copy the repository URL

5. **Add remote and push**:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   - Make sure all your code is committed and pushed to GitHub

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account

3. **Import Project**:
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

4. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `griet_ecap` (if your repo root is the ERP folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live!

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy** (from the griet_ecap directory):
   ```bash
   cd griet_ecap
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new one
   - Confirm settings

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

## Important Notes

- **Environment Variables**: If you need environment variables, add them in Vercel dashboard under Project Settings → Environment Variables
- **Build Command**: Vercel should auto-detect Vite, but ensure build command is `npm run build`
- **Output Directory**: Should be `dist` for Vite projects
- **Root Directory**: If your repository root is the parent `ERP` folder, set root directory to `griet_ecap` in Vercel settings

## Automatic Deployments

Once connected, Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches (creates preview deployments)

## Troubleshooting

- If build fails, check the build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Ensure TypeScript compiles without errors (`npm run build` should work locally)

