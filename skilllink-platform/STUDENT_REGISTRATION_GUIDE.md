# 🎓 Student Registration Testing Guide

## ✅ What I Fixed

1. **URL Format Mismatch**: Changed invite link from `/student/register/{token}` to `/register/student/{token}`
2. **Authentication Guard**: Removed redirect when accessing registration page while logged in
3. **Logout Option**: Added ability to logout from registration page if already logged in

---

## 🧪 How to Test Student Registration

### Method 1: Using Incognito Window (Recommended)

1. **In your main browser (as Admin)**:
   - Login to admin dashboard
   - Go to "Cohorts Management"
   - Find a cohort and copy the "Student Invite Link"
   - Example: `http://localhost:5173/register/student/abc123xyz`

2. **Open Incognito/Private Window**:
   - Paste the invite link
   - You should see the student registration page
   - Fill in the form:
     - Full Name
     - Email
     - Password
     - Confirm Password
   - Click "Sign Up"
   - You'll be automatically logged in as the student

### Method 2: Logout and Register (Same Browser)

1. **As Admin**:
   - Copy the student invite link from cohort management

2. **Paste the link in the same browser**:
   - You'll see a yellow banner: "You're currently logged in as [Your Name] (ADMIN)"
   - Click "Logout to register a new account"
   - Form becomes enabled
   - Fill in the registration form
   - Click "Sign Up"

---

## 🔍 Troubleshooting

### Error: "Invalid invite link"

**Possible causes:**
1. **No token in URL** - Make sure the URL has the token at the end
   - ❌ Wrong: `http://localhost:5173/register/student`
   - ✅ Correct: `http://localhost:5173/register/student/abc123xyz`

2. **Token doesn't exist in database** - The cohort might not have been created properly
   - Solution: Create a new cohort in admin dashboard

3. **Cohort is inactive** - The cohort must be active
   - Solution: Check cohort status in admin dashboard

### Error: "Email already registered"

**Solution:** Use a different email address or login with existing credentials

### Error: "Already enrolled in this cohort"

**Solution:** You're already a member of this cohort. Just login normally at `/login`

---

## 📝 Complete Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN CREATES COHORT                      │
├─────────────────────────────────────────────────────────────┤
│ 1. Admin logs in                                             │
│ 2. Goes to "Cohorts Management"                              │
│ 3. Clicks "Create Cohort"                                    │
│ 4. Fills form and submits                                    │
│ 5. Cohort is created with unique invite link                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  ADMIN SHARES INVITE LINK                    │
├─────────────────────────────────────────────────────────────┤
│ Option A: Copy link and share manually                       │
│ Option B: Use "Invite Students" for bulk email               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  STUDENT RECEIVES LINK                       │
├─────────────────────────────────────────────────────────────┤
│ Format: http://localhost:5173/register/student/{TOKEN}      │
│ Example: http://localhost:5173/register/student/abc123      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  STUDENT CLICKS LINK                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Opens registration page                                   │
│ 2. Sees cohort-specific registration form                    │
│ 3. Fills in: Name, Email, Password                           │
│ 4. Clicks "Sign Up"                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND VALIDATES                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Checks if token matches a cohort                          │
│ 2. Checks if cohort is active                                │
│ 3. Checks if email already exists                            │
│ 4. Creates user account                                      │
│ 5. Enrolls user in cohort                                    │
│ 6. Returns access token                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  STUDENT IS LOGGED IN                        │
├─────────────────────────────────────────────────────────────┤
│ 1. Automatically logged in                                   │
│ 2. Redirected to student dashboard                           │
│ 3. Can see assignments, progress, etc.                       │
│ 4. Enrolled in the cohort                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Test Checklist

- [ ] Admin can create a cohort
- [ ] Invite link is generated correctly
- [ ] Invite link can be copied
- [ ] Opening link shows registration page
- [ ] Registration form works
- [ ] Student is auto-enrolled in cohort
- [ ] Student is redirected to dashboard
- [ ] Student can see cohort in their dashboard

---

## 🔗 Important URLs

| Purpose | URL |
|---------|-----|
| Admin Register | `http://localhost:5173/admin/register` |
| Admin/Student Login | `http://localhost:5173/login` |
| Facilitator Login | `http://localhost:5173/facilitator/login` |
| Student Register | `http://localhost:5173/register/student/{TOKEN}` |

---

## 💡 Pro Tips

1. **Use different browsers** for testing different user roles simultaneously
2. **Use incognito mode** to test registration without logging out
3. **Check browser console** for any errors if something doesn't work
4. **Check backend logs** to see what's happening on the server
5. **Regenerate invite links** if you think a token is invalid

---

## 🐛 Still Having Issues?

1. **Check if backend is running**: `http://localhost:3000/api`
2. **Check if frontend is running**: `http://localhost:5173`
3. **Check database connection**: Make sure Neon database is awake
4. **Check browser console**: Look for JavaScript errors
5. **Check network tab**: See if API calls are failing

---

*Last Updated: November 19, 2025*
