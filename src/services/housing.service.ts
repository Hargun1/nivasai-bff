import { FamilyProfileModel } from '../models/FamilyProfile.js';
import { HousingApplicationModel } from '../models/HousingApplication.js';
import { microservicesClient } from './microservicesClient.js';

export async function upsertFamilyProfile(userId: string, payload: any) {
  return FamilyProfileModel.findOneAndUpdate({ userId }, payload, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
}

export async function getFamilyProfile(userId: string) {
  return FamilyProfileModel.findOne({ userId });
}

export async function matchHousing(userId: string, payload: any) {
  const profile = payload.familyProfile ?? (await getFamilyProfile(userId));
  return microservicesClient.matchHousing({ familyProfile: profile });
}

export async function createHousingApplication(userId: string, payload: any) {
  return HousingApplicationModel.create({
    ...payload,
    userId,
    status: 'submitted',
    submittedAt: new Date(),
  });
}

export async function listHousingApplications(userId: string) {
  return HousingApplicationModel.find({ userId }).sort({ submittedAt: -1 });
}
