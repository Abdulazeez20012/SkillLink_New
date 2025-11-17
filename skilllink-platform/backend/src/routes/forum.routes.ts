import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import * as forumController from '../controllers/forum.controller';

const router = Router();

router.use(authenticate);

router.post(
  '/posts',
  [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('cohortId').isUUID(),
    validate
  ],
  forumController.createPost
);

router.get('/posts', forumController.getPosts);
router.get('/posts/:id', forumController.getPostById);

router.post(
  '/posts/:id/answers',
  [
    body('content').trim().notEmpty(),
    validate
  ],
  forumController.createAnswer
);

router.put('/posts/:id/solve', forumController.markAsSolved);
router.put('/answers/:id/endorse', forumController.endorseAnswer);

export default router;
