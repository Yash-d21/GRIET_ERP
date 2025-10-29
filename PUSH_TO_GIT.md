# Quick Push Instructions

Your code has been committed! Now follow these steps to push to GitHub:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → info New repository"
3. Name it (e.g., `griet-erp` or `griet-ecap`)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

## Step 2: Push Your Code

Run these commands (replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/griet-erp.git
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## That's it! 🎉

Once pushed, you can:
- View your code on GitHub
- Deploy to Vercel (see DEPLOYMENT.md)
- Share with your team

---

**Note:** If GitHub asks for credentials, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys for easier authentication

