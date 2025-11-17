import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const createPost = async (req: AuthRequest, res: Response) => {
  const { title, content, cohortId, tags } = req.body;
  const userId = req.user!.userId;

  const post = await prisma.forumPost.create({
    data: {
      title,
      content,
      cohortId,
      userId,
      tags: tags || []
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      cohort: { select: { id: true, name: true } }
    }
  });

  res.status(201).json({ success: true, data: post });
};

export const getPosts = async (req: AuthRequest, res: Response) => {
  const { cohortId, solved, tag } = req.query;
  const where: any = {};

  if (cohortId) where.cohortId = cohortId;
  if (solved !== undefined) where.solved = solved === 'true';
  if (tag) where.tags = { has: tag };

  const posts = await prisma.forumPost.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      cohort: { select: { id: true, name: true } },
      _count: { select: { answers: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ success: true, data: posts });
};

export const getPostById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const post = await prisma.forumPost.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      cohort: { select: { id: true, name: true } },
      answers: {
        include: {
          user: { select: { id: true, name: true, avatar: true } }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!post) throw new AppError('Post not found', 404);

  res.json({ success: true, data: post });
};

export const createAnswer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user!.userId;

  const answer = await prisma.forumAnswer.create({
    data: {
      postId: id,
      userId,
      content
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } }
    }
  });

  res.status(201).json({ success: true, data: answer });
};

export const markAsSolved = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const post = await prisma.forumPost.update({
    where: { id },
    data: { solved: true }
  });

  res.json({ success: true, data: post });
};

export const endorseAnswer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const answer = await prisma.forumAnswer.update({
    where: { id },
    data: { endorsements: { increment: 1 } }
  });

  res.json({ success: true, data: answer });
};
