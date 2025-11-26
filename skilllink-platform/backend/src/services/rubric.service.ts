import prisma from '../config/database';

export class RubricService {
  async createRubric(data: {
    assignmentId: string;
    name: string;
    description?: string;
    criteria: Array<{
      name: string;
      description?: string;
      maxPoints: number;
    }>;
  }) {
    const rubric = await prisma.rubric.create({
      data: {
        assignmentId: data.assignmentId,
        name: data.name,
        description: data.description,
        criteria: {
          create: data.criteria.map((criterion, index) => ({
            name: criterion.name,
            description: criterion.description,
            maxPoints: criterion.maxPoints,
            order: index
          }))
        }
      },
      include: {
        criteria: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return rubric;
  }

  async getRubricByAssignment(assignmentId: string) {
    return prisma.rubric.findFirst({
      where: { assignmentId },
      include: {
        criteria: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  async updateRubric(rubricId: string, data: {
    name?: string;
    description?: string;
    criteria?: Array<{
      id?: string;
      name: string;
      description?: string;
      maxPoints: number;
    }>;
  }) {
    // If criteria are provided, update them
    if (data.criteria) {
      // Delete existing criteria
      await prisma.rubricCriteria.deleteMany({
        where: { rubricId }
      });

      // Create new criteria
      await prisma.rubricCriteria.createMany({
        data: data.criteria.map((criterion, index) => ({
          rubricId,
          name: criterion.name,
          description: criterion.description,
          maxPoints: criterion.maxPoints,
          order: index
        }))
      });
    }

    // Update rubric
    return prisma.rubric.update({
      where: { id: rubricId },
      data: {
        name: data.name,
        description: data.description
      },
      include: {
        criteria: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  async deleteRubric(rubricId: string) {
    return prisma.rubric.delete({
      where: { id: rubricId }
    });
  }
}
