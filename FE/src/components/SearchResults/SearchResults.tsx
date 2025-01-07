import React, { memo, FC, useContext } from 'react';
import { SearchContext } from '../SearchProvider/SearchProvider';
import './styles.css';

const SearchResults: FC = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('SearchResults must be used within a SearchProvider');
  }
  const results = ctx.selectedResults;
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="search-results-container">
      <p className="search-metadata">
        Found <strong>{results.length}</strong> result(s) in <strong>{ctx.queryTime}ms</strong>
      </p>
      <ul className="results-list">
        {results.map((item) => (
          <li key={item.id} className="result-item">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="result-title"
            >
              {item.title}
            </a>
            <p className="result-description">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(SearchResults);
