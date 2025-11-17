import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as aiController from '../controllers/ai.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get personalized study recommendations
router.get('/recommendations', aiController.getStudyRecommendations);

// Generate AI feedback for submission
router.get('/feedback/:submissionId', aiController.generateAssignmentFeedback);

// Analyze code submission
router.post('/analyze-code', aiController.analyzeCode);

// Generate quiz questions
router.post('/generate-quiz', aiController.generateQuiz);

export default router;
