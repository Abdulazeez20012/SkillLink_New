# Supabase Setup Guide for SkillLink

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: `skilllink` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., `East US`)
   - **Pricing Plan**: Free (500MB database, perfect for development)
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be provisioned

## Step 3: Get Your Database Connection String

1. Once your project is ready, click on the "Settings" icon (⚙️) in the left sidebar
2. Click "Database" in the settings menu
3. Scroll down to "Connection string"
4. Select "URI" tab
5. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the database password you created in Step 2

## Step 4: Update Your .env File

1. Open `skilllink-platform/backend/.env`
2. Replace the DATABASE_URL with your Supabase connection string:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```

## Step 5: Run Database Migrations

Open your terminal and run:

```bash
cd skilllink-platform/backend
npx prisma generate
npx prisma migrate deploy
npm run seed
```

## Step 6: Verify Setup

You should see:
- ✅ Migrations applied successfully
- ✅ Database seeded with admin and facilitator accounts

## Login Credentials

After seeding, you can log in with:

**Admin Account:**
- Email: `admin@skilllink.com`
- Password: `Admin123!`

**Facilitator Account:**
- Email: `facilitator@skilllink.com`
- Password: `Facilitator123!`

## Step 7: View Your Database (Optional)

1. In Supabase dashboard, click "Table Editor" in the left sidebar
2. You'll see all your tables: User, Cohort, Assignment, etc.
3. You can browse and edit data directly here

## Troubleshooting

### Connection Error
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check that there are no extra spaces in the connection string
- Verify your password doesn't contain special characters that need URL encoding

### Migration Errors
- Make sure you're in the `backend` directory
- Try running `npx prisma generate` first
- Check that your DATABASE_URL is correct

## Benefits of Supabase

✅ No local installation needed
✅ Free tier with 500MB database
✅ Automatic backups
✅ Built-in database browser
✅ Real-time subscriptions (if needed later)
✅ Works from anywhere (no localhost issues)

## Next Steps

Once setup is complete, you can start your backend server:

```bash
cd skilllink-platform/backend
npm run dev
```

And your frontend:

```bash
cd skilllink-platform/frontend
npm run dev
```

Your app will be fully functional with a cloud PostgreSQL database!
