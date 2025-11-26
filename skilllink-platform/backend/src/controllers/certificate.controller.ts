import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CertificateService } from '../services/certificate.service';
import path from 'path';
import fs from 'fs';

const certificateService = new CertificateService();

export const generateCertificate = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { cohortId } = req.params;

  try {
    const certificate = await certificateService.generateCertificate(userId, cohortId);
    res.status(201).json({ success: true, data: certificate });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getMyCertificates = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  const certificates = await certificateService.getMyCertificates(userId);
  res.json({ success: true, data: certificates });
};

export const downloadCertificate = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const certificate = await certificateService.getCertificateById(id);
  if (!certificate) {
    res.status(404).json({ success: false, error: 'Certificate not found' });
    return;
  }

  const filePath = path.join(process.cwd(), 'uploads', 'certificates', certificate.pdfUrl);
  
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, error: 'Certificate file not found' });
    return;
  }

  res.download(filePath, `certificate-${certificate.user.name}.pdf`);
};
