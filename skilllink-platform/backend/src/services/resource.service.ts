import prisma from '../config/database';

export class ResourceService {
  async getCohortResources(cohortId: string) {
    return prisma.resource.findMany({
      where: { cohortId },
      include: {
        _count: { select: { views: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getResourceById(id: string) {
    return prisma.resource.findUnique({
      where: { id },
      include: {
        cohort: { select: { id: true, name: true } },
        _count: { select: { views: true } }
      }
    });
  }

  async trackResourceView(resourceId: string, userId: string) {
    // Check if already viewed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingView = await prisma.resourceView.findFirst({
      where: {
        resourceId,
        userId,
        viewedAt: { gte: today }
      }
    });

    if (!existingView) {
      await prisma.resourceView.create({
        data: { resourceId, userId }
      });
    }
  }

  async createResource(data: {
    cohortId: string;
    title: string;
    description?: string;
    fileUrl: string;
    fileType: string;
    category: string;
  }) {
    return prisma.resource.create({
      data,
      include: {
        cohort: { select: { id: true, name: true } }
      }
    });
  }

  async updateResource(id: string, data: Partial<{
    title: string;
    description: string;
    category: string;
  }>) {
    return prisma.resource.update({
      where: { id },
      data
    });
  }

  async deleteResource(id: string) {
    return prisma.resource.delete({ where: { id } });
  }

  async getResourcesByCategory(cohortId: string, category: string) {
    return prisma.resource.findMany({
      where: { cohortId, category },
      include: {
        _count: { select: { views: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async searchResources(cohortId: string, query: string) {
    return prisma.resource.findMany({
      where: {
        cohortId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        _count: { select: { views: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
