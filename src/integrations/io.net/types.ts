export interface Model {
  id: string;
  name: string;
  description: string;
}

export interface InferenceRequest {
  model_id: string;
  prompt: string;
}

export interface InferenceResponse {
  request_id: string;
  status: 'pending' | 'completed' | 'failed';
  result?: string;
}
