import prisma from '../config/database';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class CertificateService {
  async generateCertificate(userId: string, cohortId: string) {
    // Check if certificate already exists
    const existing = await prisma.certificate.findFirst({
      where: { userId, cohortId }
    });

    if (existing) {
      return existing;
    }

    // Get user and cohort details
    const [user, cohort] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.cohort.findUnique({ where: { id: cohortId } })
    ]);

    if (!user || !cohort) {
      throw new Error('User or cohort not found');
    }

    // Generate PDF certificate
    const pdfPath = await this.createCertificatePDF(user, cohort);

    // Save certificate record
    const certificate = await prisma.certificate.create({
      data: {
        userId,
        cohortId,
        pdfUrl: pdfPath,
        verificationCode: this.generateVerificationCode()
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        cohort: { select: { id: true, name: true } }
      }
    });

    return certificate;
  }

  async getMyCertificates(userId: string) {
    return prisma.certificate.findMany({
      where: { userId },
      include: {
        cohort: { select: { id: true, name: true } }
      },
      orderBy: { issueDate: 'desc' }
    });
  }

  async getCertificateById(id: string) {
    return prisma.certificate.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        cohort: { select: { id: true, name: true } }
      }
    });
  }

  private async createCertificatePDF(user: any, cohort: any): Promise<string> {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const fileName = `certificate-${user.id}-${cohort.id}-${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), 'uploads', 'certificates', fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Certificate design
    doc.fontSize(40)
       .fillColor('#2563eb')
       .text('Certificate of Completion', 50, 100, { align: 'center' });

    doc.fontSize(20)
       .fillColor('#000')
       .text('This is to certify that', 50, 200, { align: 'center' });

    doc.fontSize(32)
       .fillColor('#2563eb')
       .text(user.name, 50, 250, { align: 'center' });

    doc.fontSize(20)
       .fillColor('#000')
       .text('has successfully completed the course', 50, 320, { align: 'center' });

    doc.fontSize(28)
       .fillColor('#2563eb')
       .text(cohort.name, 50, 370, { align: 'center' });

    doc.fontSize(16)
       .fillColor('#666')
       .text(`Issued on ${new Date().toLocaleDateString()}`, 50, 450, { align: 'center' });

    doc.fontSize(12)
       .text(`Verification Code: ${this.generateVerificationCode()}`, 50, 500, { align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(fileName));
      stream.on('error', reject);
    });
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
