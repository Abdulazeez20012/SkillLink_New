-- Add Certificate table
CREATE TABLE IF NOT EXISTS "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL UNIQUE,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Certificate_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add Resource table
CREATE TABLE IF NOT EXISTS "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cohortId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Resource_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add ResourceView table for tracking
CREATE TABLE IF NOT EXISTS "ResourceView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResourceView_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ResourceView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add allowResubmission to Assignment table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Assignment' AND column_name = 'allowResubmission'
    ) THEN
        ALTER TABLE "Assignment" ADD COLUMN "allowResubmission" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "Certificate_userId_idx" ON "Certificate"("userId");
CREATE INDEX IF NOT EXISTS "Certificate_cohortId_idx" ON "Certificate"("cohortId");
CREATE INDEX IF NOT EXISTS "Certificate_verificationCode_idx" ON "Certificate"("verificationCode");

CREATE INDEX IF NOT EXISTS "Resource_cohortId_idx" ON "Resource"("cohortId");
CREATE INDEX IF NOT EXISTS "Resource_category_idx" ON "Resource"("category");

CREATE INDEX IF NOT EXISTS "ResourceView_resourceId_idx" ON "ResourceView"("resourceId");
CREATE INDEX IF NOT EXISTS "ResourceView_userId_idx" ON "ResourceView"("userId");
