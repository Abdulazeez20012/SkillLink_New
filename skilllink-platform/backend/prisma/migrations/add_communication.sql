-- Add Announcements table
CREATE TABLE "Announcement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'NORMAL',
  "cohortId" TEXT,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE,
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Announcement_cohortId_idx" ON "Announcement"("cohortId");
CREATE INDEX "Announcement_createdById_idx" ON "Announcement"("createdById");
CREATE INDEX "Announcement_createdAt_idx" ON "Announcement"("createdAt");

-- Add Notifications table
CREATE TABLE "Notification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "link" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_read_idx" ON "Notification"("read");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- Add Messages table
CREATE TABLE "Message" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "senderId" TEXT NOT NULL,
  "receiverId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");
