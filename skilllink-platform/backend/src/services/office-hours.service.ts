import prisma from '../config/database';

export class OfficeHoursService {
  async createOfficeHours(data: {
    facilitatorId: string;
    cohortId: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    meetingUrl?: string;
    maxAttendees?: number;
    isRecurring?: boolean;
    recurrencePattern?: string;
  }) {
    return prisma.officeHours.create({
      data,
      include: {
        facilitator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        cohort: {
          select: {
            id: true,
            name: true
          }
        },
        bookings: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    });
  }

  async getOfficeHoursByCohort(cohortId: string) {
    return prisma.officeHours.findMany({
      where: { cohortId },
      include: {
        facilitator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        bookings: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });
  }

  async getOfficeHoursByFacilitator(facilitatorId: string) {
    return prisma.officeHours.findMany({
      where: { facilitatorId },
      include: {
        cohort: {
          select: {
            id: true,
            name: true
          }
        },
        bookings: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });
  }

  async bookOfficeHours(officeHoursId: string, studentId: string, notes?: string) {
    // Check if office hours exist
    const officeHours = await prisma.officeHours.findUnique({
      where: { id: officeHoursId },
      include: {
        bookings: true
      }
    });

    if (!officeHours) {
      throw new Error('Office hours not found');
    }

    // Check if already booked
    const existingBooking = await prisma.officeHoursBooking.findUnique({
      where: {
        officeHoursId_studentId: {
          officeHoursId,
          studentId
        }
      }
    });

    if (existingBooking) {
      throw new Error('You have already booked this office hours slot');
    }

    // Check if max attendees reached
    if (officeHours.maxAttendees && officeHours.bookings.length >= officeHours.maxAttendees) {
      throw new Error('This office hours slot is full');
    }

    // Check if office hours is in the past
    if (new Date(officeHours.startTime) < new Date()) {
      throw new Error('Cannot book past office hours');
    }

    return prisma.officeHoursBooking.create({
      data: {
        officeHoursId,
        studentId,
        notes,
        status: 'confirmed'
      },
      include: {
        officeHours: {
          include: {
            facilitator: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await prisma.officeHoursBooking.findUnique({
      where: { id: bookingId },
      include: {
        officeHours: true
      }
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if user is the student who booked or the facilitator
    if (booking.studentId !== userId && booking.officeHours.facilitatorId !== userId) {
      throw new Error('Unauthorized to cancel this booking');
    }

    return prisma.officeHoursBooking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' }
    });
  }

  async updateOfficeHours(id: string, data: Partial<{
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location: string;
    meetingUrl: string;
    maxAttendees: number;
  }>) {
    return prisma.officeHours.update({
      where: { id },
      data,
      include: {
        facilitator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        bookings: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    });
  }

  async deleteOfficeHours(id: string) {
    return prisma.officeHours.delete({
      where: { id }
    });
  }

  async getMyBookings(studentId: string) {
    return prisma.officeHoursBooking.findMany({
      where: { studentId },
      include: {
        officeHours: {
          include: {
            facilitator: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            },
            cohort: {
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
}
