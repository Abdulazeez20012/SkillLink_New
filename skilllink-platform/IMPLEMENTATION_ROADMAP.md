# SkillLink - Implementation Roadmap

## 🎯 Priority 1: Assignment System (CRITICAL)

### 1.1 Assignment Creation (Facilitator)
**Files to create/modify:**
- `frontend/src/components/facilitator/AssignmentCreateModal.tsx`
- `frontend/src/services/assignment.service.ts`

**Implementation:**
```typescript
// Assignment form fields:
- title (string)
- description (textarea)
- dueDate (date)
- maxPoints (number)
- cohortId (select from facilitator's cohorts)
- attachments (file upload - optional)
```

**Backend already exists:** `backend/src/controllers/assignment.controller.ts`

### 1.2 Assignment List View (Facilitator)
**Update:** `frontend/src/pages/facilitator/CohortDetail.tsx`

Add tab for "Assignments" showing:
- List of all assignments for the cohort
- Create new assignment button
- Edit/Delete assignment actions
- View submissions count

### 1.3 Student Assignment View
**Update:** `frontend/src/pages/student/StudentAssignments.tsx`

Show:
- List of all assignments from student's cohorts
- Filter by: All, Pending, Submitted, Graded
- Due date countdown
- Submission status
- Grade (if graded)

### 1.4 Assignment Submission
**Create:** `frontend/src/components/student/AssignmentSubmissionModal.tsx`

Features:
- Text submission (textarea)
- File upload
- GitHub URL (optional)
- Submit button
- View previous submission

### 1.5 Assignment Grading
**Create:** `frontend/src/components/facilitator/AssignmentGradingModal.tsx`

Features:
- View student submission
- Download attachments
- Grade input (0-maxPoints)
- Feedback textarea
- Submit grade button

---

## 🎯 Priority 2: Attendance System

### 2.1 Mark Attendance (Facilitator)
**Create:** `frontend/src/components/facilitator/AttendanceMarker.tsx`

Features:
- Date selector
- List of students in cohort
- Checkboxes for Present/Absent
- Bulk actions (Mark all present)
- Save attendance

### 2.2 View Attendance (Student)
**Update:** `frontend/src/pages/student/StudentProgress.tsx`

Add section showing:
- Attendance percentage
- Calendar view with present/absent days
- Total days present/absent

### 2.3 Attendance Reports (Facilitator)
**Create:** `frontend/src/components/facilitator/AttendanceReport.tsx`

Features:
- Date range selector
- Student-wise attendance table
- Export to CSV
- Visual charts

---

## 🎯 Priority 3: Enhanced Features

### 3.1 Leaderboard
**Create:** `frontend/src/pages/student/Leaderboard.tsx`

Features:
- Top 10 students by points
- Current user's rank
- Points breakdown
- Filter by cohort

### 3.2 Announcements
**Create:** `frontend/src/components/announcements/`

Features:
- Create announcement (Facilitator/Admin)
- View announcements (All users)
- Mark as read
- Pin important announcements

### 3.3 Discussion Forum
**Create:** `frontend/src/pages/forum/`

Features:
- Create thread
- Reply to thread
- Like/Upvote
- Search threads
- Categories

---

## 📝 Quick Implementation Guide

### Step 1: Assignment Creation

1. **Create the modal component:**
```bash
# Create file: frontend/src/components/facilitator/AssignmentCreateModal.tsx
```

2. **Add to Cohort Detail page:**
```typescript
// In CohortDetail.tsx
import AssignmentCreateModal from '../../components/facilitator/AssignmentCreateModal';

// Add button
<button onClick={() => setShowAssignmentModal(true)}>
  Create Assignment
</button>
```

3. **Create service:**
```typescript
// frontend/src/services/assignment.service.ts
export const assignmentService = {
  async createAssignment(data) {
    return api.post('/assignments', data);
  },
  async getAssignments(cohortId) {
    return api.get(`/cohorts/${cohortId}/assignments`);
  },
  // ... more methods
};
```

### Step 2: Student Assignment View

1. **Update StudentAssignments.tsx:**
```typescript
// Fetch assignments
const { data: assignments } = useQuery(() => 
  assignmentService.getMyAssignments()
);

// Display in cards
assignments.map(assignment => (
  <AssignmentCard 
    assignment={assignment}
    onSubmit={() => handleSubmit(assignment.id)}
  />
))
```

### Step 3: Submission System

1. **Create submission modal**
2. **Handle file upload** (use Cloudinary)
3. **Submit to backend**
4. **Show success message**

---

## 🔧 Backend Routes Already Available

### Assignments
- `POST /api/assignments` - Create assignment
- `GET /api/cohorts/:id/assignments` - Get cohort assignments
- `GET /api/assignments/:id` - Get assignment details
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

### Submissions
- `POST /api/assignments/:id/submit` - Submit assignment
- `GET /api/assignments/:id/submissions` - Get all submissions
- `PUT /api/submissions/:id/grade` - Grade submission

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/cohorts/:id/attendance` - Get cohort attendance
- `GET /api/students/:id/attendance` - Get student attendance

---

## 💡 Implementation Tips

### File Upload
Use Cloudinary (already configured):
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', 'your_preset');

const response = await fetch(
  `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
  { method: 'POST', body: formData }
);
```

### Date Handling
```typescript
import { format, formatDistanceToNow } from 'date-fns';

// Format date
format(new Date(dueDate), 'MMM dd, yyyy');

// Time until due
formatDistanceToNow(new Date(dueDate), { addSuffix: true });
```

### Loading States
Always add loading states:
```typescript
const [loading, setLoading] = useState(false);

// In submit handler
setLoading(true);
try {
  await service.submit(data);
  toast.success('Success!');
} catch (error) {
  toast.error('Failed');
} finally {
  setLoading(false);
}
```

---

## 📊 Estimated Time

| Feature | Time | Priority |
|---------|------|----------|
| Assignment Creation | 4 hours | HIGH |
| Assignment Viewing | 2 hours | HIGH |
| Assignment Submission | 4 hours | HIGH |
| Assignment Grading | 3 hours | HIGH |
| Attendance System | 6 hours | MEDIUM |
| Leaderboard | 2 hours | MEDIUM |
| Announcements | 4 hours | LOW |
| Discussion Forum | 8 hours | LOW |

**Total for MVP (Assignments + Attendance):** ~19 hours

---

## 🚀 Next Steps

1. Start with **Assignment Creation Modal**
2. Test with real data
3. Move to **Student Assignment View**
4. Implement **Submission System**
5. Add **Grading Interface**
6. Test complete workflow
7. Move to Attendance

---

*This roadmap provides a clear path to complete the platform. Follow it step by step for best results.*
