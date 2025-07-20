import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import DiseaseListPage from './pages/DiseaseListPage/DiseaseListPage';
import DiseaseDetailPage from './pages/DiseaseDetailPage/DiseaseDetailPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage/SymptomCheckerPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diseases" element={<DiseaseListPage />} />
            <Route path="/diseases/:id" element={<DiseaseDetailPage />} />
            <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
