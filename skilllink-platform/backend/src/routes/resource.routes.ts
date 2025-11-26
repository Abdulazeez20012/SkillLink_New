import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as resourceController from '../controllers/resource.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/cohort/:cohortId', resourceController.getCohortResources);
router.get('/:id', resourceController.getResourceById);
router.post('/:id/track-view', resourceController.trackResourceView);
router.get('/:id/download', resourceController.downloadResource);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  [
    body('cohortId').isUUID(),
    body('title').trim().notEmpty(),
    body('fileUrl').trim().notEmpty(),
    body('fileType').trim().notEmpty(),
    body('category').trim().notEmpty(),
    validate
  ],
  resourceController.createResource
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  resourceController.updateResource
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  resourceController.deleteResource
);

export default router;
