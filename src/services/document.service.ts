import { DocumentUploadModel } from '../models/DocumentUpload.js';
import { ApiError } from '../utils/ApiError.js';
import { microservicesClient } from './microservicesClient.js';

export async function createDocumentUpload(userId: string, payload: any) {
  return DocumentUploadModel.create({ ...payload, userId, status: 'pending' });
}

export async function parseDocument(documentId: string, userId: string) {
  const document = await DocumentUploadModel.findById(documentId);
  if (!document || document.userId !== userId) {
    throw new ApiError(404, 'NotFound', 'Document not found');
  }

  const parsed = await microservicesClient.parseDocument(documentId);
  return DocumentUploadModel.findByIdAndUpdate(
    documentId,
    {
      status: parsed.status,
      extractedData: parsed.extractedData,
      confidence: parsed.confidence,
      verifiedAt: parsed.status === 'verified' ? new Date() : undefined,
    },
    { new: true }
  );
}

export async function getDocument(documentId: string, userId: string) {
  const document = await DocumentUploadModel.findById(documentId);
  if (!document || document.userId !== userId) {
    throw new ApiError(404, 'NotFound', 'Document not found');
  }

  return document;
}
