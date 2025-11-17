import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import * as githubController from '../controllers/github.controller';

const router = Router();

router.use(authenticate);

router.post(
  '/validate',
  [
    body('url').isURL().withMessage('Invalid URL'),
    validate
  ],
  githubController.validateRepo
);

router.get('/repo/info', githubController.getRepoInfo);

export default router;
