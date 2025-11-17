import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import prisma from '../config/database';
import redis from '../config/redis';
import { AppError } from '../middleware/error.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { generateAccessCode } from '../utils/generateCode';

export class AuthService {
  // Admin Registration (First user becomes super admin)
  async registerAdmin(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const userCount = await prisma.user.count({ where: { role: UserRole.ADMIN } });
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.ADMIN
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    await this.storeRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  // Facilitator Login with Access Code
  async facilitatorLogin(email: string, password: string, accessCode: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== UserRole.FACILITATOR) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.accessCode !== accessCode) {
      throw new AppError('Invalid access code', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive', 403);
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    await this.storeRefreshToken(user.id, refreshToken);

    const { password: _, accessCode: __, ...userWithoutSensitive } = user;

    return { user: userWithoutSensitive, accessToken, refreshToken };
  }

  // Student Registration via Invite Link
  async registerStudent(email: string, password: string, name: string, inviteToken: string) {
    const cohort = await prisma.cohort.findFirst({
      where: { studentInviteLink: inviteToken, isActive: true }
    });

    if (!cohort) {
      throw new AppError('Invalid or expired invite link', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      // Check if already enrolled
      const enrollment = await prisma.cohortUser.findUnique({
        where: {
          cohortId_userId: {
            cohortId: cohort.id,
            userId: existingUser.id
          }
        }
      });

      if (enrollment) {
        throw new AppError('Already enrolled in this cohort', 400);
      }

      // Enroll existing user
      await prisma.cohortUser.create({
        data: {
          cohortId: cohort.id,
          userId: existingUser.id,
          role: 'STUDENT'
        }
      });

      const accessToken = generateAccessToken({
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role
      });

      const refreshToken = generateRefreshToken({
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role
      });

      await this.storeRefreshToken(existingUser.id, refreshToken);

      const { password: _, ...userWithoutPassword } = existingUser;

      return { user: userWithoutPassword, accessToken, refreshToken };
    }

    // Create new student user
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.STUDENT,
        cohortMemberships: {
          create: {
            cohortId: cohort.id,
            role: 'STUDENT'
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    await this.storeRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  // Standard Login
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive', 403);
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    await this.storeRefreshToken(user.id, refreshToken);

    const { password: _, accessCode, ...userWithoutSensitive } = user;

    return { user: userWithoutSensitive, accessToken, refreshToken };
  }

  // Refresh Token
  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      // Check if token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken }
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 401);
      }

      const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const newRefreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Delete old refresh token
      await prisma.refreshToken.delete({ where: { token: refreshToken } });

      // Store new refresh token
      await this.storeRefreshToken(user.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  // Logout
  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { message: 'Logged out successfully' };
  }

  // Store refresh token
  private async storeRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  }

  // Create Facilitator with Access Code
  async createFacilitator(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const accessCode = generateAccessCode();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.FACILITATOR,
        accessCode
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        accessCode: true,
        createdAt: true
      }
    });

    return user;
  }
}
