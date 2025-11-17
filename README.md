# SkillLink - Learning Management System

A full-stack Learning Management System for tech bootcamps with role-based access control.

## Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access
- **Real-time**: Socket.io
- **File Upload**: Multer with cloud storage
- **Email**: Nodemailer with SendGrid

## User Roles

1. **Administrators** - Full system access
2. **Facilitators** - Course and cohort management
3. **Students** - Learning and assignment submission

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the database:
   ```bash
   docker-compose up -d
   ```

4. Set up environment variables:
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

6. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Project Structure

```
skilllink/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript types
└── docker-compose.yml
```
