# PostgreSQL Setup Guide - Step by Step

## 🚀 Quick Setup with Docker Desktop (Recommended)

### Step 1: Start Docker Desktop

1. **Open Docker Desktop** from your Start Menu
2. **Wait** for Docker to fully start (you'll see a green icon in the system tray)
3. **Verify** it's running - you should see "Docker Desktop is running"

### Step 2: Start PostgreSQL Database

Open PowerShell or Command Prompt in the `skilllink-platform` folder and run:

```bash
docker-compose up -d postgres
```

This will:
- Download PostgreSQL image (first time only, ~80MB)
- Create and start PostgreSQL container
- Set up database with credentials from docker-compose.yml

**Wait for:** "Container skilllink-db Started" message

### Step 3: Verify Database is Running

```bash
docker ps
```

You should see `skilllink-db` container running on port 5432.

### Step 4: Run Database Migrations

```bash
cd backend
npx prisma migrate deploy
```

This creates all the tables in your database.

### Step 5: Seed Initial Data

```bash
npm run seed
```

This adds:
- Admin user (admin@skilllink.com / Admin123!)
- Facilitator user (facilitator@skilllink.com / Facilitator123!)
- Sample cohort
- All badges

### Step 6: Start the Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📊 Environment: development
🔗 API: http://localhost:3000/api
```

### Step 7: Start the Frontend (New Terminal)

Open a new terminal/PowerShell window:

```bash
cd skilllink-platform/frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 8: Access the Application

Open your browser and go to: **http://localhost:5173**

Login with:
- **Email:** admin@skilllink.com
- **Password:** Admin123!

---

## 🔧 Troubleshooting

### Issue: Docker Desktop not starting

**Solution:**
1. Open Docker Desktop
2. Go to Settings → General
3. Enable "Use WSL 2 based engine"
4. Restart Docker Desktop

### Issue: Port 5432 already in use

**Solution:**
```bash
# Stop any existing PostgreSQL
docker stop skilllink-db
docker rm skilllink-db

# Or change port in docker-compose.yml:
ports:
  - "5433:5432"  # Use 5433 instead

# Update DATABASE_URL in backend/.env:
DATABASE_URL="postgresql://skilllink:skilllink_dev@localhost:5433/skilllink?schema=public"
```

### Issue: "Cannot connect to database"

**Solution:**
```bash
# Check if container is running
docker ps

# Check container logs
docker logs skilllink-db

# Restart container
docker restart skilllink-db
```

### Issue: Migration fails

**Solution:**
```bash
# Reset database
cd backend
npx prisma migrate reset

# Run migrations again
npx prisma migrate deploy
```

---

## 📋 Useful Docker Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs skilllink-db

# Stop database
docker stop skilllink-db

# Start database
docker start skilllink-db

# Restart database
docker restart skilllink-db

# Remove database (WARNING: deletes all data)
docker rm -f skilllink-db

# View database data volume
docker volume ls

# Remove everything and start fresh
docker-compose down -v
docker-compose up -d postgres
```

---

## 🗄️ Database Management

### Access PostgreSQL CLI

```bash
docker exec -it skilllink-db psql -U skilllink -d skilllink
```

Useful SQL commands:
```sql
-- List all tables
\dt

-- View table structure
\d users

-- Count records
SELECT COUNT(*) FROM users;

-- View all users
SELECT id, email, name, role FROM users;

-- Exit
\q
```

### View Database with Prisma Studio

```bash
cd backend
npx prisma studio
```

Opens a web interface at http://localhost:5555 to view and edit data.

---

## 🔄 Reset Everything

If you want to start completely fresh:

```bash
# Stop and remove containers
docker-compose down -v

# Start fresh
docker-compose up -d postgres

# Wait 10 seconds for database to be ready
timeout /t 10

# Run migrations
cd backend
npx prisma migrate deploy

# Seed data
npm run seed
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Docker Desktop is running
- [ ] `docker ps` shows skilllink-db container
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access http://localhost:5173
- [ ] Can login with admin credentials
- [ ] Can see admin dashboard

---

## 🎯 Quick Start Commands (After Initial Setup)

Every time you want to work on the project:

**Terminal 1:**
```bash
# Make sure Docker Desktop is running, then:
cd skilllink-platform/backend
npm run dev
```

**Terminal 2:**
```bash
cd skilllink-platform/frontend
npm run dev
```

**Browser:**
- Open http://localhost:5173
- Login with admin@skilllink.com / Admin123!

---

## 📞 Need Help?

If you encounter issues:

1. Check Docker Desktop is running (green icon in system tray)
2. Check container logs: `docker logs skilllink-db`
3. Verify .env files exist in backend and frontend folders
4. Try restarting Docker Desktop
5. Try `docker-compose down -v` and start fresh

---

**Ready to start?** Follow Step 1 above! 🚀
