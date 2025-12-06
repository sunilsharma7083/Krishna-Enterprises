# 🌐 Deployment Guide - Krishna Enterprises

Complete guide to deploy your trophy e-commerce platform to the internet.

---

## 🎯 Deployment Options Comparison

| Platform | Difficulty | Cost | MongoDB | Best For |
|----------|-----------|------|---------|----------|
| **Render.com** | ⭐ Easy | Free tier available | Need Atlas | Beginners |
| **Railway.app** | ⭐⭐ Easy | Free trial | Included | Quick deploy |
| **Vercel** | ⭐⭐ Medium | Free | Need separate | Static sites |
| **Heroku** | ⭐⭐ Medium | Free tier removed | Need addon | Legacy apps |
| **VPS (DigitalOcean)** | ⭐⭐⭐⭐ Advanced | $5/month | Self-hosted | Full control |

**Recommended:** Render.com + MongoDB Atlas (Free forever!)

---

## 🚀 Method 1: Render.com + MongoDB Atlas (Recommended)

### Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Your project pushed to GitHub

### Step 1: Set Up MongoDB Atlas

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" (M0 Sandbox)
   - Select region closest to your users (e.g., Mumbai for India)
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Add new database user
   - Choose password authentication
   - Save username and password

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://admin:mypassword@cluster0.xxxxx.mongodb.net/krishna-enterprises`

### Step 2: Push to GitHub

```bash
# Initialize git repository (if not already done)
cd Krishana_Expresis
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Krishna Enterprises"

# Create GitHub repository (via GitHub website)
# Then connect and push:
git remote add origin https://github.com/yourusername/krishna-enterprises.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render.com

1. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name:** `krishna-enterprises`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/krishna-enterprises
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=krishna@123
   SESSION_SECRET=your-random-secret-key-here
   BUSINESS_WHATSAPP=919000090000
   PORT=3000
   ```
   
   ⚠️ **Change the values!** Especially passwords and session secret.

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your site will be live at: `https://krishna-enterprises.onrender.com`

### Step 4: Seed Database

After first deployment, seed your database:

1. Open Render.com dashboard
2. Go to your service
3. Click "Shell" tab
4. Run: `npm run seed`

---

## 🚂 Method 2: Railway.app (Easiest MongoDB Setup)

### Step 1: Deploy to Railway

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Add MongoDB**
   - Click "New"
   - Choose "Database"
   - Select "MongoDB"
   - Railway will create a MongoDB instance automatically

4. **Configure Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add:
   ```
   NODE_ENV=production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   SESSION_SECRET=your-random-secret
   BUSINESS_WHATSAPP=919000090000
   ```
   
   Note: MONGODB_URI is automatically set by Railway!

5. **Deploy**
   - Your app will auto-deploy
   - Get URL from Settings → Domains

---

## 🖥️ Method 3: VPS (DigitalOcean/AWS/Linode) - Advanced

### Prerequisites
- VPS with Ubuntu 20.04+ (DigitalOcean: $5/month)
- Domain name (optional)
- SSH access

### Step 1: Initial Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (for SSL)
apt install -y certbot python3-certbot-nginx
```

### Step 2: Deploy Application

```bash
# Create app directory
mkdir -p /var/www/krishna-enterprises
cd /var/www/krishna-enterprises

# Clone repository (or upload files via SFTP)
git clone https://github.com/yourusername/krishna-enterprises.git .

# Install dependencies
npm install

# Create .env file
nano .env
# Add all environment variables

# Seed database
npm run seed

# Start with PM2
pm2 start backend/server.js --name krishna-enterprises
pm2 startup
pm2 save
```

### Step 3: Configure Nginx

```bash
# Create Nginx config
nano /etc/nginx/sites-available/krishna-enterprises

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name krishnaenterprises.info www.krishnaenterprises.info;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/krishna-enterprises /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx

# Get SSL certificate
certbot --nginx -d krishnaenterprises.info -d www.krishnaenterprises.info
```

### Step 4: Set Up Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## 🔒 Security Checklist (Production)

Before going live, ensure:

- [ ] Changed admin password (strong password)
- [ ] Changed session secret (random 32+ characters)
- [ ] MongoDB requires authentication
- [ ] HTTPS enabled (SSL certificate)
- [ ] Firewall configured
- [ ] Regular backups scheduled
- [ ] Environment variables secured
- [ ] NODE_ENV set to production
- [ ] Updated all contact information
- [ ] Tested all features on production

---

## 📊 Post-Deployment Tasks

### 1. Test Everything

- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout process
- [ ] WhatsApp links work
- [ ] Admin login
- [ ] Add/edit/delete products
- [ ] View orders
- [ ] Export CSV
- [ ] Mobile responsiveness

### 2. Set Up Monitoring

**Render.com:**
- Built-in monitoring in dashboard
- Set up health checks

**VPS:**
```bash
# View logs
pm2 logs krishna-enterprises

# Monitor resources
pm2 monit

# Set up email alerts
pm2 install pm2-email-alerts
```

### 3. Set Up Backups

**MongoDB Atlas:**
- Automatic backups included in free tier
- Configure backup schedule in Atlas dashboard

**VPS MongoDB:**
```bash
# Create backup script
nano /root/backup-mongodb.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
mongodump --out /backups/mongodb-$DATE
# Upload to cloud storage (optional)
```

```bash
chmod +x /root/backup-mongodb.sh

# Schedule with cron (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /root/backup-mongodb.sh
```

### 4. Domain Setup (Optional)

If you have a custom domain (krishnaenterprises.info):

1. **Update DNS Records:**
   - A Record: `@` → Your server IP
   - A Record: `www` → Your server IP

2. **Wait for DNS propagation** (up to 48 hours)

3. **Update SSL certificate** (if using VPS)

---

## 🔄 Updating Your Deployment

### Render.com / Railway
```bash
# Just push to GitHub
git add .
git commit -m "Update message"
git push
# Automatic deployment!
```

### VPS
```bash
ssh root@your-server-ip
cd /var/www/krishna-enterprises
git pull
npm install
pm2 restart krishna-enterprises
```

---

## 📈 Performance Optimization

### 1. Enable Compression
Add to `backend/server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Use CDN for Images
- Upload images to Cloudinary (free tier)
- Update image URLs

### 3. Database Indexing
Already implemented in models!

---

## 🆘 Troubleshooting Deployment

### Issue: "Application failed to start"
**Check:**
- Environment variables set correctly
- MongoDB connection string valid
- All dependencies installed
- Correct start command

### Issue: "502 Bad Gateway" (Nginx)
**Check:**
- Application is running (`pm2 status`)
- Port 3000 is correct in Nginx config
- Firewall allows internal connections

### Issue: "Cannot connect to MongoDB"
**Check:**
- MongoDB service running
- Connection string correct
- IP whitelisted (Atlas)
- Network connectivity

---

## 📞 Support

For deployment issues:
- Render.com: https://render.com/docs
- Railway.app: https://docs.railway.app
- MongoDB Atlas: https://www.mongodb.com/docs/atlas

---

**Your trophy store will be live in no time! 🏆**
