import { InferenceRequest, InferenceResponse, Model } from './types';

const IO_NET_API_URL = 'https://api.io.net';

export async function getModels(): Promise<Model[]> {
  const response = await fetch(`${IO_NET_API_URL}/models`);
  if (!response.ok) {
    throw new Error('Failed to fetch models from io.net');
  }
  return response.json();
}

export async function createInference(request: InferenceRequest): Promise<InferenceResponse> {
  const response = await fetch(`${IO_NET_API_URL}/inference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error('Failed to create inference request on io.net');
  }
  return response.json();
}
