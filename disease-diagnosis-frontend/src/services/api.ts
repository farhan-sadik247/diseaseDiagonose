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

// Mock data for demo
const mockDiseases: DiseaseListItem[] = [
  { id: 1, name: "Common Cold", disease_code: "J00", contagious: true, chronic: false, symptoms_count: 8 },
  { id: 2, name: "Diabetes Type 2", disease_code: "E11", contagious: false, chronic: true, symptoms_count: 12 },
  { id: 3, name: "Hypertension", disease_code: "I10", contagious: false, chronic: true, symptoms_count: 6 },
  { id: 4, name: "Influenza", disease_code: "J11", contagious: true, chronic: false, symptoms_count: 10 },
  { id: 5, name: "Migraine", disease_code: "G43", contagious: false, chronic: true, symptoms_count: 7 }
];

const mockStats: DiseaseStats = {
  total_diseases: 395,
  contagious_diseases: 156,
  chronic_diseases: 189,
  non_contagious_diseases: 239,
  non_chronic_diseases: 206
};

// API functions
export const diseaseApi = {
  // Get all diseases with optional filters
  getDiseases: async (params?: {
    search?: string;
    contagious?: boolean;
    chronic?: boolean;
    page?: number;
  }): Promise<PaginatedResponse<DiseaseListItem>> => {
    try {
      const response = await api.get('/diseases/', { params });
      return response.data;
    } catch (error) {
      // Fallback to mock data
      let filteredDiseases = [...mockDiseases];
      if (params?.search) {
        filteredDiseases = filteredDiseases.filter(d =>
          d.name.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      if (params?.contagious !== undefined) {
        filteredDiseases = filteredDiseases.filter(d => d.contagious === params.contagious);
      }
      if (params?.chronic !== undefined) {
        filteredDiseases = filteredDiseases.filter(d => d.chronic === params.chronic);
      }
      return {
        count: filteredDiseases.length,
        next: null,
        previous: null,
        results: filteredDiseases
      };
    }
  },

  // Get a specific disease by ID
  getDisease: async (id: number): Promise<Disease> => {
    try {
      const response = await api.get(`/diseases/${id}/`);
      return response.data;
    } catch (error) {
      console.log('API failed, using mock data for disease ID:', id);
      // Fallback to mock data
      const mockDisease = mockDiseases.find(d => d.id === id);
      if (mockDisease) {
        const mockDetails = {
          1: {
            symptoms: "Runny nose, sneezing, cough, sore throat, mild headache, low-grade fever, body aches, fatigue",
            treatments: "Rest, fluids, over-the-counter pain relievers, throat lozenges, humidifier",
            symptoms_list: ["Runny nose", "Sneezing", "Cough", "Sore throat", "Mild headache", "Low-grade fever", "Body aches", "Fatigue"],
            treatments_list: ["Rest", "Fluids", "Over-the-counter pain relievers", "Throat lozenges", "Humidifier"]
          },
          2: {
            symptoms: "Increased thirst, frequent urination, extreme fatigue, blurred vision, slow-healing cuts, weight loss",
            treatments: "Insulin therapy, blood sugar monitoring, healthy diet, regular exercise, medication management",
            symptoms_list: ["Increased thirst", "Frequent urination", "Extreme fatigue", "Blurred vision", "Slow-healing cuts", "Weight loss"],
            treatments_list: ["Insulin therapy", "Blood sugar monitoring", "Healthy diet", "Regular exercise", "Medication management"]
          },
          3: {
            symptoms: "High blood pressure readings, headaches, dizziness, chest pain, shortness of breath, nosebleeds",
            treatments: "Blood pressure medications, low-sodium diet, regular exercise, stress management, weight control",
            symptoms_list: ["High blood pressure readings", "Headaches", "Dizziness", "Chest pain", "Shortness of breath", "Nosebleeds"],
            treatments_list: ["Blood pressure medications", "Low-sodium diet", "Regular exercise", "Stress management", "Weight control"]
          },
          4: {
            symptoms: "High fever, body aches, chills, cough, sore throat, runny nose, fatigue, headache, nausea",
            treatments: "Antiviral medications, rest, fluids, fever reducers, pain relievers, isolation",
            symptoms_list: ["High fever", "Body aches", "Chills", "Cough", "Sore throat", "Runny nose", "Fatigue", "Headache", "Nausea"],
            treatments_list: ["Antiviral medications", "Rest", "Fluids", "Fever reducers", "Pain relievers", "Isolation"]
          },
          5: {
            symptoms: "Severe headache, nausea, vomiting, sensitivity to light, sensitivity to sound, visual disturbances",
            treatments: "Pain medications, rest in dark room, stress management, trigger avoidance, preventive medications",
            symptoms_list: ["Severe headache", "Nausea", "Vomiting", "Sensitivity to light", "Sensitivity to sound", "Visual disturbances"],
            treatments_list: ["Pain medications", "Rest in dark room", "Stress management", "Trigger avoidance", "Preventive medications"]
          }
        };

        const details = mockDetails[id as keyof typeof mockDetails] || mockDetails[1];

        return {
          id: mockDisease.id,
          name: mockDisease.name,
          disease_code: mockDisease.disease_code,
          symptoms: details.symptoms,
          treatments: details.treatments,
          contagious: mockDisease.contagious,
          chronic: mockDisease.chronic,
          symptoms_list: details.symptoms_list,
          treatments_list: details.treatments_list,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      throw new Error(`Disease with ID ${id} not found`);
    }
  },

  // Check symptoms
  checkSymptoms: async (symptoms: string[]): Promise<SymptomCheckerResponse> => {
    try {
      const response = await api.post('/symptom-checker/', { symptoms });
      return response.data;
    } catch (error) {
      // Fallback to mock data
      return {
        input_symptoms: symptoms,
        total_matches: 3,
        results: mockDiseases.slice(0, 3).map((disease, index) => ({
          id: disease.id,
          name: disease.name,
          disease_code: disease.disease_code,
          contagious: disease.contagious,
          chronic: disease.chronic,
          match_score: 3 - index,
          match_percentage: 90 - (index * 20),
          symptoms_list: ["Fever", "Headache", "Body aches", "Fatigue"]
        }))
      };
    }
  },

  // Get disease statistics
  getStats: async (): Promise<DiseaseStats> => {
    try {
      const response = await api.get('/stats/');
      return response.data;
    } catch (error) {
      // Fallback to mock data
      return mockStats;
    }
  },
};

export default api;
