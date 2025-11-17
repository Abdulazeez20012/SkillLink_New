# SkillLink - Learning Management System

A comprehensive Learning Management System designed for tech bootcamps with role-based access control, real-time features, and GitHub integration.

## 🚀 Features

### Core Functionality
- **Three-tier Role System**: Admin, Facilitator, and Student dashboards
- **Cohort Management**: Create and manage learning cohorts with invite links
- **Assignment System**: GitHub-integrated assignments with file uploads
- **Forum System**: Stack Overflow-style Q&A with voting and best answers
- **Real-time Chat**: Socket.io powered cohort chat rooms
- **Attendance Tracking**: Mark and monitor student attendance
- **Progress Analytics**: Track student performance and completion rates

### Authentication
- **Admin**: First-user registration becomes super admin
- **Facilitator**: Login with 6-digit access codes
- **Student**: Registration via unique cohort invite links
- **JWT**: Secure token-based authentication with refresh tokens

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form for form management
- Axios for API calls
- Socket.io Client for real-time features

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL database
- Prisma ORM
- JWT authentication
- Socket.io for WebSockets
- Nodemailer/SendGrid for emails
- Multer for file uploads

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis (optional, for caching)
- Docker & Docker Compose (recommended)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd skilllink-platform
```

2. **Start the database**
```bash
docker-compose up -d
```

3. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. **Frontend Setup**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your configuration
```

5. **Start Development Servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in another terminal):
```bash
cd frontend
npm run dev
```

## 🔑 Default Credentials (After Seeding)

**Admin**
- Email: admin@skilllink.com
- Password: Admin123!

**Facilitator**
- Email: facilitator@skilllink.com
- Password: Facilitator123!
- Access Code: (Check console output after seeding)

## 📁 Project Structure

```
skilllink-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tsconfig.json
└── docker-compose.yml
```

## 🎯 Key Features by Role

### Admin Dashboard
- System analytics and metrics
- Create and manage cohorts
- Add facilitators with access codes
- Bulk invite students via email/CSV
- Regenerate invite links
- User management

### Facilitator Dashboard
- View assigned cohorts
- Student roster management
- Create and grade assignments
- Track attendance
- Monitor forum activity
- Real-time chat with students

### Student Dashboard
- View upcoming assignments
- Submit assignments (GitHub + files)
- Track progress and grades
- Participate in forum discussions
- Cohort chat room access
- Attendance history

## 🔐 Security Features

- Password hashing with bcrypt
- JWT access and refresh tokens
- HTTP-only cookies for refresh tokens
- Role-based access control
- Rate limiting on API endpoints
- Helmet.js security headers
- Input validation and sanitization

## 📧 Email Features

- Welcome emails for new users
- Facilitator access code delivery
- Student cohort invitations
- Assignment notifications
- Grade notifications
- Configurable email templates

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/admin/register` - Admin registration
- `POST /api/auth/facilitator/login` - Facilitator login with access code
- `POST /api/auth/student/register` - Student registration with invite token
- `POST /api/auth/login` - Standard login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/analytics` - System analytics
- `GET /api/admin/facilitators` - List facilitators
- `POST /api/admin/facilitators` - Create facilitator
- `POST /api/admin/facilitators/:id/regenerate-code` - New access code
- `GET /api/admin/students` - List students
- `POST /api/admin/invite-students` - Bulk invite students
- `POST /api/admin/cohorts/:id/regenerate-links` - New invite links

### Cohorts
- `GET /api/cohorts` - List cohorts
- `POST /api/cohorts` - Create cohort
- `GET /api/cohorts/:id` - Get cohort details
- `PUT /api/cohorts/:id` - Update cohort
- `DELETE /api/cohorts/:id` - Archive cohort
- `POST /api/cohorts/:id/members` - Add member
- `DELETE /api/cohorts/:id/members/:userId` - Remove member

### Assignments
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/:id` - Get assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Archive assignment
- `POST /api/assignments/:id/submit` - Submit assignment
- `PUT /api/assignments/:id/submissions/:submissionId/grade` - Grade submission

### Forum
- `GET /api/forum/posts` - List forum posts
- `POST /api/forum/posts` - Create post
- `GET /api/forum/posts/:id` - Get post details
- `POST /api/forum/posts/:id/answers` - Post answer
- `PUT /api/forum/posts/:id/solve` - Mark as solved
- `PUT /api/forum/answers/:id/endorse` - Endorse answer

### Attendance
- `POST /api/attendance` - Record attendance
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/cohort/:cohortId` - Cohort attendance
- `GET /api/attendance/user/:userId` - User attendance

## 🚧 Development

### Database Migrations
```bash
cd backend
npm run prisma:migrate
```

### Generate Prisma Client
```bash
npm run prisma:generate
```

### View Database
```bash
npm run prisma:studio
```

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@skilllink.com
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🐛 Known Issues

- File upload size limited to 10MB
- Email service requires SendGrid API key for production
- Real-time features require WebSocket support

## 🔮 Future Enhancements

- Video conferencing integration
- Mobile app (React Native)
- Advanced analytics dashboard
- Automated grading with AI
- Certificate generation
- Calendar integration
- Slack/Discord integration

## 📞 Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Email: support@skilllink.com

---

Built with ❤️ for tech education
