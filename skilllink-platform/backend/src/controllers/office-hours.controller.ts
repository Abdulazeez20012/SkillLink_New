import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { OfficeHoursService } from '../services/office-hours.service';

const officeHoursService = new OfficeHoursService();

export const createOfficeHours = async (req: AuthRequest, res: Response) => {
  const facilitatorId = req.user!.userId;
  const data = { ...req.body, facilitatorId };

  try {
    const officeHours = await officeHoursService.createOfficeHours(data);
    res.status(201).json({ success: true, data: officeHours });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getOfficeHoursByCohort = async (req: AuthRequest, res: Response) => {
  const { cohortId } = req.params;

  try {
    const officeHours = await officeHoursService.getOfficeHoursByCohort(cohortId);
    res.json({ success: true, data: officeHours });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getMyOfficeHours = async (req: AuthRequest, res: Response) => {
  const facilitatorId = req.user!.userId;

  try {
    const officeHours = await officeHoursService.getOfficeHoursByFacilitator(facilitatorId);
    res.json({ success: true, data: officeHours });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const bookOfficeHours = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!.userId;
  const { officeHoursId } = req.params;
  const { notes } = req.body;

  try {
    const booking = await officeHoursService.bookOfficeHours(officeHoursId, studentId, notes);
    res.status(201).json({ success: true, data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { bookingId } = req.params;

  try {
    const booking = await officeHoursService.cancelBooking(bookingId, userId);
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateOfficeHours = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const officeHours = await officeHoursService.updateOfficeHours(id, data);
    res.json({ success: true, data: officeHours });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteOfficeHours = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    await officeHoursService.deleteOfficeHours(id);
    res.json({ success: true, message: 'Office hours deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!.userId;

  try {
    const bookings = await officeHoursService.getMyBookings(studentId);
    res.json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
