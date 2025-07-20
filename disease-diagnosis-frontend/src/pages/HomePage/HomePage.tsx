import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { diseaseApi } from '../../services/api';
import type { DiseaseStats } from '../../services/api';
import SymptomCheckerForm from '../../components/SymptomCheckerForm/SymptomCheckerForm';
import './HomePage.scss';

const HomePage = () => {
  const [stats, setStats] = useState<DiseaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await diseaseApi.getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Disease Diagnosis & Symptom Checker</h1>
          <p>
            Explore our comprehensive database of diseases and use our intelligent 
            symptom checker to find potential matches for your symptoms.
          </p>
          <div className="hero-actions">
            <Link to="/symptom-checker" className="btn btn-primary">
              Check Symptoms
            </Link>
            <Link to="/diseases" className="btn btn-outline">
              Browse Diseases
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <h2>Database Statistics</h2>
        {loading && <div className="loading">Loading statistics...</div>}
        {error && <div className="error">{error}</div>}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total_diseases}</div>
              <div className="stat-label">Total Diseases</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.contagious_diseases}</div>
              <div className="stat-label">Contagious</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.chronic_diseases}</div>
              <div className="stat-label">Chronic</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.non_contagious_diseases}</div>
              <div className="stat-label">Non-Contagious</div>
            </div>
          </div>
        )}
      </section>

      <section className="symptom-checker-section">
        <div className="card">
          <h2>Quick Symptom Check</h2>
          <p>Enter your symptoms below to get potential disease matches:</p>
          <SymptomCheckerForm />
        </div>
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Advanced Search</h3>
            <p>Search diseases by name, symptoms, or disease codes with intelligent filtering.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🩺</div>
            <h3>Symptom Checker</h3>
            <p>Input your symptoms and get ranked matches with detailed information.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Information</h3>
            <p>Access comprehensive details about diseases, treatments, and characteristics.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Fully responsive design that works perfectly on all devices.</p>
          </div>
        </div>
      </section>

      <section className="disclaimer">
        <div className="card">
          <h3>⚠️ Medical Disclaimer</h3>
          <p>
            This tool is for educational and informational purposes only. It is not intended 
            to be a substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider 
            with any questions you may have regarding a medical condition.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
