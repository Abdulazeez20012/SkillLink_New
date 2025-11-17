# 🚀 SkillLink - Step by Step Setup Guide

Follow these steps exactly to get SkillLink running on your Windows machine.

---

## ✅ Prerequisites Check

Before starting, make sure you have:
- [x] Node.js installed (you already have this ✓)
- [x] npm installed (you already have this ✓)
- [ ] Docker Desktop installed and running

---

## 📦 Step 1: Install Docker Desktop

### 1.1 Download Docker Desktop

1. Open your browser
2. Go to: **https://www.docker.com/products/docker-desktop**
3. Click **"Download for Windows"**
4. Wait for download to complete (~500MB)

### 1.2 Install Docker Desktop

1. Run the downloaded installer: `Docker Desktop Installer.exe`
2. Follow the installation wizard:
   - ✓ Check "Use WSL 2 instead of Hyper-V" (recommended)
   - ✓ Check "Add shortcut to desktop"
3. Click **Install**
4. Wait for installation (takes 2-5 minutes)
5. Click **Close** when done
6. **Restart your computer** if prompted

### 1.3 Start Docker Desktop

1. Open **Docker Desktop** from Start Menu or Desktop
2. Wait for Docker to start (you'll see a whale icon in system tray)
3. When ready, the icon will be **green** and say "Docker Desktop is running"
4. You may need to accept the service agreement on first run

**⏱️ This takes 1-2 minutes the first time**

---

## 🗄️ Step 2: Start PostgreSQL Database

### Option A: Using the Automated Script (Easiest)

1. Open **File Explorer**
2. Navigate to: `C:\Users\DELL USER\Documents\SkillLink-New\skilllink-platform`
3. Double-click: **`complete-setup.bat`**
4. Press any key when prompted
5. Wait for the script to complete (2-3 minutes)
6. **Done!** Skip to Step 5

### Option B: Manual Setup

#### 2.1 Open PowerShell

1. Press `Windows + X`
2. Select **"Windows PowerShell"** or **"Terminal"**
3. Navigate to project folder:
```powershell
cd "C:\Users\DELL USER\Documents\SkillLink-New\skilllink-platform"
```

#### 2.2 Start Database Container

```powershell
docker-compose up -d postgres
```

**What happens:**
- Downloads PostgreSQL image (first time only, ~80MB)
- Creates database container
- Starts PostgreSQL on port 5432

**Wait for:** "Container skilllink-db Started" ✓

#### 2.3 Verify Database is Running

```powershell
docker ps
```

**You should see:**
```
CONTAINER ID   IMAGE                  STATUS         PORTS                    NAMES
xxxxx          postgres:15-alpine     Up X seconds   0.0.0.0:5432->5432/tcp   skilllink-db
```

✅ If you see this, database is running!

---

## 🔧 Step 3: Setup Database Schema

### 3.1 Navigate to Backend Folder

```powershell
cd backend
```

### 3.2 Run Database Migrations

```powershell
npx prisma migrate deploy
```

**What happens:**
- Creates all database tables
- Sets up relationships
- Applies indexes

**Wait for:** "All migrations have been successfully applied" ✓

**⏱️ Takes 10-20 seconds**

---

## 🌱 Step 4: Seed Initial Data

```powershell
npm run seed
```

**What happens:**
- Creates admin user
- Creates facilitator user
- Creates sample cohort
- Creates all badges

**You should see:**
```
🌱 Seeding database...
✅ Created admin: admin@skilllink.com
✅ Created facilitator: facilitator@skilllink.com | Access Code: XXXXXX
✅ Created cohort: Full Stack Web Development - Cohort 1
   Student Invite: xxxxx
   Facilitator Invite: xxxxx
✅ Created badges
✅ Database seeded successfully!
```

**⏱️ Takes 5-10 seconds**

---

## 🚀 Step 5: Start the Application

### 5.1 Start Backend Server

**In your current PowerShell window (still in backend folder):**

```powershell
npm run dev
```

**You should see:**
```
🚀 Server running on port 3000
📊 Environment: development
🔗 API: http://localhost:3000/api
```

✅ **Leave this terminal running!**

### 5.2 Start Frontend Server

**Open a NEW PowerShell window:**

1. Press `Windows + X` → Select **"Windows PowerShell"**
2. Navigate to frontend:
```powershell
cd "C:\Users\DELL USER\Documents\SkillLink-New\skilllink-platform\frontend"
```

3. Start frontend:
```powershell
npm run dev
```

**You should see:**
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **Leave this terminal running too!**

---

## 🎉 Step 6: Access the Application

### 6.1 Open Your Browser

1. Open **Chrome**, **Edge**, or **Firefox**
2. Go to: **http://localhost:5173**

### 6.2 Login as Admin

**Email:** `admin@skilllink.com`  
**Password:** `Admin123!`

Click **"Login"**

### 6.3 Explore the Dashboard

You should now see the **Admin Dashboard** with:
- Platform statistics
- Cohort management
- User management
- Analytics

🎊 **Congratulations! SkillLink is now running!**

---

## 📊 What You Can Do Now

### As Admin:
1. ✅ Create new cohorts
2. ✅ Invite facilitators
3. ✅ Invite students (bulk)
4. ✅ View platform analytics
5. ✅ Manage users

### Test Other Roles:

**Facilitator Login:**
- Email: `facilitator@skilllink.com`
- Password: `Facilitator123!`

**Student Registration:**
- Use the student invite link from the cohort

---

## 🔄 Daily Usage

After initial setup, to start working on the project:

### Every Time You Start:

1. **Make sure Docker Desktop is running** (green icon in system tray)

2. **Terminal 1 - Backend:**
```powershell
cd "C:\Users\DELL USER\Documents\SkillLink-New\skilllink-platform\backend"
npm run dev
```

3. **Terminal 2 - Frontend:**
```powershell
cd "C:\Users\DELL USER\Documents\SkillLink-New\skilllink-platform\frontend"
npm run dev
```

4. **Browser:** http://localhost:5173

---

## 🛠️ Troubleshooting

### Problem: Docker Desktop won't start

**Solution:**
1. Open Docker Desktop
2. Go to Settings (gear icon)
3. General → Enable "Use WSL 2 based engine"
4. Restart Docker Desktop

### Problem: "Cannot connect to database"

**Solution:**
```powershell
# Check if database is running
docker ps

# If not running, start it
docker start skilllink-db

# Check logs
docker logs skilllink-db
```

### Problem: Port 3000 or 5173 already in use

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Problem: "Prisma Client not generated"

**Solution:**
```powershell
cd backend
npx prisma generate
```

### Problem: Want to reset everything

**Solution:**
```powershell
# Stop and remove database
docker-compose down -v

# Start fresh
docker-compose up -d postgres

# Wait 15 seconds
timeout /t 15

# Run migrations and seed
cd backend
npx prisma migrate deploy
npm run seed
```

---

## 📋 Quick Reference

### Useful Commands

```powershell
# Check Docker status
docker ps

# View database logs
docker logs skilllink-db

# Stop database
docker stop skilllink-db

# Start database
docker start skilllink-db

# Access database CLI
docker exec -it skilllink-db psql -U skilllink -d skilllink

# View database in browser
cd backend
npx prisma studio
# Opens http://localhost:5555
```

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skilllink.com | Admin123! |
| Facilitator | facilitator@skilllink.com | Facilitator123! |

### Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| API Health | http://localhost:3000/api/health |
| Prisma Studio | http://localhost:5555 |

---

## ✅ Setup Checklist

- [ ] Docker Desktop installed
- [ ] Docker Desktop running (green icon)
- [ ] Database container started (`docker ps` shows skilllink-db)
- [ ] Migrations completed
- [ ] Database seeded
- [ ] Backend running (port 3000)
- [ ] Frontend running (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Can login as admin
- [ ] Can see admin dashboard

---

## 🎯 Next Steps

Now that SkillLink is running, you can:

1. **Explore Features:**
   - Create cohorts
   - Invite users
   - Test gamification
   - View analytics

2. **Test APIs:**
   - Use Postman or Thunder Client
   - API docs: See API_DOCUMENTATION.md

3. **Customize:**
   - Modify branding
   - Add features
   - Configure integrations

4. **Deploy:**
   - See DEPLOYMENT.md for production setup

---

**Need help?** Check the troubleshooting section or refer to:
- DATABASE_SETUP_GUIDE.md
- QUICKSTART.md
- README.md

**Happy coding! 🚀**
