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

// Import local disease data from CSV conversion
import diseaseData from '../data/diseases.json';

// API functions
export const diseaseApi = {
  // Get all diseases with optional filters
  getDiseases: async (params?: {
    search?: string;
    contagious?: boolean;
    chronic?: boolean;
    page?: number;
  }): Promise<PaginatedResponse<DiseaseListItem>> => {
    // Use local data from CSV
    let filteredDiseases = [...diseaseData.diseases];

    // Apply filters
    if (params?.search) {
      filteredDiseases = filteredDiseases.filter(d =>
        d.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        d.symptoms.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    if (params?.contagious !== undefined) {
      filteredDiseases = filteredDiseases.filter(d => d.contagious === params.contagious);
    }
    if (params?.chronic !== undefined) {
      filteredDiseases = filteredDiseases.filter(d => d.chronic === params.chronic);
    }

    // Convert to list format
    const results = filteredDiseases.map(d => ({
      id: d.id,
      name: d.name,
      disease_code: d.disease_code,
      contagious: d.contagious,
      chronic: d.chronic,
      symptoms_count: d.symptoms_list.length
    }));

    return {
      count: results.length,
      next: null,
      previous: null,
      results: results
    };
  },

  // Get a specific disease by ID
  getDisease: async (id: number): Promise<Disease> => {
    const disease = diseaseData.diseases.find(d => d.id === id);
    if (!disease) {
      throw new Error(`Disease with ID ${id} not found`);
    }
    return disease;
  },

  // Check symptoms
  checkSymptoms: async (symptoms: string[]): Promise<SymptomCheckerResponse> => {
    // Simple symptom matching
    const matches = diseaseData.diseases.map(disease => {
      const matchingSymptoms = symptoms.filter(symptom =>
        disease.symptoms.toLowerCase().includes(symptom.toLowerCase())
      );
      const matchScore = matchingSymptoms.length;
      const matchPercentage = Math.round((matchScore / symptoms.length) * 100);

      return {
        id: disease.id,
        name: disease.name,
        disease_code: disease.disease_code,
        contagious: disease.contagious,
        chronic: disease.chronic,
        match_score: matchScore,
        match_percentage: matchPercentage,
        symptoms_list: disease.symptoms_list
      };
    }).filter(match => match.match_score > 0)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 10);

    return {
      input_symptoms: symptoms,
      total_matches: matches.length,
      results: matches
    };
  },

  // Get disease statistics
  getStats: async (): Promise<DiseaseStats> => {
    return diseaseData.stats;
  },
};

export default api;
