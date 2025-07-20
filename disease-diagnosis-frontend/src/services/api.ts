import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Disease {
  id: number;
  name: string;
  symptoms: string;
  treatments: string;
  disease_code: string;
  contagious: boolean;
  chronic: boolean;
  symptoms_list: string[];
  treatments_list: string[];
  created_at: string;
  updated_at: string;
}

export interface DiseaseListItem {
  id: number;
  name: string;
  disease_code: string;
  contagious: boolean;
  chronic: boolean;
  symptoms_count: number;
}

export interface SymptomCheckerResult {
  id: number;
  name: string;
  disease_code: string;
  contagious: boolean;
  chronic: boolean;
  match_score: number;
  match_percentage: number;
  symptoms_list: string[];
}

export interface SymptomCheckerResponse {
  input_symptoms: string[];
  total_matches: number;
  results: SymptomCheckerResult[];
}

export interface DiseaseStats {
  total_diseases: number;
  contagious_diseases: number;
  chronic_diseases: number;
  non_contagious_diseases: number;
  non_chronic_diseases: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Remove mock data - use real backend only

// API functions
export const diseaseApi = {
  // Get all diseases with optional filters
  getDiseases: async (params?: {
    search?: string;
    contagious?: boolean;
    chronic?: boolean;
    page?: number;
  }): Promise<PaginatedResponse<DiseaseListItem>> => {
    const response = await api.get('/diseases/', { params });
    return response.data;
  },

  // Get a specific disease by ID
  getDisease: async (id: number): Promise<Disease> => {
    const response = await api.get(`/diseases/${id}/`);
    return response.data;
  },

  // Check symptoms
  checkSymptoms: async (symptoms: string[]): Promise<SymptomCheckerResponse> => {
    const response = await api.post('/symptom-checker/', { symptoms });
    return response.data;
  },

  // Get disease statistics
  getStats: async (): Promise<DiseaseStats> => {
    const response = await api.get('/stats/');
    return response.data;
  },
};

export default api;
