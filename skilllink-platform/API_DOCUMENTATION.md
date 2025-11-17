# SkillLink Platform - API Documentation

Complete API reference for the SkillLink Learning Management System.

**Base URL**: `http://localhost:3000/api` (development)

**Authentication**: JWT Bearer token in Authorization header

---

## Table of Contents
1. [Authentication](#authentication)
2. [Admin](#admin)
3. [Facilitator](#facilitator)
4. [Cohorts](#cohorts)
5. [Assignments](#assignments)
6. [Gamification](#gamification)
7. [Analytics](#analytics)
8. [AI Features](#ai-features)
9. [GitHub](#github)
10. [Forum](#forum)
11. [Attendance](#attendance)

---

## Authentication

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe",
  "role": "ADMIN"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "user": { ... },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### Refresh Token
```http
POST /auth/refresh
```

**Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:**
```json
{
  "accessToken": "new-jwt-token"
}
```

### Logout
```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "ADMIN",
  "avatar": "url",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Admin

### Get Platform Statistics
```http
GET /admin/stats
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "totalUsers": 150,
  "totalCohorts": 5,
  "totalAssignments": 45,
  "activeStudents": 120,
  "activeFacilitators": 10
}
```

### Create Cohort
```http
POST /admin/cohorts
```

**Body:**
```json
{
  "name": "Full Stack Web Development",
  "description": "Learn React, Node.js, and PostgreSQL",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-06-15T00:00:00.000Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Full Stack Web Development",
  "studentInviteLink": "unique-token",
  "facilitatorInviteLink": "unique-token",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Invite Facilitator
```http
POST /admin/invite-facilitator
```

**Body:**
```json
{
  "email": "facilitator@example.com",
  "name": "Jane Facilitator"
}
```

**Response:**
```json
{
  "facilitator": {
    "id": "uuid",
    "email": "facilitator@example.com",
    "accessCode": "ABC123"
  },
  "message": "Facilitator invited successfully"
}
```

### Bulk Invite Students
```http
POST /admin/invite-students
```

**Body:**
```json
{
  "cohortId": "uuid",
  "emails": [
    "student1@example.com",
    "student2@example.com"
  ]
}
```

**Response:**
```json
{
  "invited": 2,
  "failed": 0,
  "inviteLink": "unique-token"
}
```

### List Facilitators
```http
GET /admin/facilitators
```

**Response:**
```json
{
  "facilitators": [
    {
      "id": "uuid",
      "name": "Jane Facilitator",
      "email": "facilitator@example.com",
      "accessCode": "ABC123",
      "cohortCount": 3
    }
  ]
}
```

### List Students
```http
GET /admin/students
```

**Query Parameters:**
- `cohortId` (optional): Filter by cohort

**Response:**
```json
{
  "students": [
    {
      "id": "uuid",
      "name": "John Student",
      "email": "student@example.com",
      "cohorts": ["Cohort 1", "Cohort 2"]
    }
  ]
}
```

---

## Facilitator

### Get Facilitator's Cohorts
```http
GET /facilitator/cohorts
```

**Headers:**
```
Authorization: Bearer <facilitator-token>
```

**Response:**
```json
{
  "cohorts": [
    {
      "id": "uuid",
      "name": "Full Stack Web Development",
      "studentCount": 25,
      "assignmentCount": 10
    }
  ]
}
```

### Get Cohort Overview
```http
GET /facilitator/cohort/:cohortId
```

**Response:**
```json
{
  "cohort": {
    "id": "uuid",
    "name": "Full Stack Web Development",
    "description": "...",
    "members": [...],
    "assignments": [...],
    "forumPosts": [...]
  }
}
```

### Create Assignment
```http
POST /facilitator/assignments
```

**Body:**
```json
{
  "title": "Build a REST API",
  "description": "Create a RESTful API using Node.js and Express",
  "dueDate": "2024-02-01T23:59:59.000Z",
  "maxScore": 100,
  "cohortId": "uuid"
}
```

**Response:**
```json
{
  "assignment": {
    "id": "uuid",
    "title": "Build a REST API",
    "status": "DRAFT",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Grade Submission
```http
PUT /facilitator/grade/:submissionId
```

**Body:**
```json
{
  "grade": 95,
  "feedback": "Excellent work! Great code structure and documentation."
}
```

**Response:**
```json
{
  "submission": {
    "id": "uuid",
    "grade": 95,
    "feedback": "...",
    "gradedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Cohorts

### List Cohorts
```http
GET /cohorts
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

**Response:**
```json
{
  "cohorts": [...],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

### Get Cohort Details
```http
GET /cohorts/:id
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Full Stack Web Development",
  "description": "...",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-06-15T00:00:00.000Z",
  "members": [...],
  "assignments": [...]
}
```

### Update Cohort
```http
PUT /cohorts/:id
```

**Body:**
```json
{
  "name": "Updated Cohort Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "cohort": { ... }
}
```

### Archive Cohort
```http
DELETE /cohorts/:id
```

**Response:**
```json
{
  "message": "Cohort archived successfully"
}
```

---

## Assignments

### List Assignments
```http
GET /assignments
```

**Query Parameters:**
- `cohortId` (optional)
- `status` (optional): DRAFT, PUBLISHED, ARCHIVED

**Response:**
```json
{
  "assignments": [
    {
      "id": "uuid",
      "title": "Build a REST API",
      "dueDate": "2024-02-01T23:59:59.000Z",
      "status": "PUBLISHED",
      "submissionCount": 20
    }
  ]
}
```

### Get Assignment Details
```http
GET /assignments/:id
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Build a REST API",
  "description": "...",
  "dueDate": "2024-02-01T23:59:59.000Z",
  "maxScore": 100,
  "submissions": [...]
}
```

### Submit Assignment
```http
POST /assignments/:id/submit
```

**Body:**
```json
{
  "githubUrl": "https://github.com/username/repo",
  "files": ["file1.pdf", "file2.pdf"]
}
```

**Response:**
```json
{
  "submission": {
    "id": "uuid",
    "assignmentId": "uuid",
    "githubUrl": "...",
    "submittedAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Update Assignment
```http
PUT /assignments/:id
```

**Body:**
```json
{
  "title": "Updated Title",
  "status": "PUBLISHED"
}
```

**Response:**
```json
{
  "assignment": { ... }
}
```

---

## Gamification

### Get User Stats
```http
GET /gamification/stats
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "points": {
    "totalPoints": 450,
    "assignmentPoints": 300,
    "forumPoints": 100,
    "attendancePoints": 50
  },
  "badges": [
    {
      "id": "uuid",
      "type": "FIRST_ASSIGNMENT",
      "name": "First Steps",
      "icon": "🎯",
      "earnedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "streak": {
    "currentStreak": 7,
    "longestStreak": 15,
    "lastActivityDate": "2024-01-20T00:00:00.000Z"
  }
}
```

### Get Leaderboard
```http
GET /gamification/leaderboard/:cohortId
```

**Query Parameters:**
- `timeframe` (optional): weekly, monthly, alltime

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "id": "uuid",
        "name": "John Student",
        "avatar": "url"
      },
      "totalPoints": 850
    }
  ]
}
```

### Get User Badges
```http
GET /gamification/badges
```

**Response:**
```json
{
  "badges": [
    {
      "id": "uuid",
      "type": "PERFECT_SCORE",
      "name": "Perfect Score",
      "description": "Achieved 100% on an assignment",
      "icon": "💯",
      "earnedAt": "2024-01-18T00:00:00.000Z"
    }
  ]
}
```

### Get Streak Data
```http
GET /gamification/streak
```

**Response:**
```json
{
  "currentStreak": 7,
  "longestStreak": 15,
  "lastActivityDate": "2024-01-20T00:00:00.000Z",
  "calendar": {
    "2024-01-15": true,
    "2024-01-16": true,
    "2024-01-17": false
  }
}
```

---

## Analytics

### Get Admin Analytics
```http
GET /analytics/admin
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "overview": {
    "totalUsers": 150,
    "activeUsers": 120,
    "totalCohorts": 5,
    "averageGrade": 82.5
  },
  "growth": {
    "newUsers": 25,
    "newCohorts": 2
  },
  "activityTrend": [...]
}
```

### Get Facilitator Analytics
```http
GET /analytics/facilitator/:cohortId
```

**Response:**
```json
{
  "submissionStats": [
    {
      "assignmentId": "uuid",
      "title": "Build a REST API",
      "totalStudents": 25,
      "submissions": 20,
      "rate": 80
    }
  ],
  "gradeDistribution": {
    "A": 5,
    "B": 10,
    "C": 7,
    "D": 2,
    "F": 1
  },
  "atRiskStudents": [
    {
      "studentId": "uuid",
      "avgGrade": 65,
      "submissionRate": 45,
      "isAtRisk": true
    }
  ]
}
```

### Get Student Progress
```http
GET /analytics/student
```

**Headers:**
```
Authorization: Bearer <student-token>
```

**Response:**
```json
{
  "gradeHistory": [
    {
      "date": "2024-01-15T00:00:00.000Z",
      "grade": 85,
      "assignment": "Build a REST API"
    }
  ],
  "completionRate": 75,
  "avgGrade": 82.5,
  "totalSubmissions": 8,
  "attendanceCount": 20,
  "points": 450
}
```

---

## AI Features

### Get Study Recommendations
```http
GET /ai/recommendations
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "recommendations": [
    "📚 Consider scheduling study sessions to review challenging concepts",
    "⏰ Work on time management - try breaking assignments into smaller tasks",
    "💬 Engage more in the forum - asking and answering questions reinforces learning"
  ]
}
```

### Generate Assignment Feedback
```http
GET /ai/feedback/:submissionId
```

**Response:**
```json
{
  "feedback": "Excellent work! Your code demonstrates strong understanding of RESTful principles. The API endpoints are well-structured and follow best practices. Consider adding more comprehensive error handling and input validation. Great job on the documentation!"
}
```

### Analyze Code
```http
POST /ai/analyze-code
```

**Body:**
```json
{
  "code": "function hello() { console.log('Hello'); }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "complexity": "low",
  "suggestions": [
    "Add comments to explain complex logic",
    "Consider breaking down into smaller functions"
  ],
  "strengths": [
    "Good code length and structure",
    "Well-documented code with helpful comments"
  ]
}
```

### Generate Quiz
```http
POST /ai/generate-quiz
```

**Body:**
```json
{
  "topic": "JavaScript Promises",
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "What is a Promise in JavaScript?",
      "options": [
        "An object representing eventual completion of an async operation",
        "A synchronous function",
        "A variable type",
        "A loop structure"
      ],
      "correctAnswer": 0,
      "explanation": "A Promise is an object that represents the eventual completion or failure of an asynchronous operation."
    }
  ]
}
```

---

## GitHub

### Validate GitHub URL
```http
POST /github/validate
```

**Body:**
```json
{
  "url": "https://github.com/username/repo"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "Valid GitHub repository URL"
}
```

### Get Repository Info
```http
GET /github/repo-info
```

**Query Parameters:**
- `url`: GitHub repository URL

**Response:**
```json
{
  "name": "my-project",
  "description": "A cool project",
  "owner": "username",
  "stars": 42,
  "forks": 10,
  "language": "JavaScript",
  "lastCommit": {
    "message": "Update README",
    "date": "2024-01-20T10:30:00.000Z",
    "author": "username"
  },
  "readme": "# My Project\n\nThis is a cool project..."
}
```

---

## Forum

### List Forum Posts
```http
GET /forum/posts
```

**Query Parameters:**
- `cohortId` (optional)
- `solved` (optional): true/false
- `tag` (optional)

**Response:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "How to use async/await?",
      "content": "...",
      "tags": ["javascript", "async"],
      "solved": false,
      "views": 25,
      "answerCount": 3,
      "createdAt": "2024-01-20T00:00:00.000Z"
    }
  ]
}
```

### Create Forum Post
```http
POST /forum/posts
```

**Body:**
```json
{
  "title": "How to use async/await?",
  "content": "I'm having trouble understanding async/await...",
  "tags": ["javascript", "async"],
  "cohortId": "uuid"
}
```

**Response:**
```json
{
  "post": {
    "id": "uuid",
    "title": "How to use async/await?",
    "createdAt": "2024-01-20T00:00:00.000Z"
  }
}
```

### Get Post Details
```http
GET /forum/posts/:id
```

**Response:**
```json
{
  "id": "uuid",
  "title": "How to use async/await?",
  "content": "...",
  "tags": ["javascript", "async"],
  "user": {
    "id": "uuid",
    "name": "John Student"
  },
  "answers": [
    {
      "id": "uuid",
      "content": "...",
      "isCorrect": true,
      "endorsements": 5,
      "user": { ... }
    }
  ],
  "solved": true,
  "views": 25
}
```

### Post Answer
```http
POST /forum/posts/:id/answers
```

**Body:**
```json
{
  "content": "Async/await is syntactic sugar for Promises..."
}
```

**Response:**
```json
{
  "answer": {
    "id": "uuid",
    "content": "...",
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### Mark as Solved
```http
PUT /forum/posts/:id/solve
```

**Body:**
```json
{
  "answerId": "uuid"
}
```

**Response:**
```json
{
  "message": "Post marked as solved"
}
```

### Endorse Answer
```http
PUT /forum/answers/:id/endorse
```

**Response:**
```json
{
  "answer": {
    "id": "uuid",
    "endorsements": 6
  }
}
```

---

## Attendance

### Record Attendance
```http
POST /attendance
```

**Body:**
```json
{
  "cohortId": "uuid",
  "userId": "uuid",
  "date": "2024-01-20T00:00:00.000Z",
  "status": "PRESENT",
  "notes": "Participated actively"
}
```

**Response:**
```json
{
  "attendance": {
    "id": "uuid",
    "status": "PRESENT",
    "createdAt": "2024-01-20T00:00:00.000Z"
  }
}
```

### Get Attendance Records
```http
GET /attendance
```

**Query Parameters:**
- `cohortId` (optional)
- `userId` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Response:**
```json
{
  "records": [
    {
      "id": "uuid",
      "date": "2024-01-20T00:00:00.000Z",
      "status": "PRESENT",
      "notes": "..."
    }
  ]
}
```

### Get Cohort Attendance
```http
GET /attendance/cohort/:cohortId
```

**Response:**
```json
{
  "attendance": [
    {
      "date": "2024-01-20",
      "present": 20,
      "absent": 3,
      "late": 2,
      "excused": 0
    }
  ]
}
```

### Get User Attendance
```http
GET /attendance/user/:userId
```

**Response:**
```json
{
  "attendance": [
    {
      "date": "2024-01-20T00:00:00.000Z",
      "status": "PRESENT",
      "cohort": "Full Stack Web Development"
    }
  ],
  "stats": {
    "present": 18,
    "absent": 2,
    "late": 1,
    "rate": 90
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limits

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes per IP
- **File Upload**: 10 uploads per hour per user

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Webhooks (Coming Soon)

Future support for webhooks to notify external services of events:
- New assignment created
- Submission graded
- Badge earned
- Forum post answered

---

For more information, visit the [GitHub repository](https://github.com/your-repo/skilllink-platform).
