import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { diseaseApi } from '../../services/api';
import type { Disease } from '../../services/api';
import './DiseaseDetailPage.scss';

const DiseaseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [disease, setDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisease = async () => {
      if (!id) {
        setError('Disease ID not provided');
        setLoading(false);
        return;
      }

      try {
        const data = await diseaseApi.getDisease(parseInt(id));
        setDisease(data);
      } catch (err) {
        setError('Failed to load disease details');
        console.error('Error fetching disease:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisease();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading disease details...</div>;
  }

  if (error) {
    return (
      <div className="disease-detail-page">
        <div className="error">{error}</div>
        <Link to="/diseases" className="btn btn-primary">
          Back to Diseases
        </Link>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="disease-detail-page">
        <div className="error">Disease not found</div>
        <Link to="/diseases" className="btn btn-primary">
          Back to Diseases
        </Link>
      </div>
    );
  }

  return (
    <div className="disease-detail-page">
      <div className="page-header">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline back-btn"
        >
          ← Back
        </button>
        
        <div className="disease-title">
          <h1>{disease.name}</h1>
          <span className="disease-code">{disease.disease_code}</span>
        </div>

        <div className="disease-flags">
          {disease.contagious && (
            <span className="flag contagious">Contagious</span>
          )}
          {disease.chronic && (
            <span className="flag chronic">Chronic</span>
          )}
        </div>
      </div>

      <div className="disease-content">
        <div className="row">
          <div className="col-2">
            <div className="card symptoms-section">
              <h2>Symptoms</h2>
              {disease.symptoms_list && disease.symptoms_list.length > 0 ? (
                <ul className="symptoms-list">
                  {disease.symptoms_list.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No symptoms information available</p>
              )}
            </div>
          </div>

          <div className="col-2">
            <div className="card treatments-section">
              <h2>Treatments</h2>
              {disease.treatments_list && disease.treatments_list.length > 0 ? (
                <ul className="treatments-list">
                  {disease.treatments_list.map((treatment, index) => (
                    <li key={index}>{treatment}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No treatment information available</p>
              )}
            </div>
          </div>
        </div>

        <div className="card disease-info-section">
          <h2>Disease Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Disease Code:</label>
              <span>{disease.disease_code}</span>
            </div>
            <div className="info-item">
              <label>Contagious:</label>
              <span className={disease.contagious ? 'yes' : 'no'}>
                {disease.contagious ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="info-item">
              <label>Chronic:</label>
              <span className={disease.chronic ? 'yes' : 'no'}>
                {disease.chronic ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="info-item">
              <label>Last Updated:</label>
              <span>{new Date(disease.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <Link to="/diseases" className="btn btn-outline">
            Browse All Diseases
          </Link>
          <Link to="/symptom-checker" className="btn btn-primary">
            Check Your Symptoms
          </Link>
        </div>
      </div>

      <div className="disclaimer-section">
        <div className="card disclaimer">
          <h3>⚠️ Medical Disclaimer</h3>
          <p>
            This information is for educational purposes only and should not be used 
            for diagnosing or treating medical conditions. Always consult with a 
            qualified healthcare professional for proper medical advice, diagnosis, 
            and treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetailPage;
