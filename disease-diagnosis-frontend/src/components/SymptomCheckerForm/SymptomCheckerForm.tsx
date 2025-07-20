import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diseaseApi } from '../../services/api';
import type { SymptomCheckerResponse } from '../../services/api';
import './SymptomCheckerForm.scss';

interface SymptomCheckerFormProps {
  onResults?: (results: SymptomCheckerResponse) => void;
  showResults?: boolean;
}

const SymptomCheckerForm = ({
  onResults,
  showResults = false
}: SymptomCheckerFormProps) => {
  const [symptoms, setSymptoms] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SymptomCheckerResponse | null>(null);
  const navigate = useNavigate();

  const addSymptom = () => {
    setSymptoms([...symptoms, '']);
  };

  const removeSymptom = (index: number) => {
    if (symptoms.length > 1) {
      const newSymptoms = symptoms.filter((_, i) => i !== index);
      setSymptoms(newSymptoms);
    }
  };

  const updateSymptom = (index: number, value: string) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index] = value;
    setSymptoms(newSymptoms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validSymptoms = symptoms.filter(s => s.trim() !== '');
    if (validSymptoms.length === 0) {
      setError('Please enter at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await diseaseApi.checkSymptoms(validSymptoms);
      setResults(response);
      
      if (onResults) {
        onResults(response);
      } else if (!showResults) {
        // Navigate to symptom checker page with results
        navigate('/symptom-checker', { state: { results: response } });
      }
    } catch (err) {
      setError('Failed to check symptoms. Please try again.');
      console.error('Error checking symptoms:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="symptom-checker-form">
      <form onSubmit={handleSubmit}>
        <div className="symptoms-input">
          <label>Enter your symptoms:</label>
          {symptoms.map((symptom, index) => (
            <div key={index} className="symptom-input-group">
              <input
                type="text"
                value={symptom}
                onChange={(e) => updateSymptom(index, e.target.value)}
                placeholder={`Symptom ${index + 1}`}
                className="symptom-input"
              />
              {symptoms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSymptom(index)}
                  className="remove-symptom-btn"
                  aria-label="Remove symptom"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSymptom}
            className="add-symptom-btn"
            disabled={symptoms.length >= 10}
          >
            + Add Another Symptom
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <button
          type="submit"
          className="btn btn-primary submit-btn"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Symptoms'}
        </button>
      </form>

      {showResults && results && (
        <div className="results-section">
          <h3>Results for: {results.input_symptoms.join(', ')}</h3>
          <p>Found {results.total_matches} potential matches</p>
          
          {results.results.length > 0 ? (
            <div className="results-list">
              {results.results.map((result) => (
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <h4>{result.name}</h4>
                    <div className="match-info">
                      <span className="match-score">
                        {result.match_score} matches
                      </span>
                      <span className="match-percentage">
                        {result.match_percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="result-details">
                    <p><strong>Code:</strong> {result.disease_code}</p>
                    <div className="disease-flags">
                      {result.contagious && (
                        <span className="flag contagious">Contagious</span>
                      )}
                      {result.chronic && (
                        <span className="flag chronic">Chronic</span>
                      )}
                    </div>
                    <div className="symptoms-preview">
                      <strong>Symptoms:</strong>
                      <ul>
                        {result.symptoms_list.slice(0, 3).map((symptom, idx) => (
                          <li key={idx}>{symptom}</li>
                        ))}
                        {result.symptoms_list.length > 3 && (
                          <li>... and {result.symptoms_list.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                    <button
                      onClick={() => navigate(`/diseases/${result.id}`)}
                      className="btn btn-outline view-details-btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No diseases found matching your symptoms.</p>
              <p>Try different or more general symptom descriptions.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomCheckerForm;
