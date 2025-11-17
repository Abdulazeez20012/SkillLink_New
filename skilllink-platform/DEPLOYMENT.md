# SkillLink Platform - Deployment Guide

Complete guide for deploying SkillLink to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Cloud Platforms](#cloud-platforms)
8. [Post-Deployment](#post-deployment)

---

## Prerequisites

### Required
- Node.js 18+ LTS
- PostgreSQL 14+
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

### Recommended
- Redis for caching
- CDN for static assets
- Load balancer for scaling
- Monitoring service (DataDog, New Relic)

---

## Environment Setup

### Production Environment Variables

**Backend (.env.production)**
```env
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/skilllink_prod

# JWT Secrets (Generate strong secrets!)
JWT_SECRET=<generate-strong-secret-64-chars>
JWT_REFRESH_SECRET=<generate-strong-secret-64-chars>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Client
CLIENT_URL=https://your-domain.com

# Optional: Redis
REDIS_URL=redis://localhost:6379

# Optional: Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<sendgrid-api-key>
EMAIL_FROM=noreply@your-domain.com

# Optional: AI Features
OPENAI_API_KEY=<your-openai-key>

# Optional: GitHub
GITHUB_TOKEN=<your-github-token>

# Optional: File Upload
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://api.your-domain.com/api
VITE_SOCKET_URL=https://api.your-domain.com
```

### Generate Secrets
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Database Setup

### 1. Create Production Database
```sql
CREATE DATABASE skilllink_prod;
CREATE USER skilllink_user WITH ENCRYPTED PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE skilllink_prod TO skilllink_user;
```

### 2. Run Migrations
```bash
cd backend
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### 3. Seed Initial Data
```bash
npm run seed
```

### 4. Backup Strategy
```bash
# Daily backup script
pg_dump -U skilllink_user skilllink_prod > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U skilllink_user skilllink_prod < backup_20241117.sql
```

---

## Backend Deployment

### Option 1: Traditional Server (Ubuntu/Debian)

**1. Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

**2. Deploy Application**
```bash
# Clone repository
git clone <your-repo-url>
cd skilllink-platform/backend

# Install dependencies
npm ci --production

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/index.js --name skilllink-api

# Save PM2 configuration
pm2 save
pm2 startup
```

**3. Configure Nginx**
```nginx
# /etc/nginx/sites-available/skilllink
server {
    listen 80;
    server_name api.your-domain.com;

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
sudo ln -s /etc/nginx/sites-available/skilllink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

### Option 2: Heroku

**1. Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

**2. Create App**
```bash
cd backend
heroku create skilllink-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-secret>
heroku config:set JWT_REFRESH_SECRET=<your-secret>
heroku config:set CLIENT_URL=https://your-frontend.com
```

**3. Deploy**
```bash
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Seed database
heroku run npm run seed
```

### Option 3: DigitalOcean App Platform

**1. Create App**
- Go to DigitalOcean App Platform
- Connect GitHub repository
- Select backend folder

**2. Configure**
```yaml
# app.yaml
name: skilllink-backend
services:
  - name: api
    github:
      repo: your-username/skilllink-platform
      branch: main
      deploy_on_push: true
    source_dir: /backend
    build_command: npm run build
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
    http_port: 3000

databases:
  - name: db
    engine: PG
    version: "14"
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**1. Install Vercel CLI**
```bash
npm install -g vercel
```

**2. Deploy**
```bash
cd frontend
vercel --prod
```

**3. Configure**
- Set environment variables in Vercel dashboard
- Configure custom domain
- Enable automatic deployments

### Option 2: Netlify

**1. Build**
```bash
cd frontend
npm run build
```

**2. Deploy**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**3. Configure**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Traditional Server

**1. Build**
```bash
cd frontend
npm run build
```

**2. Configure Nginx**
```nginx
# /etc/nginx/sites-available/skilllink-frontend
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/skilllink/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Copy build files
sudo mkdir -p /var/www/skilllink
sudo cp -r dist/* /var/www/skilllink/

# Enable site
sudo ln -s /etc/nginx/sites-available/skilllink-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL
sudo certbot --nginx -d your-domain.com
```

---

## Docker Deployment

### 1. Build Images

**Backend Dockerfile**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "start"]
```

**Frontend Dockerfile**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose Production

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: skilllink_prod
      POSTGRES_USER: skilllink
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://skilllink:${DB_PASSWORD}@postgres:5432/skilllink_prod
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      CLIENT_URL: ${CLIENT_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Deploy with Docker

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Cloud Platforms

### AWS Deployment

**1. EC2 Instance**
- Launch Ubuntu 22.04 instance
- Configure security groups (ports 80, 443, 22)
- Follow traditional server deployment

**2. RDS Database**
- Create PostgreSQL RDS instance
- Configure security groups
- Update DATABASE_URL

**3. S3 + CloudFront**
- Upload frontend build to S3
- Create CloudFront distribution
- Configure custom domain

**4. Elastic Beanstalk**
- Create application
- Deploy backend
- Configure environment variables

### Google Cloud Platform

**1. Cloud Run**
```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT_ID/skilllink-backend
gcloud run deploy skilllink-backend --image gcr.io/PROJECT_ID/skilllink-backend

# Deploy frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/skilllink-frontend
gcloud run deploy skilllink-frontend --image gcr.io/PROJECT_ID/skilllink-frontend
```

**2. Cloud SQL**
- Create PostgreSQL instance
- Configure connection
- Update DATABASE_URL

### Azure

**1. App Service**
- Create Web App
- Deploy from GitHub
- Configure environment variables

**2. Azure Database for PostgreSQL**
- Create database server
- Configure firewall rules
- Update connection string

---

## Post-Deployment

### 1. Health Checks

**Backend Health**
```bash
curl https://api.your-domain.com/api/health
```

**Database Connection**
```bash
curl https://api.your-domain.com/api/health/db
```

### 2. Monitoring

**PM2 Monitoring**
```bash
pm2 monit
pm2 logs
```

**Setup Monitoring Service**
- DataDog
- New Relic
- Sentry for error tracking

### 3. Backup Automation

**Cron Job for Daily Backups**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

**Backup Script**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="skilllink_prod"

# Database backup
pg_dump -U skilllink $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Compress
gzip $BACKUP_DIR/db_$DATE.sql

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://your-bucket/backups/

# Delete old backups (keep 30 days)
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

### 4. SSL Certificate Renewal

**Auto-renewal with Certbot**
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot auto-renews via cron
```

### 5. Performance Optimization

**Enable Gzip**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

**Enable Caching**
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 6. Security Checklist

- [ ] HTTPS enabled
- [ ] Strong JWT secrets
- [ ] Database credentials secured
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Regular security updates
- [ ] Firewall configured
- [ ] SSH key authentication
- [ ] Fail2ban installed

### 7. Scaling

**Horizontal Scaling**
- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Session management with Redis
- Database read replicas

**Vertical Scaling**
- Increase server resources
- Optimize database queries
- Enable caching
- CDN for static assets

---

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U skilllink -d skilllink_prod -h localhost
```

### Application Not Starting
```bash
# Check PM2 logs
pm2 logs skilllink-api

# Check system logs
sudo journalctl -u nginx -f
```

### High Memory Usage
```bash
# Check processes
htop

# Restart application
pm2 restart skilllink-api
```

### SSL Certificate Issues
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew
```

---

## Rollback Procedure

### 1. Database Rollback
```bash
# Restore from backup
psql -U skilllink skilllink_prod < backup_20241117.sql
```

### 2. Application Rollback
```bash
# Git rollback
git revert <commit-hash>
git push

# PM2 rollback
pm2 reload skilllink-api
```

### 3. Frontend Rollback
```bash
# Redeploy previous version
vercel rollback
# or
netlify rollback
```

---

## Maintenance

### Regular Tasks
- **Daily**: Check logs and monitoring
- **Weekly**: Review performance metrics
- **Monthly**: Security updates
- **Quarterly**: Database optimization

### Update Procedure
```bash
# 1. Backup database
./backup-script.sh

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
npm ci

# 4. Run migrations
npx prisma migrate deploy

# 5. Build
npm run build

# 6. Restart
pm2 restart skilllink-api
```

---

## Support

For deployment issues:
- GitHub Issues
- Email: devops@skilllink.com
- Documentation: https://docs.skilllink.com

---

Happy Deploying! 🚀
