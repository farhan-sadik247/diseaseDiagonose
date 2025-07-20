import { Link } from 'react-router-dom';
import './NotFoundPage.scss';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="actions">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/diseases" className="btn btn-outline">
            Browse Diseases
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
