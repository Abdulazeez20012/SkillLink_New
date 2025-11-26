import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PeerReviewService } from '../services/peer-review.service';

const peerReviewService = new PeerReviewService();

export const assignPeerReviews = async (req: AuthRequest, res: Response) => {
  const { assignmentId } = req.params;

  try {
    const count = await peerReviewService.assignPeerReviews(assignmentId);
    res.json({ 
      success: true, 
      message: `${count} peer reviews assigned successfully`,
      count 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getMyPeerReviews = async (req: AuthRequest, res: Response) => {
  const reviewerId = req.user!.userId;
  const { assignmentId } = req.query;

  try {
    const peerReviews = await peerReviewService.getMyPeerReviews(
      reviewerId, 
      assignmentId as string
    );
    res.json({ success: true, data: peerReviews });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const submitPeerReview = async (req: AuthRequest, res: Response) => {
  const { peerReviewId } = req.params;
  const data = req.body;

  try {
    const peerReview = await peerReviewService.submitPeerReview(peerReviewId, data);
    res.json({ success: true, data: peerReview });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getPeerReviewsForSubmission = async (req: AuthRequest, res: Response) => {
  const { submissionId } = req.params;

  try {
    const peerReviews = await peerReviewService.getPeerReviewsForSubmission(submissionId);
    res.json({ success: true, data: peerReviews });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getPeerReviewStats = async (req: AuthRequest, res: Response) => {
  const { assignmentId } = req.params;

  try {
    const stats = await peerReviewService.getPeerReviewStats(assignmentId);
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
