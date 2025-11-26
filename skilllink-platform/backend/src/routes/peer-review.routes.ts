import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as peerReviewController from '../controllers/peer-review.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post(
  '/assign/:assignmentId',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  peerReviewController.assignPeerReviews
);

router.get('/my-reviews', peerReviewController.getMyPeerReviews);

router.post(
  '/:peerReviewId/submit',
  [
    body('feedback').trim().notEmpty(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    validate
  ],
  peerReviewController.submitPeerReview
);

router.get('/submission/:submissionId', peerReviewController.getPeerReviewsForSubmission);

router.get(
  '/stats/:assignmentId',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  peerReviewController.getPeerReviewStats
);

export default router;
