import prisma from '../config/database';

export class PeerReviewService {
  async assignPeerReviews(assignmentId: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        submissions: {
          where: {
            grade: null // Only submitted but not graded
          },
          select: {
            id: true,
            userId: true
          }
        }
      }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    if (!assignment.peerReviewEnabled) {
      throw new Error('Peer review is not enabled for this assignment');
    }

    const submissions = assignment.submissions;
    const reviewCount = assignment.peerReviewCount || 2;

    // Shuffle submissions for random assignment
    const shuffled = [...submissions].sort(() => Math.random() - 0.5);

    const peerReviews: any[] = [];

    // Assign peer reviews in a round-robin fashion
    for (let i = 0; i < submissions.length; i++) {
      const reviewer = submissions[i];
      
      for (let j = 1; j <= reviewCount; j++) {
        const revieweeIndex = (i + j) % submissions.length;
        const reviewee = shuffled[revieweeIndex];

        // Don't assign self-review
        if (reviewer.userId !== reviewee.userId) {
          peerReviews.push({
            submissionId: reviewee.id,
            reviewerId: reviewer.userId
          });
        }
      }
    }

    // Create peer review assignments
    await prisma.peerReview.createMany({
      data: peerReviews,
      skipDuplicates: true
    });

    return peerReviews.length;
  }

  async getMyPeerReviews(reviewerId: string, assignmentId?: string) {
    const where: any = { reviewerId };
    
    if (assignmentId) {
      where.submission = {
        assignmentId
      };
    }

    return prisma.peerReview.findMany({
      where,
      include: {
        submission: {
          include: {
            assignment: {
              select: {
                id: true,
                title: true,
                dueDate: true
              }
            },
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async submitPeerReview(peerReviewId: string, data: {
    rating?: number;
    feedback: string;
  }) {
    return prisma.peerReview.update({
      where: { id: peerReviewId },
      data: {
        rating: data.rating,
        feedback: data.feedback,
        completedAt: new Date()
      },
      include: {
        submission: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            assignment: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async getPeerReviewsForSubmission(submissionId: string) {
    return prisma.peerReview.findMany({
      where: { submissionId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });
  }

  async getPeerReviewStats(assignmentId: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        submissions: {
          include: {
            peerReviews: true
          }
        }
      }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const totalReviews = await prisma.peerReview.count({
      where: {
        submission: {
          assignmentId
        }
      }
    });

    const completedReviews = await prisma.peerReview.count({
      where: {
        submission: {
          assignmentId
        },
        completedAt: { not: null }
      }
    });

    const pendingReviews = totalReviews - completedReviews;

    return {
      totalReviews,
      completedReviews,
      pendingReviews,
      completionRate: totalReviews > 0 ? (completedReviews / totalReviews) * 100 : 0
    };
  }
}
