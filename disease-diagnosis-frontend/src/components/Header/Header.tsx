import { Link, useLocation } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Disease Diagnosis</h1>
        </Link>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/diseases" 
            className={`nav-link ${isActive('/diseases') ? 'active' : ''}`}
          >
            Diseases
          </Link>
          <Link 
            to="/symptom-checker" 
            className={`nav-link ${isActive('/symptom-checker') ? 'active' : ''}`}
          >
            Symptom Checker
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
