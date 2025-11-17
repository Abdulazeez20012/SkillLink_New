import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import prisma from '../config/database';

const aiService = new AIService();

export const getStudyRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const recommendations = await aiService.generateStudyRecommendations(userId);
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Get study recommendations error:', error);
    res.status(500).json({ message: 'Failed to generate recommendations' });
  }
};

export const generateAssignmentFeedback = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
        user: true
      }
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check authorization
    if (req.user!.role !== 'FACILITATOR' && req.user!.role !== 'ADMIN' && submission.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const feedback = await aiService.generateAssignmentFeedback(
      submission.assignment.title,
      submission.assignment.description,
      submission.githubUrl || 'No content provided',
      submission.grade || undefined
    );

    res.json({ feedback });
  } catch (error) {
    console.error('Generate feedback error:', error);
    res.status(500).json({ message: 'Failed to generate feedback' });
  }
};

export const analyzeCode = async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    const analysis = await aiService.analyzeCodeSubmission(code, language || 'javascript');
    
    res.json(analysis);
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze code' });
  }
};

export const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const questions = await aiService.generateQuizQuestions(
      topic,
      difficulty || 'medium'
    );
    
    res.json({ questions });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ message: 'Failed to generate quiz' });
  }
};
