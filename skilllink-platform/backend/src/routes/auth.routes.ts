import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Admin Registration
router.post(
  '/admin/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    validate
  ],
  authController.registerAdmin
);

// Facilitator Login with Access Code
router.post(
  '/facilitator/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    body('accessCode').isLength({ min: 6, max: 6 }).withMessage('Access code must be 6 characters'),
    validate
  ],
  authController.facilitatorLogin
);

// Student Registration via Invite Link
router.post(
  '/student/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('inviteToken').notEmpty().withMessage('Invite token is required'),
    validate
  ],
  authController.registerStudent
);

// Standard Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  authController.login
);

// Refresh Token
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

// Get Current User
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
