import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ResourceService } from '../services/resource.service';
import path from 'path';
import fs from 'fs';

const resourceService = new ResourceService();

export const getCohortResources = async (req: AuthRequest, res: Response) => {
  const { cohortId } = req.params;
  const { category, search } = req.query;

  let resources;
  
  if (search) {
    resources = await resourceService.searchResources(cohortId, search as string);
  } else if (category) {
    resources = await resourceService.getResourcesByCategory(cohortId, category as string);
  } else {
    resources = await resourceService.getCohortResources(cohortId);
  }

  res.json({ success: true, data: resources });
};

export const getResourceById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const resource = await resourceService.getResourceById(id);
  if (!resource) {
    res.status(404).json({ success: false, error: 'Resource not found' });
    return;
  }

  res.json({ success: true, data: resource });
};

export const trackResourceView = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  await resourceService.trackResourceView(id, userId);
  res.json({ success: true });
};

export const downloadResource = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const resource = await resourceService.getResourceById(id);
  if (!resource) {
    res.status(404).json({ success: false, error: 'Resource not found' });
    return;
  }

  // Track the view
  await resourceService.trackResourceView(id, userId);

  // If it's a URL, redirect
  if (resource.fileUrl.startsWith('http')) {
    res.redirect(resource.fileUrl);
    return;
  }

  // If it's a file, serve it
  const filePath = path.join(process.cwd(), 'uploads', 'resources', resource.fileUrl);
  
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, error: 'Resource file not found' });
    return;
  }

  res.download(filePath, resource.title);
};

export const createResource = async (req: AuthRequest, res: Response) => {
  const data = req.body;

  const resource = await resourceService.createResource(data);
  res.status(201).json({ success: true, data: resource });
};

export const updateResource = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const resource = await resourceService.updateResource(id, data);
  res.json({ success: true, data: resource });
};

export const deleteResource = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await resourceService.deleteResource(id);
  res.json({ success: true, message: 'Resource deleted successfully' });
};
