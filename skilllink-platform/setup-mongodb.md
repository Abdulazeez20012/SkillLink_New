# MongoDB Local Setup Guide

## Option 1: Install MongoDB Community Edition (Recommended)

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: 7.0.x (Current)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded MSI installer
2. Choose "Complete" installation
3. **IMPORTANT**: Check "Install MongoDB as a Service"
4. **IMPORTANT**: Check "Install MongoDB Compass" (GUI tool)
5. Complete the installation

### Step 3: Verify Installation
Open a new Command Prompt or PowerShell and run:
```bash
mongod --version
```

You should see the MongoDB version information.

### Step 4: Start MongoDB Service
MongoDB should start automatically as a service. To verify:
```bash
# Check if service is running
sc query MongoDB

# Or start it manually if needed
net start MongoDB
```

### Step 5: Initialize Database
Once MongoDB is running, go back to your project and run:
```bash
cd skilllink-platform/backend
npx prisma db push
npx prisma db seed
```

---

## Option 2: Use MongoDB Atlas (Cloud - Free)

If you prefer not to install MongoDB locally:

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free M0 cluster (takes 3-5 minutes)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update your `.env` file:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/skilllink?retryWrites=true&w=majority"
   ```
7. Run:
   ```bash
   cd skilllink-platform/backend
   npx prisma db push
   npx prisma db seed
   ```

---

## Current Status
Your project is configured for: **Local MongoDB**
Connection string: `mongodb://localhost:27017/skilllink`

Choose one of the options above to proceed!
