import { useState, useEffect, useCallback } from 'react'

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    try {
      const apiUrl = import.meta.env.PROD ? 'https://namma-pincode.onrender.com/api/search' : 'http://localhost:3001/api/search';
      const response = await fetch(`${apiUrl}?query=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Failed to fetch data');
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Namma Pincode</h1>
        <p className="app-subtitle">Explore Bengaluru by Area or Pincode</p>
      </header>

      <main>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Type a pincode (e.g. 560034) or area name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* Search Icon SVG */}
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {isLoading && (
          <div className="status-message">
            Fetching area details...
          </div>
        )}

        {!isLoading && hasSearched && results.length > 0 && (
          <div className="results-grid">
            {results.map((item, index) => (
              <div className="result-card" key={`${item.pincode}-${index}`}>
                <span className="pincode-badge">{item.pincode}</span>
                <h3 className="area-name">{item.area}</h3>
              </div>
            ))}
          </div>
        )}

        {!isLoading && hasSearched && debouncedQuery && results.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <p>No areas or pincodes found for "{debouncedQuery}"</p>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Try searching for "Koramangala" or "560001"
            </span>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
