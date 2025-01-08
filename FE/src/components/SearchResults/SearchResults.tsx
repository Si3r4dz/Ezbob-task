import React, { memo, FC, useContext } from 'react';
import { SearchContext } from '../SearchProvider/SearchProvider';
import Pagination from '../Pagination/Pagination';
import './styles.css';

const SearchResults: FC = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) {
        throw new Error('SearchResults must be used within a SearchProvider');
    }

    const { selectedResults, queryTime, totalPages, allResultsCount, currentPage } = ctx;

    if (selectedResults.length === 0) {
        return null;
    }

    const capitalizeTitle = (title: string): string => {
        return title.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const calculateDisplayedResultsCount = () => {
        const end = currentPage * 10;
        const displayedResults = end > allResultsCount ? allResultsCount : end;
        return ` ${displayedResults} of ${allResultsCount} `;
    };
    const defaultImageUrl = '../../assets/placeholder.png';

    return (
        <div className="search-results-container">
            <p className="search-metadata">
                Showing<strong>{calculateDisplayedResultsCount()}</strong> result(s). Found in{' '}
                <strong>{queryTime}ms</strong>
            </p>
            <ul className="results-list">
                {selectedResults.map((item) => (
                    <li key={item.id} className="result-item">
                        <div className="result-header">
                            <div className="result-image">
                                <img
                                    src={item.imageUrl || defaultImageUrl}
                                    alt={item.title}
                                />
                            </div>
                            <div className="result-info">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="result-title"
                                >
                                    {capitalizeTitle(item.title)}
                                </a>
                                <p className="result-url">{item.url}</p>
                            </div>
                        </div>
                        <div className="result-description-container">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="result-description-container-title"
                            >
                                {capitalizeTitle(item.title)}
                            </a>
                            <p>{item.description}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {totalPages > 1 && <Pagination />}
        </div>
    );
};

export default memo(SearchResults);
