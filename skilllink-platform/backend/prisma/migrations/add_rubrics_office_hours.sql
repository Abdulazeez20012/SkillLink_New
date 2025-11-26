-- Add Rubric table
CREATE TABLE IF NOT EXISTS "Rubric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Rubric_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add RubricCriteria table
CREATE TABLE IF NOT EXISTS "RubricCriteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rubricId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxPoints" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RubricCriteria_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "Rubric" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add OfficeHours table
CREATE TABLE IF NOT EXISTS "OfficeHours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilitatorId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "meetingUrl" TEXT,
    "maxAttendees" INTEGER,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrencePattern" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OfficeHours_facilitatorId_fkey" FOREIGN KEY ("facilitatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OfficeHours_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add OfficeHoursBooking table
CREATE TABLE IF NOT EXISTS "OfficeHoursBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officeHoursId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OfficeHoursBooking_officeHoursId_fkey" FOREIGN KEY ("officeHoursId") REFERENCES "OfficeHours" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OfficeHoursBooking_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add PeerReview table
CREATE TABLE IF NOT EXISTS "PeerReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "rating" INTEGER,
    "feedback" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PeerReview_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PeerReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add peerReviewEnabled to Assignment
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Assignment' AND column_name = 'peerReviewEnabled'
    ) THEN
        ALTER TABLE "Assignment" ADD COLUMN "peerReviewEnabled" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Assignment' AND column_name = 'peerReviewCount'
    ) THEN
        ALTER TABLE "Assignment" ADD COLUMN "peerReviewCount" INTEGER NOT NULL DEFAULT 2;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "Rubric_assignmentId_idx" ON "Rubric"("assignmentId");
CREATE INDEX IF NOT EXISTS "RubricCriteria_rubricId_idx" ON "RubricCriteria"("rubricId");
CREATE INDEX IF NOT EXISTS "OfficeHours_facilitatorId_idx" ON "OfficeHours"("facilitatorId");
CREATE INDEX IF NOT EXISTS "OfficeHours_cohortId_idx" ON "OfficeHours"("cohortId");
CREATE INDEX IF NOT EXISTS "OfficeHours_startTime_idx" ON "OfficeHours"("startTime");
CREATE INDEX IF NOT EXISTS "OfficeHoursBooking_officeHoursId_idx" ON "OfficeHoursBooking"("officeHoursId");
CREATE INDEX IF NOT EXISTS "OfficeHoursBooking_studentId_idx" ON "OfficeHoursBooking"("studentId");
CREATE INDEX IF NOT EXISTS "PeerReview_submissionId_idx" ON "PeerReview"("submissionId");
CREATE INDEX IF NOT EXISTS "PeerReview_reviewerId_idx" ON "PeerReview"("reviewerId");

-- Add unique constraint for peer reviews
CREATE UNIQUE INDEX IF NOT EXISTS "PeerReview_submissionId_reviewerId_key" ON "PeerReview"("submissionId", "reviewerId");

-- Add unique constraint for office hours bookings
CREATE UNIQUE INDEX IF NOT EXISTS "OfficeHoursBooking_officeHoursId_studentId_key" ON "OfficeHoursBooking"("officeHoursId", "studentId");
