import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/Pagination/Pagination';
import { SearchContext } from '../components/SearchProvider/SearchProvider';

describe('Pagination', () => {
    const mockContextValue = {
        currentPage: 2,
        totalPages: 5,
        setPage: jest.fn()
    };

    function renderWithContext() {
        return render(
            <SearchContext.Provider value={mockContextValue as any}>
                <Pagination />
            </SearchContext.Provider>
        );
    }

    it('renders Prev, Next, and page buttons', () => {
        renderWithContext();
        expect(screen.getByText('Prev')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('calls setPage when clicking a page button', () => {
        renderWithContext();
        fireEvent.click(screen.getByText('3'));
        expect(mockContextValue.setPage).toHaveBeenCalledWith(3);
    });
});
