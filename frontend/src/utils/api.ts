import axios from 'axios';
import { AIModel, QueryResult, UploadResult } from '../types';

const api = axios.create({ baseURL: '/api' });

export async function uploadFile(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<UploadResult>('/upload', formData);
  return data;
}

export async function runQuery(
  sessionId: string,
  question: string,
  model?: string
): Promise<QueryResult> {
  const { data } = await api.post<QueryResult>('/query', {
    session_id: sessionId,
    question,
    ...(model ? { model } : {}),
  });
  return data;
}

export async function getModels(): Promise<AIModel[]> {
  const { data } = await api.get<AIModel[]>('/models');
  return data;
}
