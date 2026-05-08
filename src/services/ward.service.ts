import { WardAnalysisModel } from '../models/WardAnalysis.js';
import { microservicesClient } from './microservicesClient.js';

export async function analyzeWard(wardId: string, payload: { wardName: string; lat: number; lng: number }) {
  const result = await microservicesClient.analyzeWard({ wardId, ...payload });

  await WardAnalysisModel.findOneAndUpdate(
    { wardId },
    {
      wardId,
      wardName: payload.wardName,
      scores: result.analysis.scores,
      summary: result.analysis.summary,
      topPriority: result.analysis.topPriority,
      estimatedPopulation: result.analysis.estimatedPopulation,
      report: result.report,
      analyzedAt: new Date(result.analysis.analyzedAt),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return result;
}

export async function listWardAnalyses() {
  return WardAnalysisModel.find().sort({ analyzedAt: -1 });
}

export async function getWardAnalysis(wardId: string) {
  return WardAnalysisModel.findOne({ wardId });
}
