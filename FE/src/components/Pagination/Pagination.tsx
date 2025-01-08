import React, { FC, useContext, useCallback } from 'react';
import { SearchContext } from '../SearchProvider/SearchProvider';
import './styles.css';

const Pagination: FC = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) {
        throw new Error('Pagination must be used within a SearchProvider');
    }

    const { currentPage, totalPages, setPage } = ctx;

    const handlePrev = useCallback(() => {
        if (currentPage > 1) {
            setPage(currentPage - 1);
        }
    }, [currentPage, setPage]);

    const handleNext = useCallback(() => {
        if (currentPage < totalPages) {
            setPage(currentPage + 1);
        }
    }, [currentPage, totalPages, setPage]);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="pagination-container">
            <button onClick={handlePrev} disabled={currentPage <= 1}>
                Prev
            </button>

            {pages.map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={pageNum === currentPage ? 'active-page' : ''}
                >
                    {pageNum}
                </button>
            ))}

            <button onClick={handleNext} disabled={currentPage >= totalPages}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
