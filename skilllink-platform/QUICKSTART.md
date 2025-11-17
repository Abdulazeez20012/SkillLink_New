# SkillLink Platform - Quick Start Guide

Get up and running with SkillLink in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git installed

## Quick Setup

### Option 1: Automated Setup (Recommended)

**On Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```bash
setup.bat
```

### Option 2: Manual Setup

**1. Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**2. Configure Environment**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your database URL

# Frontend
cd ../frontend
cp .env.example .env
```

**3. Setup Database**
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npm run seed
```

**4. Start Development Servers**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Health**: http://localhost:3000/api/health

## Default Login Credentials

### Admin Account
```
Email: admin@skilllink.com
Password: Admin123!
```

### Facilitator Account
```
Email: facilitator@skilllink.com
Password: Facilitator123!
```

## First Steps

### As Admin

1. **Login** with admin credentials
2. **Create a Cohort**:
   - Go to "Cohorts" tab
   - Click "Create New Cohort"
   - Fill in details (name, dates, description)
   - Save and copy invite links

3. **Invite Facilitators**:
   - Go to "Facilitators" tab
   - Click "Invite Facilitator"
   - Enter email and name
   - Copy the 6-digit access code

4. **Invite Students**:
   - Go to "Students" tab
   - Click "Bulk Invite"
   - Upload CSV or enter emails
   - Students receive invite links via email

### As Facilitator

1. **Login** with facilitator credentials
2. **View Your Cohorts**:
   - Dashboard shows assigned cohorts
   - Click on a cohort to see details

3. **Create Assignment**:
   - Select a cohort
   - Go to "Assignments" tab
   - Click "Create Assignment"
   - Set title, description, due date
   - Publish when ready

4. **Track Attendance**:
   - Go to "Attendance" tab
   - Mark students as Present/Absent/Late
   - Add notes if needed

5. **Grade Submissions**:
   - View submitted assignments
   - Review GitHub repos
   - Assign grade and feedback
   - AI can generate feedback suggestions

### As Student

1. **Register** using invite link from email
2. **View Dashboard**:
   - See upcoming assignments
   - Check your points and badges
   - View leaderboard position

3. **Submit Assignment**:
   - Click on assignment
   - Enter GitHub repository URL
   - Upload additional files if needed
   - Submit before deadline

4. **Participate in Forum**:
   - Ask questions
   - Answer peer questions
   - Earn points for helpful answers

5. **Track Progress**:
   - View grade history
   - Check attendance record
   - Monitor streak calendar
   - Collect badges

## Key Features to Try

### Gamification
- Submit assignments to earn points
- Answer forum questions for badges
- Maintain attendance streak
- Compete on leaderboard

### GitHub Integration
- Submit assignments via GitHub URL
- Automatic repository validation
- View commit history
- Verify repository ownership

### AI Features
- Get AI-generated feedback on submissions
- Receive personalized study recommendations
- Analyze code quality
- Generate practice quizzes

### Analytics
- **Admin**: Platform-wide statistics
- **Facilitator**: Cohort performance metrics
- **Student**: Personal progress tracking

## Common Tasks

### Create a New Cohort
```
Admin Dashboard → Cohorts → Create New Cohort
→ Fill form → Save → Copy invite links
```

### Add Students to Cohort
```
Admin Dashboard → Students → Bulk Invite
→ Select cohort → Enter emails → Send invites
```

### Create and Publish Assignment
```
Facilitator Dashboard → Select Cohort → Assignments
→ Create Assignment → Fill details → Publish
```

### Submit Assignment
```
Student Dashboard → Assignments → Select Assignment
→ Enter GitHub URL → Upload files → Submit
```

### Grade Submission
```
Facilitator Dashboard → Assignments → View Submissions
→ Select submission → Review → Enter grade → Save
```

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in backend/.env
# Run migrations: npx prisma migrate deploy
```

### Port Already in Use
```bash
# Backend (3000): Change PORT in backend/.env
# Frontend (5173): Change port in frontend/vite.config.ts
```

### Prisma Client Not Generated
```bash
cd backend
npx prisma generate
```

### Missing Dependencies
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Environment Configuration

### Minimal Backend .env
```env
DATABASE_URL="postgresql://user:password@localhost:5432/skilllink"
JWT_SECRET="your-secret-key-change-this"
JWT_REFRESH_SECRET="your-refresh-secret-change-this"
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Minimal Frontend .env
```env
VITE_API_URL=http://localhost:3000/api
```

### Optional Features

**Enable AI Features:**
```env
OPENAI_API_KEY=sk-your-openai-api-key
```

**Enable GitHub Integration:**
```env
GITHUB_TOKEN=ghp_your-github-token
```

**Enable Email Notifications:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Development Tips

### View Database
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

### Reset Database
```bash
cd backend
npx prisma migrate reset
npm run seed
```

### Check API Health
```bash
curl http://localhost:3000/api/health
```

### View Logs
Backend logs appear in the terminal running `npm run dev`

## Production Deployment

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Environment Variables
Set production values for:
- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `CLIENT_URL` (production frontend URL)
- Strong `JWT_SECRET` values

### Run Production
```bash
# Backend
cd backend
npm start

# Frontend (serve build folder with nginx/apache)
```

## Next Steps

1. **Explore Features**: Try all gamification features
2. **Customize**: Modify branding and colors
3. **Integrate**: Connect email and GitHub
4. **Scale**: Add more cohorts and users
5. **Monitor**: Check analytics and logs

## Getting Help

- **Documentation**: See README.md and FEATURES.md
- **Issues**: GitHub Issues for bugs
- **Community**: Join Discord server
- **Email**: support@skilllink.com

## Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm run seed         # Seed database
npx prisma studio    # Open database GUI
npx prisma migrate   # Run migrations

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

Happy Learning! 🚀
