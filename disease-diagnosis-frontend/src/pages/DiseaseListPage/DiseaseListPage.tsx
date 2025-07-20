import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { diseaseApi } from '../../services/api';
import type { DiseaseListItem, PaginatedResponse } from '../../services/api';
import './DiseaseListPage.scss';

const DiseaseListPage = () => {
  const [diseases, setDiseases] = useState<DiseaseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [contagiousFilter, setContagiousFilter] = useState<string>('all');
  const [chronicFilter, setChronicFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchDiseases = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { page };
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      if (contagiousFilter !== 'all') {
        params.contagious = contagiousFilter === 'true';
      }
      
      if (chronicFilter !== 'all') {
        params.chronic = chronicFilter === 'true';
      }

      const response: PaginatedResponse<DiseaseListItem> = await diseaseApi.getDiseases(params);
      
      setDiseases(response.results);
      setTotalCount(response.count);
      setHasNext(!!response.next);
      setHasPrevious(!!response.previous);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load diseases. Please try again.');
      console.error('Error fetching diseases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases(1);
  }, [search, contagiousFilter, chronicFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDiseases(1);
  };

  const handlePageChange = (page: number) => {
    fetchDiseases(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setContagiousFilter('all');
    setChronicFilter('all');
  };

  return (
    <div className="disease-list-page">
      <div className="page-header">
        <h1>Disease Database</h1>
        <p>Browse our comprehensive database of {totalCount} diseases</p>
      </div>

      <div className="filters-section card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search diseases by name, symptoms, or code..."
              className="search-input"
            />
            <button type="submit" className="btn btn-primary search-btn">
              Search
            </button>
          </div>
        </form>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="contagious-filter">Contagious:</label>
            <select
              id="contagious-filter"
              value={contagiousFilter}
              onChange={(e) => setContagiousFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="chronic-filter">Chronic:</label>
            <select
              id="chronic-filter"
              value={chronicFilter}
              onChange={(e) => setChronicFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="btn btn-outline clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading diseases...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="results-info">
            <p>
              Showing {diseases.length} of {totalCount} diseases
              {(search || contagiousFilter !== 'all' || chronicFilter !== 'all') && (
                <span> (filtered)</span>
              )}
            </p>
          </div>

          <div className="diseases-grid">
            {diseases.map((disease) => (
              <div key={disease.id} className="disease-card card">
                <div className="disease-header">
                  <h3>{disease.name}</h3>
                  <span className="disease-code">{disease.disease_code}</span>
                </div>
                
                <div className="disease-info">
                  <p className="symptoms-count">
                    {disease.symptoms_count} symptom{disease.symptoms_count !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="disease-flags">
                    {disease.contagious && (
                      <span className="flag contagious">Contagious</span>
                    )}
                    {disease.chronic && (
                      <span className="flag chronic">Chronic</span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/diseases/${disease.id}`}
                  className="btn btn-outline view-details-btn"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {diseases.length === 0 && (
            <div className="no-results">
              <h3>No diseases found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          )}

          {(hasNext || hasPrevious) && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="btn btn-outline pagination-btn"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNext}
                className="btn btn-outline pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiseaseListPage;
