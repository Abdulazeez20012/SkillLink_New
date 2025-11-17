import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.service';
import { AppError } from '../middleware/error.middleware';

const authService = new AuthService();

export const registerAdmin = async (req: AuthRequest, res: Response) => {
  const { email, password, name } = req.body;
  const result = await authService.registerAdmin(email, password, name);
  
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(201).json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken
    }
  });
};

export const facilitatorLogin = async (req: AuthRequest, res: Response) => {
  const { email, password, accessCode } = req.body;
  const result = await authService.facilitatorLogin(email, password, accessCode);
  
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken
    }
  });
};

export const registerStudent = async (req: AuthRequest, res: Response) => {
  const { email, password, name, inviteToken } = req.body;
  const result = await authService.registerStudent(email, password, name, inviteToken);
  
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken
    }
  });
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken
    }
  });
};

export const refreshToken = async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (!refreshToken) {
    throw new AppError('Refresh token required', 400);
  }

  const result = await authService.refreshToken(refreshToken);
  
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    data: {
      accessToken: result.accessToken
    }
  });
};

export const logout = async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: req.user
  });
};
