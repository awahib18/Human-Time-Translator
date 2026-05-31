# VPS Deployment Guide

This repository contains the source code for the Human Time Translator. It has been built and optimized entirely for self-hosted environments (like a Hostinger VPS). This requires no proprietary Vercel/Netlify features.

## Method 1: PM2 + Nginx directly on host (Recommended for lowest memory usage)

### 1. Initial Setup
SSH into your VPS and install dependencies:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v22), PM2, Nginx, Certbot
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### 2. Clone and Build
```bash
# Set up directory
sudo mkdir -p /var/www/timehuman
sudo chown -R $USER:$USER /var/www/timehuman

# Clone
git clone <your-repo-url> /var/www/timehuman
cd /var/www/timehuman

# Install and build
npm ci
npm run build
```

### 3. Start with PM2
Since this is an entirely client-side React SPA via Vite, we can serve the static files with `serve` via PM2, or directly with Nginx. Using `serve` + PM2:
```bash
npm install -g serve
pm2 start ecosystem.config.js
pm2 save
pm2 startup # Follow the command output to enable pm2 on boot
```

### 4. Configure Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/timehuman
sudo ln -s /etc/nginx/sites-available/timehuman /etc/nginx/sites-enabled/
# NOTE: Edit the file to replace yourdomain.com with your actual domain
sudo nano /etc/nginx/sites-available/timehuman

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL / HTTPS
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Method 2: Docker Compose

If your VPS has Docker installed, you can easily spin it up using the provided configuration:

```bash
cd /var/www/timehuman
docker compose up -d --build
```

You can then put an Nginx reverse proxy in front of port `3000` using the same SSL steps above.
