# Running SkillLink Project

## ✅ Current Status
Both backend and frontend are now running!

### 🌐 Access URLs
- **Frontend (Landing Page)**: http://localhost:5173/
- **Backend API**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api/health

## 🚀 Running Processes

### Backend Server
- **Port**: 3000
- **Status**: ✅ Running
- **Environment**: Development
- **Location**: `skilllink-platform/backend`

### Frontend Server
- **Port**: 5173
- **Status**: ✅ Running
- **Framework**: Vite + React
- **Location**: `skilllink-platform/frontend`

## 📱 What You Can Do Now

### 1. View Landing Page
Open your browser and go to: **http://localhost:5173/**

You'll see:
- ✨ Beautiful hero section with animations
- 📝 Testimonials section
- 🎯 Mission statement
- 📚 Programs (AI Bootcamps, SkillLink Labs, Educator Tools)
- 👥 Community section
- ❓ FAQ accordion
- 📧 Newsletter signup
- 🔗 Footer with links

### 2. Register as Admin
- Go to: http://localhost:5173/admin/register
- Create an admin account

### 3. Login
- Go to: http://localhost:5173/login
- Login with your credentials

### 4. Access Dashboards
After login, you'll be redirected based on your role:
- **Admin**: http://localhost:5173/admin
- **Facilitator**: http://localhost:5173/facilitator
- **Student**: http://localhost:5173/student

## 🎨 Design Features

### Colors
- **Primary**: Red (#dc2626)
- **Secondary**: White (#ffffff)
- All buttons, links, and accents use the red theme

### Typography
- **Brand Font**: Aeonik (with Inter fallback)
- Applied to all "SkillLink" brand names

### Animations
- Framer Motion animations throughout
- Scroll-triggered effects
- Smooth transitions

## 🛑 Stopping the Servers

To stop the servers, you can:
1. Press `Ctrl + C` in each terminal
2. Or close the terminal windows

## 🔧 Troubleshooting

### Database Connection Issues
If you see database errors:
1. Make sure PostgreSQL is running
2. Check `.env` file in backend folder
3. Run: `npm run prisma:migrate` in backend folder

### Port Already in Use
If ports 3000 or 5173 are busy:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`

## 📝 Notes

- The landing page is shown to non-authenticated users
- Once logged in, users are redirected to their role-specific dashboard
- All API endpoints are prefixed with `/api`
- Hot reload is enabled for both frontend and backend

## 🎉 Enjoy SkillLink!

Your AI-powered learning management system is ready to use!
