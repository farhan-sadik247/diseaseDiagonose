
import SymptomCheckerForm from '../../components/SymptomCheckerForm/SymptomCheckerForm';
import type { SymptomCheckerResponse } from '../../services/api';
import './SymptomCheckerPage.scss';

const SymptomCheckerPage = () => {
  const handleResults = (newResults: SymptomCheckerResponse) => {
    // Results are handled by the SymptomCheckerForm component itself
    console.log('Symptom check completed:', newResults);
  };

  return (
    <div className="symptom-checker-page">
      <div className="page-header">
        <h1>Symptom Checker</h1>
        <p>
          Enter your symptoms below to find potential disease matches. 
          This tool provides educational information and should not replace 
          professional medical advice.
        </p>
      </div>

      <div className="card">
        <SymptomCheckerForm 
          onResults={handleResults} 
          showResults={true}
        />
      </div>

      <div className="disclaimer-section">
        <div className="card disclaimer">
          <h3>⚠️ Important Medical Disclaimer</h3>
          <ul>
            <li>This symptom checker is for educational purposes only</li>
            <li>It cannot diagnose medical conditions or replace professional medical advice</li>
            <li>Always consult with a healthcare professional for proper diagnosis and treatment</li>
            <li>In case of emergency, contact your local emergency services immediately</li>
            <li>The results are based on symptom matching and may not be comprehensive</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
