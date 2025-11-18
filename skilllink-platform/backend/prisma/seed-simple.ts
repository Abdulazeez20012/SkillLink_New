import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { generateAccessCode, generateInviteToken } from '../src/utils/generateCode';

dotenv.config();

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/skilllink';

async function main() {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('🌱 Seeding database...');
    
    const db = client.db();
    
    // Create Super Admin
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const existingAdmin = await db.collection('User').findOne({ email: 'admin@skilllink.com' });
    
    let admin;
    if (!existingAdmin) {
      const result = await db.collection('User').insertOne({
        email: 'admin@skilllink.com',
        password: adminPassword,
        name: 'Super Admin',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      admin = { _id: result.insertedId, email: 'admin@skilllink.com' };
      console.log('✅ Created admin:', admin.email);
    } else {
      admin = existingAdmin;
      console.log('ℹ️  Admin already exists:', admin.email);
    }
    
    // Create Facilitator
    const facilitatorPassword = await bcrypt.hash('Facilitator123!', 12);
    const existingFacilitator = await db.collection('User').findOne({ email: 'facilitator@skilllink.com' });
    
    let facilitator;
    if (!existingFacilitator) {
      const accessCode = generateAccessCode();
      const result = await db.collection('User').insertOne({
        email: 'facilitator@skilllink.com',
        password: facilitatorPassword,
        name: 'AbuDhabi Facilitator',
        role: 'FACILITATOR',
        accessCode: accessCode,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      facilitator = { _id: result.insertedId, email: 'facilitator@skilllink.com', accessCode };
      console.log('✅ Created facilitator:', facilitator.email, '| Access Code:', facilitator.accessCode);
    } else {
      facilitator = existingFacilitator;
      console.log('ℹ️  Facilitator already exists:', facilitator.email);
    }
    
    // Create Sample Cohort
    const existingCohort = await db.collection('Cohort').findOne({ name: 'Full Stack Web Development - Cohort 1' });
    
    let cohort;
    if (!existingCohort) {
      const studentInvite = generateInviteToken();
      const facilitatorInvite = generateInviteToken();
      const result = await db.collection('Cohort').insertOne({
        name: 'Full Stack Web Development - Cohort 1',
        description: 'Learn modern web development with React, Node.js, and PostgreSQL',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-15'),
        createdById: admin._id,
        studentInviteLink: studentInvite,
        facilitatorInviteLink: facilitatorInvite,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      cohort = { _id: result.insertedId, studentInviteLink: studentInvite, facilitatorInviteLink: facilitatorInvite };
      console.log('✅ Created cohort: Full Stack Web Development - Cohort 1');
      console.log('   Student Invite:', cohort.studentInviteLink);
      console.log('   Facilitator Invite:', cohort.facilitatorInviteLink);
    } else {
      cohort = existingCohort;
      console.log('ℹ️  Cohort already exists');
    }
    
    // Add facilitator to cohort
    const existingMembership = await db.collection('CohortUser').findOne({
      cohortId: cohort._id,
      userId: facilitator._id
    });
    
    if (!existingMembership) {
      await db.collection('CohortUser').insertOne({
        cohortId: cohort._id,
        userId: facilitator._id,
        role: 'FACILITATOR',
        joinedAt: new Date()
      });
      console.log('✅ Added facilitator to cohort');
    }
    
    // Create Badges
    const badges = [
      { type: 'FIRST_ASSIGNMENT', name: 'First Steps', description: 'Submitted your first assignment', icon: '🎯' },
      { type: 'PERFECT_SCORE', name: 'Perfect Score', description: 'Achieved a perfect score on an assignment', icon: '💯' },
      { type: 'HELPFUL_CONTRIBUTOR', name: 'Helpful Contributor', description: 'Answered 10 forum questions', icon: '🤝' },
      { type: 'ATTENDANCE_STREAK_5', name: '5-Day Streak', description: 'Attended 5 consecutive days', icon: '🔥' },
      { type: 'ATTENDANCE_STREAK_10', name: '10-Day Streak', description: 'Attended 10 consecutive days', icon: '⚡' },
      { type: 'ATTENDANCE_STREAK_20', name: '20-Day Streak', description: 'Attended 20 consecutive days', icon: '🌟' },
      { type: 'TOP_PERFORMER', name: 'Top Performer', description: 'Ranked in top 10 of leaderboard', icon: '🏆' },
      { type: 'EARLY_BIRD', name: 'Early Bird', description: 'Submitted assignment before due date', icon: '🐦' },
      { type: 'FORUM_EXPERT', name: 'Forum Expert', description: 'Answered 50 forum questions', icon: '🎓' }
    ];
    
    for (const badge of badges) {
      const existing = await db.collection('Badge').findOne({ type: badge.type });
      if (!existing) {
        await db.collection('Badge').insertOne({
          ...badge,
          createdAt: new Date()
        });
      }
    }
    console.log('✅ Created badges');
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: admin@skilllink.com / Admin123!');
    console.log('   Facilitator: facilitator@skilllink.com / Facilitator123!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
