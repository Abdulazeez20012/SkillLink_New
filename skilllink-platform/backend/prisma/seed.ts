import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { generateAccessCode, generateInviteToken } from '../src/utils/generateCode';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Super Admin
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  let admin = await prisma.user.findFirst({
    where: { email: 'admin@skilllink.com' }
  });
  
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@skilllink.com',
        password: adminPassword,
        name: 'Super Admin',
        role: UserRole.ADMIN
      }
    });
    console.log('✅ Created admin:', admin.email);
  } else {
    console.log('ℹ️  Admin already exists:', admin.email);
  }

  // Create Facilitator
  const facilitatorPassword = await bcrypt.hash('Facilitator123!', 12);
  let facilitator = await prisma.user.findFirst({
    where: { email: 'facilitator@skilllink.com' }
  });
  
  if (!facilitator) {
    facilitator = await prisma.user.create({
      data: {
        email: 'facilitator@skilllink.com',
        password: facilitatorPassword,
        name: 'AbuDhabi Facilitator',
        role: UserRole.FACILITATOR,
        accessCode: generateAccessCode()
      }
    });
    console.log('✅ Created facilitator:', facilitator.email, '| Access Code:', facilitator.accessCode);
  } else {
    console.log('ℹ️  Facilitator already exists:', facilitator.email);
  }

  // Create Sample Cohort
  let cohort = await prisma.cohort.findFirst({
    where: { name: 'Full Stack Web Development - Cohort 1' }
  });
  
  if (!cohort) {
    cohort = await prisma.cohort.create({
      data: {
        name: 'Full Stack Web Development - Cohort 1',
        description: 'Learn modern web development with React, Node.js, and PostgreSQL',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-15'),
        createdById: admin.id,
        studentInviteLink: generateInviteToken(),
        facilitatorInviteLink: generateInviteToken()
      }
    });
    console.log('✅ Created cohort:', cohort.name);
    console.log('   Student Invite:', cohort.studentInviteLink);
    console.log('   Facilitator Invite:', cohort.facilitatorInviteLink);
  } else {
    console.log('ℹ️  Cohort already exists:', cohort.name);
  }

  // Add facilitator to cohort
  const existingMembership = await prisma.cohortUser.findFirst({
    where: {
      cohortId: cohort.id,
      userId: facilitator.id
    }
  });
  
  if (!existingMembership) {
    await prisma.cohortUser.create({
      data: {
        cohortId: cohort.id,
        userId: facilitator.id,
        role: 'FACILITATOR'
      }
    });
    console.log('✅ Added facilitator to cohort');
  }

  // Create Badges
  const badges = [
    {
      type: 'FIRST_ASSIGNMENT',
      name: 'First Steps',
      description: 'Submitted your first assignment',
      icon: '🎯'
    },
    {
      type: 'PERFECT_SCORE',
      name: 'Perfect Score',
      description: 'Achieved a perfect score on an assignment',
      icon: '💯'
    },
    {
      type: 'HELPFUL_CONTRIBUTOR',
      name: 'Helpful Contributor',
      description: 'Answered 10 forum questions',
      icon: '🤝'
    },
    {
      type: 'ATTENDANCE_STREAK_5',
      name: '5-Day Streak',
      description: 'Attended 5 consecutive days',
      icon: '🔥'
    },
    {
      type: 'ATTENDANCE_STREAK_10',
      name: '10-Day Streak',
      description: 'Attended 10 consecutive days',
      icon: '⚡'
    },
    {
      type: 'ATTENDANCE_STREAK_20',
      name: '20-Day Streak',
      description: 'Attended 20 consecutive days',
      icon: '🌟'
    },
    {
      type: 'TOP_PERFORMER',
      name: 'Top Performer',
      description: 'Ranked in top 10 of leaderboard',
      icon: '🏆'
    },
    {
      type: 'EARLY_BIRD',
      name: 'Early Bird',
      description: 'Submitted assignment before due date',
      icon: '🐦'
    },
    {
      type: 'FORUM_EXPERT',
      name: 'Forum Expert',
      description: 'Answered 50 forum questions',
      icon: '🎓'
    }
  ];

  for (const badge of badges) {
    const existing = await prisma.badge.findFirst({
      where: { type: badge.type as any }
    });
    
    if (!existing) {
      await prisma.badge.create({
        data: badge as any
      });
    }
  }
  console.log('✅ Created badges');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
