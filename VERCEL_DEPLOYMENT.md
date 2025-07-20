# 🚀 Complete Vercel Deployment Guide

Deploy your entire Disease Diagnosis website (Frontend + Backend + Database) to Vercel in minutes!

## 🎯 What's Included

✅ **React Frontend** - Served as static files  
✅ **Django Backend** - Running as serverless functions  
✅ **SQLite Database** - Embedded with your application  
✅ **Disease Data** - Automatically loaded from CSV  
✅ **API Routes** - All endpoints working seamlessly  

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code needs to be in a GitHub repository
3. **Vercel CLI** (optional): `npm install -g vercel`

## 🚀 Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - Click "Deploy"

3. **Wait for deployment:**
   - Vercel will build both frontend and backend
   - Database will be initialized automatically
   - Your app will be live in 2-3 minutes!

### Method 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

## 🔧 Configuration Details

### **Files Added for Vercel:**

1. **`vercel.json`** - Main configuration file
2. **`disease_diagnosis_backend/settings_vercel.py`** - Vercel-specific Django settings
3. **`disease_diagnosis_backend/vercel_wsgi.py`** - Serverless function handler
4. **`requirements.txt`** - Python dependencies (root level)
5. **Environment files** - API URL configuration

### **How It Works:**

- **Frontend**: Built as static files and served by Vercel CDN
- **Backend**: Django runs as serverless functions
- **Database**: SQLite database created in `/tmp` directory
- **Data Loading**: CSV data automatically loaded on first request
- **Routing**: `/api/*` routes to Django, everything else to React

## 🌐 Your Live URLs

After deployment, you'll get:
- **Main App**: `https://your-project.vercel.app`
- **API Endpoints**: `https://your-project.vercel.app/api/`
- **Admin Panel**: `https://your-project.vercel.app/api/admin/`

## 🧪 Testing Your Deployment

1. **Frontend Test:**
   ```bash
   curl https://your-project.vercel.app
   ```

2. **Backend Test:**
   ```bash
   curl https://your-project.vercel.app/api/stats/
   ```

3. **Full Integration Test:**
   - Visit your Vercel URL
   - Try the symptom checker
   - Browse diseases
   - Check disease details

## ⚙️ Environment Variables (Optional)

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=.vercel.app
```

## 🔄 Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Rollback to previous versions anytime

## 📊 Monitoring & Analytics

Vercel provides:
- **Real-time logs** for debugging
- **Performance analytics** 
- **Function metrics**
- **Error tracking**

Access via: Vercel Dashboard → Your Project → Functions/Analytics

## 🐛 Troubleshooting

### **Common Issues:**

1. **Build Fails:**
   ```bash
   # Check build logs in Vercel dashboard
   # Ensure all dependencies are in requirements.txt
   ```

2. **API Not Working:**
   ```bash
   # Check function logs
   # Verify vercel.json routing configuration
   ```

3. **Database Empty:**
   ```bash
   # Check if CSV file is in backend directory
   # Verify vercel_wsgi.py initialization code
   ```

4. **CORS Errors:**
   ```bash
   # Check CORS_ALLOWED_ORIGINS in settings_vercel.py
   # Ensure frontend is using correct API URL
   ```

### **Debug Commands:**

```bash
# Local testing
vercel dev

# Check logs
vercel logs

# Redeploy
vercel --prod --force
```

## 🔒 Security Notes

- SQLite database is ephemeral (resets on function restart)
- For production, consider upgrading to PostgreSQL
- Add proper SECRET_KEY in environment variables
- Enable HTTPS (automatic with Vercel)

## 💡 Performance Tips

1. **Cold Starts**: First request may be slower (serverless functions)
2. **Caching**: Vercel automatically caches static assets
3. **Database**: Consider external database for high traffic
4. **Monitoring**: Use Vercel Analytics for insights

## 🎉 Success!

Your Disease Diagnosis website is now live on Vercel with:
- ⚡ Lightning-fast global CDN
- 🔄 Automatic deployments
- 📊 Built-in analytics
- 🔒 HTTPS by default
- 🌍 Global edge network

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status**: [vercel-status.com](https://vercel-status.com)

---

**Your app is now live and accessible worldwide! 🌍**

Share your Vercel URL and let users explore diseases and check symptoms instantly!
