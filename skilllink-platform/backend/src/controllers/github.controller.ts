import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { validateGitHubUrl, getRepoInfo as fetchRepoInfo } from '../utils/github';

export const validateRepo = async (req: AuthRequest, res: Response) => {
  const { url } = req.body;

  const isValid = await validateGitHubUrl(url);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: 'Invalid GitHub repository URL'
    });
  }

  const repoInfo = await fetchRepoInfo(url);

  if (!repoInfo) {
    return res.status(404).json({
      success: false,
      error: 'Repository not found or is private'
    });
  }

  res.json({
    success: true,
    data: { isValid: true, repoInfo }
  });
};

export const getRepoInfo = async (req: AuthRequest, res: Response) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Repository URL is required'
    });
  }

  const repoInfo = await fetchRepoInfo(url);

  if (!repoInfo) {
    return res.status(404).json({
      success: false,
      error: 'Repository not found'
    });
  }

  res.json({ success: true, data: repoInfo });
};
