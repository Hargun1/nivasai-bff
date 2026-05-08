import type { Request, Response } from 'express';
import { UserModel } from '../models/User.js';

export async function getMe(req: Request, res: Response): Promise<void> {
  const userRecord = await UserModel.findOne({ firebaseUid: req.user?.uid });

  res.json({
    user: {
      id: req.user?.uid,
      phone: req.user?.phone ?? null,
      email: req.user?.email ?? null,
      role: userRecord?.role ?? req.user?.role ?? 'resident',
      profile: userRecord?.profile ?? {},
    },
  });
}
