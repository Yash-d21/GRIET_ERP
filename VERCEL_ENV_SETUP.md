# Vercel Environment Variables Setup

## Required Environment Variables

Your application uses the following environment variable:

### 1. `VITE_GEMINI_API_KEY`
- **Purpose**: Google Gemini API key for the chatbot feature in Student Dashboard
- **Required**: Optional (chatbot will show error message if not set)
- **Get your API key**: https://aistudio.google.com/app/apikey

## How to Add Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to your project on Vercel**:
   - Visit [vercel.com](https://vercel.com) and sign in
   - Open your project: `GRIET_ERP`

2. **Navigate to Settings**:
   - Click on your project
   - Go to **Settings** tab (in the top navigation)
   - Click on **Environment Variables** (in the left sidebar)

3. **Add the variable**:
   - Click **Add New** button
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: Paste your Gemini API key here
   - **Environment**: Select all environments (Production, Preview, Development)
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **Save**

4. **Redeploy**:
   - After adding the environment variable, you need to redeploy
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**

### Method 2: Via Vercel CLI

```bash
# Set environment variable for production
vercel env ils корректное значение здесь
vercel env add VITE_GEMINI_API_KEY production

# Set for preview environments
vercel env add VITE_GEMINI_API_KEY preview

# Set for development
vercel env add VITE_GEMINI_API_KEY development
```

## How to Get Your Gemini API Key

1. **Visit Google AI Studio**:
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**:
   - Click **Create API Key** or **Get API key**
   - Select a Google Cloud project (or create a new one)
   - Copy the generated API key

3. **Security Note**: 
   - ⚠️ Never commit API keys to Git!
   - The `.gitignore` file already excludes `.env` files
   - Only add keys through Vercel dashboard or CLI

## What to Enter in Vercel

When adding the environment variable in Vercel, enter:

```
Key: VITE_GEMINI_API_KEY
Value: YOUR_ACTUAL_API_KEY_HERE
Environment: Production, Preview, Development (select all)
```

**Example**:
```
Key: VITE_GEMINI_API_KEY
Value: AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environment: ✅ Production, ✅ Preview, ✅ Development
```

## Verification

After deployment, test the chatbot feature:
1. Go to your deployed site
2. Login as a Student
3. Open the chatbot/help section
4. Send a message - it should work without errors

If you see an error message about API key not configured, double-check:
- The environment variable name is exactly `VITE_GEMINI_API_KEY`
- You've redeployed after adding the variable
- The API key is valid (not expired)

## Important Notes

- **Vite Prefix**: All environment variables in Vite must start with `VITE_` to be exposed to the client-side code
- **Client-Side**: This API key will be visible in the browser (client-side). For production apps, consider using a backend proxy
- **Free Tier**: Google Gemini API has a free tier with usage limits

## Optional: Backend Proxy (Future Enhancement)

For better security, consider creating a backend proxy API that:
- Keeps the API key server-side only
- Handles API requests from your frontend
- Provides rate limiting and better error handling

But for now, using `VITE_GEMINI_API_KEY` directly works fine for development and small-scale deployments.

