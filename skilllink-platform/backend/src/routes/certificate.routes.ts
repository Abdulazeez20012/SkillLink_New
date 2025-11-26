import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as certificateController from '../controllers/certificate.controller';

const router = Router();

router.use(authenticate);

router.post('/generate/:cohortId', certificateController.generateCertificate);
router.get('/my-certificates', certificateController.getMyCertificates);
router.get('/:id/download', certificateController.downloadCertificate);

export default router;
