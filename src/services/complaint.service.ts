import { ComplaintModel } from '../models/Complaint.js';
import { ApiError } from '../utils/ApiError.js';
import { microservicesClient } from './microservicesClient.js';

export async function createComplaint(userId: string, payload: any) {
  const complaint = await ComplaintModel.create({
    ...payload,
    userId,
    status: 'pending',
  });

  await microservicesClient.classifyComplaint(complaint.id).catch((error) => {
    console.warn('Complaint classification trigger failed', error.message);
  });

  return complaint;
}

export async function listComplaints(user: Express.Request['user']) {
  if (!user) {
    throw new ApiError(401, 'Unauthorized', 'Authentication is required');
  }

  if (user.role === 'admin') {
    return ComplaintModel.find().sort({ createdAt: -1 });
  }

  if (user.role === 'officer') {
    return ComplaintModel.find({ routedTo: user.uid }).sort({ createdAt: -1 });
  }

  return ComplaintModel.find({ userId: user.uid }).sort({ createdAt: -1 });
}

export async function getComplaintForUser(complaintId: string, user: Express.Request['user']) {
  const complaint = await ComplaintModel.findById(complaintId);
  if (!complaint) {
    throw new ApiError(404, 'NotFound', 'Complaint not found');
  }

  if (user?.role === 'admin' || complaint.userId === user?.uid || complaint.routedTo === user?.uid) {
    return complaint;
  }

  throw new ApiError(403, 'Forbidden', 'You do not have permission to access this complaint');
}
